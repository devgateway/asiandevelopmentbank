# -*- coding: utf-8 -*-

"""
project_detail.py
@author: Thad Kerosky
Converts IATI json files to JSON documents, with one document per project and projects listed with geo-locations.
"""

from __future__ import print_function
import json
import itertools
import os
import glob

def go(subpath=None):
    client_glob = ""
    if not subpath:
        client_glob = os.path.join("client", "json", "countries", "*.json")
        client_out = os.path.join("client", "json", "countries", "projects")
    else:
        client_glob = os.path.join(subpath, "json", "countries", "*.json")
        client_out = os.path.join(subpath, "json", "projects")

    count = 0
    print("Start project-detail task:")
    for countryfilejson in glob.glob(client_glob):
        d = dict()
        with open(countryfilejson) as f:
            d = json.load(f)

        #Grab FeatureCollection header to replace.
        n = dict()
        n[u'id'] = d[u'id']
        n[u'properties'] = d[u'properties']
        n[u'type'] = d[u'type']

        print(countryfilejson, n[u'properties'][u'name'])
        for projectid, b in itertools.groupby(d[u'features'], lambda x: x[u'properties'][u'id']):
            projectfilename = client_out + projectid +'.json'
            n[u'features'] = list(b)
            count += 1
            with open(projectfilename, 'w') as out:
                json.dump(n, out, indent=2, sort_keys=True)
                print(count, " Wrote: ", projectid, len(n[u'features']))
