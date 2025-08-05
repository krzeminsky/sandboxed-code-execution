import os
import json
import urllib.request
import traceback
import sys

sys.path.append('/mnt')
os.chdir("/mnt")

try:
    from user_solution import solution

    result = solution()

    payload = json.dumps({
        "uuid": os.environ["UUID"],
        "content": { "success": True, "data": result }
    }).encode('utf-8')
except Exception as err:
    tb = traceback.extract_tb(sys.exc_info()[2])[-1]

    payload = json.dumps({
        "uuid": os.environ["UUID"],
        "content": { "success": False, "error": f"Error: {type(err).__name__}\nLine {tb.lineno}: {tb.line.strip()}" }
    }).encode('utf-8')

apiUrl = os.environ["API_URL"]

req = urllib.request.Request(apiUrl, data=payload, headers={"Content-Type": "application/json"}, method="POST")
urllib.request.urlopen(req)