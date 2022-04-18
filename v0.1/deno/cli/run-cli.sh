
current_dir=`dirname $0`
target_pathname=$current_dir/mod.ts
git_sha=`git rev-parse HEAD`
branch=`git rev-parse --abbrev-ref HEAD`
identifier="${branch}:${git_sha}"

deno run $target_pathname --quiet --file hello.ts,whatup.ts --address https://example.org,http://unsafe-site.com --save-results ./hello --identifier $identifier