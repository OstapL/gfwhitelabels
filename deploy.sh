#!/usr/bin/env bash
DEFAULT="default"
PROFILE=${AWS_PROFILE:-$DEFAULT}
BUCKET=growthfountain-frontend
DIR=/Users/admin/projects/gfwhitelabels/app/html
aws  s3 cp $DIR s3://$BUCKET/ --profile "$PROFILE"  --recursive
