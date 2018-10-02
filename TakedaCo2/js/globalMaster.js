function globalMasterICFForm(){
    var hamburgerActive = 1;    
    if(window.localStorage.getItem('userType') != null){   
        hamburgerList(hamburgerActive, window.localStorage.getItem('userType'));

        var pageId = 0;
        pageNoLength = [];
        pageNoLength.push(pageId);
        loaderLogin();
        $.ajax({
            url: serviceHTTPPath + 'listRegions',
            type: "GET",
            dataType: 'json',
            headers: {
                "authorization": window.localStorage.getItem("token_id")
            },
            success: function (result) {
                loaderRemoveFun();
                if(result.json_data.response == 4 || result.json_data.response == 5 || result.json_data.response == 6){
                    location.href = "../index.html";
                }else{
                  createGlobalMasterForm(result,pageId);
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
function createGlobalMasterForm(result,pageId){
    
    $('#formType' + pageId).remove();
	$('#formType' + pageId + ' .escalationFollowUpMain').remove();
    var i;
    var studyArr = new Array("Protocol Number","CC");
    var studyClassArr = new Array('protocolNumber', 'CC');    
    var defultTitle = new Array('Enter Protocol','CC');
	
	//Option first Start Here// 
    var html = '<div class="item white-box icf_type" id="formType' + pageId + '">';
         html += '<form class="form-horizontal create-form validate-form" action="" method="post" id="create-form" novalidate>'

         html += '<div class="pageBorder studyDetail'+pageId+'" id="study_Detail">';	
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
                                html += '<option data-subtext="" value="">' + defultTitle[h] + '</option>';                            
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

            html += '<div class="pageBorder" id="">';
                html+= '<p class="studyTitle text-uppercase">Select the region with the majority of participating sites<em class="required"> *</em></p>';
                html += '<div class="dropdown mainDropDownBg" id="chooseRegion">';   
                 html += '<div class="col-xs-6 col-sm-6 col-lg-6" id="">';                                  
                        html += '<select class="selectpicker selectRegion" id="selectRegionId" name="selValue" data-show-subtext="true" data-live-search="true" style="display: none;">';
                        
                        html += '<option data-subtext="" value="">Select Region</option>';    
                        for (var i = 0; i < result.json_data.response.data.length; i++) {
                            var setIVal = i + 1;
                            html += '<option data-subtext="" value="' + setIVal + '" id="">' + result.json_data.response.data[i].name + '</option>';
                        }
                                        
                    html += '</select>';
                  html += '</div>';
                html += '</div>';
            html += '</div>';

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
    //listProtocolsFun();
    $('.selectProtocol ul li:first-child').remove();
    $('.selectProtocol input').keyup(function (e) {
        //if ($('.selectProtocol input').val() !=  '') {
            listProtocolsFun();
       // }
    });
    /*****Load Protocol list according to input value end here*****/
   
    regionInputCall(result);
   
    //Radio buttons attachment
    var attachmentOptionsArr = new Array("1. Global Master ICF template", "2. Protocol", "3. Other relevant document(s) (optional)");   
    var radioType = new Array("global","protocol","document");
    attachIcfDoc(pageId,attachmentOptionsArr,radioType,result,"global");

    addImgIDICFArr = [];
    attachimagesOnPage(pageId, 1, "global");

    /*****Submite Button function call start here*****/
    saveButtonICF(pageId,"global");
    /*****Submite Button function call end here*****/
}
function attachIcfDoc(pageId,attachmentOptionsArr,radioType,result,icfFormType){

    $('.attachContainer'+pageId+' p').remove();
    $('.attachContainer'+pageId+' .row').remove();

    var radioBtnTxtArr = new Array("Attach","Enter Link");
    var html = '<p class="studyTitle text-uppercase">Add the following attachment(s)</p>';
    html += '<div class="row">';
    
    for (var p = 0; p < attachmentOptionsArr.length; p++) {
        var setP = p + 1;             
        html += '<div class="col-xs-12 col-sm-12 col-lg-12 icfRadioTitle" id="">';
        if(icfFormType == "global"){
            if(setP == 3){
                html += '<span class="">' + attachmentOptionsArr[p] + '</span>';
            }else{
                html += '<span class="">' + attachmentOptionsArr[p] + '<em class="required"> *</em></span>';
            }
        }else{
            if(setP == 2){
                html += '<span class="">' + attachmentOptionsArr[p] + '</span>';
            }else{
                html += '<span class="">' + attachmentOptionsArr[p] + '<em class="required"> *</em></span>';
            }
        }
        
         
        html += '</div>';

        html += '<div class="row icfRadioContainer">';
         html += '<div class="col-xs-12 col-sm-12 col-lg-12 '+radioType[p]+'"id="attachRadio' + setP + '">';
            if(setP != attachmentOptionsArr.length){  
                                
                //Enter link input div
                html += '<div class="linkInput" style="display: none;">';
                    html += '<div class="inputLinkMain" id="">';
                        html += '<input type="text" class="enterLink" id="enterLink' + setP + '" value="" placeholder="Enter Link" style="font-size: 15px;">';  
                        html += '<span class="btn addLinkBtn" id="' + setP + '">Add Link</span>'
                    html += '</div>';            
                html += '</div>';

                //Attachment Icon
                html += '<div class="attachImgInput" id="attachImgInput' + setP + '">';            
                    html += '<div class="addBtn_Div" id="addIdimg' + setP + '" style="width:50%;display:none;">';
                        html += '<div class="text-right uploadAttach fileMainDiv' + setP + '" id="' + setP + '" style="position: relative;">';
                            html += '<a href="#" class="btn attachTxtdiv popupImg' + setP + '">Attach</a>'
                            html += '<div class="filediv" id="' + setP + '"><input name="file[]" type="file" class="filelength file' + setP + '" id="fileUpload' + setP + '" style="cursor: pointer;top: 0; right: 0;position: absolute;width: 62px;height: 34px;opacity: 0; overflow:hidden;"/><br/></div>';
                        html += '</div>';
                    
                        html += '<div class="" id="attachImgId' + setP + '" style="">';
                            html += '<div class="addBtn plusPosition" style="margin-bottom:0px;position: relative;"></div>';
                        html += '</div>';
                    html += '</div>';
                html += '</div>';

                for(i = 0;i<radioBtnTxtArr.length;i++){
                    html += '<div class="form-check icfFormRadio">'
                        html += '<label class="radionBtn">'
                        if(p == 0){
                            html += '<input type="radio" name="global" value="'+i+'" id="' + setP + '"> <span class="label-text globalTxt'+i+'">'+radioBtnTxtArr[i]+'</span>'
                        }
                        else{
                            html += '<input type="radio" name="protocol" value="'+i+'" id="' + setP + '"> <span class="label-text protocolTxt'+i+'">'+radioBtnTxtArr[i]+'</span>'
                        }
                       
                        html += '</label>'
                    html += '</div>'
                }
            }
            else{
                //Attachment Icon
                html += '<div class="attachImgInput documentType" id="attachImgInput' + setP + '">';            
                    html += '<div class="addBtn_Div" id="addIdimg' + setP + '" style="">';
                        html += '<div class="uploadAttach fileMainDiv' + setP + '" id="' + setP + '" style="position: relative;">';
                            html += '<a href="#" class="btn attachTxtdiv popupImg' + setP + '">Attach</a>'
                            html += '<div class="filediv" id="' + setP + '"><input name="file[]" type="file" class="filelength file' + setP + '" id="fileUpload' + setP + '" style="position: absolute; width: 62px;height: 34px;opacity: 0; overflow:hidden;cursor: pointer;"/><br/></div>';
                        html += '</div>';
                    
                        html += '<div class="" id="attachImgId' + setP + '" style="">';
                            html += '<div class="addBtn plusPosition" style="margin-bottom:0px;position: relative;"></div>';
                        html += '</div>';
                    html += '</div>';
                html += '</div>';
            }
         html += '</div>';
        html += '</div>';
    }
    html += '</div>';

    $('.attachContainer'+pageId).append(html);

    linkClickEvent();
    radioClickEvent(result,pageId);
}
function regionInputCall(result) {
    /*****Choose Country click event start here*****/
    $('#chooseRegion ul li:first-child').remove();
    $('#chooseRegion li').click(function () {
        var index = $(this).index();        
        var idRegion = result.json_data.response.data[index].id;
        var regionName = result.json_data.response.data[index].name;

        window.localStorage.setItem("selectRegionId", idRegion);
        window.localStorage.setItem("RegionName", regionName);
               
    });
    /*****Choose Country click event end here*****/
}
function linkClickEvent(){
    $('.linkInput span.addLinkBtn').click(function () {
        var getId= $(this).attr('id')
        if($('#attachRadio'+getId+' .linkInput input').val() != ''){
            $('#attachRadio'+getId+' .inputLinkMain').css("display", "none");
           
            $('#attachRadio'+getId+' .linkInput .abcdSize').remove();
            var addLink = '<div class="abcdSize icfImg previewimgSize abcd' + getId + '">'+$('.linkInput input#enterLink'+getId).val()+'<img id="' +getId + '" class="deleteBtn delete' + getId + '" src="../images/delete_btn.png" alt="delete" style="margin-left: 10px;"/></br></div>';
            $('#attachRadio'+getId+' .linkInput').append(addLink);
    
            $('.delete' + getId).click(function () {
                var _id = $(this).attr('id');
                $('#attachRadio'+_id+' .abcd' + _id).remove();
                $('#attachRadio'+_id+' .inputLinkMain').css("display", "block");
    
                $('#attachRadio'+_id+' .linkInput input').val('');
                $('#attachRadio'+_id+' .linkInput').css("display","block");
                //$('#attachImgInput'+_id+' .addBtn_Div').css("display","block")
            });
            //$('#attachRadio'+_id+' .linkInput').css("display","none")
        }
        else{
            alertScreen("Please enter link first","");
        }       
    });
}
function radioClickEvent(result,pageId){
    var radioButtons;
    var index;
   
    $('#formType' + pageId + ' .global .radionBtn input[type=radio]').on('change', function () {		
		radioButtons = $('#formType' + pageId + ' .global .radionBtn input:radio[name="global"]');
		index = radioButtons.index(radioButtons.filter(':checked'));
        var _id = $(this).attr("id");

		if (index == 0) {            
            $('#attachRadio'+_id+' .linkInput input').val('')
            $('#attachRadio'+_id+' .linkInput').css("display","none")
            $('#attachImgInput'+_id+' .addBtn_Div').css("display","block")
            $('#formType' + pageId + ' .popupImg' + _id).css("display", "block");
            $('#formType' + pageId + ' .fileMainDiv' + _id).css("display", "block");            
		}
		else {
			$('#attachRadio'+_id+' .linkInput').css("display","block")
            $('#attachImgId'+_id+' .abcdSize').remove()

            $('#attachImgInput'+_id+' .addBtn_Div').css("display","none") 
            $('#attachRadio'+_id+' .abcd' + _id).remove();
            
            
            $('#attachRadio'+_id+' .inputLinkMain').css("display", "block");
            $('#attachRadio'+_id+' .linkInput input').val('');
		}

		for (l = 0; l < radioBtnTxtArr.length; l++) {
			$('#formType' + pageId + ' .global .globalTxt' + l).css("color", "#333");
		}

		$('#formType' + pageId + ' .global .globalTxt' + index).css("color", "#4c9bcf");
    });
    
    $('#formType' + pageId + ' .protocol .radionBtn input[type=radio]').on('change', function () {		
		radioButtons = $('#formType' + pageId + ' .protocol .radionBtn input:radio[name="protocol"]');
		index = radioButtons.index(radioButtons.filter(':checked'));
        var _id = $(this).attr("id");
		if (index == 0) {
			$('#attachRadio'+_id+' .linkInput input').val('')
            $('#attachRadio'+_id+' .linkInput').css("display","none")
            $('#attachImgInput'+_id+' .addBtn_Div').css("display","block")
            $('#formType' + pageId + ' .popupImg' + _id).css("display", "block");
            $('#formType' + pageId + ' .fileMainDiv' + _id).css("display", "block");
		}
		else {
			$('#attachRadio'+_id+' .linkInput').css("display","block")
            $('#attachImgId'+_id+' .abcdSize').remove()

            $('#attachImgInput'+_id+' .addBtn_Div').css("display","none") 
            $('#attachRadio'+_id+' .abcd' + _id).remove();            
            
            $('#attachRadio'+_id+' .inputLinkMain').css("display", "block");
            $('#attachRadio'+_id+' .linkInput input').val('');
		}

		for (l = 0; l < radioBtnTxtArr.length; l++) {
			$('#formType' + pageId + ' .protocol .protocolTxt' + l).css("color", "#333");
		}

		$('#formType' + pageId + ' .protocol .protocolTxt' + index).css("color", "#4c9bcf");
	});
}
// Attach Images
function attachimagesOnPage(pageId, abc, selectOption) {   
    $('#formType' + pageId + ' input:file').click(function () {    
        this.value = null;
    });
    
    $('#formType' + pageId + ' input:file').change(function () {       
        var _id = $(this).parent().attr("id");
       
        if (this.files && this.files[0]) {
            abc += 1;            
            if (selectOption == "global") {
                if (_id != 3) {
                    $('#formType' + pageId + ' .popupImg' + _id).css("display", "none"); 
                    $('#formType' + pageId + ' .fileMainDiv' + _id).css("display", "none");
                }
            }
            else {
                if (_id != 2) {
                    $('#formType' + pageId + ' .popupImg' + _id).css("display", "none");
                    $('#formType' + pageId + ' .fileMainDiv' + _id).css("display", "none");
                }
            }
           
            var ext = $('#formType' + pageId + ' .file' + _id).val().split('.').pop().toLowerCase();
            var file;
            var name;
            
            if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
                file = this.files[0];
                name = file.name;
                $('#attachImgId' + _id + ' .addBtn').before("<div class='abcdSize icfImg addText abcd" + abc + "'>" + name + "</div>");
            }
            else {
                file = this.files[0];
                name = file.name;
                $('#attachImgId' + _id + ' .addBtn').before("<div class='abcdSize icfImg previewimgSize abcd" + abc + "'>" + name + "</div>");
            }

            var html = '<img id="' + abc + '" class="deleteBtn delete' + abc + '" src="../images/delete_btn.png" alt="delete" style="margin-left: 10px;"/></br>';
            $('#formType' + pageId + ' .abcd' + abc).append(html);

            $('#formType' + pageId + ' .delete' + abc).click(function () {
                var id = $(this).attr('id');               
                if (selectOption == "global") {
                    if (_id == 1) {
                        addAttachmentGlobl = 0;
                        $('#formType' + pageId + ' .popupImg' + _id).css("display", "block");
                        $('#formType' + pageId + ' .fileMainDiv' + _id).css("display", "block");
                    }
                    else if (_id == 2) {
                        addAttachmentProtocol = 0;
                        $('#formType' + pageId + ' .popupImg' + _id).css("display", "block");
                        $('#formType' + pageId + ' .fileMainDiv' + _id).css("display", "block");
                    }
                }
                else {
                    if (_id == 1) {
                        addAttachmentCountry = 0;
                        addAttachmentSite = 0;
                        $('#formType' + pageId + ' .popupImg' + _id).css("display", "block");
                        $('#formType' + pageId + ' .fileMainDiv' + _id).css("display", "block");
                    }
                }
               
                for (var u = 0; u < addImgIDICFArr.length; u++) {
                    if (addImgIDICFArr[u] == $('.abcd' + id).attr('id')) {                       
                        addImgIDICFArr.splice(u, 1);
                        break;
                    }
                }
                $('.abcd' + id).remove();
            });

            var file_data = this.files[0];
            var form_data = new FormData();
            form_data.append('file', file_data);

            calltoUploadAttachICF(form_data, pageId, abc, selectOption, _id);
        }
    });
}
/*****Image attch function start here*****/
var addAttachmentsICF = 0;
var addAttachmentGlobl = 0;
var addAttachmentProtocol = 0;
var addAttachmentCountry = 0;
var addAttachmentSite = 0;
var globleLink='';
var protocolLink='';
var countryLink='';
var siteLink='';
function calltoUploadAttachICF(form_data, pageId, abc, selectOption, _id) {
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
                addAttachmentsICF = resultFile.json_data.attachment_id;

                if ($('#formType' + pageId + ' .previewimgSize').length != 0) {
                    $('#formType' + pageId + ' .abcd' + abc).attr('id', addAttachmentsICF);
                }
                if ($('#formType' + pageId + ' .addText').length != 0) {
                    $('#formType' + pageId + ' .abcd' + abc).attr('id', addAttachmentsICF);
                }

                if (_id == 1) {
                    if (selectOption == "global") {
                        addAttachmentGlobl = resultFile.json_data.attachment_id;
                    }
                    else if (selectOption == "cli") {
                        addAttachmentCountry = resultFile.json_data.attachment_id;
                    }
                    else {
                        addAttachmentSite = resultFile.json_data.attachment_id;
                    }

                }
                else if (_id == 2) {
                    if (selectOption == "global") {
                        addAttachmentProtocol = resultFile.json_data.attachment_id;
                    }
                    else if (selectOption == "cli") {
                        addImgIDICFArr.push(addAttachmentsICF);
                    }
                    else {
                        addImgIDICFArr.push(addAttachmentsICF);
                    }

                }
                else {
                    addImgIDICFArr.push(addAttachmentsICF);
                }
            }
        });
}
function saveButtonICF(pageId,icfType) {
    $('.arrowBtn .row').remove();
    var html = '<div class="row">';

        html += '<div class="col-xs-4 col-sm-4 col-lg-4 text-left">';
         html += '<input  class="btn btn-danger" value="Back" type="submit" name="submit" id="backBtn" style="display:none;">';
        html += '</div> ';

        html += '<div class="col-xs-4 col-sm-4 col-lg-4 text-center">';
         html += '<span class="btn saveForm" id="subBtn" style="display: block;">Submit</span>';    
        html += '</div>';

        html += '<div class="col-xs-4 col-sm-4 col-lg-4 text-left" id="nextbtn">';
         html += '<input  class="btn btn-danger" value="Next" type="submit" name="submit" id="nextBtn" style="display:none;">';
        html += '</div>';

    html += '</div>';
    $('.arrowBtn').append(html);

    $('#nextButton').css("opacity", 0.5);

    window.localStorage.setItem("submiteBtn", 0);

    $('#subBtn').click(function () {       
        loaderLogin();
        $('html').css('overflow', 'hidden');
        if (icfType == "global") {
            callToSaveGMI(pageId,icfType);
        }
        else{
            //Country and site common function
            callToSaveCLI(pageId,icfType);
        }   
        $(window).scrollTop(0);   
    });
}

//Call budget form save API
function callToSaveGMI(pageId,icfType) {
    var msg;
    if ($('#formType' + pageId + ' .selectProtocol').find("option:selected").text() != "Enter Protocol" && $('#formType' + pageId + ' .selectRegion').find("option:selected").text() != "Select Region") {
        if (addAttachmentGlobl != 0 && addAttachmentProtocol != 0) {

            manageAttachments(pageId,icfType);
        }
        else {
            if(addAttachmentGlobl == 0){    
                globleLink = $('.linkInput .abcd1').text();                
            }            
            if(addAttachmentProtocol == 0){
                protocolLink = $('.linkInput .abcd2').text()
            }

            if(globleLink == '' && addAttachmentGlobl == 0){
                msg = "Please complete form first";
                alertScreen(msg,'');
            }
            else if(protocolLink == '' && addAttachmentProtocol == 0){
                msg = "Please complete form first";
                alertScreen(msg,'');
            }
            else{
                arrAttachIds = 0;
                manageAttachments(pageId,icfType);                
            }            
        }
    }
    else {
        msg = "Please complete form first";
        alertScreen(msg,'');
    }
}
function manageAttachments(pageId,icfType){
    var msg;
    var arrCheckBoxIndex = '';
    var arrAttachIds = 0;
   
    if (addImgIDICFArr.length != 0) {
        for (var y = 0; y < addImgIDICFArr.length; y++) {
            if (y == 0) {
                arrAttachIds = addImgIDICFArr[y];
            }
            else {
                arrAttachIds = arrAttachIds + "," + addImgIDICFArr[y];
            }
            if (y == addImgIDICFArr.length - 1) {                       
                saveICFForm(pageId, arrAttachIds, arrCheckBoxIndex,icfType);
            }
        }
    }
    else {                
        saveICFForm(pageId, arrAttachIds, arrCheckBoxIndex,icfType);
    }
}
function saveICFForm(pageId, arrAttachIds, arrCheckBoxIndex,icfType){
    var msg;

    var selectProtocol = window.localStorage.getItem("selectProtocol");
	if (selectProtocol == null) {
		selectProtocol = "";
    }
    
    var selectRegionId = window.localStorage.getItem("selectRegionId");
   
    if (selectRegionId == null) {
        selectRegionId = "";
    }

    
    var selectCountry = window.localStorage.getItem("selectCountry");
    if (selectCountry == null) {
        selectCountry = "";
    }
    
    var selectSite = window.localStorage.getItem("selectSite");
    if (selectSite == null) {
        selectSite = "";
    }
    
    var _selectPrincipal = $('#formType' + pageId + ' .selectPrincipal').val();
    if (_selectPrincipal == undefined) {
        _selectPrincipal = '';
    }

    specify_relevantDocument = $('#formType' + pageId + ' #txtAreaId0 .note-editable').html();
    if (specify_relevantDocument == undefined) {
        specify_relevantDocument = '';
    }

    var escalation_subTypeId;
    var specify_relevantDocument='';
    var EC_IRBFeedback='';
    var any_otherDetail='';
    if(icfType == "global"){
        escalation_subTypeId = 1;
    }
    else if(icfType == "cli")
    {
        escalation_subTypeId = 2;
        specify_relevantDocument = $('#formType' + pageId + ' #txtAreaId0 .note-editable').html();
        if (specify_relevantDocument == undefined) {
            specify_relevantDocument = '';
        }
            EC_IRBFeedback = $('#formType' + pageId + ' #txtAreaId1 .note-editable').html();
        if (EC_IRBFeedback == undefined) {
            EC_IRBFeedback = '';
        }

        any_otherDetail = $('#formType' + pageId + ' #txtAreaId2 .note-editable').html();
        if (any_otherDetail == undefined) {
            any_otherDetail = '';
        }
    }
    else{
        escalation_subTypeId = 3;
        EC_IRBFeedback = $('#formType' + pageId + ' #txtAreaId0 .note-editable').html();
        if (EC_IRBFeedback == undefined) {
            EC_IRBFeedback = '';
        }
        any_otherDetail = $('#formType' + pageId + ' #txtAreaId1 .note-editable').html();
        if (any_otherDetail == undefined) {
            any_otherDetail = '';
        }
    } 

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
    
    if(icfType == ""){        
    }

   
    var user_id = window.localStorage.getItem("user_id");
   
    loaderLogin();
    $.ajax({
        url: serviceHTTPPath + "saveIcf",
        type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
        data: {
            user_id: user_id,
            escalation_sub_type_id: escalation_subTypeId,
            protocol_id: selectProtocol,
            sitename: selectSite,
            region_id: selectRegionId,
            country: selectCountry,
            principle_investigator: _selectPrincipal,

            section_requiring_legal_review: arrCheckBoxIndex,

            EC_IRB_feedback: EC_IRBFeedback,
            any_other_detail: any_otherDetail,
            specify_relevant_document: specify_relevantDocument,

            attachment_global_icf: addAttachmentGlobl,
            attachment_protocol: addAttachmentProtocol,
            attachment_other_relevant_document: arrAttachIds,
            attachment_country_icf: addAttachmentCountry,
            attachment_site_icf: addAttachmentSite,
            cc_email: emailObject,
            
            attachment_global_link:globleLink,
            attachment_protocol_link:protocolLink,
            attachment_country_icf_link:countryLink,
            attachment_site_icf_link:siteLink,
        },
        success: function (result) {        
            if (result.json_data.response != 0) {
                msg = result.json_data.message;
                   var href= "croDashboard.html";
                   alertScreen(msg,href);
            }
            else {
                msg = result.json_data.message;
                alertScreen(msg,'');
            }
            loaderRemoveFun();

        },
        error: function () {
            return;
        }
    });
}