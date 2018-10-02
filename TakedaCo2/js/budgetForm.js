function budgetForm(){
	var hamburgerActive = 1;	
	if(window.localStorage.getItem('userType') != null){
		hamburgerList(hamburgerActive, window.localStorage.getItem('userType'));
		createCommonForm(0,1);
	}else{
		location.href = "../index.html";
	}
}
var pageNoLength = new Array();
function createCommonForm(pageId,formId){
    pageNoLength = [];
	pageNoLength.push(pageId);
	loaderLogin();

	$.ajax({
		url: serviceHTTPPath + "listCountry",
		type: "GET",
		dataType: 'json',
		headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
		success: function (result) {
			//alert("success="+JSON.stringify(result))	
			if(result.json_data.response == 4 || result.json_data.response == 5 || result.json_data.response == 6){
                location.href = "../index.html";
            }else{		
				$.ajax({
					url: serviceHTTPPath + "currencyList",
					type: "GET",
					dataType: 'json',
					headers: {
						"authorization": window.localStorage.getItem("token_id")
					},
					success: function (currencyResult) {					
						$.ajax({
							url: serviceHTTPPath + "listIssuesTypes",
							type: "POST",
							headers: {
								"authorization": window.localStorage.getItem("token_id")
							},
							data: {
								form_id: formId
							},
							dataType: 'json',
							success: function (resultIssueType) {
								//alert("success="+JSON.stringify(resultIssueType))
								loaderRemoveFun();							
								if(resultIssueType.json_data.response == 1){
									var viewCroResult = '';
									window.localStorage.setItem("formNumber", 0);
									if(formId == 1){
										attachBudgetForm(result, currencyResult, viewCroResult,resultIssueType, pageId);
									}
									else{
										createContractForm(result, currencyResult, viewCroResult,resultIssueType, pageId);
									}								
								}else{
									alertScreen(resultIssueType.json_data.message,'')
								}
								
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
			}
				
			
		},
		error: function (e) {
			loaderRemoveFun();
			return;
		}
	});
}
// Attach Budget form
var studyDetailArr = new Array("Protocol Number", "Site Name", "Country", "Raised By", "Principal Investigator", "Requested By", "CC", "Was this issue previously raised in the app and if so, should this be directed to specific Takeda Contract manager?");
var studyDetailClassArr = new Array('protocolNumber', 'siteName', 'conuntryName', 'RaisedBy', 'Principal', 'Requested', 'CC', 'Escalation');
var dropDownIdArr = new Array('chooseProtocol', 'chooseSite', 'chooseCountry', 'chooseSite', 'chooseRaisedBy', 'choosePrincipal', 'chooseRequested', 'chooseCCID', 'chooseEscalation');
var selectClassArr = new Array('selectProtocol', 'selectSite', 'selectCountry', 'selectRaisedBy', 'selectPrincipal', 'selectRequested', 'selectCC', 'selectEscalation');
var selectIdArr = new Array('selectProtocolId', 'selectSiteId', 'selectCountryId', 'selectRaisedById', 'selectPrincipalId', 'selectRequestedId', 'selectCCID', 'selectEscalationId');
var defultTitleArr = new Array('Enter Protocol', 'Enter Site', 'Select Country', 'Enter Raised by', 'Enter Principal Investigator', 'Enter Requested by', 'CC');//,'What is this Escalation')

var issueTypeArr = new Array("Procedure", "Personnel", "Overhead", "Site Costs", "Invoiceable/Conditional", "Subject Reimbursements/Payments", "Total Cost Per Visit/Patient", "Other");

var localStorageArr = new Array('protocolNumber', 'siteName', 'countryName', 'selectRaisedBy', 'selectPrincipal', 'selectRequested', 'selectCC', 'escalationRadio');
var radioBtnTxtArr = new Array("Yes","No");
var radioBtnValueArr = new Array(1,0);
function attachBudgetForm(result, currencyResult, viewCroResult,resultIssueType, pageId){
   
    $('#formType' + pageId).remove();
	$('#formType' + pageId + ' .escalationFollowUpMain').remove();
	var i;
	
	//Option first Start Here// 
    var html = '<div class="item white-box budget_contract" id="formType' + pageId + '">';
		html += '<form class="form-horizontal create-form validate-form" action="" method="post" id="create-form" novalidate>'

		html += '<div class="pageBorder studyDetail'+pageId+'"" id="inputStudyDetail">';	  
		//Study detail attach here
		html += '</div>';
		
		// Issue Issue radio buttons start here
		html += '<div class="pageBorder issueOption'+pageId+'" id="issueTypeContainer">';	
		//Issue Issue attach here
		html += '</div>';
		// Issue types radio buttons end here

		// Description of the issue
		html += '<div class="pageBorder descriptionIssue" id="">';
		html += '<p class="studyTitle topMargin text-uppercase">Description of the issue(Please specify whether inclusive of Overhead-if applicable)<em class="required"> *</em></p>';
		html += '<div class="summernote descTextArea"></div>';	

		// Site Request Attach start here
		html += '<div class="row site-box">';
		html += '<div class="col-xs-6 col-sm-6 col-lg-6" >';
		html += '<span class="optionValTile">Site Request</span>';

		html += '<input class="floatRight siteRText inputTxt" type="text" id="" value="" placeholder=""  onkeypress="return isNumberKey(event)">';

		html += '<div class="dropdown currencyDropdown" id="">';
			html += '<select class="selectpicker currencyType selectCurrency" ng-model="discussionsSelect" id="" name="selValue" style="display: none;">';	
			for (i = 0; i < currencyResult.json_data.response.length; i++) {					  
				html += '<option data-subtext="" value="' + currencyResult.json_data.response[i].short_code + '">' + currencyResult.json_data.response[i].short_code + '</option>';	
			}		 	 
			html += '</select>';
		html += '</div>';

		html += '</div>';
		// Site Request Attach end here

		// Initial Offer Attach start here
		html += '<div class="col-xs-6 col-sm-6 col-lg-6" >';
		html += '<span class="optionValTile">Initial Offer</span>';

		html += '<input class="floatRight initialText inputTxt" type="text" id="" value="" placeholder=""  onkeypress="return isNumberKey(event)">';

		html += '<div class="dropdown currencyDropdown" id="">';
			html += '<select class="selectpicker currencyType" id="" name="selValue" data-show-subtext="true" style="display: none;">';		
			for (i = 0; i < currencyResult.json_data.response.length; i++) {					  
				html += '<option data-subtext="" value="' + currencyResult.json_data.response[i].short_code + '">' + currencyResult.json_data.response[i].short_code + '</option>';	
			}	
			html += '</select>';
		html += '</div>';
		
		html += '</div>';
		
		// Initial Offer Attach end here
		html += '</div>';
		// Percent over Initial Offer Attach start here
		html += '<div class="row site-box">';
			html += '<div class="col-xs-12 col-sm-12 col-lg-12" >';
			html += '<span class="optionValTile">Percent over Initial Offer</span>';
			html += '<input disabled class="floatRight initialPercent'+pageId+' inputTxt" type="text" id="" value="" placeholder=""  onkeypress="return isNumberKey(event)">';	
			html += '</div>';	
		html += '</div>';
		// Percent over Initial Offer Attach end here
		

		html += '</div>';
		// FMV 75% benchmarkAttach start here

		html += '<div class="pageBorder" id="">';
		// FMV 75% benchmark Attach start here
		html += '<div class="row site-box">';
			html += '<div class="col-xs-12 col-sm-12 col-lg-12" >';
				html += '<span class="optionValTile">FMV 75% BENCHMARK</span>';

				html += '<input class="floatRight banchmarkText inputDes" type="text" id="" value="" placeholder=""  onkeypress="return isNumberKey(event)">';

				html += '<div class="dropdown currencyDropdown" id="">';
					html += '<select class="selectpicker currencyDoller currencyType" id="" name="selValue" style="display: none;">';	
					for (i = 0; i < currencyResult.json_data.response.length; i++) {/* display: none; */	  
						html += '<option data-subtext="" value="' + currencyResult.json_data.response[i].short_code + '">' + currencyResult.json_data.response[i].short_code + '</option>';	
					}		 	 
					html += '</select>';
				html += '</div>';

			html += '</div>';
		html += '</div>';
		// FMV 75% benchmark Attach end here

		// Percent over FMV benchmark Attach start here
		html += '<div class="row site-box">';
			html += '<div class="col-xs-12 col-sm-12 col-lg-12" >';
			html += '<span class="optionValTile">PERCENT OVER FMV BENCHMARK</span>';
			html += '<input disabled class="floatRight FMVbanchmark' + pageId + ' inputTxt" type="text" id="" value="" placeholder=""  onkeypress="return isNumberKey(event)">';	
			html += '</div>';	
		html += '</div>';
		// Percent over FMV benchmark Attach end here
		
		html += '</div>';

		html += '<div class="pageBorder" id="">';
		//Site justification and negotiation history
		html += '<div class="siteJustification" id="">';
			html += '<p class="studyTitle topMargin text-uppercase">Site justification and negotiation history<em class="required"> *</em></p>';
			html += '<div class="summernote justification"></div>';	
		html += '</div>';
		//Any other details
			html += '<div class="otherDetails" id="">';
				html += '<p class="studyTitle topMargin text-uppercase">Any other details<em class="required"> *</em></p>';
				html += '<div class="summernote details"></div>';	
			html += '</div>';
		html += '</div>';

		
		html += '<div class="pageBorder" id="">';

		// Do you want to add attachment start here
			html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
			html += '<span class="addAttachment">Do you want to add attachment<em class="required"> *</em></span>';
			html += '</div>';
		
			html += '<div class="row previousIssue attachmentBtns">';
				html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
				
				for(i = 0;i<radioBtnTxtArr.length;i++){
					html += '<div class="form-check">'
						html += '<label class="radionBtn">'
						html += '<input type="radio" name="attachment" value="'+radioBtnValueArr[i]+'"> <span class="label-text attachmentRTxt'+i+'">'+radioBtnTxtArr[i]+'</span>'
						html += '</label>'
					html += '</div>'
				}

				html += '<form >';
					html += '<div class="choosefile" style="display:none;">';
						html += '<div class="row addFile">';
						html += '</div>';
						html += '<div class="addBtn">';
						html += '</div>';
					html += '</div>';
				html += '</form>';
					
				html += '</div>';
			html += '</div>';
		// Do you want to add attachment end here

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
			html += '<span class="priority">Do you want to add any other issue <em class="required"> *</em></span>';
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

	// Site initial and Percentage logic here
	setInterval(function () {
		var setVal = (($('#formType' + pageId + ' .siteRText').val() - $('#formType' + pageId + ' .initialText').val()) / $('#formType' + pageId + ' .initialText').val()) * 100;
		
		var setValFMV = (($('#formType' + pageId + ' .siteRText').val() - $('#formType' + pageId + ' .banchmarkText').val()) / $('#formType' + pageId + ' .siteRText').val()) * 100;
		var num;
		var new_num;
		if ($('#formType' + pageId + ' .initialText').val() !=  '' && $('#formType' + pageId + ' .siteRText').val() !=  '') {
			num = parseFloat(setVal);
			new_num = num.toFixed(2);
			var setReq = new_num + "%";
			$('#formType' + pageId + ' .initialPercent' + pageId).val('');

			$('#formType' + pageId + ' .initialPercent' + pageId).val(setReq);
		}
		else {
			$('#formType' + pageId + ' .initialPercent' + pageId).val('');
		}
		if ($('#formType' + pageId + ' .siteRText').val() !=  '' && $('#formType' + pageId + ' .banchmarkText').val() !=  '') {
			num = parseFloat(setValFMV);
			new_num = num.toFixed(2);
			var fmv = new_num + "%";
			$('#formType' + pageId + ' .FMVbanchmark' + pageId).val('');
			$('#formType' + pageId + ' .FMVbanchmark' + pageId).val(fmv);
		}
		else {
			$('#formType' + pageId + ' .FMVbanchmark' + pageId).val('');
		}
	}, 1000);

	pageResize();
	// Disable copy paste in input fields		
		$('.siteRText').bind("cut copy paste", function (e) {
			e.preventDefault();
		});
		$('.initialText').bind("cut copy paste", function (e) {
			e.preventDefault();
		});
		$('.initialPercent').bind("cut copy paste", function (e) {
			e.preventDefault();
		});
		$('.banchmarkText').bind("cut copy paste", function (e) {
			e.preventDefault();
		});
		$('.FMVbanchmark').bind("cut copy paste", function (e) {
			e.preventDefault();
		});
		
		//Form common value
		commonFormValidation(result, currencyResult, viewCroResult,resultIssueType, pageId);
		
		//Was this issue previously raised in the app radio clicl event
		commonRadionClickEvent(result, currencyResult, viewCroResult,resultIssueType, pageId)

		yesNoRadioBtnFun(result, currencyResult, viewCroResult,resultIssueType, pageId);
		/*****Submite Button function call start here*****/
		submiteButtons(result, currencyResult, viewCroResult,resultIssueType, pageId);
		/*****Submite Button function call end here*****/
}
function studyDetails(result, currencyResult, viewCroResult,resultIssueType, pageId){
	var i;
	    var html= '<p class="studyTitle">ENTER STUDY DETAILS</p>';
		html += '<div class="row dropBoxClass">';
				for (var h = 0; h < studyDetailArr.length; h++) {
					
					if (h != 7) {
						if(h == 6){
						html += '<div class="col-xs-12 col-sm-12 col-lg-12 selectContainer ' + studyDetailClassArr[h] + '" id="">';  
						html += '<span class="optionVal ccLebal ccTag">' + studyDetailArr[h] + '</span>';
						}
						else{
							html += '<div class="col-xs-6 col-sm-6 col-lg-6 selectContainer ' + studyDetailClassArr[h] + '" id="">';  
							html += '<span class="optionVal">' + studyDetailArr[h] + ' <em class="required"> *</em></span>';
						}          
						
						if (pageId ==  0) {				
							if (h < 3) {					
								html += '<div class="dropdown mainDropDownBg" id="' + dropDownIdArr[h] + '">';
								
								html += '<select class="selectpicker ' + selectClassArr[h] + '" id="' + selectIdArr[h] + '" name="selValue" data-show-subtext="true" data-live-search="true" style="display: none;">';
								html += '<option data-subtext="" value="" hidden>' + defultTitleArr[h] + '</option>';
								if (h == 2) {
									for (i = 0; i < result.json_data.response.length; i++) {
										var setIVal = i + 1;
										if (result.json_data.response[i].country_name == 'Argentina') {
											html += '<option data-subtext="" value="' + setIVal + '" style="border-top: 1px solid #000;">' + result.json_data.response[i].country_name + '</option>';
										}
										else {
											html += '<option data-subtext="" value="' + setIVal + '">' + result.json_data.response[i].country_name + '</option>';
										}
									}
								}

								html += '</select>';

								html += '</div>';
							}
							else {
								if (h == 6) {
									html += '<input type="email" id="emailValidation" class="' + selectClassArr[h] + '" value="" placeholder="" style="font-size: 15px;">';
								}
								else {
									html += '<input type="text" class="' + selectClassArr[h] + '" value="" placeholder="' + defultTitleArr[h] + '" style="font-size: 15px;">';
								}
							}
						}
						else {			
						
							html += '<input type="text" class="' + selectClassArr[h] + '" value="' + window.localStorage.getItem(localStorageArr[h]) + '" placeholder="" disabled>';
						}
						html += '</div>';
					}
					else {
						// Was this issue previously raised in the app and if so, should this be directed to specific Takeda Contract manager start here
						html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
						html += '<span class="issueRaised">' + studyDetailArr[h] + '<em class="required"> *</em></span>';
						html += '</div>';

						html += '<div class="row previousIssue">';
						html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
					
						if (pageId == 0) {
							for(var i=0;i<radioBtnTxtArr.length;i++){
								html += '<div class="form-check">'
									html += '<label class="radionBtn">'
									 html += '<input type="radio" name="raised" value="'+radioBtnValueArr[i]+'"> <span class="label-text previousRaisedTxt'+i+'">'+radioBtnTxtArr[i]+'</span>'
									html += '</label>'
							    html += '</div>'
							}
						}
						else{
							
							html += '<div class="addRadioFollowUp' + pageId + '" id="">';
								html += '<div class="attachRadioFollowUp" id="">';
								for(var i=0;i<radioBtnTxtArr.length;i++)
								{
									html += '<div class="form-check">'
									html += '<label class="radionBtn">'						 
									if (window.localStorage.getItem(localStorageArr[h]) == i) {
										html += '<input type="radio" name="raised" value="'+radioBtnValueArr[i]+'" checked> <span class="label-text previousRaisedTxt'+i+'">'+radioBtnTxtArr[i]+'</span>'
									}
									else{
										html += '<input type="radio" name="raised" value="'+radioBtnValueArr[i]+'" disabled> <span class="label-text previousRaisedTxt'+i+'">'+radioBtnTxtArr[i]+'</span>'
									}
									html += '</label>'
									html += '</div>'
								}

								html += '</div>';
							html += '</div>';

							if (window.localStorage.getItem("followUpVal") !=  '') {
								html += '<div class="row escalationFollowUpMain" id="">';
									html += '<div class="col-xs-4 col-sm-4 col-lg-4 text-left" id="">';
									html += '<input type="text" class="escalationFollowUp" value="' + window.localStorage.getItem('followUpVal') + '" placeholder="" disabled>';
									html += '</div>';
								html += '</div>';
							}
						}

						html += '</div>';
						html += '</div>';
						// Was this issue previously raised in the app and if so, should this be directed to specific Takeda Contract manager end here
					}
					
				}
				html += '</div>';	
	$('.studyDetail'+pageId).append(html)
}
function issueTypeAttach(result, currencyResult, viewCroResult,resultIssueType, pageId){

	$('.issueOption'+pageId+' p').remove();
	$('.issueOption'+pageId+' .row').remove();
	var html = '<p class="studyTitle topMargin">CHOOSE AN ISSUE TYPE<em class="required"> *</em></p>';
	 for (var j = 0; j < resultIssueType.json_data.message.length; j++) {
		
		if(resultIssueType.json_data.message[j].form_id == 2){
			if(resultIssueType.json_data.message[j].type == "CTA"){		
				html += '<div class="row issueTypes">';
					html += '<div class="col-xs-12 col-sm-12 col-lg-12 issueTypeRow" id="">';
						html += '<div class="form-check">';
							html += '<label class="radionBtn">';
								html += '<input type="radio" name="issueTypeRadio" value="'+resultIssueType.json_data.message[j].id+'"> <span id="issueTypeTxt'+j+'" class="label-text">'+resultIssueType.json_data.message[j].issue+'</span>'
							html += '</label>';
						html += '</div>';
					html += '</div>';
				html += '</div>';
			}
		}
		 else{
			html += '<div class="row issueTypes">';
			html += '<div class="col-xs-12 col-sm-12 col-lg-12 issueTypeRow" id="">';
				html += '<div class="form-check">'
					html += '<label class="radionBtn">'
						html += '<input type="radio" name="issueTypeRadio" value="'+resultIssueType.json_data.message[j].id+'"> <span id="issueTypeTxt'+j+'" class="label-text">'+resultIssueType.json_data.message[j].issue+'</span>'
					html += '</label>'
				html += '</div>'
			html += '</div>';
		html += '</div>';
		} 				
	}

	$('.issueOption'+pageId).append(html);

	//Issue type radio buttons click event
	$('#formType' + pageId + ' .issueTypes .radionBtn input[type=radio]').on('change', function () {		
		radioButtons = $('#formType' + pageId + ' .issueTypes .radionBtn input:radio[name="issueTypeRadio"]');
		
		index = radioButtons.index(radioButtons.filter(':checked'));
		var issueType = $('#formType' + pageId + ' .issueTypes .radionBtn #issueTypeTxt'+index).text();
		
		if (index == 13) {
			var msg = "If any revisions to Subject Injury language are approved by Takeda, please check ICF for consistency with revised language.";
			alertScreen(msg,"");
		}
		window.localStorage.setItem("issueType", issueType);
		for (l = 0; l < resultIssueType.json_data.message.length; l++) {
			$('#formType' + pageId + ' .issueTypes .radionBtn #issueTypeTxt' + l).css("color", "#333");
		}
		
		$('#formType' + pageId + ' .issueTypes .radionBtn #issueTypeTxt' + index).css("color", "#4c9bcf");
	});
}
function commonRadionClickEvent(result, currencyResult, viewCroResult,resultIssueType, pageId){
	var radioButtons;
	var getPageId = pageId;
	
	//Was this issue previously raised in the app radio button click event
	$('#formType' + pageId + ' .dropBoxClass .radionBtn input[type=radio]').on('change', function () {
		radioButtons = $('#formType' + pageId + ' .dropBoxClass .radionBtn input:radio[name="raised"]');
        index = radioButtons.index(radioButtons.filter(':checked'));
		
		window.localStorage.setItem("escalationRadio", index);

		if (index == 0) {
			adddropDownFollowUp(pageId);
		}
		else {
			window.localStorage.setItem("followUpId", '');
			window.localStorage.setItem("followUpVal", '');
			$('#formType' + pageId + ' .dropBoxClass .followUpDropDown').css("display", "none");
		}
		for (var l = 0; l < radioBtnTxtArr.length; l++) {
			$('#formType' + pageId + ' .dropBoxClass .previousRaisedTxt' + l).css("color", "#333");
		}

		$('#formType' + pageId + ' .dropBoxClass .previousRaisedTxt' + index).css("color", "#4c9bcf");
	});

	//Is this request of High Priority i.e response needed within 48 hours or less radio button click event
	window.localStorage.setItem("highPriority", 1);
	$('#formType' + pageId + ' .priorityType .radionBtn input[type=radio]').on('change', function () {		
		radioButtons = $('#formType' + pageId + ' .priorityType .radionBtn input:radio[name="priority"]');
		index = radioButtons.index(radioButtons.filter(':checked'));

		window.localStorage.setItem("highPriority", index);

		if (index == 0) {
			callToChoosePriority(pageId);
		}
		else {
			$('#formType' + pageId + ' .choosePriority .choosePriorityTxt').remove();
		}

		for (l = 0; l < radioBtnTxtArr.length; l++) {
			$('#formType' + pageId + ' .priorityType .priorityTypeTxt' + l).css("color", "#333");
		}

		$('#formType' + pageId + ' .priorityType .priorityTypeTxt' + index).css("color", "#4c9bcf");
	});

	//Do you want to add any other issue radion button click event
	$('#formType' + getPageId + ' .addOtherIssue .radionBtn input[type=radio]').on('change', function () {		
		radioButtons = $('#formType' + getPageId + ' .addOtherIssue .radionBtn input:radio[name="otherIssue"]');
		index = radioButtons.index(radioButtons.filter(':checked'));				
		
		window.localStorage.setItem("yesIssue", index);
		for (l = 0; l < radioBtnTxtArr.length; l++) {
			$('#formType' + pageId + ' .addOtherIssue .otherIssueTxt' + l).css("color", "#333");
		}

		$('#formType' + pageId + ' .addOtherIssue .otherIssueTxt' + index).css("color", "#4c9bcf");			
		if($('#formType' + pageId + ' .addOtherIssue .radionBtn input:radio[name="otherIssue"]:checked').val() == 0){
			window.localStorage.setItem("nextBtn", "");
			if(resultIssueType.json_data.message[0].form_id == 1){
			    formValidations(result, currencyResult, viewCroResult,resultIssueType, pageId);
			}
			else{
				contractFormValidations(result, currencyResult, viewCroResult,resultIssueType, pageId,"radioBtn");	
			}
		}
		else{
			$('#subBtn').css("display", "block");
			removeNextForm(result, currencyResult, viewCroResult,resultIssueType, pageId)
		}
	});
	
}
function commonFormValidation(result, currencyResult, viewCroResult,resultIssueType, pageId){
	//Study details container attach
	studyDetails(result, currencyResult, viewCroResult,resultIssueType, pageId);
	
	//Issue type container attach
	issueTypeAttach(result, currencyResult, viewCroResult,resultIssueType, pageId)

	$('.summernote').summernote({
		height: 115,
		tabsize: 2
	});

	// Disable copy paste in input fields
	$('.selectRaisedBy').bind("cut copy paste", function (e) {
		e.preventDefault();
	});
	$('.selectPrincipal').bind("cut copy paste", function (e) {
		e.preventDefault();
	});
	$('.selectRequested').bind("cut copy paste", function (e) {
		e.preventDefault();
	});	

	//CC Email validate function
	emailValidate();
	
	//Protocol Site and Country Drop down default set here	
	if (pageId == 0) {
		window.localStorage.setItem("followUpId", '');
		window.localStorage.setItem("followUpVal", '');

		if ($('#formType' + pageId + ' .selectProtocol').find("option:selected").text() == "Enter Protocol") {
			$('select[name=selValue]').val(0);
			$('.selectpicker').selectpicker('refresh');
			$('.btn-group bootstrap-select').css("width", 100 + "%");
		}
	}
	else {
		var removeActive = pageId - 1;		
		$('#formType' + removeActive).removeClass("active");
	}

	//Carousel Page active first 	
	$('#formType' + pageId).addClass("active");

	if (result.json_data.response.length >= 10) {
		$('#chooseCountry ul').css("height", 175);
		$('#chooseCountry ul').css("overflow", "auto");
	}
	else {
		$('#chooseCountry ul').css("height", "auto");
	}

	/*****Choose Country click event start here*****/
	$('#chooseCountry ul li:first-child').remove();
	$('#chooseCountry li').click(function (e) {
		var index = $(this).index();		
			var idCountry = result.json_data.response[index].country_id;
			var countryName = result.json_data.response[index].country_name;
			
			window.localStorage.setItem("selectCountry", idCountry);
			window.localStorage.setItem("countryName", countryName);		
	});
	/*****Choose Country click event end here*****/
	
	/*****Load Protocol list according to input value start here*****/	
	$('.selectProtocol ul.selectpicker li').remove();
	$('.selectProtocol input').keyup(function (e) {
		listProtocolsFun();
	});
	/*****Load Protocol list according to input value end here*****/

	/*****Load Site list according to input value start here*****/	
	$('.selectSite ul.selectpicker li').remove();
	$('.selectSite input').keyup(function (e) {
		var selectSiteVal = $('.selectSite input').val();		
		listSitenameFun();		
	});
	/*****Load Site list according to input value end here*****/

	//Currency dropdown height set and scroll bar
	if(currencyResult.json_data.response.length >=10)
	{
		$('.site-box ul').css("height", 175);
		$('.site-box ul').css("overflow", "auto");
	}
	else{
		$('.site-box ul').css("height", "auto");
	}

	$(".currencyDropdown .selectpicker").val('USD').selectpicker('refresh');
	// Curreny dropdown click event start here
		$('.currencyDropdown li').click(function (e) {					
			var index = $(this).index();
			var idCurrency = currencyResult.json_data.response[index].short_code;
			
			$('#formType' + pageId + ' .currencyDropdown select[name=selValue]').selectpicker('val', idCurrency);
			window.localStorage.setItem("currencySelect", idCurrency);						
		});
	// Curreny dropdown click event end here

}

function emailValidate(){
	//token field for multiple email inputs 
	$('#emailValidation')
	  .on('tokenfield:createtoken', function (e) {
		var data = e.attrs.value.split('|')
		
		e.attrs.value = data[1] || data[0]
		e.attrs.label = data[1] ? data[0] + ' (' + data[1] + ')' : data[0]
	  })
	
	  .on('tokenfield:createdtoken', function (e) {
		// Über-simplistic e-mail validation
		var re = /\S+@\S+\.\S+/
		var valid = re.test(e.attrs.value)
		
		if (!valid) {
			alertScreen("Please enter valid email id.","")
			$(e.relatedTarget).empty().hide().removeData();
			//$('.token-input').val('');
		}
	  })
	
	  .on('tokenfield:edittoken', function (e) {
		
		if (e.attrs.label !== e.attrs.value) {
		  var label = e.attrs.label.split(' (')
		  e.attrs.value = label[0] + '|' + e.attrs.value
		}
	  })
	  .tokenfield()	
}
function submiteButtons(result, currencyResult, viewCroResult,resultIssueType, getPageId) {
	$('.arrowBtn .row').remove();
	var html = '<div class="row formBtns">';
	html += '<div class="col-xs-4 col-sm-4 col-lg-4 text-left">';
	 html += '<span  class="btn" id="backBtn" style="display:none;">Back</span>';
	html += '</div> ';

	html += '<div class="col-xs-4 col-sm-4 col-lg-4 text-center">';
	 html += '<span href="#" class="btn saveForm" id="subBtn">Submit</span>'	
	html += '</div>';

	html += '<div class="col-xs-4 col-sm-4 col-lg-4 text-right">';
	 html += '<span href="#" class="btn" id="nextBtn" style="display:none;">Next</span>'	
	html += '</div>';

	html += '</div>';
	$('.arrowBtn').append(html);

	$('#nextButton').css("opacity", 0.5);
	
	$('.saveForm').click(function (e) {		
		$('html').css('overflow', 'hidden');
		
		if($('#formType' + getPageId + ' .addOtherIssue .radionBtn input:radio[name="otherIssue"]:checked').val() != undefined){
			if(resultIssueType.json_data.message[0].form_id == 1){
				//call in js/budgetForm.js
				saveBudgetForm(result, currencyResult, viewCroResult,resultIssueType, getPageId);
			}
			else{
				//call in js/contractForm.js
				saveContractForm(result, currencyResult, viewCroResult,resultIssueType, getPageId);
			}
			$(window).scrollTop(0);
		}else{
			alertScreen("Please select radio option do you want to add any other issue.",'')
		}
		
	});

	if (getPageId > 0) {
		$('#backBtn').css("display", "block");
		$('#subBtn').css("display", "none");
		$('#nextBtn').css("display", "inline-block");		
	}
	else if (getPageId == 0) {
	   
		if (pageNoLength.length != 0) {
			$('#nextBtn').css("display", "inline-block");
		//	if (yesIssue == 0 || yesIssueEM == 0) {
			//$('#subBtn').css("display", "block");
	    // 	}
		}
		else {
		}
		$('#backBtn').css("display", "none");
		$('#subBtn').css("display", "none");
	}
	
	for (var j = 0; j < pageNoLength.length; j++) {
	   if (pageNoLength.length - 1 == getPageId) {
		   $('#nextBtn').css("display", "none");
		   $('#subBtn').css("display", "block");
	   }
   }

	/*****Back button click event start here*****/
	$('#backBtn').click(function (e) {
		var backId = parseInt(getPageId) - 1;

		submiteButtons(result, currencyResult, viewCroResult,resultIssueType, backId);

		var removeActive = getPageId;
		$('#formType' + removeActive).removeClass("active");
		$('#formType' + backId).addClass("active");
		if (backId == 0) {
			if (window.localStorage.getItem("followUpVal") !=  '') {
				$('#inputStudyDetail .dropBoxClass .followUpDropDown').css("display", "block");
			}
		}
		$(window).scrollTop(0);
	});
	/*****Back button click event end here*****/
	
	/*****Next button click event start here*****/
	$('#nextBtn').click(function (e) {		
		window.localStorage.setItem("nextBtn", "nextBtnClick");		
		if(resultIssueType.json_data.message[0].form_id == 1){
		    formValidations(result, currencyResult, viewCroResult,resultIssueType, getPageId);
		}
		else{
			contractFormValidations(result, currencyResult, viewCroResult,resultIssueType, getPageId,"nextBtn");
		}
	});
	/*****Next button click event end here*****/
	
}
function saveBudgetForm(result, currencyResult, viewCroResult,resultIssueType, getPageId){
	formValidations(result, currencyResult, viewCroResult,resultIssueType, getPageId);
}
/*****Yes/No button select and unselect functionality start here*****/
function yesNoRadioBtnFun(result, currencyResult, viewCroResult,resultIssueType, pageId) {
	var getPageId = pageId;	
	var radioButtons;
	var index;
	var l;
	
	$('#formType' + getPageId + ' .attachmentBtns .radionBtn input[type=radio]').on('change', function () {
		radioButtons = $('#formType' + getPageId + ' .attachmentBtns .radionBtn input:radio[name="attachment"]');
		index = radioButtons.index(radioButtons.filter(':checked'));		
				
		if (index == 0) {
			$('#formType' + getPageId + ' .choosefile').css("display", "block");
			attachImages(getPageId);
		}
		else {			
			$('#formType' + getPageId + ' .choosefile').css("display", "none");
			$('#formType' + getPageId + ' .addBtn .imgRemoveDiv').remove();
		}
		
		for (l = 0; l < radioBtnTxtArr.length; l++) {
			$('#formType' + getPageId + ' .attachmentBtns .attachmentRTxt' + l).css("color", "#333");
		}

		$('#formType' + getPageId + ' .attachmentBtns .attachmentRTxt' + index).css("color", "#4c9bcf");
	});	
}
function removeNextForm(result, currencyResult, viewCroResult,resultIssueType, getPageId){
	$('#subBtn').css("visibility", "show");
	var setPageIdNo = getPageId;

	var removePageArr = new Array();

	if (pageNoLength.length - 1 != setPageIdNo) {
		
		if (pageNoLength.length != 1) {
			for (var i = 0; i < pageNoLength.length; i++) {

				if (getPageId < pageNoLength[i]) {
					var removeItem = pageNoLength[i];

					removePageArr.push(removeItem);
					$('#formType' + pageNoLength[i]).remove();
				}

				if (i == pageNoLength.length - 1) {
					for (var k = 0; k < removePageArr.length; k++) {
						for (var j = 0; j < pageNoLength.length; j++) {
							if (removePageArr[k] == pageNoLength[j]) {
								pageNoLength.splice($.inArray(pageNoLength[j], pageNoLength), 1);

								if (pageNoLength.length == 1) {
									getPageId = 0;
								}
								else {
									getPageId = parseInt(getPageId) - 1;
								}

							}
							else {
								getPageId = parseInt(pageNoLength[j]) + 1;
								$('#nextBtn').css("display", "none");
							}
						}
					}
				}
			}
		}
	}
}
function otherIssueUnchecked(getPageId){
	var radioBtnTxtArr = new Array("Yes","No");
	for (l = 0; l < radioBtnTxtArr.length; l++) {
		$('#formType' + getPageId + ' .addOtherIssue .otherIssueTxt' + l).css("color", "#333");
	}
	$('#formType' + getPageId + ' .addOtherIssue .radionBtn input[type=radio]').prop('checked', false);
}
//Do you want to add any other issue radion button refresh
function radioRefresh(getPageId){	
	if($('#nextBtn').css("display") == "none"){
		var radioButtons = $('#formType' + getPageId + ' .addOtherIssue .radionBtn input:radio[name="otherIssue"]');		
		var index = radioButtons.filter('[value=0]').prop('checked', false)
		for (l = 0; l < radioBtnTxtArr.length; l++) {
			$('#formType' + getPageId + ' .addOtherIssue .otherIssueTxt' + l).css("color", "#333");
		}
	}	
}

function formValidations(result, currencyResult, viewCroResult,resultIssueType, getPageId){
	window.localStorage.setItem("selectRaisedBy", $('.selectRaisedBy').val());
	window.localStorage.setItem("selectPrincipal", $('.selectPrincipal').val());
	window.localStorage.setItem("selectRequested", $('.selectRequested').val());
	
	var msg = "Please complete form first";
	
	if ($('#formType' + getPageId + ' .selectProtocol').find("option:selected").text() !== "Enter Protocol" && $('#formType' + getPageId + ' .selectSite').find("option:selected").text() !== "Enter Site" && $('#formType' + getPageId + ' .selectCountry').find("option:selected").text() !== "Select Country") {
		if ($('#formType' + getPageId + ' .dropBoxClass .radionBtn input:radio[name="raised"]').is(":checked") !==  false && $('#formType' + getPageId + ' .issueTypes .radionBtn input:radio[name="issueTypeRadio"]').is(":checked") !==  false && $('#formType' + getPageId + ' .attachmentBtns .radionBtn input:radio[name="attachment"]').is(":checked") !==  false && $('#formType' + getPageId + ' .priorityType .radionBtn input:radio[name="priority"]').is(":checked") !==  false) {
			
			//Was this issue previously raised in the app selected Yes start
			if($('#formType' + getPageId + ' .dropBoxClass .radionBtn input:radio[name="raised"]:checked').val() == 1)
			{
				if($('#formType' + getPageId + ' .selectUserType').find("option:selected").text() !== "Select User"){
					raisedBtnValidations(result, currencyResult, viewCroResult,resultIssueType, getPageId)
				}
				else{
					//Do you want to add any other issue radion button refresh
                    radioRefresh(getPageId)
					otherIssueUnchecked(getPageId);
					alertScreen(msg,'');
				}
			}
			else{
				raisedBtnValidations(result, currencyResult, viewCroResult,resultIssueType, getPageId)
			}	
			//Was this issue previously raised in the app selected Yes end			
		}
		else{
			otherIssueUnchecked(getPageId);
			alertScreen("Please select radio option first",'')
		}
	}
	else{
		//Do you want to add any other issue radion button refresh
		radioRefresh(getPageId);
		otherIssueUnchecked(getPageId)
		alertScreen(msg,'')
	}
}
function raisedBtnValidations(result, currencyResult, viewCroResult,resultIssueType, getPageId){
	var msg = "Please complete form first";
	if ($('#formType' + getPageId + ' .descriptionIssue .note-editable').text() !==  '' && $('#formType' + getPageId + ' .siteJustification .note-editable').text() !==  '' && $('#formType' + getPageId + ' .otherDetails .note-editable').text() !==  '' && $('#formType' + getPageId + ' .selectRaisedBy').val() !==  '' && $('#formType' + getPageId + ' .selectPrincipal').val() !==  '' && $('#formType' + getPageId + ' .selectRequested').val() !==  '') 
	{
		//Attachment Validations start here
		if($('#formType' + getPageId + ' .attachmentBtns .radionBtn input:radio[name="attachment"]:checked').val() == 1){
			if($('#formType' + getPageId + ' .previewimgSize').length !== 0 || $('#formType' + getPageId + ' .addText').length !== 0){
				highUgentValidation(result, currencyResult, viewCroResult,resultIssueType, getPageId)
			}
			else{
				alertScreen("Please attach file or image first",'')
			}
		}
		else{
			highUgentValidation(result, currencyResult, viewCroResult,resultIssueType, getPageId)
		}
       //Attachment Validations end here
	}
	else{
		//Do you want to add any other issue radion button refresh
		radioRefresh(getPageId)
		
		alertScreen(msg,'')
	}
}
function highUgentValidation(result, currencyResult, viewCroResult,resultIssueType, getPageId){
	if($('#formType' + getPageId + ' .priorityType .radionBtn input:radio[name="priority"]:checked').val() == 1){
		if ($('#formType' + getPageId + ' .choosePriorityTxt .radionBtn input:radio[name="highUrgent"]').is(":checked") !=  false)
		{
			if ($('#formType' + getPageId + ' #reasonPriorityDiv' + getPageId + ' .note-editable').text() !=  '') {	
							
				if($('#formType' + getPageId + ' .addOtherIssue .radionBtn input:radio[name="otherIssue"]').is(":checked") ===  false || $('#formType' + getPageId + ' .addOtherIssue .radionBtn input:radio[name="otherIssue"]:checked').val() == 1){
					var setPageId = 0;
					var saveLength;
					saveLength = parseInt(getPageId) + 1;
					saveformType(setPageId, saveLength);
				}else{
					calltoNextForm(result, currencyResult, viewCroResult,resultIssueType, getPageId);
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
			var setPageId = 0;
			var saveLength;
			saveLength = parseInt(getPageId) + 1;
			
			saveformType(setPageId, saveLength);

		}else{
			if($('#formType' + getPageId + ' .addOtherIssue .radionBtn input:radio[name="otherIssue"]:checked').val() == 1){
				var setPageId = 0;
				var saveLength;
				saveLength = parseInt(getPageId) + 1;
				
				saveformType(setPageId, saveLength);
			}
			else{
				calltoNextForm(result, currencyResult, viewCroResult,resultIssueType, getPageId);
			}			
		}	
	}	
}
function saveformType(setPageId, saveLength){
	
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
	
	// Attachment
	var attachedArr = [];
	
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
	// Issue types radio buttons
	var issueType = $('#formType' + setPageId + ' .issueTypes .radionBtn input:radio[name="issueTypeRadio"]:checked').val();	
	
     /*Form number*/ 
	var formNumber = window.localStorage.getItem("formNumber")	
	var listEscalation = window.localStorage.getItem("listEscalation");
	
	var emailObject = $('#emailValidation').tokenfield('getTokensList');
	
	if ($("#emailValidation-tokenfield").val() !=  '') {		
		if (ValidateEmail($("#emailValidation-tokenfield").val())) {
			if(emailObject == ''){
				emailObject = $("#emailValidation-tokenfield").val();
			}else{
				emailObject = emailObject + "; " + $("#emailValidation-tokenfield").val();
			}						
		}else{			
		}
	}
	emailObject = emailObject.replace(/,/g , ';')
	
	var user_id = window.localStorage.getItem("user_id");
		
	var token_id = window.localStorage.getItem("token_id");
    
	loaderLogin();
	$.ajax({
		url: serviceHTTPPath + "saveBudgetEscalation",
		type: "POST",
		dataType: 'json',
		headers: {
            "authorization": token_id
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
			choose_issue: issueType,
			desc_issue: $('#formType' + setPageId + ' .descriptionIssue .note-editable').html(),
			site_request: $('#formType' + setPageId + ' .siteRText').val(),
			initial_offer: $('#formType' + setPageId + ' .initialText').val(),	
			percent_over_initial: $('#formType' + setPageId + ' .initialPercent' + setPageId).val(),
			fmv_high: $('#formType' + setPageId + ' .banchmarkText').val(),
			percent_over_fmv: $('#formType' + setPageId + ' .FMVbanchmark' + setPageId).val(),
			site_justification: $('#formType' + setPageId + ' .siteJustification .note-editable').html(),
			anyother_details: $('#formType' + setPageId + ' .otherDetails .note-editable').html(),
			do_add_attachment: $('#formType' + setPageId + ' .attachmentBtns .radionBtn input:radio[name="attachment"]:checked').val(),
			attachment_file_ids: arrAttachIds,
			request_id: formNumber,
			currency_type:$('#formType' + setPageId + ' .currencyDoller').find("option:selected").text(),
			highPriority: $('#formType' + setPageId + ' .priorityType .radionBtn input:radio[name="priority"]:checked').val(),
			selectPriority: $('#formType' + setPageId + ' .choosePriorityTxt .radionBtn input:radio[name="highUrgent"]:checked').val(),
			priorityReason: $('#formType' + setPageId + ' #reasonPriorityDiv' + setPageId + ' .note-editable').text(),	
			cc_email: emailObject
		},
		success: function (result) {
			//alert("success=" + JSON.stringify(result))
			loaderRemoveFun();
			var msg = result.json_data.message;

			if (result.json_data.response == 1) {
				window.localStorage.setItem("formNumber", result.json_data.request_id);
				if (setPageId == saveLength - 1) {
					var href= "croDashboard.html";
					alertScreen(msg, href);
				}
				else {
					setPageId = parseInt(setPageId) + 1;
					saveformType(setPageId, saveLength);
				}
			}
			else {
				alertScreen(msg,'');
			}

		},
		error: function (e) {
			return;
		}
	});
}
function calltoNextForm(result, currencyResult, viewCroResult,resultIssueType, getPageId){
	
	var emailObject = $('#emailValidation').tokenfield('getTokensList');
	window.localStorage.setItem("selectCC", emailObject);
	
	var nextId =parseInt(getPageId) + 1;	
	if(window.localStorage.getItem("nextBtn") == ""){
	 //Create next form
	 pageNoLength.push(nextId);		
	 attachBudgetForm(result, currencyResult, viewCroResult,resultIssueType, nextId)
	}
	else{
		//Next button click for next form
		submiteButtons(result, currencyResult, viewCroResult,resultIssueType, nextId);
		$('#formType' + getPageId).removeClass("active");
	    $('#formType' + nextId).addClass("active");
	}	
	$(window).scrollTop(0);
}
/*****Yes/No button select and unselect functionality end here*****/
function adddropDownFollowUp(getPageId) {
	loaderLogin();
	$.ajax({
		url: serviceHTTPPath + "userManagement",
		type: "POST",
		headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
		data: {
			role_id: 2
		},
		dataType: 'json',
		success: function (result) {
			//alert("success="+JSON.stringify(result))
			loaderRemoveFun();
			addFolloupManager(result, getPageId);
		},
		error: function (e) {
			loaderRemoveFun();
			return;
		}
	});			
}

//Was this issue previously raised in the app dropdown add here
function addFolloupManager(result, getPageId) {
	$('#formType' + getPageId + ' #inputStudyDetail .dropBoxClass .followUpDropDown').remove();
	var html = '<div class="row followUpDropDown" id="followUpDropDown' + getPageId + '">';
	html += '<div class="col-xs-4 col-sm-4 col-lg-4" >';

	html += '<div class="dropdown" id="">';
					
		html += '<select class="selectpicker selectUserType" id="" name="selValue" data-show-subtext="true" style="display: none;">';		
		html += '<option data-subtext="" value="">Select User</option>';
		if (result.json_data.response.length !=  undefined) {
			for (var j = 0; j < result.json_data.response.length; j++) {
				if (result.json_data.response[j].is_active == 1 && result.json_data.response[j].is_enabled == 1) {
					if (window.localStorage.getItem('selectUserId') != result.json_data.response[j].user_id) {
						if (result.json_data.response[j].first_name !==  null && result.json_data.response[j].first_name !== 0) {
							if (result.json_data.response[j].last_name !==  null && result.json_data.response[j].last_name !== 0) {
								html += '<option id="'+result.json_data.response[j].user_id+'" value="'+result.json_data.response[j].user_id+'">' + result.json_data.response[j].first_name + " " + result.json_data.response[j].last_name + '</option>';
							}
							else{
								html += '<option id="'+result.json_data.response[j].user_id+'" value="'+result.json_data.response[j].user_id+'">' + result.json_data.response[j].first_name+ '</option>';
							}
						}
						else{
							if (result.json_data.response[j].last_name !==  null && result.json_data.response[j].last_name !== 0) {
								html += '<option id="'+result.json_data.response[j].user_id+'" value="' + result.json_data.response[j].user_id+ '">' + result.json_data.response[j].last_name+ '</option>';
							}
						}
					}
				}
			}
		}
		html += '</select>';

	html += '</div>';
		
	html += '</div>';
	html += '</div>';
	$('#formType' + getPageId + ' #inputStudyDetail .dropBoxClass').append(html);

	$('.selectpicker').selectpicker('refresh');
	$('.bootstrap-select').css("width", 100 + "%");

	window.localStorage.setItem("followUpId", '');
	window.localStorage.setItem("followUpVal", '');
	
	if (result.json_data.response.length >= 10) {
		$('.followUpDropDown ul').css("height", 175);
		$('.followUpDropDown ul').css("overflow", "auto");
	}
	else {
		$('.followUpDropDown ul').css("height", "auto");
	}

	window.localStorage.setItem("followUpId", '');
	window.localStorage.setItem("followUpVal", '');

	$('.followUpDropDown ul li:first-child').remove();
	

	$('select.selectUserType').on('change', function(e){				
		 var val = $('.selectUserType button span').text();
		 var _id = this.value;	
		 window.localStorage.setItem("followUpId", _id);
		 window.localStorage.setItem("followUpVal", val);
	})
}
//Call Protocol Names Start Here
function listProtocolsFun() {
	
	loaderLogin();
	$.ajax({
		url: serviceHTTPPath + "listProtocols",
		type: "POST",
		dataType: 'json',
		headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
		data: {
			protocol_name: $('.selectProtocol input').val()
		},
		success: function (protocolResult) {
			loaderRemoveFun();
			//alert(JSON.stringify(protocolResult))						
			if (protocolResult.json_data.response.length != 'undefined') {
				$('.selectProtocol ul.selectpicker li').remove();

				$('#selectProtocolId option').remove();
				var html = '';
				var html2 = '';
				for (var i = 0; i < protocolResult.json_data.response.length; i++) {
					html += '<li data-original-index="' + i + '"><a tabindex="0" class="" data-normalized-text="<span class=&quot;text&quot;>' + protocolResult.json_data.response[i].protocol_number + '<small class=&quot;muted text-muted&quot;></small></span>"><span class="text">' + protocolResult.json_data.response[i].protocol_number + '<small class="muted text-muted"></small></span><span class="glyphicon glyphicon-ok check-mark"></span></a></li>';
					html2 += '<option data-subtext="" value="' + i + '">' + protocolResult.json_data.response[i].protocol_number + '</option>';
				}

				$('.selectProtocol ul.selectpicker').append(html);
				$('#selectProtocolId').append(html2);


				if (protocolResult.json_data.response.length >= 10) {
					$('#chooseProtocol ul').css("height", 175);
					$('#chooseProtocol ul').css("overflow", "auto");
				}
				else {
					$('#chooseProtocol ul').css("height", "auto");

				}

				$('#chooseProtocol li').click(function (e) {
					var index = $(this).index();
					var idProtocol = protocolResult.json_data.response[index].protocol_id;
					var protocolNumber = protocolResult.json_data.response[index].protocol_number;
					$('.selectProtocol .filter-option').text(protocolNumber);

					window.localStorage.setItem("selectProtocol", idProtocol);

					window.localStorage.setItem("protocolNumber", protocolNumber);
				});
			}
		},
		error: function (e) {
			loaderRemoveFun();                
			return;
		}

	});
}
//Call Protocol Names End Here

//Call Site Names Start Here
function listSitenameFun() {
	loaderLogin();
	$.ajax({
		url: serviceHTTPPath + "listSitename",
		type: "POST",
		dataType: 'json',
		headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
		data: {
			sitename: $('.selectSite input').val()
		},
		success: function (siteResult) {
			loaderRemoveFun();
			//alert(JSON.stringify(siteResult))	
			if (siteResult.json_data.response.length != 'undefined') {
				$('.selectSite ul.selectpicker li').remove();
				$('#selectSiteId option').remove();
				var html = '';
				var html2 = '';
				for (var i = 0; i < siteResult.json_data.response.length; i++) {
					html += '<li data-original-index="' + i + '"><a tabindex="0" class="" data-normalized-text="<span class=&quot;text&quot;>' + siteResult.json_data.response[i].sitename + '<small class=&quot;muted text-muted&quot;></small></span>"><span class="text">' + siteResult.json_data.response[i].sitename + '<small class="muted text-muted"></small></span><span class="glyphicon glyphicon-ok check-mark"></span></a></li>';
					html2 += '<option data-subtext="" value="' + i + '">' + siteResult.json_data.response[i].sitename + '</option>';
				}

				$('.selectSite ul.selectpicker').append(html);
				$('#selectSiteId').append(html2);

				if (siteResult.json_data.response.length >= 10) {
					$('#chooseSite ul').css("height", 175);
					$('#chooseSite ul').css("overflow", "auto");
				}
				else {
					$('#chooseSite ul').css("height", "auto");
				}

				$('#chooseSite li').click(function (e) {					
					var index = $(this).index();
					var idSite = siteResult.json_data.response[index].sitename_id;
					var siteName = siteResult.json_data.response[index].sitename;
					$('.selectSite .filter-option').text(siteName);

					window.localStorage.setItem("selectSite", idSite);
					window.localStorage.setItem("siteName", siteName);
				});
			}
		},
		error: function (e) {
			loaderRemoveFun();
			return;
		}
	});
}
//Call Site Names End Here

/*****Image upload in the from or not function start here*****/
var abc = 0;
var addId = 0;
var attahmentArr = [];
function attachImages(pageId) {
	addId = $('#formType' + pageId + ' .previewimgSize').length;
	abc = $('#formType' + pageId + ' .previewimgSize').length;

	if (addId == 0) {
		addPlusBtn(addId, pageId, abc);
	}
}
function addPlusBtn(addId, pageId, abc) {
	addImgIDArr = [];

	addId += 1;

    $('#formType' + pageId + ' .addBtn .imgAddIcon' + addId).remove();     

	var html = '<div class="imgRemoveDiv imgAddIcon' + addId + '">';

    html += '<div class="col-xs-12 col-sm-12 col-lg-12 fileMainDiv ' + addId + '" id="" style="margin-bottom: 10px; style="">';      
        html += '<a href="#" class="btn attachTxtdiv popupImg' + addId + '">Attach</a>'
        html += '<div class="filediv fileRemove' + addId + '"><input name="file[]" type="file" class="filelength file' + addId + '" id="fileUpload' + addId + '" style="cursor: pointer;top: 0;position: absolute;width: 64px;height: 33px; opacity: 0.0;overflow: hidden;cursor: pointer;"/><br/></div>';
	html += '</div>';
	 html += '<div class="spaceDiv"></div>';
	html += '</div>';

	$('#formType' + pageId + ' .addBtn').append(html);

	$('#formType' + pageId + ' input:file').change(function (e) {
		if (this.files && this.files[0]) {
			abc += 1;
			
			$('#formType' + pageId + ' .abcd' + abc).remove();
			$('#formType' + pageId + ' .popupImg' + abc).remove();


			var ext = $('#formType' + pageId + ' .file' + abc).val().split('.').pop().toLowerCase();

			var file;
			var name;
			if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
				file = this.files[0];
				name = file.name;
				$(this).before("<div class='abcdSize addText abcd" + abc + "'>" + name + "</div>");
			}
			else {
				file = this.files[0];
				name = file.name;

				$(this).before("<div class='abcdSize previewimgSize abcd" + abc + "'>" + name + "</div> <br/>");
			}

			$(this).hide();
			var html = '<img id="' + abc + '" class="deleteBtn delete' + abc + '" src="../images/delete_btn.png" alt="delete" style="margin-left: 10px;"/>';
			$('#formType' + pageId + ' .abcd' + abc).append(html);

			addPlusBtn(addId, pageId, abc);

			$('#formType' + pageId + ' .deleteBtn').click(function (e) {
				var id = $(this).attr('id');
				$('#formType' + pageId + ' .fileMainDiv' + id).remove();
				$('#formType' + pageId + ' .imgAddIcon' + id).remove();
				$('#formType' + pageId + ' .abcd' + id).remove();

			});

			var file_data = this.files[0];
			var form_data = new FormData();
            form_data.append('file', file_data);
            
            $('#formType' + pageId + ' .fileRemove' + addId+' br').remove(); 

			calltoUploadAttach(form_data, pageId, abc);
		}
	});
}
/*****Image upload in the from or not function end here*****/

/*****Image attach function start here*****/
function calltoUploadAttach(form_data, pageId, abc) {
	$.ajax(
		{
			url: serviceHTTPPath + "uploadAttachment",
            dataType: 'json',
            headers: {
                "authorization": window.localStorage.getItem("token_id")
            },
			cache: false,
			contentType: false,
			processData: false,
			data: form_data,
			type: 'post',
			success: function (resultFile) {
				//alert("success=-"+JSON.stringify(resultFile))				
				addAttachments = resultFile.json_data.attachment_id;

				if ($('#formType' + pageId + ' .previewimgSize').length != 0) {
					$('#formType' + pageId + ' .previewimg' + abc).attr('id', addAttachments);
				}
				if (('#formType' + pageId + ' .addText').length != 0) {
					$('#formType' + pageId + ' .abcd' + abc).attr('id', addAttachments);
				}

				addImgIDArr.push(addAttachments);
			}
		});
}
/*****Image attach function end here*****/

var pageNoLength = new Array();
var addAttachmentsArr = new Array();
var addAttachments = 0;
function isNumberKey(evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57))
		return false;
	return true;
}

//Choose the Priority (High-response needed within 48 hours or Urgent-response needed with 24 hours)
function callToChoosePriority(getPageId) {
	$('#formType' + getPageId + ' .choosePriority .choosePriorityTxt').remove();
	var html = '<div class="row question-bg choosePriorityTxt">';

	html += '<div class="col-xs-12 col-sm-12 col-lg-12 text-right" id="">';
	html += '<p class="question priorityTitle">Choose the Priority</p>';
	html += '</div>';

	html += '<div class="col-xs-12 col-sm-12 col-lg-12 text-right urgentHigh" id="">';
	var prorityArr = new Array("High-response needed within 48 hours", "Urgent-response needed with 24 hours");
	for (var l = 0; l < prorityArr.length; l++) {
		var setVal=l+1;
		html += '<div class="form-check">';
			html += '<label class="radionBtn">';
				html += '<input type="radio" name="highUrgent" value="'+setVal+'"> <span class="label-text addProrityId'+l+'">'+prorityArr[l]+'</span>';
			html += '</label>';
		html += '</div>';
	}
	html += '</div>';

	html += '<div id="reasonPriorityDiv' + getPageId + '" class="reasonPriorityDiv">';

	html += '</div>';
	html += '</div>';
	$('#formType' + getPageId + ' .choosePriority').append(html);

    window.localStorage.setItem("choosePriority", 0);
	 $('#formType' + getPageId + ' .choosePriorityTxt .radionBtn input[type=radio]').on('change', function () {
		var radioButtons = $('#formType' + getPageId + ' .choosePriorityTxt .radionBtn input:radio[name="radio"]');
		var index = radioButtons.index(radioButtons.filter(':checked'));
		window.localStorage.setItem("choosePriority", index);

		$('#formType' + getPageId + ' #reasonPriorityDiv' + getPageId + ' .addReasonDiv').remove();
		var html = '<div class="addReasonDiv">';
		html += '<div class="col-xs-12 col-sm-12 col-lg-12 text-right" id="">';
		html += '<p class="question priorityTitle">Enter the reason for choosing the priority</p>';
		html += '</div>';

		html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="" id="">';
		html += '<textarea class="form-control summernote reasonPriority" placeholder="" id="" onpaste="return false;"></textarea>';
		html += '</div>';
		html += '</div>';

		$('#formType' + getPageId + 
		' #reasonPriorityDiv' + getPageId).append(html);

		$('.summernote').summernote({
			height: 115,
			tabsize: 2
		});

		for (var l = 0; l < prorityArr.length; l++) {
			$('#formType' + getPageId + ' .choosePriorityTxt .radionBtn .addProrityId' + l).css("color", "#333");
		}
		$('#formType' + getPageId + ' .choosePriorityTxt .radionBtn .addProrityId' + index).css("color", "#4c9bcf");
		
	 });
}