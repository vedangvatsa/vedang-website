import json
import whisper

def create_ass_file(audio_path, output_ass_path):
    print("Loading Whisper...")
    model = whisper.load_model("base")
    print("Transcribing...")
    result = model.transcribe(audio_path, word_timestamps=True)
    
    ass_header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 1

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Hormozi,Arial,120,&H0000FFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,8,4,5,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    
    events = []
    
    def format_time(seconds):
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = int(seconds % 60)
        cs = int((seconds % 1) * 100)
        return f"{h}:{m:02d}:{s:02d}.{cs:02d}"

    for segment in result.get('segments', []):
        for word_info in segment.get('words', []):
            start = word_info['start']
            end = word_info['end']
            word = word_info['word'].strip().upper()
            
            # Simple "pop" animation using ASS override tags
            # {\t(0,50,\fscx120\fscy120)\t(50,150,\fscx100\fscy100)} makes it scale up then down
            text = f"{{\\t(0,50,\\fscx120\\fscy120)\\t(50,150,\\fscx100\\fscy100)}}{word}"
            
            event = f"Dialogue: 0,{format_time(start)},{format_time(end)},Hormozi,,0,0,0,,{text}"
            events.append(event)
            
    with open(output_ass_path, "w") as f:
        f.write(ass_header + "\n".join(events) + "\n")
    print(f"Saved {output_ass_path}")

create_ass_file("/Users/vedang/vedang-website/scripts/thread-assets/linkedin-rewrites/audio/agentic.mp3", "/Users/vedang/vedang-website/scripts/thread-assets/linkedin-rewrites/captions.ass")
