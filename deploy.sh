#!/usr/bin/env bash
DEFAULT="default"
PROFILE=${AWS_PROFILE:-$DEFAULT}
BUCKET="growthfountain-$CIRCLE_BRANCH"
BUCKET=`echo $BUCKET | sed -e "s/_/-/g"`
BUCKETSTORAGE="growthfountain-$CIRCLE_BRANCH-storage"
BUCKETSTORAGE=`echo $BUCKETSTORAGE | sed -e "s/_/-/g"`
aws s3 rm s3://$BUCKET --recursive
DIR=dist
aws  s3 sync $DIR s3://$BUCKET/ --profile "$PROFILE" > /dev/null
DIR=src/img/
aws  s3 sync $DIR s3://$BUCKET/img/ --profile "$PROFILE" > /dev/null
DIR=src/js/
aws  s3 sync $DIR s3://$BUCKET/js/ --profile "$PROFILE" > /dev/null
DIR=src/docs/
aws  s3 sync $DIR s3://$BUCKETSTORAGE/docs/ --profile "$PROFILE" > /dev/null
