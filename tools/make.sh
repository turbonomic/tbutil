version="$1"
if [ "$version" = "" ]; then
	echo "Usage: sh make.sh {version}"
	exit 2;
fi

tbscript parse-release-doc.js $version template.md > ../docs/release.md
tbscript parse-release-doc.js $version k8s-template.md > ../docs/K8S.md
