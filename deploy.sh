#!/usr/bin/env bash
DEFAULT="default"
PROFILE=${AWS_PROFILE:-$DEFAULT}
BUCKET="growthfountain-$CIRCLE_BRANCH"
BUCKET=`echo $BUCKET | sed -e "s/_/-/g"`
BUCKETSTORAGE="growthfountain-$CIRCLE_BRANCH-storage"
BUCKETSTORAGE=`echo $BUCKETSTORAGE | sed -e "s/_/-/g"`
cp dist/index.html dist/error.html
cp staticdata/img/logo.png dist/staticdata/img/logo.png
cp staticdata/img/fade-in-logo.png dist/staticdata/img/fade-in-logo.png
mkdir dist/staticdata/img/email
cp staticdata/img/email/header-email.png dist/staticdata/img/email/header-email.png
cp staticdata/img/logo-black.png dist/staticdata/img/logo-black.png
cp staticdata/img/generals/gbi-widget.png dist/staticdata/img/generals/gbi-widget.png
cp src/js/widget/widget-gfv2.js dist/js/widget/widget-gfv2.js
cp src/js/widget/widget-gf.css dist/js/widget/widget-gf.css
DIR=dist
aws  s3 sync --cache-control max-age=6048000 $DIR s3://$BUCKET/ --profile "$PROFILE" > /dev/null
aws s3api put-object --bucket $BUCKET --key index.html --cache-control no-cache --body $DIR/index.html --content-type text/html
aws s3api put-object --bucket $BUCKET --key error.html --cache-control no-cache --body $DIR/error.html --content-type text/html
DIR=src/js/
aws  s3 sync --cache-control max-age=6048000 $DIR s3://$BUCKET/js/ --profile "$PROFILE" > /dev/null
