#!/bin/bash

deno bundle --config ./tsconfig.json ./src/jackrabbit.ts ./esmodules/jackrabbit.js 
deno bundle --config ./tsconfig.json ./src/jackrabbit.test.ts ./esmodules/jackrabbit.test.js 