import json

from rest_framework.decorators import api_view
from rest_framework.response import Response
from tradeking import check_market_open, get_list, get_quote, get_timesales

@api_view()
def index_data(request):
    data = {
       'top_gain' : get_list('toppctgainers'),
       'top_lose' : get_list('toppctlosers'),
       'top_active' : get_list('topactive')
    }
    return Response(data)

@api_view()
def quote_view(request):
    data = {}
    if "symbol" in request.GET:
        quote_data = get_quote(request.GET["symbol"])
        if quote_data:
            data = {
                "quote": quote_data,
                "timesales": get_timesales(request.GET["symbol"]),
                "market_open": check_market_open()
            }
        else:
            return Response("Stock with symbol '{}' does not exist".format(request.GET['symbol'].upper()), 400)

    return Response(data)