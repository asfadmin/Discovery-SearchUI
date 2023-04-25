#!/bin/bash

MATURITY=$1

aws cloudfront create-invalidation \
    --distribution-id $CDN_ID \
    --paths /index.html /manifest.json /ngsw.json /favicon.ico /assets/* /docs/*

