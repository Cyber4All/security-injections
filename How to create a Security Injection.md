# How to create a Security Injection

## TL;DR
1. Clone the security-injections repository
2. Install npm and make `public/securityinjections` folder
2. Create `module/variant` folder inside of `content/directory`
3. Create `content.json` file
4. Run `exports.write_3()` method
5. Retrieve injection file from `public/injections/` directory

To write a Security Injection, you must be familiar with JSON, JavaScript, and HTML. A Security Injection consists of one main file, `content.json`, which contains of all the data that will appear on the page. The driver file, called `create.js`, compiles all the necessary files for your Security Injection into one HTML page, which you can open in your browser.

# Step 0: Configuration

To make any additions or modifications to our repository, you need to make a [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) on GitHub first.

1. Clone this repository onto your machine. In your terminal, `cd` to a location where you would like to store your project and enter the following command:
 
    `gh repo clone Cyber4All/security-injections`

2. On the root of the security-injections repository (in your code editor, not in the Github website, because we made a copy of it on our computer that we can make changes to), create a folder called "public". This will be your repository for all GETtable content, including images, published injections, and minified JSON content.

    `mkdir public`

3. Inside that folder, create another folder called "securityinjections". This is where your Security Injection will be located when you build it.

    `cd public`
    
    `mkdir securityinjections`

2. Install node dependencies (includes: express, cors, uglify-js, uglifycss)
    - Install [node and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
    - Still while at the root of the security-injections repository, type the command: 
    
        `npm install`

5. All dependencies required should be automatically downloaded and stored in a "node_modules" directory in your project folder.

# Step 1: Get to know the Security Injections repository

Note: If you are an experienced developer, you can read the [Developer's Guide.md](https://github.com/Cyber4All/security-injections/blob/8b9c34a643cff5b0a8a8f24e8f939324358bd944/Developer's%20Guide.md) for more a more technical explanation.

Navigate to the content folder using a code editor, and browse our current Security Injections modules. The term *module* refers to an individual Security Injection (i.e. "Encapsulation", "Integer Error", "Phishing").

### Example path for browsing:

`security-injections/content/Secure Coding/Buffer Overflow/CS0 C++`

## Content folder

The content folder currently contains four different categories of modules.

- *Computer Literacy* contains modules about cybersecurity practices.
- *Development* contains example modules. This folder will be a good reference to use when creating your own Security Injection.
- *Interdisciplinary* contains modules about other subjects.
- *Secure Coding* contains modules that teach students how to write secure code.
    - There are three different versions: CSO, CS1, and CS2. Some of the modules have all three versions, and others might only have one or two. CS0 is the earliest version and CS2 is the most recent. Note that the differences between versions are usually subtle.
    - Each version typically comes in four different programming languages: Java, C++, Python, and Pseudocode. You can choose how many languages you want your Security Injection to have, and it does not need to be limited to these four.
    - A heading of the form `<version>` `<language>` (Ex: `CSO C++`) is referred to as a *variant*.

| Category | Module | Variant |
| ----------- | --------------- | ------- |
| "Secure Coding" | "Buffer Overflow" | "CSO C++" |

## Design folder

The design folder contains several schemas and features in case you need to see syntax or documentation examples.

- `Blank_Cases.json` shows every *unit type* that a security injection can have (i.e. multiple choice questions, checklist questions, etc.) and how you implement them in JSON.
- `Database Schema.docx`
- `HTML Schema.txt`
- `JSON Schema.txt`

## Resources folder

The resources folder consists of the components that format a Security Injection.

- `angular.js` 
- `style.css`
- `template.html`

## Scripts

- The `create.js` file compiles HTML, CSS, JS, and JSON into a single HTML document. You will use it to build and test your Security Injection.
- The `server.js` file is a server-side script to handle interaction with clients.
- The `validate.js` file parses JSON content and checks that each field is permissible.

# Step 2: Plan your Security Injection

Now you can brainstorm what you want your Security Injection to look like. In a word document, make an outline of the sections you want to have and the content you would like to cover. Creating this plan will make the process of writing your JSON much quicker.

# Step 3: Write your Security Injection

## Create your JSON file

1. Once you have chosen a name for your Security Injection, you can navigate into the content folder and choose one of the directories whose category best fits your topic. Please refer to the descriptions of the categories under Step 1.

2. Inside of that directory, you will create a new folder with the title of your Security Injection. These titles MUST be the same. 

3. Inside your new folder, create a new file and name it `content.json`. You can write your JSON document on your own, or you can use one of our templates: `details/Blank_Cases.json`, `content/Development/Demo/`, and `content/Development/Showcase/`. The Showcase module shows all the possible unit types you may want to include.

## Create your additional files (Optional)

### To add a code block:
- Create a new file and write the code excerpt you want. Make sure to add it as a unit to your JSON as well.

Example file:

```java
import java.util.Scanner;
public class PopCheck {
  public static void main(String[] args) {
    Scanner scan = new Scanner(System.in);
    System.out.print("What is the current population? ");
    short pop = scan.nextShort();
    System.out.print("What is the rate of growth? (e.g., for 10% enter 10)");
    short growth = scan.nextShort(); //note that growth is an integer

    float growthRate = growth / 100f;    //convert the growth rate to a float
    System.out.println("Year\tGrowth\tNew Population");
    for (int i = 1; i <= 10; i++)  {
      // calculate increase and new population
      // Force them both to be shorts
      short increase = (short) (pop * growthRate);
      short newpop = (short) (pop + increase);
      System.out.println(i + "\t" + increase + "\t" + newpop);
      pop = newpop;
    }
    System.err.println("Final population is " + pop);
  }
}
```
*program1.java from Integer Error CS2 Java*

### If you want to add a code checklist:

1. Create a new file called `securityChecklist.html` and write the code excerpt you need.

Example file:

```java
import java.util.Scanner;

public class PopCheck {
  public static void main(String[] args) {
    Scanner scan = new Scanner(System.in);
    System.out.print("What is the current population? ");
    <span class="span-Pgm1CL Pgm1CL-vuln-assign-Pgm1CL"><span class="span-Pgm1CL Pgm1CL-var-var-Pgm1CL">short pop </span> = <span class="span-Pgm1CL Pgm1CL-vuln-input-Pgm1CL">scan.nextShort();</span></span>
    System.out.print("What is the rate of growth?
                     (e.g., for 10% enter 10) ");
    <span class="span-Pgm1CL Pgm1CL-vuln-assign-Pgm1CL"><span class="span-Pgm1CL Pgm1CL-var-var-Pgm1CL">short growth</span> = <span class="span-Pgm1CL Pgm1CL-vuln-input-Pgm1CL">scan.nextShort();</span></span>
    <span class="span-Pgm1CL Pgm1CL-vuln-assign-Pgm1CL">float growthRate = <span class="span-Pgm1CL Pgm1CL-vuln-math-Pgm1CL">growth / 100f;</span></span>
    System.out.println("Year\tGrowth\tNew Population");
    for (<span class="span-Pgm1CL Pgm1CL-vuln-assign-Pgm1CL"><span class="span-Pgm1CL Pgm1CL-var-var-Pgm1CL">int i</span> = 1;</span> i <= 10; <span class="span-Pgm1CL Pgm1CL-vuln-math-Pgm1CL">i++</span>) {
      <span class="span-Pgm1CL Pgm1CL-vuln-assign-Pgm1CL"><span class="span-Pgm1CL Pgm1CL-var-var-Pgm1CL">short increase</span> = <span class="span-Pgm1CL Pgm1CL-vuln-math-Pgm1CL">(short) (pop * growthRate);</span></span>
      <span class="span-Pgm1CL Pgm1CL-vuln-assign-Pgm1CL"><span class="span-Pgm1CL Pgm1CL-var-var-Pgm1CL">short newpop</span> = <span class="span-Pgm1CL Pgm1CL-vuln-math-Pgm1CL">(short) (pop + increase);</span></span>
      System.out.println(i+"\t"+increase+"\t" + newpop);
      <span class="span-Pgm1CL Pgm1CL-vuln-assign-Pgm1CL">pop = newpop;</span>
    }
    System.err.println("Final population is " + pop);
  }
}
```
*securityChecklist.html from Integer Error CS2 Java*

2. Create a new file called `checklist.js`.
    - This program runs the checklist and is required if you want a code checklist that the user can advance through by clicking parts of the code.
    - All of our `securityChecklist.html`'s have the same basic structure with slight variations based on the questions of the checklist. Therefore, we recommend that you copy the code from any current `checklist.js`'s and paste it into your new `checklist.js` file. From here, you can modify it to fit kinds of questions your checklist has.

Example file:

```javascript
$(document).ready(function() {
	
	var name = "Pgm1CL";
	// track id of the current checklist task (initialized later)
	var current;
	// track which spans have been clicked appropriately
	var clicked = [];
	// track which spans are needed for current question
	var waitingOn = [];
	// helps reset prog bar for each question
	var previousWaitingOnCount = 0;

	/**
	 * returns the id of the next question, and rearranges class indicators
	 * if question is not provided, initialize the first question
	 */
	function advance(question) {
		var next;

		// remove highlight from previous question
		$(".span-" + name).removeClass("si-code-clicked");

		if(typeof(question)==='undefined') {
			next = name+"-var-var"; // first question
		} else {
			$("#"+question).prop('checked', true); // check off question

			// timeout allows progress bar to show when full
			setTimeout(function(){
				// take focus away from current question
				$("#"+question+"-label").removeClass("si-checklist-active");
				$("#" + question + "-progress-label").addClass("progress-hidden");
				$("#" + question + "-progress-label").removeClass("progress");
			}, 500);

			switch(question) { // here's where flow is really controlled
				case name+"-var-var":		
					next = name+"-vuln-input";	
					break;
				case name+"-vuln-input":	
					next = name+"-vuln-math";	
					break;
				case name+"-vuln-math":		
					next = name+"-vuln-assign";	
					break;

				default:	
				return;	// input invalid or question is complete
			}
		}

		// focus on next question
		$("#"+next+"-label").addClass("si-checklist-active");
		// remove hidden class from progress bar when user clicks correct answer
		$("#" + next + "-progress-label").removeClass("progress-hidden");
		// add the progress bar fill
		$("#" + next + "-progress-label").addClass("progress");

		waitingOn = []; // gather spans remaining to be clicked

		$(".span-"+name).each(function(index) {
			if( $(this).hasClass(next+"-"+name) ) {
				waitingOn.push(index);
			}
		});
		return next;
	}

	current = advance();

	// Handles score for each individual question
	$(".span-"+name).each(function(index) {

		$(this).on('click', function() {
			span = $(this);

			// continue if user is currently supposed to click this span, and hasn't already
			if(span.hasClass(current+"-"+name) && $.inArray(index,clicked) < 0 ) {
				clicked.push(index);	// 	note that it's been clicked, programmatically
				span.addClass("si-code-clicked");	//	note that it's been clicked, graphically

				// logic for increasing the progress bar
				let currentProgress = ((clicked.length - previousWaitingOnCount)/waitingOn.length)*100;
				document.getElementById(current + "-progress-data-label").style.width = `${currentProgress}%`;

				// Check if 'current' question is finished yet
				var finished = true;
				for(i in waitingOn) {
					finished &= $.inArray(waitingOn[i],clicked) >= 0;
				}

				// if it is, go to next question
				if (finished) {
					// highlights correct answer before moving on to next question
					setTimeout(function(){
						previousWaitingOnCount += waitingOn.length;
						current = advance(current);
					}, 500);
				}
			}
		});
	});
});
```

3. Add a security checklist unit to your JSON.

## Write your exports.write_3 method

- Open `create.js` and scroll to the bottom. You will see a list of methods commented out. If your Security Injection belongs to the Secure Coding directory, you will add your own method with the form below:

`exports.write_3("Title of my Security Injection", "Variant");`

- If your Security Injection belongs to the Computer Literacy of Interdisciplinary directory, it will not have different variants, so you can use the form below: 

`exports.write_3("Directory", "Title of my Security Injection")`

- When you uncomment a method, the module it specifies will be built when you run the `node create.js` command. So if you only want to build your own Security Injection, comment out all methods except for yours.

- Finally, on line 23, you will see this line of code: `var contentDir = "content/";`. This controls the path to your Security Injection, so make sure to modify it to hit the correct directory.
    - Example (Secure Coding):
        `var contentDir = "content/Interdisciplinary/";`
    - If your module is not in Secure Coding, leave it at `"content/"`

# Step 4: Build and Test your Security Injection

Run `node create.js` to write your Security Injection to the securityinjections folder you created. 

Run `open .` to show it in your finder or files. 

Here, you should see your Security Injection html file. 

Examples:

`My_Security_Injection-Variant.html`

`Directory-My_Security_Injection.html`

When you double click the file, your Security Injection should open in your browser. From here, you can try it yourself and begin the testing and editing process until it works how you like.

Once you are finished, commit and push your changes to your pull request so it can be reviewed by SecureEd developers. Once we approve it, you can merge your branch. If you need to make more changes in the future, you can make another pull request. 

# Step 5: Hosting your Security Injection

Congradulations! 

You have successfully created your own Security Injection. 

To host it online, you can choose your own hosting service, or upload your Security Injection to [CLARK](https://clark.center/onion/dashboard). If your Security Injection is approved, SecurEd will host it for you on our servers. 

# Support

For any questions or problems, please contact info@secured.team.