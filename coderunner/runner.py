import os
import json
import urllib.request

import sys
sys.path.append('/mnt')

from user_solution import solution

result = solution()

payload = json.dumps({
    "uuid": os.environ["UUID"],
    "content": result
}).encode('utf-8')

apiUrl = os.environ["API_URL"]

req = urllib.request.Request(apiUrl, data=payload, headers={"Content-Type": "application/json"}, method="POST")
urllib.request.urlopen(req)