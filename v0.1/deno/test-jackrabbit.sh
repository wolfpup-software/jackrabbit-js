#!/bin/bash

current_dir=`dirname $0`
tsconfig_pathname=$current_dir/tsconfig.json
target_pathname=$current_dir/jackrabbit.ts
bundled_pathname=$current_dir/../bundled/jackrabbit.js 

deno run --config $tsconfig_pathname $target_pathname $bundled_pathname
