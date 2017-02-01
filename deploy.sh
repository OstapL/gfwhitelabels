#!/usr/bin/env bash
DEFAULT="default"
PROFILE=${AWS_PROFILE:-$DEFAULT}
BUCKET="growthfountain-$CIRCLE_BRANCH"
BUCKET=`echo $BUCKET | sed -e "s/_/-/g"`
aws s3 rm s3://$BUCKET --recursive
DIR=dist
aws  s3 sync $DIR s3://$BUCKET/ --profile "$PROFILE"
DIR=src/img/
aws  s3 sync $DIR s3://$BUCKET/img/ --profile "$PROFILE"
DIR=src/js/
aws  s3 sync $DIR s3://$BUCKET/js/ --profile "$PROFILE"
DIR=src/docs/
aws  s3 sync $DIR s3://$BUCKET/docs/ --profile "$PROFILE"
echo  'done'
