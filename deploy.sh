#!/usr/bin/env bash
DEFAULT="default"
PROFILE=${AWS_PROFILE:-$DEFAULT}
BUCKET=growthfountain-frontend
ls
DIR=dist
aws  s3 cp $DIR s3://$BUCKET/ --profile "$PROFILE"  --recursive
DIR=app/dist
aws  s3 cp $DIR s3://$BUCKET/ --profile "$PROFILE"  --recursive
