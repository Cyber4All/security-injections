/**
 * Client-side script to control module process
 * Integrated into module file with create.js
 *
 * Assumes html page loaded up angular js and jquery
 */
var app = angular.module("modApp", ['ngSanitize', 'ngCookies']);		// the angular "app"
app.controller("modCtrl", ["$scope", "$http", "$cookies", "$sce", "$document", function($scope, $http, $cookies, $sce, $document) {	// the angular "controller"
navigator.sayswho = (function () {
		var ua = navigator.userAgent, tem,
			M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
		if (/trident/i.test(M[1])) {
			tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
			return 'IE ' + (tem[1] || '');
		}
		if (M[1] === 'Chrome') {
			tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
			if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
		}
		M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
		if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
		return M.join(' ');
})();
	/**
	 * helper method to initialize module object
	 *
	 * PARAMETERS: content - object containing all content for module
	 */
	function initModule(content) {
		$scope.contentError = false;
		$scope.browserError = false;
		var version = navigator.sayswho.split(" ");
		console.log(version[0]);
		if (version[0] == "MSIE" || version[0] =="IE") {
			$scope.browserError = true;
		}

		$scope.module = content;
		$scope.module.sections.push({header:"Final Page"});		// section for completion page
		if(content.hasOwnProperty('objectives')){
			$scope.module.sections.splice(0,0,{header:"Learning Objectives"});
			$scope.currentsectionIndex = 1;
			$scope.sectionscompleted = 1;
			$scope.currentsection = $scope.module.sections[1];
		}
		else{
			$scope.currentsectionIndex = 0;
			$scope.currentsection = $scope.module.sections[0];
		}

		checkWindowWidth();
		window.onresize = checkWindowWidth;

		getCookies();//on Module load attempt to fill with cookies and redirect if needed
	}

	/**
	 * Checks and sets toggleNav if on smaller screens
	 */
	function checkWindowWidth() {
		$scope.toggleNav = undefined;
		if (window.innerWidth <= 850) {
			$scope.toggleNav = true;
		}
	}

	/**
	 * helper method to initialize score object
	 *
	 * PARAMETERS: content - object containing all content for module
	 */
	function initScore(content) {
		$scope.score = {							// initialize score report
				name 	: content.name,
				variant	: content.variant,
				sections: []
		}

		for (i in content.sections) {				// each section has header, time...
			section = {
				header	: content.sections[i].header,
				time	: 0,
				questions: {}
			}

			for (j in content.sections[i].units) {	// ...and (question_id : # of attempts) pairs
				unit = content.sections[i].units[j];
				if((unit.type == "question" && !unit.ignored) || unit.type == "checklist") {
					section.questions[unit.id] = 1;	// all graded questions are "attempted" at least once
				}
			}

			$scope.score.sections.push(section);
		}
	}

	/**
	 * method to initialize module content
	 *
	 * NETWORK: sends GET request to server, for JSON content
	 *
	 * GET content from server
	 * IF server responds, use that content
	 * ELSE
	 * 	IF page has default content, use that content
	 * 	ELSE show error
	 */
	$scope.loadContent = function() {
		var request = 					// JSON location on server
			$scope.repo+$("#name").html()+'/'+$("#variant").html()+".json";

		console.log("Loading content from "+request);

		$scope.contentError = false;	// assume content is loaded, until it isn't

		$http.get(request)				// send GET request
			 .then(function(response) {			// response received from server

				 initModule(response.data);
				 initScore(response.data);

			 },  function(response) {			// response not received
				 if($("#default").length) {				// module has 'default' JSON content
					 console.log("* No response - using default");
					 var content = JSON.parse($("#default").html());

					 initModule(content);
					 initScore(content);

				 } else {								// no content to work with
					 console.log("* No response - try again");
					 $scope.contentError = true;
				 }
			 });

	}

	// initialize all non-function fields
	function initialize() {
		$scope.repo = "https://security-injections.towson.edu";		// IP address of our production server TODO: change as needed
		$scope.sectionscompleted = 0;				// start from the first section
		$scope.loadContent();						// initialize module object and contentError boolean
		loadCoverPage();
		$scope.form = {}							 // initialize submission form
		$scope.starttime = new Date();				// initialize start time, to track each section's completion time
	}


	initialize();


			$scope.redirectCookie = function(){
					var progressCookie = $cookies.get(moduleCookie + 'progress');
					$scope.sectionscompleted = parseInt(progressCookie);
					$scope.currentsectionIndex = $scope.sectionscompleted;
					$scope.currentsection = $scope.module.sections[$scope.currentsectionIndex];
			}

	//This method should retrieve all cookies.
			function getCookies(){
				moduleCookie = $scope.module.name + "-" + $scope.module.variant + "-";

				if($cookies.get(moduleCookie + 'progress')!= null){
					$scope.redirectCookie();
				}

				cookieAnswer = $cookies.getObject(moduleCookie + 'forms');
				console.log(cookieAnswer);
				n = 0;
				if(typeof(cookieAnswer)==='undefined'){
					console.log("No cookies to be loaded");
				}
				else{
				for (i in $scope.module.sections) {
					for (q in $scope.module.sections[i].units){
							unit = $scope.module.sections[i].units[q];
						if(unit.type == "question") {
							switch(unit.mode) {
								case "radio":
									if(cookieAnswer[n]!=null && cookieAnswer[n].prompt == unit.prompt ){
										for(c in unit.choices){
											if (unit.choices[c].id == cookieAnswer[n].answer){
												unit.checked = true;
												unit.value = cookieAnswer[n].answer;
											}
										}
										n++;
									}
									break;
								case "checkbox":
									if(cookieAnswer[n]!=null){
										for(c in unit.choices){
											if (unit.choices[c].id == cookieAnswer[n].prompt[c]){
												if((cookieAnswer[n].answer[c] == true)){
													unit.choices[c].value=true;
												}
												else unit.choices[c].value=false;
											}

										}
										n++;
									}
									break;
								case "textarea":
								if(cookieAnswer[n]!=null && cookieAnswer[n].prompt == unit.prompt){
									unit.value = cookieAnswer[n].answer;
									n++;
									}
									break;
								}
							}
						else if(unit.type == "chart"){
							if (cookieAnswer[n]!= null){
								unit.asset = cookieAnswer[n].Asset;
								unit.threat = cookieAnswer[n].Threat;
								unit.vulnerabilities = cookieAnswer[n].Vulnerabilities;
								unit.probability = cookieAnswer[n].Probability;
								unit.harm = cookieAnswer[n].Harm;
								unit.risk = cookieAnswer[n].Risk;
								unit.mitigation = cookieAnswer[n].Mitigation;
								n++;
							}
						}
						else if(unit.type == "checklist") {
							//Having trouble with checklist. Disregading for now
							/*if(cookieAnswer[n]!=null){
								for (j in unit.list) {
									group = unit.list[j];
									group_id = unit.id+"-"+group.id;

									for (k in group.items) {
										item = group.items[k];
										item_id = group_id+"-"+item.id;


										if (item_id == cookieAnswer[n].prompt[k]){
											item.value = cookieAnswer[n].answer[k];
										}
										else{
											item.value = false;
										}
										//console.log(item.value + "          "+ cookieAnswer[n].answer[k]);
										//console.log(item_id+"    "+cookieAnswer[n].prompt[k]);
									}
								}
								n++;
							}
							*/

					}
				}
			}
		}
	}

	/*
	 * functionality to save and progress to cookies (or decide to not bother)
	 *  information we want is contained in
	 * 		$scope.module.sections[each].units[each whose type is 'question' and mode is 'textarea']
	 * 			.prompt
	 * 		and .value
	 *
	 */
	 $scope.saveCookie = function (completed) {
		



		 var today = new Date();
		 var expireTime = new Date(today);
		 expireTime.setMinutes(today.getMinutes() + 120);//expires in 5 hours

		 $cookies.put(moduleCookie + 'progress', completed, {'expires': expireTime});
		 $cookies.putObject(moduleCookie + 'forms',[]);
		 for (i in $scope.module.sections) {
			for (q in $scope.module.sections[i].units){
					unit = $scope.module.sections[i].units[q];
				if(unit.type == "question") {

						switch(unit.mode) {
							case "radio":

								var answers = $cookies.getObject(moduleCookie + 'forms');
								answers.push({prompt:unit.prompt, answer:unit.value});
								$cookies.putObject(moduleCookie + 'forms',answers);
								break;

							case "checkbox":
								var answers = $cookies.getObject(moduleCookie + 'forms');
								var checked = [];
								var ids = [];
								for (c in unit.choices){
									if(!(typeof(unit.choices[c].value)==='undefined') && !unit.ignored){
										ids.push(unit.choices[c].id);
										checked.push(unit.choices[c].value);
									}
								}
								answers.push({prompt:ids, answer:checked});
								$cookies.putObject(moduleCookie + 'forms',answers);

								break;

							case "textarea":
								var answers = $cookies.getObject(moduleCookie + 'forms');
								answers.push({prompt:unit.prompt, answer:unit.value});
								$cookies.putObject(moduleCookie + 'forms',answers);
								break;
							}
						}
					else if (unit.type == "chart"){
						console.log();
						var answers = $cookies.getObject(moduleCookie + 'forms');
						answers.push({Asset:unit.asset, Threat: unit.threat,Vulnerabilities:unit.vulnerabilities,Probability:unit.probability,Harm:unit.harm,Risk:unit.risk,Mitigation:unit.mitigation});
						$cookies.putObject(moduleCookie + 'forms',answers);
					}


					else if(unit.type == "checklist") {
						//Again checklist is being saved proper.... Not loading right.
						/*
						var answers = $cookies.getObject('forms');
						var checked = [];
						var ids = [];
						for (j in unit.list) {
							group = unit.list[j];
							group_id = unit.id+"-"+group.id;

							for (k in group.items) {
								item = group.items[k];
								item_id = group_id+"-"+item.id;

								// if checkbox hasn't been touched, angular thinks it is undefined
								if(typeof(item.value)==='undefined') checked.push(false);
								else if (item.value == false) checked.push(false);
								else if (item.value == true) checked.push(true);

								//if(item.js) item.value = $(item_id).is(':checked');

								ids.push(item_id);
								console.log("ID PUSHED : "+ item_id);
								//checked.push(item.value);
								console.log("VAL PUSHED "  + item.value+"------------");
							}
						}

						answers.push({prompt:ids, answer:checked});
						$cookies.putObject('forms',answers);
				}
				*/
		 }
		}
 }
 
 
}

	/**
	 * helper method to toggle classes on correct/incorrect elements
	 *
	 * PARAMETERS
	 * 		type of element - "question" or "checkbox" or "checklist", etc.
	 * 		id - the id of the question to classify
	 * 		right - boolean for whether the question is correct or not
	 *
	 * RETURN right, for convenience
	 */
	function classify(type, id, right) {
		if(right) {			// element is correct
			$(id).removeClass("si-"+type+"-incorrect");
			$(id).addClass("si-"+type+"-correct");
		} else {			// element is incorrect
			$(id).removeClass("si-"+type+"-correct");
			$(id).addClass("si-"+type+"-incorrect");
		}
		return right;
	}

 /* method to check all answers in current section
 * called when 'check answers' button is selected
 *
 * FOR EACH graded answer
 * 	classify as correct or incorrect (to trigger CSS changes)
 * IF all answers are correct, enable 'continue' button
 */
var needChecked = false;
$scope.checkAnswers = function() {
	var perfect = true;		// true if all questions/checklists are correct

	// go through each question and checklist, see if it's right
	for (i in $scope.currentsection.units) {
		unit = $scope.currentsection.units[i];
		id = "#"+unit.id;

		var right = true;	// until proven wrong

		if(unit.type == "question" && !unit.ignored) {
			switch(unit.mode) {
			case "radio":
				//perfect &= classify("question", id, unit.value == unit.answer);
				right = classify("question", id, unit.value == unit.answer);
				break;

			case "checkbox":
				var correct = true; // true if this question is correct

				// determine whether each box should be checked
				for (j in unit.choices) {
					choice = unit.choices[j];
					choice_id = id+"-"+choice.id;

					// if checkbox hasn't been touched, angular thinks it is undefined
					if(typeof(choice.value)==='undefined') choice.value = false;
					var item_right = choice.value == choice.ans;
					correct &= item_right;

					classify("checkbox", choice_id, item_right);
					classify("checkbox-label", choice_id+"-label", item_right);
				}

				//perfect &= classify("question", id, correct);
				right = classify("question", id, correct);

				break;

			case "textarea":
				var re = new RegExp(unit.pattern);
				//perfect &= classify("question", id, re.test(unit.value));
				right = classify("question", id, re.test(unit.value));
				break;

			// TODO (ongoing) maintain functionality for new question modes

			}
		} else if(unit.type == "checklist") {
			var correct = true; // true if all boxes are appropriately checked

			// determine whether each box should be checked
			for (j in unit.list) {
				group = unit.list[j];
				group_id = id+"-"+group.id;
				for (k in group.items) {
					// console.log(group.items)
					item = group.items[k];
					// console.log('ITEM', item);
					item_id = group_id+"-"+item.id;

					// console.log("item.value: " + item.value);
					// console.log("item.ans: " + item.ans);

					// if checkbox hasn't been touched, angular thinks it is undefined
					if(typeof(item.value)==='undefined') item.value = false;
					// when checkbox is mediated by javascript, must manually bind item.value
					if(item.js) item.value = $(item_id).is(':checked');

					// console.log("item.value after: " + item.value);
					// console.log("item.ans after: " + item.ans);

					var item_right = item.value == item.ans;

					if(unit.optional==true){
						item_right = true;
					}

					correct &= item_right;

					classify("checkbox", item_id, item_right);
					classify("checkbox-label", item_id+"-label", item_right);
				}
			}

			right &= classify("checklist", id, correct);
		}

		if(!right) {
			perfect = false;
			$scope.score.sections[$scope.currentsectionIndex].questions[unit.id] += 1;	// count attempt
		}
	}

	// IF user has just successfully completed a new section
	if (perfect && $scope.currentsectionIndex == $scope.sectionscompleted) {
		// register time between starting and ending section
		var now = new Date();
		$scope.score.sections[$scope.sectionscompleted].time = now - $scope.starttime;
		// update time
		$scope.starttime = now;
		// increment number of sections
		$scope.sectionscompleted ++;
	}
	$scope.saveCookie($scope.sectionscompleted);
}

	/**
	 * method used to change sections
	 * fails if user has not completed up to the given section
	 *
	 * PARAMETERS: i - the new section index
	 */

	 $scope.checkButtons = function(i) {
		needChecked = false;
 		for (j in $scope.module.sections[i].units) {
 			unit = $scope.module.sections[i].units[j];
 			if((unit.type == "question")|| (unit.type == "checklist")) {
 				needChecked = true;
 			}
 		}
		if (needChecked == false) {
			$scope.checkAnswers();
		}
 		return needChecked;
 }
	$scope.gotoSection = function(i) {
		if(i <= $scope.sectionscompleted) {
			$scope.currentsectionIndex = i;
			$scope.currentsection = $scope.module.sections[i];
			$scope.saveCookie($scope.sectionscompleted);
		} else {
			console.log("Cannot go to section "+i+": may only go up to section "+$scope.sectionscompleted);
		}
		$("body").animate({ scrollTop: 0 }, 500);
	}


	/**
	 * Simple form of certificate, without Towson logo or fancy placement
	 * TODO: prettify this
	 */
	function defaultCertificate(ctx, data) {
		// white background
		ctx.beginPath();
		ctx.rect(0,0,500,348);
		ctx.fillStyle = "white";
		ctx.fill();

		ctx.fillStyle = "black";
		ctx.textAlign = "left";
		// header
		ctx.font = "20px Arial";
		ctx.fillText("Security Injections @ offline", 20,30);
		ctx.beginPath();
		ctx.moveTo(20,40);
		ctx.lineTo(150,40);
		ctx.stroke();

		ctx.font = "12px Arial";
		ctx.fillText("Module: "+data.course, 20, 60);	// COURSE
		ctx.fillText("Student: "+data.name, 20,80);		// NAME
		ctx.fillText("Date: "+data.today, 20, 100);		// DATE
		ctx.fillText("ID: "+data.hash, 20, 120);		// ID
	}


	/**
	 * Pretty form of certificate, only available with connection to our server
	 */
	function prettyCertificate(ctx, data, img) {
		ctx.drawImage(img, 0,0);

		ctx.font = "12px Arial";
		ctx.textAlign = "left";
		ctx.fillText(data.name, 27,140);		// NAME
		ctx.fillText(data.course, 27, 190);		// COURSE
		ctx.textAlign = "center";
		ctx.fillText(data.hash, 126, 300);		// ID
		ctx.fillText(data.today, 366, 300);		// DATE
	}

	function pdfCertificate(q,data){
		var leftMargin=15; //left margin in mm
		var rightMargin=15; //right margin in mm
		var widthOfPDF=210;  // width of page in mm
		var heightOfPDF=295; //height of page
		var topMargin=20;
		var bottomMargin=20;
		var pageBreak = heightOfPDF-topMargin-bottomMargin; //will determine when new page should be made
		var lineBreak = widthOfPDF-leftMargin-rightMargin;  //will determine when new line should be made

		var doc = new jsPDF("p","mm","a4");

		doc.setFontSize(20);
		doc.text("Security Injections @ Towson",leftMargin,topMargin);
		doc.line(10,25,190,25);
		doc.setFontSize(12);
		doc.text("Module: "+data.course, 20, 35);	// COURSE
		doc.text("Student: "+data.name, 20,45);		// NAME
		doc.text("Date: "+data.today, 20, 55);		// DATE
		doc.text("ID: "+data.hash, 20, 65);		// ID

		//doc.addImage(img, 'PNG', 10, 10, 190, 132);
		doc.addPage();
		doc.setFontSize(20);
		doc.text("Discussion Questions",leftMargin,topMargin);
		doc.line(10,25,190,25);
		topMargin = 40; //setting up for question and answer loop
		for (i in q){
			if (topMargin > pageBreak){
				doc.addPage();
				topMargin = 20;
			}
				doc.setFontSize(16);
				var prompt = doc.splitTextToSize(q[i].prompt, lineBreak); //returns an array of strings for each line
				var promptLines = prompt.length;
				doc.text(leftMargin,(topMargin),prompt);
				topMargin = topMargin + ((5.6444 * promptLines)+10); //5.64 is 16pt font converted to mm

				doc.setFontSize(12);
				var answer = doc.splitTextToSize(q[i].answer, lineBreak-20);
				var answerLines = answer.length;
				doc.text(leftMargin+20,(topMargin),answer);
				topMargin = topMargin + ((4.2333 * answerLines)+10); //4.233 is 12 pt font converted to mm
		}

		dataUri = doc.output('datauristring'); //makes a uristring for iframe

		$scope.detailFrame = $sce.trustAsResourceUrl(dataUri); //found this neccessary for iframe to display in angular

	}

	/**
	 * method to generate the user's completion certificate
	 * and also update our database
	 *
	 * NETWORK: sends POST 'request' to server with everything the database wants
	 */
	$scope.generateCertificate = function() {
		// Step 1: Get module/variant into printable string.
		var course = $scope.module.name+" - "+$scope.module.variant;

		// Step 2: Get the time into a printable format.
		// SOURCE: http://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
		var now = new Date();
		var dd = now.getDate();
		var mm = now.getMonth()+1; //January is 0!
		var yyyy = now.getFullYear();
		if(dd<10) { dd='0'+dd } // force date to be 2 digits
		if(mm<10) { mm='0'+mm } // force month to be 2 digits
		var today = mm+'/'+dd+'/'+yyyy;

		// Step 3: Produce a hash-string id using all this info.
		// SOURCE: http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
		var to_hash = $scope.form.name + course + today;
		var hash = 0;
			if (to_hash.length == 0) return hash;
			for (i = 0; i < to_hash.length; i++) {
					char = to_hash.charCodeAt(i);
					hash = ((hash<<5)-hash)+char;
					hash = hash & hash; // Convert to 32bit integer
			}
			hash = Math.abs(hash);


		// Step 4: Draw the certificate user data.
			var draw_data = {
					'name': $scope.form.name,
					'course': course,
					'hash': hash,
					'today': today
				}

		var pageIndex;
		for(i in $scope.module.sections){
			if ($scope.module.sections[i].header == "Discussion Questions"){
				pageIndex = i;
			}
		}

		var discussionQuestions = [];
		if (pageIndex && $scope.module.sections[pageIndex]) {
			for (q in $scope.module.sections[pageIndex].units){
					unit = $scope.module.sections[pageIndex].units[q];
				if(unit.type == "question") {
					if(unit.mode == "textarea"){
						if(unit.value != null){
							discussionQuestions[q] = {prompt:unit.prompt, answer:unit.value};
						}
					}
				}
			}
		}

		pdfCertificate(discussionQuestions,draw_data);
		finalPDF = $scope.detailFrame


		// Step 6: Make certificate available for download
		$('#si-certificate-link').click(function() {
			var download = document.createElement('a');
			download.setAttribute('href', finalPDF);
			download.setAttribute('download', 'certificate.pdf');
			download.click();
		});
		$('#si-certificate-link').prop('disabled', false);
		$('#si-certificate-pane').show();


		// Step 7: Post info to database
		$scope.form['modulename'] = $scope.module.name;
		$scope.form['variant'] = $scope.module.variant;
		$scope.form['date'] = now.toJSON();
		$scope.form['score'] = JSON.stringify($scope.score);
		// TODO: make sure $scope.form content is securely encrypted. Student email is private info
		$http.post($scope.repo+'record', $scope.form);
	}
	$scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

function loadCoverPage(){
	var coverPageUri = $scope.repo+$("#name").html()+'/'+"coverpage.pdf";
	$scope.coverPageFrame = $sce.trustAsResourceUrl(coverPageUri);
}

}]);
