import requests
import sys
import os

if os.path.exists("raw.bin"):
    os.remove("raw.bin")

data = {'option':'credential','target':'https://my.barton.ac.uk/studio/student/timetable.php','sid':'0','Ecom_User_ID':sys.argv[1] ,'Ecom_Password':sys.argv[2]}

url = 'https://nam.barton.ac.uk/nidp/idff/sso?sid=0'

r = requests.get(url, data, allow_redirects=True)

crd = str(r.headers['Set-Cookie']).split(';')[0]

if (len(sys.argv) == 4):
    params = f"dt={sys.argv[3]}"
else:
    params = ''

url2 = f'https://www.barton.ac.uk/studio/student/timetable.php?{params}'
r2 = requests.get(url2, cookies={ crd.split('=')[0] : crd.split('=')[1] })

f = open('raw.bin', 'a')
f.write(r2.text)
f.close()