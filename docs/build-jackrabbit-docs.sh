#!/bin/bash

current_dir=`dirname $0`

jackrabbit_dir=$current_dir/../v0.1/esm
dest_dir=$current_dir/scripts

cp $jackrabbit_dir/* $dest_dir