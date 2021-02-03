#!/usr/bin/env bash

## build from docker
build_image=node:14

docker run -it --rm \
-v "$PWD":/usr/src/flowci.web \
-w /usr/src/flowci.web \
$build_image \
npm run build

## create docker image
version=$1

if [[ -n ${version} ]]; then
  versionTag="-t flowci/web:$version"
fi

docker build -f ./Dockerfile -t flowci/web:latest $versionTag .