#!/usr/bin/env bash
git fetch -q --all
git checkout alpha > /dev/null
# for b in alph-dcu alpha-momentum3 alpha-river-mark alpha-jdcu
for b in alpha-dcu
do
    git checkout $b
    git merge --no-ff alpha > /dev/null
    ./fix_merge.sh
    if git st | grep --quiet 'UU '; then
        echo "Error in $b"
        git st | grep 'UU '
        break;
    else
        echo "Succesfull merged $b"
    fi

done

git checkout alpha
