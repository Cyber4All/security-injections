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
const readline = require('readline');


exports.write_3 = function(grandp, name, variant, dev) {
	if(typeof(dev)==='undefined') dev = false;		// default value for dev

	// CONSTANTS
	var contentDir = "content/" + grandp + "/";

	var resourceDir = "resources/";
	var outputDir = "outputDir/";
	// MORE CONSTANTS
	var contentLoc = name+"/"+variant+"/";
	var templateFile = resourceDir+"template.html";
	var angularFile = resourceDir+"angular.js";
	var styleFile = resourceDir+"style.css";
	var moduleFile = name+'-'+variant+'.html';	// for output

	if(dev) {
		moduleFile = 'DEV-'+moduleFile;
	}

	// Ensure the parent directory exists
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir);
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
	fs.writeFileSync(outputDir+moduleFile, html);
}

const inputFile = process.argv[2] // input file is passed as an argument in node command

if(!inputFile){
	console.log('No file provided as argument');
	process.exit(1);
}

const fileStream = fs.createReadStream(inputFile, 'utf8');

const rl = readline.createInterface({
	input: fileStream,
	output: process.stdout,
	terminal: false
  });
  
rl.on('line', (line) => {  // Read the file line by line
	var words = line.split(','); // splits each line into an array, dividing elements by the comma as text file is in csv format
	var parent = words[0]; // parent folder is the first element
	var grandparent = words[1]; // grandparent folder is the second element
	var greatgrandparent = words[2]; // great  grandparent folder is the third element
	exports.write_3(greatgrandparent, grandparent, parent);
  });
  
  // Handle end of file
  rl.on('close', () => {
	console.log('Finished reading the file.');
  });
