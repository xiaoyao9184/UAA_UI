#!/bin/bash
repo_root=$(dirname $(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd))
echo "The resource path is ${repo_root}"
cd ${repo_root}

echo "Clone quick-uaa-local to ${repo_root}"
git clone https://github.com/xiaoyao9184/quick-uaa-local ${repo_root}/.quaa

echo "Change default quaa config"
cp ./development/quaa/manifests/uaa.yml ./.quaa/manifests/uaa.yml
cp ./development/quaa/.versions ./.quaa/.versions

echo "Run quaa up"
./.quaa/bin/quaa up -ctx uaa

