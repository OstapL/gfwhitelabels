#!/usr/bin/env bash
DEFAULT="default"
PROFILE=${AWS_PROFILE:-$DEFAULT}
BUCKET="growthfountain-$CIRCLE_BRANCH"
DIR=dist
aws  s3 sync $DIR s3://$BUCKET/ --profile "$PROFILE"
DIR=src/img/
aws  s3 sync $DIR s3://$BUCKET/img/ --profile "$PROFILE"

BUCKET="beta.growthfountain.com"
DIR=dist
aws  s3 sync $DIR s3://$BUCKET/ --profile "$PROFILE"
DIR=src/img/
aws  s3 sync $DIR s3://$BUCKET/img/ --profile "$PROFILE"
echo  'done'
