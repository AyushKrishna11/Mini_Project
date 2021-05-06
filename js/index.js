var registeredUsers = 0;

// global variables for pagination
var blogsData;
var startIndex;
var blogsToDisplayInPage = 5;

function init() {
	console.log("init");
	initialDataFetch();
	let cb = document.getElementById("categoryButtons");
	let tb = document.getElementById("tagButtons");
	appendCategoryButtons(cb);
	appendTagsButtons(tb);
}

// JS for Login Functionality
$(document).ready(function () {
	$("#btn-login").click(function () {
		if ($('#btn-login').html() == "Login") {
			$("#myModal").modal();
		}
		else {
			sessionStorage.clear();
			$('#btn-login').html("Login");
			$('#btn-signup').show();
			alert("You have Logged out Succesfully");
		}

	});

	$("#registerUser").click(startRegistration);

	$('#create_blog').click(function () {
		window.location.replace('./editor.html');
	});

});

// JS for Sign up Functionality

$("#btn-signup").click(function () {
	$("#signupModal").modal();
	getUsersCount();
	randomGet("http://localhost:3002/users/1");
	randomGet("http://localhost:3001/users/1");
});

$("#signUpForm").validate({
	// Specify validation rules
	rules: {
		// The key name on the left side is the name attribute
		// of an input field. Validation rules are defined
		// on the right side
		fname: 'required',
		lname: 'required',
		username: "required",
		email: {
			required: true,
			// Specify that email should be validated
			// by the built-in "email" rule
			email: true
		},
		password: {
			required: true
		},
		confirm_password: {
			required: true,
			equalTo: "#password"
		},
		dob: {
			required: true,
			regx: "^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$"
		}

	},
	// Specify validation error messages
	messages: {
		fname: "Please enter your First Name",
		lname: "Please enter your Last Name",
		username: "Please enter your username",

		password: {
			required: "Please provide a password",

		},
		confirm_password: {
			required: "Please confirm  password",
			equalTo: "Password does not match"

		},
		email: "Please enter a valid email address",
		dob: {
			required: "Please enter your birthdate",
			regx: "Enter a valid date"
		}


	},
	// Make sure the form is submitted to the destination defined
	// in the "action" attribute of the form when valid
	submitHandler: function (form) {

		alert("Hello : ");
		console.log("from sunmityhandler: ", fname, lname, email);
		console.log($('#username').val())

		console.log($('#email').val())

	}
});

$("#dob").datepicker({
	endDate: new Date()
});
$('#showPasswordCheck').click(function () {
	$(this).is(':checked') ? $('#password').attr('type', 'text') : $('#password').attr('type', 'password');
});
$('#showConfirmPasswordCheck').click(function () {
	$(this).is(':checked') ? $('#confirm_password').attr('type', 'text') : $('#confirm_password').attr('type', 'password');
});


// For Login Validation 
function validateForm() {
	console.log("validate");
	var un = document.getElementById('usrname').value
	console.log(un);
	var pw = document.getElementById('psw').value
	checkUsernamePassword(un, pw);
}

function checkUsernamePassword(username, password) {
	// alert("success ajax");
	$.ajax({

		url: "http://localhost:3002/users/",
		method: "GET",
		success: (x) => {
			let loginSuccessful = false;
			for (let i = 0; i < x.length; i++) {
				if (username === x[i].email && password === x[i].password) {
					//console.log("Login successful");
					loginSuccessful = true;
					break;
				}
			}
			if (loginSuccessful) {

				console.log(window);
				$('#myModal').modal('hide');
				sessionStorage.setItem("user", username);
				alert("Login Successful");
				$('#btn-login').html("Log Out");
				$('#btn-signup').hide();
			}
			else {
				let msg = document.getElementById("login_msg");
				msg.innerHTML = "Incorrect Username / Password ";
			}
		},
		error: (e) => {
			//alert("Error: " + e);
		},
	});
}

// FOR REGISTRATION
function startRegistration() {
	console.log("init");
	//getUsersCount();
	register();
	// $('#signupModal').modal('hide');
}

function randomGet(myurl) {
	console.log("random get");
	$.ajax({
		url: myurl,
		method: "GET",
		success: (x) => {
			console.log("random get output => " + x);
		},
		error: (e) => {
			console.log("Error: " + e);
		},
	});
}

function getUsersCount() {
	console.log("Get data");
	$.ajax({
		url: "http://localhost:3000/users/1",
		method: "GET",
		success: (x) => {
			registeredUsers = x.count;
			console.log("got count ->" + x.count);
		},
		error: (e) => {
			alert("Error: " + e);
		},
	});
}

function register() {
	console.log("register start; registeredUsers = " + registeredUsers);

	let fname = document.getElementById("fname").value;
	let lname = document.getElementById("lname").value;
	let email = document.getElementById("email").value;
	let password = document.getElementById("password").value;
	let dob = document.getElementById("dob").value;

	let regobj = { id: registeredUsers + 1, fname: fname, lname: lname, email: email, password: password, dob: dob };
	console.log("before writing -> " + regobj);
	postData("http://localhost:3002/users/", regobj);
	let logobj = { id: registeredUsers + 1, email: email, password: password };
	console.log("before writing -> " + logobj);
	postData("http://localhost:3001/users/", logobj);

	saveUserCount(registeredUsers + 1);
	registeredUsers += 1;
	console.log("register end; new registeredUsers = " + registeredUsers);
}

function saveUserCount(val) {
	var obj = { id: 1, count: val };
	console.log("saving data -> " + obj);

	$.ajax({
		method: "PUT",
		url: "http://localhost:3000/users/1",
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify(obj),
		success: (x) => {
			console.log("Saved user count ->" + x);
		},
		error: (e) => {
			console.log(e);
		},
	});
}

function postData(myurl, obj) {
	$.ajax({
		url: myurl,
		method: "POST",
		dataType: "json",
		contentType: "application/json",
		success: (x) => {
			console.log(x);
		},
		data: JSON.stringify(obj),
	});
}


// View Blog Home Page Js start--------------------------------------------------------------------------------------------

function initialDataFetch() {
	$.ajax({
		url: "http://localhost:3004/metadata",
		method: "GET",
		success: (blogs) => {
			blogsData = blogs;
			startIndex = 0;
			loadDataInBlogsDiv();
		},
		error: (e) => {
			console.log(e);
		},
	});
}

function loadDataInBlogsDiv() {
	clearOldResults();
	displayData();
}

function displayData() {
	// let a = document.getElementsByClassName("blogMB");
	// let a = document.getElementById("blog");
	for (
		let i = startIndex;
		i < Math.min(startIndex + blogsToDisplayInPage, blogsData.length);
		i++
	){
	
		let blogList = $("#blog");
		let singleBlog = $("<div></div>").appendTo(blogList).addClass("card m-4");
		let singleBlogBody = $("<div></div>").appendTo(singleBlog).addClass("card-body");
		// $("<img>").appendTo(singleBlogBody).addClass("card-img-top").attr('src',"../assets/images/idea.png");
		$("<h5></h5>").appendTo(singleBlogBody).addClass("card-title").append(blogsData[i].title);
		$("<p></p>").appendTo(singleBlogBody).addClass("card-text").append(blogsData[i].desc);
		let readMore= $("<a></a>").appendTo(singleBlogBody).addClass("btn btn-outline-danger mb-4").attr({"href":'reader.html?id='+blogsData[i].id , "target":'_blank', 'onclick' :' checkLogin() '}).append("Read More");
		$("<div class='card-tags'></div>").appendTo(singleBlogBody).append($("<button disabled></button>").addClass("text-right btn btn-outline-secondary").append(blogsData[i].category));
	

		
	}
	// 	 {	


	// 		let maindiv = document.createElement("div");
	// 		//maindiv.classList.add("card text-center");
	// 		maindiv.addClass("card text-center")
	// 		let p1 = document.createElement("div");
	// 		// p1.classList.add("card-header");
	// 		let p2 = document.createElement("div");
	// 		// p2.classList.add("card-body");
	// 		let p3 = document.createElement("div");
	// 		// p3.classList.add("card-footer text-muted");
	// 		let btn = document.createElement("button");
	// 		p1.textContent = blogsData[i].title;
	// 		p2.textContent = blogsData[i].desc;
	// 		btn.textContent = "Read More";
	// 		btn.onclick = function () {
	// 			window.location.replace("./reader.html?id=" + blogsData[i].id);
	// 	};
	// 	p3.appendChild(btn);

	// 	maindiv.appendChild(p1);
	// 	maindiv.appendChild(p2);
	// 	maindiv.appendChild(p3);

	// 	a.appendChild(maindiv);
	// }
}

function checkLogin (){
	if(!sessionStorage.getItem('user')){
		alert("You have to login to read this blog");
		return;
	}
}

function clearOldResults() {
	// let mydiv = document.getElementsByClassName("blogMB");
	let mydiv = document.getElementById("blog");
	let ch = mydiv.childNodes;
	//console.log("total child -> "+ch.length);
	//console.log(ch);
	for (let i = ch.length - 1; i >= 0; i--) {
		mydiv.removeChild(ch[i]);
	}
}

function loadNextPage() {
	if (startIndex + blogsToDisplayInPage < blogsData.length) {
		startIndex += blogsToDisplayInPage;
		loadDataInBlogsDiv();
	} else {
		//console.log("On last page");
		return;
	}
}

function loadPrevPage() {
	if (startIndex - blogsToDisplayInPage < 0) {
		//console.log("Cannot go back");
		return;
	} else {
		startIndex -= blogsToDisplayInPage;
		loadDataInBlogsDiv();
	}
}

// View Blog Home Page Js End

function darkMode() {
	var element = document.body;
	element.classList.toggle("dark-mode");
	var dark = document.getElementById("dark-btn");
	dark.innerHTML = "Normal mode";
}