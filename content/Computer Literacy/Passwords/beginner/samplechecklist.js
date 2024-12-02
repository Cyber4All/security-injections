$(document).ready(function() {
	var name = "completedSample";
  var list = "clSample";
	// track id of the current checklist task (initialized later)
	var fullName = name + "-" + list + "-";

  $("#"+fullName+"lengthOfPw").prop('checked', true);
  $("#"+fullName+"memorablePw").prop('checked', true);
  $("#"+fullName+"case").prop('checked', true);
  $("#"+fullName+"punctuation").prop('checked', true);
});
