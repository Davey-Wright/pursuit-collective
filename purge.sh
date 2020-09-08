
#!/bin/bash

curl -X POST \
http://purge.jsdelivr.net/ \
-H 'cache-control: no-cache' \
-H 'content-type: application/json' \
-d '{ 
  "path": [
    "gh/Davey-Wright/pursuit-collective@latest/assets/logo-animation.svg",
    "gh/Davey-Wright/pursuit-collective@latest/dist/vendors.min.js",
    "gh/Davey-Wright/pursuit-collective@latest/dist/app.min.js",
    "gh/Davey-Wright/pursuit-collective@latest/dist/vendors.min.css",
    "gh/Davey-Wright/pursuit-collective@latest/dist/app.min.css"
  ]
}'