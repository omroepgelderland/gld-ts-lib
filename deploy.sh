#!/bin/bash

function delete_dist_bestanden() {
    rm -r dist
}

projectdir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$projectdir" || exit 1

current_branch=$(git rev-parse --abbrev-ref HEAD)
if [[ $current_branch != "heads/master" ]]; then
    echo "Op branch $current_branch ipv master. Toch doorgaan? (j/n)"
    read -r ans
    if [[ $ans != "j" ]]; then
        exit 1
    fi
fi

./deploy_dev.sh || exit 1

if [ -n "$(git status --untracked-files=no --porcelain)" ]; then
    git status
    echo "Er zijn uncommitted changes. Toch doorgaan? (j/n)"
    read -r ans
    if [[ $ans != "j" ]]; then
        exit 1
    fi
fi

# nvm environment
. ~/.nvm/nvm.sh
nvm install node || exit 1

# compilen
delete_dist_bestanden
npx tsc || exit 1

# versieverhoging
oude_versie="$(git tag --list 'v*' --sort=v:refname | tail -n1)"
echo "De vorige versie is $oude_versie. Versieverhoging? (major|minor|patch|premajor|preminor|prepatch|prerelease) "
read -r versie_type
if [[ $versie_type == pre* ]]; then
    echo "Release? (alpha|beta|rc)"
    read -r preid
else
    preid=""
fi
npm version --preid "$preid" "$versie_type" || exit 1

# package maken
if [[ $preid == "" ]]; then
    npm publish || exit 1
else
    npm publish --tag "$preid" || exit 1
fi

git gc
git push origin
git push github
