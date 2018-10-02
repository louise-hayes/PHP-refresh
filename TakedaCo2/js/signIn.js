function userRoles() {
    loaderLogin();
    signInValidations("cro")
	
}
function signInValidations(loginType){
    $('#login-form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {                
                email: {
                    validators: {
                        notEmpty: {
                            message: 'Please enter your email id'
                        },
                        emailAddress: {
                            message: 'Please enter a valid Email Address'
                        }
                    }
                },
                password: {
                    validators: {
                        notEmpty: {
                            message: 'Please enter password'
                        },
                    }
                },          
            }
        })
        .on('success.form.bv', function(e) {
            $('#success_message').slideDown({ opacity: "show" }, "slow")            
            // Do something ...
            $('#login-form').data('bootstrapValidator').resetForm();
    
            // Prevent form submission
            e.preventDefault();
    
            // Get the form instance
            var $form = $(e.target);
            
            // Get the BootstrapValidator instance
            var bv = $form.data('bootstrapValidator');
           
           var values = {};
            $.each($("form").serializeArray(), function (i, field) {
                values[field.name] = field.value;                
            });
            var getValue = function (valueName) {
                return values[valueName];
            };
            var emailVal = getValue("email");
            var passwordVal = getValue("password"); 
            // var userRoleType = getValue("userRole");
                 
            // if(userRoleType == " " || userRoleType == undefined){               
            //     userRoleType = 1;
            // }  
            
            if(loginType == "cro"){
                croAuthenticateUser(emailVal,passwordVal);
            }else{
                authenticateSso(emailVal,passwordVal)
            } 
            
        });
    // Login fun validation end here
    loaderRemoveFun();
}
function croAuthenticateUser(emailVal,passwordVal){   
    var pageListArr = new Array("","croDashboard.html", "EMDashboard.html", "LMDashboard.html", "userManagement.html", "ICFManagement.html");
    var useTypeArr = new Array("1","2","3","4","5")
    //Login web service call start here
    loaderLogin();
	$.ajax({
		url: serviceHTTPPath + "authenticateUser",
		type: "POST",
		dataType: 'json',
		data: {
			email: emailVal,
			password: passwordVal,
			type_id: 1
		},
		success: function (response) {
			loaderRemoveFun();
            //alert("success=-"+JSON.stringify(response))		
			if (response.json_data.response == 1) {	              
               window.localStorage.setItem("user_id", response.json_data.user_id);	
               window.localStorage.setItem('userType',response.json_data.user_type);
               window.localStorage.setItem("token_id", response.json_data.token);	              
               window.localStorage.setItem("is_active", response.json_data.is_active);

               var firstName = response.json_data.first_name;
               var lastName = '';
               if(response.json_data.last_name != 0){
                   lastName = response.json_data.last_name;
               }
               window.localStorage.setItem("user_name", firstName+" "+lastName);
              
               if(response.json_data.user_type == 1){
                location.href = "croDashboard.html";
               }	
               else{
				location.href = pageListArr[response.json_data.user_type];
               }	
			}
			else {
				alertScreen(response.json_data.message,'');
			}
		},
		error: function (e) {
			loaderRemoveFun();
			return;
		}
	});
	//Login web service web call end here
}

// Call for local testing and login for Escalation,legal and management user types
function ssoUserType(){
    loaderLogin();
    signInValidations("sso")
}
function authenticateSso(emailVal,passwordVal){    
     //Login web service call start here
     loaderLogin();
     $.ajax({
         url: serviceHTTPPath + "authenticateSso",
         type: "POST",
         dataType: 'json',
         data: {
             email: emailVal,
             password: passwordVal,
         },
         success: function (result) {
             loaderRemoveFun();
             //alert("success=-"+JSON.stringify(result))
                var firstName = result.json_data.first_name;
                var lastName = '';
                if(result.json_data.last_name != 0){
                    lastName = result.json_data.last_name;
                }                
                window.localStorage.setItem("user_name", firstName+" "+lastName);
                window.localStorage.setItem("user_id", result.json_data.user_id);	
                window.localStorage.setItem("token_id", result.json_data.token);
               
                if(result.json_data.response == 0){
                    alertScreen(result.json_data.message,"")
                }else{
                    if(result.json_data.token == undefined){
                        alertScreen(result.json_data.message,"")
                    }else{
                        location.href = "chooseRole.html?token="+result.json_data.token
                    }
                    
                }
                
         },
         error: function (e) {
             loaderRemoveFun();
             return;
         }
     });
     //Login web service web call end here
}