$(document).ready(function() {
	
	var name = "Pgm1CL";
	// track id of the current checklist task (initialized later)
	var current;
	// track which spans have been clicked appropriately
	var clicked = [];
	// track which spans are needed for current question
	var waitingOn = [];
		let previousWaitingOnCount = 0;

	/**
	 * returns the id of the next question, and rearranges class indicators
	 * if question is not provided, initialize the first question
	 */
	function advance(question) {
		var next;
		if(typeof(question)==='undefined') {
			next = name+"-var-var";				// first question
		} else {
			// check off question
			$("#"+question).prop('checked', true);

			// take focus away from current question
			$("#"+question+"-label").removeClass("si-checklist-active");
			$("#" + question + "-progress-label").addClass("progress-hidden");
			$("#" + question + "-progress-label").removeClass("progress");

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

		// track which spans are needed for next question
		waitingOn = [];
		$(".span-"+name).each(function(index) {
			if( $(this).hasClass(next+"-"+name) ) {
				waitingOn.push(index);
			}
		});
		//removes highlighted sections so user is not seeing correct answers of previous question
		$(".span-" + name).removeClass("si-code-clicked");
		return next;
	}

	current = advance();

	// Handles score for each individual question
	$(".span-"+name).each(function(index) {

		$(this).on('click', function() {
			span = $(this);

			// continue if user is currently supposed to click this span, and hasn't already
			if( span.hasClass(current+"-"+name) && $.inArray(index,clicked) < 0 ) {
				clicked.push(index);	// 	note that it's been clicked, programmatically
				span.addClass("si-code-clicked");	//	note that it's been clicked, graphically
				if(span.hasClass(name+"-vuln-input-"+name) || span.hasClass(name+"-vuln-assign-"+name)) {
					span.addClass("si-code-vulnerability"); //	some spans get extra graphics to indicate vulnerability
				}

				// Check if 'current' question is finished yet
				var finished = true;

				// logic for increasing the progress bar
				let currentProgress = ((clicked.length - previousWaitingOnCount)/waitingOn.length)*100;
				document.getElementById(current + "-progress-data-label").style.width = `${currentProgress}%`;

				for(i in waitingOn) {
					finished &= $.inArray(waitingOn[i],clicked) >= 0;
				}
				
				// if it is, go to next question
				if (finished) {
					previousWaitingOnCount += waitingOn.length;
					current = advance(current);
				}
			}
		});
	});
});