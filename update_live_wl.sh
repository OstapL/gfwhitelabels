#!/usr/bin/env bash
git fetch -q --all
git checkout master > /dev/null
for b in dcu momentum3 rivermarkcu jdcu infinityfcu tvfcu
do
    echo "========================= branch $b =========================="
    if git checkout $b; then
        git pull origin $b > /dev/null
        git submodule update --init
        cd consts && git checkout master && git pull origin master 
        cd ..
        cd staticdata && git checkout `cd .. && git rev-parse --abbrev-ref HEAD` && git pull && git fetch --all && git merge --no-ff origin/alpha-`cd .. && git rev-parse --abbrev-ref HEAD` && git push
        cd ..
        git add staticdata
        git add consts
        git commit -a -m "updated staticdata and consts"

        if git branch --all | grep --quiet "remotes/vladyslav2/$b"; then
            echo "============ MERGE WITH VLADYSLAV/$b ============"
            git merge vladyslav2/$b > /dev/null
        fi

        git fetch origin > /dev/null
        git merge --no-ff origin/alpha-$b > /dev/null

        if git st | grep --quiet 'UU '; then
            echo "Error after merge"
            git st | grep 'UU '
            break;
        else
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

git checkout master
cd staticdata && git checkout `cd .. && git rev-parse --abbrev-ref HEAD`
cd ..
