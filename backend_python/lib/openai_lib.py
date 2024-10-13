from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()


async def chat_completion(message: str) -> str:
    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": message}],
            model="gpt-3.5-turbo",
        )
        message_content = chat_completion.choices[0].message.content
        if not message_content:
            raise ValueError("Error with OpenAI response")

        return message_content.strip()

    except Exception as e:
        print(f"OpenAI API error: {e}")
    raise ValueError("Failed to get completion from OpenAI")


async def tts(voice: str, text: str) -> str:
    try:
        return await client.audio.speech.create(model="tts-1", voice=voice, input=text, speed=1.0)
    except Exception as e:
        print(f"OpenAI API error: {e}")
    raise ValueError("Failed to get TTS from OpenAI")