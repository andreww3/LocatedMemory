# Set credentials
import os
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "C:/Users/andwang/Documents/GitHub/LocatedMemory/freerecall/mol-fr-7a4d11f67adc.json"

# Imports the Google Cloud client library
from google.cloud import datastore

# json library
import json

# Instantiates a client
datastore_client = datastore.Client()

# make query
query = datastore_client.query(kind='DataObject')
results = list(query.fetch())
print(json.dumps(results, indent=4, sort_keys=True, default=str))

# system call: pass it to a text file
# python downloadall.py > mydata.txt
