#!/bin/bash

current_dir=`dirname $0`

# copy tests

jackrabbit_test=$current_dir/../es/v0.1/core/jackrabbit.test.js
dest_dir=$current_dir/scripts

cp $jackrabbit_test $dest_dir


# bundle jackrabbit
tsconfig_pathname=$current_dir/deno/tsconfig.json
target_pathname=$current_dir/deno/jackrabbit-dom.ts
es_pathname=$current_dir/scripts/jackrabbit-dom.js

deno bundle --reload --config $tsconfig_pathname $target_pathname $es_pathname

deno fmt $current_dir
