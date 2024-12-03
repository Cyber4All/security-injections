$(document).ready(function() {
	
	var name = "Pgm1CL";
	// track id of the current checklist task (initialized later)
	var current;
	// track which spans have been clicked appropriately
	var clicked = [];
	// track which spans are needed for current question
	var waitingOn = [];
	// collects total num spans per question
	var spans = [];
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
			next = name+"-var-input"; // first question
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
				case name+"-var-input":		
					next = name+"-vuln-length";	
					break;
				case name+"-vuln-length":	
					next = name+"-vuln-range";	
					break;
				case name+"-vuln-range":		
					next = name+"-vuln-format";	
					break;
				case name+"-vuln-format":	
					next = name+"-vuln-type";	
					break;
				
				default:	
				return;	// input invalid or question is complete
			}
		}

		// focus on next question
		$("#"+next+"-label").addClass("si-checklist-active");
		// remove hidden class from progress bar when user clicks correct answer
		
		if(next != name+"-vuln-length"){
			$("#" + next + "-progress-label").removeClass("progress-hidden");
			// add the progress bar fill
			$("#" + next + "-progress-label").addClass("progress");
		}
		
		// track which spans are needed for next question
		if(next === name+"-var-input"){
			waitingOn = []; // gather spans remaining to be clicked
			$(".span-"+name).each(function(index) {
				if( $(this).hasClass(next+"-"+name) ) {
					waitingOn.push(index);
				}
			});

		} else {

			showPopOver(spans[1]);
			var choice;
			var tag = "Pgm1CL-vuln-length";
			$('label[name=popPrompt]').text("Is length checked?");
			
			$('input[name=popSave]').on('click', function() {
				choice = $('input[name=popOpt]:checked').val();
				if (choice === "No"){
					$("#"+tag).prop('checked', true);
					$('.radiopop').hide();
					$('input[name=popOpt]').prop('checked', false);
					$('.popover').css('background-color', 'white');
				} else {
					$('.popover').css('background-color', 'lightpink');
				}
			});

			var interval = setInterval(function(){
				if(
				document.getElementById("Pgm1CL-vuln-length").checked === true && 
				document.getElementById("Pgm1CL-vuln-range").checked === false && 
				document.getElementById("Pgm1CL-vuln-format").checked === false && 
				document.getElementById("Pgm1CL-vuln-type").checked === false
				) {
					$("#"+"Pgm1CL-vuln-length"+"-label").removeClass("si-checklist-active");
					$("#"+"Pgm1CL-vuln-range"+"-label").addClass("si-checklist-active");
					tag = "Pgm1CL-vuln-range";
					showPopOver(spans[4]);
					$('label[name=popPrompt]').text("Is range checked?");
				}

				if(
				document.getElementById("Pgm1CL-vuln-length").checked === true && 
				document.getElementById("Pgm1CL-vuln-range").checked === true && 
				document.getElementById("Pgm1CL-vuln-format").checked === false && 
				document.getElementById("Pgm1CL-vuln-type").checked === false
				) {
					$("#"+"Pgm1CL-vuln-range"+"-label").removeClass("si-checklist-active");
					$("#"+"Pgm1CL-vuln-format"+"-label").addClass("si-checklist-active");
					tag = "Pgm1CL-vuln-format";
					showPopOver(spans[2]);
					$('label[name=popPrompt]').text("Is format checked?");
				}

				if(
				document.getElementById("Pgm1CL-vuln-length").checked === true && 
				document.getElementById("Pgm1CL-vuln-range").checked === true && 
				document.getElementById("Pgm1CL-vuln-format").checked === true && 
				document.getElementById("Pgm1CL-vuln-type").checked === false
				) {
					$("#"+"Pgm1CL-vuln-format"+"-label").removeClass("si-checklist-active");
					$("#"+"Pgm1CL-vuln-type"+"-label").addClass("si-checklist-active");
					tag = "Pgm1CL-vuln-type";
					showPopOver(spans[5]);
					$('label[name=popPrompt]').text("Is type checked?");
				}

				if(document.getElementById("Pgm1CL-vuln-type").checked === true){
						$("#"+"Pgm1CL-vuln-type"+"-label").removeClass("si-checklist-active");
						clearInterval(interval);
				}
			},500);
		}
		return next;
	}
	
	current = advance();

	// Handles score for each individual question
	$(".span-"+name).each(function(index) {
		spans.push($(this));
		
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

	// showsPopover over span
	function showPopOver(span) {
	    var offset = span.offset();
	    var position = span.position();
	    var theHeight = $('.popover').height();
	    $('.radiopop').show();
			$(".popover").css({
            'position': 'absolute',
            'top': (position.top-(theHeight/2)-5) + 'px',
            'left': (position.left+100) + 'px'
      });
	}
});