import os
import fal_client
import urllib.request

# Insert your Fal API Key here
os.environ["FAL_KEY"] = "14fc7bd3-a020-4311-986d-bb1b3b81ee33:0726213a23b1f5b40b918318faaf2137"

def generate_avatar():
    print("🚀 Uploading audio and image to Fal.ai...")
    
    if not os.path.exists("/Users/vedang/Desktop/ved.jpeg"):
        print("❌ Error: ved.jpeg not found on Desktop!")
        return
        
    if not os.path.exists("quicksort_audio.mp3"):
        print("❌ Error: quicksort_audio.mp3 not found!")
        return

    # Upload local files to Fal's temporary CDN so the API can read them
    audio_url = fal_client.upload_file("quicksort_audio.mp3")
    image_url = fal_client.upload_file("/Users/vedang/Desktop/ved.jpeg")
    
    print("🎙️ Audio uploaded.")
    print("🖼️ Image uploaded.")
    print("⏳ Generating EchoMimic video... (this takes about 1-2 minutes)")

    # Trigger EchoMimic v2 on Fal
    result = fal_client.subscribe(
        "fal-ai/echomimic-v2",
        arguments={
            "audio_url": audio_url,
            "image_url": image_url
        },
        with_logs=True
    )

    print("\n✅ Video generated successfully!")
    video_url = result['video']['url']
    
    # Download the final video
    print("📥 Downloading final video to avatar_video.mp4...")
    urllib.request.urlretrieve(video_url, "avatar_video.mp4")
    print("🎉 Done! Open avatar_video.mp4")

if __name__ == "__main__":
    generate_avatar()
