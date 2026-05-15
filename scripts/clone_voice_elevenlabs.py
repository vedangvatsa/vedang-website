import os
import requests

# ==========================================
# ELEVENLABS CONFIGURATION
# ==========================================
# 1. Put your API key here (Get it from elevenlabs.io -> Profile -> Profile + API key)
ELEVENLABS_API_KEY = "sk_44da70268a7caa69ae736efd5b3eb229aab59317918abdaa"

# 2. Put your Voice ID here (Go to Voices -> VoiceLab -> Copy ID)
VOICE_ID = "YPNUtVRMOKi0Bj4dF949"
# ==========================================

text_to_speak = "Watch the amber bar. That's the pivot. Quicksort doesn't waste time comparing everything. It just sweeps left to right, throwing smaller numbers to one side, and larger numbers to the other. It splits the array, and repeats. Divide and conquer. That's how it achieves O(N log N) speed. Once a bar turns green, its final position is locked. This exact logic is what sorts massive databases instantly."

url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

headers = {
    "Accept": "audio/mpeg",
    "Content-Type": "application/json",
    "xi-api-key": ELEVENLABS_API_KEY
}

data = {
    "text": text_to_speak,
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
        "stability": 0.5,
        "similarity_boost": 0.75,
        "style": 0.0,
        "use_speaker_boost": True
    }
}

print("🎙️ Sending script to ElevenLabs API...")
response = requests.post(url, json=data, headers=headers)

if response.status_code == 200:
    output_path = "quicksort_audio.mp3"
    with open(output_path, "wb") as f:
        f.write(response.content)
    print(f"✅ Success! Your perfect, hyper-realistic voice clone is ready at: {output_path}")
else:
    print(f"❌ Error {response.status_code}: {response.text}")
