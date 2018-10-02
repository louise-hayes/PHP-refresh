var userRole = 0;
var selectedCountry = 0;
function countrylist(){
    window.localStorage.setItem('userType', 1);
    // List Country web service call here
    loaderLogin();
	$.ajax({
		url: serviceHTTPPath + "listCountry",
		type: "GET",
        dataType: 'json',       
		success: function (countryList) {		
			$.ajax({
				url: serviceHTTPPath + "userRoles",
				type: "GET",
                dataType: 'json',
               
				success: function (userRoles) {
                    //alert("success="+JSON.stringify(userRoles))
                    loaderRemoveFun();
                    appendCountry(countryList, userRoles)
				},
				error: function (e) {
                    loaderRemoveFun();					
					return;
				}
			});
		},
		error: function (e) {	
            loaderRemoveFun();	
			return;
		}
	});
	// List Country web service call end here
}

function appendCountry(countryList, userRoles){
    $('#countryDiv li').remove();	
	var html2 = '';
	var p;
	for (p = 0; p < countryList.json_data.response.length; p++) {		
            html2 += '<option value="' + countryList.json_data.response[p].country_id + '">' + countryList.json_data.response[p].country_name + '</option>'
	}
    $('#countryDiv').append(html2);
    
    $('#countryDiv').change(function(){
        selectedCountry = $(this).val();        
	});
    signupValidations();    
}
// Sign up validations
function signupValidations(){
    $('#register-form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
                name: {
                    validators: {
                        stringLength: {
                        min: 2,
                    },
                        notEmpty: {
                        message: 'Please enter your name'
                    },
                    regexp: {
                        regexp: /^[a-z\s]+$/i,
                        message: 'The username can only consist of alphabetical, number, dot and underscore'
                    },
                }
                },
                lastName: {
                    validators: {
                            stringLength: {
                            min: 2,
                        },
                            notEmpty: {
                            message: 'Please enter your last name'
                        },
                        regexp: {
                            regexp: /^[a-z\s]+$/i,
                            message: 'The username can only consist of alphabetical, number, dot and underscore'
                        },
                   }
                },
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
                phone: {
                    validators: {
                        notEmpty: {
                            message: 'Please enter your phone number'
                        },
                        phone: {
                            country: 'US',
                            message: 'Please supply a vaild phone number with area code'
                        }
                    }
                },
                country: {
                    validators: {
                        notEmpty: {
                            message: 'Please select your country'
                        }
                    }
                },
                password: {
                    validators: {
                        notEmpty: {
                            message: 'Please enter password'
                        },
                        identical: {
                            field: 'confirmPassword',
                            message: 'Confirm your password below - type same password please'
                        }
                    }
                },
                confirmPassword: {
                    validators: {
                        notEmpty: {
                            message: 'Please re-enter the password'
                        },
                        identical: {
                            field: 'password',
                            message: 'The password and its confirm are not the same'
                        }
                    }
                },       
                contact_no: {
                    validators: {
                    stringLength: {
                            min: 12, 
                            max: 12,
                        notEmpty: {
                            message: 'Please enter your Contact No.'
                        }
                    }
                },
              }
            }
        })
        .on('success.form.bv', function(e) {
            $('#success_message').slideDown({ opacity: "show" }, "slow")            
            // Do something ...
                $('#register-form').data('bootstrapValidator').resetForm();
    
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
            var email = getValue("email");
            var phone = getValue("phone");
            var country = getValue("country");
            var password = getValue("password");
            var confirmPassword = getValue("confirmPassword");


            var firstName =  getValue("name");
            var lastName =  getValue("lastName");
				
                    // Use Ajax to submit form data           
                    loaderLogin();
                    $.ajax({
                        url: serviceHTTPPath + "registerUser",	// Register user web service call here			
                        type: "POST",
                        dataType: 'json',
                        data: {
                            first_name: firstName,
                            last_name: lastName,
                            email: getValue("email"),
                            user_type: 1,
                            phone: getValue("phone"),
                            country: getValue("country"),
                            password: getValue("password"),
                            status: 1
                        },
                        success: function (response) {						 
                            //alert("success="+JSON.stringify(response))
                            loaderRemoveFun();
                            if (response.json_data.response == 1) {                        
                                var hrefScreen = "croSignIn.html";
                                alertScreen(response.json_data.message,hrefScreen)
                            }else{
                                var hrefScreen = "";
                                alertScreen(response.json_data.message,hrefScreen)
                            }
                        },
                        error: function (e) {
                            return;
                        }
                    });
            
        });
     // Register fun validation end here

    $("#name").keypress(function (event) {
		var inputValue = event.charCode;

		if (!(inputValue >= 65 && inputValue <= 122) && (inputValue != 32 && inputValue != 0)) {

			event.preventDefault();
		}
		else if (inputValue == 94 || inputValue == 91 || inputValue == 92 || inputValue == 93) {
			event.preventDefault();
		}
	});
}