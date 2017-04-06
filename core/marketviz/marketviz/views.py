import json

from rest_framework.decorators import api_view
from rest_framework.response import Response
from tradeking import get_list, get_quote

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
        response = get_quote(request.GET["symbol"])
        data = response
    return Response(data)