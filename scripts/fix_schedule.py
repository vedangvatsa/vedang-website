import json
import os
from datetime import datetime, timedelta

json_path = '/Users/vedang/vedang-website/scripts/linkedin-posts.json'
with open(json_path, 'r') as f:
    data = json.load(f)

# Find the 10 rewritten posts
start_idx = len(data) - 10

# Times: 01:00, 09:00, 17:00
times = ["01:00", "09:00", "17:00"]
start_date = datetime.strptime("2026-05-09", "%Y-%m-%d")

for i in range(10):
    day_offset = i // 3
    time_idx = i % 3
    
    sched_date = (start_date + timedelta(days=day_offset)).strftime("%Y-%m-%d")
    sched_time = times[time_idx]
    
    data[start_idx + i]['scheduleDate'] = sched_date
    data[start_idx + i]['scheduleTime'] = sched_time

with open(json_path, 'w') as f:
    json.dump(data, f, indent=2)

print("Fixed schedule")
