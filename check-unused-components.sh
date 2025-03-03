#!/bin/bash

# Loop through each .js file in the src folder
for file in ./src/**/*.js; do
  echo "Checking file: $file"
  
  # Check for unused imports
  if grep -r -i -q 'import.*' "$file"; then
    unused_imports=$(grep -i 'import' "$file" | sed 's/.*from\s*["'\'']\(.*\)["'\''].*/\1/')
    for import in $unused_imports; do
      if ! grep -r -i -q "$import" "$file"; then
        echo "Unused import in $file: $import"
      fi
    done
  fi

  # Check for unused variables
  unused_vars=$(grep -oP '^\s*(const|let|var)\s+\K\w+' "$file")
  for var in $unused_vars; do
    if ! grep -r -i -q "$var" "$file"; then
      echo "Unused variable in $file: $var"
    fi
  done

  # Check for unused functions (defined but not called)
  functions=$(grep -oP '^\s*function\s+\K\w+' "$file")
  for func in $functions; do
    if ! grep -r -i -q "$func" "$file"; then
      echo "Unused function in $file: $func"
    fi
  done
done
