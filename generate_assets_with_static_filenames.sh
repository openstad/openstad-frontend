#!/bin/bash

# Run the command to generate files
node apostrophe.js apostrophe:generation --create-bundle assets

# Define the directory where the files are located
assets_directory="assets/public/apos-minified"
generation_id_file="assets/data/generation"

# Get the filenames starting with "anon-" and "user-" and ending with ".css" and ".js"
anon_css_file=$(find "$assets_directory" -type f -name "anon-*.css" -print -quit)
anon_js_file=$(find "$assets_directory" -type f -name "anon-*.js" -print -quit)
user_css_file=$(find "$assets_directory" -type f -name "user-*.css" -print -quit)
user_js_file=$(find "$assets_directory" -type f -name "user-*.js" -print -quit)

# Check if environment variables are set and files are found
if [[ -n $STATIC_ASSETS_FILENAME_CONSTANT && -n $anon_css_file && -n $anon_js_file && -n $user_css_file && -n $user_js_file ]]; then
    # Rename the files with the values from environment variables
    mv "$anon_css_file" "$assets_directory/anon-$STATIC_ASSETS_FILENAME_CONSTANT.css"
    mv "$anon_js_file" "$assets_directory/anon-$STATIC_ASSETS_FILENAME_CONSTANT.js"
    mv "$user_css_file" "$assets_directory/user-$STATIC_ASSETS_FILENAME_CONSTANT.css"
    mv "$user_js_file" "$assets_directory/user-$STATIC_ASSETS_FILENAME_CONSTANT.js"
    echo "$STATIC_ASSETS_FILENAME_CONSTANT" > "$generation_id_file"
    echo "Files renamed successfully."
elif [[ -z $anon_css_file || -z $anon_js_file || -z $user_css_file || -z $user_js_file ]]; then
    echo "Not renaming files: Environment variable STATIC_ASSETS_FILENAME_CONSTANT is not set."
else
    echo "Error: .css and .js files not found for renaming."
fi