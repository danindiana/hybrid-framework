#!/bin/bash
for git_dir in $(find /home/jeb/ -type d -name ".git"); do
  work_tree=$(dirname "$git_dir")
  count=$(git --git-dir="$git_dir" --work-tree="$work_tree" ls-files | wc -l)
  echo "$work_tree: $count"
done
