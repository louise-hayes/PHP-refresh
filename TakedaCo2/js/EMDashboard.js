function escalationFun(){   
    var hamburgerActive = 0;   
    if(window.localStorage.getItem('userType') != null){    
        hamburgerList(hamburgerActive, window.localStorage.getItem('userType'));   

        setDefaultDate();
        var fromDate =  $("#datepicker").val();
        var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( fromDate ) );
        
        var toDate = $("#toDatepicker").val(); 
        var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ) );    
        window.localStorage.setItem("dashOrArchive", 1);

        var user_id = window.localStorage.getItem("user_id");
        // Drop drow select manager type
        selectManagerType(user_id,"dashboard");
        //Date Change click event
        setDateOnSelect(user_id,"dashboard");
    }else{
        location.href = "../index.html";
    }
}
function selectManagerType(user_id,hamburgerType){    
    var userType = window.localStorage.getItem('userType');
   
  	$.ajax({
		url: serviceHTTPPath + "userManagement",
		type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        }, 
        data: { role_id: userType },
		success: function (result) {			
            //alert("success=-"+JSON.stringify(result))
            if(result.json_data.response == 4 || result.json_data.response == 5 || result.json_data.response == 6){
                location.href = "../index.html";
            }else{
                attachManagerList(result, userType,user_id,hamburgerType);
                
                var fromDate =  $("#datepicker").val();
                var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( fromDate ) );
                
                var toDate = $("#toDatepicker").val(); 
                var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ) );   
               
                if(hamburgerType == "reassigned"){
                    reassignedWebService(fromDateNewFormat, todateNewFormat,user_id,hamburgerType);
                }else{
                    escalationMService(fromDateNewFormat, todateNewFormat,user_id,hamburgerType);
                }
            }
		},
		error: function (e) {
			loaderRemoveFun();

			return;
		}
	});   
}
function attachManagerList(result, userType,user_id,hamburgerType){
    var name = "";    
    var defaultName = "";
    var html;
    for(var i=0;i<result.json_data.response.length;i++){ 
        if(result.json_data.response[i].user_id == user_id){
            defaultName = user_id;
        }
    }    
    
    $('.dropDownDiv .managerTypeDropDown').remove();
    var html='<div class="managerTypeDropDown">'  
    if(userType == 2){
        html+='<label class="control-label">Escalation Manager</label>'
    }else{
        html+='<label class="control-label">Legal Manager</label>'
    }
        
        html+='<div class="selectDropDown">'
        html+='<div class="">'
            html+='<select name="managerType" class="selectpicker" id="managerDiv">'          
            for(var i=0;i<result.json_data.response.length;i++){
                if (result.json_data.response[i].first_name !== 0 && result.json_data.response[i].first_name !== null && result.json_data.response[i].first_name !== '0') {
                     if (result.json_data.response[i].last_name !== 0 && result.json_data.response[i].last_name !== null && result.json_data.response[i].last_name !== '0') {
                         name = result.json_data.response[i].first_name +" "+result.json_data.response[i].last_name
                         
                         html+='<option value="'+result.json_data.response[i].user_id+'" >'+name+'</option>'
                     }
                     else{                            
                         html+='<option value="'+result.json_data.response[i].user_id+'" >'+result.json_data.response[i].first_name+'</option>'
                     }
                 }
                 else{
                     if (result.json_data.response[i].last_name !== 0 && result.json_data.response[i].last_name !== null) {                           
                         html+='<option value="'+result.json_data.response[i].user_id+'" >'+result.json_data.response[i].last_name+'</option>'
                     }
                 }
            }                                                                                  
            html+='</select>'
        html+='</div>'
    html+='</div>'
   
      
   html+='</div>'
   $('.dropDownDiv').append(html);

    $('.managerTypeDropDown select[name=managerType]').val(defaultName);
    $('.managerTypeDropDown .selectpicker').selectpicker('refresh');
    $('.btn-group bootstrap-select').css("width", 100 + "%");
    

    if (result.json_data.response.length >= 10) {
        $('.managerTypeDropDown ul').css("height", 175);
        $('.managerTypeDropDown ul').css("overflow", "auto");
    }
    else {
        $('.managerTypeDropDown ul').css("height", "auto");
    }

    /*****Manager type click event start here*****/
	$('.managerTypeDropDown .selectDropDown li').click(function (e) {
        var index = $(this).index();
        var selectUser_id = result.json_data.response[index].user_id;
        var fromDate =  $("#datepicker").val();
        var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( fromDate ));
        
        var toDate = $("#toDatepicker").val(); 
        var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ));    
     
        if(hamburgerType == "dashboard"){
           escalationMService(fromDateNewFormat, todateNewFormat, selectUser_id, hamburgerType);
        }
        else if(hamburgerType == "archieve"){
            if(window.localStorage.getItem("userType") == 1){
                croWebService(fromDateNewFormat, todateNewFormat);
            }
            else if(window.localStorage.getItem("userType") == 2){
                escalationMService(fromDateNewFormat, todateNewFormat,selectUser_id,"archieve");
            }
        }
        else{
           var coeType = window.localStorage.getItem("userType");
           reassignedWebService(fromDateNewFormat,todateNewFormat,selectUser_id,coeType,hamburgerType);
        }        
	});
	/*****Manager type click event end here*****/
}
function escalationMService(fromDate,toDate,user_id,hamburgerType){
   loaderLogin();
    /*****Manager Request webservice call start here*****/
    $.ajax({
        url: serviceHTTPPath + "viewManagerRequest",
        type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
        data: { manager_id: user_id, startDate: fromDate, endDate: toDate },
        success: function (result) {
            loaderRemoveFun();
            //alert("success=-"+JSON.stringify(result))
            viewManagerRequest(result,user_id,hamburgerType);
        },
        error: function (e) {
            loaderRemoveFun();
            return;
        }
    });
    /*****Manager Request webservice call end here*****/
}
/*****Escalation Manager List function start here*****/
function escalationManagerList(result,user_id,hamburgerType) {
    viewManagerRequest(result,user_id,hamburgerType);
}
function viewManagerRequest(result,user_id,hamburgerType) {  
    var viewManagerArr;
    if(hamburgerType == "reassigned"){
         viewManagerArr = new Array("Request Type", "Country", "Issue", "Raised by", "Raised on", "Activity Performed", "Action Taken by", "Reassigned To", "Action Date", "Status", "Action");
    }else{
         viewManagerArr = new Array("Request Type", "Country", "Issue", "Raised by", "Raised on", "Activity Performed", "Action Taken by", "Reassigned by", "Action Date", "Status", "Action");
    }
    
    $('.content-wrapper .tableMainContainer #example1_wrapper .row').remove();

    var html= '<table id="example1" class="table table-responsive">';
    html += '<thead>';
    html += '<tr>';
    for (var i = 0; i < viewManagerArr.length; i++) {
        html += '<th>' + viewManagerArr[i] + '</th>';
    }
    html += '</tr>';
    html += '</thead>';

    html += '<tbody class="tbodyContainer">';   
    html += '</tbody>';

    html += '</table>';

    $('.content-wrapper .tableMainContainer').append(html);  
  
    if (result.json_data.message != 'Not Found!') {
        for (var j = 0; j < result.json_data.response.data.length; j++) {

            if(hamburgerType == "dashboard"){
                 // Escalation dashboard Table data
                 if ((result.json_data.response.data[j].resolution_date == null || result.json_data.response.data[j].resolution_date == "0000-00-00 00:00:00") && (result.json_data.response.data[j].action_flag != 2)) {
             
                    if (result.json_data.response.data[j].manager_action !== 5 && result.json_data.response.data[j].manager_action !== null) {
                       
                        for (var p = 0; p < performDisplayArr.length + 1; p++) {
                            if (p == result.json_data.response.data[j].manager_action) {                        
                                if (p == 4) {
                                    var now = new Date();        
                                    var _fromDate = new Date(result.json_data.response.data[j].manager_action_date); //date picker (text fields)
                                    var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( _fromDate ) );
                                    
                                    var toDate = new Date(now.toString());                              

                                    var newDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate()-3)
                                    var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( newDate ) );  
                                    
                                    if (fromDateNewFormat <= todateNewFormat) {
                                        attachMGTable(result, j, "bgColorYellow",hamburgerType);
                                    }
                                    else {                                
                                        attachMGTable(result, j, "",hamburgerType);
                                    }
                                }
                                else {
                                    attachMGTable(result, j, "",hamburgerType);
                                }
                            }
                        }
                        
                    }
                    else{
                        attachMGTable(result, j, "",hamburgerType);
                    }
                }               
            }
            else if(hamburgerType == "reassigned"){            
                if(result.json_data.response.data[j] != null){
                    if (result.json_data.response.data[j].manager_action == 8){
                        attachMGTable(result, j, "",hamburgerType);
                    }
                }  
                        
               
            }
            else{
                 // Archieve Table data
                 for (var p = 0; p < performDisplayArr.length + 1; p++) {
                    if (p == result.json_data.response.data[j].manager_action) {
                        if (result.json_data.response.data[j].resolution_date == null || result.json_data.response.data[j].resolution_date == "0000-00-00 00:00:00") {
                            if (result.json_data.response.data[j].action_flag != 2) {
                                if (result.json_data.response.data[j].manager_action == 5) {
                                    attachMGTable(result, j, "",hamburgerType);
                                }
                            }
                        }
                        else {
                            if (result.json_data.response.data[j].action_flag != 2) {
                                attachMGTable(result, j, "",hamburgerType);
                            }
    
                        }
                    }
    
                }
            }
            
        }
    }
    
    //Call in js/main.js      
    dataTableSet("");

    //Call in js/main.js 
    tableClickEvents(result,hamburgerType);
    
    $('#example1 tbody').on('click', '.raisedBy', function (e) {        
        var request_number = $(this).attr('id');       
        var first_name='';
        var last_name='';
        var emai_id='';
        for(var i=0;i<result.json_data.response.data.length;i++)
        {
            if(result.json_data.response.data[i].request_number == request_number)
            {
                emai_id = result.json_data.response.data[i].raisedBy_email
                if (result.json_data.response.data[i].raisedBy_first_name != null || result.json_data.response.data[i].raisedBy_last_name != null) {
                    if (result.json_data.response.data[i].raisedBy_first_name != 0) {
                        if (result.json_data.response.data[i].raisedBy_last_name != 0) {
                            first_name = result.json_data.response.data[i].raisedBy_first_name;
                            last_name = result.json_data.response.data[i].raisedBy_last_name;                           
                        }
                        else {
                            first_name = result.json_data.response.data[i].raisedBy_first_name;
                        }
                    }
                }
            }
            if(result.json_data.response.data.length-1 == i)
            {                 
                //Call in js/popup.js
                raisedBy(first_name,last_name,emai_id,"CRO")
            }
        }
    });

    $('#example1 tbody').on('click', '.performClick', function (e) {
        var request_number = $(this).attr('id')
        var actionId = '';
        var managerType = 0;
        var escalation_sub_type = '';
       
        for(var i=0;i<result.json_data.response.data.length;i++)
        {
            if(result.json_data.response.data[i].request_number == request_number)
            {
                actionId = result.json_data.response.data[i].manager_action-1;
                managerType = result.json_data.response.data[i].escalation_type_id;    
                
                if(managerType == 4)
                {
                    escalation_sub_type = result.json_data.response.data[i].escalation_sub_type_id;
                }       
            }

            if(result.json_data.response.data.length-1 == i)
            {               
                var performArr = [];
                
                var performStatusArr = new Array(2,3,4,6,7,8,9);
                if(actionId == 3 || actionId == 6)
                {
                    performArr = new Array("Approved","Denied","Negotiation Required","Approved with modification","On hold","Reassigned","Closed");
                }else{
                    performArr = new Array("Approved","Denied","Negotiation Required","Approved with modification","On hold","Reassigned");
                }               

                popupSelectStatus(request_number,user_id,actionId,managerType,escalation_sub_type,hamburgerType,performStatusArr,performArr);                
            }
        }
    });
}
function popupSelectStatus(request_number,user_id,actionId,managerType,escalation_sub_type,hamburgerType,performStatusArr,performArr){

    $('body .multiStep').remove();
    var html='<form class="modal multi-step multiStep performModal" id="demo-modal-3">';
            html+='<div class="modal-dialog modal-lg" style="">';
                html+='<div class="modal-content performPopup">';
                    html+='<div class="modal-header">';
                     html += '<button type="button" class="close crossIcon"';
                      html += 'data-dismiss="modal">';
                        html += '<span aria-hidden="true">&times;</span>';	
                     html += '</button>';
                     html+='<h4 class="modal-title text-center performActionTitle">Perform Action</h4>';
                    html+='</div>';

                     //Step 1
                     html+='<div class="modal-body step-1 noPadding" data-step="1" id="detail">';
                        html+='<div class="multipleContainer performContainer" id="">';
                      
                            html+='<div class="row" id="">';
                                //Status Dropdown
                                html+='<div class="selectStatus col-xs-6">';
                                    html+='<label class="control-label">Select Status</label>';
                                    html+='<div class="performDropDown">';
                                        html+='<div class="performType">';
                                            html+='<select name="status" class="selectpicker" id="userStatusSelect">';      
                                            html+='<option value="" id="">Select Status</option>'; 
                                            for (var k = 0; k < performArr.length; k++) {                                    
                                                html+='<option value="' + performStatusArr[k] + '" id="statusId'+performStatusArr[k]+'">' + performArr[k] + '</option>';
                                            }                                                                            
                                            html+='</select>';
                                        html+='</div>';                                       
                                    html+='</div>';
                                    html+='<span class="errorTxtStatus" style="color: red;display: inline-block;"></span>';
                                html+='</div>';

                                //Choose Role
                                html+='<div class="col-xs-6" id="roleContainer">';                       
                                html+='</div>';

                            html+='</div>';                  
                            
                            // Choose user
                            html+='<div class="row" id="">';
                                html+='<div class="col-xs-6" id="selectuser">';
                                html+='</div>';
                                html+='<div class="col-xs-6" id="">';
                                html+='</div>';
                            html+='</div>';

                            // Description
                            html+='<div class="row performTxt" id="">'
                                html += '<h4 class="modal-title text-left col-xs-12 text-uppercase desc" id="" style="margin-top:20px;margin-bottom: 10px;">';
                                    html += 'Enter Description';
                                html += '</h4>';
                                html+='<div class="col-xs-12" id="">'
                                html += '<textarea class="statusTextArea col-xs-12" placeholder="Please enter your description here..."></textarea>';
                                html+='</div>';
                            html+='</div>';

                            // Add Attachment
                            html += '<div class="row">';
                                html += '<div class="col-xs-12 col-sm-12 col-lg-12 addAttachPerform" style="text-align:left;">';
                                    html += '<h4 class="addTextH4 text-uppercase desc" id="">';
                                    html += 'Add New Attachments';
                                    html += '</h4>';
                                html += '</div>';
                            html += '</div>';

                        html+='</div>';
                     html+='</div>';
                     
                        //Step 2
                     html+='<div class="modal-body step-2 noPadding" data-step="2" id="performDisable">'
                        html+='<div class="multipleContainer performContainer" id="">'
                            html+='<div class="row" id="">';
                              // Status Dropdown
                              html+='<div class="selectStatus col-xs-6">';
                                html+='<label class="control-label">Select Status</label>';
                                html+='<div class="performDropDown">';
                                    html+='<div class="statusDiv">';
                                    html+='<input type="text" class="inputPerformDetail statusTxt" value="" placeholder="" disabled="">'
                                    html+='</div>';
                                html+='</div>';
                              html+='</div>';

                              // Choose Role
                              html+='<div class="col-xs-6 roleContainerDisable" id="roleContainer">';                                   
                              html+='</div>';
                              
                            html+='</div>';
                                // Choose user
                                html+='<div class="row" id="">';
                                    html+='<div class="col-xs-6 selectuserDisable" id="selectuser">';                                       
                                    html+='</div>';
                                    html+='<div class="col-xs-6" id="">';
                                    html+='</div>';
                                html+='</div>';

                                // Description
                                html+='<div class="row performTxt" id="">'
                                    html += '<h4 class="modal-title text-left col-xs-12 text-uppercase desc" id="" style="margin-top:20px;margin-bottom: 10px;">';
                                        html += 'Description';
                                    html += '</h4>';
                                    html+='<div class="col-xs-12" id="">'
                                     html += '<textarea class="col-xs-12 desDisable" placeholder="" disabled></textarea>';
                                    html+='</div>';
                                html+='</div>';

                                // Add Attachment
                                html += '<div class="row">';
                                    html += '<div class="col-xs-12 col-sm-12 col-lg-12 addAttachPerformDisable" style="text-align:left;">';
                                        html += '<h4 class="addTextH4 text-uppercase desc" id="">';
                                        html += 'Attachments';
                                        html += '</h4>';
                                    html += '</div>';
                                html += '</div>';

                        html+='</div>';  
                     html+='</div>';           

                //Footer
                html+='<div class="modal-footer">';

                    html+='<button type="button" class="btn btn-primary nextBtn step step-1" data-step="1" id="2">Next</button>';  
                    html+='<button type="button" class="btn btn-primary addBtn step step-2" data-step="2" id="3">Submit</button>';                        
                
                    html+='<div>';
                    html+='<button type="button" class="btn step backBtn step-2" data-step="2" id="1" >Back</button>';
                    html+='</div>';

                html+='</div>';

             html+='</div>';
            html+='</div>';
        html+='</form>';

    $('body').append(html);
    $('.multiStep').modal();   
    multiStepModel();

    $('.crossIcon').click(function(){
        $('body .multiStep').remove();
        $('.modal-backdrop').remove();
    });

    // Next and Back Button Click Events
    $('.nextBtn').click(function() {        
        if($(this).attr('id') == 2){              
            if($('#userStatusSelect').val() != ''){                             
                errorMessage();
                var selectedStatus = $("#statusId"+$('#userStatusSelect').val()).text()
                $('.statusTxt').val(selectedStatus);
                if($('#userStatusSelect').val() == 8){
                    if($('#roleSelect').val() !== undefined && $('#roleSelect').val() !== ''){                                
                        if($('#managerDivPerform').val() !== undefined && $('#managerDivPerform').val() !== ''){
                            sendEvent('#demo-modal-3', $(this).attr('id')); 
                            $('.desDisable').text($('.statusTextArea').val());
                           
                            disabledRoleUser();

                            //Attachments
                            if ($('.abcdSize').length != 0) {
                                attachmentPerform();               
                            }
                        }else{
                            $('.errorTxtUser').text('Please choose user first');
                        }
                    } 
                    else{
                        $('.errorTxtRole').text("Please choose role first")
                    }
                }else{ 
                    //If not selected status = Reassigned                   
                    $('.desDisable').text($('.statusTextArea').val());
                    sendEvent('#demo-modal-3', $(this).attr('id'));

                    //Attachments
                    if ($('.abcdSize').length != 0) {
                        attachmentPerform()               
                    }
                }            
            }
            else{
                $('.errorTxtStatus').text("Please select status first");
            }
        }
        else{
            $('.multiStep').submit();
        }       
    });
    var userType = window.localStorage.getItem('userType');
    $('.addBtn').click(function() {        
        if(userType == 2){
            escalationManagerAction(request_number,user_id,actionId,hamburgerType);
        }else{
            //Call in js/LMDashboard.js
            legalManagerAction(request_number,user_id,actionId,hamburgerType);
        }
    });
    
    $('.backBtn').click(function() {
        $('.performActionTitle').text("Perform Action");
        sendEvent('#demo-modal-3', $(this).attr('id'));       
    });    

    $('.selectStatus .selectpicker').selectpicker('refresh');
    $('.btn-group bootstrap-select').css("width", 100 + "%");

    var addId = 0;
    var abc = 0;
    addImgIDActionArr = [];
    performPopupAttach(addId, abc);
   
    $('.performType ul li:first-child').remove();  
    $('#userStatusSelect').on('change', function(e){
       var status = $(this).val();
       $('.errorTxtStatus').text(''); 
     
        if(this.value == 8){
            attachRoleDropDown(managerType,escalation_sub_type);
        }
        else{
            $('#roleContainer .selectRole').remove();
            $('#selectuser .chooseUserDropDown').remove();
        }
    });    
   
    sendEvent = function(sel, step) {    
        $(sel).trigger('next.m.' + step);
    }
}
// Perform Action submit for Escalation Manager
function escalationManagerAction(request_number,user_id,actionId,hamburgerType){
    var status_Id = $('#userStatusSelect').val();
    if(status_Id == undefined){
        status_Id = actionId;
    }
    
    var descriptionTxt = $('.statusTextArea').val();
    var attachmentList = my_implode_js(',',addImgIDActionArr); 
   
    if(attachmentList == '' || attachmentList == undefined){
        attachmentList= 0;
    }
    var role_Id = "null";   
    if($("#roleSelect").val() == '' || $("#roleSelect").val() == undefined){
        role_Id = "null";
    }else{
        role_Id = $("#roleSelect").val()-1;
    }

    var userType = $('#managerDivPerform').val();
    if(userType == '' || userType == undefined){
        userType = "null";
    }
    var loginUser_id = window.localStorage.getItem("user_id");

    loaderLogin();
    $.ajax({
        url: serviceHTTPPath + "escalationManagerAction",
        type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
        data: { manager_action_id: loginUser_id, 
                issue_id: request_number, 
                status: status_Id,
                desc: descriptionTxt,
                attachment: attachmentList, 
                coe_id: userType, 
                role_id: role_Id },
        success: function (result) {
            loaderRemoveFun();
            //alert("success=-"+JSON.stringify(result))
            if(result.json_data.response == 0){
                alertScreen(result.json_data.message,"")
            }else{
                if($('#userStatusSelect').val() == undefined){
                    var fromDate =  $("#datepicker").val();
                    var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( fromDate ) );
                    
                    var toDate = $("#toDatepicker").val(); 
                    var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ) );
                    escalationMService(fromDateNewFormat, todateNewFormat,user_id,hamburgerType);
                }else{
                    performActionPopup(result.json_data.message,user_id,hamburgerType)
                }
                
            }
        },
        error: function (e) {
            loaderRemoveFun();
            return;
        }
    });
}

function attachmentPerform(){
    $('.addAttachPerformDisable .imgMargin').remove();
    for (var l = 0; l < $('.abcdSize').length; l++) {
        var setId = $('.abcdSize span')[l].id;    
                   
        var html = '<div class="row imgMargin attach_img' + l + '">';    
            html += '<div class="addBtn_Div">';  
                                       
                html+='<div class="col-xs-12" id="">'
                  html += '<div class="icfImg addText abcd' + l + '" id="'+l+'"><span id="' +l +'" class="spanDtxt'+l+'">' + $('.abcdSize .spantxt'+setId).text() + '</span></div>'
                html += '</div>';
            
            html += '</div>';
            html += '</div>';                            
        $('.addAttachPerformDisable').append(html);
    }   
}
function disabledRoleUser(){   
    $('.performActionTitle').text("Confirm Action");
    $('.roleContainerDisable .selectRole').remove();
    var selectedRole = $('#roleId'+$("#roleSelect").val()).text()
    var html;
      html='<div class="selectRole">';
        html+='<label class="control-label">Choose Role</label>';
            html+='<div class="performDropDown">';
                html+='<div class="">';
                html+='<input type="text" class="inputPerformDetail" value="'+selectedRole+'" placeholder="" disabled="">'      
                html+='</div>';
            html+='</div>';   
        html+='</div>';   

    $('.roleContainerDisable').append(html);

    var userSelectedVal = $('#userId'+$('#managerDivPerform').val()).text()
    $('.selectuserDisable .chooseUserDropDown').remove();
    html='<div class="chooseUserDropDown">'
        html+='<label class="control-label">Choose User</label>'
        html+='<div class="performDropDown">'
            html+='<div class="">'
            html+='<input type="text" class="inputPerformDetail" value="'+userSelectedVal+'" placeholder="" disabled="">'
            html+='</div>';
        html+='</div>';
    html+='</div>';    
    $('.selectuserDisable').append(html);  

}
function attachRoleDropDown(managerType,escalation_sub_type){
    var userRole =[];
    var setValArr = [];
  
    if(managerType == 4){
        userRole = new Array("Legal Manager");
        setValArr = new Array(3,2)       
    }else{
        userRole = new Array("Escalation Manager","Legal Manager");
        setValArr = new Array(2,3)
    }

    $('#roleContainer .selectRole').remove();
    var html='<div class="selectRole">';
        html+='<label class="control-label">Choose Role</label>';
        html+='<div class="performDropDown">';
            html+='<div class="">';
                html+='<select name="role" class="selectpicker" id="roleSelect">';
                html+='<option value="" id="">Select Role</option>';      
                for (var p = 0; p < userRole.length; p++) {    
                    var setVal = p+1;                                
                    html+='<option value="'+setValArr[p]+'" id="roleId'+setValArr[p]+'">' + userRole[p] + '</option>';
                }                                                                        
                html+='</select>';
            html+='</div>';            
        html+='</div>';
        html+='<span class="errorTxtRole" style="color: red;display: inline-block;"></span>';
    html+='</div>';
    $('#roleContainer').append(html);

    $('.selectRole .selectpicker').selectpicker('refresh');
    $('.btn-group bootstrap-select').css("width", 100 + "%");

    $('.selectRole ul').css("height", "auto");
    $('.selectRole ul li:first-child').remove();
    $("#roleSelect").on('change', function(e){
        errorMessage();
        var userType = $(this).val();  
       
        loaderLogin();        
        if(managerType == 4 || userType == 3){
            
            if(escalation_sub_type == ''){
                escalation_sub_type = 0;
            }
            $.ajax({
                url: serviceHTTPPath + "legalListSearch",
                type: "POST",
                dataType: 'json',
                headers: {
                    "authorization": window.localStorage.getItem("token_id")
                }, 
                data: { 
                    form_id: managerType,
                    icf_form_id:escalation_sub_type
                 },
                success: function (result) {
                    loaderRemoveFun();
                    if(result.json_data.response == 0){
                        alertScreenLegalList("Legal list not found.","")
                    }else{
                        performUserList(result,managerType,userType);
                    }
                },
                error: function (e) {
                    loaderRemoveFun();
                    return;
                }
            });  
        }else{
            $.ajax({
                url: serviceHTTPPath + "userManagement",
                type: "POST",
                dataType: 'json',
                headers: {
                    "authorization": window.localStorage.getItem("token_id")
                }, 
                data: { role_id: userType },
                success: function (result) {
                    loaderRemoveFun();
                    //alert("success="+JSON.stringify(result))
                    performUserList(result,managerType,userType);
                },
                error: function (e) {
                    loaderRemoveFun();

                    return;
                }
            });  
        }
             
    });
}
function errorMessage(){
    $('.errorTxtRole').text('');
    $('.errorTxtStatus').text('');
    $('.errorTxtUser').text('');
}
function performPopupAttach(addId, abc) {
    addId += 1;
    $('.addAttachPerform .attach_img' + addId).remove();
    var html = '<div class="row imgMargin attach_img' + addId + '">';
    
    html += '<div class="addBtn_Div" style="height: auto;">';
    html+='<div class="col-xs-12" id="">'
         html += '<div class="uploadAttach fileMainDiv ' + addId + '" id="">';
            html += '<a href="#" class="btn performAddBtn popupImg' + addId + '">Attach</a>'
            html += '<div class="filediv"><input name="file[]" type="file" class="filelength file' + addId + '" id="fileUpload' + addId + '" style="position: absolute;width: 90px;height: 52px; opacity: 0.0;"/><br/></div>';
         html += '</div>';
    html += '</div>';
    
    html += '</div>';
    html += '</div>';

    $('.addAttachPerform').append(html);

    $('.addAttachPerform .addBtn_Div input:file').change(function () {
        if (this.files && this.files[0]) {
            abc += 1;
           
            $('.addAttachPerform .abcd' + abc).remove();
            $('.addAttachPerform .popupImg' + abc).remove();
            $('.addAttachPerform .removeTxt' + abc).remove();

            var ext = $('.addAttachPerform .file' + abc).val().split('.').pop().toLowerCase();
            var file;
            var name;
            if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
                file = this.files[0];
                name = file.name;
                $(this).before("<div class='abcdSize icfImg addText abcd" + abc + "' id='"+abc+"'><span id='" + abc + "' class='spantxt"+abc+"'>" + name + "</span></div>");
            }
            else {
                file = this.files[0];
                name = file.name;
                $(this).before("<div class='abcdSize icfImg previewimgSize abcd" + abc + "' id='"+abc+"'><span id='" + abc + "' class='spantxt"+abc+"'>" + name + "</span></div>");
            }
            $('#fileUpload' + abc).remove();
            var html = '<img id="' + abc + '" class="deleteBtn delete' + abc + '" src="../images/delete_btn.png" alt="delete" style="margin-left: 10px;"/></br>';
            $('.uploadAttach .abcd' + abc).append(html);
            $(this).hide();

            performPopupAttach(addId, abc);

            var file_data = this.files[0];
            var form_data = new FormData();
            form_data.append('file', file_data);

            uploadAttachPerform(form_data, abc);
        }
        $('.delete' + abc).click(function (e) {
            var id = $(this).attr('id');

            var arrId = $(this).parent().parent().attr('id');

            addImgIDActionArr.splice($.inArray(arrId, addImgIDActionArr), 1)

            $('.addAttachPerform .fileMainDiv' + id).remove();
            $('.addAttachPerform .attach_img' + id).remove();
            $('.addAttachPerform .abcd' + id).remove();
        });
    })
}

/*****Image attch function start here*****/
var imgAttachments = 0;
var addImgIDActionArr = new Array();
function uploadAttachPerform(form_data, abc) {
    $.ajax(
        {
            url: serviceHTTPPath + "uploadAttachment",
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function (resultFile) {
                imgAttachments = resultFile.json_data.attachment_id;

                if ($('.addAttachPerform .previewimgSize').length != 0) {
                    $('.addAttachPerform .abcd' + abc).attr('id', imgAttachments);
                }
                if ($('.addAttachPerform .addText').length != 0) {
                    $('.addAttachPerform .abcd' + abc).attr('id', imgAttachments);
                }

                addImgIDActionArr.push(imgAttachments);
            }
        });

}
/*****Image attch function end here*****/
function performUserList(result,managerType,selectedUserType){    
    var name = "";    
    var defaultName = "";

    var currentUser = $('#managerDiv').val();
    if($('#managerDiv').val() == undefined){
        currentUser=$('.managerName').attr('id');
    }
   
    var userType = window.localStorage.getItem('userType');    
    $('#selectuser .chooseUserDropDown').remove();
    var html='<div class="chooseUserDropDown">'
    html+='<label class="control-label">Choose User</label>'
       html+='<div class="performDropDown">'
           html+='<div class="">'
               html+='<select name="managerType" class="selectpicker" id="managerDivPerform">'
               html+='<option value="">Choose User</option>'
               for(var i=0;i<result.json_data.response.length;i++){
                    if(managerType == 4 || selectedUserType == 3){    
                        if($("#roleSelect").val() == userType){
                            if(currentUser != result.json_data.response[i].user_id)
                            {
                                if (result.json_data.response[i].first_name !== 0 && result.json_data.response[i].first_name !== null) {
                                    if (result.json_data.response[i].last_name !== 0 && result.json_data.response[i].last_name !== null) {
                                        name = result.json_data.response[i].first_name +" "+result.json_data.response[i].last_name;
                                        html+='<option value="'+result.json_data.response[i].user_id+'" id="userId'+result.json_data.response[i].user_id+'">'+name+'</option>'
                                    }
                                    else{
                                        html+='<option value="'+result.json_data.response[i].user_id+'" id="userId'+result.json_data.response[i].user_id+'">'+result.json_data.response[i].first_name+'</option>'
                                    }
                                }
                                else{
                                    if (result.json_data.response[i].last_name !== 0 && result.json_data.response[i].last_name !== null) {
                                        html+='<option value="'+result.json_data.response[i].user_id+'" id="userId'+result.json_data.response[i].user_id+'">'+result.json_data.response[i].last_name+'</option>'
                                    }
                                }
                            }     
                        }else{                   
                            if (result.json_data.response[i].first_name !== 0 && result.json_data.response[i].first_name !== null) {
                                if (result.json_data.response[i].last_name !== 0 && result.json_data.response[i].last_name !== null) {
                                    name = result.json_data.response[i].first_name +" "+result.json_data.response[i].last_name;
                                    html+='<option value="'+result.json_data.response[i].user_id+'" id="userId'+result.json_data.response[i].user_id+'">'+name+'</option>'
                                }
                                else{
                                    html+='<option value="'+result.json_data.response[i].user_id+'" id="userId'+result.json_data.response[i].user_id+'">'+result.json_data.response[i].first_name+'</option>'
                                }
                            }
                            else{
                                if (result.json_data.response[i].last_name !== 0 && result.json_data.response[i].last_name !== null) {
                                    html+='<option value="'+result.json_data.response[i].user_id+'" id="userId'+result.json_data.response[i].user_id+'">'+result.json_data.response[i].last_name+'</option>'
                                }
                            }
                        }
                    }else{                       
                        if(result.json_data.response[i].is_active  == 1){
                             if($("#roleSelect").val() == userType){
                                if(currentUser != result.json_data.response[i].user_id)
                                {
                                    if (result.json_data.response[i].first_name !== 0 && result.json_data.response[i].first_name !== null) {
                                        if (result.json_data.response[i].last_name !== 0 && result.json_data.response[i].last_name !== null) {
                                            name = result.json_data.response[i].first_name +" "+result.json_data.response[i].last_name;
                                            html+='<option value="'+result.json_data.response[i].user_id+'" id="userId'+result.json_data.response[i].user_id+'">'+name+'</option>'
                                        }
                                        else{
                                            html+='<option value="'+result.json_data.response[i].user_id+'" id="userId'+result.json_data.response[i].user_id+'">'+result.json_data.response[i].first_name+'</option>'
                                        }
                                    }
                                    else{
                                        if (result.json_data.response[i].last_name !== 0 && result.json_data.response[i].last_name !== null) {
                                            html+='<option value="'+result.json_data.response[i].user_id+'" id="userId'+result.json_data.response[i].user_id+'">'+result.json_data.response[i].last_name+'</option>'
                                        }
                                    }
                                }     
                            }else{
                                if (result.json_data.response[i].first_name !== 0 && result.json_data.response[i].first_name !== null) {
                                    if (result.json_data.response[i].last_name !== 0 && result.json_data.response[i].last_name !== null) {
                                        name = result.json_data.response[i].first_name +" "+result.json_data.response[i].last_name;
                                        html+='<option value="'+result.json_data.response[i].user_id+'" id="userId'+result.json_data.response[i].user_id+'">'+name+'</option>'
                                    }
                                    else{
                                        html+='<option value="'+result.json_data.response[i].user_id+'" id="userId'+result.json_data.response[i].user_id+'">'+result.json_data.response[i].first_name+'</option>'
                                    }
                                }
                                else{
                                    if (result.json_data.response[i].last_name !== 0 && result.json_data.response[i].last_name !== null) {
                                        html+='<option value="'+result.json_data.response[i].user_id+'" id="userId'+result.json_data.response[i].user_id+'">'+result.json_data.response[i].last_name+'</option>'
                                    }
                                }
                            }                                        
                        } 
                    }                                 
               }                                                                                  
               html+='</select>'
           html+='</div>'
          
       html+='</div>'
       html+='<span class="errorTxtUser" style="color:red;display:inline-block;"></span>';
    html+='</div>'
   $('#selectuser').append(html);

   $('.chooseUserDropDown .selectpicker').selectpicker('refresh');
   $('.btn-group bootstrap-select').css("width", 100 + "%");
  
    if (result.json_data.response.length >= 10) {
        $('.performDropDown ul').css("height", 175);
        $('.performDropDown ul').css("overflow", "auto");
    }
    else {
        $('.performDropDown ul').css("height", "auto");
    }
    $('.chooseUserDropDown ul li:first-child').remove();
   $('#managerDivPerform').on('change', function(e){      
       errorMessage();
   });
}
// Attach Table
function attachMGTable(result, j, addClass,attachMGTable){   
    var protocol;
    var html;  
    if(result.json_data.response.data[j] != null){    
        var performDisplayArr = new Array("Pending", "Approved", "Denied", "Negotiation Required", "Escalated", "Approved with modification", "On hold", "Reassigned", "Closed");
       
        var protocol = result.json_data.response.data[j].request_number + "-" + result.json_data.response.data[j].protocol_number;

        html = '<tr class="' + result.json_data.response.data[j].escalation_type_id + ' '+addClass+'">';
            //Entries budget and contract    
            if (result.json_data.response.data[j].selectPriority == 2) {
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span id="' + result.json_data.response.data[j].escalation_type_id + '"></span><img class="imgUrgent" id="' + result.json_data.response.data[j].request_number + '" src="'+urgentIcon+'" /> <a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
                
            }
            else if (result.json_data.response.data[j].selectPriority == 1) {
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span id="' + result.json_data.response.data[j].escalation_type_id + '"></span><img class="imgHigh" id="' + result.json_data.response.data[j].request_number + '" src="'+highIcon+'" /> <a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
            }
            else {
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span id="' + result.json_data.response.data[j].escalation_type_id + '"></span><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
            }

            //Country
            html += '<td>' + result.json_data.response.data[j].country_name + '</td>';

            //Issue Types
            if (result.json_data.response.data[j].escalation_type_id == 2) {
                if (result.json_data.response.data[j].type_issues !== '0' && result.json_data.response.data[j].type_issues !== null) {
                    if (result.json_data.response.data[j].type_contract_language !== null && result.json_data.response.data[j].type_contract_language != '0') {
                        html += '<td>Contract - ' + result.json_data.response.data[j].type_contract_language + ' - ' + result.json_data.response.data[j].choose_an_issue_name + '</td>';
                    }
                    else {
                        html += '<td>Contract - ' + result.json_data.response.data[j].choose_an_issue_name;
                    }
                }
                else {

                    if (result.json_data.response.data[j].type_contract_language !== '0' && result.json_data.response.data[j].type_contract_language !== null) {
                        html += '<td>Contract - ' + result.json_data.response.data[j].type_contract_language + '</td>';
                    }
                    else {
                        html += '<td>Contract</td>';
                    }
                }
            }
            else{
                html += '<td>Budget - ' + result.json_data.response.data[j].choose_an_issue_name + '</td>';
            }

            //RaisedBy
            var raisedBy;
            if (result.json_data.response.data[j].raisedBy_first_name != null || result.json_data.response.data[j].raisedBy_last_name != null) {
                if (result.json_data.response.data[j].raisedBy_first_name != 0) {
                    if (result.json_data.response.data[j].raisedBy_last_name != 0) {
                        raisedBy = result.json_data.response.data[j].raisedBy_first_name + " " + result.json_data.response.data[j].raisedBy_last_name;
                        html += '<td class="raisedBy" id="' + result.json_data.response.data[j].request_number + '">' + raisedBy + '</td>';
                    }
                    else {
                        raisedBy = result.json_data.response.data[j].raisedBy_first_name;
                        html += '<td class="raisedBy" id="' + result.json_data.response.data[j].request_number + '">' + raisedBy + '</td>';
                    }
                }
            }
            else {
                html += '<td class="dots">......</td>';
            }
            
            //Raised On Date
            html += '<td>' + result.json_data.response.data[j].create_date + '</td>';

            //Activity
            if (result.json_data.response.data[j].manager_action_desc == null || result.json_data.response.data[j].manager_action_desc == 'null') {
                if (result.json_data.response.data[j].manager_attach_list !== null && result.json_data.response.data[j].manager_attach_list != '' && result.json_data.response.data[j].manager_attach_list != 0) {
                    html += '<td class="boxArea">';
                        html += '<a href="#" class="greyAttach disabledTxt" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive" id="' + result.json_data.response.data[j].request_number + '" src="'+textDisable+'" /></a>';
                        html += '<a href="#" class="desAttach imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachment+'" /></a>';
                    html += '</td>';
                }
                else {
                    if (result.json_data.response.data[j].legal_attach_list !== null && result.json_data.response.data[j].legal_attach_list != '' && result.json_data.response.data[j].legal_attach_list !=0) {
                        html += '<td class="boxArea">';
                        html += '<a href="#" class="greyAttach disabledTxt" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive" id="' + result.json_data.response.data[j].request_number + '" src="'+textDisable+'" /></a>';
                        html += '<a href="#" class="desAttach imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachment+'" /></a>';
                        html += '</td>';
                    }
                    else {
                        html += '<td class="boxArea">';
                        html += '<a href="#" class="greyAttach disabledTxt" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive" id="' + result.json_data.response.data[j].request_number + '" src="'+textDisable+'" /></a>';
                        html += '<a href="#" class="greyAttach disabledImg" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachmentDisable+'" /></a>';
                        html += '</td>';
                    }
                }
            }
            else {
                
                if (result.json_data.response.data[j].manager_action_desc == '' || result.json_data.response.data[j].manager_action_desc == null || result.json_data.response.data[j].manager_action_desc == 'null') {
                    if (result.json_data.response.data[j].manager_attach_list !== null && result.json_data.response.data[j].manager_attach_list != '' && result.json_data.response.data[j].manager_attach_list != 0) {
                        html += '<td class="boxArea">';
                        html += '<a href="#" class="greyAttach disabledTxt" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive" id="' + result.json_data.response.data[j].request_number + '" src="'+textDisable+'" /></a>';
                        html += '<a href="#" class="desAttach imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachment+'" /></a>';
                        html += '</td>';
                    }
                    else {
                        if (result.json_data.response.data[j].legal_attach_list !== null && result.json_data.response.data[j].legal_attach_list != '' && result.json_data.response.data[j].legal_attach_list != 0) {
                            html += '<td class="boxArea">';
                                html += '<a href="#" class="greyAttach disabledTxt" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive" id="' + result.json_data.response.data[j].request_number + '" src="'+textDisable+'" /></a>';
                                html += '<a href="#" class="desAttach imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachment+'" /></a>';
                            html += '</td>';
                        }
                        else {
                            html += '<td class="boxArea">';
                            html += '<a href="#" class="greyAttach disabledTxt" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive" id="' + result.json_data.response.data[j].request_number + '" src="'+textDisable+'" /></a>';
                            html += '<a href="#" class="greyAttach disabledImg" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachmentDisable+'" /></a>';
                            html += '</td>';
                        }
                    }
                }
                else {
                    if (result.json_data.response.data[j].manager_attach_list !== null && result.json_data.response.data[j].manager_attach_list != '' && result.json_data.response.data[j].manager_attach_list != 0) {
                        html += '<td class="boxArea">';
                            html += '<a href="#" class="desAttach txtBtn" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive txt_ActiveIcon" id="' + result.json_data.response.data[j].request_number + '" src="'+textActive+'" /></a>';
                            html += '<a href="#" class="desAttach imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachment+'" /></a>';
                        html += '</td>';
                    }
                    else {
                        if (result.json_data.response.data[j].legal_attach_list !== null && result.json_data.response.data[j].legal_attach_list != '' && result.json_data.response.data[j].legal_attach_list != 0) {
                            html += '<td class="boxArea">';
                            html += '<a href="#" class="desAttach txtBtn" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive txt_ActiveIcon" id="' + result.json_data.response.data[j].request_number + '" src="'+textActive+'" /></a>';
                            html += '<a href="#" class="desAttach imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachment+'" /></a>';
                            html += '</td>';
                        }
                        else {
                            html += '<td class="boxArea">';
                                html += '<a href="#" class="desAttach txtBtn" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive txt_ActiveIcon" id="' + result.json_data.response.data[j].request_number + '" src="'+textActive+'" /></a>';
                                html += '<a href="#" class="greyAttach disabledImg" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachmentDisable+'" /></a>';
                            html += '</td>';
                        }
                    }
                }
            }

            if(attachMGTable == "reassigned"){
                //Action Taken By           
                if (result.json_data.response.data[j].action_track != null) {                
                    for (var l = 0; l < result.json_data.response.data[j].action_track.length; l++) {
                        if (result.json_data.response.data[j].action_track.length != 1) {
                            if ($('#managerDiv').val() == result.json_data.response.data[j].action_track[l].coe_id) {                               
                                var setval=l-1;   
                                                    
                                if (result.json_data.response.data[j].action_track[setval].actionTakenBy_first_name != null) {
                                    if (result.json_data.response.data[j].action_track[setval].actionTakenBy_last_name != null) {
                                        var legalName = result.json_data.response.data[j].action_track[setval].actionTakenBy_first_name + " " + result.json_data.response.data[j].action_track[setval].actionTakenBy_last_name;
                                        html += '<td class="">' + legalName + '</td>';
                                    }
                                    else {
                                        var legalName = result.json_data.response.data[j].action_track[setval].actionTakenBy_first_name;
                                        html += '<td class="">' + legalName + '</td>';
                                    }
                                }
                                else {
                                    if (result.json_data.response.data[j].action_track[l].first_name != 0) {
                                        if (result.json_data.response.data[j].action_track[l].last_name != 0) {
                                            var legalName = result.json_data.response.data[j].action_track[l].first_name + " " + result.json_data.response.data[j].action_track[l].last_name;
                                            html += '<td class="">' + legalName + '</td>';
                                        }
                                        else {
                                            var legalName = result.json_data.response.data[j].action_track[l].first_name;
                                            html += '<td class="">' + legalName + '</td>';
                                        }
                                    }
                                    else {
                                        html += '<td class="dots">......</td>';
                                    }
                                }
                                break;
                            }
                        }
                        else {
                            html += '<td class="dots">......</td>';
                        }
                    }
                }
                else {
                    html += '<td class="dots">......</td>';
                }
            }else if(attachMGTable == "dashboard"){
                //Action Taken By Name
               //Action Taken By           
               if (result.json_data.response.data[j].action_track != null) {                
                for (var l = 0; l < result.json_data.response.data[j].action_track.length; l++) {
                    if (result.json_data.response.data[j].action_track.length != 1) {
                        if ($('#managerDiv').val() == result.json_data.response.data[j].action_track[l].coe_id && result.json_data.response.data[j].action_track[l].coe_type == 1) {                               
                            var setval=l;                             
                                             
                            if (result.json_data.response.data[j].action_track[setval].actionTakenBy_first_name !== null && result.json_data.response.data[j].action_track[setval].actionTakenBy_first_name !== 0) {
                                if (result.json_data.response.data[j].action_track[setval].actionTakenBy_last_name !== null && result.json_data.response.data[j].action_track[setval].actionTakenBy_last_name !== 0) {
                                    var legalName = result.json_data.response.data[j].action_track[setval].actionTakenBy_first_name + " " + result.json_data.response.data[j].action_track[setval].actionTakenBy_last_name;
                                    html += '<td class="">' + legalName + '</td>';
                                }
                                else {
                                    var legalName = result.json_data.response.data[j].action_track[setval].actionTakenBy_first_name;
                                    html += '<td class="">' + legalName + '</td>';
                                }
                            }else{
                                setval=l+1;
                                if (result.json_data.response.data[j].action_track[setval].first_name != 0) {
                                    if (result.json_data.response.data[j].action_track[setval].last_name != 0) {
                                        var legalName = result.json_data.response.data[j].action_track[setval].first_name + " " + result.json_data.response.data[j].action_track[setval].last_name;
                                        html += '<td class="">' + legalName + '</td>';
                                    }
                                    else {
                                        var legalName = result.json_data.response.data[j].action_track[setval].first_name;
                                        html += '<td class="">' + legalName + '</td>';
                                    }
                                }
                                else {
                                    html += '<td class="dots">......</td>';
                                }
                            }

                            break;
                        }
                    }
                    else {
                        html += '<td class="dots">......</td>';
                    }
                }
                }
                else {
                    html += '<td class="dots">......</td>';
                }
           }else{
               //Archieve Taken By
                if (result.json_data.response.data[j].actionTakenBy_first_name != null) {
                    if (result.json_data.response.data[j].actionTakenBy_last_name != null) {
                        var legalName = result.json_data.response.data[j].actionTakenBy_first_name + " " + result.json_data.response.data[j].actionTakenBy_last_name;
                        html += '<td class="">' + legalName + '</td>';
                    }
                    else {
                        var legalName = result.json_data.response.data[j].actionTakenBy_first_name;
                        html += '<td class="">' + legalName + '</td>';
                    }
                }
                else {
                    html += '<td class="dots">......</td>';
                }
           }
                
           

           
           if(attachMGTable == "reassigned")
           {
            //Reassigned To            
            if (result.json_data.response.data[j].action_track != null) {                
                for (var l = 0; l < result.json_data.response.data[j].action_track.length; l++) {
                    if (result.json_data.response.data[j].action_track.length != 1) {
                        if ($('#managerDiv').val() == result.json_data.response.data[j].action_track[l].coe_id) {
                            var setval=l-1;                           
                            if (result.json_data.response.data[j].action_track[setval].first_name != 0) {
                                if (result.json_data.response.data[j].action_track[setval].last_name != 0) {
                                    var legalName = result.json_data.response.data[j].action_track[setval].first_name + " " + result.json_data.response.data[j].action_track[setval].last_name;
                                    html += '<td class="">' + legalName + '</td>';
                                }
                                else {
                                    var legalName = result.json_data.response.data[j].action_track[setval].first_name;
                                    html += '<td class="">' + legalName + '</td>';
                                }
                            }
                            else {
                                html += '<td class="dots">......</td>';
                            }
                            break;
                        }
                    }
                    else {
                        html += '<td class="dots">......</td>';
                    }

                }

            }
            else {
                html += '<td class="dots">......</td>';
            }
           }else{
               //Reassigned By                          
                if (result.json_data.response.data[j].action_track != null) {                
                    for (var l = 0; l < result.json_data.response.data[j].action_track.length; l++) {
                        if (result.json_data.response.data[j].action_track.length != 1) {
                            if ($('#managerDiv').val() == result.json_data.response.data[j].action_track[l].coe_id) {                              
                                var setval=l+1;                    
                                if (result.json_data.response.data[j].action_track[setval].first_name != 0) {
                                    if (result.json_data.response.data[j].action_track[setval].last_name != 0) {
                                        var legalName = result.json_data.response.data[j].action_track[setval].first_name + " " + result.json_data.response.data[j].action_track[setval].last_name;
                                        html += '<td class="">' + legalName + '</td>';
                                    }
                                    else {
                                        var legalName = result.json_data.response.data[j].action_track[setval].first_name;
                                        html += '<td class="">' + legalName + '</td>';
                                    }
                                }
                                else {
                                    html += '<td class="dots">......</td>';
                                }
                                break;
                            }
                        }
                        else {
                            html += '<td class="dots">......</td>';
                        }

                    }

                }
                else {
                    html += '<td class="dots">......</td>';
                }
           }
            

            //Action Date
            if (result.json_data.response.data[j].manager_action_date != null) {
                if (result.json_data.response.data[j].manager_action_date != "0000-00-00 00:00:00") {
                    html += '<td class="">' + result.json_data.response.data[j].manager_action_date + '</td>';
                }
                else {
                    html += '<td class="dots">......</td>';
                }
            }
            else {
                html += '<td class="dots">......</td>';
            }

            if(attachMGTable == "reassigned")
            {
                html += '<td class="new" style="color:#4692c2;font-weight: bold;">Reassigned</td>';
                html+='<td class="text-center"><a class="btn btn-info performActionDisable performClick2 disabled" href="#" id="'+result.json_data.response.data[j].request_number+'"> Perform Action</a></td>'
            }else{
                //Status
                var colorClassArr = new Array("#f46242", "#32b924", "#fe1631", "#25d6ae", "#F90", "#916aa3", "#eead3c", "#4692c2", "#000");                
                var escalationAction = new Array("1","2", "3", "4", "5", "6", "7", "8", "9");              
                if (result.json_data.response.data[j].manager_action !== null && result.json_data.response.data[j].manager_action !== '0') {                   
                    for (var p = 0; p < performDisplayArr.length + 1; p++) {
                        if (escalationAction[p] == result.json_data.response.data[j].manager_action) {
                            var action = p - 1;
                           
                            html += '<td class="performActionFont" style="color:'+colorClassArr[p]+'">' + performDisplayArr[p] + '</td>';
                        }
                    }
                }
                else {
                    html += '<td class="new" style="color:#784444">New</td>';
                }                
                if(attachMGTable == "archieve")
                {
                    html+='<td class="text-center"><a class="btn btn-info performActionDisable performClick2 disabled" href="#" id=""> Perform Action</a></td>'
                }else{
                    html += '<td class="text-center"><a class="btn btn-info performAction performClick" href="#" id="' + result.json_data.response.data[j].request_number + '"> Perform Action</a></td>';
                }
                

            }
        
        html += '</tr>';

        $('.content-wrapper .tableMainContainer .tbodyContainer').append(html);
    }
   
}