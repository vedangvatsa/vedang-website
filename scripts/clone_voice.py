import os
os.environ["COQUI_TOS_AGREED"] = "1"
import torch

# Monkey patch torch.load to fix PyTorch 2.6+ security changes breaking Coqui TTS
_original_load = torch.load
def _patched_load(*args, **kwargs):
    kwargs['weights_only'] = False
    return _original_load(*args, **kwargs)
torch.load = _patched_load

from TTS.api import TTS

print("====== Vedang's Local Voice Cloning Engine ======")

# Path to the voice sample. Change this to your actual voice recording!
VOICE_SAMPLE_PATH = "vedang_voice.wav"

if not os.path.exists(VOICE_SAMPLE_PATH):
    print(f"❌ Error: I couldn't find '{VOICE_SAMPLE_PATH}'.")
    print("Please record a 6-10 second clip of your voice and save it in this folder as 'my_voice.wav'.")
    exit(1)

# 1. Load the open-source XTTSv2 model
print("Loading the XTTSv2 model (This may download ~2GB the very first time)...")
# Check if MPS (Mac Silicon GPU) is available, otherwise use CPU
device = "mps" if torch.backends.mps.is_available() else "cpu"
tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)

# 2. Define the text you want your clone to say
text_to_speak = "This is Gradient Descent, the math behind AI training. The curve is our error, and we want the lowest point."

# 3. Generate the cloned audio
output_path = "output_cloned_voice.wav"
print(f"🎙️ Cloning voice from {VOICE_SAMPLE_PATH}...")
tts.tts_to_file(
    text=text_to_speak,
    speaker_wav=VOICE_SAMPLE_PATH,
    language="en",
    file_path=output_path
)

print(f"✅ Success! Your cloned audio is ready at: {output_path}")
