#!/bin/bash
repo_root=$(dirname $(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd))
echo "The resource path is ${repo_root}"

echo "Clone quick-uaa-local to ${repo_root}"
git clone https://github.com/xiaoyao9184/quick-uaa-local ${repo_root}/.quaa
cd ${repo_root}/.quaa

echo "Change default quaa config"
cp ${repo_root}/config/quaa/manifests/uaa.yml ${repo_root}/.quaa/manifests/uaa.yml
cp ${repo_root}/config/quaa/.versions ${repo_root}/.quaa/.versions

echo "Run quaa up"
${repo_root}/.quaa/bin/quaa up -ctx uaa

