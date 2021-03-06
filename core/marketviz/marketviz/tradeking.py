import datetime
import re
import requests

from datetime import datetime, time, timedelta
from requests_oauthlib import OAuth1
from settings import CONSUMER_KEY, CONSUMER_SECRET, OAUTH_TOKEN, OAUTH_TOKEN_SECRET
from timezone import EasternTimeZone

AUTH = OAuth1(CONSUMER_KEY, CONSUMER_SECRET,
              OAUTH_TOKEN, OAUTH_TOKEN_SECRET)
API_URL = "https://api.tradeking.com/v1/"

def check_market_open():
    dt = datetime.now(EasternTimeZone())
    # Market closed
    if dt.weekday <= 4 and dt.time() < time(hour=9, minute=30) and dt.time() > time(hour=16):
        # Double check in case of holidays
        if get_market_clock()['status']['current'] == 'open':
            return True
    return False

def get_last_market_day():
    dt = datetime.now(EasternTimeZone())
    if dt.weekday() > 0 and dt.weekday() < 6:
        return dt.date() - timedelta(days=1)
    elif dt.weekday() == 0:
        return dt.date() - timedelta(days=3)
    else:
        return dt.date() - timedelta(days=2)

def make_request(url_suffix, payload=None, method="GET", format="json"):
    if format == "json":
        url_suffix += ".json"
    response = getattr(requests, method.lower())(API_URL + url_suffix,
                                                 params=payload if method == "GET" else None,
                                                 data=payload if method in ["PUT", "POST"] else None,
                                                 auth=AUTH)
    if format == "json":
        return response.json()["response"]
    return response

# https://developers.tradeking.com/documentation/market-ext-quotes-get-post
def get_quote(symbol):
    quote_fields = {
        'chg': 'change',
        'chg_sign': 'change_sign',
        'cl': 'previous_close',
        'datetime': 'datetime',
        'dollar_value': 'dollars_traded',
        'eps': 'earnings_per_share',
        'exch': 'exchange',
        'exch_desc': 'exchange_desc',
        'hi': 'high',
        'iad': 'annual_dividend',
        'incr_vl': 'last_trade_volume',
        'last': 'last_trade_price',
        'lo': 'low',
        'name': 'name',
        'opn': 'open',
        'pchg': 'percent_change',
        'pchg_sign': 'percent_change_sign',
        'pcls': 'prior_day_close',
        'pe': 'price_earnings',
        'phi': 'prior_day_high',
        'plo': 'prior_day_low',
        'popn': 'prior_day_open',
        'prchg': 'prior_day_change',
        'pvol': 'prior_day_volume',
        'secclass': 'secclass',
        'sesn': 'trade_session',
        'sho': 'shares_outstanding',
        'symbol': 'symbol',
        'tcond': 'trade_condition',
        'timestamp': 'timestamp',
        'tr_num': 'number_trades',
        'tradetick': 'prior_trade_sign',
        'trend': 'trend',
        'vl': 'volume',
        'volatility12': 'volatility',
        'vwap': 'volume_weighted_average_price',
        'wk52hi': '52wk_high',
        'wk52hidate': '52wk_high_date',
        'wk52lo': '52wk_low',
        'wk52lodate': '52wk_low_date',
        'yield': 'dividend_yield'
        }
    url = "market/ext/quotes"
    response = make_request(url, {"symbols": symbol, "fids": ','.join(quote_fields.keys())})
    quote = response['quotes']['quote']
    if quote['last'] == '0' and quote['name'].lower() == 'na' and quote['exch'] == 'na':
        return {}

    # translate quote fields
    for key, value in quote_fields.items():
        quote[value] = quote.pop(key)
        if value == "volume":
            quote[value] = "{:,}".format(int(quote[value]))
        # Whole regex match
        elif len(re.findall(r'[-\d]+\.\d+', quote[value])) == 1 and len(re.findall(r'[-\d]+\.\d+', quote[value])[0]) == len(quote[value]):
            quote[value] = "{:,.2f}".format(float(quote[value]))

    return quote


# https://developers.tradeking.com/documentation/market-toplists-get
def get_list(list):
    if not check_market_open():
        return []

    url = "market/toplists/" + list
    response = make_request(url)
    quotes = response['quotes']['quote']
    for quote in quotes:
        quote["change"] = quote.pop("chg")
        direction = "u" if float(quote["change"]) > 0 else "d"
        direction = "e" if float(quote["change"]) == 0 else direction
        quote["chg_sign"] = direction
        quote["price"] = "{:.2f}".format(float(quote.pop("last")))
        quote["percent_change"] = quote.pop("pchg")
        if direction == "d":
            quote["percent_change"] = "{:.2f}".format(-1 * float(quote["percent_change"]))
        quote["prior_close"] = quote.pop("pcls")
        quote["volume"] = quote.pop("vl")
    return quotes

# https://developers.tradeking.com/documentation/market-clock-get
def get_market_clock():
    url = "market/clock"
    response = make_request(url)
    return response

# https://developers.tradeking.com/documentation/market-timesales-get
def get_timesales(symbol, start=None, end=None):
    start = start if start else str(datetime.now(EasternTimeZone()).today())
    end = end if end else str(datetime.now(EasternTimeZone()).today())
    if not check_market_open():
        last_open = get_last_market_day()
        start = str(last_open)
        end = str(last_open)

    url = "market/timesales"
    request_data = {
        "symbols": symbol,
        "startdate": start,
        "enddate": end
    }
    response = make_request(url, request_data)
    sales = response['quotes']['quote']
    for sale in sales:
        for key in sale:
            if key != "date" and len(re.findall(r'[-\d]+\.\d+', sale[key])) == 1 and len(re.findall(r'[-\d]+\.\d+', sale[key])[0]) == len(sale[key]):
                sale[key] = "{:,.2f}".format(float(sale[key]))

    return sales
