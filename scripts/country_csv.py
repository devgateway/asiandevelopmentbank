# -*- coding: utf-8 -*-
"""
country_csv.py
@author: Anya Marshall
@dependencies: ne_ADB_asia_centroids_bbox.json, ne_worldcountry_centroids_bbox.geojson
Converts IATI xml files to CSV documents, with one document per country and projects listed by country.
"""

import xml.etree.ElementTree as ET
import json
import os
import re
import sys
import datetime
import csv
from .fix_bounds import fix_bounds, fix_long


project_desc_min = 15
project_desc_max = 80


def parse_iati_id(raw_id):
    expr = r'^\s*46004\-(?P<id8>\d{5}\-\d{3})\-\w+\d+\s*$'
    match = re.match(expr, raw_id)
    if match is None:
        raise ValueError('Could not parse project id', raw_id)
    return match.groupdict()['id8']


def ellipsize(text):
    return u'{}…'.format(text.rsplit(' ', 1)[0])


def short_desc(summary):
    summary = summary.strip()  # remove leading whitespace
    summary = summary[:200]  # always less than 100
    splitAtSentence = summary.rsplit('. ', 1)
    if len(splitAtSentence) == 1:
        return ellipsize(summary)
    left = splitAtSentence[0]
    summary = left if len(left) > 15 else ellipsize(summary)
    return summary


def validate_date(iso_date_string):
    should_be = r'^\d{4}\-\d{2}-\d{2}$'
    if re.match(should_be, iso_date_string) is None:
        raise ValueError('Encountered a date string that was not in '
            'expected YYYY-MM-DD format: {}'.format(iso_date_string))


def get_id(_count={'n': 0}):  # mutable default arg monster
    _count['n'] += 1  # hide your kids!
    return _count['n']


def get_activities(iati_activity, code, countries, sector_data):
    """
    Abstraction of the functionality for parsing each project/activity listed in an XML file
    @iati_activity - a branch of the XML tree representing a single project
    @code - country code for the country where the project is taking place
    @countries - object containing all country data
    @sector_data - data for all the sectors
    """
    project_title = iati_activity.find('title').text

    # check to make sure all projects have same prefix
    raw_project_id = (iati_activity.find('iati-identifier').text)
    project_id = parse_iati_id(raw_project_id)

    raw_project_info = iati_activity.find('description').text;
    project_info = short_desc(raw_project_info)

    raw_sectors = [s.text for s in iati_activity.findall('sector')]
    clean_sectors = []
    sector_mapping = sector_data["sectors"]
    for sector in raw_sectors:
        try:
            clean_sectors.extend(sector_mapping[sector])
        except KeyError:
            sys.exit('Error: "' + sector + '" not found in sector mapping dataset. Please update ' + sector_file + ' and retry.')

    approval_date = None  # format for missing date
    commitment_amount = 0.0
    disbursement_amount = 0.0
    for trans in iati_activity.findall('transaction'):
        if trans.find('transaction-type').get('code') == 'C':
            approval_date = trans.find('transaction-date').get('iso-date')
            commitment_amount += float(trans.find('value').text)
        elif trans.find('transaction-type').get('code') == 'D':
            disbursement_amount += float(trans.find('value').text)

    if approval_date is not None:
        validate_date(approval_date)
    else:
        print('WARNING: Missing approval date for project {}'.format(project_id))

    closing_date = None
    for ad in iati_activity.findall('activity-date'):
        if ad.get('type') == 'end-planned':
            closing_date = ad.text

    if closing_date is not None:
        validate_date(closing_date)
    else:
        print('WARNING: missing closing date for project {}'.format(project_id))


    for location in iati_activity.findall('location'):
        # Each location holds all the info about its project, which
        # might seem wasteful since projects often have _many_
        # locations. It is I guess. Thank GeoJSON.
        # We have to do this to get metadata per-location (ie., name)
        # because GeoJSON does not support nested `FeatureCollections`
        # and `geometry` values cannot contain `Feature`s.

        # validate lng and lat, skipping known-bad projects
        raw_lng = float(location.find('coordinates').get('longitude'))
        if abs(raw_lng) > 180:
            if project_id == '38350-013':
                print('WARNING: skipping known-problematic project {} because we got a bad longitude: {}'
                    .format(project_id, raw_lng))
                continue
            else:
                raise ValueError('Illegal longitude {} for project {}. (must be in range -180..180)'
                    .format(raw_lng, project_id))

        raw_lat = float(location.find('coordinates').get('latitude'))
        if abs(raw_lat) > 90:
            raise ValueError('Illegal latitude {} for project {}. (must be in range -90..90)'
                .format(raw_lat, project_id))

        countries[code]['features'].append({
            'id': str(get_id()),  # unique, but not necessarily stable across script runs!
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [fix_long(raw_lng), raw_lat],
            },
            'properties': {
                'id': project_id,
                'info': project_info,
                'locationName': location.find('name').text,
                'adminLocation': location.find('administrative').text,
                'adminCode': location.find('administrative').get('country'),
                'title': project_title,
                'sectors': clean_sectors,
                'status': iati_activity.find('activity-status').text,
                'approvalDate': approval_date,
                'commitmentAmount': commitment_amount,
                'disbursementAmount': disbursement_amount,
                'closingDate': closing_date,
                'website': iati_activity.find('activity-website').text,
            },
        })

def go(subpath=None):

    client_dir = ""
    if not subpath:
        client_dir = os.path.join("client", "json")
    else:
        client_dir = os.path.join(subpath, "client", "json")
    data_dir = "data"
    download_url = "http://www.adb.org/iati/"

    # process country bounds/data file
    bounds_file = os.path.join(data_dir, "json", "ne_worldcountry_centroids_bbox.geojson")
    with open(bounds_file) as bounds_file_open:
        bounds_data = json.load(bounds_file_open)

    bounds_data = fix_bounds(bounds_data)

    # populate countries dictionary
    # each country is a JSON object, i.e countries["AF"] = {name: "Afghanistan", projects: etc}
    countries = {}
    for key in bounds_data['features']:
        name = key['properties']['NAME_SORT']
        code = key['properties']['ISO_A2']
        filename = key['properties']['ISO_A2'] + ".csv"
        bounds = key['bbox']
        countries[code] = {
            'filename': filename,
            'id': code,
            'type': 'FeatureCollection',
            'features': [],
            'properties': {
                'name': name,
                'bounds': bounds,
            },
        }

    # process IATI xml file(s)
    xml_dir = os.path.join(data_dir, "xml")
    sector_file = os.path.join(data_dir, "json", "sector_mapping.json")
    with open(sector_file) as sector_file_open:
        sector_data = json.load(sector_file_open)
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


        # process each IATI activity, extract country name, sector data, and project data
        for iati_activity in root:
            code = iati_activity.find('recipient-country').get('code')
            if code == "":
                #empty code means regional data, process projects for each country listed in the regional XML
                for ctry in reg_countries:
                    get_activities(iati_activity, ctry, countries, sector_data)
            else:
                get_activities(iati_activity, code, countries, sector_data)


    # output data to files
    # fix for China and Viet Nam
    countries['CN']['properties']['name'] = "China, People's Republic of"
    countries['VN']['properties']['name'] = "Viet Nam"
    countries['MY']['metadata'] = { 'quarter': 'N/A', 'download_date': 'N/A', 'run_date': 'N/A', 'data_origin': 'N/A'}
    for country in countries:
        #skip countries with no metadata
        if('metadata' not in countries[country]):
            continue
        #make a file only if there is data, or in case of Dev member countries Brunei or Malaysia
        if len(countries[country]['features']) > 0 or country == 'MY':
            outdir = os.path.join(client_dir, 'countries')
            if not os.path.exists(outdir):
                os.makedirs(outdir)
            outfile = os.path.join(outdir, countries[country]['filename'])
            del countries[country]['filename']
            with open(outfile, 'w') as out:
                unrolled = {}
                for item in countries[country]:
                    the_type = type(countries[country][item])
                    if the_type == list:
                        unrolled.update(unroll_list(countries[country][item], item))
                    elif the_type == dict:
                        unrolled.update(unroll_dict(countries[country][item], item))
                    else:
                        unrolled[item] = countries[country][item]

                output = []
                entries = get_num_output_entries(unrolled.keys()) + 1
                for x in range(0, entries):
                    try:
                        output.append({
                            'id': unrolled['id'],
                            'type': unrolled['type'],
                            'metadata-quarter': unrolled['metadata-quarter'],
                            'metadata-download_date': unrolled['metadata-download_date'],
                            'metadata-run_date': unrolled['metadata-run_date'],
                            'metadata-data_origin': unrolled['metadata-data_origin'],
                            'properties-name': unrolled['properties-name'],
                            'properties-bounds-0': unrolled['properties-bounds-0'],
                            'properties-bounds-1': unrolled['properties-bounds-1'],
                            'properties-bounds-2': unrolled['properties-bounds-2'],
                            'properties-bounds-3': unrolled['properties-bounds-3'],
                        })
                    except KeyError:
                        print("Key Error")
                        continue

                entry_hash = {}
                for entry in unrolled:
                    key_array = entry.split('-')
                    if key_array[0] == 'features':
                        output[int(key_array[1])]['features-'+'-'.join(key_array[2:])] = unrolled[entry]

                fieldnames = ['id', 'type', 'metadata-quarter', 'metadata-download_date', 'metadata-run_date', 'metadata-data_origin', 'properties-name', 'properties-bounds-0', 'properties-bounds-1', 'properties-bounds-2', 'properties-bounds-3', 'features-id', 'features-geometry-type', 'features-geometry-coordinates-0', 'features-geometry-coordinates-1', 'features-type', 'features-properties-id', 'features-properties-disbursementAmount', 'features-properties-title', 'features-properties-closingDate', 'features-properties-info', 'features-properties-commitmentAmount',  'features-properties-approvalDate', 'features-properties-locationName', 'features-properties-status', 'features-properties-sectors-0', 'features-properties-sectors-1', 'features-properties-adminCode', 'features-properties-website', 'features-properties-adminLocation']
                writer = csv.DictWriter(out, fieldnames=fieldnames)
                writer.writeheader()
                for final_item in output:
                    writer.writerow(final_item)


def unroll_list(collection, prefix):
    unrolled = {}
    counter = 0
    for item in collection:
        if type(item) == list:
            unrolled.update(unroll_list(item, prefix+'-'+str(counter)))
        elif type(item) == dict:
            unrolled.update(unroll_dict(item, prefix+'-'+str(counter)))
        else:
            unrolled[prefix+'-'+str(counter)] = item
        counter += 1
    return unrolled


def unroll_dict(collection, prefix):
    unrolled = {}
    for item in collection:
        if type(collection[item]) == list:
            unrolled.update(unroll_list(collection[item], prefix+'-'+item))
        elif type(collection[item]) == dict:
            unrolled.update(unroll_dict(collection[item], prefix+'-'+item))
        else:
            unrolled[prefix+'-'+item] = collection[item]
    return unrolled


def get_num_output_entries(collection):
    max_number = 0
    for item in collection:
        key_array = item.split('-')
        if key_array[0] == 'features':
            if int(key_array[1]) > max_number:
                max_number = int(key_array[1])
    return max_number
