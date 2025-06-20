#!/bin/bash

function delete_dist_bestanden() {
    rm -r dist
}

projectdir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$projectdir" || exit 1

# Node environment
if [ ! -f ~/.nvm/nvm.sh ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
fi
export NODE_ENV=development
. ~/.nvm/nvm.sh
nvm install node || exit 1
npm install npm@latest -g || exit 1

# npm packages
npm install || exit 1
npm audit fix

# webpack compilen
delete_dist_bestanden
git ls-tree -r --name-only HEAD | grep -P '\.ts$' | xargs npx eslint || exit 1
git ls-tree -r --name-only HEAD | grep -P '\.(ts|js|css|scss|html|json)$' | xargs npx prettier --write || exit 1
npx tsc --sourceMap || exit 1
