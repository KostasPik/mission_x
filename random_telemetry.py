"""
    Scripts for generating random telemetry for MISSION_X telemetry panel.
    1) Script sends the mission configuration and receives response with 201 status code.
    2) Scripts starts sending the telemetry logs.
"""
import random
import time
import urllib.request
import json
import string

headers = {'Content-Type': 'application/json'}



#   URL where mission configuration is registered
MISSION_CONF_URL = 'http://localhost:8000/api/missions/register'

#   URL where mission telemetry logs are sent
TELEMETRY_URL = 'http://localhost:8000/api/telemetry/add-log'


#   Used for generating random missionID
def generate_random_string(length):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

#   Random mission configuration generated
MISSION_ID = generate_random_string(7).upper()
MISSION_CONFIG = {
    'missionID': MISSION_ID,
    'status': 'active',
    'metricsConfiguration': {
        'speed': {
            'representation': 'line',
            'units': 'm/s'
        },
        'altitude': {
            'representation': 'line',
            'units': 'm'
        },
        'battery_remaining': {
            'representation': 'line',
            'units': '%'
        },
        'latitude': {
            'representation': 'number',
            'units': '',
        },
        'longitude': {
            'representation': 'number',
            'units': '',
        },
    }
}

#   Sending mission configuration 
json_data = json.dumps(MISSION_CONFIG).encode('utf-8')
try:
    # Make the request
    req = urllib.request.Request(MISSION_CONF_URL, data=json_data, headers=headers, method='POST')
    with urllib.request.urlopen(req) as response:
        # Read the response
        response_data = response.read().decode('utf-8')
        print(response_data)
except urllib.error.URLError as e:
    print("Error:", e)

print("Starting to send random telemetry logs...")
time.sleep(2)


#   Sending random telemetry logs
athens_coordinates = (37.9838, 23.7275)
battery_left = 100
while 1:
    time.sleep(0.5) # It is advisable to send 1-2 logs per second...
    timestamp = int(time.time() * 1000) # Note: this doesnt have ms accuracy. Use somethings more accurate than time.time()!
    speed = int(random.uniform(30.1, 39.8) * 1000) / 1000 # We keep 3 floating-points digits.
    altitude = int(random.uniform(1000.5, 1050.9) * 1000) / 1000 # We keep 3 floating-points digits.
    battery_left = int(random.uniform(battery_left-0.1, battery_left) * 1000) / 1000 # We keep 3 floating-points digits.
    lat_offset = random.uniform(-1.5, 1.5)
    lon_offset = random.uniform(-1.5, 1.5)
    gps_coordinates = (athens_coordinates[0] + lat_offset, athens_coordinates[1] + lon_offset)
    data = {
        'missionID': MISSION_ID,
        'timestamp': timestamp,
        'metrics': {
            'speed': speed,
            'altitude': altitude,
            'battery_remaining': battery_left,
            'latitude': int(gps_coordinates[0] * 1000)/1000, # We keep 3 floating-points digits.
            'longitude': int(gps_coordinates[1] * 1000)/1000, # We keep 3 floating-points digits.
        }
    }

    json_data = json.dumps(data).encode('utf-8')
    try:
        # Make the request
        req = urllib.request.Request(TELEMETRY_URL, data=json_data, headers=headers, method='POST')
        with urllib.request.urlopen(req) as response:
            # Read the response
            response_data = response.read().decode('utf-8')
            print(response_data)
    except urllib.error.URLError as e:
        print("Error:", e)
