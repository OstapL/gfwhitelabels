#!/usr/bin/env bash
git fetch -q --all
git checkout alpha > /dev/null
for b in alpha-dcu alpha-momentum3 alpha-rivermarkcu alpha-jdcu
do
    git checkout $b
    git pull origin $b

    echo "========================= branch $b =========================="
    if git branch --all | grep --quiet "remove/vladyslav2/$b"; then
        echo "============ MERGE WITH VLADYSLAV/$b ============"
        git merge vladyslav2/$b > /dev/null
    fi

    git merge --no-ff alpha > /dev/null
    ./fix_merge.sh

    if git st | grep --quiet 'UU '; then
        echo "Error after merge"
        git st | grep 'UU '
        break;
    else
        echo "Succesfull merged ALPHA WITH $b"
    fi
    echo ""

done

git checkout alpha
