$(document).ready(function() {
	var name = "Pgm1CL";

	// track id of the current checklist task (initialized later)
	var current;
	// track which spans have been clicked appropriately
	var clicked = [];
	// track which spans are needed for current question
	var waitingOn = [];

	var spans = [];

	/**
	 * returns the id of the next question, and rearranges class indicators
	 * if question is not provided, initialize the first question
	 */
	function advance(question) {
		var next;
		if(typeof(question)==='undefined') {
			next = name+"-array-dec";				// first question
		} else {
			// check off question
			$("#"+question).prop('checked', true);



						// take focus away from current question
						$("#"+question+"-label").removeClass("si-checklist-active");


						switch(question) { // here's where flow is really controlled
						case name+"-array-dec":		next = name+"-array-ref";	break;
						case name+"-array-ref":	next = name+"-var-range";	break;
						case name+"-var-range":		next = name+"-var-occur";	break;
						case name+"-var-occur":	next = name+"-var-modify";	break;
						case name+"-var-modify":	next = name+"-var-array";	break;
						case name+"-var-array":	next = name+"-loop-limit";	break;
						case name+"-loop-limit":	next = name+"-loop-range";	break;
						default:	return;	// input invalid or question is complete
						}
					}

					// focus on next question
					$("#"+next+"-label").addClass("si-checklist-active");

				if((next === name+"-var-range") ||(next === name+'-loop-range')){ //IF POPOVER IS NEEDED
					waitingOn = []; //Gather spans
					$(".span-"+name).each(function(index) {
						if( $(this).hasClass(next+"-"+name) ) {
							waitingOn.push(index);
						}
					});
					var spanLoc;
					if(next === name+"-var-range"){spanLoc = 11;} //NEED TO BE SET TO THE RIGHT SPAN
					else if (next === name+'-loop-range'){spanLoc = 6;}

					//show Popover over the index span
					showPopOver(spans[spanLoc]);

					var tag = "Pgm1CL-var-range"; //the one that needs the popover
					$('input[name=popSave2]').on('click', function() {
						if ($('#lowInt').val() == "0" && $('#popSelect1').val() == "<="
						 	&& $('#popSelect2').val() == "<" && $('#highInt').val() == "10"){//these need to change to the right answer for the question
							//$("#"+tag).prop('checked', true); //not needed because click event handles this.
							$('.rangepop').hide();
							$(".span-"+name).click(); //click the empty span so that next question is asked.
							$('#lowInt').val('');
							$('#popSelect1').val('<');
							$('#popSelect2').val('<');
							$('#highInt').val('');
						}

					});


				}

				else{ //normal question

					waitingOn = [];
					$(".span-"+name).each(function(index) {
						if( $(this).hasClass(next+"-"+name) ) {
							waitingOn.push(index);
						}
					});
				}

					return next;
				}


				current = advance();


	$(".span-"+name).each(function(index) {
		spans.push($(this));
		//console.log(spans);
		$(this).on('click', function() {
			span = $(this);

			// continue if user is currently supposed to click this span, and hasn't already
			if( span.hasClass(current+"-"+name) && $.inArray(index,clicked) < 0 ) {
				clicked.push(index);					// 		note that it's been clicked, programmatically
				span.addClass("si-code-clicked");		//		note that it's been clicked, graphically
				if(span.hasClass(name+"-var-modify-"+name)|| span.hasClass(name+"-var-array-"+name)) { //needs to be changed for vulnerabilities
					span.addClass("si-code-vulnerability"); //	some spans get extra graphics to indicate vulnerability
				}


				// Check if 'current' question is finished yet
				var finished = true;
				for(i in waitingOn) {
					finished &= $.inArray(waitingOn[i],clicked) >= 0;
				}

				// if it is, go to next question
				if(finished) current = advance(current);
			}
		});
	});

	function showPopOver(span) { //showsPopover over span
	    var offset = span.offset();
	    var position = span.position();
	    var theHeight = $('.popover').height();
	    $('.rangepop').show();
	    $('.popover').css('left', (offset.left) + 'px');
	    $('.popover').css('top', (position.top-(theHeight/2)-5) + 'px');
	}

});
