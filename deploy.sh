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
aws s3api put-object --bucket $BUCKET --key index.html --cache-control no-cache --body $DIR/index.html --content-type text/html
aws s3api put-object --bucket $BUCKET --key error.html --cache-control no-cache --body $DIR/error.html --content-type text/html
DIR=src/js/
aws  s3 sync $DIR s3://$BUCKET/js/ --profile "$PROFILE" > /dev/null
