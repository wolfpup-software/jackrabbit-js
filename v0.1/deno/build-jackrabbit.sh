#!/bin/bash

current_dir=`dirname $0`
tsconfig_pathname=$current_dir/tsconfig.json

target_pathname=$current_dir/src/jackrabbit.ts

es_dir=$current_dir/../es
es_pathname=$es_dir/jackrabbit.js

test_target_pathname=$current_dir/src/jackrabbit.test.ts

test_es_dir=$es_dir/jackrabbit.test.js 
test_es_pathname=$es_dir/jackrabbit.test.js 

deno bundle --config $tsconfig_pathname $target_pathname $es_pathname
deno bundle --config $tsconfig_pathname $test_target_pathname $test_es_pathname

deno fmt $current_dir
deno fmt $es_dir