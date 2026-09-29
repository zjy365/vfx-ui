#!/usr/bin/env bash
# Install the vfx-designer skill into coding agent skill directories.
#
# Usage:
#   ./skill/install.sh            # install for both Claude Code and ZCode
#   ./skill/install.sh claude     # install only for Claude Code (~/.claude/skills)
#   ./skill/install.sh zcode      # install only for ZCode (~/.zcode/skills)
#   ./skill/install.sh claude zcode
#
# Idempotent: re-running replaces the previously installed copy.

set -euo pipefail

SKILL_NAME="vfx-designer"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="${SCRIPT_DIR}/${SKILL_NAME}"

die() { printf 'install.sh: %s\n' "$1" >&2; exit 1; }

[ -d "${SRC_DIR}" ] || die "skill source not found: ${SRC_DIR}"
[ -f "${SRC_DIR}/SKILL.md" ] || die "SKILL.md not found in ${SRC_DIR}"

if [ "$#" -eq 0 ]; then
  TARGETS=(claude zcode)
else
  TARGETS=("$@")
fi

install_to() {
  local dest_dir="$1"
  mkdir -p "${dest_dir}"
  rm -rf "${dest_dir}/${SKILL_NAME}"
  cp -R "${SRC_DIR}" "${dest_dir}/${SKILL_NAME}"
  printf 'installed: %s\n' "${dest_dir}/${SKILL_NAME}"
}

for target in "${TARGETS[@]}"; do
  case "${target}" in
    claude)
      install_to "${HOME}/.claude/skills"
      ;;
    zcode)
      install_to "${HOME}/.zcode/skills"
      ;;
    *)
      die "unknown target '${target}' (expected: claude or zcode)"
      ;;
  esac
done
