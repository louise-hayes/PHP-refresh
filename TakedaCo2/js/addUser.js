function callToUserRole(result, userType,user_id,setManagerArr) {
   
    if(window.localStorage.getItem('token_id') != null){
        loaderLogin();
        $.ajax({
            url: serviceHTTPPath + "userRoles",
            type: "GET",
            dataType: 'json',
            headers: {
                "authorization": window.localStorage.getItem("token_id")
            },
            success: function (resultUserManager) {		
                //alert("success="+JSON.stringify(resultUserManager))	 
                loaderRemoveFun();
                addUserPopup(resultUserManager,result, userType,user_id,setManagerArr);
            },
            error: function (e) {
                loaderRemoveFun();
                return;
            }
        });
    }else{
        location.href = "../index.html";
    }
}
function addUserPopup(resultUserManager,result, userType,user_id,setManagerArr){ 
    var counter = 0;
    var arr = new Array();
    $('body .multiStep').remove();
    var html='<form class="modal multi-step multiStep" id="demo-modal-3">'
            html+='<div class="modal-dialog" style="width:500px;">'
                html+='<div class="modal-content">'
                    html+='<div class="modal-header">'
                    html += '<button type="button" class="close crossIcon"';
                     html += 'data-dismiss="modal">';
                        html += '<span aria-hidden="true">&times;</span>'		
                     html += '</button>';
                     if(result != ''){
                        html+='<h4 class="modal-title text-center">EDIT USER</h4>'
                     }else{
                        html+='<h4 class="modal-title text-center">ADD USER</h4>'
                     }
                     
                    html+='</div>'

                    //Step 1
                    html+='<div class="modal-body step-1 noPadding" data-step="1" id="detail">'
                        html+='<div class="headerDiv">'
                         html+='<p>User Details</p>'
                        html+='</div>'
                        html+='<div class="multipleContainer" id="">'
                            html+='<div class="container-login-form-btn" id="userDetails">'
                            
                            //First name
                            html+='<div class="form-group row addUserContainer">'
                                html+='<label class="col-xs-3 control-label classTitle">First Name<em class="required"> *</em></label>'
                                html+='<div class="col-xs-9 inputGroupContainer">'
                                    html+='<div class="input-group">'
                                    
                                    if(result !=''){
                                        html+='<input  id="firstname" name="name" placeholder="First Name" value="'+result.json_data.response[0].first_name+'" class="form-control"  type="text">'
                                    }else{
                                        html+='<input  id="firstname" name="name" placeholder="First Name" class="form-control"  type="text">'
                                    }
                                    
                                    html+='</div>'
                                html+='</div>'
                            html+='</div>'

                            // Last name
                            html+='<div class="form-group row addUserContainer">'
                                html+='<label class="col-xs-3 control-label classTitle">Last Name<em class="required"> *</em></label>'
                                html+='<div class="col-xs-9 inputGroupContainer">'
                                    html+='<div class="input-group">'
                                    
                                    if(result !=''){
                                        var last_name = result.json_data.response[0].last_name;
                                        if(last_name == 0){
                                            last_name ='';
                                        }
                                        html+='<input  id="lastName" name="lastName" value="'+last_name+'" placeholder="Last Name" class="form-control"  type="text">'
                                    }else{
                                        html+='<input  id="lastName" name="lastName" placeholder="Last Name" class="form-control"  type="text">'
                                    }                                        
                                    html+='</div>'
                                html+='</div>'
                            html+='</div>'

                                // Email
                            html+='<div class="form-group row addUserContainer">'
                                html+='<label class="col-xs-3 control-label classTitle">Email ID<em class="required"> *</em></label>'
                                html+='<div class="col-xs-9 inputGroupContainer">'
                                    html+='<div class="input-group">'
                                   
                                    if(result != ''){
                                        html+='<input name="email" id="email" disabled placeholder="E-Mail Address" value="'+result.json_data.response[0].email+'" class="form-control"  type="text">'
                                    }else{
                                        html+='<input name="email" id="email" placeholder="E-Mail Address" class="form-control"  type="text">'
                                    }
                                    html+='</div>'
                                html+='</div>'
                            html+='</div>'

                            html+='</div>'
                        html+='</div>'
                    html+='</div>'

                    //Step 2
                    html+='<div class="modal-body step-2 noPadding" data-step="2" id="userRole">';
                        html+='<div class="headerDiv">';
                         html+='<p>Select Role</p>';                        
                        html+='</div>';

                        html+='<div class="multipleContainer" id="">';                      
                            
                        // html+='<div class="container-login-form-btn" id="selectRole">';
                        // html+='</div>';
                            //Role Dropdown
                            html+='<div class="container-login-form-btn" id="selectRole">';
                                html+='<div class="form-group row addUserContainer">';
                                    html+='<label class="col-xs-5 control-label classTitle">Role<em class="required"> *</em></label>';
                                    html+='<div class="col-xs-7 selectContainer">';
                                        html+='<div class="input-group" id="userSelect">';                        
                                       html+='<select name="userRole" multiple="multiple" placeholder="Select Role" id="userRoleSelect" class="SlectBox">';                                
                                        for (var k = 0; k < resultUserManager.json_data.response.length; k++) {                                                                                                                                                
                                           html+='<option value="' + resultUserManager.json_data.response[k].type_id + '" id="'+k+'">' + resultUserManager.json_data.response[k].name + '</option>';
                                          
                                        }
                                        
                                        html+='</select>';
                                                                                                                      
                                        html+='</div>';
                                        html+='<span class="errorTxt" style="color: red;"></span>';
                                    html+='</div>';
                                html+='</div>';
                            html+='</div>';
                            
                            //Choose Category Dropdown                                 
                            html+='<div class="container-login-form-btn" id="selectCategory">';                           
                            html+='</div>';
                        
                        // Directly Assign Budget Request
                            html+='<div class="" id="budgetRequest">';                                    
                            html+='</div>';

                        //Directly Assign Contract Request
                            html+='<div class="" id="contractRequest">';
                            html+='</div>';

                            //ICF Check Box
                            html+='<div class="" id="icfChkBox">';
                            html+='</div>';

                        html+='</div>';

                    html+='</div>';
                        
                        //Step 3
                        html+='<div class="modal-body step-3 noPadding" data-step="3" id="userStatus">';   

                            html+='<div class="headerDiv">';
                            html+='<p>User Status</p>';                         
                            html+='</div>';
                            
                            html+='<div class="multipleContainer" id="">'
                                html+='<div class="container-login-form-btn analyticsDiv"></div>';
                            
                                html+='<div class="userManagementDiv"></div>';

                                var statusArr = new Array("Active","Inactive");
                                var statusValArr = new Array(1,0);
                                if(result == ''){
                                    html+='<div class="container-login-form-btn" id="status">';
                                        html+='<div class="form-group row statusContainer">';
                                            html += '<label class="classTitle">Status</label>';
                                                for(var i=0;i<statusArr.length;i++){
                                                    html += '<div class="form-check userStatusDiv">';                          
                                                        html += '<label class="radionBtn">';
                                                        if(result != ''){
                                                            
                                                            if(result.json_data.response[0].is_enabled == statusValArr[i]){
                                                                html += '<input type="radio" name="status" value="'+statusValArr[i]+'" checked> <span class="label-text statusTxt'+i+'" style="color:#4c9bcf;">'+statusArr[i]+'</span>'
                                                            }else{
                                                                html += '<input type="radio" name="status" value="'+statusValArr[i]+'"> <span class="label-text statusTxt'+i+'">'+statusArr[i]+'</span>'
                                                            }
                                                        }else{
                                                            if(i== 0){
                                                                html += '<input type="radio" name="status" value="'+statusValArr[i]+'" checked> <span class="label-text statusTxt'+i+'" style="color:#4c9bcf;">'+statusArr[i]+'</span>'
                                                            }
                                                            else{
                                                                html += '<input type="radio" name="status" value="'+statusValArr[i]+'"> <span class="label-text statusTxt'+i+'">'+statusArr[i]+'</span>'
                                                            }
                                                        }
                                                                                                        
                                                        html += '</label>';
                                                    html += '</div>';
                                                }
                                        html+='</div>';
                                    html+='</div>';
                                }
                                
                             html+='</div>';
                        html+='</div>';

                        //Footer
                        html+='<div class="modal-footer footerBtnAdd">';
                        html+='</div>';

                html+='</div>';
            html+='</div>';
        html+='</form>';

    $('body').append(html);    
    
    $('.multiStep').modal();    
    multiStepModel();
  
    var userTypeGet = "";
    if(result != ''){       
        for (var g = 0; g < result.json_data.response.length; g++) {               
            if(result.json_data.response[g].user_type == 3){
                choosecategoryFun(result);  
            }  
            else if(result.json_data.response[g].user_type == 4){
                userTypeGet = result.json_data.response[g].user_type;
                analyticsFun(result); 
                userManagementCheck(result);
            }   
            arr.push(result.json_data.response[g].user_type);
            
          if(g == result.json_data.response.length-1){   
            //Pre Selected user type
            $('#userRoleSelect').val(arr);           
           
            if(arr == 1){
                nextBackBtn(userTypeGet,"edit",result);
            }else{
                nextBackBtn(userTypeGet,"add",result);     //edit 
            }                 
          }
        }
    }else{
        nextBackBtn(userTypeGet,"add",result);
    }    

    $('#userRoleSelect').multiselect({
            nonSelectedText: "Select Role",    
            templates: { // Use the Awesome Bootstrap Checkbox structure
                li: '<li class="checkList"><a tabindex="0"><div class="aweCheckbox aweCheckbox-danger"><label for=""></label></div></a></li>'
            },
            numberDisplayed: 1,   
            onChange: function(option, checked) {            
                $('.errorTxt').text('');                               
                if($(option).is(':checked') ) {               
                    if($(option).val() == 1){                      
                        $('.checkList input[value!="'+ $(option).val() +'"]:checked').trigger('click');                        
                        $('#selectCategory .addUserContainer').remove();
                    }
                    else if($(option).val() == 3){
                        $('.checkList input[value="1"]:checked').trigger('click');
                        choosecategoryFun(result); 
                    }
                    else if($(option).val() == 4){
                        if(result != ''){                            
                            $('.changeBtn button').remove()
                            var html='<button type="button" class="btn btn-primary editSave step nextBtn step-2" data-step="2" id="3">Next</button>'; 
                            $('.changeBtn').append(html)

                            // Next and Back Button Click Events
                            $('.nextBtn').click(function() {            
                                window.localStorage.setItem("nextBtnId", $(this).attr('id'));
                                
                                if($(this).attr('id') == 3){  
                                    validationSelectRole();
                                }
                                else{
                                    $('.multiStep').submit();
                                }       
                            });
                            //Submit after next button click
                            $('#addBtn').click(function(e) {    
                                var roleArr = $('#userRoleSelect').val();                               
                                var managementFlag = true;                               
                                if($('.editSave').attr('id') == 3){                          
                                    if(roleArr !== '' && roleArr !== null){
                                        for(var r=0;r<roleArr.length;r++){
                                            if(roleArr[r] == 4){
                                                managementFlag = false;
                                            }
                                            if(r == roleArr.length-1)
                                            {
                                                if(managementFlag == false){                                                                              
                                                    if($('#chooseAnalytics').val() !== '' && $('#chooseAnalytics').val() !== null){
                                                        if(userManagementArr != ''){
                                                            editValidation(result,user_id,userType,setManagerArr);                          
                                                        }else{
                                                            $('.errorTxtUserManagement').text("Please choose user management first");
                                                        }                        
                                                    }
                                                    else{
                                                        $('.errorTxtAnalytics').text("Please choose analytics first");
                                                    }
                                                }
                                                else{                   
                                                    editValidation(result,user_id,userType,setManagerArr); 
                                                }
                                            }
                                        }            
                                    }else{
                                        $('.errorTxt').text("Please choose role first");
                                    }
                                }
                            })
                        }                     
                        $('.checkList input[value="1"]:checked').trigger('click');
                        analyticsFun(result);
                        userManagementCheck(result);
                    }
                    else{                                   
                        $('.checkList input[value="1"]:checked').trigger('click');
                    }
                }
                else{          
                    var chkArr = $('#userRoleSelect').val(); 
                    if($(option).val() == 3){
                        if(result != ''){ 
                            // $('.editSave').removeAttr('id')                      
                            // $('.editSave').attr('id', 'addBtn')                        
                            // $('.editSave').text("Submit");
                            
                            // $('.changeBtn button').remove()
                            // var html='<button type="button" class="btn btn-primary nextBtn editSave step step-2" id="addBtn" data-step="2">Submit</button>'; 
                            // //var html='<button type="button" class="btn btn-primary editSave step nextBtn step-2" data-step="2" id="3">Next</button>'; 
                            // $('.changeBtn').append(html);
                        }
                        $('#selectCategory .addUserContainer').remove();
                        $('#icfChkBox #chkBoxDiv').remove();
                        $('#budgetRequest #status').remove();
                        $('#contractRequest #contract').remove();                        
                    }
                    else if($(option).val() == 4){  
                        if(result != ''){
                            $('.changeBtn button').remove()
                            var html='<button type="button" class="btn btn-primary nextBtn editSave step step-2" id="addBtn" data-step="2">Submit</button>';
                            $('.changeBtn').append(html);   

                            //Submit second screen
                            $('#addBtn').click(function(e) {    
                                var roleArr = $('#userRoleSelect').val();
                                var managementFlag = true;           
                              
                                if($('.editSave').attr('id') != 3){
                                    if(roleArr !== '' && roleArr !== null){
                                        for(var r=0;r<roleArr.length;r++){
                                            if(roleArr[r] == 4){
                                                managementFlag = false;
                                            }
                                            if(r == roleArr.length-1)
                                            {
                                                if(managementFlag == false){                                                                              
                                                    if($('#chooseAnalytics').val() !== '' && $('#chooseAnalytics').val() !== null){
                                                        if(userManagementArr != ''){
                                                            editValidation(result,user_id,userType,setManagerArr)                          
                                                        }else{
                                                            $('.errorTxtUserManagement').text("Please choose user management first");
                                                        }                        
                                                    }
                                                    else{
                                                        $('.errorTxtAnalytics').text("Please choose analytics first");
                                                    }
                                                }
                                                else{                   
                                                    editValidation(result,user_id,userType,setManagerArr); 
                                                }
                                            }
                                        }            
                                    }else{
                                        $('.errorTxt').text("Please choose role first");
                                    }
                                }
                            })  
                        }
                        $('.analyticsDiv #analyticsContainer').remove();
                        $('.userManagementDiv .userManagerDiv').remove();                                       
                    }                                        
                }                      
            }
    });    
    multiselectCheck();

    //Default disabled value in dropdown
    if(result != ''){       
        for(var i=0;i<arr.length;i++){
            if(arr[i] == 1){
                $("#userSelect .multiselect-container li a .aweCheckbox input[value=2]").attr('disabled', 'disabled');
                $("#userSelect .multiselect-container li a .aweCheckbox input[value=3]").attr('disabled', 'disabled');
                $("#userSelect .multiselect-container li a .aweCheckbox input[value=4]").attr('disabled', 'disabled');
            }else{
                $("#userSelect .multiselect-container li a .aweCheckbox input[value=1]").attr('disabled', 'disabled');
            }
        }
    }

    addUserValidations();

    // Next and Back Button Click Events
    $('.nextBtn').click(function() {            
        window.localStorage.setItem("nextBtnId", $(this).attr('id'));
       
        if($(this).attr('id') == 3){  
            validationSelectRole();
        }
        else{
            $('.multiStep').submit();
        }       
    });
    $('.backBtn').click(function() {
        sendEvent('#demo-modal-3', $(this).attr('id'));       
    });

    //Status radio buttons click event
	$('.statusContainer .radionBtn input[type=radio]').on('change', function () {		
		var radioButtons = $('.statusContainer .radionBtn input:radio[name="status"]');
		
		var index = radioButtons.index(radioButtons.filter(':checked'));
        var issueType = $('.statusContainer .radionBtn .statusTxt'+index).text();
        		
		for (l = 0; l < statusArr.length; l++) {
			$('.statusContainer .radionBtn .statusTxt' + l).css("color", "#333");
		}		
		$('.statusContainer .radionBtn .statusTxt' + index).css("color", "#4c9bcf");
    });    

    // Add User Click event
    $('#addBtn').click(function() {       
        var roleArr = $('#userRoleSelect').val();
        var managementFlag = true;       
        if(roleArr !== '' && roleArr !== null){
            for(var r=0;r<roleArr.length;r++){
                if(roleArr[r] == 4){
                    managementFlag = false;
                }
                if(r == roleArr.length-1)
                {                  
                    if(managementFlag == false){                       
                        if($('#chooseAnalytics').val() !== '' && $('#chooseAnalytics').val() !== null){
                            if(userManagementArr != ''){
                                if(result != ''){                                   
                                    editValidation(result,user_id,userType,setManagerArr)
                                }else{
                                    adduserService(setManagerArr);
                                }                           
                            }else{
                                $('.errorTxtUserManagement').text("Please choose user management first");
                            }                        
                        }
                        else{
                            $('.errorTxtAnalytics').text("Please choose analytics first");
                        }
                    }
                    else{                   
                        if(result != ''){                          
                            editValidation(result,user_id,userType,setManagerArr)
                        }else{
                            adduserService(setManagerArr);
                        }
                    }
                }
            }            
        }else{
            $('.errorTxt').text("Please choose role first") 
        }
         
    });
   
    sendEvent = function(sel, step) {    
        $(sel).trigger('next.m.' + step);
    }
}
function editValidation(result,user_id,userType,setManagerArr){
    if(result != ''){
        var chooseCategoryArr = $('#chooseCategory').val();        
        var chooseCategoryFlag = true; 
      
        if(chooseCategoryArr !== '' && chooseCategoryArr != null && chooseCategoryArr != undefined){             
            for(var y=0;y<chooseCategoryArr.length;y++){
                if(chooseCategoryArr[y] == 4){
                    chooseCategoryFlag = false;                           
                }                               
                if(y == chooseCategoryArr.length - 1){
                    if(chooseCategoryFlag == false){
                        if(icfOptionArr != ''){
                            edituserService(user_id,userType,setManagerArr);
                        }
                        else{
                            $('.errorTxtICF').text('Please choose ICF Option');
                        }
                    }
                    else{
                        edituserService(user_id,userType,setManagerArr);
                    }
                }                 
            }  
        }
        else{
            var roleArr = $('#userRoleSelect').val();            
            var flag = true;           
            for(var u=0;u<roleArr.length;u++){
                if(roleArr[u] == 3){
                    flag = false;
                }
                  if(u == roleArr.length-1){
                    if(flag == false){
                        $('.errorTxtCategory').text('Please choose category first'); 
                    }else{                       
                        if(chooseCategoryArr !== '' && chooseCategoryArr != null && chooseCategoryArr != undefined){    
                            if(icfOptionArr != ''){                              
                                edituserService(user_id,userType,setManagerArr);
                            }
                            else{
                                $('.errorTxtICF').text('Please choose ICF Option');
                            }    
                        } else{
                            edituserService(user_id,userType,setManagerArr);
                        }                  
                    }
                }
            } 
            
        }  
        
    }else{
        edituserService(user_id,userType,setManagerArr);
    }  
}
//multiselectCheck click event 
function multiselectCheck(){
    $('.multiselect-container div.aweCheckbox').each(function(index) {
        var id = 'multiselect-' + index,
        $input = $(this).find('input');
    
        // Associate the label and the input
        $(this).find('label').attr('for', id);
        $input.attr('id', id);
    
        // Remove the input from the label wrapper
        $input.detach();
    
        // Place the input back in before the label
        $input.prependTo($(this));
        
        $(this).click(function(e) {
          // Prevents the click from bubbling up and hiding the dropdown 
          e.stopPropagation();
        });
    
      });
}
function nextBackBtn(userType,addEditType,result){
    $('.footerBtnAdd .footerBtns').remove();
    var html='<div class="footerBtns">';
    
    if(addEditType == "add")
    {
        if(result != ''){    
            var userFlag=true;   
            for (var g = 0; g < result.json_data.response.length; g++) {                           
              if(result.json_data.response[g].user_type == 4){   
                userFlag = false;                                    
              }

              if(g == result.json_data.response.length-1){                        
                  if(userFlag == true){
                    html+='<button type="button" class="btn btn-primary step nextBtn step-1" data-step="1" id="2">Next</button>';  
                    html+='<div class="changeBtn">';
                    html+='<button type="button" class="btn btn-primary nextBtn editSave step step-2" id="addBtn" data-step="2">Submit</button>';                        
                    html+='</div>'; 

                    html+='<div>';
                     html+='<button type="button" class="btn step backBtn step-2" data-step="2" id="1" >Back</button>';
                    html+='</div>';   

                    html+='<button type="button" class="btn addBtn step step-3" id="addBtn" data-step="3" onclick="">Submit</button>';

                    html+='<div>';
                     html+='<button type="button" class="btn step backBtn step-3" data-step="3" id="2">Back</button>';
                    html+='</div>';
                  }else{
                    html+='<button type="button" class="btn btn-primary step nextBtn step-1" data-step="1" id="2">Next</button>';  
                    html+='<div class="changeBtn">';
                     html+='<button type="button" class="btn btn-primary editSave step nextBtn step-2" data-step="2" id="3">Next</button>';                       
                    html+='</div>'; 
                    
                    html+='<div>';
                     html+='<button type="button" class="btn step backBtn step-2" data-step="2" id="1" >Back</button>';
                    html+='</div>'; 

                    html+='<button type="button" class="btn addBtn step step-3" id="addBtn" data-step="3" onclick="">Submit</button>';

                    html+='<div>';
                     html+='<button type="button" class="btn step backBtn step-3" data-step="3" id="2">Back</button>';
                    html+='</div>';
                  }
              }
            }
        }else{
            html+='<button type="button" class="btn btn-primary step nextBtn step-1" data-step="1" id="2">Next</button>';  
            html+='<button type="button" class="btn btn-primary editSave nextBtn step step-2" data-step="2" id="3">Next</button>';                        
    
            html+='<div>';
             html+='<button type="button" class="btn step backBtn step-2" data-step="2" id="1" >Back</button>';
            html+='</div>';  

            if(result != ''){
                html+='<button type="button" class="btn addBtn step step-3" id="addBtn" data-step="3" onclick="">Submit</button>';
            }else{
                html+='<button type="button" class="btn step addBtn step-3" id="addBtn" data-step="3" onclick="">Add</button>';
            }

            html+='<div>';
             html+='<button type="button" class="btn step backBtn step-3" data-step="3" id="2">Back</button>';
            html+='</div>';
        }
       
    }else{             
        if(userType == 4){
            html+='<button type="button" class="btn btn-primary step nextBtn step-1" data-step="1" id="2">Next</button>';  
            html+='<button type="button" class="btn btn-primary editSave nextBtn step step-2" data-step="2" id="3">Next</button>';                        

            html+='<div>';
            html+='<button type="button" class="btn step backBtn step-2" data-step="2" id="1" >Back</button>';
            html+='</div>'; 
                                  
            if(result != ''){
                html+='<button type="button" class="btn step addBtn step-3" id="addBtn" data-step="3" onclick="">Submit</button>';
            }else{
                html+='<button type="button" class="btn step addBtn step-3" id="addBtn" data-step="3" onclick="">Add</button>';
            }

            html+='<div>';
            html+='<button type="button" class="btn step backBtn step-3" data-step="3" id="2">Back</button>';3
            html+='</div>';
        }else{            
            if(result != ''){
                html+='<button type="button" class="btn step addBtn step-1" id="addBtn" data-step="1" onclick="">Submit</button>';
            }else{
                html+='<button type="button" class="btn btn-primary step nextBtn step-1" data-step="1" id="2">Next</button>';
                html+='<button type="button" class="btn step addBtn step-2" id="addBtn" data-step="2" onclick="">Add</button>';
                html+='<div>';
                 html+='<button type="button" class="btn step backBtn step-2" data-step="2" id="1" >Back</button>';
                html+='</div>';
            }            
        }  
    }
        
       html+='</div>';
    $('.footerBtnAdd').append(html);
    multiStepModel();
}
//For Edit User
function validationEditSelectRole(){
    var roleArr = $('#userRoleSelect').val();
    var roleFlag = true;      
    if(roleArr !== '' && roleArr !== null){     
        for(var r=0;r<roleArr.length;r++){
            if(roleArr[r] == 3){
                roleFlag = false;
            }            
            if(r == roleArr.length-1)
            {
                if(roleFlag == false){
                    var chooseCategoryArr = $('#chooseCategory').val();
                    var chooseCategoryFlag = true;
                   
                    if(chooseCategoryArr !== '' && chooseCategoryArr !== null){
                        for(var y=0;y<chooseCategoryArr.length;y++){
                            if(chooseCategoryArr[y] == 3){
                                chooseCategoryFlag = false;                           
                            }                          
                            if(y == chooseCategoryArr.length - 1){
                                if(chooseCategoryFlag == false){
                                    if(icfOptionArr != ''){
                                        //$('.multiStep').submit();
                                    }
                                    else{
                                        $('.errorTxtICF').text('Please choose ICF Option');
                                    }
                                }
                                else{
                                    //$('.multiStep').submit();
                                }
                            }                 
                        }  
                    }
                    else{
                        $('.errorTxtCategory').text('Please choose category first'); 
                    }                                           
                }
                else{
                    //$('.multiStep').submit();
                }
            }
        }                
    }
    else{
        $('.errorTxt').text("Please choose role first")
    }
}
function validationSelectRole(){
    var roleArr = $('#userRoleSelect').val();
    
    var roleFlag = true;      
    if(roleArr !== '' && roleArr !== null){     
        for(var r=0;r<roleArr.length;r++){
            if(roleArr[r] == 3){
                roleFlag = false;
            }            
            if(r == roleArr.length-1)
            {
                if(roleFlag == false){
                    var chooseCategoryArr = $('#chooseCategory').val();
                    var chooseCategoryFlag = true;     
                    
                    if(chooseCategoryArr !== '' && chooseCategoryArr !== null){
                        for(var y=0;y<chooseCategoryArr.length;y++){
                            if(chooseCategoryArr[y] == 4){
                                chooseCategoryFlag = false;                           
                            }                          
                            if(y == chooseCategoryArr.length - 1){
                                if(chooseCategoryFlag == false){
                                    if(icfOptionArr != ''){
                                        $('.multiStep').submit();
                                    }
                                    else{
                                        $('.errorTxtICF').text('Please choose ICF Option');
                                    }
                                }
                                else{
                                    $('.multiStep').submit();
                                }
                            }                 
                        }  
                    }
                    else{
                        $('.errorTxtCategory').text('Please choose category first'); 
                    }                                           
                }
                else{
                    $('.multiStep').submit();
                }
            }
        }                
    }
    else{
        $('.errorTxt').text("Please choose role first")
    }
}
// After Role Legal selected call choosecategoryFun
function choosecategoryFun(result){
    var categorieArr = new Array("Budget", "Contract", "ICF");
    var categorieVal = new Array(1,2,4);
    var selectedVal;
    $('#selectCategory .addUserContainer').remove();
    var html='<div class="form-group row addUserContainer">';
        html+='<label class="col-xs-5 control-label classTitle">Choose Category<em class="required"> *</em></label>';
        html+='<div class="col-xs-7 selectContainer">';
            html+='<div class="input-group" id="categorySelect">';
            html+='<select name="userRole" class="form-control selectpicker" id="chooseCategory" multiple="multiple">';
            
            for (var k = 0; k < categorieArr.length; k++) {
                var setVal=k+1;                    
                if(result != ''){                  
                        for(var p=0;p<result.json_data.response.length;p++){
                            if(result.json_data.response[p].user_type == 3){
                                if(result.json_data.response[p].esc_type_id != undefined){
                                   selectedVal = result.json_data.response[p].esc_type_id.sort();                                   
                                }                                 
                            }
                                                                     
                            if(p == result.json_data.response.length-1){
                                if(selectedVal != undefined){
                                    if(categorieVal[k] == selectedVal[0] || categorieVal[k] == selectedVal[1] || categorieVal[k] == selectedVal[2]){
                                        html+='<option value="' + categorieVal[k] + '" selected="selected">' + categorieArr[k]  + '</option>';   
                                    }else{
                                        html+='<option value="' + categorieVal[k] + '">' + categorieArr[k]  + '</option>';  
                                    } 
                                }else{
                                    html+='<option value="' + categorieVal[k] + '">' + categorieArr[k]  + '</option>';  
                                }
                                 
                            }
                        }              
                                        
                }else{
                    html+='<option value="' + categorieVal[k] + '">' + categorieArr[k] + '</option>';
                }                
            }
            
            html+='</select>';
            html+='</div>';
            html+='<span class="errorTxtCategory" style="color: red;"></span>';
        html+='</div>';
    html+='</div>';

    $('#selectCategory').append(html)
    
    if(result != ''){
        if(selectedVal != undefined){
            for(var r=0;r<selectedVal.length;r++){
                if(selectedVal[r] == 1){
                    budgetRadioOption(result);
                }
                else if(selectedVal[r] == 2){
                    contractRadioOption(result);
                }
                else if(selectedVal[r] == 4){
                    icfCheckOptions(result);
                }
            }
        }        
    }

    $('#chooseCategory').multiselect({
        nonSelectedText: "Choose Category",    
        templates: { // Use the Awesome Bootstrap Checkbox structure
            li: '<li class="checkList"><a tabindex="0"><div class="aweCheckbox aweCheckbox-danger"><label for=""></label></div></a></li>'
        },
        numberDisplayed: 3,
        onChange: function(option, checked) {
            $('.errorTxtCategory').text('');        
            if( $(option).is(':checked') ) {          
                if($(option).val() == 1){
                    budgetRadioOption(result);
                }
                else if($(option).val() == 2){
                    contractRadioOption(result);
                }
                else if($(option).val() == 4){
                    icfCheckOptions(result);
                }                          
            }
            else{                
                if($(option).val() == 1){
                    $('#budgetRequest #status').remove();
                }
                else if($(option).val() == 2){
                    $('#contractRequest #contract').remove();
                }
                else if($(option).val() == 4){
                    $('#icfChkBox #chkBoxDiv').remove();
                }
            }
        }
    });
    multiselectCheck();
}
// After Choose Category ICF selected call icfCheckOptions
// ICF Options
var icfOptionArr = new Array();
function icfCheckOptions(result){
    icfOptionArr=[];   
    $('#icfChkBox #chkBoxDiv').remove();
    var icfTypesArr = new Array("Global","Country","Site","Other");
    var html='<div class="container-login-form-btn" id="chkBoxDiv">';
            html+='<div class="form-group row addUserContainer">';        
            html += '<label class="col-xs-4 classTitle">Assign ICF Type<em class="required"> *</em></label>';
                html+='<div class="col-xs-8 chkBoxContainer">';  
                for(var i=0;i<icfTypesArr.length;i++){
                    var setVal = i+1;
                    if(result != ''){
                        var selectedVal;// = result.json_data.response[0].esc_sub_type_id.sort();
                      
                        for(var p=0;p<result.json_data.response.length;p++){
                            if(result.json_data.response[p].user_type == 3){                                
                               selectedVal = result.json_data.response[p].esc_sub_type_id//.sort();                                
                            }

                            if(p == result.json_data.response.length-1){    
                                                   
                                if(selectedVal != undefined){                                                                                        
                                    if(setVal == selectedVal[0] || setVal == selectedVal[1] || setVal == selectedVal[2] || setVal == selectedVal[3]){                                       
                                        icfOptionArr.push(setVal);
                                        html += '<div class="checkbox checkbox-primary">';
                                            html+='<input id="checkbox'+i+'" value="'+setVal+'" type="checkbox" checked>'
                                            html+='<label for="checkbox'+i+'">'+icfTypesArr[i]+'</label>'
                                        html+='</div>'
                                        
                                    }
                                    else{                                       
                                        html += '<div class="checkbox checkbox-primary">';
                                            html+='<input id="checkbox'+i+'" value="'+setVal+'" type="checkbox">'
                                            html+='<label for="checkbox'+i+'">'+icfTypesArr[i]+'</label>'
                                        html+='</div>'
                                    }
                                }else{
                                    html += '<div class="checkbox checkbox-primary">';
                                        html+='<input id="checkbox'+i+'" value="'+setVal+'" type="checkbox">'
                                        html+='<label for="checkbox'+i+'">'+icfTypesArr[i]+'</label>'
                                    html+='</div>'
                                }
                            }
                        }
                       
                    }else{
                        html += '<div class="checkbox checkbox-primary">';
                            html+='<input id="checkbox'+i+'" value="'+setVal+'" type="checkbox">'
                            html+='<label for="checkbox'+i+'">'+icfTypesArr[i]+'</label>'
                        html+='</div>'
                    }
                }                    
                html+='</div>'
                html+='<span class="errorTxtICF" style="color: red;"></span>';
            html+='</div>'
        html+='</div>'
    $('#icfChkBox').append(html);

    $('#icfChkBox .chkBoxContainer input').change(function() {     
        if (!this.checked){    
            var removeItem=parseInt($(this).val())
            icfOptionArr.splice( $.inArray(removeItem, icfOptionArr), 1 );           
        }
        else{
            $('.errorTxtICF').text('');
            icfOptionArr.push($(this).val())
        }        
    });
}
// After Management Role Selected call analyticsFun
function analyticsFun(result){
    var categorieArr = new Array("Budget", "Contract", "ICF");
    var categorieArrVal = new Array(1, 2, 4);
   
    $('.analyticsDiv #analyticsContainer').remove();
    var html='<div class="form-group row addUserContainer" id="analyticsContainer">';
        html+='<label class="col-xs-5 control-label classTitle">Analytics <em class="required"> *</em></label>';
        html+='<div class="col-xs-7 selectContainer">';
            html+='<div class="input-group" id="categoryAnalytics">';
            html+='<select name="analytics" class="form-control selectpicker" id="chooseAnalytics" multiple="multiple">';
            
                for (var k = 0; k < categorieArr.length; k++) {
                    var setVal=k+1;
                    if(result != ''){  
                        var selectedVal;
                        for(var p=0;p<result.json_data.response.length;p++){
                            if(result.json_data.response[p].user_type == 4){
                                selectedVal = result.json_data.response[p].analatics.split(',').sort(); 
                            }
                            
                            if(p == result.json_data.response.length-1){    
                                if(selectedVal != undefined){                                                                                        
                                    if(categorieArrVal[k] == selectedVal[0] || categorieArrVal[k] == selectedVal[1] || categorieArrVal[k] == selectedVal[2]){                                   
                                        html+='<option value="' +categorieArrVal[k] + '" selected="selected">' + categorieArr[k] + '</option>';  
                                    }
                                    else{
                                        html+='<option value="' +categorieArrVal[k] + '">' + categorieArr[k] + '</option>';
                                    }
                                }else{
                                    html+='<option value="' +categorieArrVal[k] + '">' + categorieArr[k] + '</option>';
                                }
                            }
                            
                        }
                        
                    }else{
                        html+='<option value="' +categorieArrVal[k] + '">' + categorieArr[k] + '</option>';
                    }                   
                }
            
            html+='</select>';
            html+='</div>';
            html+='<span class="errorTxtAnalytics" style="color: red;"></span>';
        html+='</div>';
    html+='</div>';

    $('.analyticsDiv').append(html);

    $('#chooseAnalytics').multiselect({
        nonSelectedText: "Choose Analytics",    
        templates: { // Use the Awesome Bootstrap Checkbox structure
            li: '<li class="checkList"><a tabindex="0"><div class="aweCheckbox aweCheckbox-danger"><label for=""></label></div></a></li>'
        },
        onChange: function(option, checked) {           
            if( $(option).is(':checked') ) {
                $('.errorTxtAnalytics').text('')
            }
        }
    });

    multiselectCheck();
}
// After Management Role Selected call userManagementCheck
var userManagementArr = new Array();
function userManagementCheck(result){
    userManagementArr=[];
    
    $('.userManagementDiv .userManagerDiv').remove();
    var userArr = new Array("CRO","Escalation","Legal","Management");
    var html='<div class="container-login-form-btn userManagerDiv" id="chkBoxDiv">';
            html+='<div class="form-group row addUserContainer">';        
            html += '<label class="col-xs-5 classTitle">User Management<em class="required"> *</em></label>';
                html+='<div class="col-xs-7 chkBoxContainer">';  
                for(var i=0;i<userArr.length;i++){
                    var setVal = i+1;
                    if(result != ''){
                        var selectedVal;
                        for(var p=0;p<result.json_data.response.length;p++){
                            if(result.json_data.response[p].user_type == 4){
                                selectedVal = result.json_data.response[p].user_management.split(',').sort();                               
                            }
                            
                            if(p == result.json_data.response.length-1){
                                if(selectedVal != undefined){                                    
                                    if(setVal == selectedVal[0] || setVal == selectedVal[1] || setVal == selectedVal[2] || setVal == selectedVal[3]){                                       
                                        userManagementArr.push(setVal)                                       
                                        html += '<div class="checkbox checkbox-primary">';
                                            html+='<input id="checkboxUser'+i+'" value="'+setVal+'" type="checkbox" checked>'
                                            html+='<label for="checkboxUser'+i+'">'+userArr[i]+'</label>'
                                        html+='</div>'
                                    }
                                    else{
                                        html += '<div class="checkbox checkbox-primary">';
                                            html+='<input id="checkboxUser'+i+'" value="'+setVal+'" type="checkbox">'
                                            html+='<label for="checkboxUser'+i+'">'+userArr[i]+'</label>'
                                        html+='</div>'
                                    }
                                }else{
                                    html += '<div class="checkbox checkbox-primary">';
                                        html+='<input id="checkboxUser'+i+'" value="'+setVal+'" type="checkbox">'
                                        html+='<label for="checkboxUser'+i+'">'+userArr[i]+'</label>'
                                    html+='</div>'
                                }
                            }                           
                        }
                       
                    }else{
                        html += '<div class="checkbox checkbox-primary">';
                            html+='<input id="checkboxUser'+i+'" value="'+setVal+'" type="checkbox">'
                            html+='<label for="checkboxUser'+i+'">'+userArr[i]+'</label>'
                        html+='</div>'
                    }
                   
                }                    
                html+='</div>'
                html+='<span class="errorTxtUserManagement" style="color: red;"></span>';
            html+='</div>'
        html+='</div>'
    $('.userManagementDiv').append(html);

   
    $('.userManagementDiv .chkBoxContainer input').change(function() {      
        if (!this.checked) {
            var removeItem = parseInt($(this).val())
            userManagementArr.splice(userManagementArr.indexOf(removeItem ), 1);            
        }
        else{
            $('.errorTxtUserManagement').text("");
            userManagementArr.push($(this).val());
        }
    });   
}
// Budget Radio Options
function budgetRadioOption(result){    
    var yesNoArr = new Array("Yes","No");
    var YesNoValArr = new Array(1,0);
    $('#budgetRequest #status').remove();
    var html='<div class="container-login-form-btn" id="status">';
        html+='<div class="form-group row addUserContainer">';
        
           html += '<label class="classTitle col-xs-7">Directly Assign Budget Request</label>';
            html+='<div class="col-xs-5">';
            for(var i=0;i<yesNoArr.length;i++){
                html += '<div class="form-check userStatusDiv budgetDiv">';                          
                    html += '<label class="radionBtn">';
                    if(result != ''){
                        var selectedVal;
                        for(var p=0;p<result.json_data.response.length;p++){
                            if(result.json_data.response[p].user_type == 3){
                                selectedVal = result.json_data.response[p].directBudget;                               
                            }                         
                            
                            if(p == result.json_data.response.length-1){                               
                                if(selectedVal != undefined){                             
                                    if(selectedVal == YesNoValArr[i]){
                                        html += '<input type="radio" name="budget" value="'+YesNoValArr[i]+'" checked> <span class="label-text budgetTxt'+i+'" style="color:#4c9bcf;">'+yesNoArr[i]+'</span>';
                                    }
                                    else{
                                        html += '<input type="radio" name="budget" value="'+YesNoValArr[i]+'"> <span class="label-text budgetTxt'+i+'">'+yesNoArr[i]+'</span>';
                                    }
                                }
                                else{
                                    html += '<input type="radio" name="budget" value="'+YesNoValArr[i]+'" checked> <span class="label-text budgetTxt'+i+'">'+yesNoArr[i]+'</span>';
                                }
                            }              
                           
                        }
                        
                    }else{
                        if(i == 0){                           
                            html += '<input type="radio" name="budget" value="'+YesNoValArr[i]+'"> <span class="label-text budgetTxt'+i+'">'+yesNoArr[i]+'</span>';
                        }
                        else{
                            html += '<input type="radio" name="budget" value="'+YesNoValArr[i]+'" checked > <span class="label-text budgetTxt'+i+'" style="color:#4c9bcf;">'+yesNoArr[i]+'</span>';
                        }
                    }
                    
                    
                    html += '</label>';
                html += '</div>';
            }
            html+='</div>';

       html+='</div>';
    html+='</div>';    
    $('#budgetRequest').append(html);
  
   //Budget radio buttons click event
	$('#status .radionBtn input[type=radio]').on('change', function () {		
		var radioButtons = $('#status .radionBtn input:radio[name="budget"]');
		
		var index = radioButtons.index(radioButtons.filter(':checked'));
        var issueType = $('#status .radionBtn .budgetTxt'+index).text();
        
		for (l = 0; l < yesNoArr.length; l++) {
			$('#status .radionBtn .budgetTxt' + l).css("color", "#333");
		}		
		$('#status .radionBtn .budgetTxt' + index).css("color", "#4c9bcf");
    });
}
// Contract Radio Options
function contractRadioOption(result){
    var yesNoArr = new Array("Yes","No");
    var YesNoValArr = new Array(1,0);
    $('#contractRequest #contract').remove();
    var html='<div class="container-login-form-btn" id="contract">';
            html+='<div class="form-group row addUserContainer">';
            html += '<label class="classTitle col-xs-7"">Directly Assign Contract Request</label>';

            html+='<div class="col-xs-5">';
                for(var i=0;i<yesNoArr.length;i++){
                    html += '<div class="form-check userStatusDiv contractDiv">';                          
                        html += '<label class="radionBtn">';
                        if(result !=''){
                            var selectedVal;
                            for(var p=0;p<result.json_data.response.length;p++){
                                if(result.json_data.response[p].user_type == 3){
                                    selectedVal = result.json_data.response[p].directContract;
                                }
                                
                                if(p == result.json_data.response.length-1){ 
                                    if(selectedVal != undefined){                               
                                        if(selectedVal == YesNoValArr[i]){
                                            html += '<input type="radio" name="contract" value="'+YesNoValArr[i]+'" checked> <span class="label-text contractTxt'+i+'" style="color:#4c9bcf;">'+yesNoArr[i]+'</span>'
                                        }
                                        else{
                                            html += '<input type="radio" name="contract" value="'+YesNoValArr[i]+'"> <span class="label-text contractTxt'+i+'">'+yesNoArr[i]+'</span>' 
                                        }
                                    }else{
                                        html += '<input type="radio" name="contract" value="'+YesNoValArr[i]+'" checked> <span class="label-text contractTxt'+i+'">'+yesNoArr[i]+'</span>' 
                                    }
                                }
                            }
                            
                        }else{
                            if(i == 0){
                                html += '<input type="radio" name="contract" value="'+YesNoValArr[i]+'"> <span class="label-text contractTxt'+i+'">'+yesNoArr[i]+'</span>'
                            }
                            else{
                                html += '<input type="radio" name="contract" value="'+YesNoValArr[i]+'" checked> <span class="label-text contractTxt'+i+'" style="color:#4c9bcf;">'+yesNoArr[i]+'</span>'
                            }                           
                        }
                        html += '</label>';
                    html += '</div>';
                }
            html+='</div>';

        html+='</div>';
    html+='</div>';
    $('#contractRequest').append(html);

    //Contract radio buttons click event   
	$('#contract .radionBtn input[type=radio]').on('change', function () {		
		var radioButtons = $('#contract .radionBtn input:radio[name="contract"]');
		
		var index = radioButtons.index(radioButtons.filter(':checked'));
        var issueType = $('#contract .radionBtn .contractTxt'+index).text();
       	
		for (l = 0; l < yesNoArr.length; l++) {
			$('#contract .radionBtn .contractTxt' + l).css("color", "#333");
		}		
		$('#contract .radionBtn .contractTxt' + index).css("color", "#4c9bcf");
    });  
}
function edituserService(user_id,userType,setManagerArr){   
    var statusVal = $('.statusContainer .radionBtn input:radio[name="status"]:checked').val();
    var budgetDirect = $('#status .radionBtn input:radio[name="budget"]:checked').val();
    var contractDirect = $('#contract .radionBtn input:radio[name="contract"]:checked').val();
   
    //my_implode_js function call in Main.js   
    var subType_Id=0;
    if(icfOptionArr != ''){
        subType_Id = my_implode_js(',',icfOptionArr); 
    }
   
    var user_type = my_implode_js(',',$('#userRoleSelect').val());
    var escalation_Id= 0;
    if($('#chooseCategory').val() != undefined)
    {
        escalation_Id = my_implode_js(',',$('#chooseCategory').val());
    }
    var analatics_Val= 0;
    if($('#chooseAnalytics').val() != undefined)
    {
        analatics_Val = my_implode_js(',',$('#chooseAnalytics').val());
    }
    
    var user_management=0;
    if(userManagementArr !='')
    {
        user_management=my_implode_js(',',userManagementArr);
    }    
    
    if(budgetDirect == undefined){
        budgetDirect = 0;
    }
    if(contractDirect == undefined){
        contractDirect = 0;
    }   

    loaderLogin(); 
    $.ajax({
		url: serviceHTTPPath + "editUser",
		type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
		data: {
            user_id:user_id,
			first_name: $('#userDetails #firstname').val(),
			last_name: $('#userDetails #lastName').val(),
			user_type: user_type,
			esc_type_id: escalation_Id,
    		esc_sub_type_id: subType_Id,
            analatics:analatics_Val,
            user_management:user_management,
            budgetDirect:budgetDirect,
            contractDirect:contractDirect,
		},
		success: function (response) {
            loaderRemoveFun();		
            //alert("successEdit="+JSON.stringify(response))          
			if (response.json_data.response == 1) {
                addUserAlert(response.json_data.message,setManagerArr,escalation_Id,subType_Id,user_type);
			}
			else {
				alertScreenMulti(response.json_data.message, "");
			}
		},
		error: function (e) {
			loaderRemoveFun();
			return;
		}
    });
}
// Add user service call
function adduserService(setManagerArr){   
    var statusVal = $('.statusContainer .radionBtn input:radio[name="status"]:checked').val();
    var budgetDirect = $('#status .radionBtn input:radio[name="budget"]:checked').val();
    var contractDirect = $('#contract .radionBtn input:radio[name="contract"]:checked').val();
     
    var subType_Id=0;
    if(icfOptionArr != ''){
        subType_Id = my_implode_js(',',icfOptionArr); 
    }
   
    var user_type = my_implode_js(',',$('#userRoleSelect').val());
    var escalation_Id= 0;
    if($('#chooseCategory').val() != undefined)
    {
        escalation_Id = my_implode_js(',',$('#chooseCategory').val());
    }
    var analatics_Val= 0;
    if($('#chooseAnalytics').val() != undefined)
    {
        analatics_Val = my_implode_js(',',$('#chooseAnalytics').val());
    }
    
    var user_management=0;
    if(userManagementArr !='')
    {
        user_management=my_implode_js(',',userManagementArr);
    }    
    
    if(budgetDirect == undefined){
        budgetDirect = 0;
    }
    if(contractDirect == undefined){
        contractDirect = 0;
    }
       
    loaderLogin(); 
    $.ajax({
		url: serviceHTTPPath + "registerUser",
		type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
		data: {
			first_name: $('#userDetails #firstname').val(),
			last_name: $('#userDetails #lastName').val(),
			email: $('#userDetails #email').val(),
			user_type: user_type,
			phone: '',
			country: '',
			password: '',
			status: statusVal,
			esc_type_id: escalation_Id,
    		esc_sub_type_id: subType_Id,
            analatics:analatics_Val,
            user_management:user_management,
            budgetDirect:budgetDirect,
            contractDirect:contractDirect,
		},
		success: function (response) {
            loaderRemoveFun();		
           // alert("success="+JSON.stringify(response))
			if (response.json_data.response == 1) {
				addUserAlert(response.json_data.message,setManagerArr,escalation_Id,subType_Id,user_type);
			}
			else {
				alertScreenMulti(response.json_data.message, "");
			}
		},
		error: function (e) {
			loaderRemoveFun();
			return;
		}
    });
 
}
function addUserValidations(){
    $('.multiStep').bootstrapValidator({
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
                            message: 'Please enter your first name'
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
                            message: 'Please enter your Email Address'
                        },
                        emailAddress: {
                            message: 'Please enter a valid Email Address'
                        }
                    }
                },
                userRole: {
                    validators: {
                        notEmpty: {
                            message: 'Please select your role'
                        }
                    }
                },
            }
        })
        .on('success.form.bv', function(e) {
            $('#success_message').slideDown({ opacity: "show" }, "slow")            
            // Do something ...
            $('.multiStep').data('bootstrapValidator').resetForm();
    
            // Prevent form submission
            e.preventDefault();           
            
            sendEvent('#demo-modal-3', window.localStorage.getItem("nextBtnId"));
    
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
function multiStepModel(){
    var modals = $('.modal.multi-step');

    modals.each(function(idx, modal) {
        var $modal = $(modal);
        var $bodies = $modal.find('div.modal-body');
        var total_num_steps = $bodies.length;
        var $progress = $modal.find('.m-progress');
        var $progress_bar = $modal.find('.m-progress-bar');
        var $progress_stats = $modal.find('.m-progress-stats');
        var $progress_current = $modal.find('.m-progress-current');
        var $progress_total = $modal.find('.m-progress-total');
        var $progress_complete  = $modal.find('.m-progress-complete');
        var reset_on_close = $modal.attr('reset-on-close') === 'true';

        function reset() {
            $modal.find('.step').hide();
            $modal.find('[data-step]').hide();
        }

        function completeSteps() {
            $progress_stats.hide();
            $progress_complete.show();
            $modal.find('.progress-text').animate({
                top: '-2em'
            });
            $modal.find('.complete-indicator').animate({
                top: '-2em'
            });
            $progress_bar.addClass('completed');
        }

        function getPercentComplete(current_step, total_steps) {
            return Math.min(current_step / total_steps * 100, 100) + '%';
        }

        function updateProgress(current, total) {
            $progress_bar.animate({
                width: getPercentComplete(current, total)
            });
            if (current - 1 >= total_num_steps) {
                completeSteps();
            } else {
                $progress_current.text(current);
            }

            $progress.find('[data-progress]').each(function() {
                var dp = $(this);
                if (dp.data().progress <= current - 1) {
                    dp.addClass('completed');
                } else {
                    dp.removeClass('completed');
                }
            });
        }

        function goToStep(step) {
            reset();           
            var to_show = $modal.find('.step-' + step);
            if (to_show.length === 0) {
                // at the last step, nothing else to show
                return;
            }
            to_show.show();
            var current = parseInt(step, 10);
            updateProgress(current, total_num_steps);
            findFirstFocusableInput(to_show).focus();
        }

        function findFirstFocusableInput(parent) {
            var candidates = [parent.find('input'), parent.find('select'),
                              parent.find('textarea'),parent.find('button')],
                winner = parent;
            $.each(candidates, function() {
                if (this.length > 0) {
                    winner = this[0];
                    return false;
                }
            });
            return $(winner);
        }

        function bindEventsToModal($modal) {
            var data_steps = [];
            $('[data-step]').each(function() {
                var step = $(this).data().step;
                if (step && $.inArray(step, data_steps) === -1) {
                    data_steps.push(step);
                }
            });

            $.each(data_steps, function(i, v) {
                $modal.on('next.m.' + v, {step: v}, function(e) {
                    goToStep(e.data.step);
                });
            });
        }

        function initialize() {
            reset();
            updateProgress(1, total_num_steps);
            $modal.find('.step-1').show();
            $progress_complete.hide();
            $progress_total.text(total_num_steps);
            bindEventsToModal($modal, total_num_steps);
            $modal.data({
                total_num_steps: $bodies.length,
            });
            if (reset_on_close){
                //Bootstrap 2.3.2
                $modal.on('hidden', function () {
                    reset();
                    $modal.find('.step-1').show();
                })
                //Bootstrap 3
                $modal.on('hidden.bs.modal', function () {
                    reset();
                    $modal.find('.step-1').show();
                })
            }
        }

        initialize();
    })
}
