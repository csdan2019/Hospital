let patientTable = document.getElementById("patient-table");
let illnessTable = document.getElementById("illness-table");
let deptTable = document.getElementById("department-table");
let doctorTable = document.getElementById("doctor-table");

let illnessChange = document.getElementById("illnessChange");
let patientChange = document.getElementById("patientChange");
let doctorChange = document.getElementById("doctorChange");
let departmentChange = document.getElementById("departmentChange");

let deptSelect = document.getElementById("select_department");
let docSelect = document.getElementById("select_doctor");
let patDeptSelect = document.getElementById("select_patDept");
let select_patDoc= document.getElementById("select_patDoc");

if (illnessChange) changeIllnessListener(illnessChange);
if (patientChange) changePatientListener(patientChange);
if (doctorChange) changeDoctorListener(doctorChange);
if (departmentChange) changeDepartmentListener(departmentChange);

window.addEventListener('load', function(){
		if (select_patDoc){
			console.log("in edit select for doctors");
		

		let req = new XMLHttpRequest();
		req.open("GET","/getPatients", true);
		
		req.onreadystatechange = function(){
			console.log("Good Request");
			if(req.status === 200){
				if(req.readyState === 4){
					console.log("right before json");
					let response = JSON.parse(req.responseText);
					console.log(response);
					for(let n = 0; n < response['results'].length; n++){
						console.log("do you see this");
						console.log(response['results'][n]);
						let option = document.createElement('option');
						let test=response['results'][n]['title'];
						//console.log(test);
						option.appendChild(document.createTextNode(test));
						option.value=response['results'][n]['id'];
						console.log(response['results'][n]['id']);
												//console.log(option);
						select_patDoc.appendChild(option);
						}
										}
								}
											}
											req.send(null);
					}


		if (patDeptSelect){

		console.log("prepare");

		let req = new XMLHttpRequest();
		req.open("GET","/getDepartment", true);
		console.log("yess");
		req.onreadystatechange = function(){
			console.log("Good Request");
			if(req.status === 200){
				if(req.readyState === 4){
					console.log("i am stuck");
					let response = JSON.parse(req.responseText);
					console.log(response);
					for(let n = 0; n < response['results'].length; n++){
						console.log("do you see this");
						console.log(response['results'][n]);
						let option = document.createElement('option');
						let test=response['results'][n]['title'];
						//console.log(test);
						option.appendChild(document.createTextNode(test));
						option.value=response['results'][n]['id'];
						console.log(response['results'][n]['id']);
												//console.log(option);
						patDeptSelect.appendChild(option);
						}
										}
								}
											}
											req.send(null);
					}

	if (patientTable || illnessTable || doctorTable || deptTable) {
		let req = new XMLHttpRequest();
		if(patientTable) {
			req.open("GET","/getPatients", true);
		} else if (illnessTable) {
			req.open("GET","/getIllness", true);
		} else if (doctorTable) {
			req.open("GET","/getDoctor", true);
		} else {
			req.open("GET","/getDepartment", true);
		}

		req.onreadystatechange = function(){
			console.log("Good Request");
			if(req.status === 200){
				if(req.readyState === 4){
					let response = JSON.parse(req.responseText);
					for(let n = 0; n < response['results'].length; n++){
						let resElement = response['results'][n];
						if(patientTable){
							let patientTableBody = makePatientRow(resElement);
							let anchor = document.createElement('a');
							createAnchor(resElement, anchor, "patient");
							patientTableBody = addButtons(patientTableBody, anchor, resElement.id, 'patient');	
							patientTable.appendChild(patientTableBody);

						} else if (illnessTable) {
							let illnessTableBody = makeIllnessRow(resElement);
							let anchor = document.createElement('a');
							createAnchor(resElement, anchor, "illness");
							illnessTableBody = addButtons(illnessTableBody, anchor, resElement.id, 'illness');	
							illnessTable.appendChild(illnessTableBody);
						} else if (doctorTable) {


							let doctorTableBody = makeDoctorRow(resElement);
							let anchor = document.createElement('a');
							createAnchor(resElement, anchor, "doctor");
							doctorTableBody = addButtons(doctorTableBody, anchor, resElement.id, 'doctor');	
							doctorTable.appendChild(doctorTableBody);
						} else {
							let departmentTableBody = makeDeptRow(resElement);
							let anchor = document.createElement('a');
							createAnchor(resElement, anchor, "department");
							departmentTableBody = addButtons(departmentTableBody, anchor, resElement.id, 'department');	
							deptTable.appendChild(departmentTableBody);
						}
					}
					if (deptSelect){
													console.log(response['deptTitle'].length);
							for(let n = 0; n < response['deptTitle'].length; n++){
						console.log("do you see this");
						console.log(response['deptTitle'][n]);
						let option = document.createElement('option');
						let test=response['deptTitle'][n]['title'];
						//console.log(test);
						option.appendChild(document.createTextNode(test));
						option.value=response['deptTitle'][n]['id'];
												//console.log(option);
						deptSelect.appendChild(option);
						}
					}
					if (docSelect){
						console.log("doctor Select test");
													console.log(response['doctorName'].length);
							for(let n = 0; n < response['doctorName'].length; n++){

						console.log(response['doctorName'][n]);
						let option = document.createElement('option');
						let test=response['doctorName'][n]['last_name'];
						//console.log(test);
						option.appendChild(document.createTextNode(test));
						option.value=response['doctorName'][n]['id'];
												//console.log(option);
						docSelect.appendChild(option);
						}
					}



				}
			}
			else{
				console.log(req.status);
			}
			console.log(req.status);
		};
		req.send(null);
		};

});






function removeButtonListener(removeButton, url){
	let context = {};
	let route = "/" + url;
	context.id = removeButton.parentNode.children[0].value;
	context.action = removeButton.value;
	removeButton.addEventListener('click',function(event){
		console.log("I was clicked!");
		let req = new XMLHttpRequest();
		if(context.action === "Remove"){
			req.open("POST", route, true);
			req.setRequestHeader('Content-Type',  'application/json');
			req.addEventListener('load', function(){
		      if(req.status >= 200 && req.status < 400){
		      	console.log(req.status);
		        let response = JSON.parse(req.responseText);
		      	removeButton.parentNode.parentNode.remove();
			   }
			});
			req.send(JSON.stringify(context));
		    event.preventDefault();
		    event.stopPropagation();
		}
	});
}


function makePatientRow(element){
	let row = document.createElement("tr");

	let firstNameCell = document.createElement("td");
	let lastNameCell = document.createElement("td");
	let birthdayCell = document.createElement("td");
	let occupationCell = document.createElement("td");
	let smokerCell = document.createElement("td");
	let alcoholCell = document.createElement("td");
	let heightCell = document.createElement("td");
	let weightCell = document.createElement("td");
	let doctorCell = document.createElement("td");
	let departmentCell = document.createElement("td");
	let genderCell = document.createElement("td");

	firstNameCell.textContent = element.first_name;
	lastNameCell.textContent = element.last_name;
	birthdayCell.textContent = element.birthday;
	occupationCell.textContent = element.occupation;

	if (element.smoker === 1){
		smokerCell.textContent = "Yes";
	} else {
		smokerCell.textContent = "No";
	}
	if (element.alcohol === 1){
		alcoholCell.textContent = "Yes";
	} else {
		alcoholCell.textContent = "No";
	}
	heightCell.textContent = element.height;
	weightCell.textContent = element.weight;
	doctorCell.textContent = element.doctor_name;
	departmentCell.textContent = element.title;
	genderCell.textContent = element.gender;

	row.appendChild(firstNameCell);
	row.appendChild(lastNameCell);
	row.appendChild(birthdayCell);
	row.appendChild(occupationCell);
	row.appendChild(smokerCell);
	row.appendChild(alcoholCell);
	row.appendChild(heightCell);
	row.appendChild(weightCell);
	row.appendChild(doctorCell);
	row.appendChild(departmentCell);
	row.appendChild(genderCell);

	return row;
}

function createAnchor(element, anchor, type) {
	if(type === 'patient') {
		anchor.setAttribute('href', 'editPatient?id=' + element.id +
									'&firstName=' + element.first_name + 
									'&lastName=' + element.last_name+ 
									'&birthday=' + element.birthday+
									'&occupation=' + element.occupation+ 
									'&smoker=' + element.smoker+ 
									'&alcohol=' + element.alcohol+
									'&height=' + element.height+
									'&weight=' + element.weight+
									'&doctor=' + element.doctor_name+
									'&patientDepartment=' + element.title +
									'&patientGender=' + element.gender);
	} else if (type === 'doctor') {
		anchor.setAttribute('href', '/editdoctor?id=' + element.id +
									'&firstName=' + element.first_name + 
									'&lastName=' + element.last_name+ 
									'&hospital_location=' + element.title +
									'&Rating=' + element.rating +
									'&title=' + element.position_title);
	} else if (type === 'department') {
		anchor.setAttribute('href', 'editDepartment?id=' + element.id +
									'&floor=' + element.floor + 
									'&title=' + element.title);
	} else {
		anchor.setAttribute('href', 'editIllness?id=' + element.id +
									'&illness=' + element.illness_name+ 
									'&discomfort=' + element.discomfort+ 
									'&symptomLen=' + element.symptom_length);
	}
};

function addButtons(row, anchor, eid, type) {
	let edit = document.createElement("input");
	let buttons = document.createElement("td");
	let form = document.createElement("form");
	let id = document.createElement("input");
	let del = document.createElement("input");

	id.type = "hidden";
	id.name = 'id';
	id.value = eid;

	edit.type = "submit";
	edit.name = "Edit";
	edit.value = "Edit";
	del.type = "submit";
	del.name = "Remove";
	del.value = "Remove";

	row.appendChild(buttons);
	anchor.appendChild(edit);
	buttons.appendChild(id);
	buttons.appendChild(anchor);
	buttons.appendChild(del);

	if(type === 'patient') {
		removeButtonListener(del, 'deletePatient');
	} else if (type === 'illness') {
		removeButtonListener(del, 'deleteIllness');
	} else if (type === 'doctor') {
		removeButtonListener(del, 'deleteDoctor');
	} else {
		removeButtonListener(del, 'deleteDepartment');
	}
	return row;
}

function makeIllnessRow(element){
	let row = document.createElement("tr");

	let illness = document.createElement("td");
	let discomfort = document.createElement("td");
	let symptomLen = document.createElement("td");

	illness.textContent = element.illness_name;
	discomfort.textContent = element.discomfort;
	symptomLen.textContent = element.symptom_length;

	row.appendChild(illness);
	row.appendChild(discomfort);
	row.appendChild(symptomLen);

	return row;
}
function makeDoctorRow(element){
	let row = document.createElement("tr");

	let firstNameCell = document.createElement("td");
	let lastNameCell = document.createElement("td");
	let floorCell = document.createElement("td");
	let departmentCell = document.createElement("td");
	let ratingCell = document.createElement("td");

	firstNameCell.textContent = element.first_name;
	lastNameCell.textContent = element.last_name;
	floorCell.textContent = element.title;
	departmentCell.textContent = element.position_title;
	ratingCell.textContent = element.rating;

	row.appendChild(firstNameCell);
	row.appendChild(lastNameCell);
	row.appendChild(floorCell);
	row.appendChild(departmentCell);
	row.appendChild(ratingCell);

	return row;
}

function makeDeptRow(element){
	let row = document.createElement("tr");

	let floorCell = document.createElement("td");
	let titleCell = document.createElement("td");

	floorCell.textContent = element.floor;
	titleCell.textContent = element.title;

	row.appendChild(floorCell);
	row.appendChild(titleCell);

	return row;
}

function changeDoctorListener(btn){
	btn.addEventListener('click', function(event){
		let req = new XMLHttpRequest();

		let first_name = document.getElementById("first_name").value;
		let last_name = document.getElementById("last_name").value;
		let position_title = document.getElementById("position_title").value;
		let hospital_location = document.getElementById("select_patDept").value;
		let rating = document.getElementById("Rating").value;
		let id = document.getElementById("id").value;

		let context = {first_name:null,
						last_name:null,
						position_title:null,
						rating:null,
						id: null};

		context.first_name = first_name;
		context.last_name = last_name;
		context.position_title = position_title;
		context.hospital_location = hospital_location;
		context.rating = rating;
		context.id = id;
		context.update = "Update";


		if(context.first_name === "" || context.last_name === "" || context.position_title === "" || context.hospital_location === "" || context.Rating === ""  ){
			alert("You made a mistake!");
		}
		else{
			makePOST("doctor", req, context);
		}
	});
};

function changeDepartmentListener(btn){
	btn.addEventListener('click', function(event){
		let req = new XMLHttpRequest();

		let floor = document.getElementById("floor").value;
		let title = document.getElementById("title").value;

		let id = document.getElementById("id").value;


		let context = {floor:null,
						title:null,
						id: null};

		context.floor = floor;
		context.title = title;
		context.id = id;
		context.update = "Update";


		if(context.floor === "" || context.title === "" ){
			alert("You made a mistake!");
		}
		else{
			makePOST("department", req, context);
		}
	});
};

function changePatientListener(btn){
	btn.addEventListener('click', function(event){
		let req = new XMLHttpRequest();

		let first_name = document.getElementById("first_name").value;
		let last_name = document.getElementById("last_name").value;
		let birthday = document.getElementById("birthday").value;
		let occupation = document.getElementById("occupation").value;
		let smoker = document.getElementById("smoker").value;
		let alcohol = document.getElementById("alcohol").value;
		let height = document.getElementById("height").value;
		let weight = document.getElementById("weight").value;
		let doctor_id = document.getElementById("doctor_id").value;
		let hospital_location = document.getElementById("hospital_location").value;
		let gender = document.getElementById("gender").value;
		let id = document.getElementById("id").value;


		let context = {first_name:null,
						last_name:null,
						birthday:null,
						occupation:null,
						smoker:null,
						alcohol:null,
						height:null,
						weight:null,
						doctor_id:null,
						hospital_location:null,
						gender:null,
						id: null};

		context.first_name = first_name;
		context.last_name = last_name;
		context.birthday = birthday;
		context.occupation = occupation;
		context.smoker = smoker;
		context.alcohol = alcohol;
		context.height = height;
		context.weight = weight;
		context.doctor_id = doctor_id;
		context.hospital_location = hospital_location;
		context.gender = gender;
		context.id = id;
		context.update = "Update";



		if(context.first_name === "" 
			|| context.last_name === "" 
			|| context.birthday === "" 
			|| context.occupation === "" 
			|| context.smoker === "" 
			|| context.alcohol === "" 
			|| context.height === "" 
			|| context.weight === "" 
			|| context.doctor_id === "" 
			|| context.hospital_location === "" 
			|| context.gender === "" 
			){
			alert("You made a mistake!");
		}
		else{
			makePOST("patient", req, context);
		}
	});
};

function changeIllnessListener(btn){
	btn.addEventListener('click', function(event){
		let req = new XMLHttpRequest();

		let illness_name = document.getElementById("illness_name").value;
		let discomfort = document.getElementById("discomfort").value;
		let symptom_length = document.getElementById("symptom_length").value;
		let id = document.getElementById("id").value;


		let context = {illness_name:null,
						discomfort:null,
						symptom_length:null,
						id: null};

		context.illness_name = illness_name;
		context.discomfort = discomfort;
		context.symptom_length = symptom_length;
		context.id = id;
		context.update = "Update";

		console.log('we are going to update illness');
		if(context.illness_name === "" || context.discomfort === "" || context.symptom_length === ""){
			alert("You made a mistake!");
		}
		else{
	  		makePOST("illness", req, context);
		}
	});
};

function makePOST(url, req, context) {
	let location = "/" + url;
	req.open("POST", location, true);
	req.setRequestHeader("Content-Type", "application/json");
  	req.addEventListener('load',function(){
  	if(req.status >= 200 && req.status < 400){
    	let response = JSON.parse(req.responseText);
  	} else {
    	console.log("Error in network request: " + req.statusText);
    }});
    req.send(JSON.stringify(context));
    event.stopPropagation();
};
