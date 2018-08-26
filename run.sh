#!/bin/sh
export HACKNIT_GITHUB_KEY=""

REPOS="hacknit-seguranca hacknit-educacao hacknit-saude hacknit-voluntariado hacknit-mobilidadeurbana hacknit-meioambiente hacknit-conservacao"

for repo in ${REPOS}; do
        HACKNIT_REPO=seplagniteroi/${repo} node index.js
done
