#! /bin/sh

DIR=/home/duncan/dev_scorer

cd $DIR
find second-prototype/logs -name "*.log" -mtime +28 -print -exec rm {} \;

