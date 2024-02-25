#!/bin/bash

current_dir=`dirname $0`

target_pathname=$current_dir/test-jackrabbit.ts

deno run --reload --allow-read $target_pathname --file ./core/mod.test.ts
