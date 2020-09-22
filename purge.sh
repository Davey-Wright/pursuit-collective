
#!/bin/bash

curl -X POST \
http://purge.jsdelivr.net/ \
-H 'cache-control: no-cache' \
-H 'content-type: application/json' \
-d '{ 
  "path": [
    "gh/Davey-Wright/pursuit-collective@latest/dist/application.min.css"
  ]
}'