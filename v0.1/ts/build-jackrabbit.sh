#!/bin/bash

current_dir=`dirname $0`
tsconfig_pathname=$current_dir/tsconfig.json

target_pathname=$current_dir/src/jackrabbit.ts
esm_pathname=$current_dir/../esm/jackrabbit.js

test_target_pathname=$current_dir/src/jackrabbit.test.ts
test_esm_pathname=$current_dir/../esm/jackrabbit.test.js 

deno bundle --config $tsconfig_pathname $target_pathname $esm_pathname
deno bundle --config $tsconfig_pathname $test_target_pathname $test_esm_pathname
