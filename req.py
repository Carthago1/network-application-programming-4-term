import requests
import json

def request():
    r = requests.get('http://api.coinlayer.com/live?access_key=8215bcff7394a74aee5dd98a0ab9a539&target=RUB')
    return r.json()

#r.json()["rates"]["BTC"], "RUB")

#def request():
#    '''Mock function to test bot'''
#    with open('data.txt', 'r') as file:
#        return json.load(file)
