#!/usr/bin/env bash
DEFAULT="default"
PROFILE=${AWS_PROFILE:-$DEFAULT}
BUCKET="growthfountain-$CIRCLE_BRANCH"
BUCKET=`echo $BUCKET | sed -e "s/_/-/g"`
BUCKETSTORAGE="growthfountain-$CIRCLE_BRANCH-storage"
BUCKETSTORAGE=`echo $BUCKETSTORAGE | sed -e "s/_/-/g"`
DIR=dist
aws  s3 sync $DIR s3://$BUCKET/ --profile "$PROFILE" > /dev/null
DIR=src/img/
aws  s3 sync $DIR s3://$BUCKET/img/ --profile "$PROFILE" > /dev/null
DIR=src/js/
aws  s3 sync $DIR s3://$BUCKET/js/ --profile "$PROFILE" > /dev/null
DIR=src/docs/
aws  s3 sync $DIR s3://$BUCKETSTORAGE/docs/ --profile "$PROFILE" > /dev/null

echo 'updating alpha DCU'
git checkout alpha-dcu
git merge --no-ff alpha
BUCKET="growthfountain-alpha-dcu"
BUCKETSTORAGE="growthfountain-alpha-dcu-storage"
DIR=dist
aws  s3 sync $DIR s3://$BUCKET/ --profile "$PROFILE" > /dev/null
DIR=src/img/
aws  s3 sync $DIR s3://$BUCKET/img/ --profile "$PROFILE" > /dev/null
DIR=src/js/
aws  s3 sync $DIR s3://$BUCKET/js/ --profile "$PROFILE" > /dev/null
DIR=src/docs/
aws  s3 sync $DIR s3://$BUCKETSTORAGE/docs/ --profile "$PROFILE" > /dev/null

echo 'updating alpha MOMENTUM3'
git reset --hard
git checkout alpha-momentum3
git merge --no-ff alpha
BUCKET="growthfountain-alpha-momentm3"
BUCKETSTORAGE="growthfountain-alpha-momentum3-storage"
DIR=dist
aws  s3 sync $DIR s3://$BUCKET/ --profile "$PROFILE" > /dev/null
DIR=src/img/
aws  s3 sync $DIR s3://$BUCKET/img/ --profile "$PROFILE" > /dev/null
DIR=src/js/
aws  s3 sync $DIR s3://$BUCKET/js/ --profile "$PROFILE" > /dev/null
DIR=src/docs/
aws  s3 sync $DIR s3://$BUCKETSTORAGE/docs/ --profile "$PROFILE" > /dev/null

echo 'updating alpha JDCU'
git reset --hard
git checkout alpha-jdcu
git merge --no-ff alpha
BUCKET="growthfountain-alpha-jdcu"
BUCKETSTORAGE="growthfountain-alpha-jdcu-storage"
DIR=dist
aws  s3 sync $DIR s3://$BUCKET/ --profile "$PROFILE" > /dev/null
DIR=src/img/
aws  s3 sync $DIR s3://$BUCKET/img/ --profile "$PROFILE" > /dev/null
DIR=src/js/
aws  s3 sync $DIR s3://$BUCKET/js/ --profile "$PROFILE" > /dev/null
DIR=src/docs/
aws  s3 sync $DIR s3://$BUCKETSTORAGE/docs/ --profile "$PROFILE" > /dev/null

echo 'updating alpha RIVERMARK'
git reset --hard
git checkout alpha-rivermark
git merge --no-ff alpha
BUCKET="growthfountain-alpha-rivermark"
BUCKETSTORAGE="growthfountain-alpha-rivermark-storage"
DIR=dist
aws  s3 sync $DIR s3://$BUCKET/ --profile "$PROFILE" > /dev/null
DIR=src/img/
aws  s3 sync $DIR s3://$BUCKET/img/ --profile "$PROFILE" > /dev/null
DIR=src/js/
aws  s3 sync $DIR s3://$BUCKET/js/ --profile "$PROFILE" > /dev/null
DIR=src/docs/
aws  s3 sync $DIR s3://$BUCKETSTORAGE/docs/ --profile "$PROFILE" > /dev/null
