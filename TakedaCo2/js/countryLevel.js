function countryLevelICFForm(){
    var hamburgerActive = 1; 
    if(window.localStorage.getItem('userType') != null){   
        hamburgerList(hamburgerActive, window.localStorage.getItem('userType'));
    
        var pageId = 0;
        pageNoLength = [];
        pageNoLength.push(pageId);
        loaderLogin();
        $.ajax({
            url: serviceHTTPPath + 'listCountry',
            type: "GET",
            dataType: 'json',
            headers: {
                "authorization": window.localStorage.getItem("token_id")
            },
            success: function (result) {
                if(result.json_data.response == 4 || result.json_data.response == 5 || result.json_data.response == 6){
                    location.href = "../index.html";
                }else{
                    loaderRemoveFun();
                    countrySiteForm(result,pageId);
                }
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
function countrySiteForm(result,pageId){

    $('#formType' + pageId).remove();
	$('#formType' + pageId + ' .escalationFollowUpMain').remove();
    var i;

    var studyArr = new Array("Protocol Number","Country","CC");
    var studyClassArr = new Array('protocolNumber','country', 'CC'); 
    
    //Option first Start Here// 
    var html = '<div class="item white-box icf_type" id="formType' + pageId + '">';
         html += '<form class="form-horizontal create-form validate-form" action="" method="post" id="create-form" novalidate>'
            html += '<div class="pageBorder studyDetail'+page				
			Id+'" id="study_Detail">';	
            //Study detail attach here
                html+= '<p class="studyTitle text-uppercase">ENTER STUDY DETAILS</p>';
                html += '<div class="row dropBoxClass">';
                    for(var h=0;h<studyArr.length;h++){
                        html += '<div class="col-xs-6 col-sm-6 col-lg-6 selectContainer ' + studyClassArr[h] + '" id="">';  
                        if(studyArr[h] == "CC"){
                            html += '<span class="optionVal ccTag">' + studyArr[h] + '</span>';
                        }else{
                            html += '<span class="optionVal">' + studyArr[h] + '<em class="required"> *</em></span>';
                        }
                           
                            if(h == 0){
                                html += '<div class="dropdown mainDropDownBg" id="chooseProtocol">';                                    
                                    html += '<select class="selectpicker selectProtocol" id="selectProtocolId" name="selValue" data-show-subtext="true" data-live-search="true" style="display: none;">';
                                        html += '<option data-subtext="" value="">Enter Protocol</option>';                            
                                    html += '</select>';
                                html += '</div>';
                            }
                            else if(h==1){
                                html += '<div class="dropdown mainDropDownBg" id="chooseCountry">'; 
                                html += '<select class="selectpicker selectCountry" id="selectCountryId" name="selValue" data-show-subtext="true" data-live-search="true" style="display: none;">';
                                html += '<option data-subtext="" value="">Select Country</option>';
                                for (i = 0; i < result.json_data.response.length; i++) {
                                        var setIVal = i + 1;
                                        if (result.json_data.response[i].country_name == 'Argentina') {
                                            html += '<option data-subtext="" value="' + setIVal + '" style="border-top: 1px solid #000;">' + result.json_data.response[i].country_name + '</option>';
                                        }
                                        else {
                                            html += '<option data-subtext="" value="' + setIVal + '">' + result.json_data.response[i].country_name + '</option>';
                                        }
                                    }
                                html += '</select>';
                                html += '</div>';
                            }
                            else{
                                html += '<input type="email" id="emailValidation" class="selectCC" value="" placeholder="" style="font-size: 15px;">';
                            }                     
                            
                        html += '</div>';  
                    }             
                html += '</div>'; 
            html += '</div>';

            //Section requiring legal review check box
            html += '<div class="pageBorder section'+pageId+'" id="section">';                
            html += '</div>';

            //Textareas
            html += '<div class="pageBorder textAreaContainer'+pageId+'" id="">';                        
            html += '</div>';

            //Attachments
            html += '<div class="pageBorder attachContainer'+pageId+'" id="">';                             
            html += '</div>';

         html += '</form>';
        html += '</div>';
    $('.carousel-inner').append(html);

    //Carousel Page active first 
    $('#formType' + pageId).addClass("active");   

    //CC Email validate function call in budgetForm.js
    emailValidate();
    
    if ($('#formType' + pageId + ' .selectProtocol').find("option:selected").text() == "Enter Protocol") {
        $('select[name=selValue]').val(0);
        $('.selectpicker').selectpicker('refresh');
        $('.btn-group bootstrap-select').css("width", 100 + "%");
    }
   
    /*****Load Protocol list according to input value start here*****/    
    $('.selectProtocol ul li:first-child').remove();
    $('.selectProtocol input').keyup(function (e) {        
            listProtocolsFun();        
    });
    /*****Load Protocol list according to input value end here*****/
    addImgIDICFArr = [];

    //Section requiring legal review check box attach
    var sectionArr = new Array("Leaving the study", "Cost, Expenses and Payments", "Confidentiality", "Potential Risks and Discomforts", "Compensation and Treatment for injury", "Authorization/Privacy(U.S. only)", "ICF Volunteer Statement", "Blood and other Samples", "Others");
    sectionRequired(pageId,sectionArr);
  

    //Text Area Attach function
    var textAreaArr = new Array("If any of the changes are required based on change in regulation or law, you must specify and provide relevant documentation.","If any of the changes are based on Ethics Committee(EC) or Institutional Review Board(IRB) feedback, Please specify and provide relevant documentation.","Any other details")
    attachTextInputs(pageId,textAreaArr);

    //Radio buttons attachment
    var attachmentOptionsArr = new Array("1. Country ICF","2. Other relevant document(s) (optional)");   
    var radioType = new Array("global","document");
    attachIcfDoc(pageId,attachmentOptionsArr,radioType,result,"cli");

    addImgIDICFArr = [];
    attachimagesOnPage(pageId, 1, "cli");

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
    if (result.json_data.response.length >= 10) {
		$('#chooseCountry ul').css("height", 175);
		$('#chooseCountry ul').css("overflow", "auto");
	}
	else {
		$('#chooseCountry ul').css("height", "auto");
    }

    $('.summernote').summernote({
		height: 115,
		tabsize: 2
    });
    
    /*****Submite Button function call start here*****/
    //Call in js/budget.js
    saveButtonICF(pageId,"cli");
    /*****Submite Button function call end here*****/
}
function sectionRequired(pageId,sectionArr){
    $('.section'+pageId+' p').remove();
	$('.section'+pageId+' .legalReview').remove();
    var html = '<p class="studyTitle topMargin text-uppercase">Section requiring legal review<em class="required"> *</em></p>';

    html += '<div class="legalReview" style="">';
    for (var k = 0; k < sectionArr.length; k++) {
    html += '<div class="row dropBoxClass">';
        html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
          html += '<div class="form-check floatLeft">'
            html += '<div class="checkbox checkbox-primary">';
                html+='<input id="checkbox'+k+'" value="'+k+'" type="checkbox">'
                html+='<label for="checkbox'+k+'">'+sectionArr[k]+'</label>'
                html+='</div>'
          html += '</div>';
        html += '</div>';
    html += '</div>';
     }
    html += '</div>';

    $('.section'+pageId).append(html)
}
function attachTextInputs(pageId,sectionArr){
    $('.textAreaContainer'+pageId+' .textInput').remove();
    for(var i=0;i<sectionArr.length;i++){
        var html = '<div class="textInput" id="txtAreaId'+i+'">';
             html += '<p class="studyTitle topMargin text-uppercase">'+sectionArr[i]+'<em class="required"> *</em></p>';
            html += '<div class="summernote"></div>';	
        html += '</div>';
        $('.textAreaContainer'+pageId).append(html);
    }    
}
var checkedItems = new Array();
//Call in js/globalMaster.js
function callToSaveCLI(pageId,icfType) {
    //event.preventDefault();
    checkedItems = [];
    $('.legalReview input:checkbox:checked').each(function(i){
        checkedItems[i] = $(this).val();
    });
    if (checkedItems.length != 0) {
        var arrCheckBoxIndex  = my_implode_js(',',checkedItems);
        saveServiceCall(pageId, arrCheckBoxIndex,icfType);           
    }
    else{
        alertScreen("Please complete form first","");
    }
}
function saveServiceCall(pageId, arrCheckBoxIndex,icfType) {
    var msg;
   
    if ($('#formType' + pageId + ' .selectProtocol').find("option:selected").text() != "Enter Protocol" && $('#formType' + pageId + ' .selectCountry').find("option:selected").text() != "Select Country")
    {
        if(icfType == "cli"){
            if ($('#formType' + pageId + ' #txtAreaId0 .note-editable').text() != '' && $('#formType' + pageId + ' #txtAreaId1 .note-editable').text() != '' && $('#formType' + pageId + ' #txtAreaId2 .note-editable').text() != '') {
                attachAndLink(pageId, arrCheckBoxIndex,icfType)
            }
            else {
                msg = "Please complete input field first";
                alertScreen(msg,"");
            }
        }
        else{
            if($('#formType' + pageId + ' .selectPrincipal').val() != ""){
                if ($('#formType' + pageId + ' #txtAreaId0 .note-editable').text() != '' && $('#formType' + pageId + ' #txtAreaId1 .note-editable').text() != '') {
                    attachAndLink(pageId, arrCheckBoxIndex,icfType)
                }
                else {
                    msg = "Please complete input field first";
                    alertScreen(msg,"");
                }
            }else{
                msg = "Please complete form first";
                alertScreen(msg,""); 
            }
            
        }
    }
    else { 
        msg = "Please complete form first";
        alertScreen(msg,"");
    }
}
function attachAndLink(pageId, arrCheckBoxIndex,icfType){

    var setLink;
    var setAttachment;
    if(icfType == "cli"){
        countryLink = $('.linkInput .abcd1').text(); 
        setLink = countryLink
        setAttachment=addAttachmentCountry;
    }
    else{
        siteLink = $('.linkInput .abcd1').text();
        setLink = siteLink;
        setAttachment=addAttachmentSite;
    }

    if (setAttachment != 0) {
        if (checkedItems.length != 0) {
            var arrAttachIds = 0;
            if (addImgIDICFArr.length != 0) {
                arrAttachIds = my_implode_js(',',addImgIDICFArr);
                saveICFForm(pageId, arrAttachIds, arrCheckBoxIndex,icfType);                
            }
            else {
                saveICFForm(pageId, arrAttachIds, arrCheckBoxIndex,icfType);
            }
        }
        else {
            msg = "Please select checklist options first";
            alertScreen(msg,"");
        }
    }
    else {       
                       
        if(setLink != '')        {
            if (checkedItems.length != 0) {
                var arrAttachIds = 0;                  
               
                if (addImgIDICFArr.length != 0) {
                    arrAttachIds = my_implode_js(',',addImgIDICFArr);
                    saveICFForm(pageId, arrAttachIds, arrCheckBoxIndex,icfType);
                }
                else {
                    saveICFForm(pageId, arrAttachIds, arrCheckBoxIndex,icfType);
                }
            }
            else{
                msg = "Please select checklist options first";
                alertScreen(msg,"");
            }
        }
        else{
            msg = "Please complete form first";
            alertScreen(msg,"");
        }                         
    }
}