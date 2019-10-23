import json
import urllib.parse as urlparse


def main():
    with open('query.json', 'r') as f:
        query = json.load(f)

    rows = query['reports'][0]['data']['rows']

    urls = [
        row['dimensions'][0] for row in rows
    ]

    polygons = [
        query_param_from(url, 'intersectsWith') for url in urls
    ]

    p = [ p for p in polygons if p != [] ]

    print(len(p), len(polygons))


def query_param_from(url, param):
    parsed = urlparse.urlparse(url)
    try:
        qs = urlparse.parse_qs(parsed.query)
        if 'COUNT' in qs['output'][0]:
            return []

        val = qs[param]
    except Exception:
        return []

    dataset = qs.get('platform')
    if dataset is None:
        dataset = qs.get('asfplatform')

    if dataset is not None:
        dataset = dataset[0]
    else:
        dataset = 'None'

    ts = []
    for types in val:
        for t in types.split(','):
            ts.append(dataset + ':' + t)

    return ts


if __name__ == "__main__":
    main()
