DIR="dist/"
if [ -d "$DIR" ]; then
   echo "'$DIR' found and now copying files, please wait ..."
   cp src/*.json src/*.html dist/ 
   echo "Copying assets ..."
   cp -r src/assets dist
else
   echo "Warning: '$DIR' NOT found. Creating '$DIR' ..."
   mkdir $DIR
   echo "Copying files now in '$DIR' ..."
   cp src/*.json src/*.html dist/ 
   echo "Copying assets ..."
   cp -r src/assets dist
fi
