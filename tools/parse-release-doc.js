if (args.length !== 1) {
	println("Usage is : tbscript parse-release-doc.js {version}");
	exit(2);
}

var release = args[0].trimPrefix("v");

var reltag = release.replace(/\./g, "_");

var pdfNotes = {
	"QUICK-INSTALL": "Just 2 pages of installation instructions",
	"IWO": "Notes on configuring TbUtil for use with IWO.",
	"README": "TbUtil overview",
	"BUILDING": "How to build tbutil and its related software from source",
	"EXAMPLES": "Brief description of some example scripts",
	"JS-ADDINS": "Extensions to the JavaScript language implemented in tbscript.",
	"REFERENCE": "List of the Turbonomic REST API functions implemented by tbscript.",
	"RUNNING-PLANS": "Some notes about running Turbonomic plans using tbscript.",
	"PLUGINS": "What is a TbUtil plugin, and how to write one?",
	"excel-plugin": "A plugin to allow Excel spread sheets to be created by tbscript.",
	"smtp-plugin": "A plugin to allow tbscript to send emails using the SMTP protocol.",
	"sql-plugin": "The SqLite3 and MySQL database access plugins for tbscript.",
	"mysql-plugin": "MySQL database access plugin for tbscript.",
	"sqlite3-plugin": "SqLite3 database access plugin for tbscript.",
	"xml-plugin": "Allow reading and writing of XML documents in tbscript.",
	"vcenter-plugin": "Allow access to a subset of the vCenter API from tbscript."
};


//== ZIP Files ==========================================================================

function getZip(os) {
	return "../../tbutil-"+reltag+"-"+os+".zip";
}

function zipExists(os) {
	return readDir(getZip(os)).length > 0 ? true : false;
}

function getZipSum(os) {
	return commandPipe("md5sum", [ getZip(os) ]).split(/\s/)[0];
}


//== TGZ Files ==========================================================================

function getTgz(flavour) {
	return "../../tbutil-"+flavour+"-k8s-"+release+".tgz";
}

function tgzExists(flavour) {
	return readDir(getTgz(flavour)).length > 0 ? true : false;
}

function getTgzSum(flavour) {
	return commandPipe("md5sum", [ getTgz(flavour) ]).split(/\s/)[0];
}


//== PDF Files ==========================================================================

function getPdfNames() {
	var mdNames = getMdNames();
	return readDir("../../tbutil-"+reltag+"/*.pdf").map(path => {
		var p = path.split("/");
		return p[p.length-1];
	}).filter(name => ( !mdNames.contains(name.trimSuffix(".pdf")+".md" ) ));
}

function getPdf(doc) {
	return "../../tbutil-"+reltag+"/"+(doc.trimSuffix(".pdf"))+".pdf";
}

function pdfExists(doc) {
	if (doc === "*") {
		return getPdfNames().length > 0;
	}
	return readDir(getPdf(doc)).length > 0 ? true : false;
}

function getPdfSum(doc) {
	return commandPipe("md5sum", [ getPdf(doc) ]).split(/\s/)[0];
}

function getPdfNote(doc) {
	return pdfNotes[doc.trimSuffix(".pdf")];
}


//== MD Files ===========================================================================

function getMdNames() {
	var files1 = readDir("../docs/*.md").map(path => {
		var p = path.split("/");
		return p[p.length-1];
	});
	var files2 = readDir("../docs/K8S/*.md").map(path => {
		var p = path.split("/");
		return "K8S/" + p[p.length-1];
	});
	var files = _.flatten([files1, files2]);
	files.sort();
	return files;
}

function getMd(doc) {
	return "../docs/"+(doc.trimSuffix(".md"))+".md";
}

function mdExists(doc) {
	return readDir(getMd(doc)).length > 0 ? true : false;
}

function getMdSum(doc) {
	return commandPipe("md5sum", [ getMd(doc) ]).split(/\s/)[0];
}

function getMdNote(doc) {
	var rtn = null;
	try {
		loadText(getMd(doc)).forEach(line => {
			if (rtn === null && line.hasPrefix("# ")) {
				rtn = line.trimPrefix("# ");
			}
		});
	} catch (ex) { }
	return rtn;
}

//=======================================================================================

function getBinary() {
	return "../../tbutil-"+reltag+"/linux/tbutil";
}

function getUrlBase() {
	return "https:/turbonomic/tbutil/releases/download/v" + release;
}

debugger;

//=======================================================================================

var bin = getBinary("linux");
if (!exists(bin)) {
	woops(bin+" does not exist");
}

var helpText = commandPipe("sh", [ "-c", getBinary("linux") + " || true" ]);

var reldate = new Date(helpText.match(/Commit Time : (....-..-..)/)[1]).format("2 Jan 2006");

var funcs = {
	release: function() { return release; },
	release_date: function() { return reldate; },
	reltag: function() { return reltag; },

	urlbase: getUrlBase,

	zipsum: getZipSum,
	tgzsum: getTgzSum,
	tgzExists: tgzExists,
	zipExists: zipExists,

	pdfsum: getPdfSum,
	pdfExists: pdfExists,
	getPdfNames: getPdfNames,
	getPdfNote: getPdfNote,

	mdsum: getMdSum,
	mdExists: mdExists,
	getMdNames: getMdNames,
	getMdNote: getMdNote
};

print(template("template.md", {}, funcs));

