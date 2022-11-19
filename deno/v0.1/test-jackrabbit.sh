#!/bin/bash

current_dir=`dirname $0`

target_pathname=$current_dir/test-jackrabbit.ts

target_rel=../core/mod.test.ts
target_dir=`dirname ${target_rel}`

echo $target_dir

# deno run --allow-read $target_pathname --file ./core/mod.test.ts
deno run --reload --allow-read $target_pathname --file ./core/mod.test.ts
