function siteLevelICFForm(){
    var hamburgerActive = 1;    
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
            loaderRemoveFun();
            if(result.json_data.response == 4 || result.json_data.response == 5 || result.json_data.response == 6){
                location.href = "../index.html";
            }else{
                createSiteForm(result,pageId);
            }
        },
        error: function (e) {
            loaderRemoveFun();
            return;
        }
     });
}
function createSiteForm(result,pageId){
    $('#formType' + pageId).remove();
	$('#formType' + pageId + ' .escalationFollowUpMain').remove();
    var i;

   var studyDetailArr = new Array("Protocol Number", "Site Name", "Country","Principal Investigator", "CC");
   var selectClassArr = new Array('selectProtocol', 'selectSite', 'selectCountry','selectPrincipal', 'selectRequested', 'selectCC', 'selectEscalation');
   var defultTitleArr = new Array('Enter Protocol', 'Enter Site', 'Select Country','Enter Principal Investigator', 'Enter Requested by', 'CC');//,'What is this Escalation')
    //Option first Start Here// 
    var html = '<div class="item white-box icf_type" id="formType' + pageId + '">';
         html += '<form class="form-horizontal create-form validate-form" action="" method="post" id="create-form" novalidate>'
            html += '<div class="pageBorder studyDetail'+pageId+'" id="inputStudyDetail">';	
            //Study detail attach here
                html+= '<p class="studyTitle text-uppercase">ENTER STUDY DETAILS</p>';//
                    html += '<div class="row dropBoxClass">';
                    for (var h = 0; h < studyDetailArr.length; h++) {
                        if (h != 7) {
                            if(h == 4){
                                html += '<div class="col-xs-12 col-sm-12 col-lg-12 selectContainer ' + studyDetailClassArr[h] + '" id="">';  
                                html += '<span class="optionVal ccLebal ccTag">' + studyDetailArr[h] + '</span>';
                                                            
                            }
                            else{
                                html += '<div class="col-xs-6 col-sm-6 col-lg-6 selectContainer ' + studyDetailClassArr[h] + '" id="">';  
                                html += '<span class="optionVal">' + studyDetailArr[h] + '<em class="required"> *</em></span>';                                
                            }          			
                            if (h < 3) {					
                                html += '<div class="dropdown mainDropDownBg" id="' + dropDownIdArr[h] + '">';
                                
                                html += '<select class="selectpicker ' + selectClassArr[h] + '" id="' + selectIdArr[h] + '" name="selValue" data-show-subtext="true" data-live-search="true" style="display: none;">';
                                html += '<option data-subtext="" value="">' + defultTitleArr[h] + '</option>';
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
                                if (h == 4) {
                                    html += '<input type="email" id="emailValidation" class="' + selectClassArr[h] + '" value="" placeholder="" style="font-size: 15px;">';
                                }
                                else {
                                    html += '<input type="text" class="' + selectClassArr[h] + '" value="" placeholder="' + defultTitleArr[h] + '" style="font-size: 15px;">';
                                }
                            }
                            
                           
                            html += '</div>';
                        }
                    }
                html += '</div>'
            html += '</div>';

            //Section requiring legal review check box
            html += '<div class="pageBorder section'+pageId+'" id="section">';                
            html += '</div>';

            //Section requiring legal review check box
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
     
    if ($('#formType' + pageId + ' .selectProtocol').find("option:selected").text() == "Enter Protocol") {
        $('select[name=selValue]').val(0);
        $('.selectpicker').selectpicker('refresh');
        $('.btn-group bootstrap-select').css("width", 100 + "%");
    }   
    
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
    $('.selectProtocol ul li:first-child').remove();
    $('.selectProtocol input').keyup(function (e) {
       listProtocolsFun();      
    });
    /*****Load Protocol list according to input value end here*****/

    /*****Load Site list according to input value start here*****/
    listSitenameFun();
    $('.selectSite ul li:first-child').remove();
	$('.selectSite input').keyup(function (e) {
		var selectSiteVal = $('.selectSite input').val();		
		listSitenameFun();
		
	});
    /*****Load Site list according to input value end here*****/
    
    addImgIDICFArr = [];

    //Section requiring legal review check box attach
    var sectionArr = new Array("Leaving the study", "Cost, Expenses and Payments", "Confidentiality", "Potential Risks and Discomforts", "Compensation and Treatment for injury", "Authorization/Privacy(U.S. only)", "ICF Volunteer Statement", "Blood and other Samples", "Others");
    sectionRequired(pageId,sectionArr);


     //Text Area Attach function
     var textAreaArr = new Array("If any of the changes are based on Ethics Committee(EC) or Institutional Review Board(IRB) feedback, Please specify and provide relevant documentation.", "Any other details");

     attachTextInputs(pageId,textAreaArr);

     //Radio buttons attachment
     var attachmentOptionsArr = new Array("1. Site ICF","2. Other relevant document(s) (optional)");   
     var radioType = new Array("global","document");
     attachIcfDoc(pageId,attachmentOptionsArr,radioType,result, "sli");
 
     addImgIDICFArr = [];
     attachimagesOnPage(pageId, 1, "sli");
 
     $('.summernote').summernote({
         height: 115,
         tabsize: 2
     });
     
     /*****Submite Button function call start here*****/
     //Call in js/budget.js
     saveButtonICF(pageId,"sli");
     /*****Submite Button function call end here*****/
}