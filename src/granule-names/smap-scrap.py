import json

with open('smap.json', 'r') as f:
    data = json.load(f)

print(json.dumps(data[0][0], indent=2))
# absolute_orbits = [int(entry['absoluteOrbit']) for entry in data[0]]
# print(max(absolute_orbits), min(absolute_orbits))
# names = [entry['granuleName'] for entry in data[0]]
# print(len(set(names)))
