#!/bin/bash

# copy all compiled js/css and img files
cd app/html/
aws s3 cp . s3://growthfountain-frontend/ --recursive --exclude ".git"

# copy server.html as index file
cd ../
aws s3 cp server.html s3://growthfountain-frontend/


# copy views, controllers, models
cd bethesda/
aws s3 cp . s3://growthfountain-frontend/
