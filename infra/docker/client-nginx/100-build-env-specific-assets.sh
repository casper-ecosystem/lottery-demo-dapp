#!/bin/sh


## Build config.js file
envsubst < /usr/share/nginx/html/config.js.template > /usr/share/nginx/html/config.js

rm /usr/share/nginx/html/config.js.template
