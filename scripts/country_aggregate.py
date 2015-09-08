"""
country_aggregate.py
@author: Anya Marshall
@dependencies: ne_ADB_asia_centroids_bbox.json, ne_worldcountry_centroid_bbox.geojson
Converts IATI xml files to a single JSON document containing information about all countries, commitments and projects.
Sample output:
{
    "countries": [
        {
            "id": "CN",
            "name": "China",
            "latlng": [38, 105],
            "totals": {
                "commitments": {
                    "amount": 11200000,
                    "unit": "USD"
                },
                "projects": {
                    "amount": 2,
                    "unit": null
                }
            }
        }
    ]
}
"""

import xml.etree.ElementTree as ET
import json
import os
import sys
import datetime
from decimal import Decimal
from .fix_bounds import fix_bounds, fix_long


def go(subpath=None):
  client_dir = ""
  if not subpath:
       client_dir = os.path.join("client", "json")
  else:
       client_dir = os.path.join(subpath, "client", "json")
  data_dir = os.path.join("data")
  download_url = "http://www.adb.org/iati/"

  # process country bounds/data file
  bounds_file = os.path.join(data_dir, "json", "ne_worldcountry_centroids_bbox.geojson")
  with open(bounds_file) as bounds_file_open:
      bounds_data = json.load(bounds_file_open)

  bounds_data = fix_bounds(bounds_data)

  # populate countries dictionary
  # each country is a JSON object, i.e countries["Afghanistan"] = {name: "Afghanistan", projects: etc}
  countries = {}
  projects = {}
  for country in bounds_data['features']:
      ISO_A2 = country['properties']['ISO_A2']
      countries[ISO_A2] = {
          'id': ISO_A2,
          'name': country['properties']['NAME_SORT'],
          'latlng': country['geometry']['coordinates'],
          'bbox': country['bbox'],
          'totals': {},
      } 
      projects[ISO_A2] = {
          'count': 0,
          'commitments': 0,
          'disbursements': 0,
          'locations': 0,
      }

  # process IATI xml file(s)
  xml_dir = os.path.join(data_dir, "xml")
  for xml_file in os.listdir(xml_dir):
      tree = ET.parse(os.path.join(xml_dir, xml_file))
      root = tree.getroot()
      # get file metadata
      gen_date = root.get('generated-datetime')
      gen_date_array = gen_date.split('-')
      q = int(gen_date_array[1])
      if q < 4:
          quarter = 'Q1'
      elif q >= 4 and q < 6:
          quarter = 'Q2'
      elif q >= 6 and q < 9:
          quarter = 'Q3'
      else:
          quarter = 'Q4'
      quarter = quarter + ' ' + gen_date_array[0]
      dd = os.path.getmtime(os.path.join(xml_dir, xml_file))
      download_date = datetime.datetime.fromtimestamp(dd).strftime('%Y-%m-%d %H:%M:%S')
      run_date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
      data_origin = download_url + xml_file
      country = root.find('iati-activity').find('recipient-country').get('code')

      #process regional data
      reg_countries = []
      if country == "":
          for iati_activity in root:
              for loc in iati_activity.findall('location'):
                  location = loc.find('administrative').get('country')
                  if not location in reg_countries:
                      reg_countries.append(location)
      else:
          countries[country]['metadata'] = {
              'quarter': quarter,
              'download_date': download_date,
              'run_date': run_date,
              'data_origin': data_origin,
          }

      # process each IATI activity, extract country name and project data
      for iati_activity in root:
          # check to make sure currency is USD
          if iati_activity.get('default-currency') != 'USD':
              activity_id = iati_activity.find('iati-identifier').text
              error_msg = "Error: IATI activity " + activity_id + " has a currency that is not USD. Please amend to continue."
              sys.exit(error_msg)
          code = iati_activity.find('recipient-country').get('code')

          #process regional data
          if code == "":
              for ctry in reg_countries:
                  for trans in iati_activity.findall('transaction'):
                      if trans.find('transaction-type').get('code') == 'C': #commitments
                          projects[ctry]['count'] += 1
                          projects[ctry]['commitments'] += Decimal(trans.find('value').text)
                      elif trans.find('transaction-type').get('code') == 'D': #disbursements
                          projects[ctry]['disbursements'] += Decimal(trans.find('value').text)
                  for loc in iati_activity.findall('location'):
                      projects[ctry]['locations'] += 1

          else:
              for trans in iati_activity.findall('transaction'):
                  if trans.find('transaction-type').get('code') == 'C': #commitments
                      projects[code]['count'] += 1
                      projects[code]['commitments'] += Decimal(trans.find('value').text)
                  elif trans.find('transaction-type').get('code') == 'D': #disbursements
                      projects[code]['disbursements'] += Decimal(trans.find('value').text)
              for loc in iati_activity.findall('location'):
                  projects[code]['locations'] += 1

  # output data to files as geojson
  country_data = {
      'type': 'FeatureCollection',
      'bbox': bounds_data['bbox'],
      'features': [],
  }
  # fix for China and Viet Nam
  countries['CN']['name'] = "China, People's Republic of"
  countries['VN']['name'] = "Viet Nam"
  for country in countries.values():
      if(country['id'] == 'MY'):
        country['metadata'] = {};
      #skip countries without metadata
      if('metadata' not in country):
          continue
      #only add countries that have data, and Dev. member countries  Brunei and Malaysia
      if (projects[country['id']]['count'] > 0 or country['id'] == 'MY'):
          country_data['features'].append({
              'id': country['id'],
              'type': 'Feature',
              'geometry': {
                  'type': 'Point',
                  'coordinates': [fix_long(country['latlng'][0]), country['latlng'][1]],
              },
              'properties': {
                  'name': country['name'],
                  'metadata' : country['metadata'],
                  'totals': {
                      'commitments': {
                          'amount': float(projects[country['id']]['commitments']),
                          'unit': 'USD',
                      },
                      'disbursements' : {
                          'amount' : float(projects[country['id']]['disbursements']),
                          'unit': 'USD',
                      },
                      'projects': {
                          'amount': projects[country['id']]['count'],
                          'unit': None,
                      },
                      'locations': {
                          'amount': projects[country['id']]['locations'],
                          'unit': None,
                      },
                      'bbox': country['bbox'],
                  },
              },
          })

  if not os.path.exists(client_dir):
      os.makedirs(client_dir)
  outfile = os.path.join(client_dir, 'countries.json')
  with open(outfile, 'w') as out:
      json.dump(country_data, out, indent=2, sort_keys=True)
