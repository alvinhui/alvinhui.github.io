#!/bin/sh

sudo rm -rf ../www-production

node r.js -o build.js > rebuild.txt