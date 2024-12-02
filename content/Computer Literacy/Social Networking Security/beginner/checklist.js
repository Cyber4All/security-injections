
$(document).ready(function() {

	var cList1 = "securityChecklist-c1-";
	var aList1 = "securityChecklist2-a1-";
	var tList1 = "securityChecklist3-t1-";
	var cList2 = "securityChecklist-c2-";
	var aList2 = "securityChecklist2-a2-";
	var tList2 = "securityChecklist3-t2-";

$('#btn-check-answers').on('click', function(){
	if(document.getElementById(cList1+"q1").checked == true){
		document.getElementById(cList1+"q1-label").style.backgroundColor='yellow';
	}
	if(document.getElementById(cList2+"q3").checked == true){
		document.getElementById(cList2+"q3-label").style.backgroundColor='yellow';
	}
	if(document.getElementById(cList2+"q4").checked == true){
		document.getElementById(cList2+"q4-label").style.backgroundColor='yellow';
	}
	if(document.getElementById(aList1+"q1").checked == true){
		document.getElementById(aList1+"q1-label").style.backgroundColor='yellow';
	}
	if(document.getElementById(aList2+"q2").checked == false){
		document.getElementById(aList2+"q2-label").style.backgroundColor='yellow';
	}
	if(document.getElementById(aList2+"q3").checked == false){
		document.getElementById(aList2+"q3-label").style.backgroundColor='yellow';
	}
	if(document.getElementById(aList2+"q4").checked == false){
		document.getElementById(aList2+"q4-label").style.backgroundColor='yellow';
	}
	if(document.getElementById(tList1+"q1").checked == false){
		document.getElementById(tList1+"q1-label").style.backgroundColor='yellow';
	}
	if(document.getElementById(tList2+"q2").checked == false){
		document.getElementById(tList2+"q2-label").style.backgroundColor='yellow';
	}
	if(document.getElementById(tList2+"q3").checked == false){
		document.getElementById(tList2+"q3-label").style.backgroundColor='yellow';
	}
	if(document.getElementById(tList2+"q4").checked == false){
		document.getElementById(tList2+"q4-label").style.backgroundColor='yellow';
	}
});

});
