function contractForm(){
    var hamburgerActive = 1;    
    if(window.localStorage.getItem('userType') != null){
        hamburgerList(hamburgerActive, window.localStorage.getItem('userType'));

        //Call in budget.js
        createCommonForm(0,2);
    }else{
        location.href = "../index.html";
    }
}
var selectCLE_Type = new Array("CTA", "CDA", "Others");
function createContractForm(result, currencyResult, viewCroResult,resultIssueType, pageId){
    $('#formType' + pageId).remove();
	$('#formType' + pageId + ' .escalationFollowUpMain').remove();
	var i;
	
	//Option first Start Here// 
    var html = '<div class="item white-box budget_contract" id="formType' + pageId + '">';
         html += '<form class="form-horizontal create-form validate-form" action="" method="post" id="create-form" novalidate>'

            html += '<div class="pageBorder studyDetail'+pageId+'" id="inputStudyDetail">'; 
            //Study detail attach here
            html += '</div>';

            //Select Contract Language Escalation
            html += '<div class="pageBorder select_CLE" id="">';
             html += '<p class="studyTitle topMargin text-uppercase">Select the Type of Contract Language Escalation<em class="required"> *</em></p>';

             for (var j = 0; j < selectCLE_Type.length; j++) {
                html += '<div class="row selectCLE">';
                    html += '<div class="col-xs-12 col-sm-12 col-lg-12 issueTypeRow" id="">';
                        html += '<div class="form-check">';
                            html += '<label class="radionBtn">';
                                html += '<input type="radio" name="selectCLE" value="'+j+'"> <span id="selectCLE_Txt'+j+'" class="label-text">'+selectCLE_Type[j]+'</span>';
                            html += '</label>';
                        html += '</div>';
                    html += '</div>';
                html += '</div>';	
             }	
            html += '</div>';

            // Issue type radio buttons start here
            html += '<div class="pageBorder CTAOption issueOption'+pageId+'" id="issueTypeContainer'+pageId+'">';	
            //Issue type attach end here
            html += '</div>';
            // Issue types radio buttons end here

            html += '<div class="pageBorder" id="inputOptionsAttach">';
              //ENTER DESCRIPTION OF CTA/ CDA/ OTHER ESCALATION(Include proposed or original language as applicable)
              html += '<div class="proposed descriptionIssue" id="">';
                html += '<p class="studyTitle topMargin text-uppercase">ENTER DESCRIPTION OF CTA/ CDA/ OTHER ESCALATION(Include proposed or original language as applicable)<em class="required"> *</em></p>';
                html += '<div class="summernote descTextArea"></div>';	
              html += '</div>';

              //Provide Site Rationale
              html += '<div class="ProvideRationale" id="">';
                html += '<p class="studyTitle topMargin text-uppercase">Provide Site Rationale<em class="required"> *</em></p>';
                html += '<div class="summernote ProvideRationale"></div>';	
              html += '</div>';

              html += '<div class="row addFile"></div>';
              html += '<div class="addBtn plusPosition"></div>';

              //Describe Attempts to Negotiate
              html += '<div class="negotiate" id="">';
                html += '<p class="studyTitle topMargin text-uppercase">Describe Attempts to Negotiate<em class="required"> *</em></p>';
                html += '<div class="summernote attempts"></div>';	
              html += '</div>';
              
            html += '</div>';

            html += '<div class="pageBorder otherDetails" id="">';
              //Any other details
              html += '<p class="studyTitle topMargin text-uppercase">Any other details<em class="required"> *</em></p>';
              html += '<div class="summernote details"></div>';	
              
              // Is this request of High Priority i.e response needed within 48 hours or less start here
                html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                    html += '<span class="priority">Is this request of High Priority i.e response needed within 48 hours or less?<em class="required"> *</em></span>';
                html += '</div>';
            
                html += '<div class="row previousIssue priorityType">';
                    html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                    
                    for(i = 0;i<radioBtnTxtArr.length;i++){
                        html += '<div class="form-check">'
                            html += '<label class="radionBtn">'
                            html += '<input type="radio" name="priority" value="'+radioBtnValueArr[i]+'"> <span class="label-text priorityTypeTxt'+i+'">'+radioBtnTxtArr[i]+'</span>'
                            html += '</label>'
                        html += '</div>'
                    }
                        
                    html += '<div class="choosePriority" id=""></div>';

                    html += '</div>';
                html += '</div>';
            // Is this request of High Priority i.e response needed within 48 hours or less end here

            // Do you want to add any other issue start here
            html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                html += '<span class="priority">Do you want to add any other issue<em class="required"> *</em></span>';
            html += '</div>';

            html += '<div class="row previousIssue addOtherIssue">';
                html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                
                for(i = 0;i<radioBtnTxtArr.length;i++){
                    html += '<div class="form-check">'
                        html += '<label class="radionBtn">'
                        html += '<input type="radio" name="otherIssue" value="'+i+'"> <span class="label-text otherIssueTxt'+i+'">'+radioBtnTxtArr[i]+'</span>'
                        html += '</label>'
                    html += '</div>'
                }
                    
                html += '</div>';
            html += '</div>';
            // Do you want to add any other issue end here
            
            html += '</div>';
         
         html += '</form>';
        html += '</div>';
    $('.carousel-inner').append(html);   

    abc = 0;
	addId = 0;
	addImgIDArr = [];
    attachImages(pageId);

    //Below functions call in js/budgetForm.js

    //Form common value
    commonFormValidation(result, currencyResult, viewCroResult,resultIssueType, pageId);
   
    //Was this issue previously raised in the app radio clicl event
	commonRadionClickEvent(result, currencyResult, viewCroResult,resultIssueType, pageId)
    
    yesNoRadioContractFun(result, currencyResult, viewCroResult,resultIssueType, pageId);
    
    /*****Submite Button function call start here*****/
    submiteButtons(result, currencyResult, viewCroResult,resultIssueType, pageId);
    /*****Submite Button function call end here*****/
}
function saveContractForm(result, currencyResult, viewCroResult,resultIssueType, getPageId){
    contractFormValidations(result, currencyResult, viewCroResult,resultIssueType, getPageId,"subBtn");
}
function contractFormValidations(result, currencyResult, viewCroResult,resultIssueType, getPageId,btnClick){
    window.localStorage.setItem("selectRaisedBy", $('.selectRaisedBy').val());
	window.localStorage.setItem("selectPrincipal", $('.selectPrincipal').val());
	window.localStorage.setItem("selectRequested", $('.selectRequested').val());
    
	var msg = "Please complete form first";
    
    if ($('#formType' + getPageId + ' .selectProtocol').find("option:selected").text() !== "Enter Protocol" && $('#formType' + getPageId + ' .selectSite').find("option:selected").text() !== "Enter Site" && $('#formType' + getPageId + ' .selectCountry').find("option:selected").text() !== "Select Country") {
        if($('#formType' + getPageId + ' .select_CLE .radionBtn input:radio[name="selectCLE"]:checked').val() == 0){
            if($('#formType' + getPageId + ' .dropBoxClass .radionBtn input:radio[name="raised"]').is(":checked") !==  false && $('#formType' + getPageId + ' .select_CLE .radionBtn input:radio[name="selectCLE"]').is(":checked") !==  false && $('#formType' + getPageId + ' .issueTypes .radionBtn input:radio[name="issueTypeRadio"]').is(":checked") !==  false && $('#formType' + getPageId + ' .priorityType .radionBtn input:radio[name="priority"]').is(":checked") !==  false)
            {            
                issueTypeChoose(result, currencyResult, viewCroResult,resultIssueType, getPageId,btnClick);
            }
            else{
                if(btnClick ==  "radioBtn"){
                    otherIssueUnchecked(getPageId);
                }                    
                alertScreen("Please select radio option first",'')
            }   
        }else{
            if($('#formType' + getPageId + ' .dropBoxClass .radionBtn input:radio[name="raised"]').is(":checked") !==  false && $('#formType' + getPageId + ' .select_CLE .radionBtn input:radio[name="selectCLE"]').is(":checked") !==  false && $('#formType' + getPageId + ' .priorityType .radionBtn input:radio[name="priority"]').is(":checked") !==  false)
            { 
                issueTypeChoose(result, currencyResult, viewCroResult,resultIssueType, getPageId,btnClick);		
            }
            else{
                if(btnClick ==  "radioBtn"){
                    otherIssueUnchecked(getPageId);
                }  
                alertScreen("Please select radio option first",'')
            }   
        }        
	}
	else{
		if(btnClick ==  "radioBtn"){
            otherIssueUnchecked(getPageId);
        }  
		alertScreen(msg,'')
	}
}
function issueTypeChoose(result, currencyResult, viewCroResult,resultIssueType, getPageId,btnClick){
    var msg = "Please complete form first";
    //Was this issue previously raised in the app selected Yes start
    if($('#formType' + getPageId + ' .dropBoxClass .radionBtn input:radio[name="raised"]:checked').val() == 1)
    {
        if($('#formType' + getPageId + ' .selectUserType').find("option:selected").text() !== "Select User"){
            
            texteditableValidations(result, currencyResult, viewCroResult,resultIssueType, getPageId,btnClick);
        }
        else{
            if(btnClick ==  "radioBtn"){
                otherIssueUnchecked(getPageId);
            }  
            alertScreen(msg,'')
        }
    }
    else{
        texteditableValidations(result, currencyResult, viewCroResult,resultIssueType, getPageId,btnClick);
    }	
    //Was this issue previously raised in the app selected Yes end	
}
function texteditableValidations(result, currencyResult, viewCroResult,resultIssueType, getPageId,btnClick){
    var msg = "Please complete form first";
	if ($('#formType' + getPageId + ' .descriptionIssue .note-editable').text() !==  '' && $('#formType' + getPageId + ' .ProvideRationale .note-editable').text() !==  '' && $('#formType' + getPageId + ' .negotiate .note-editable').text() !==  '' && $('#formType' + getPageId + ' .otherDetails .note-editable').text() !==  '' && $('#formType' + getPageId + ' .selectRaisedBy').val() !==  '' && $('#formType' + getPageId + ' .selectPrincipal').val() !==  '' && $('#formType' + getPageId + ' .selectRequested').val() !==  '') 
	{
        priorityTypeValidation(result, currencyResult, viewCroResult,resultIssueType, getPageId);
    }
    else{
        if(btnClick ==  "radioBtn"){
            otherIssueUnchecked(getPageId);
        }  
        alertScreen(msg,'')
    }
}
function priorityTypeValidation(result, currencyResult, viewCroResult,resultIssueType, getPageId){

    var setPageId = 0;
	var saveLength;
    if($('#formType' + getPageId + ' .priorityType .radionBtn input:radio[name="priority"]:checked').val() == 1){
		if ($('#formType' + getPageId + ' .choosePriorityTxt .radionBtn input:radio[name="highUrgent"]').is(":checked") !=  false)
		{
			if ($('#formType' + getPageId + ' #reasonPriorityDiv' + getPageId + ' .note-editable').text() !=  '') {	
							
				if($('#formType' + getPageId + ' .addOtherIssue .radionBtn input:radio[name="otherIssue"]').is(":checked") ===  false || $('#formType' + getPageId + ' .addOtherIssue .radionBtn input:radio[name="otherIssue"]:checked').val() == 1){
                    saveLength = parseInt(getPageId) + 1;                   
					callSaveContractForm(setPageId, saveLength);
				}else{
					contractNextForm(result, currencyResult, viewCroResult,resultIssueType, getPageId);
				}
			}
			else{
				alertScreen("Please enter the reason for choosing the priority",'');
			}
		}
		else{
			alertScreen("Please choose priority first",'');		
		}
    }
    else{
        if($('#formType' + getPageId + ' .addOtherIssue .radionBtn input:radio[name="otherIssue"]').is(":checked") ==  false){		
            saveLength = parseInt(getPageId) + 1;		           
			callSaveContractForm(setPageId, saveLength);

		}else{            
			if($('#formType' + getPageId + ' .addOtherIssue .radionBtn input:radio[name="otherIssue"]:checked').val() == 1){			
                saveLength = parseInt(getPageId) + 1;	               			
				callSaveContractForm(setPageId, saveLength);
			}
			else{
				contractNextForm(result, currencyResult, viewCroResult,resultIssueType, getPageId);
			}			
		}	
    }
} 
// Save Contract Language Escalation request start here
function callSaveContractForm(setPageId, saveLength){

    var selectProtocol = window.localStorage.getItem("selectProtocol");
	if (selectProtocol == null) {
		selectProtocol = "";
	}
	var selectSite = window.localStorage.getItem("selectSite");
	if (selectSite == null) {
		selectSite = "";
	}

	var selectCountry = window.localStorage.getItem("selectCountry");
	if (selectCountry == null) {
		selectCountry = "";
	}
  
    // Was this issue previously raised in the app and if so, should this be directed to specific Takeda Contract manager Radio buttons   
	var previouslyRaised = $('#formType' + setPageId + ' .dropBoxClass .radionBtn input:radio[name="raised"]:checked').val();
	var manager_id;
	if (window.localStorage.getItem("followUpId") ==  '') {
		manager_id = 0;
	}
	else {
		manager_id = window.localStorage.getItem("followUpId");
    }
    var user_id = window.localStorage.getItem("user_id");

    var formNumber = window.localStorage.getItem("formNumber")	
	var listEscalation = window.localStorage.getItem("listEscalation");
	
    var emailObject = $('#emailValidation').tokenfield('getTokensList');
    if ($("#emailValidation-tokenfield").val() !=  '') {
		if (ValidateEmail($("#emailValidation-tokenfield").val())) {
			if(emailObject == ''){
				emailObject = $("#emailValidation-tokenfield").val();
			}else{
				emailObject = emailObject + ", " + $("#emailValidation-tokenfield").val();
			}			
		}
	}
    emailObject = emailObject.replace(/,/g , ';')
    //Select Contract Language Escalation
    var index_SCL = $('#formType' + setPageId + ' .select_CLE .radionBtn input:radio[name="selectCLE"]:checked').val()
    var typeContract = $('#formType' + setPageId + ' .select_CLE .radionBtn #selectCLE_Txt'+index_SCL).text();
    

    // Issue types radio buttons
	var issueType = $('#formType' + setPageId + ' .issueTypes .radionBtn input:radio[name="issueTypeRadio"]:checked').val()
    //var issueType = $('#formType' + setPageId + ' .issueTypes .radionBtn #issueTypeTxt'+issueTypeIndex).text();

    if(typeContract != "CTA"){
        issueType = 0;
    }
    
    // Attachment
    var attachedArr = [];
	var arrAttachIds = 0;
	var setFlag = true;
	if ($('#formType' + setPageId + ' .previewimgSize').length != 0) {
		for (var l = 0; l < $('#formType' + setPageId + ' .previewimgSize').length; l++) {
            attachedArr.push($('#formType' + setPageId + ' .previewimgSize')[l].id)	
		}
	}
	if ($('#formType' + setPageId + ' .addText').length != 0) {
		for (var y = 0; y < $('#formType' + setPageId + ' .addText').length; y++) {
            attachedArr.push($('#formType' + setPageId + ' .addText')[y].id)		
		}
    }
    var arrAttachIds = my_implode_js(',',attachedArr); 
    if(arrAttachIds == ''){
		arrAttachIds=0;
    }
    
    var highUrgentVal = 0;
    if($('#formType' + setPageId + ' .choosePriorityTxt .radionBtn input:radio[name="highUrgent"]:checked').val()!= undefined){
        highUrgentVal = $('#formType' + setPageId + ' .choosePriorityTxt .radionBtn input:radio[name="highUrgent"]:checked').val();
    }
   
    loaderLogin();

	$.ajax({
		url: serviceHTTPPath + "saveLanguageEscalation",
		type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
		data: {
			user_id: user_id,
			escalation_type_id: listEscalation,
			protocol_id: selectProtocol,
			sitename: selectSite,
			country: selectCountry,
			raised_by: $('#formType' + setPageId + ' .selectRaisedBy').val(),
			principle_investigator: $('#formType' + setPageId + ' .selectPrincipal').val(),
			requested_by: $('#formType' + setPageId + ' .selectRequested').val(),
			followUp: previouslyRaised,
            esc_id: manager_id,
            
            type_contract: typeContract,
            
			type_issues: issueType,
			proposed_language: $('#formType' + setPageId + ' .descriptionIssue .note-editable').html(),
			site_rationale: $('#formType' + setPageId + ' .ProvideRationale .note-editable').html(),
			do_add_attachment: 0,
			attempts_negotiate: $('#formType' + setPageId + ' .negotiate .note-editable').html(),
            other_detail: $('#formType' + setPageId + ' .otherDetails .note-editable').html(),            
            request_id: formNumber,            
            attachment_file_ids: arrAttachIds,            
			highPriority: $('#formType' + setPageId + ' .priorityType .radionBtn input:radio[name="priority"]:checked').val(),
			selectPriority: highUrgentVal,
			priorityReason: $('#formType' + setPageId + ' #reasonPriorityDiv' + setPageId + ' .note-editable').text(),	
            cc_email: emailObject
		},
		success: function (result) {
			//alert("success=" + JSON.stringify(result))
			var msg = result.json_data.message;
			if (msg == 'Success') {
				window.localStorage.setItem("formNumber", result.json_data.request_id);
				if (setPageId == saveLength - 1) {
                    loaderRemoveFun();
                    var href= "croDashboard.html";
					alertScreen(msg, href);
				}
				else {
					setPageId = parseInt(setPageId) + 1;
					callSaveContractForm(setPageId, saveLength);
				}
			}
			else {
                loaderRemoveFun();
				alertScreen(msg,'');
			}
		},
		error: function (e) {
			return;
		}
	});
}
function contractNextForm(result, currencyResult, viewCroResult,resultIssueType, getPageId){
    var emailObject = $('#emailValidation').tokenfield('getTokensList');
	window.localStorage.setItem("selectCC", emailObject);
	
	var nextId =parseInt(getPageId) + 1;	
	if(window.localStorage.getItem("nextBtn") == ""){
	 //Create next form
	 pageNoLength.push(nextId);
     createContractForm(result, currencyResult, viewCroResult,resultIssueType, nextId);
	}
	else{
		//Next button click for next form
		submiteButtons(result, currencyResult, viewCroResult,resultIssueType, nextId);
		$('#formType' + getPageId).removeClass("active");
	    $('#formType' + nextId).addClass("active");
    }
    $(window).scrollTop(0);
}
function yesNoRadioContractFun(result, currencyResult, viewCroResult,resultIssueType, pageId){
    var getPageId = pageId;	
	var radioButtons;
	var index;
    var l;
     //Select Contract Language Escalation radio buttons click event
     $('#formType' + pageId + ' .CTAOption').css("display", "none");
     $('#formType' + pageId + ' .selectCLE .radionBtn input[type=radio]').on('change', function () {
         radioButtons = $('#formType' + pageId + ' .selectCLE .radionBtn input:radio[name="selectCLE"]');
         
         index = radioButtons.index(radioButtons.filter(':checked'));
         var issueType = $('#formType' + pageId + ' .selectCLE .radionBtn #selectCLE_Txt'+index).text();
        
         if (index != 0) {
            $('#issueTypeContainer'+pageId+' p').remove();
            $('#issueTypeContainer'+pageId+' .row').remove();
         }
         else {
             $('#formType' + pageId + ' .CTAOption').css("display", "block");
             issueTypeAttach(result, currencyResult, viewCroResult,resultIssueType, pageId)
         }
 
         for (l = 0; l < issueTypeArr.length; l++) {
             $('#formType' + pageId + ' .selectCLE .radionBtn #selectCLE_Txt' + l).css("color", "#333");
         }
         
         $('#formType' + pageId + ' .selectCLE .radionBtn #selectCLE_Txt' + index).css("color", "#4c9bcf");
     });
}
