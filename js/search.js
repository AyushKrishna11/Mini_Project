var category = ["Arts", "Team", "Fiction", "Science", "Study"];
var tags = ["Life", "Race", "Skills", "Attitude", "Customer"];

function appendCategoryButtons(container) {
	let p1 = document.createElement("p");
	// p1.textContent = "Category";
	container.appendChild(p1);

	for (let i = 0; i < category.length; i++) {
		let x = document.createElement("button");
		x.textContent = category[i];
		x.onclick = function () {
			searchAndLoadByCategory(category[i]);
		};
		x.classList.add("btn");
		x.classList.add("btn-outline-info");
		container.appendChild(x);
	}
}

function appendTagsButtons(container) {
	let p2 = document.createElement("p");
	// p2.textContent = "Tags";
	container.appendChild(p2);

	for (let i = 0; i < tags.length; i++) {
		let x = document.createElement("button");
		x.textContent = tags[i];
		x.onclick = function () {
			searchAndLoadByTags(tags[i]);
		};
		x.classList.add("btn");
		x.classList.add("btn-outline-secondary");
		container.appendChild(x);
	}
}

function searchAndLoadByTags(phrase) {
	searchDataAndLoad("Tags", phrase);
}

function searchAndLoadByCategory(phrase) {
	searchDataAndLoad("Category", phrase);
}

function search() {
	console.log("search");
	//debugger;
	let at = document.getElementById("search_place").value;
	let phraseinput = document.getElementById("searchinput");
	let phrase = phraseinput.value.trim();

	if (phrase.length === 0) {
		alert("Enter a phrase to search");
		return;
	} else {
		searchDataAndLoad(at, phrase);
	}
}

function searchDataAndLoad(at, searchPhrase) {
	if (at != "Main Content") {
		searchInMetaData(at, searchPhrase);
	} else {
		searchInContent(at, searchPhrase);
	}
}

function searchInMetaData(at, searchPhrase) {
	//alert("before ajax call");
	$.ajax({
		url: "http://localhost:3004/metadata",
		method: "GET",
		success: (blogs) => {
			//console.log("Total blogs read -> "+blogs.length);
			//alert("after ajax call");
			let searchResultArray = searchForWord(searchPhrase, at, blogs);

			loadSearchResultsOnPage(at, searchPhrase, searchResultArray);
		},
		error: (e) => {
			alert(e);
			console.log(e);
		},
	});
}

function displayArray(array) {
	console.log("Total objects in array -> " + array.length);
	for (let i = 0; i < array.length; i++) {
		console.log("Blog in array -> id = " + array[i].id);
	}
}

function searchForWord(phrase, at, blogs) {
	//console.log("searching for word -> " + phrase);
	let searchResultArray = [];

	let words = [];
	if (phrase.indexOf(" ") > 0) {
		words = phrase.split(" ");
	} else words.push(phrase);

	for (let i = 0; i < blogs.length; i++) {
		let allWordsFound = true;
		for (let j = 0; j < words.length; j++) {
			let wordFound = false;
			// console.log(
			// 	"Searching at blog index -> " + (i + 1) + " for word -> " + words[j]
			// );
			switch (at) {
				case "Category":
					wordFound = checkEqualsIgnoringCase(blogs[i].category, words[j]);
					break;

				case "Full Metadata":
					console.log("searching in full metadata");

				case "Title":
					console.log("searching in title");
					wordFound = checkEqualsIgnoringCase(blogs[i].title, words[j]);
					if (wordFound || at !== "Full Metadata") break;

				case "Description":
					console.log("searching in description");
					wordFound = checkEqualsIgnoringCase(blogs[i].desc, words[j]);
					if (wordFound || at !== "Full Metadata") break;

				case "Tags":
					console.log("searching in tags");
					for (let k = 0; k < blogs[i].tags.length; k++) {
						wordFound = checkEqualsIgnoringCase(blogs[i].tags[k], words[j]);
						if (wordFound) break;
					}
					if (wordFound || at !== "Full Metadata") break;
			} // end of switch

			console.log("word found -> " + wordFound);
			allWordsFound = allWordsFound & wordFound;
			if (!allWordsFound) break;
		} // end of inner loop
		if (allWordsFound) searchResultArray.push(blogs[i]);
	} // end of outer loop

	for (let k = 0; k < searchResultArray.length; k++)
		console.log("Found " + words + " in " + searchResultArray[k].id + " blog");

	return searchResultArray;
}

function searchInContent(at, searchPhrase) {
	//var searchResultIDsArray = [];

	$.ajax({
		url: "http://localhost:3005/mainData/",
		method: "GET",
		success: (blogs) => {
			let searchResultIDsArray = searchForWordInContent(searchPhrase, blogs);

			//console.log(searchResultIDsArray);
			loadRequiredMetaData(at, searchPhrase, searchResultIDsArray);
		},
		error: (e) => {
			console.log(e);
		},
	});
}

function loadRequiredMetaData(at, searchPhrase, searchResultIDsArray) {
	$.ajax({
		url: "http://localhost:3004/metadata/",
		method: "GET",
		success: (blogs) => {
			let x = [];
			for (let i = 0; i < searchResultIDsArray.length; i++) {
				x.push(blogs[searchResultIDsArray[i] - 1]);
			}

			loadSearchResultsOnPage(at, searchPhrase, x);
		},
		error: (e) => {
			console.log(e);
		},
	});
}

function searchForWordInContent(searchPhrase, blogs) {
	console.log("searching for phrase in contents -> " + searchPhrase);
	let searchResultIDsArray = [];

	let searchWords = [];
	if (searchPhrase.indexOf(" ") > 0) {
		searchWords = searchPhrase.split(" ");
	} else searchWords.push(searchPhrase);

	for (let j = 0; j < blogs.length; j++) {
		//console.log(blogs[j].plaintext);
		let allWordsFound = true;
		for (let k = 0; k < searchWords.length; k++) {
			let wordFound = checkEqualsIgnoringCase(
				blogs[j].plaintext,
				searchWords[k]
			);
			allWordsFound = allWordsFound & wordFound;
			if (!allWordsFound) break;
		}
		if (allWordsFound) searchResultIDsArray.push(blogs[j].id);
	}

	return searchResultIDsArray;
}

function checkEqualsIgnoringCase(blogElementString, searchWord) {
	//console.log("Comapring -> "+text+" ; "+other);
	//console.log(text.localeCompare(other, undefined, { sensitivity: 'base' }));
	let wordFound = false;

	let words = [];
	if (blogElementString.indexOf(" ") > 0) {
		words = blogElementString.split(" ");
	} else words.push(blogElementString);

	for (let i = 0; i < words.length; i++) {
		if (
			words[i].localeCompare(searchWord, undefined, { sensitivity: "base" }) ==
			0
		) {
			//console.log("To add -> "+blogMetaDataObject.id+" ; in array -> "+searchResultArray);
			//searchResultArray.push(blogMetaDataObject);
			wordFound = true;
			if (wordFound) break;
		}
	}

	return wordFound;
}

function loadSearchResultsOnPage(at, searchPhrase, searchResult) {
	clearOldResults();
	//alert("some");
	setResultMessage(at, searchPhrase, searchResult);
	blogsData = searchResult;
	startIndex = 0;
	displayData();
	//alert("some2");
}

function setResultMessage(at, searchPhrase, searchResult) {
	let noOfSearchResultsFound = document.getElementById(
		"NoOfSearchResultsFound"
	);

	if (searchResult.length === 0)
		noOfSearchResultsFound.innerHTML = "No blogs to display";
	else {
		if (at == "Category")
			noOfSearchResultsFound.innerHTML =
				"Found " + searchResult.length + " blogs for category " + searchPhrase;
		else if (at == "Tags")
			noOfSearchResultsFound.innerHTML =
				"Found " + searchResult.length + " blogs for tags " + searchPhrase;
		else
			noOfSearchResultsFound.innerHTML =
				"Found " + searchResult.length + " blogs for phrase " + searchPhrase;
	}
}

function clearOldResults() {
	let mydiv = document.getElementById("blog");
	let ch = mydiv.childNodes;
	//console.log("total child -> "+ch.length);
	//console.log(ch);
	for (let i = ch.length - 1; i >= 0; i--) {
		mydiv.removeChild(ch[i]);
	}
}
