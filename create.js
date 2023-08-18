/**
 * Compiles HTML, CSS, JS, and JSON into single HTML document.
 *
 * Parameters:
 * 		name - module name (also location of JSON content)
 * 		variant - module variant (also file-name of JSON content)
 * 		dev - boolean indicating if this file should include CSS and JS literally or not
 *
 * Phase 2: functions for both 3.0 (which we have) and 1.0
 */

// REQUIRE
var fs = require('fs');
var UglifyJS = require("uglify-js");
var UglifyCSS = require('uglifycss');
var Validate = require("./validate.js");


exports.write_3 = function(name, variant, dev) {
	if(typeof(dev)==='undefined') dev = false;		// default value for dev

	// CONSTANTS
	var contentDir = "content/Secure Coding/";	// TODO: Change this variable to generate different modules in different folders

	var resourceDir = "resources/";
	var publicDir = "public/";
	var moduleDir = publicDir+"securityinjections/";
	// MORE CONSTANTS
	var contentLoc = name+"/"+variant+"/";
	var templateFile = resourceDir+"template.html";
	var angularFile = resourceDir+"angular.js";
	var styleFile = resourceDir+"style.css";
	var moduleFile = name+'-'+variant+'.html';	// for output
	if(dev) {
		moduleFile = 'DEV-'+moduleFile;
	}

	//Make folder for blank JSON
	var newFolderDir = "public/"+name;
	if (!fs.existsSync(newFolderDir)){
	    fs.mkdirSync(newFolderDir);
	}

	// STEP 1 - load all content files and parse/validate/minify into single JSON string
	var content = {}									// parameters for parsing
	var files = fs.readdirSync(contentDir+contentLoc);				// get all content files
	for(i in files) {
		content[files[i]] = ""+fs.readFileSync(contentDir+contentLoc+files[i]);
	}

	var prereqs = { name, variant };
	var module = Validate.parse(content, prereqs);
	content = JSON.stringify(module);					// content minified

	// STEP 2 - load/minify each resource file
	var template = fs.readFileSync(templateFile);
	if(!dev) {	// in dev mode, we don't need CSS of JS content
		var stylecode = fs.readFileSync(styleFile).toString();
		var style = UglifyCSS.processString(stylecode);
		var code = fs.readFileSync(angularFile).toString();
		var angular = UglifyJS.minify(code).code;
		}

	// STEP 3 - craft new file-string
	var html = '';
	// header
	html += '<head>'+'\n';
	html += '\t'+'<meta charset="UTF-8">'+'\n';
	html += '\t'+'<meta http-equiv="X-UA-Compatible" content="IE=edge">'+'\n';
	html += '\t'+'<meta name="viewport" content="width = device-width, initial-scale = 1">'+'\n';
	html += '\t'+'<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">'+'\n';
	html += '\t'+'<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>'+'\n';
	html += '\t'+'<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>'+'\n';
	html += '\t'+'<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-sanitize.js"></script>'+'\n';
	html += '\t'+'<script src = "https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-cookies.js"></script>'+'\n';
	html += '\t'+'<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.debug.js"></script>'+'\n';
	html += '\t'+'<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>'+'\n';

	// Google Analytics setup
	html +=
	`\t<!-- Global site tag (gtag.js) - Google Analytics -->\n
	\t<script async src="https://www.googletagmanager.com/gtag/js?id=UA-120134925-2"></script>\n
	\t<script>\n
	\twindow.dataLayer = window.dataLayer || [];\n
	\tfunction gtag(){dataLayer.push(arguments);}\n
	\tgtag('js', new Date());\n
	\tgtag('config', 'UA-120134925-2');\n
	\t</script>\n`;


	html += '\t'+'<title>'+'Security Injection: '+module.name+' - '+module.variant+'</title>'+'\n';
	if(dev) {	// in dev mode, link to sheets rather than including source
		html += '\t'+'<link rel="stylesheet" href="../../'+styleFile+'">'+'\n';
		html += '\t'+'<script src="../../'+angularFile+'"></script>'+'\n';
	} else {
		html += '\t'+'<style>'+'\n'+style+'\n</style>'+'\n';
		html += '\t'+'<script>'+angular+'</script>'+'\n';
	}
	html += '</head>'+'\n';
	// body
	html += '<body>'+'\n';
	html += template+'\n';
	html += '\t'+'<script type="text/plain" id="name">'+module.name+'</script>'+'\n';
	html += '\t'+'<script type="text/plain" id="variant">'+module.variant+'</script>'+'\n';
	html += '\t'+'<script type="text/plain" id="default">'+content+'</script>'+'\n';
	html += '</body>';


	// Make the URL more readable, avoiding %20 for space characters
	moduleFile = moduleFile.split(' ').join('_');

	// STEP 4 - write string to output file
	fs.writeFileSync(publicDir+contentLoc.slice(0,-1)+".json", content);
	fs.writeFileSync(moduleDir+moduleFile, html);
}

// Phase 2: also create a 1.0 write function



//Phase 2: module should not have "MAIN"
// MAIN

// ------------------------------------------
// Demo Modules
// ------------------------------------------

// exports.write_3("Integer Error", "CS0 C++ Sample");

// ------------------------------------------
// Modules
// ------------------------------------------

// 'Secure Coding' Folder -------------------

// exports.write_3("Best Practices for Secure Variables", "CS1 Java");
exports.write_3("Buffer Overflow", "CS0 C++");
// exports.write_3("Buffer Overflow", "CS0 Java");
// exports.write_3("Buffer Overflow", "CS0 Java"); 
// exports.write_3("Buffer Overflow", "CS0 Pseudocode");
// exports.write_3("Buffer Overflow", "CS0 Python");
// exports.write_3("Buffer Overflow", "CS0 Pseudocode");
// exports.write_3("Buffer Overflow", "CS1 C++");
// exports.write_3("Buffer Overflow", "CS1 Java");
// exports.write_3("Buffer Overflow", "CS1 Python");
// exports.write_3("Buffer Overflow", "CS2 C++");
// exports.write_3("Buffer Overflow", "CS2 Java");
// exports.write_3("Cross-Site Scripting", "PHP");
// exports.write_3("Cross-Site Scripting", "Ruby on Rails");
// exports.write_3("Data Hiding","CS0 C++");
// exports.write_3("Data Hiding","CS2 Java");
// exports.write_3("Data Hiding","CS2 C++");
// exports.write_3("Data Hiding","CS2 Python");
// exports.write_3("Encapsulation", "CS2 C++");
// exports.write_3("Encapsulation", "CS2 Java");
// exports.write_3("Exception Handling", "CS2 C++");
// exports.write_3("Exception Handling", "CS2 Java");
exports.write_3("Input Validation", "CS0 C++");
// exports.write_3("Input Validation", "CS0 Java");
// exports.write_3("Input Validation", "CS0 Python");
// exports.write_3("Input Validation", "CS0 Pseudocode");
// exports.write_3("Input Validation", "CS1 C++");
// exports.write_3("Input Validation", "CS1 Java");
// exports.write_3("Input Validation", "CS1 Python");
// exports.write_3("Input Validation", "CS2 C++");
// exports.write_3("Input Validation", "CS2 Java");
exports.write_3("Integer Error", "CS0 C++");
// exports.write_3("Integer Error", "CS0 Java");
// exports.write_3("Integer Error", "CS0 Pseudocode");
// exports.write_3("Integer Error", "CS1 C++");
// exports.write_3("Integer Error", "CS1 Java");
// exports.write_3("Integer Error", "CS2 C++");
// exports.write_3("Integer Error", "CS2 Java");
exports.write_3("Software Development Lifecycle", "CS0 C++");
// exports.write_3("Software Development Lifecycle", "CS0 Java");
// exports.write_3("Software Development Lifecycle", "CS0 Python");
// exports.write_3("SQL Injections", "Introduction");

// 'Secure Coding/Other Modules' Folder -----

// exports.write_3("Industrial Control Systems", "Introduction");
// exports.write_3("Mobile Risk Management", "Introduction");

// 'Computer Literacy' Folder ---------------

// exports.write_3("Computer Literacy", "Cryptography");
// exports.write_3("Computer Literacy", "Passwords");
// exports.write_3("Computer Literacy", "Phishing");
// exports.write_3("Computer Literacy", "Social Networking Security");

// 'Interdisciplinary' Folder ---------------

// exports.write_3("Business", "Risk Assessment");
// exports.write_3("Business", "CAT");
// exports.write_3("Business", "Business Use Security");
// exports.write_3("Business", "Government Use Security");
// exports.write_3("Business", "Personal Use Security");
// exports.write_3("Healthcare Management", "Risk Management");
// exports.write_3("Healthcare Management", "HIPPA");
// exports.write_3("Healthcare Management", "Hipaa");
// exports.write_3("Mitigating Risk", "Value Modeling");
// exports.write_3("Security Training for Election Judges", "Ensuring Pollbook Security");
// exports.write_3("Security Training for Election Judges", "Ensuring Provisional Voting Security");
// exports.write_3("Security Training for Election Judges", "Operating the Scanning Unit");
// exports.write_3("Security Training for Election Judges", "Ensuring Pollbook Security Anne Arundel");
// exports.write_3("Security Training for Election Judges", "Ensuring Provisional Voting Security Anne Arundel");
// exports.write_3("Security Training for Election Judges", "Operating the Scanning Unit Anne Arundel");
// exports.write_3("Security Training for Election Judges", "Chief Judge Security Anne Arundel");
// exports.write_3("Security Training for Election Judges", "Ensuring Ballot-Marking Devices Security Anne Arundel");
// exports.write_3("Security Training for Election Judges", "Ensuring Voting Booth Security Anne Arundel");
// exports.write_3("Security Training for Election Judges", "Same Day Registration");