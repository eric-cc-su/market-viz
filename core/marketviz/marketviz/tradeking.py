import requests

from requests_oauthlib import OAuth1
from settings import CONSUMER_KEY, CONSUMER_SECRET, OAUTH_TOKEN, OAUTH_TOKEN_SECRET

AUTH = OAuth1(CONSUMER_KEY, CONSUMER_SECRET,
              OAUTH_TOKEN, OAUTH_TOKEN_SECRET)
API_URL = "https://api.tradeking.com/v1/"

def make_request(url_suffix, payload=None, method="GET", format="json"):
    if format == "json":
        url_suffix += ".json"
    response = getattr(requests, method.lower())(API_URL + url_suffix,
                                                 params=payload if method == "GET" else None,
                                                 data=payload if method in ["PUT", "POST"] else None,
                                                 auth=AUTH)
    return response

# https://developers.tradeking.com/documentation/market-ext-quotes-get-post
def get_quote(symbol):
    url = "market/ext/quotes"
    response = make_request(url, {"symbols": symbol})
    return response.json()["response"]['quotes']['quote']

# https://developers.tradeking.com/documentation/market-toplists-get
def get_list(list):
    url = "market/toplists/" + list
    response = make_request(url)
    quotes = response.json()["response"]['quotes']['quote']
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
