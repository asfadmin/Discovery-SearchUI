from datetime import datetime

import requests
import pytz
from ics import Calendar
from flask import Flask, jsonify

app = Flask(__name__)


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response


@app.route('/calendar/<deployment>')
def banners(deployment):
    calendar = calendar_url(deployment)
    c = Calendar(requests.get(calendar).text)

    tz = pytz.timezone('US/Alaska')
    current = tz.localize(datetime.now())

    banners = [
        {'name': e.name} for e in c.events if is_current_banner(e, current, tz)
    ]

    return jsonify(banners)


def is_current_banner(event, current, tz):
    start, end = [
        tz.localize(load_date_from_str(str(d)))
        for d in [event.begin, event.end]
    ]

    return current >= start and current <= end


def load_date_from_str(date_str):
    # 2019-11-06T18:30:00+00:00

    return datetime.strptime(date_str.split('+')[0], '%Y-%m-%dT%H:%M:%S')


def calendar_url(deployment):
    if 'test' in deployment:
        return 'https://calendar.google.com/calendar/ical/alaska.edu_bl352sdorvboe8mmglnivrd8go%40group.calendar.google.com/public/basic.ics'
    else:
        return 'https://calendar.google.com/calendar/ical/alaska.edu_mhaq7n1h4ljoonprpbvgct8rv0%40group.calendar.google.com/public/basic.ics'


if __name__ == "__main__":
    app.run(debug=True)
