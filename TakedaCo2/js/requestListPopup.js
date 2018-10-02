 //Call in js/croDashboard.js
function appendRequestPopup(viewCroResult, p, userType, escalationResult, managerType,resultIssueType,resultICFOptions,hamburgerType,request_number){
   
    var user_id = window.localStorage.getItem("user_id")
    var ccRquestId = getQueryVariable("request_id");
    
    var protocolVal = viewCroResult.json_data.response.data[p].request_number + " - " + viewCroResult.json_data.response.data[p].protocol_number;
   
    $('.addPopItems'+p).remove();
    var html = '<div class="addPopItems' + p + '">';
        html += '<h4 class="modal-title radioColor" id="myModalLabel" style="font-size:24px;">';
        html += 'Request Number- ';
        if (userType == 1) {
            html += '<span style="font-size:24px;">' + protocolVal + '</span>';
        }           
        else if (userType == 2) {
            html += '<span style="font-size:24px;" class="protocolEditVal">' + viewCroResult.json_data.response.data[p].request_number + ' - <font>' + viewCroResult.json_data.response.data[p].protocol_number + '</font></span>';
        }
        else if (userType == 3) {
            html += '<span style="font-size:24px;" class="protocolEditVal">' + viewCroResult.json_data.response.data[p].request_number + ' - <font>' + viewCroResult.json_data.response.data[p].protocol_number + '</font></span>';
        }
        else if (userType == 4){
            html += '<span style="font-size:24px;">' + protocolVal + '</span>';
        }
            //Icf Type sitename
            if (viewCroResult.json_data.response.data[p].escalation_type_id == 4) {
                if (viewCroResult.json_data.response.data[p].escalation_sub_type_id == 3) {
                    html += '<br>'
                    html += '<span style="padding-right: 28px;font-size:24px;">' + viewCroResult.json_data.response.data[p].sitename + '</span>';
                }
            }
            else { //Budget and Contract Type
                html += '<br>';
                html += '<span style="padding-right: 28px;font-size:24px;">' + viewCroResult.json_data.response.data[p].sitename + '</span>';
            }

            if (userType == 2) {
                html += '<br>';
                html += '<div class="editPerform" id="">';
                    // Edit Protocol Button
                    if (managerType != 4) {
                        if(hamburgerType != "reassigned"){
                            if (p == 0) {
                                // cc email link not open
                                if(ccRquestId == false && hamburgerType != "archieve"){                                   
                                    html += '<a class="btn-info editPerformAction editProtocolClick" href="#" id="' + viewCroResult.json_data.response.data[p].request_id + '"> Edit Protocol</a>';       
                                }                     
                            }
                        }                
                    }     

                    // Perform Action Button
                    
                    if (managerType != 4) {                       
                        if (hamburgerType !== "reassigned" && hamburgerType !== "archieve") {                           
                            if ((viewCroResult.json_data.response.data[p].resolution_date === null || viewCroResult.json_data.response.data[p].resolution_date === "0000-00-00 00:00:00") && viewCroResult.json_data.response.data[p].action_flag !== 2) {
                               // cc email link not open                                                      
                               if(ccRquestId == false){  
                                if (request_number == viewCroResult.json_data.response.data[p].request_number) { 
                                    html += '<a class="btn-info performAction performClick" href="#" id="' + viewCroResult.json_data.response.data[p].request_number + '" style="margin-right: 13px;"> Perform Action</a>';
                                }                                                      
                                
                                    
                                }
                          
                            }
                            else {
                                if (request_number == viewCroResult.json_data.response.data[p].request_number) { 
                                    html += '<a class="btn-info performAction performClick" href="#" id="' + viewCroResult.json_data.response.data[p].request_number + '" style="margin-right: 13px;"> Perform Action</a>';
                                }  
                           
                             }
                        }
                        
                    }
                    
                html += '</div>';
            }
            else if (userType == 3) {
                html += '<br>';
                html += '<div class="editPerform" id="">';
                    // Perform Action Button                   
                    if (managerType != 4) {
                        if (hamburgerType !== "reassigned" && hamburgerType !== "archieve") {                            
                            if ((viewCroResult.json_data.response.data[p].resolution_date === null || viewCroResult.json_data.response.data[p].resolution_date === "0000-00-00 00:00:00") && viewCroResult.json_data.response.data[p].action_flag !== 2) {
                                // cc email link not open
                                if(ccRquestId == false){      
                                    if (request_number == viewCroResult.json_data.response.data[p].request_number) { 
                                        html += '<a class="btn-info performAction performClick" href="#" id="' + viewCroResult.json_data.response.data[p].request_number + '" style="margin-right: 13px;"> Perform Action</a>';
                                    }                            
                                   
                                }
                            }
                        }  
                    }
                    if (viewCroResult.json_data.response.data[p].escalation_type_id == 4) {
                        if (hamburgerType !== "reassigned"  && hamburgerType !== "archieve"){
                            html += '<a class="btn-info performAction editProtocolClick" href="#" id="' + viewCroResult.json_data.response.data[p].request_id + '" style="margin-right: 13px;"> Edit Protocol</a>';
                        }            
                    }
                html += '</div>';
            }
            html += '<div class="modal-title radioColor" id="myModalLabel">';     
            
            html += '</div>';
        html += '</h4>';

        
    html += '</div>';
    
    /****** ICF Popup Start Here******/
    if (viewCroResult.json_data.response.data[p].escalation_type_id == 4) {
        html += '<div class="pageBorder fontTitle firstRow" id="">';
        //To which area does this request mostly related?
         html += '<p class="question text-uppercase text-bold titleTxt">To which area does this request mostly related?</p>'
            html += '<div class="row dropBoxClass">';
                html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                    html += '<div class="form-check floatLeft">'
                        html += '<label class="radionBtn">'
                            html += '<input type="radio" name="requestType" value="" checked style="display: none;"> <span class="label-text selectedRadio">Informed Consent Form Escalation</span>'
                        html += '</label>'
                    html += '</div>';
                html += '</div>';
            html += '</div>';

            //Type of review of escalation
            html += '<p class="question text-uppercase text-bold rowMargin">Type of review of escalation</p>';
            html += '<div class="row dropBoxClass">';
                html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                    html += '<div class="form-check floatLeft">';
                        html += '<label class="radionBtn">';
                        var icfArrPopup = new Array("Global master Informed Consent Form Legal Review", "Country Level Informed Consent Form Legal Escalation", "Site Level Informed Consent Form Legal Escalation");
                            if (viewCroResult.json_data.response.data[p].escalation_sub_type_id == 1) {
                                html += '<input type="radio" name="review" value="" checked style="display: none;"> <span class="label-text selectedRadio">' + icfArrPopup[0] + '</span>'
                            }
                            else if (viewCroResult.json_data.response.data[p].escalation_sub_type_id == 2) {
                                 html += '<input type="radio" name="review" value="" checked style="display: none;"> <span class="label-text selectedRadio">' + icfArrPopup[1] + '</span>'
                            }
                            else if (viewCroResult.json_data.response.data[p].escalation_sub_type_id == 3) {
                                html += '<input type="radio" name="review" value="" checked style="display: none;"> <span class="label-text selectedRadio">' + icfArrPopup[2] + '</span>'
                            }
                        html += '</label>'
                    html += '</div>';
                html += '</div>';
            html += '</div>';
         
        html += '</div>';

	   var studyDetailArr = new Array("1. Protocol Number", "2. Site Name", "3. Country", "4. Raised by", "5. Principal Investigator", "6. Requested by","7. CC");
	 
			 var h;      
			 if(viewCroResult.json_data.response.data[p].escalation_sub_type_id == 1)//This code for ICF first option
			 {
				 //ENTER STUDY DETAILS
				  html += '<div class="pageBorder rowMargin" id="">';
				  html += '<p class="studyTitle fontTitle">ENTER STUDY DETAILS</p>';
					html += '<div class="row dropBoxClass site-box">';
					 html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
						  var studyArr = new Array("Protocol Number","CC");
							for (var h = 0; h < studyArr.length; h++)
							{
								html += '<div class="col-xs-6 col-sm-6 col-lg-6 selectContainer protocolNumber" id="">';  
								 html += '<span class="optionVal">'+studyArr[h]+'</span>';
								 if(h == 0){
                                    if (userType == 3) {
                                        if(hamburgerType != "reassigned"){   
                                            html += '<input type="text" class="protocolVal inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].protocol_number + '" placeholder="" disabled>';   
                                            html += '<div class="chooseProtocolPopUp" id="chooseProtocolPopUp" style="display:none;">';
                                                html += '<div class="attachSelect" id="">';
                                                    html += '<select class="selectpicker selectProtocol" id="selectProtocolId" name="selValue" data-show-subtext="true" data-live-search="true" style="display: none;" disabled>';
                                                    html += '<option data-subtext="" value="">' + viewCroResult.json_data.response.data[p].protocol_number + '</option>';
                                                    html += '</select>';
                                                html += '</div>';
                                            html += '</div>';
                                        }
                                        else {
                                            html += '<input type="text" class="protocolVal inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].protocol_number + '" placeholder="" disabled>';
                                        }
                                    }
                                    else {
                                        html += '<input type="text" class="protocolVal inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].protocol_number + '" placeholder="" disabled>';
                                    } 
								 }
								 else{
									  html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].cc_email + '" placeholder="" disabled>';
								 }
								html += '</div>';							
							}
					 html += '</div>';
					html += '</div>';
				  html += '</div>';
				  
				  //SELECT THE REGION WITH THE MAJORITY OF PARTICIPATING SITES
					html += '<div class="pageBorder fontTitle rowMargin" id="">';
					 html += '<p class="studyTitle fontTitle">SELECT THE REGION WITH THE MAJORITY OF PARTICIPATING SITES</p>';
					  html += '<div class="row dropBoxClass">';
					   html += '<div class="col-xs-6 col-sm-6 col-lg-6" id="">'
						html += '<input type="text" class="" value="' + viewCroResult.json_data.response.data[p].region_name + '" placeholder="" disabled>';
					   html += '</div>';
					  html += '</div>';
					html += '</div>';
					
					//ADD THE FOLLOWING ATTACHMENT(S)
					var attachmentOptionsArr = new Array("1. Global Master ICF template (required)", "2. Protocol (required)", "3. Other relevant document(s) (optional)");   
		
					html += '<div class="pageBorder fontTitle rowMargin" id="">';			 
						 html += '<p class="studyTitle fontTitle">Add the following attachment(s)</p>';
						 html += '<div class="row">';
						   for (var u = 0; u < attachmentOptionsArr.length; u++) {
								html += '<div class="col-xs-12 col-sm-12 col-lg-12 icfRadioTitle icfRadioContainer" id="">';
								 html += '<span class="">' + attachmentOptionsArr[u] + '</span>';
								  html += '<div class="imgListAdd'+u+'" style=""></div>'
								html += '</div>';
						   }
						html += '</div>';
					html += '</div>';
			 }
			 if(viewCroResult.json_data.response.data[p].escalation_sub_type_id == 2)////This code for ICF second Country Level option
			 {
				 html += '<div class="pageBorder firstRow" id="">';
				  html += '<p class="studyTitle fontTitle">ENTER STUDY DETAILS</p>';
					html += '<div class="row dropBoxClass site-box">';
					 html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
						  var studyArr = new Array("Protocol Number","Country","CC");
							for (h = 0; h < studyArr.length; h++)
							{
								html += '<div class="col-xs-6 col-sm-6 col-lg-6 selectContainer protocolNumber" id="">';  
								 html += '<span class="optionVal">'+studyArr[h]+'</span>';
								 if(h == 0){
                                    if (userType == 3) {
                                        if(hamburgerType != "reassigned"){      
                                            html += '<input type="text" class="protocolVal inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].protocol_number + '" placeholder="" disabled>';   
                                            html += '<div class="chooseProtocolPopUp" id="chooseProtocolPopUp" style="display:none;">';
                                                html += '<div class="attachSelect" id="">';
                                                    html += '<select class="selectpicker selectProtocol" id="selectProtocolId" name="selValue" data-show-subtext="true" data-live-search="true" style="display: none;" disabled>';
                                                    html += '<option data-subtext="" value="">' + viewCroResult.json_data.response.data[p].protocol_number + '</option>';
                                                    html += '</select>';
                                                html += '</div>';
                                            html += '</div>';
                                        }
                                        else {
                                            html += '<input type="text" class="protocolVal inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].protocol_number + '" placeholder="" disabled>';
                                        }
                                    }
                                    else {
                                        html += '<input type="text" class="protocolVal inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].protocol_number + '" placeholder="" disabled>';
                                    } 
								 }
								 else if(h == 1){
									 html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].country_name + '" placeholder="" disabled>';
								 }
								 else{
									  html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].cc_email + '" placeholder="" disabled>';
								 }
								html += '</div>';							
							}
					 html += '</div>';
					html += '</div>';
				  html += '</div>';
				  
				  var sectionArr = new Array("Leaving the study","Cost, Expenses and Payments","Confidentialy","Potenial Risks and Discomforts","Compensation and Treatment for injury","Authorization/Privacy(U.S. only)","ICF Volunteer Statement","Blood and other Samples","Others");
				  
				  html += '<div class="pageBorder fontTitle rowMargin" id="">';
			       html += '<p class="question text-uppercase text-bold titleTxt">Section requiring legal review</p>'
				   
				   html += '<div class="" style="">'
					for(var k=0;k<viewCroResult.json_data.response.data[p].section_requiring_legal_review.length;k++)
					{                   
						if(sectionArr[viewCroResult.json_data.response.data[p].section_requiring_legal_review[k]] != undefined)
						{
						   html += '<div class="row dropBoxClass">';
							html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                             html += '<div class="form-check floatLeft">'
                             html += '<div class="checkbox checkbox-primary">';
                                html+='<input id="checkbox'+k+'" value="" type="checkbox" checked disabled>'
                                html+='<label for="checkbox'+k+'">'+sectionArr[viewCroResult.json_data.response.data[p].section_requiring_legal_review[k]]+'</label>'
                             html+='</div>'
							html += '</div>';
						   html += '</div>';
					      html += '</div>';   
						}
					}              
				  html += '</div>'
				  
				 html += '</div>';
				 
				 var textArr = new Array("If any of the changes are required based on change in regulation or law, you must specify and provide relevant documentation.","If any of the changes are based on Ethics Committee(EC) or Institutional Review Board(IRB) feedback, Please specify and provide relevant documentation.","Any other details")
                
                  //TextAreas attached
                    html += '<div class="pageBorder fontTitle" id="">';
                        for(var g=0;g<textArr.length;g++){
                            html+= '<div class="textInput" id="txtAreaId'+g+'">';
                                html += '<p class="studyTitle topMargin text-uppercase">'+textArr[g]+'</p>';
                                if(g==0){
                                    html += '<div class="summernote" disabled>'+viewCroResult.json_data.response.data[p].specify_relevant_document+'</div>';	
                                }
                                else if(g==1){
                                    html += '<div class="summernote" disabled>'+viewCroResult.json_data.response.data[p].EC_IRB_feedback+'</div>';	 
                                }
                                else{
                                    html += '<div class="summernote" disabled>'+viewCroResult.json_data.response.data[p].any_other_detail+'</div>';	 
                                }						
                            html += '</div>';
                        }
                    html += '</div>';
              
                    //Add the following attachment(s)
                    html += '<div class="pageBorder fontTitle rowMargin" id="">';//This code for ICF second
                    html += '<p class="studyTitle text-uppercase">Add the following attachment(s)</p>';
                    
                    var attArrPopup = new Array("1. Country ICF(required)","2. Other relevant document(s) (optional)");                  
                        html += '<div class="row">';
                        for (var u = 0; u < attArrPopup.length; u++){
                                html += '<div class="col-xs-12 col-sm-12 col-lg-12 icfRadioTitle icfRadioContainer" id="">';
                                html += '<span class="">' + attArrPopup[u] + '</span>';
                                html += '<div class="imgListAdd'+u+'" style=""></div>'
                                html += '</div>';
                        }
                        html += '</div>';				
                    html += '</div>';
			 }
			 
			 // ICF Site
			 if(viewCroResult.json_data.response.data[p].escalation_sub_type_id == 3)//This code for ICF third option(SLI)
			 {
                //ENTER STUDY DETAILS
				var studyArr = new Array("Protocol Number", "Site Name", "Country","Principal Investigator", "CC");
				html += '<div class="pageBorder firstRow" id="">';
				  html += '<p class="studyTitle fontTitle">ENTER STUDY DETAILS</p>';
					html += '<div class="row dropBoxClass site-box">';
					 html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                        for (h = 0; h < studyArr.length; h++)
                        {
                            html += '<div class="col-xs-6 col-sm-6 col-lg-6 selectContainer protocolNumber" id="">';  
                            html += '<span class="optionVal">'+studyArr[h]+'</span>';
                                
                                if(h == 0){
                                    if (userType == 3) {
                                        if(hamburgerType != "reassigned"){      
                                            html += '<input type="text" class="protocolVal inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].protocol_number + '" placeholder="" disabled>';   
                                            html += '<div class="chooseProtocolPopUp" id="chooseProtocolPopUp" style="display:none;">';
                                                html += '<div class="attachSelect" id="">';
                                                    html += '<select class="selectpicker selectProtocol" id="selectProtocolId" name="selValue" data-show-subtext="true" data-live-search="true" style="display: none;" disabled>';
                                                    html += '<option data-subtext="" value="">' + viewCroResult.json_data.response.data[p].protocol_number + '</option>';
                                                    html += '</select>';
                                                html += '</div>';
                                            html += '</div>';
                                        }
                                        else {
                                            html += '<input type="text" class="protocolVal inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].protocol_number + '" placeholder="" disabled>';
                                        }
                                    }
                                    else {
                                        html += '<input type="text" class="protocolVal inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].protocol_number + '" placeholder="" disabled>';
                                    } 
                                }
                                else if(h == 1){
                                    html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].sitename + '" placeholder="" disabled>';
                                }
                                else if(h == 2){
                                    html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].country_name + '" placeholder="" disabled>';
                                }
                                else if(h == 3){
                                    html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].principle_investigator + '" placeholder="" disabled>';
                                }								 
                                else{
                                    html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].cc_email + '" placeholder="" disabled>';
                                }
                            html += '</div>';							
                        }
					 html += '</div>';
					html += '</div>';
				html += '</div>';
				 
				//Check box
				var sectionArr = new Array("Leaving the study","Cost, Expenses and Payments","Confidentialy","Potenial Risks and Discomforts","Compensation and Treatment for injury","Authorization/Privacy(U.S. only)","ICF Volunteer Statement","Blood and other Samples","Others");
			 
                html += '<div class="pageBorder fontTitle rowMargin" id="">';
                html += '<p class="question text-uppercase text-bold titleTxt">Section requiring legal review</p>'
                
                    html += '<div class="" style="">'
                  
                    for(var k=0;k<viewCroResult.json_data.response.data[p].section_requiring_legal_review.length;k++)
                    {                   
                        if(sectionArr[viewCroResult.json_data.response.data[p].section_requiring_legal_review[k]] != undefined)
                        {
                        html += '<div class="row dropBoxClass">';
                            html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                            html += '<div class="form-check floatLeft">'
                             html += '<div class="checkbox checkbox-primary">';
                                html+='<input id="checkbox'+k+'" value="" type="checkbox" checked disabled>'
                                html+='<label for="checkbox'+k+'">'+sectionArr[viewCroResult.json_data.response.data[p].section_requiring_legal_review[k]]+'</label>'
                             html+='</div>'
                            html += '</div>';
                        html += '</div>';
                    html += '</div>';                       
                        }
                    }               
                   
                    html += '</div>'
                    
                html += '</div>';
			 
                //TextAreas attached
                var textAreaArr = new Array("If any of the changes are based on Ethics Committee(EC) or Institutional Review Board(IRB) feedback, Please specify and provide relevant documentation.", "Any other details");   
                html += '<div class="pageBorder fontTitle" id="">';
                    for(var g=0;g<textAreaArr.length;g++)
                    {	
                    html+= '<div class="textInput" id="txtAreaId'+g+'">';
                        html += '<p class="studyTitle topMargin text-uppercase">'+textAreaArr[g]+'</p>';
                        if(g==0)
                        {
                            html += '<div class="summernote descTextArea' + g + ' descArea" disabled>' + viewCroResult.json_data.response.data[p].EC_IRB_feedback+ '</div>'
                        }
                        else if(g==1)
                        {
                            html += '<div class="summernote descTextArea' + g + ' descArea" disabled>' + viewCroResult.json_data.response.data[p].any_other_detail+ '</div>'
                        }				 
                    html += '</div>';					
                    }
                html += '</div>';
			 
				//Attachments
                html += '<div class="pageBorder fontTitle rowMargin" id="">';//This code for ICF second
                    html += '<p class="studyTitle text-uppercase">Add the following attachment(s)</p>';
                    var attArrPopup = new Array("1. Site ICF(required)","2. Other relevant document(s) (optional)");
    
                    
                        html += '<div class="row">';
                        for (var u = 0; u < attArrPopup.length; u++) {
                            html += '<div class="col-xs-12 col-sm-12 col-lg-12 icfRadioTitle icfRadioContainer" id="">';
                                html += '<span class="">' + attArrPopup[u] + '</span>';
                                html += '<div class="imgListAdd'+u+'" style=""></div>';
                            html += '</div>';
                        }
                    html += '</div>';				
                html += '</div>';
			 }				
    }
    else{       
        if (p == 0) {
          html += '<div class="pageBorder fontTitle firstRow" id=""><p class="question text-uppercase text-bold titleTxt">To which area does this request mostly related?</p>';
         
          var _id = parseInt(viewCroResult.json_data.response.data[p].escalation_type_id)-1;
          
           html += '<div class="row dropBoxClass">';
            html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                html += '<div class="form-check floatLeft">'
                    html += '<label class="radionBtn">'
                        html += '<input type="radio" name="requestType" value="" checked style="display:none;"> <span class="label-text selectedRadio">'+escalationResult.json_data.response[_id].name+'</span>'
                    html += '</label>'
                html += '</div>';
            html += '</div>';
           html += '</div>';

          html += '</div>';

          var studyDetailArr = new Array("Protocol Number", "Site Name", "Country", "Raised By", "Principal Investigator", "Requested By", "CC", "Was this issue previously raised in the app and if so, should this be directed to specific Takeda Contract manager?");
          // ENTER STUDY DETAILS
          html += '<div class="pageBorder" id="inputStudyDetail">';
            html += '<p class="studyTitle fontTitle topMargin">ENTER STUDY DETAILS</p>';
             html += '<div class="row dropBoxClass site-box">';
              html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
              for (h = 0; h < studyDetailArr.length; h++) {
                if (h != 7) {
                    if(h == 6){
                        html += '<div class="col-xs-12 col-sm-12 col-lg-12 selectContainer" id="">';  
                         html += '<span class="optionVal ccLebal">' + studyDetailArr[h] + '</span>';
                       }
                       else{
                           html += '<div class="col-xs-6 col-sm-6 col-lg-6 selectContainer" id="">';  
                            html += '<span class="optionVal">' + studyDetailArr[h] + '</span>';
                       }  

                       if(h==0){  
                            if (userType == 2) {
                                if(hamburgerType != "reassigned"){                                  

                                    html += '<input type="text" class="protocolVal inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].protocol_number + '" placeholder="" disabled>';   
                                            html += '<div class="chooseProtocolPopUp" id="chooseProtocolPopUp" style="display:none;">';
                                        html += '<div class="attachSelect" id="">';
                                            html += '<select class="selectpicker selectProtocol" id="selectProtocolId" name="selValue" data-show-subtext="true" data-live-search="true" style="display: none;" disabled>';
                                            html += '<option data-subtext="" value="">' + viewCroResult.json_data.response.data[p].protocol_number + '</option>';
                                            html += '</select>';
                                        html += '</div>';
                                    html += '</div>';
                                }
                                else {
                                    html += '<input type="text" class="protocolVal inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].protocol_number + '" placeholder="" disabled>';
                                }
                            }
                            else {
                                html += '<input type="text" class="protocolVal inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].protocol_number + '" placeholder="" disabled>';
                            } 
                       }
                       else if(h==1){
                        html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].sitename + '" placeholder="" disabled>';
                       }
                       else if(h==2){
                        html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].country_name + '" placeholder="" disabled>';
                       }
                       else if(h==3){
                        html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].raised_by + '" placeholder="" disabled>';
                       }
                       else if(h==4){
                        html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].principle_investigator + '" placeholder="" disabled>';
                       }
                       else if(h==5){
                        html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].requested_by + '" placeholder="" disabled>';
                       }
                       else if(h==6){
                        html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response.data[p].cc_email + '" placeholder="" disabled>';
                       }
                       
                       html += '</div>';
                }
                else{
                  // Was this issue previously raised in the app and if so, should this be directed to specific Takeda Contract manager start here
                    html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                     html += '<span class="issueRaised">' + studyDetailArr[h] + '</span>';

                     html += '<div class="row dropBoxClass">';
                      html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                        html += '<div class="form-check floatLeft">'
                            html += '<label class="radionBtn">'
                            if (viewCroResult.json_data.response.data[p].followUp == 1) {
                                html += '<input type="radio" name="raised" value="" checked style="display: none;"> <span class="label-text selectedRadio">Yes</span>'
                            }
                            else{
                                html += '<input type="radio" name="raised" value="" checked style="display: none;"> <span class="label-text selectedRadio">No</span>'
                            }
                            html += '</label>'
                        html += '</div>';
                       html += '</div>';
                     html += '</div>';

                     if (viewCroResult.json_data.response.data[p].followUp != 0) {
                        var setManagerName = viewCroResult.json_data.response.data[p].escalation_first_name + " " + viewCroResult.json_data.response.data[p].escalation_last_name;
                        html += '<div class="row" style="" id="">';
                            html += '<div class="col-xs-6 col-sm-6 col-lg-6 text-left escalationFollowUpMain" id="">';
                            html += '<input type="text" class="escalationFollowUp" value="' + setManagerName + '" placeholder="Input value"  disabled>';
                            html += '</div>';
                        html += '</div>';
                    }

                    html += '</div>';
                }
               }

              html += '</div>';
            html += '</div>';
          html += '</div>';
        }

          //Issue types          
          var j;          
          //***Start budget Page Start Here***//          
            if (viewCroResult.json_data.response.data[p].escalation_type_id == 1) {
                html += '<div class="pageBorder" id="">';
                html += '<p class="question studyTitle fontTitle topMargin">Choose an issue type</p>';
                
                for (var j = 0; j < resultIssueType.json_data.message.length; j++) {     
                     
                    if (resultIssueType.json_data.message[j].issue == viewCroResult.json_data.response.data[p].choose_an_issue_name) {
                        html += '<div class="row issueTypes">';
                            html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                                html += '<div class="form-check floatLeft">'
                                    html += '<label class="radionBtn">'
                                        html += '<input type="radio" name="issueTypeRadio'+p+'" value="'+j+'" checked> <span id="issueTypeTxt'+j+'" class="label-text selectedRadio">'+resultIssueType.json_data.message[j].issue+'</span>'
                                    html += '</label>'
                                html += '</div>'
                            html += '</div>';
                        html += '</div>';	
                    }
                }      
                html += '</div>';
                
                        // Description of the issue
                        html += '<div class="pageBorder" id="">';
                        html += '<p class="studyTitle topMargin fontTitle">Description of the issue(Please specify whether inclusive of Overhead-if applicable)</p>';
                        html += '<div class="summernote descTextArea" disabled>'+viewCroResult.json_data.response.data[p].dsec_issue+'</div>';	

                        // Site Request Attach start here
                        html += '<div class="row site-box">';
                        
                            html += '<div class="col-xs-6 col-sm-6 col-lg-6" >';
                            html += '<span class="optionValTile">Site Request</span>';
                                html += '<input class="floatRight siteRText" type="text" id="" value="' + viewCroResult.json_data.response.data[p].site_request + '" placeholder="" disabled>';
                                html += '<input class="floatRight siteRText currencyTxT" type="text" id="" value="' + viewCroResult.json_data.response.data[p].currency_type + '" placeholder="" disabled>';
                            html += '</div>';

                            // Initial Offer Attach start here
                            html += '<div class="col-xs-6 col-sm-6 col-lg-6" >';
                            html += '<span class="optionValTile">Initial Offer</span>';                     
                                html += '<input class="floatRight initialText" type="text" id="" value="' + viewCroResult.json_data.response.data[p].initial_offer + '" placeholder="" disabled>';
                                html += '<input class="floatRight initialText currencyTxT" type="text" id="" value="' + viewCroResult.json_data.response.data[p].currency_type + '" placeholder="" disabled>';
                            html += '</div>';

                        html += '</div>';

                        // Percent over Initial Offer Attach start here
                        html += '<div class="row site-box">';
                            html += '<div class="col-xs-12 col-sm-12 col-lg-12" >';
                                html += '<span class="optionValTile">Percent over Initial Offer</span>';
                                html += '<input class="floatRight initialText" type="text" id="" value="' + viewCroResult.json_data.response.data[p].percent_initial + '" placeholder="" disabled>';	
                            html += '</div>';	
                        html += '</div>';
                        // Percent over Initial Offer Attach end here

                    html += '</div>';

                    html += '<div class="pageBorder" id="">';   
                        //FMV 75% BENCHMARK   
                        html += '<div class="row site-box">';
                        html += '<div class="col-xs-12 col-sm-12 col-lg-12" >';
                            html += '<span class="optionValTile">FMV 75% BENCHMARK</span>';
                            html += '<input class="floatRight banchmarkText inputDes" type="text" id="" value="' + viewCroResult.json_data.response.data[p].FMV_high + '" placeholder="" disabled>';
                            html += '<input class="floatRight initialText currencyTxT" type="text" id="" value="' + viewCroResult.json_data.response.data[p].currency_type + '" placeholder="" disabled>';
                        html += '</div>';
                        html += '</div>';

                        //PERCENT OVER FMV BENCHMARK
                        html += '<div class="row site-box">';
                        html += '<div class="col-xs-12 col-sm-12 col-lg-12" >';
                        html += '<span class="optionValTile">PERCENT OVER FMV BENCHMARK</span>';
                        html += '<input class="floatRight inputTxt" type="text" id="" value="' + viewCroResult.json_data.response.data[p].percent_FMV + '" placeholder="" disabled>';	
                        html += '</div>';
                        html += '</div>';

                    html += '</div>';

                    html += '<div class="pageBorder siteJustification" id="">';
                    //Site justification and negotiation history
                        html += '<p class="studyTitle topMargin fontTitle">Site justification and negotiation history</p>';
                        html += '<div class="summernote justification" disabled>' + viewCroResult.json_data.response.data[p].site_justification + '</div>';	
                    //Any other details
                        html += '<div class="otherDetails" id="">';
                            html += '<p class="studyTitle topMargin fontTitle">Any other details</p>';
                            html += '<div class="summernote details" disabled>' + viewCroResult.json_data.response.data[p].any_other_details + '</div>';	
                        html += '</div>';
                    html += '</div>';

                    html += '<div class="pageBorder" id="">';

                        html += '<div class="row site-box">';
                    //Do you want to add attachment start here
                        html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                        html += '<span class="addAttachment">Do you want to add attachment</span>';
                        html += '</div>';
                        html += '<div class="row previousIssue attachmentBtns">';
                                html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';

                                html += '<div class="form-check">'
                                    html += '<label class="radionBtn">'
                                    if(viewCroResult.json_data.response.data[p].add_attachment == 0){
                                        html += '<input type="radio" name="attachment" value="" checked> <span class="label-text selectedRadio">No</span>'                                       
                                    }
                                    else{
                                        html += '<input type="radio" name="attachment'+p+'" value="" checked> <span class="label-text selectedRadio">Yes</span>'
                                    }
                                    html += '</label>'
                                html += '</div>'

                                html += '</div>';
                        html += '</div>';
                        //attach images here
                        html += '<div class="imgListAdd' + p + '" style="overflow:hidden;"></div>';
                    html += '</div>';
                    // Do you want to add attachment end here

                    // High and Urgent Prority attachment div
                    html += '<div class="attachPrority' + p + '"></div>';

                    html += '</div>';
            }        
             //***Contract Language Escalation Start Here***//
            
            else if (viewCroResult.json_data.response.data[p].escalation_type_id == 2) {                
                var CTAHide = "";
                var selectCLE_Type = new Array("CTA", "CDA", "Others");
                html += '<div class="pageBorder select_CLE" id="">';
                html += '<p class="question studyTitle fontTitle text-uppercase topMargin">Select the Type of Contract Language Escalation</p>';
                for (j = 0; j < selectCLE_Type.length; j++) {
                    if (selectCLE_Type[j] == viewCroResult.json_data.response.data[p].type_contract_language) {
                        CTAHide = selectCLE_Type[j];
                        html += '<div class="row issueTypes">';
                            html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                                html += '<div class="form-check floatLeft">'
                                    html += '<label class="radionBtn">'
                                        html += '<input type="radio" name="selectCLE'+p+'" value="'+j+'" checked> <span id="issueTypeTxt'+j+'" class="label-text selectedRadio">'+viewCroResult.json_data.response.data[p].type_contract_language+'</span>'
                                    html += '</label>'
                                html += '</div>'
                            html += '</div>';
                        html += '</div>';	
                    }
                }
                html += '</div>';   
                
                   
                if(CTAHide == "CTA")
                {
                    html += '<div class="pageBorder" id="">';
                    html += '<p class="question studyTitle fontTitle topMargin">Choose an issue type</p>';
                    
                    for (j = 0; j < resultIssueType.json_data.message.length; j++) {
                       if (resultIssueType.json_data.message[j].issue == viewCroResult.json_data.response.data[p].choose_an_issue_name) {
                           html += '<div class="row issueTypes">';
                               html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                                   html += '<div class="form-check floatLeft">'
                                       html += '<label class="radionBtn">'
                                           html += '<input type="radio" name="issueTypeRadio'+p+'" value="'+j+'" checked> <span id="issueTypeTxt'+j+'" class="label-text selectedRadio">'+resultIssueType.json_data.message[j].issue+'</span>'
                                       html += '</label>'
                                   html += '</div>'
                               html += '</div>';
                           html += '</div>';	
                       }
                   }
                   html += '</div>';
                } 
                html += '<div class="pageBorder" id="">';
                 //ENTER DESCRIPTION OF CTA/ CDA/ OTHER ESCALATION(Include proposed or original language as applicable)
                 html += '<div class="proposed descriptionIssue" id="">';
                  html += '<p class="question studyTitle fontTitle text-uppercase topMargin">ENTER DESCRIPTION OF CTA/ CDA/ OTHER ESCALATION(Include proposed or original language as applicable)</p>';
                  html += '<div class="summernote descArea disabled">' + viewCroResult.json_data.response.data[p].proposed_language + '</div>';
                 html += '</div>'; 

                 //Provide Site Rationale
                 html += '<div class="ProvideRationale" id="">';
                  html += '<p class="question studyTitle fontTitle text-uppercase topMargin">Provide Site Rationale</p>';
                  html += '<div class="summernote descArea disabled">' + viewCroResult.json_data.response.data[p].site_rationale + '</div>';
                 html += '</div>'; 

                 html += '<div class="imgListAdd' + p + '" style="overflow:hidden;"></div>';

                  //Describe Attempts to Negotiate
                 html += '<div class="ProvideRationale" id="">';
                  html += '<p class="question studyTitle fontTitle text-uppercase topMargin">Describe Attempts to Negotiate</p>';
                  html += '<div class="summernote descArea disabled">' + viewCroResult.json_data.response.data[p].attempts_negotiate + '</div>';
                 html += '</div>'; 

                html += '</div>';  

                //Any other details
                html += '<div class="pageBorder otherDetails" id="">';
                 html += '<p class="question studyTitle fontTitle text-uppercase topMargin">Any other details</p>';
                 html += '<div class="summernote descArea disabled">' + viewCroResult.json_data.response.data[p].other_detail + '</div>';

                  // Is this request of High Priority i.e response needed within 48 hours or less start here
                 html += '<div class="attachPrority' + p + '"></div>';

                html += '</div>';    

            }
        
    }
    $('.formPrePopulate #checkListDiv').append(html);
    
    if (viewCroResult.json_data.response.data[p].escalation_type_id != 4) {
        // High and Urgent Prority function call
        attachHighPrority(viewCroResult, p)
    }

    $('.summernote').summernote(
    {
        tabsize: 2,
        disableDragAndDrop:true
    });   

    $('#summernote').summernote('disable');    
    $(".note-editable").attr("contenteditable", "false");
}

// High and Urgent Prority function
function attachHighPrority(viewCroResult, p){

  var html = '<div class="row site-box">';
    // Is this request of High Priority i.e response needed within 48 hours or less start here
     html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
      html += '<span class="priority">Is this request of High Priority i.e response needed within 48 hours or less?</span>';
     html += '</div>';

     html += '<div class="row previousIssue priorityType">';
      html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
      html += '<div class="form-check">'
         html += '<label class="radionBtn">'
         if(viewCroResult.json_data.response.data[p].highPriority == 0){
            html += '<input type="radio" name="priority'+p+'" value="" checked> <span class="label-text selectedRadio">No</span>'
         }
         else{
            html += '<input type="radio" name="priority'+p+'" value="" checked> <span class="label-text selectedRadio">Yes</span>'            
         }
         html += '</label>'
     html += '</div>'

      html += '</div>';
     html += '</div>';
     
     if (viewCroResult.json_data.response.data[p].selectPriority != 0) {
        html += '<div class="question-bg choosePriorityTxt">';

            html += '<div class="col-xs-12 col-sm-12 col-lg-12 text-right" id="">';
             html += '<p class="question priorityTitle">Choose the Priority</p>';
            html += '</div>';

            html += '<div class="col-xs-12 col-sm-12 col-lg-12 text-right urgentHigh" id="">';
            var prorityArr = new Array("High-response needed within 48 hours", "Urgent-response needed with 24 hours");

            html += '<div class="form-check">';
                html += '<label class="radionBtn">';
                var prorityArr = new Array("High-response needed within 48 hours", "Urgent-response needed with 24 hours");
                if (viewCroResult.json_data.response.data[p].selectPriority == 1) {
                    html += '<input type="radio" name="highUrgent'+p+'" value="" checked> <span class="label-text selectedRadio">'+prorityArr[0]+'</span>';
                }
                else{
                    html += '<input type="radio" name="highUrgent'+p+'" value="" checked> <span class="label-text selectedRadio">'+prorityArr[1]+'</span>';
                }
                html += '</label>';
            html += '</div>';    

            html += '</div>';

            if (viewCroResult.json_data.response.data[p].priorityReason !== null && viewCroResult.json_data.response.data[p].priorityReason !== '' && viewCroResult.json_data.response.data[p].priorityReason !== 'null') {
                html += '<div class="col-xs-12 col-sm-12 col-lg-12 addReasonDiv">';                            
                    html += '<p class="question priorityTitle">Enter the reason for choosing the priority</p>';   
                     html += '<div class="summernote details" disabled>' + viewCroResult.json_data.response.data[p].priorityReason + '</div>';                    
                html += '</div>';
            }

        html += '</div>';
     }

 html += '</div>';

 $('.attachPrority' + p).append(html);
}
/*****ICF Link attached in particular request number start here*****/
function attachLink(p, viewCroResult, setFileIds, setOption){       
    var html;
    if (viewCroResult.json_data.response.data[p].escalation_sub_type_id == 1) {        
        if (setOption == 'GlobalICF') {
            html = '<a class="linkTag" target="_blank" href="' + setFileIds + '">' + setFileIds + '</a></br>';
            $('.imgListAdd0').append(html);
        }
        if (setOption == 'ProtocolICF') {
            html = '<a class="linkTag" target="_blank" href="' + setFileIds + '">' + setFileIds + '</a></br>';
            $('.imgListAdd1').append(html);
        }        
        
    }
    else if (viewCroResult.json_data.response.data[p].escalation_sub_type_id == 2) {
        if (setOption == 'CountryICF') {
            html = '<a class="linkTag" target="_blank" style="position: absolute;" href="' + setFileIds + '">' + setFileIds + '</a></br>';
            $('.imgListAdd0').append(html);
        }
    }
    else if (viewCroResult.json_data.response.data[p].escalation_sub_type_id == 3) {
        if (setOption == 'SiteICF') {
            html = '<a class="linkTag" target="_blank" style="position: absolute;" href="' + setFileIds + '">' + setFileIds + '</a></br>';
            $('.imgListAdd0').append(html);
        }
    }
    $('a[href^="http://"]').each(function(){       
        var oldUrl = $(this).attr("href"); // Get current url       
        var newUrl = oldUrl.replace("http://", "https://"); // Create new url       
        $(this).attr("href", newUrl); // Set herf value
    });
    
}
/*****ICF Link attached in particular request number end here*****/
/*****Image attached in particular request number start here*****/
function imageAttachLogo(p, viewCroResult, setFileIds, setOption) {
    var setIDVal = '';
    if (setOption == '') {
        setIDVal = viewCroResult.json_data.response.data[p].attachment_file_ids;
    }
    else {
        setIDVal = setFileIds;
    }
    $.ajax({
        url: serviceHTTPPath + "attachmentIdsList",
        type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
        data: { attachmentIds: setIDVal },
        success: function (imgResult) {
            $('.imgListAdd a').remove();
            if (imgResult.json_data.response.length != undefined) {
                for (var u = 0; u < imgResult.json_data.response.length; u++) {
                    //ICF type images attach here
                    var html;
                    if (viewCroResult.json_data.response.data[p].escalation_type_id == 4) {
                        if (viewCroResult.json_data.response.data[p].escalation_sub_type_id == 1) {
                            if (setOption == 'GlobalICF') {
                                html = '<a class="linkTag" target="_blank" href="' + imgResult.json_data.response[u].link + '">' + imgResult.json_data.response[u].link + '</a></br>';
                                $('.imgListAdd0').append(html);
                            }
                            if (setOption == 'ProtocolICF') {
                                html = '<a class="linkTag" target="_blank" href="' + imgResult.json_data.response[u].link + '">' + imgResult.json_data.response[u].link + '</a></br>';
                                $('.imgListAdd1').append(html);
                            }
                            if (setOption == 'document') {
                                html = '<a class="linkTag" target="_blank" href="' + imgResult.json_data.response[u].link + '">' + imgResult.json_data.response[u].link + '</a></br>';
                                $('.imgListAdd2').append(html);
                            }
                        }
                        else if (viewCroResult.json_data.response.data[p].escalation_sub_type_id == 2) {
                            if (setOption == 'CountryICF') {
                                html = '<a class="linkTag" target="_blank" style="position: absolute;" href="' + imgResult.json_data.response[u].link + '">' + imgResult.json_data.response[u].link + '</a></br>';
                                $('.imgListAdd0').append(html);
                            }
                            if (setOption == 'document') {
                                html = '<a class="linkTag" target="_blank" style="position: absolute;" href="' + imgResult.json_data.response[u].link + '">' + imgResult.json_data.response[u].link + '</a></br>';
                                $('.imgListAdd1').append(html);
                            }
                        }
                        else if (viewCroResult.json_data.response.data[p].escalation_sub_type_id == 3) {
                            if (setOption == 'SiteICF') {
                                html = '<a class="linkTag" target="_blank" style="position: absolute;" href="' + imgResult.json_data.response[u].link + '">' + imgResult.json_data.response[u].link + '</a></br>';
                                $('.imgListAdd0').append(html);
                            }
                            if (setOption == 'document') {
                                html = '<a class="linkTag" target="_blank" style="position: absolute;" href="' + imgResult.json_data.response[u].link + '">' + imgResult.json_data.response[u].link + '</a></br>';
                                $('.imgListAdd1').append(html);
                            }
                        }
                    }
                    else {
                        //Budget  and Contract type images attach here
                        html = '<a class="linkTag" target="_blank" style="margin-bottom: 0;" href="' + imgResult.json_data.response[u].link + '">' + imgResult.json_data.response[u].link + '</a></br>';
                        $('.imgListAdd' + p).append(html);
                    }


                    if (u == imgResult.json_data.response.length - 1) {
                        if (p == viewCroResult.json_data.response.data.length - 1) {
                            loaderRemoveFun();
                            $('#myModal').modal();
                        }
                        else {
                            p = parseInt(p) + 1;
                            imageAttachLogo(p, viewCroResult, setFileIds, setOption);
                        }
                    }
                }
            }
            else {
                if (p == viewCroResult.json_data.response.data.length - 1) {
                    loaderRemoveFun();
                    $('#myModal').modal();
                }
                else {
                    p = parseInt(p) + 1;
                    imageAttachLogo(p, viewCroResult, setFileIds, setOption);
                }
            }

        },
        error: function (e) {
            loaderRemoveFun();
            return;
        }
    });

}
/*****Image attached in particular request number end here*****/
function attachEditProtocol(requestId, selectUserId, request_number,escalationTypeId) {
      $('#checklistModel .chooseProtocolPopUp input').keyup(function (e) {
        $.ajax({
            url: serviceHTTPPath + "listProtocols",
            type: "POST",
            dataType: 'json',
            headers: {
                "authorization": window.localStorage.getItem("token_id")
            },
            data:
                {
                    protocol_name: $('#checklistModel .chooseProtocolPopUp .selectProtocol input').val()
                },
            success: function (protocolResult) {
                loaderRemoveFun();
                if (protocolResult.json_data.response.length != 'undefined') {
                    $('#checklistModel .chooseProtocolPopUp .selectProtocol ul.selectpicker li').remove();

                    $('#checklistModel .chooseProtocolPopUp #selectProtocolId option').remove();
                    var html = '';
                    var html2 = '';
                    for (var i = 0; i < protocolResult.json_data.response.length; i++) {

                        html += '<li data-original-index="' + i + '"><a tabindex="0" class="" data-normalized-text="<span class=&quot;text&quot;>' + protocolResult.json_data.response[i].protocol_number + '<small class=&quot;muted text-muted&quot;></small></span>"><span class="text">' + protocolResult.json_data.response[i].protocol_number + '<small class="muted text-muted"></small></span></a></li>';

                        html2 += '<option data-subtext="" value="' + i + '">' + protocolResult.json_data.response[i].protocol_number + '</option>';

                    }

                    $('#checklistModel .chooseProtocolPopUp .selectProtocol ul.selectpicker').append(html);
                    $('#checklistModel .chooseProtocolPopUp #selectProtocolId').append(html2);

                    if (protocolResult.json_data.response.length >= 10) {
                        $('#checklistModel #chooseProtocolPopUp ul').css("height", 175);
                        $('#checklistModel #chooseProtocolPopUp ul').css("overflow", "auto");
                    }
                    else {
                        $('#checklistModel #chooseProtocolPopUp ul').css("height", "auto");
                    }

                    $('#checklistModel #chooseProtocolPopUp li').click(function (e) {
                        var index = $(this).index();
                        var protocolId = protocolResult.json_data.response[index].protocol_id;
                        var protocolNumber = protocolResult.json_data.response[index].protocol_number;

                        $('#checklistModel .chooseProtocolPopUp .selectProtocol .filter-option').text(protocolNumber);

                        $('.protocolEditVal font').text('');

                        $('.protocolEditVal font').text(protocolNumber);
                        $('#chooseProtocolPopUp').css("background-color", "#ccc");

                        $('#chooseProtocolPopUp').css("display","none");
                        $('.protocolVal').css("display","inline-block");
                    
                        $('.protocolVal').val(protocolNumber)
                        $('#checklistModel .chooseProtocolPopUp .selectpicker').attr('disabled', true);
                        
                       
                        /*****Update protocol start here*****/
                        loaderLogin();
                        $.ajax({
                            url: serviceHTTPPath + "updateProtocolId",
                            type: "POST",
                            dataType: 'json',
                            headers: {
                                "authorization": window.localStorage.getItem("token_id")
                            },
                            data: {
                                request_id: requestId,
                                protocol_id: protocolId
                            },
                            success: function (response) {
                                loaderRemoveFun();
                                var msg = response.json_data.message;
                                if (response.json_data.response == 1) {
                                    alertScreenEditProtocol(msg,"");

                                    var fromDate =  $("#datepicker").val();
                                    var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( fromDate ) );
                                    
                                    var toDate = $("#toDatepicker").val(); 
                                    var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ) );    
                                                           
                                   
                                   if(escalationTypeId == 4){
                                    var selected_userId = $('.managerName').attr('id');                                    
                                    loadLegalData(fromDateNewFormat, todateNewFormat,selected_userId,"dashboard");
                                   }else{    
                                    var selected_userId = $('.managerTypeDropDown select[name=managerType]').val();                               
                                    escalationMService(fromDateNewFormat, todateNewFormat,selected_userId,"dashboard");
                                   }
                                   
                                }
                                else {
                                    alertScreenEditProtocol(msg,"");
                                }
                            },
                            error: function (e) {
                                loaderRemoveFun();
                                return;
                            }
                        });
                        /*****Update protocol end here*****/
                    });
                }
            },
            error: function (e) {
                loaderRemoveFun();
                return;
            }

        });
    })

}