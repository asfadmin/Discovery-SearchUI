#!/bin/bash
MATURITY=$1
APPLICATION="search-ui"

update_deployment() {
    S3_BUCKET=$1
    CDN_ID=$2

    ng build --prod

    cd dist/${APPLICATION} || return

    echo "Updating s3 bucket ${S3_BUCKET}"
    aws s3 sync . "s3://${S3_BUCKET}"

    echo "Invalidating index.html for cloudfront distro ${CDN_ID}"
    aws cloudfront create-invalidation \
        --distribution-id $CDN_ID \
        --paths /index.html /manifest.json /ngsw.json /favicon.ico
}

if [ "$MATURITY" = "" ]; then
    echo "./update-deployment.sh dev|test"
elif [ "$MATURITY" = "dev" ]; then
   update_deployment \
       "asf-search-ui-dev" \
       "E2OXZSBBD3HDZP"
elif [ "$MATURITY" = "test" ]; then
   update_deployment \
       "asf-search-ui-test" \
       "E1E8RTC42VUIN5"
else
    echo "Unrecognized maturity '${MATURITY}'."
fi

