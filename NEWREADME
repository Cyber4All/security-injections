# How to create a Security Injection

## Introduction

A Security Injection is a self-contained learning module that organizations and educators can use to teach students or trainees a certain skill or concept. They were were created by Dr. Blair Taylor of Towson University, who named them Security Injections because her purpose was to make it easy for educators to inject secure coding principles into their introductory Computer Science courses.

### From a user's perspective: 
Security Injection typically looks like a webpage with a background section, multiple choice questions, short-answer questions, lab assignment(s), and a completion certificate. Note that they are used for teaching purposes only, and not for testing or grading. If you want to take a look at a Security Injection from a user's point of view, please visit [the collection on on CLARK](https://clark.center/c/secinj).

### From a developer's perspective:
To write a Security Injection, you must know how to write in JSON format, JavaScript, and HTML. A Security Injection consists of one main file, `content.json`, which holds all the data that will appear on the page. There can also be a `.html` file if you would like to include a code block, and a `checklist.js` file if you would like to have a checklist section. There is a driver file called `create.js` that compiles all the necessary files together into one `.html` link, which is the link that will open up your Security Injection in a browser. 

## Step 1: Get to know the Security Injections repository

Clone this repository onto your machine from GitHub, navigate to the `content` folder using a code editor, and browse our current Security Injections modules. 

### Example route for browsing:

`security-injections/content/Secure Coding/Buffer Overflow/CS0 C++`

The **content** folder currently contains four different categories of modules:

- `Computer Literacy` contains modules related to cybersecurity practices.
- `Development` contains dummy modules, including a demo. This folder will be a good reference to use when creating your own Security Injection.
- `Interdisciplinary` contains modules related to disciplines outside of Cybersecurity.
- `Secure Coding` contains modules that teach students how to write secure code. There are several attributes to know if you want to write a Security Injection dealing with coding practices.
    - There are three different versions: **CSO**, **CS1**, and **CS2**. Some of the modules have all three versions, and others might only have one or two. CS0 is the earliest version and CS2 is the most recent, although the differences between the three are usually subtle.
    - These versions typically teach four different programming languages: **Java**, **C++**, **Python**, and **Pseudocode**. You can choose how many languages to make your Security Injection teach, and it does not need to be limited to these four.
    - A heading of the form "Version Language" (Ex: "CSO C++") is sometimes referred to as a **variant**

The **design** folder contains several schemas and features in case you need to see syntax or documentation examples:
- `Blank_Cases.json` shows every feature that a security injection can have (i.e. multiple choice questions, checklist questions, etc.) and how you implement them in JSON.
- `Database Schema.docx`
- `HTML Schema.txt`
- `JSON Schema.txt`

The **resources** folder consists of the components that format a Security Injection:
- `angular.js` 
- `style.css`
- `template.html`

The **create.js** file compiles HTML, CSS, JS, and JSON into a single HTML document. You will need to use it when you want to build and test your Security Injection.

## Step 2: Plan your Security Injection

Now that you have an idea of what makes up Security Injections, you can brainstorm what you want yours to look like. In a word document, make an outline of the sections and content you would like to have featured in your own Security Injection. Creating this plan will make the process of writing your JSON much quicker.

## Step 3: Create your JSON file

To make any additions or modifications to our repository, you will first need to make a pull request on GitHub. 

Once you have chosen a name for your Security Injection, you can navigate into the content folder and choose one of the folders whose category best fits your topic. Please refer to the descriptions of the categories under Step 1. If you feel the need to make a new folder, please reach out to us at info@secured.team. 

Inside of that folder, you are going to create a new folder with the title of your Security Injection. The title of this folder and your Security Injection MUST be the same. 

Now that you have your folder, you will create your module and call it `content.json`. You can create your own JSON document from scratch, or you can use one of our templates: `details/Blank_Cases.json`, `content/Development/Basic/`, `content/Development/Demo/`, and `content/Development/Showcase/`.







which toggles style elements of the HTML webpage that will be generated ()

TDLR Requirements section (from IC Manual)