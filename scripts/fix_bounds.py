"""
    Don't let bounds span the whole globe

    We have data points near -180, which makes our bounds span the whole world,
    and makes some countries show up in unexpected places.

    This utility shifts any problem coordinates west, past +180 lng.
"""

from copy import deepcopy


def fix_bounds(bounds_data):
    # kiribati's longitudinal BBOX spans the whole world, and some countries
    # are over by -180 while others are around +180
    # fix all this -- our longitudinal span ends up crossing +180 up to about +190
    fixed_data = deepcopy(bounds_data)

    lngBounds = [float('inf'), float('-inf')]

    for country in fixed_data['features']:
        bb = country['bbox']
        if bb[2] - bb[0] > 180:  # ie., kiribati & fiji
            bb[0], bb[2] = 165, 195  # fudged, but we don't have enough info
            country['geometry']['coordinates'][0] = 180  # ^^

        elif bb[0] < 0 and bb[2] < 0:  # ie., tonga, samoa, ...
            bb[0] += 360
            bb[2] += 360

        # recompute new dataset-wide bounds if necessary
        lngBounds[0] = min(lngBounds[0], bb[0])
        lngBounds[1] = max(lngBounds[1], bb[2])

    #fixed_data['bbox'][0] = lngBounds[0]
    #fixed_data['bbox'][2] = lngBounds[1]
    #Using the world data, we have to hard-code the corrected Asia boundaries
    fixed_data['bbox'][0] = 39.985976355423105
    fixed_data['bbox'][1] = -20.0665597
    fixed_data['bbox'][2] = 202.68718509200005
    fixed_data['bbox'][3] = 48.1606518



    return fixed_data


def fix_long(longitude):
    return longitude if (longitude > 0) else (longitude + 360)
