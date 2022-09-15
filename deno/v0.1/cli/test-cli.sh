#!/bin/bash

current_dir=`dirname $0`

target_pathname=$current_dir/mod.ts

deno run --allow-read $target_pathname --file ../core/mod.test.ts
