
var blogCount=-1;

$('document').ready(()=>
{
    getBlogsCount();

CKEDITOR.replace('editor1', {
    // Define the toolbar groups as it is a more accessible solution.
    toolbarGroups: [{
        "name": "basicstyles",
        "groups": ["basicstyles"]
      },
      {
        "name": "links",
        "groups": ["links"]
      },
      {
        "name": "paragraph",
        "groups": ["list", "blocks"]
      },
      {
        "name": "document",
        "groups": ["mode"]
      },
      {
        "name": "insert",
        "groups": ["insert"]
      },
      {
        "name": "styles",
        "groups": ["styles"]
      },
    ],

    // Remove the redundant buttons from toolbar groups defined above.
    removeButtons: 'Source'
  });
 });

function run() {
	console.log("posting blogs");
	postBlog();
}

function postBlog() {
	let blogid=blogCount+1;
	let et = document.getElementById("editor_title").value;
	let ed = document.getElementById("editor_desc").value;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = mm + '/' + dd + '/' + yyyy;
    console.log(today);
     
	let cat = document.getElementById("category").value;  
  
    let tags=$("input").tagsinput('items');
	//console.log(tags[2]);
	
	let myobj = {
		id: blogid,
		username:sessionStorage.getItem("user"),
		title: et,
		desc: ed,
		category: cat,
        tags: tags[2],
        date:today
	};

	postData("http://localhost:3004/metadata/", myobj);

    let blogcontent = CKEDITOR.instances.editor1.getData();
    let plain_text=getPlainText();
    
    myobj = {
		id: blogid,
        content: blogcontent,
        plainText:plain_text
	};

	postData("http://localhost:3005/mainData/", myobj);
	
	setBlogsCount(blogid);
	blogCount+=1;
}

function setBlogsCount(bi) {
	let myobj = {
		"id":1,
		"count": bi,
	};

	$.ajax({
		type: "PUT",
		url: "http://localhost:3000/blogs/1",
		dataType   : "json",
		contentType: "application/json",
		data: JSON.stringify(myobj),
		success : (x)=>{
			//console.log("put -> "+JSON.stringify(x));
		},
		error: (e) => {
			console.log(e);
		}
	});
}

function getBlogsCount() {
    console.log("getting blogs count");
	$.ajax({
		url: "http://localhost:3000/blogs/1",
		method: "GET",
		success: (x) => {
			//console.log("got -> "+JSON.stringify(x));
			//console.log("got -> "+x.count);
			blogCount=x.count;
		},
		error: (e) => {
			console.log(e);
		}
	});
}

function postData(myurl, myobj) {
	$.ajax({
		url: myurl,
		method: "POST",
		dataType: "json",
		contentType: "application/json",
		success: (x) => {
			console.log(x);
		},
		data: JSON.stringify(myobj),
	});
}

function getPlainText(){
	var html=CKEDITOR.instances.editor1.getSnapshot();
	var dom=document.createElement("DIV");
	dom.innerHTML=html;
	//var plain_text=(dom.textContent || dom.innerText);

	return dom.textContent;
}
