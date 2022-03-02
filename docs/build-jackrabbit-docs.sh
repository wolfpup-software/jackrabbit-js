#!/bin/bash

current_dir=`dirname $0`

jackrabbit_test=$current_dir/../v0.1/es/jackrabbit.test.js
dest_dir=$current_dir/scripts

cp $jackrabbit_test $dest_dir

tsconfig_pathname=$current_dir/../v0.1/deno/tsconfig.json

target_pathname=$current_dir/deno/jackrabbit-dom.ts
es_pathname=$current_dir/scripts/jackrabbit-dom.js

deno bundle --config $tsconfig_pathname $target_pathname $es_pathname

deno fmt $current_dir