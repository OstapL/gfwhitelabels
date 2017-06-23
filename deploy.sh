#!/usr/bin/env bash
DEFAULT="default"
PROFILE=${AWS_PROFILE:-$DEFAULT}
BUCKET="growthfountain-$CIRCLE_BRANCH"
BUCKET=`echo $BUCKET | sed -e "s/_/-/g"`
BUCKETSTORAGE="growthfountain-$CIRCLE_BRANCH-storage"
BUCKETSTORAGE=`echo $BUCKETSTORAGE | sed -e "s/_/-/g"`
cp dist/index.html dist/error.html
DIR=dist
aws  s3 sync $DIR s3://$BUCKET/ --profile "$PROFILE" > /dev/null
DIR=src/js/
aws  s3 sync $DIR s3://$BUCKET/js/ --profile "$PROFILE" > /dev/null
