from datetime import datetime

import requests
import pytz
from ics import Calendar
from flask import Flask

app = Flask(__name__)

CALENDAR_URL = 'https://calendar.google.com/calendar/ical/alaska.edu_mhaq7n1h4ljoonprpbvgct8rv0%40group.calendar.google.com/public/basic.ics'


@app.route('/calendar')
def index():
    c = Calendar(requests.get(CALENDAR_URL).text)
    tz = pytz.timezone('US/Alaska')
    currentTime = datetime.now(tz)
    banners = []

    print('current', currentTime)
    print('YYYY-MM-DD[*HH[:MM[:SS[.fff[fff]]]][+HH:MM[:SS[.ffffff]]]]')
    for e in c.events:
        start = datetime.fromisoformat(str(e.begin))
        end = datetime.fromisoformat(str(e.end))
        print(start, end)

    return 'hello'


if __name__ == "__main__":
    app.run(debug=True)
