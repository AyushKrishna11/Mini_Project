if (!window.jQuery) {
    alert("jQuery Unavailable") 
}
else {
    $('document').ready(function(){
        $("#header").load("./header.html")
		$("#footer").load("./footer.html")

			$(".comments").click(function(){
				$(".comment-card").toggle();
			})

			var blogId = location.search;
		//	alert(blogId);
			//blogMetadata
			$.ajax({
				url:"http://localhost:3004/metadata" + blogId,
				method:"GET",
				success:(metadata) =>{
					

					$('#reader_title').text(metadata[0].title);
					$('#reader_author a').text(metadata[0].username);
					$('#reader_posted_on').text("Posted on : " + metadata[0].date);
					$('#reader_desc').text(metadata[0].description);
					$('#reader_cat button').text(metadata[0].category);
					
					if(metadata[0].tags.length > 0 ){
						metadata[0].tags.forEach((tag)=>{
						$('#reader_tag ul').append("<li class='btn btn-outline-secondary' >"+tag+ "</li>");
						});

					}
		
					},
					error:()=>{
						console.log("error");
					}	
			})

			//blogMaindata
			$.ajax({
				url:"http://localhost:3005/mainData" + blogId,
				
				method:"GET",
				success:(maindata) =>{

					
					
					//console.log("blogMainData : " + maindata[0]);

					$('#reader_blogcontent').html(maindata[0].content);
					},
					error:()=>{
						console.log("error");
					}	
			});
	});
}
