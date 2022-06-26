#!/usr/bin/env bash
# set -euo pipefail
# home="$(realpath "$(realpath "${BASH_SOURCE[0]}" | xargs dirname)"/.)"; cd "$home"


# shellcheck disable=SC1091
source ./util.sh

git_clone_shallow() (
  # thx to https://stackoverflow.com/a/60952814/7568091
  branch="$1"
  address="$2"
  name=$(basename "$address")
  # git clone --filter=blob:none --no-checkout --single-branch --branch master https://github.com/loveencounterflow/unicopedia-plus unicopedia-plus
  # git clone --filter=blob:none --no-checkout --single-branch --branch "$branch" "$address" "$name"
  # git clone --filter=blob:none --no-checkout --single-branch "$address"
  git clone --filter=blob:none --no-checkout "$address"
  cd "$name" || enoent
  # git log
  # thx to https://gist.github.com/varemenos/e95c2e098e657c7688fd
  # git log --pretty=format:'hash:%H%x09date:%ci%x09subject:%s%x09sanitized_subject_line:%f'
  git log --pretty=format:'%H%x09%ci%x09%s'
  git log --pretty=format:'%h%x09%ci%x09%s'
  # git log --pretty=format:'{%n  "commit": "%H",%n  "abbreviated_commit": "%h",%n  "tree": "%T",%n  "abbreviated_tree": "%t",%n  "parent": "%P",%n  "abbreviated_parent": "%p",%n  "refs": "%D",%n  "encoding": "%e",%n  "subject": "%s",%n  "sanitized_subject_line": "%f",%n  "body": "%b",%n  "commit_notes": "%N",%n  "verification_flag": "%G?",%n  "signer": "%GS",%n  "signer_key": "%GK",%n  "author": {%n    "name": "%aN",%n    "email": "%aE",%n    "date": "%aD"%n  },%n  "commiter": {%n    "name": "%cN",%n    "email": "%cE",%n    "date": "%cD"%n  }%n},'
)


