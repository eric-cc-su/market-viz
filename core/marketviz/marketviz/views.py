import json

from rest_framework.decorators import api_view
from rest_framework.response import Response
from tradeking import get_quote


@api_view()
def quote_view(request):
    data = {}
    if "symbol" in request.GET:
        response = get_quote(request.GET["symbol"])
        data = response["response"]["quotes"]["quote"]
    return Response(data)