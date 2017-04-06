import requests

from requests_oauthlib import OAuth1
from settings import CONSUMER_KEY, CONSUMER_SECRET, OAUTH_TOKEN, OAUTH_TOKEN_SECRET

AUTH = OAuth1(CONSUMER_KEY, CONSUMER_SECRET,
              OAUTH_TOKEN, OAUTH_TOKEN_SECRET)
API_URL = "https://api.tradeking.com/v1/"

def make_request(url_suffix, payload, method="GET", format="json"):
    if format == "json":
        url_suffix += ".json"
    response = getattr(requests, method.lower())(API_URL + url_suffix,
                                                 params=payload if method == "GET" else None,
                                                 data=payload if method in ["PUT", "POST"] else None,
                                                 auth=AUTH)
    return response

def get_quote(symbol, format="json"):
    url = "market/ext/quotes"
    response = make_request(url, {"symbols": symbol})
    return getattr(response, format)() if format == "json" else getattr(response, format)