#!/usr/bin/env bash
git fetch -q --all

if git branch --all | grep --quiet "remotes/vladyslav2/alpha"; then
    echo "============ MERGE WITH VLADYSLAV/alpha ============"
    git merge --no-ff vladyslav2/alpha > /dev/null
fi

git checkout origin/alpha > /dev/null
if git branch --all | grep --quiet "remotes/vladyslav2/$b"; then
    echo "============ MERGE WITH VLADYSLAV ALPHA ============"
    git merge vladyslav2/alpha > /dev/null
fi

for b in $(cat branches.txt)
do
    echo "========================= branch $b =========================="
    if git checkout $b; then
        git pull origin $b
        git submodule update --init
        cd consts && git checkout master && git pull origin master 
        cd ..
        cd staticdata && git checkout `cd .. && git rev-parse --abbrev-ref HEAD` && git pull && git fetch --all && git merge --no-ff alpha && git push
        cd ..
        git add staticdata
        git add consts
        git commit -a -m "updated staticdata and consts"

        if git branch --all | grep --quiet "remotes/vladyslav2/$b"; then
            echo "============ MERGE WITH VLADYSLAV/$b ============"
            git merge vladyslav2/$b > /dev/null
        fi

        git fetch origin
        git merge --no-ff origin/alpha > /dev/null
        ./fix_merge.sh

        if git st | grep --quiet 'UU '; then
            echo "Error after merge"
            git st | grep 'UU '
            break;
        else
            git commit -p
            git push origin $b
            # Push in the main repositary will not work
            # if git branch --all | grep --quiet "remotes/vladyslav2/$b"; then
            #    git push origin vladyslav/$b
            # fi
            echo "Succesfull merged AND PUSHED $b"
        fi
        echo ""
    else
        echo "$b failed to checkout. Update script stopped"
        git st;
        exit 1;
    fi
done

git checkout alpha
cd staticdata && git checkout `cd .. && git rev-parse --abbrev-ref HEAD`
cd ..
