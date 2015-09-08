#!/usr/bin/env python

from scripts import download
from scripts import country_detail
from scripts import country_aggregate
from scripts import project_detail
from scripts import country_csv


tasks = {
    'download': download.go,
    'country-detail': country_detail.go,
    'country-aggregate': country_aggregate.go,
    'project-detail': project_detail.go,
    'country-csv': country_csv.go,
}


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Process IATI data for AsDB')
    parser.add_argument('task', metavar='task', type=str, nargs='+',
        help='the task to run, one of {}.'.format(', '.join(tasks)))
    parser.add_argument('-f', metavar='folder', type=str, nargs='?',
        help='the folder to run')
    args = parser.parse_args()
    if not all(k in tasks for k in args.task):
        import sys
        sys.exit('Unrecognized tasks: {}\nAvailable tasks: {}'.format(
            ', '.join(filter(lambda k: k not in tasks, args.task)),
            ', '.join(tasks)))
    print(args)
    for task in args.task:
        tasks[task](args.f)
