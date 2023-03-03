# How to create a Security Injection

### TL;DR
1. Clone the security-injections repository
2. Install npm and make public/securityinjections folder
2. Create module/variant folder inside of content/directory
3. Create `content.json` file
4. Run `create.write3()` method
5. Retrieve injection file from public/injections/ directory

To write a Security Injection, you must know JSON, JavaScript, and HTML. A Security Injection consists of one main file, `content.json`, which contains of all the data that will appear on the page. The driver file, called `create.js`, compiles all the necessary files for your Security Injection into one HTML page, which you can open in your browser.

## Step 0: Configuration

To make any additions or modifications to our repository, you need to make a pull request on GitHub first. If you have any questions or problems, please contact info@secured.team.

1. Clone this repository onto your machine.
2. On the root of the repository, create a folder called "public". This will be your repository for all GETtable content, including images, published injections, and minified JSON content.

    `mkdir public`

3. Inside that folder, create another folder called "securityinjections". This is where your Security Injection will be located when you build it.

    `cd public`
    
    `mkdir securityinjections`

2. Install node dependencies (includes: express, cors, uglify-js, uglifycss)
    - Install node and npm
    - Navigate to the root of the repository
    - Type the command: `npm install`
5. All dependencies required should be automatically downloaded and stored in a "node_modules" directory in your project folder.

## Step 1: Get to know the Security Injections repository

Note: If you are an experienced developer, you can read `Developer's Guide.md` for more a more technical explanation.

Navigate to the content folder using a code editor, and browse our current Security Injections modules. Module refers to an individual Security Injection (i.e. "Encapsulation", "Integer Error", "Phishing").

### Example path for browsing:

security-injections/content/Secure Coding/Buffer Overflow/CS0 C++

### Content folder:

The content folder currently contains four different categories of modules:

- Computer Literacy contains modules about cybersecurity practices.
- Development contains example modules. This folder will be a good reference to use when creating your own Security Injection.
- Interdisciplinary contains modules about other subjects.
- Secure Coding contains modules that teach students how to write secure code.
    - There are three different versions: CSO, CS1, and CS2. Some of the modules have all three versions, and others might only have one or two. CS0 is the earliest version and CS2 is the most recent. Note that the differences between versions are usually subtle.
    - Each version typically comes in four different programming languages: Java, C++, Python, and Pseudocode. You can choose how many languages you want your Security Injection to have, and it does not need to be limited to these four.
    - A heading of the form `version` `language` (Ex: "CSO C++") is referred to as a *variant*.

Terminology:

Secure Coding | Buffer Overflow | CSO C++ |
| ----------- | --------------- | ------- |
| Category | Module | Variant |

### Design folder:

The design folder contains several schemas and features in case you need to see syntax or documentation examples:
- `Blank_Cases.json` shows every *unit type* that a security injection can have (i.e. multiple choice questions, checklist questions, etc.) and how you implement them in JSON.
- `Database Schema.docx`
- `HTML Schema.txt`
- `JSON Schema.txt`

### Resources folder:

The resources folder consists of the components that format a Security Injection:
- `angular.js` 
- `style.css`
- `template.html`

### Scripts:

- The `create.js` file compiles HTML, CSS, JS, and JSON into a single HTML document. You will use it to build and test your Security Injection.
- The `server.js` file is a server-side script to handle interaction with clients.
- The `validate.js` file parses JSON content and checks that each field is permissible.

## Step 2: Plan your Security Injection

Now you can brainstorm what you want your Security Injection to look like. In a word document, make an outline of the sections you want to have and the content you would like to cover. Creating this plan will make the process of writing your JSON much quicker.

## Step 3: Write your Security Injection

### Create your JSON file

1. Once you have chosen a name for your Security Injection, you can navigate into the content folder and choose one of the directories whose category best fits your topic. Please refer to the descriptions of the categories under Step 1.
2. Inside of that directory, you will create a new folder with the title of your Security Injection. These titles MUST be the same. 
3. Inside your new folder, create a new file called `content.json`. You can write your JSON document on your own, or you can use one of our templates: details/Blank_Cases.json, content/Development/Demo/, and content/Development/Showcase/. The Showcase module shows all the possible unit types you may want to include.

### Create your additional files (Optional)

If you want to add a code block:
- Create a new file and write the code excerpt you want. Make sure to add it to your JSON as well.
- Example file:
``` 
/*************************
* filename: add.cpp
*************************/
using namespace std;

int AddNums(int a, int b) {
    int sum = a + b;
    return sum;
}
```

If you want to add a code checklist:
- Create a new file called `securityChecklist.html` and write the code excerpt you need.
- Create a new file called `checklist.js`.
    - This program runs the checklist and is required if you want a code checklist that the user can advance through by clicking parts of the code.
    - All of our `securityChecklist.html`'s have the same basic structure with slight variations based on the questions of the checklist. Therefore, we recommend that you copy the code from any current `checklist.js`'s and paste it into your new `checklist.js` file. From here, you can modify it to fit kinds of questions your checklist has.
- Add a security checklist section to your JSON.

### Write your create.write_3 method:

- Open `create.js` and scroll to the bottom. You will see a list of methods commented out. You will add your own method with the form below:
`exports.write_3("My Security Injection", "CS0 Java");`
- When you uncomment a method, the module it specifies will be built when you run the `node create.js` command. So if you only want to build your own Security Injection, comment out all methods except for yours.
- Finally, on line 23, you will see this line of code: `var contentDir = "content/";`. This controls the path to your Security Injection, so make sure to modify it to hit the correct directory.
    - Example:
        `var contentDir = "content/"Secure Coding"/";`

## Step 4: Build and Test your Security Injection

Run `node create.js` to write your Security Injection to the securityinjections folder you created. 
Run `open .` to show it in your finder/files. 

Here, you should see your Security Injection html file. 
    `My_Security_Injection-CS0_Java.html`

When you double click the file, your Security Injection should open in your browser. From here, you can try it yourself and begin the testing and editing process until it works how you like.

Once you are finished, commit and push your changes to your pull request so it can be reviewed by SecureEd developers. Once we approve it, you can merge your branch. If you need to make more changes in the future, you can make another pull request. 

## Step 5: Hosting your Security Injection

Congradulations! You have successfully created your own Security Injection. To host it online, you can choose your own hosting service, or upload your Security Injection to [CLARK](https://clark.center/onion/dashboard). If your Security Injection is approved, SecurEd will host it for you on our servers. 

## Support

For any questions or problems, please contact info@secured.team.