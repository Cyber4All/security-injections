# Developer's Guide

### There are four overall steps to creating an injection:
1) Create module/variant/ folders inside content/ directory
2) Create content.json file
3) Run create.write3() method
4) Retrieve injection file from public/injections/ directory

### Steps in detail:

#### Step 1 
- The term 'module' refers to the module topic, such as 'Integer Error' or 'Cross-Site Scripting'.
- The term 'variant' refers to the particular injection, such as 'CS0 C++' or 'Ruby on Rails'.
- The term 'injection' refers to the final published product, such as 'Integer Error - CS0 C++.html'.
- Folder names should match the headers you wish displayed at the top of the module.
- The variant folder holds all content files specific to its injection. At a minimum, it must have 'content.json', which is used by validate.parse() to generate the module object.

#### Step 2
- The 'JSON Schema.txt' file describes the required layout of 'content.json' files.
- In addition to layout and required keys, each value must be a particular format (as described in 'JSON Schema.txt').
- In lieu of that specific format, any string value (NOT key) may also take the form "./\<filename>", where \<filename> is the name of another file stored in the same module/variant/ folder.
- If a field is "./\<filename>", the contents of that file must fit the format required by 'JSON Schema.txt'.
These requirements are enforced by validate.parse, which replaces each "./\<filename>" value with the contents of the file before testing against schema requirements.

#### Step 3
- The create.write3() method takes the module and variant as parameters identifying the content files to merge with the shared resources (template.html, angular.js, and style.css).
- The method creates two files:
  1) a consolidated .json file suitable for a server to respond with on request. Written to public/\<module>/\<variant>.json
  2) a self-contained .html injection, which asks for a .json file from the server but has default content without it. Written to public/securityinjections/\<module> - \<variant>.html
- A third parameter, dev, can also be given. If dev is true, the injection created is in "dev" mode.
- "Dev" mode creates links to, but does not copy, angular.js and style.css. This facilitates development of those files, since the write3() method does not have to be re-run after every change.
Whenever content changes, or whenever angular.js or style.css changes for non "dev" injections, write3() should be re-run.

#### Step 4
- The public/injections/ directory is a suitable location to store our own repository.
- When sharing links, the 'public/' is ignored. For example, the Integer Error CS0 C++ module can be accessed via "http://hostname.towson.edu/securityinjections/Integer Error/CS0 C++.html"
- If a hard copy of an injection is ever requested, it is simply downloaded from this same location. 
