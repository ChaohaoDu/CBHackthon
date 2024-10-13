from pathlib import Path
import openai
from pydub import AudioSegment
import json
from dotenv import load_dotenv


load_dotenv()
client = openai.OpenAI()

# def generate_conversation_json(script_content):
#     prompt = (
#     "You are a world-class podcast producer tasked with transforming the
#     provided input text into an engaging "
#     "and informative podcast script in JSON format. Create a conversation
#     between two characters, including their "
#     "names and corresponding lines, ensuring a natural flow, appropriate
#     questions, and a balance of information "
#     "and entertainment. The JSON output should contain character names,
#     voice types, and dialogue text, making it "
#     "ready for audio synthesis."
#     )
#     # Generate JSON conversation using OpenAI
#     response = client.completions.create(
#     model="v1/chat/completions",
#     prompt=prompt + "\n\nInput:\n" + script_content + "\n\nOutput in JSON format:",
#     max_tokens=1000,
#     temperature=0.7
#     )
#     # Parse and return the generated JSON
#     return json.loads(response.choices[0].text)

# Function to generate conversation content in JSON based on input script content
# def generate_conversation_json(script_content):
#     prompt = (
#     """
#     "You are a world-class podcast producer tasked with transforming the
#     provided input text into an engaging "
#     "and informative podcast script in JSON format. Create a conversation
#     between two characters, including their "
#     "names and corresponding lines, ensuring a natural flow, appropriate
#     questions, and a balance of information "
#     "and entertainment. The JSON output should contain character names,
#     voice types, and dialogue text, making it "
#     "ready for audio synthesis. Make it 2 minutes long."
#     """
#     )

#     try:
#         chat_completion = client.chat.completions.create(
#             model="gpt-3.5-turbo",
#             messages=[
#                 {"role": "system", "content": prompt},
#                 {"role": "user", "content": script_content}
#             ],
#             max_tokens=1000,
#             temperature=0.7
#         )
#         message_content = chat_completion.choices[0].message.content
#         if not message_content:
#             raise ValueError("Error with OpenAI response")

#         return message_content.strip()

#     except Exception as e:
#         print(f"OpenAI API error: {e}")
#     raise ValueError("Failed to get completion from OpenAI")


    # # Generate JSON conversation using OpenAI
    # response = client.completions.create(
    #     model="v1/chat/completions",
        
    #     max_tokens=1000,
    #     temperature=0.7
    # )
    # # Parse and return the generated JSON
    # return json.loads(response.choices[0].text)

# Example script content
script_content = (
    """In the heart of the 2024 Summer Olympics, all eyes were on Armand
    'Mondo' Duplantis as he prepared for yet another leap into history. "
    "Mondo, a 24-year-old phenomenon, has spent his career defying the
    limits of human capability in pole vaulting. With unwavering focus,
    incredible athleticism, and a touch of fearlessness, "
    "he’s become a beacon of greatness in the world of athletics."""
)


# Function to generate conversation content in JSON based on input script content
def generate_conversation_json(script_content):
    prompt = ("""You are a world-class podcast producer tasked with transforming the
    provided input text into an engaging "
    "and informative podcast script in JSON format. Create a conversation
    between two characters, including their "
    "names and corresponding lines, ensuring a natural flow, appropriate
    questions, and a balance of information "
    "and entertainment. The JSON output should contain character names,
    voice types, and dialogue text, making it "
    "ready for audio synthesis."""
    )
    # Generate JSON conversation using OpenAI
    response = client.chat.completions.create(
        model="v1/chat/completions",
        prompt=prompt + "\n\nInput:\n" + script_content + "\n\nOutput in JSON format:",
        max_tokens=1000,
        temperature=0.7
    )
    # Parse and return the generated JSON
    return json.loads(response.choices[0].text)



def generate_audio_segments(script_content):
    # Generate conversation content in JSON based on the provided script
    conversation_data = generate_conversation_json(script_content)

    print(conversation_data)

    # Define paths for the output files
    output_dir = Path("./audio_segments")
    output_dir.mkdir(exist_ok=True)

    # Generate speech files based on JSON conversation content
    audio_segments = []

    for index, entry in enumerate(conversation_data["dialogue"], start=1):
        character = entry["character"]
        voice = entry["voice"]
        text = entry["text"]
        # Generate the audio using OpenAI's TTS
        response = client.audio.speech.create(
            model="tts-1",
            voice=voice,
            input=text,
            speed=1.0 # Normal speech speed
        )

        # Save the generated audio to a file
        audio_file_path = output_dir / f"{character.lower()}_speech_{index}.mp3"
        with open(audio_file_path, 'wb') as f:
            f.write(response.content)
        # Load the audio segment with pydub
        audio_segment = AudioSegment.from_file(audio_file_path, format="mp3")
        audio_segments.append(audio_segment)

    # Concatenate all the audio segments in order
    final_audio = sum(audio_segments)

    # Export the merged audio file
    final_output_path = "./final_dialogue.mp3"
    final_audio.export(final_output_path, format="mp3")

# Now you have a single merged audio file representing the entire dialogue.


# def generate_audio_segments(script_content):
    
#     # _audio_segments conversation content in JSON based on the provided script
#     conversation_data = generate_conversation_json(script_content)

#     print(conversation_data)

#     try:
#         conversation_data = json.loads(conversation_data)
#     except json.JSONDecodeError as e:
#         print(f"Invalid JSON: {e}")

#     print(f"Parsed JSON data: {conversation_data}")

#     # Define paths for the output files
#     output_dir = Path("./audio_segments")
#     output_dir.mkdir(exist_ok=True)

#     # Generate speech files based on JSON conversation content
#     audio_segments = []

#     for character in conversation_data["characters"]:
#         name = character.get("name")
#         voice = character.get("voice")
#         lines = character.get("lines", [])
    


#         # if not all([name, voice, lines]):
#         #     print(f"Missing data in character entry: {character}")
#         #     continue

#         for index, line in enumerate(lines, start=1):
#             text = line.strip()
#             try:
#                 print(f"Generating audio for {name} (Line {index})...")

#                 response = openai.Audio.speech.create(
#                     model="tts-1",
#                     voice=voice,
#                     input=text,
#                     speed=1.0  # Normal speech speed
#                 )
                
#                 # Check if the response contains audio data
#                 if not hasattr(response, 'content') or not response.content:
#                     print(f"No audio content returned for {name} in line {index}.")
#                     continue

#                 # Save the generated audio to a file
#                 audio_file_path = output_dir / f"{name.lower()}_speech_{index}.mp3"
#                 with open(audio_file_path, 'wb') as f:
#                     f.write(response.content)
#                 print(f"Audio saved to {audio_file_path}")

#                 # Load the audio segment with pydub
#                 audio_segment = AudioSegment.from_file(audio_file_path, format="mp3")
#                 audio_segments.append(audio_segment)
#                 print(f"Audio segment appended for {name} (Line {index})")

#             except Exception as e:
#                 print(f"Error generating audio for {name} in line {index}: {e}")
#                 continue

#     # # Concatenate all the audio segments in order
#     # final_audio = sum(audio_segments)

#     # # Export the merged audio file
#     # final_output_path = "./final_dialogue.mp3"
#     # final_audio.export(final_output_path, format="mp3")

#     # # Now you have a single merged audio file representing the entire dialogue.

#     if not audio_segments:
#         print("No audio segments were generated.")
#         return

#     # Concatenate all the audio segments in order
#     print("\nStarting audio concatenation...")
#     final_audio = audio_segments[0]
#     print(f"Added first audio segment: {output_dir / 'eva_speech_1.mp3'}")
    
#     for idx, segment in enumerate(audio_segments[1:], start=2):
#         final_audio += segment
#         print(f"Appended audio segment {idx}")
    
#     # Export the merged audio file
#     final_output_path = "./final_dialogue.mp3"
#     try:
#         final_audio.export(final_output_path, format="mp3")
#         print(f"\nFinal audio file created at {final_output_path}")
#     except Exception as e:
#         print(f"Error exporting final audio: {e}")

def main():
    generate_audio_segments(script_content)

if __name__ == "__main__":
    main()