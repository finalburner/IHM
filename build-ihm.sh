fileres="version-info.res"
file="version-info.rc"
if [ -f "$file" ]
then
  pkg -t latest-win-x64 ihm.js -d -c package.json -o ihm.exe
  C:/ResourceHacker/ResourceHacker.exe -open version-info.rc -action compile -save version-info.res
  C:/ResourceHacker/ResourceHacker.exe -open ihm.exe -resource version-info.res -action add -save ihm.exe
  rm $file
  rm $fileres

else
	echo "$file not found."
fi
