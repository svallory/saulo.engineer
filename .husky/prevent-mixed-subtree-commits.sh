#!/bin/sh
# Prevent commits that include both subtree changes and other changes.

# Specify the path to your subtree directory
SUBTREE_PATH='path/to/subtree'

# Get a list of staged files
STAGED_FILES=$(git diff --cached --name-only)

# Initialize counters for subtree changes and other changes
SUBTREE_CHANGES=0
OTHER_CHANGES=0

# Loop over the list of staged files
for FILE in $STAGED_FILES; do
  if [[ "$FILE" == "$SUBTREE_PATH"* ]]; then
    SUBTREE_CHANGES=$((SUBTREE_CHANGES + 1))
  else
    OTHER_CHANGES=$((OTHER_CHANGES + 1))
  fi
done

# If there are changes in both subtree and other parts of the repo, abort the commit
if [ $SUBTREE_CHANGES -gt 0 ] && [ $OTHER_CHANGES -gt 0 ]; then
  echo "Error: Commit includes changes to both the subtree and other files."
  echo "Please commit subtree changes separately from other changes."
  exit 1
fi

# If this point is reached, the commit is allowed to proceed
exit 0
