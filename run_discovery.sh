#!/bin/bash
CITIES=(
    "Bali, Indonesia"
    "Chiang Mai, Thailand"
    "Medellin, Colombia"
    "Lisbon, Portugal"
    "Mexico City, Mexico"
    "Cape Town, South Africa"
    "Bansko, Bulgaria"
    "Tenerife, Spain"
    "Da Nang, Vietnam"
    "Playa del Carmen, Mexico"
    "Buenos Aires, Argentina"
    "Ericeira, Portugal"
    "Koh Phangan, Thailand"
    "Tulum, Mexico"
    "Las Palmas, Spain"
)

for city in "${CITIES[@]}"; do
    echo "Running discovery for $city..."
    python3 scripts/gmaps-discover.py --city "$city" --category "coliving"
    python3 scripts/gmaps-discover.py --city "$city" --category "hostel"
done
