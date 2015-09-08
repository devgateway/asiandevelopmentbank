#!/usr/bin/env python

import sys
import os
try:
    # For Python 3.0 and later
    from urllib.request import urlopen
except ImportError:
    # Fall back to Python 2's urllib2
    from urllib2 import urlopen
import shutil
import re
import time

def go(subpath=None):
    # create variables
    working_dir = os.getcwd()
    script_dir = os.path.abspath(os.path.dirname(sys.argv[0]))
    tmp = os.path.join(working_dir, 'tmp')
    if os.path.exists(tmp):
        print("tmp dir " + tmp + " already exists. Exiting...")
        sys.exit()
    os.mkdir(tmp)
    os.chdir(working_dir)
    data_dir = os.path.join(script_dir, 'data')
    if not os.path.isdir(data_dir):
        os.mkdir(data_dir)
    os.chdir(data_dir)
    download_url = "https://raw.githubusercontent.com/idsdata/IATI-Urls-Snapshot/master/asdb"
    timestamp = int(time.time())
    xml_tmp = os.path.join(data_dir, 'xml_'+str(timestamp))
    os.mkdir(xml_tmp)
    xml_dir = os.path.join(data_dir, 'xml')
    if not os.path.isdir(xml_dir):
        os.mkdir(xml_dir)

    # download xml
    os.chdir(xml_tmp)
    response = urlopen(download_url, timeout = 10)
    print("Connected to remote repository...")
    for line in response.readlines():
        decoded_line = line.decode("utf-8").strip()
        line_array = decoded_line.split(' ')
        if re.match('asdb-[a-z]{2}$', line_array[0]) or line_array[0] == 'asdb-reg':
            remote_file = urlopen(line_array[1], timeout = 10)
            filename = line_array[1].split('/').pop()
            content = remote_file.read().decode("utf-8")
            cur_file = open(filename, 'w+')
            cur_file.write(content)
            cur_file.close()

            # check for previous versions
            prev_file = os.path.join(xml_dir, filename)
            print('Writing file %s' % prev_file)
            if os.path.isfile(prev_file):
                prev_size = os.path.getsize(prev_file)
                cur_size = os.path.getsize(filename)
                if cur_size < prev_size:
                    answer = raw_input("WARNING: The latest version of %s is smaller than the previous version. Continue? Y/N" % filename)
                    answer = answer.lower()
                    if answer == 'y':
                        data_file = open(prev_file, 'w')
                        data_file.write(content)
                        data_file.close()
                else:
                    data_file = open(prev_file, 'w')
                    data_file.write(content)
                    data_file.close()

            else:
                data_file = open(prev_file, 'w')
                data_file.write(content)
                data_file.close()

    os.chdir(working_dir)
    shutil.rmtree(tmp)
    shutil.rmtree(xml_tmp)
