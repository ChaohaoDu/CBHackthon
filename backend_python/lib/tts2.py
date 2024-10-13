from pathlib import Path
from openai import OpenAI
from pydub import AudioSegment

# Initialize OpenAI client
# client = OpenAI(api_key=my_key)

from dotenv import load_dotenv

load_dotenv()

client = OpenAI()

# Define paths for the output files
jane_speech_file_path = "./jane_speech.mp3"
alex_speech_file_path = "./alex_speech.mp3"

# Create the first part of the dialogue from Jane (Host)
jane_response = client.audio.speech.create(
    model="tts-1",
    voice="alloy",
    input="Hey everyone, welcome back! Today, we dive into the incredible world of gymnastics.",
    speed=1. # Increase the speech speed
)

# Save the generated Jane speech response to a file
with open(jane_speech_file_path, 'wb') as f:
    f.write(jane_response.content)

# Create the response from Jane
jane_response_2 = client.audio.speech.create(
    model="tts-1",
    voice="alloy",
    input="Ever wonder what goes into those jaw-dropping moves? It’s all about difficulty and execution.",
    speed=1. # Increase the speech speed
)

jane_speech_file_path_2 = "./jane_speech_2.mp3"
with open(jane_speech_file_path_2, 'wb') as f:
    f.write(jane_response_2.content)

# Create the response from Alex (Gymnastics Expert)
alex_response = client.audio.speech.create(
    model="tts-1",
    voice="onyx",
    input="Exactly, Jane! Each move has a 'degree of difficulty,' a score that shows risk.",
    speed=1. # Increase the speech speed
)

alex_speech_file_path = "./alex_speech.mp3"
with open(alex_speech_file_path, 'wb') as f:
    f.write(alex_response.content) 

# Create the next part of the dialogue from Jane
jane_response_3 = client.audio.speech.create(
    model="tts-1",
    voice="alloy",
    input="So, harder moves mean more points, right? But, there's a catch, I bet?",
    speed=1. # Increase the speech speed
)

jane_speech_file_path_3 = "./jane_speech_3.mp3"
with open(jane_speech_file_path_3, 'wb') as f:
    f.write(jane_response_3.content)

# Create the response from Alex
alex_response_2 = client.audio.speech.create(
    model="tts-1",
    voice="onyx",
    input="You got it. High difficulty means big points but also higher chances of mistakes.",
    speed=1. # Increase the speech speed
)

alex_speech_file_path_2 = "./alex_speech_2.mp3"
with open(alex_speech_file_path_2, 'wb') as f:
    f.write(alex_response_2.content)

# Continue the conversation
jane_response_4 = client.audio.speech.create(
    model="tts-1",
    voice="alloy",
    input="Like that triple-twisting vault—tougher than a double, but risky if it's not perfect.",
    speed=1. # Increase the speech speed
)

jane_speech_file_path_4 = "./jane_speech_4.mp3"
with open(jane_speech_file_path_4, 'wb') as f:
    f.write(jane_response_4.content)

alex_response_3 = client.audio.speech.create(
    model="tts-1",
    voice="onyx",
    input="Totally! Judges look at difficulty, but also execution—how clean each move is.",
    speed=1. # Increase the speech speed
)

alex_speech_file_path_3 = "./alex_speech_3.mp3"
with open(alex_speech_file_path_3, 'wb') as f:
    f.write(alex_response_3.content)

jane_response_5 = client.audio.speech.create(
    model="tts-1",
    voice="alloy",
    input="So, it’s not just about being daring but doing it with style right?",
    speed=1. # Increase the speech speed
)

jane_speech_file_path_5 = "./jane_speech_5.mp3"
with open(jane_speech_file_path_5, 'wb') as f:
    f.write(jane_response_5.content)

alex_response_4 = client.audio.speech.create(
    model="tts-1",
    voice="onyx",
    input="Yes, it's about balance—ambitious skills, but staying in control. The best are daring and precise.",
    speed=1. # Increase the speech speed
)

alex_speech_file_path_4 = "./alex_speech_4.mp3"
with open(alex_speech_file_path_4, 'wb') as f:
    f.write(alex_response_4.content)

jane_response_6 = client.audio.speech.create(
    model="tts-1",
    voice="alloy",
    input="That's what makes it thrilling—those perfect, graceful moments under pressure.",
    speed=1. # Increase the speech speed
)

jane_speech_file_path_6 = "./jane_speech_6.mp3"
with open(jane_speech_file_path_6, 'wb') as f:
    f.write(jane_response_6.content)

alex_response_5 = client.audio.speech.create(
    model="tts-1",
    voice="onyx",
    input="Exactly! When artistry meets flawless execution, it's pure magic.",
    speed=1. # Increase the speech speed
)

alex_speech_file_path_5 = "./alex_speech_5.mp3"
with open(alex_speech_file_path_5, 'wb') as f:
    f.write(alex_response_5.content)

jane_response_7 = client.audio.speech.create(
    model="tts-1",
    voice="alloy",
    input="Amazing. So next time you watch, remember—it's about daring and grace. Thanks, Alex!",
    speed=1. # Increase the speech speed
)

jane_speech_file_path_7 = "./jane_speech_7.mp3"
with open(jane_speech_file_path_7, 'wb') as f:
    f.write(jane_response_7.content)

# Merge all the audio files into one
final_output_path = "./final_dialogue.mp3"

# Load the audio segments using pydub
jane_speech_1 = AudioSegment.from_file(jane_speech_file_path, format="mp3")
jane_speech_2 = AudioSegment.from_file(jane_speech_file_path_2, format="mp3")
alex_speech_1 = AudioSegment.from_file(alex_speech_file_path, format="mp3")
jane_speech_3 = AudioSegment.from_file(jane_speech_file_path_3, format="mp3")
alex_speech_2 = AudioSegment.from_file(alex_speech_file_path_2, format="mp3")
jane_speech_4 = AudioSegment.from_file(jane_speech_file_path_4, format="mp3")
alex_speech_3 = AudioSegment.from_file(alex_speech_file_path_3, format="mp3")
jane_speech_5 = AudioSegment.from_file(jane_speech_file_path_5, format="mp3")
alex_speech_4 = AudioSegment.from_file(alex_speech_file_path_4, format="mp3")
jane_speech_6 = AudioSegment.from_file(jane_speech_file_path_6, format="mp3")
alex_speech_5 = AudioSegment.from_file(alex_speech_file_path_5, format="mp3")
jane_speech_7 = AudioSegment.from_file(jane_speech_file_path_7, format="mp3")

# Concatenate the audio segments in the proper order
final_audio = (jane_speech_1 + jane_speech_2 + alex_speech_1 +
jane_speech_3 + alex_speech_2 + jane_speech_4 +
alex_speech_3 + jane_speech_5 + alex_speech_4 + jane_speech_6 +
alex_speech_5 + jane_speech_7)

# Export the merged audio file
final_audio.export(final_output_path, format="mp3")


