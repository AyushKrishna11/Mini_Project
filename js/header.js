if (!window.jQuery) {
    alert("jQuery Unavailable") 
  }
  else {
  $(document).ready(function(){
  
    $("#header").load("./header.html")
    $("#footer").load("./footer.html")
    $("#loginBtn").click(function(){
      
      $("#myModal").modal();
    });
  
    $("#btn-signup").click(function(){
      $("#signupModal").modal();
    })
  
      $("#about").click(function(){
      // this.append('<span class="sr-only">(current)</span>')
      console.log("about us clicked")
      $('.active').removeClass('active');
      $(this).parent().addClass('active');
      window.location.replace('../html/about_us.html');
      })
  
        $("#home").click(function(){
        // this.append('<span class="sr-only">(current)</span>')
      console.log("home clicked")
      $('.active').removeClass('active');
        $(this).parent().addClass('active');
      window.location.replace('../html/index.html');
        
        })
    
  
  $("#dob").datepicker({
    endDate : new Date()
  });
    $('#showPasswordCheck').click(function(){
      $(this).is(':checked') ? $('#password').attr('type', 'text') : $('#password').attr('type', 'password');
  });
  $('#showConfirmPasswordCheck').click(function(){
      $(this).is(':checked') ? $('#confirm_password').attr('type', 'text') : $('#confirm_password').attr('type', 'password');
  });
  
  
   //TO ADD REGULAR EXPRESSION METHOD AS A RULE FOR VALIDATION
   $.validator.addMethod('regx', function(value, element, param) {
    return this.optional(element) ||
        value.match(typeof param === 'string' ? new RegExp(param) : param);
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
        dob:{
          required: true,
          // regx: "^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$"
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
          equalTo:"Password does not match"
        
        },
        email: "Please enter a valid email address",
        dob:{
          required: "Please enter your birthdate",
          // regx: "Enter a valid date"
        }
  
        
      },
      // Make sure the form is submitted to the destination defined
      // in the "action" attribute of the form when valid
      submitHandler: function(form) {
        alert("Hello : ");
        console.log("from sunmityhandler: ",fname,lname,email);

      }
    });
  
  
  });
  
    function validateForm() {
      console.log("validate");
      var un = document.getElementById('usrname').value
      console.log(un);
      var pw =  document.getElementById('psw').value
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
        sessionStorage.setItem("user",username);
        alert("Login Successful");
            }
          else{ 
            let msg=document.getElementById("login_msg");
            msg.innerHTML="Incorrect Username / Password ";
          }
        },
        error: (e) => {
          //alert("Error: " + e);
        },
      });
    }
    
  // Blog Retrieval code
    $.ajax({ 
      type: 'GET', 
      url: 'http://localhost:3004/posts', 
      data: { get_param: 'value' }, 
      success: function (blogMetaData) { 
          
          console.log( "blogMoetaData : ", blogMetaData.length)
          let i=0;
          for( ; (i<blogMetaData.length && i<5) ; i++){
              
              let blogList = $("#blog");
              let singleBlog = $("<div></div>").appendTo(blogList).addClass("card m-4");
              let singleBlogBody = $("<div></div>").appendTo(singleBlog).addClass("card-body");
              $("<img>").appendTo(singleBlogBody).addClass("card-img-top").attr('src',"../assets/images/idea.png");
              $("<h5></h5>").appendTo(singleBlogBody).addClass("card-title").append(blogMetaData[i].title);
              $("<p></p>").appendTo(singleBlogBody).addClass("card-text").append(blogMetaData[i].description);
              $("<a></a>").appendTo(singleBlogBody).addClass("btn btn-outline-danger mb-4").attr("href",'reader.html/'+blogMetaData[i].blogid).append("Read More");
              
  
          } 
      }
      
      
  });
  
  }