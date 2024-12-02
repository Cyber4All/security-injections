/**
 *  Parses JSON content and checks that each field is permissible
 *  
 *  Goals:
 *  	replace any placeholders in content.json with appropriate file contents
 *  	throw error if content does not match requirements in prereqs
 *  	throw error if content does not match JSON schema
 *  
 *  Parameters:
 *  	content - content object. Each field is the contents of its own file
 *  			MUST contain 'content', the JSON content of the module
 *  	prereqs - additional constraints
 *  			MUST contain:
 *		 			name - the module name which must be matched
 *  				variant - the module variant which must be matched
 *  
 *  Return:
 *  	object of parsed JSON content
 */

// REQUIRE
var UglifyJS = require("uglify-js");

exports.parse = function(content, prereqs) {
	
	var module;
	
	// check if content exists
	if(!content['content.json']) {
		throw "Module must have a content.json file";
	}
	
	// check if content is valid JSON
	try {
		module = JSON.parse(content['content.json']);
	} catch(e) {
		throw "Content is not valid JSON: "+e;
	}
	
	// // check if module and variant fields match
	if(prereqs.name != module.name || prereqs.variant != module.variant) {
		throw "Module name and variant must match file location and name";
	}
	
	// deep search: replace all values matching "./<file>" with the file contents
	var re = /^\.\/(.+)$/;
	function fillContent(obj) {
		for(key in obj) {
			if(typeof(obj[key]) === "object") {	// also catches arrays
				fillContent(obj[key]);
			} else if(typeof(obj[key]) === "string") {		// check if string matches include syntax
				var match = re.exec(obj[key]);
				if(match) {
					// check if content even contains this file
					if(!content.hasOwnProperty(match[1])) {
						throw "Content "+match[1]+" not found.";
					}
					
					if(key == "js") {	// if this is for a script, minify it
						obj[key] = UglifyJS.minify(content[match[1]], {fromString: true}).code;
					} else {			// otherwise, just include it
						obj[key] = content[match[1]];
					}
				}
			}
		}
	}
	fillContent(module);
	
	
	
	// TODO: all validation required to ensure content satisfies "design/JSON Schema.txt"
	
	// TODO (ongoing) maintain functionality for new unit types and question modes
	
	return module;
}