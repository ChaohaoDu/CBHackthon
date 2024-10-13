import asyncio
import re
import os
from langgraph_sdk import get_client
from langchain_core.messages import HumanMessage
from rich.jupyter import print
from dotenv import load_dotenv
from fastapi import HTTPException
import logging

load_dotenv()

client = get_client()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MAX_RETRIES = 8
RESET_DELAY = 10

api_key = os.getenv('TWELVE_LABS_API_KEY')

env_path = os.path.join(os.getcwd(), '.env')
if os.path.exists(env_path):
    print(f".env file found at: {env_path}")
else:
    print(".env file not found in the current directory.")


async def get_jockey_assistant():
    try:
        assistants = await client.assistants.search(metadata={})
        if not assistants:
            raise HTTPException(status_code=404, detail="No assistants found.")
        return assistants[0]
    except Exception as e:
        raise RuntimeError(f"Failed to retrieve assistants: {str(e)}")


async def create_thread():
    try:
        return await client.threads.create(metadata={})
    except Exception as e:
        raise RuntimeError(f"Failed to create thread: {str(e)}")


async def stream_run(thread_id, assistant_id, jockey_input):
    try:
        output_events = []
        async for event in client.runs.stream(
                thread_id, assistant_id, input=jockey_input, stream_mode="values",
                config={}, metadata={}, interrupt_after=[], interrupt_before=[]):
            print(event)
            output_events.append(event)
        return output_events
    except Exception as e:
        raise RuntimeError(f"Streaming run failed: {str(e)}")


def extract_url(content):
    pattern = r'\((https:\/\/[\s\S]*?)\)'
    print("Extracting URLs...")

    raw_urls = re.findall(pattern, content)
    cleaned_urls = [''.join(url.split()) for url in raw_urls]
    return cleaned_urls


def extract_video_title_tags(content):
    pattern = r'\d+\.\s+\*\*Title\*\*:\s*(.*?)\n\s+- \*\*Tags\*\*:\s*(.*?)\n'

    matches = re.findall(pattern, content)
    titles, all_tags = [], []

    for match in matches:
        title = match[0].strip()
        tags = match[1].strip()
        titles.append(title)
        all_tags.append(tags)

    print(titles)
    print(all_tags)
    return titles, all_tags


async def get_sample_pics(user_input):
    try:
        jockey = await get_jockey_assistant()
        thread = await create_thread()

        index_input = "Using index 66f1b1c8163dbc55ba3bb1b6."
        story_board_input = "Please search for 3 clips, and return the title, a few tags and a thumbnail for each clip. No need to generate the video."

        chat_history = [
            HumanMessage(content=index_input + user_input + story_board_input, name="user")
        ]
        jockey_input = {
            "chat_history": chat_history,
            "made_plan": False,
            "next_worker": None,
            "active_plan": None,
        }

        retry_count = 0
        output_events = []

        chat_history = [HumanMessage(content=index_input + user_input + story_board_input, name="user")]
        jockey_input = {
            "chat_history": chat_history,
            "made_plan": False,
            "next_worker": None,
            "active_plan": None,
        }

        # Continue to retry until reaching MAX_RETRIES, or message is not None
        assistant_message = None
        while retry_count < MAX_RETRIES and assistant_message is None:
            logger.info(f"Attempt {retry_count+1} of {MAX_RETRIES}")
            output_events = []
            # Start the streaming run
            async for event in client.runs.stream(
                thread["thread_id"], 
                jockey["assistant_id"], 
                input=jockey_input, 
                stream_mode="values"
            ):
                # Check if the event contains the assistant's message
                if event.event == 'values':
                    data = event.data
                    chat_history = data.get('chat_history', [])
                    logger.debug(f"Received chat_history: {chat_history}")
                    for message in reversed(chat_history):
                        if message.get('type') == 'ai':
                            assistant_message = message.get('content', '')
                            break  # Exit the inner loop

                    if assistant_message:

                        # Processing the Assistant message
                        print("Assistant's last message:")
                        print(assistant_message)

                        titles, tags = extract_video_title_tags(assistant_message)
                        urls = extract_url(assistant_message)
                        for tag in tags:
                            print(tag)

                        samples = [
                            {"imageUrl": url, "tags": tag.split(','), "title": title}
                            for title, tag, url in zip(titles, tags, urls)
                        ]
                        return samples
                    # else:
                    #     raise HTTPException(status_code=404, detail="No assistant message found.")

                else:
                    # Handle other types of events if necessary
                    pass
            if assistant_message is None:
                print("No message found. Retrying...")
                retry_count += 1
                if retry_count < MAX_RETRIES:
                    await asyncio.sleep(1)  # Optional delay before retrying
                else:
                    print("Maximum retries reached. Exiting.")

        """"
        End
        """

        if not output_events:
            raise RuntimeError("No output events received.")

    except Exception as e:
        raise RuntimeError(f"Error in get_sample_pics: {str(e)}")



async def get_video(user_input):
    try:
        jockey = await get_jockey_assistant()
        thread = await create_thread()

        index_input = "Using index 66f1b1c8163dbc55ba3bb1b6."
        video_input = "After you find 3 clips, let's edit them together into one video. Don't generate text summaries."
        # story_board_input = "Please search for 3 clips, and return the title, a few tags and a thumbnail for each clip. No need to generate the video."

        chat_history = [
            HumanMessage(content=index_input + user_input + video_input, name="user")
        ]
        jockey_input = {
            "chat_history": chat_history,
            "made_plan": False,
            "next_worker": None,
            "active_plan": None,
        }

        retry_count = 0
        success = False
        output_events = []

        while not success and retry_count < MAX_RETRIES:
            try:
                output_events = await stream_run(
                    thread["thread_id"], jockey["assistant_id"], jockey_input
                )
                success = True
            except Exception as e:
                print(f"Error during streaming: {e}")
                retry_count += 1
                if retry_count < MAX_RETRIES:
                    print(f"Retrying... ({retry_count}/{MAX_RETRIES})")
                    await asyncio.sleep(RESET_DELAY)
                else:
                    raise RuntimeError("Max retries exceeded. Exiting...")

        if not output_events:
            raise RuntimeError("No output events received.")

        data = output_events[-1].data
        chat_history = data.get('chat_history', [])
        assistant_message = next(
            (msg.get('content', '') for msg in reversed(chat_history) if msg.get('type') == 'ai'),
            None
        )

        if assistant_message:
            print("Assistant's last message:")
            print(assistant_message)
            titles, tags = extract_video_title_tags(assistant_message)
            urls = extract_url(assistant_message)
            for tag in tags:
                print(tag)

            samples = [
                {"imageUrl": url, "tags": tag.split(','), "title": title}
                for title, tag, url in zip(titles, tags, urls)
            ]
            return samples
        else:
            raise HTTPException(status_code=404, detail="No assistant message found.")

    except Exception as e:
        raise RuntimeError(f"Error in get_sample_pics: {str(e)}")
