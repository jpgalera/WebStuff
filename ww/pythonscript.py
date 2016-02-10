from lxml import html
import requests

page = requests.get('https://www.google.ca/finance?hl=en&gl=ca#stockscreener')
tree = html.fromstring(page.content)
print(tree)