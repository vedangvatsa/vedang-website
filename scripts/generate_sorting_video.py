import matplotlib.pyplot as plt
import matplotlib.animation as animation
import numpy as np
import os

# Set dark background for that tech aesthetic
plt.style.use('dark_background')

# --- Bubble Sort Generator ---
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            yield arr, j, j+1  # Yield current array and indices being compared
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                yield arr, j, j+1

N = 40
array = np.linspace(10, 100, N)
np.random.shuffle(array)
generator = bubble_sort(array)

fig, ax = plt.subplots(figsize=(8, 5))
ax.set_title("Bubble Sort Visualization", fontsize=18, color="cyan", pad=20)
ax.axis('off')  # Hide axes for a clean look

# Create initial bar chart
bars = ax.bar(range(len(array)), array, color="#00ffcc", edgecolor="black")

def update(frame_data):
    arr, idx1, idx2 = frame_data
    for rect, val in zip(bars, arr):
        rect.set_height(val)
        rect.set_color("#00ffcc")  # Reset to cyan
    
    # Highlight the ones being swapped/compared
    bars[idx1].set_color("#ff00ff") # Magenta
    bars[idx2].set_color("#ff00ff")
    return bars

anim = animation.FuncAnimation(
    fig, 
    update, 
    frames=generator, 
    interval=20, 
    repeat=False, 
    save_count=800
)

output_path = "/Users/vedang/.gemini/antigravity/brain/9e801190-e577-499f-9dba-6525f80853b3/generated_sort.mp4"
anim.save(output_path, writer='ffmpeg', fps=30)
print(f"Video saved to {output_path}")
