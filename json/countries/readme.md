#Regenerating the adm0 boundary files#
For TopoJSON format with mapshaper from npm (initially also vim, QGIS for making list and filtering countries):

Download the list of ADB IATI files from https://github.com/idsdata/IATI-Urls-Snapshot/blob/master/asdb

          1 asdb-af http://www.adb.org/iati/iati-activities-af.xml¬
          2 asdb-am http://www.adb.org/iati/iati-activities-am.xml¬
          3 asdb-az http://www.adb.org/iati/iati-activities-az.xml¬
          4 asdb-bd http://www.adb.org/iati/iati-activities-bd.xml¬
          5 asdb-bt http://www.adb.org/iati/iati-activities-bt.xml¬
          6 asdb-kh http://www.adb.org/iati/iati-activities-kh.xml¬
          7 asdb-ck http://www.adb.org/iati/iati-activities-ck.xml¬
          8 asdb-fm http://www.adb.org/iati/iati-activities-fm.xml¬
          9 asdb-fj http://www.adb.org/iati/iati-activities-fj.xml¬
         10 asdb-ge http://www.adb.org/iati/iati-activities-ge.xml¬
         11 asdb-in http://www.adb.org/iati/iati-activities-in.xml¬
         12 asdb-id http://www.adb.org/iati/iati-activities-id.xml¬
         13 asdb-kz http://www.adb.org/iati/iati-activities-kz.xml¬
         14 asdb-ki http://www.adb.org/iati/iati-activities-ki.xml¬
         15 asdb-kg http://www.adb.org/iati/iati-activities-kg.xml¬
         16 asdb-la http://www.adb.org/iati/iati-activities-la.xml¬
         17 asdb-mh http://www.adb.org/iati/iati-activities-mh.xml¬
         18 asdb-mn http://www.adb.org/iati/iati-activities-mn.xml¬
         19 asdb-mm http://www.adb.org/iati/iati-activities-mm.xml¬
         20 asdb-nr http://www.adb.org/iati/iati-activities-nr.xml¬
         21 asdb-np http://www.adb.org/iati/iati-activities-np.xml¬
         22 asdb-pk http://www.adb.org/iati/iati-activities-pk.xml¬
         23 asdb-pw http://www.adb.org/iati/iati-activities-pw.xml¬
         24 asdb-pg http://www.adb.org/iati/iati-activities-pg.xml¬
         25 asdb-cn http://www.adb.org/iati/iati-activities-cn.xml¬
         26 asdb-ph http://www.adb.org/iati/iati-activities-ph.xml¬
         27 asdb-reg http://www.adb.org/iati/iati-activities-reg.xml¬
         28 asdb-mv http://www.adb.org/iati/iati-activities-mv.xml¬
         29 asdb-ws http://www.adb.org/iati/iati-activities-ws.xml¬
         30 asdb-sb http://www.adb.org/iati/iati-activities-sb.xml¬
         31 asdb-lk http://www.adb.org/iati/iati-activities-lk.xml¬
         32 asdb-tj http://www.adb.org/iati/iati-activities-tj.xml¬
         33 asdb-th http://www.adb.org/iati/iati-activities-th.xml¬
         34 asdb-tl http://www.adb.org/iati/iati-activities-tl.xml¬
         35 asdb-to http://www.adb.org/iati/iati-activities-to.xml¬
         36 asdb-tm http://www.adb.org/iati/iati-activities-tm.xml¬
         37 asdb-tv http://www.adb.org/iati/iati-activities-tv.xml¬
         38 asdb-uz http://www.adb.org/iati/iati-activities-uz.xml¬
         39 asdb-vu http://www.adb.org/iati/iati-activities-vu.xml¬
         40 asdb-vn http://www.adb.org/iati/iati-activities-vn.xml¬

**Use vim to concatenate and join (J key)**
:%s/ /','/g

**Filter in QGIS (right click shapefile, filter...)**

#Filter query

*Not FIPS_10:*

    "FIPS_10_" IN ('af','am','az','bd','bt','kh','ck','fm','fj','ge','in','id','kz','ki','kg','la','mh','mn','mm','nr','np','pk','pw','pg','cn','ph','re','mv','ws','sb','lk','tj','th','tl','to','tm','tv','uz','vu','vn')

####IATI is using ISO_A2 rather than FIPS_10
    "ISO_A2" IN ('af','am','az','bd','bt','kh','ck','fm','fj','ge','in','id','kz','ki','kg','la','mh','mn','mm','nr','np','pk','pw','pg','cn','ph','re','mv','ws','sb','lk','tj','th','tl','to','tm','tv','uz','vu','vn')

**in QGIS, "Save as...": ne_ADB_asia.geojson**

#Experimentation
Ultimately this was not necessary but pan-asia these settings seemed not terrible:

    mapshaper.org 57.9% reduction
    Repair intersections
    prevent shape removal (for islands)
    Precision: 0.0001

many geojson files:

    mapshaper ne_ADB_asia.geojson -split ISO_A2

single topojson file:

    mapshaper ne_ADB_asia.geojson -o tmp format=topojson -split ISO_A2

many topojson files:

    mapshaper *.json -o topos/ format=topojson



##All columns:
    scalerank,featurecla,LABELRANK,SOVEREIGNT,SOV_A3,ADM0_DIF,LEVEL,TYPE,ADMIN,ADM0_A3,GEOU_DIF,GEOUNIT,GU_A3,SU_DIF,SUBUNIT,SU_A3,BRK_DIFF,NAME,NAME_LONG,BRK_A3,BRK_NAME,BRK_GROUP,ABBREV,POSTAL,FORMAL_EN,FORMAL_FR,NOTE_ADM0,NOTE_BRK,NAME_SORT,NAME_ALT,MAPCOLOR7,MAPCOLOR8,MAPCOLOR9,MAPCOLOR13,POP_EST,GDP_MD_EST,POP_YEAR,LASTCENSUS,GDP_YEAR,ECONOMY,INCOME_GRP,WIKIPEDIA,FIPS_10_,ISO_A2,ISO_A3,ISO_N3,UN_A3,WB_A2,WB_A3,WOE_ID,WOE_ID_EH,WOE_NOTE,ADM0_A3_IS,ADM0_A3_US,ADM0_A3_UN,ADM0_A3_WB,CONTINENT,REGION_UN,SUBREGION,REGION_WB,NAME_LEN,LONG_LEN,ABBREV_LEN,TINY,HOMEPART

###Remove FIPS_10_ so we are not confused

##Trimmed columns:
    scalerank,LABELRANK,SOVEREIGNT,TYPE,ADMIN,ADM0_A3,GEOUNIT,GU_A3,SU_A3,NAME,NAME_LONG,BRK_A3,BRK_NAME,ABBREV,FORMAL_EN,NAME_SORT,MAPCOLOR7,MAPCOLOR8,MAPCOLOR9,MAPCOLOR13,POP_EST,GDP_MD_EST,ECONOMY,INCOME_GRP,ISO_A2,ISO_A3,WB_A2,WB_A3,CONTINENT,REGION_UN,SUBREGION,REGION_WB,NAME_LEN,LONG_LEN,ABBREV_LEN,TINY

#Final process
##Using mapshaper from NPM

    mkdir geojson
    mapshaper ne_ADB_asia.geojson   -filter-fields scalerank,LABELRANK,SOVEREIGNT,TYPE,ADMIN,ADM0_A3,GEOUNIT,GU_A3,SU_A3,NAME,NAME_LONG,BRK_A3,BRK_NAME,ABBREV,FORMAL_EN,NAME_SORT,MAPCOLOR7,MAPCOLOR8,MAPCOLOR9,MAPCOLOR13,POP_EST,GDP_MD_EST,ECONOMY,INCOME_GRP,ISO_A2,ISO_A3,WB_A2,WB_A3,CONTINENT,REGION_UN,SUBREGION,REGION_WB,NAME_LEN,LONG_LEN,ABBREV_LEN,TINY -split ISO_A2 -o geojson format=geojson id-field=ISO_A2 bbox
    mapshaper geojson/*.json -o . format=topojson id-field=ISO_A2 bbox



###Procedure:
    mkdir geojson
    mapshaper ne_ADB_asia.geojson   -filter-fields scalerank,LABELRANK,SOVEREIGNT,TYPE,ADMIN,ADM0_A3,GEOUNIT,GU_A3,SU_A3,NAME,NAME_LONG,BRK_A3,BRK_NAME,ABBREV,FORMAL_EN,NAME_SORT,MAPCOLOR7,MAPCOLOR8,MAPCOLOR9,MAPCOLOR13,POP_EST,GDP_MD_EST,ECONOMY,INCOME_GRP,ISO_A2,ISO_A3,WB_A2,WB_A3,CONTINENT,REGION_UN,SUBREGION,REGION_WB,NAME_LEN,LONG_LEN,ABBREV_LEN,TINY -split ISO_A2 -o geojson format=geojson id-field=ISO_A2 bbox
    mapshaper geojson/*.json -o topos/ format=topojson id-field=ISO_A2 bbox

install `rename`

    rename 's/ne_ADB_asia-//g' *.json

or to lowercase:

    rename 's/ne_ADB_asia-//g;
    y/A-Z/a-z/;' *-*.json

also using prettify is handy
