
function icfAssginmentPage(userType){
  loaderLogin();
  if(window.localStorage.getItem('userType') != null){ 
    icfRadioOptions(userType,"BUDGET"); 
    //ICF Table Header
    var header = new Array("Issue","Protocol","Country","Region", "Email", "Action");
    attachICFTable(header);

    //ICF Table body
    icfAssignmentList(1,0,userType);
  }else{
    location.href = "../index.html";
  }
}
var icfDataArr;
function icfRadioOptions(userType,selectedRadio){
  var arr;
  if(userType == 2){
    arr = new Array("BUDGET","CONTRACT");
    icfDataArr = [{"icfId":0,"formId":1,"index":0,"name":"BUDGET","tHeader":["Issue","Protocol","Country","Region", "Email", "Action"]},
    {"icfId":0,"formId":2,"index":1,"name":"CONTRACT","tHeader":["Issue","Protocol","Country","Region", "Email", "Action"]}];
  }else{
    arr = new Array("BUDGET","CONTRACT","ICF GLOBAL", "ICF COUNTRY", "ICF SITE", "ICF OTHER");
    icfDataArr = [{"icfId":0,"formId":1,"index":0,"name":"BUDGET","tHeader":["Issue","Protocol","Country","Region", "Email", "Action"]},
    {"icfId":0,"formId":2,"index":1,"name":"CONTRACT","tHeader":["Issue","Protocol","Country","Region", "Email", "Action"]},
    {"icfId":1,"formId":4,"index":2,"name":"ICF GLOBAL","tHeader":["Region", "Email", "Action"]},
    {"icfId":2,"formId":4,"index":3,"name":"ICF COUNTRY","tHeader":["Protocol", "Country", "Email", "Action"]},
    {"icfId":3,"formId":4,"index":4,"name":"ICF SITE","tHeader":["Protocol", "Country", "Email", "Action"]},
    {"icfId":4,"formId":4,"index":5,"name":"ICF OTHER","tHeader":["Email", "Action"]}];
  }
  $('.icfRadioOption .ICFRadioBtn').remove();
  var html = '<div class="ICFRadioBtn">';
      html += '<div class="row">';
      for (var i = 0; i < arr.length; i++) {
        var setVal=i+1;
        html += '<div class="form-check userStatusDiv">';                          
          html += '<label class="radionBtn">';
          if(arr[i] == selectedRadio){
            html += '<input type="radio" name="status" id="'+icfDataArr[i].icfId+'" value="'+icfDataArr[i].formId+'" checked> <span class="label-text statusTxt'+i+'" style="color:#4c9bcf;">'+arr[i]+'</span>'
          }
          else{
            html += '<input type="radio" name="status" id="'+icfDataArr[i].icfId+'" value="'+icfDataArr[i].formId+'"> <span class="label-text statusTxt'+i+'">'+arr[i]+'</span>'
          }                                                
          html += '</label>';
        html += '</div>';
      }
      html += '</div>';
      html += '</div>';

  $('.icfRadioOption').append(html);
  
  //Icf radio buttons click event
  $('.icfRadioOption .radionBtn input[type=radio]').on('change', function () {		
    var radioButtons = $('.icfRadioOption .radionBtn input:radio[name="status"]');
    var index = radioButtons.index(radioButtons.filter(':checked'));
  
    var issueType = $('.icfRadioOption .radionBtn .statusTxt'+index).text();
            
    for (l = 0; l < arr.length; l++) {
      $('.icfRadioOption .radionBtn .statusTxt' + l).css("color", "#333");
    }		
    $('.icfRadioOption .radionBtn .statusTxt' + index).css("color", "#4c9bcf");
  
    attachICFTable(icfDataArr[index].tHeader);
    var getId= icfDataArr[index].icfId;
    var formId= icfDataArr[index].formId;
    if(index == 5){
      $('.ICFSearchDiv').css("display","none");
      icfOthersList(formId,getId,userType);
    }else{
      $('.ICFSearchDiv').css("display","block");
      icfAssignmentList(formId,getId,userType);
    }    
  });  
}
function icfOthersList(formId,icfFormId,userType){
  loaderLogin();
  $.ajax({
      url: serviceHTTPPath + "icfOthersList",
      type: "GET",
      dataType: 'json',
      headers: {
        "authorization": window.localStorage.getItem("token_id")
      },
      success: function (othersList) {
          loaderRemoveFun();
          //alert("success="+JSON.stringify(othersList))
          if (othersList.json_data.message == "Success") {
              tableTdDetail(icfFormId,formId,userType,othersList);
          }
      },
      error: function () {
          return;
      }
  });
}
function attachICFTable(header){
    $('.tableMainContainer #example1_wrapper').remove();
    $('.tableMainContainer #example1').remove();
    var html= '<table id="example1" class="table table-responsive display nowrap">';
        html += '<thead>';
            html += '<tr>';
            for (var i = 0; i < header.length; i++) {
                html += '<th>' + header[i] + '</th>';
            }
            html += '</tr>';
        html += '</thead>';

        html += '<tbody class="tbodyContainer" id="bodyUserManager">';   
        html += '</tbody>';

    html += '</table>';
    $('.tableMainContainer').append(html);
}
// Assign Button functionality
function openICFAssignPopup(result,id,setIndex,userType) {
  var assignArr;
  var formIdArr=new Array(1,2,4);
  var assignTitle='';
  if(userType == 2){
    assignArr = new Array("BUDGET","CONTRACT");
    assignTitle = "Assign Escalation Manager";
  }else{
    assignArr = new Array("BUDGET","CONTRACT","ICF");
    assignTitle = "Assign Legal Manager";
  }
 
    $('body .multiStep').remove();
    var html='<form class="modal multi-step multiStep assignModal" id="demo-modal-3">'
            html+='<div class="modal-dialog" style="width:625px;">'
                html+='<div class="modal-content">'
                    html+='<div class="modal-header">'
                      html += '<button type="button" class="close crossIcon"';
                        html += 'data-dismiss="modal">';
                          html += '<span aria-hidden="true">&times;</span>'		
                      html += '</button>';

                      html+='<h4 class="modal-title text-center text-uppercase">'+assignTitle+'</h4>'
                    html+='</div>'

                    //Step 1
                    html+='<div class="modal-body step-1 noPadding" data-step="1" id="detail">'
                        html+='<div class="headerDiv">'
                         html+='<p>User Assignment</p>'
                        html+='</div>'

                        // Drop Down Options
                        html+='<div class="assignContainer" id="">'
                        
                          //Assign radio option select dropdown                       
                          html+='<div class="container-login-form-btn" id="selectRequestType">'
                            html+='<div class="form-group row addUserContainer" style="z-index: 999;">'
                                html+='<label class="col-xs-4 control-label classTitle">Select Request Type<em class="required"> *</em></label>'
                                html+='<div class="col-xs-8 selectContainer">'
                                    html+='<div class="input-group" id="selectRequest">'    
                                                                        
                                    html+='<select name="assignRole" placeholder="Select Request Type"  class="form-control selectpicker" id="assignRoleSelect">'                                
                                      for (var k = 0; k < assignArr.length; k++) {
                                        var setVal = k+1;                                         
                                          html+='<option value="' + formIdArr[k] + '" id="'+k+'">' + assignArr[k] + '</option>'                                                                       
                                      }
                                    html+='</select>';
                                                                                                                  
                                    html+='</div>';
                                    html+='<span class="roleErrorTxt" style="color: red;"></span>';
                                html+='</div>';
                            html+='</div>';
                          html+='</div>';

                          //ICF Type dropdown        
                          html+='<div class="" id="assignCTAType"></div>'                           
                                                

                          //ICF Type dropdown        
                          html+='<div class="" id="assignICFType"></div>'

                          //Issue Type dropdown        
                          html+='<div class="" id="assignIssueType"></div>'  

                          //Protocol dropdown        
                          html+='<div class="" id="assignProtocol"></div>'

                          //Region dropdown        
                          html+='<div class="" id="assignRegion"></div>'

                          //Country dropdown        
                          html+='<div class="" id="assignCountry"></div>'
                         
                          if(userType == 2){
                            //Escalation Manager dropdown        
                            html+='<div class="" id="assigManager"></div>'
                          }   
                          else{
                            //Legal Manager dropdown        
                            html+='<div class="" id="legalManager"></div>'
                          }        
                         
                        html+='</div>'
                        
                    html+='</div>'

                    html+='<div class="modal-footer">';
                     html+='<button type="button" class="btn btn-primary step nextBtn step-1 addAssign" data-step="1" id="2">Assign</button>';
                    html+='</div>';
        html+='</div>';
      html+='</div>';
    html+='</form>';

  $('body').append(html);
  $('.multiStep').modal();

  $('.addAssign').click(function(){
    var setFormId = $('#assignRoleSelect').val();
    
    if(setFormId == 1 || setFormId == 2){
      if(setFormId == 2){
        if($('#ctaTypeSelect').val() !== '' && $('#ctaTypeSelect').val() !== null){
          if($('#issueTypeSelect').val() !== '' && $('#issueTypeSelect').val() !== null){      
            protocolReginCountry(setFormId,userType,result,id);
          }else{
            $('.issueTypeErrorTxt').text("Please select issue Type");
          }
        }else{
          $('.ctaErrorTxt').text("Please select CTA Type");
        }
      }
      else{
        if($('#issueTypeSelect').val() !== '' && $('#issueTypeSelect').val() !== null){      
          protocolReginCountry(setFormId,userType,result,id);
        }else{
          $('.issueTypeErrorTxt').text("Please select issue Type");
        }
      }
      
    }else{      
      if($('#icfTypeSelect').val() == 1){
          if($('#regionSelect').val() !== '' && $('#regionSelect').val() !== null){
              if($('.managerType').val() !== '' && $('.managerType').val() !== null){  
                if(result !=''){                 
                  editIcfAssignmentsFun(setFormId,userType,result,id);     
                }else{
                  saveIcfAssignmentsFun(setFormId,userType,result,id);
                }                
              }else{
                $('.managerErrorTxt').text("Please select manager");
              }
          }else{
            $('.regionErrorTxt').text("Please select region");
          }
      }else{
        protocolReginCountry(setFormId,userType,result,id);
      }
    }
  })
  
  $('select[name=assignRole]').val(setIndex);
  $('.selectpicker').selectpicker('refresh');

  if(setIndex == 4){
    setIndex = 3;
  }
  var icf_id = $('.icfRadioOption .radionBtn input:radio[name="status"]:checked').attr('id');  
  $('#assignRoleSelect').change(function(){  
    var index = $(this).val(); 
    clearErrorMsg();
    
    if(index == 2){
      $('#assignICFType #selectICF').remove();
      ctaOptions(index,userType,result,id);
      assignIssueTypeService(index,userType,result,id);
      protocolList(index,userType,result,id);
      listRegionsFun(index,userType,icf_id,result,id);
    
      var setCountryId = '';
      countryForAssign(index,userType,setCountryId,result,id);
      addManagerOption(index,userType,result,id);
    }
    else if(index == 4){      
      $('#assignCTAType #selectCTA').remove();
      $('#assignIssueType #selectIssue').remove();
      icfSubOptions(index,userType,icf_id,result,id);     
      addManagerOption(index,userType,result,id);
    }else{
      $('#assignCTAType #selectCTA').remove();
      $('#assignICFType #selectICF').remove();  
      
      assignIssueTypeService(index,userType,result,id);
      protocolList(index,userType,result,id);
      listRegionsFun(index,userType,icf_id,result,id);
    
      var setCountryId = '';
      countryForAssign(index,userType,setCountryId,result,id);
      addManagerOption(index,userType,result,id);
    }
  });

  addAssginValidations();

  // Assign drop down options
  if(setIndex <= 2){
    //assignIssueTypeService(setIndex,userType,result,id);
    if(setIndex == 2){
      ctaOptions(setIndex,userType,result,id);
    }else{
      assignIssueTypeService(setIndex,userType,result,id);
    }
 }else{
      icfSubOptions(setIndex,userType,icf_id,result,id);
  }
 
  if(icf_id == 1){
    listRegionsFun(setIndex,userType,icf_id,result,id);
    addManagerOption(setIndex,userType,result,id);
  }
  else{
    protocolList(setIndex,userType,result,id);
    listRegionsFun(setIndex,userType,icf_id,result,id);
    
    var setCountryId = '';
    countryForAssign(setIndex,userType,setCountryId,result,id);
    addManagerOption(setIndex,userType,result,id);
  }
} 
function protocolReginCountry(setFormId,userType,result,id){
  if($('#protocolSelect').val() !== '' && $('#protocolSelect').val() !== null){
    if($('#regionSelect').val() !== '' && $('#regionSelect').val() !== null){
      if($('#countrySelect').val() !== '' && $('#countrySelect').val() !== null){     
        if($('.managerType').val() !== '' && $('.managerType').val() !== null){
         
            if(result !=''){                 
              editIcfAssignmentsFun(setFormId,userType,result,id);     
            }else{
              saveIcfAssignmentsFun(setFormId,userType,result,id);
            }        
        }else{
          $('.managerErrorTxt').text("Please select manager");
        }
      }else{
        $('.countryErrorTxt').text("Please select country");
      }   
    }else{
      $('.regionErrorTxt').text("Please select region");
    }   
  }else{
    $('.protocolErrorTxt').text("Please select protocol");
  }
}
function clearErrorMsg(){
  $('.ctaErrorTxt').text("");
  $('.issueTypeErrorTxt').text("");
  $('.protocolErrorTxt').text("");
  $('.regionErrorTxt').text("");
  $('.countryErrorTxt').text("");
  $('.managerErrorTxt').text(""); 
}
function editIcfAssignmentsFun(form_id,userType,result,id){ 
 
  var icf_id = 0;
  if($('#icfTypeSelect').val() != undefined){
    icf_id = $('#icfTypeSelect').val()
  }

  var cta_type=0;
  if($('#selectCTA #ctaTypeSelect').val() != undefined){
    cta_type =my_implode_js(',',$('#selectCTA #ctaTypeSelect').val());
  }

  var issueType = 0;
  if($('#issueTypeSelect').val() != null){
    issueType = my_implode_js(',',$('#issueTypeSelect').val());
  }

  var region_id = 0;
  if($('#regionSelect').val() != null){
    region_id = my_implode_js(',',$('#regionSelect').val());
  }

  var country_id = 0;
  if($('#countrySelect').val() != null){
    country_id = my_implode_js(',',$('#countrySelect').val());
  }

  var protocol_id = 0;
  if($('#protocolSelect').val() != null){
    protocol_id = my_implode_js(',',$('#protocolSelect').val());
  }

  var legal_id = 0;
  if($('#legalSelectVal').val() != null){
    legal_id = my_implode_js(',',$('#legalSelectVal').val());
  }
  var escalation_manager_id = 0;
  if($('#managerSelect').val() != null){
    escalation_manager_id = my_implode_js(',',$('#managerSelect').val());
  }
  var assignmentId=id;
 
  loaderLogin();
  $.ajax({
      url: serviceHTTPPath + "editAssignments",
      type: "POST",
      dataType: 'json',
      headers: {
        "authorization": window.localStorage.getItem("token_id")
      }, 
      data:
      {
        assignment_id:assignmentId,
        form_id: form_id,
        icf_form_id: icf_id,
        cta_type:cta_type,
        issue_type: issueType,
        region_id: region_id,
        country_id: country_id,
        protocol_id: protocol_id,
        legal_id: legal_id,
        escalation_manager_id:escalation_manager_id,
      },
      success: function (result) {	
          //alert("success="+JSON.stringify(result));
          loaderRemoveFun();
          
          if(result.json_data.response == 1){
            assignICFAssignment(result.json_data.message,form_id,icf_id,userType);
          }else{
            alertScreen(result.json_data.message,'');
          }                            
      },
      error: function () {
        loaderRemoveFun();
        return;
      }
  });
}
function saveIcfAssignmentsFun(form_id,userType,result,id){ 
  var icf_id = 0;
  if($('#icfTypeSelect').val() != undefined){
    icf_id = $('#icfTypeSelect').val()
  }

  var cta_type=0;  
  if($('#selectCTA #ctaTypeSelect').val() != undefined){
    cta_type = my_implode_js(',',$('#selectCTA #ctaTypeSelect').val())
  }
  
  var issueType = 0;
  if($('#issueTypeSelect').val() != null){
    issueType = my_implode_js(',',$('#issueTypeSelect').val());
  }

  var region_id = 0;
  if($('#regionSelect').val() != null){
    region_id = my_implode_js(',',$('#regionSelect').val());
  }

  var country_id = 0;
  if($('#countrySelect').val() != null){
    country_id = my_implode_js(',',$('#countrySelect').val());
  }

  var protocol_id = 0;
  if($('#protocolSelect').val() != null){
    protocol_id = my_implode_js(',',$('#protocolSelect').val());
  }

  var legal_id = 0;
  if($('#legalSelectVal').val() != null){
    legal_id = my_implode_js(',',$('#legalSelectVal').val());
  }
  var escalation_manager_id = 0;
  if($('#managerSelect').val() != null){
    escalation_manager_id = my_implode_js(',',$('#managerSelect').val());
  }

  loaderLogin();
  $.ajax({
      url: serviceHTTPPath + "saveAssignments",
      type: "POST",
      dataType: 'json',
      headers: {
        "authorization": window.localStorage.getItem("token_id")
      }, 
      data:
      {
        form_id: form_id,
        icf_form_id: icf_id,
        cta_type:cta_type,
        issue_type: issueType,
        region_id: region_id,
        country_id: country_id,
        protocol_id: protocol_id,
        legal_id: legal_id,
        escalation_manager_id:escalation_manager_id,
      },
      success: function (result) {	
          //alert("success="+JSON.stringify(result));
          loaderRemoveFun();
          if(result.json_data.response == 1){
            assignICFAssignment(result.json_data.message,form_id,icf_id,userType);
          }else{
            alertScreen(result.json_data.message,'');
          }                            
      },
      error: function () {
        loaderRemoveFun();
        return;
      }
  });
}
function ctaOptions(index,userType,result,id){
  //CTA option select dropdown
  $('#assignCTAType #selectCTA').remove();
  var icfArr = new Array("CTA", "CDA", "OTHERS");
  var html ='<div class="container-login-form-btn" id="selectCTA">'
  html+='<div class="form-group row addUserContainer">'
      html+='<label class="col-xs-4 control-label classTitle">Select CTA Type<em class="required"> *</em></label>'
      html+='<div class="col-xs-8 selectContainer">'
          html+='<div class="input-group" id="ctaDiv">'     
                                         
          html+='<select name="ctaType" multiple="multiple" placeholder="Select CTA Type"  class="SlectBox form-control selectpicker" id="ctaTypeSelect" required>'
          
            for (var k = 0; k < icfArr.length; k++) {
              var setVal = k+1;                                     
              html+='<option value="' + icfArr[k] + '" id="'+setVal+'">' + icfArr[k] + '</option>'                                     
            }

          html+='</select>';
                                                                                        
          html+='</div>';
          html+='<span class="ctaErrorTxt" style="color: red;"></span>';
      html+='</div>';
  html+='</div>';
 html+='</div>';

 $('#assignCTAType').append(html);
 $('#assignIssueType #selectIssue').remove(); 
 if(result !=''){ 
    var arr=[];    
    for(var u=0;u<result.json_data.response.length;u++){
      if(result.json_data.response[u].id == id){       
        arr.push(result.json_data.response[u].cta_type)        
      }
      if(u==result.json_data.response.length-1){       
        $('#ctaTypeSelect').val(arr);      
      }
    }    
  }

  $('#ctaTypeSelect').on('change', function(){
    var selected = $(this).find("option:selected");  
    selected.each(function(){
      clearErrorMsg();
    });
  });
  $('#ctaTypeSelect').multiselect({
    allSelectedText: 'All', 
    includeSelectAllOption: true,  
    nonSelectedText: "Select CTA Type",    
    templates: { // Use the Awesome Bootstrap Checkbox structure
        li: '<li class="checkList"><a tabindex="0"><div class="aweCheckbox aweCheckbox-danger"><label for=""></label></div></a></li>'
    },      
    onChange: function(option, checked) {     
        clearErrorMsg();
        if($(option).is(':checked') ) {        
          if($(option).val() == "CTA"){
            assignIssueTypeService(index,userType,result,id);
          }
        }
        else{    
          if($(option).val() == "CTA"){
            $('#assignIssueType #selectIssue').remove();
          }   
        }
    }
  });
  multiselectCheck();
}
function icfSubOptions(setIndex,userType,icf_id,result,id){  
  //ICF option select dropdown
  $('#assignICFType #selectICF').remove();
  var icfArr = new Array("ICF GLOBAL", "ICF COUNTRY", "ICF SITE");
  
  var html ='<div class="container-login-form-btn" id="selectICF">'
      html+='<div class="form-group row addUserContainer">'
          html+='<label class="col-xs-4 control-label classTitle">Select ICF Type<em class="required"> *</em></label>'
          html+='<div class="col-xs-8 selectContainer">'
              html+='<div class="input-group" id="icfDiv">'                                        
              html+='<select name="icfSubRole" placeholder="Select ICF Type"  class="form-control selectpicker" id="icfTypeSelect">'

                for (var k = 0; k < icfArr.length; k++) {
                  var setVal = k+1;                                     
                  html+='<option value="' + setVal + '" id="'+k+'">' + icfArr[k] + '</option>'                                     
                }

              html+='</select>';
                                                                                            
              html+='</div>';
              html+='<span class="icfTypeErrorTxt" style="color: red;"></span>';
          html+='</div>';
      html+='</div>';
    html+='</div>';

  $('#assignICFType').append(html);

  $('select[name=icfSubRole]').val(icf_id);
  $('.selectpicker').selectpicker('refresh');

  if($('#icfTypeSelect').val() == 1){
    $('#assignProtocol #selectProtocol').remove();
    $('#assignCountry #selectCountry').remove();
  }else{    
  }
  $('#icfTypeSelect').on('change', function(){
    var selected = $(this).find("option:selected");  
    selected.each(function(){
      clearErrorMsg();
    });
  });
  $('#icfTypeSelect').change(function(){ 
     var index = $(this).val();
     clearErrorMsg();
     addManagerOption(index,userType,result,id);
     if(index == 1){
      $('#assignProtocol #selectProtocol').remove();
      $('#assignCountry #selectCountry').remove();
     }else{
      protocolList(setIndex,userType,result,id);
      listRegionsFun(setIndex,userType,icf_id,result,id);
    
      var setCountryId = '';
      countryForAssign(setIndex,userType,setCountryId,result,id);
     }
  });
  
}
// Issue Type Service
function assignIssueTypeService(formId,userType,result,id){ 
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
        assignIssueType(resultIssueType,formId,userType,result,id)						
      }else{
        alertScreen(resultIssueType.json_data.message,'')
      }      
    },
    error: function (e) {
      loaderRemoveFun();
      return;
    }
  });							
}
function assignIssueType(resultIssueType,form_id,userType,result,id){
  $('#assignIssueType #selectIssue').remove();
  var html='<div class="container-login-form-btn" id="selectIssue">';
        html+='<div class="form-group row addUserContainer">';
            html+='<label class="col-xs-4 control-label classTitle">Select Issue Type<em class="required"> *</em></label>';
            html+='<div class="col-xs-8 selectContainer">';
                html+='<div class="input-group" id="userSelect">';                                        
                  html+='<select name="userRole" multiple="multiple" placeholder="Select Role" id="issueTypeSelect" class="SlectBox" required>';

                  for (var k = 0; k < resultIssueType.json_data.message.length; k++) {   
                   
                    if(resultIssueType.json_data.message[k].form_id == 2){
                      if(resultIssueType.json_data.message[k].type == "CTA"){		
                        html+='<option value="' + resultIssueType.json_data.message[k].id + '" id="'+k+'">' + resultIssueType.json_data.message[k].issue + '</option>';
                      }
                    }else{
                      html+='<option value="' + resultIssueType.json_data.message[k].id + '" id="'+k+'">' + resultIssueType.json_data.message[k].issue + '</option>';
                    }
                  }

                  html+='</select>';                                                                                              
                html+='</div>';
                html+='<span class="issueTypeErrorTxt" style="color: red;"></span>';
            html+='</div>';
        html+='</div>';
    html+='</div>';
  $('#assignIssueType').append(html);
 
  if(result !=''){
    var arr=[];    
    for(var u=0;u<result.json_data.response.length;u++){
      if(result.json_data.response[u].id == id){
        arr.push(result.json_data.response[u].issue_type_id)        
      }
      if(u==result.json_data.response.length-1){       
        if(arr == ''){
          $('#assignIssueType #selectIssue').remove();
        }else{
          $('#issueTypeSelect').val(arr);
        }       
      }
    }    
  }

  $('#issueTypeSelect').on('change', function(){
    var selected = $(this).find("option:selected");  
    selected.each(function(){
      clearErrorMsg();
    });
  });

  $('#issueTypeSelect').multiselect({
    allSelectedText: 'All',    
    includeSelectAllOption: true,  
    nonSelectedText: "Select Issue Type",    
    templates: { // Use the Awesome Bootstrap Checkbox structure
        li: '<li class="checkList"><a tabindex="0"><div class="aweCheckbox aweCheckbox-danger"><label for=""></label></div></a></li>'
    },      
    onChange: function(option, checked) {
        clearErrorMsg();      
        if($(option).is(':checked') ) { 
        }
        else{        
        }
    }
  });
  multiselectCheck();

  if (resultIssueType.json_data.message.length >= 4) {
    $('#userSelect ul.multiselect-container').css("height", 175);
    $('#userSelect ul.multiselect-container').css("overflow", "auto");
  }
  else {
    $('#userSelect ul.multiselect-container').css("height", "auto");
  }
}
//Protocol Options
function protocolList(setIndex,userType,result,id) {
  var protocolVal = '';
  $.ajax({
      url: serviceHTTPPath + "listProtocols",
      type: "POST",
      dataType: 'json',
      headers: {
        "authorization": window.localStorage.getItem("token_id")
      },
      data: {
        protocol_name: protocolVal
      },
      success: function (protocolResult) {
        attachProtocolAssign(protocolResult, setIndex,userType,result,id);
      },
      error: function () {
          loaderRemoveFun();                
          return;
      }
  });
}
function attachProtocolAssign(protocolResult, setIndex,userType,result,id){
  $('#assignProtocol #selectProtocol').remove();
  var html='<div class="container-login-form-btn" id="selectProtocol">'
        html+='<div class="form-group row addUserContainer">'
            html+='<label class="col-xs-4 control-label classTitle">Select Protocol<em class="required"> *</em></label>'
            html+='<div class="col-xs-8 selectContainer">'
                html+='<div class="input-group" id="protocolDiv">'                                        
                  html+='<select name="region" multiple="multiple" placeholder="Select Role" id="protocolSelect" class="SlectBox" required>'

                  for (var k = 0; k < protocolResult.json_data.response.length; k++) {                       
                    html+='<option value="' + protocolResult.json_data.response[k].protocol_id + '" id="' + protocolResult.json_data.response[k].protocol_id + '">' + protocolResult.json_data.response[k].protocol_number  + '</option>'                             
                  }

                  html+='</select>';                                                                                              
                html+='</div>';
                html+='<span class="protocolErrorTxt" style="color: red;"></span>';
            html+='</div>';
        html+='</div>';
    html+='</div>';

  $('#assignProtocol').append(html);

  if(result !=''){
    var arr=[];    
    for(var u=0;u<result.json_data.response.length;u++){     
      if(result.json_data.response[u].id == id){
        arr.push(result.json_data.response[u].protocol_id)        
      }
      if(u==result.json_data.response.length-1){
        $('#protocolSelect').val(arr);
      }
    }    
  }

  $('#protocolSelect').on('change', function(){
    var selected = $(this).find("option:selected");  
    selected.each(function(){
      clearErrorMsg();
    });
  });

  $('#protocolSelect').multiselect({
    allSelectedText: 'All',    
    includeSelectAllOption: true,
    nonSelectedText: "Select Protocol",    
    templates: { // Use the Awesome Bootstrap Checkbox structure
        li: '<li class="checkList"><a tabindex="0"><div class="aweCheckbox aweCheckbox-danger"><label for=""></label></div></a></li>'
    },      
    onChange: function(option, checked) {
        clearErrorMsg();          
        if($(option).is(':checked') ) {               
                        
        }
        else{     
                     
        }
    }
  });
  multiselectCheck();

  if (protocolResult.json_data.response.length >= 4) {
    $('#protocolDiv ul.multiselect-container').css("height", 175);
    $('#protocolDiv ul.multiselect-container').css("overflow", "auto");
  }
  else {
    $('#protocolDiv ul.multiselect-container').css("height", "auto");
  }
}
//Region list display
function listRegionsFun(setIndex,userType,icf_id,result,id) {
  loaderLogin();
  $.ajax({
      url: serviceHTTPPath + "listRegions",
      type: "GET",
      dataType: 'json',
      headers: {
        "authorization": window.localStorage.getItem("token_id")
      }, 
      success: function (regionResult) {
          loaderRemoveFun();
          addRegionFun(regionResult,setIndex,userType,icf_id,result,id);
      },
      error: function () {
          loaderRemoveFun();
          return;
      }
  });
}
function addRegionFun(regionResult,setIndex,userType,icf_id,result,id){
  $('#assignRegion #selectRegion').remove();
  var html='<div class="container-login-form-btn" id="selectRegion">'
        html+='<div class="form-group row addUserContainer">'
            html+='<label class="col-xs-4 control-label classTitle">Select Region<em class="required"> *</em></label>'
            html+='<div class="col-xs-8 selectContainer">'
                html+='<div class="input-group" id="regionDiv">'                                        
                  html+='<select name="region" multiple="multiple" placeholder="Select Role" id="regionSelect" class="SlectBox" required>'

                  for (var k = 0; k < regionResult.json_data.response.data.length; k++) {                       
                    html+='<option value="' + regionResult.json_data.response.data[k].id + '" id="' + regionResult.json_data.response.data[k].id + '">' + regionResult.json_data.response.data[k].name  + '</option>'                             
                  }

                  html+='</select>';                                                                                              
                html+='</div>';
                html+='<span class="regionErrorTxt" style="color: red;"></span>';
            html+='</div>';
        html+='</div>';
    html+='</div>';

  $('#assignRegion').append(html);
  if(result !=''){
    var arr=[];    
    for(var u=0;u<result.json_data.response.length;u++){
      if(result.json_data.response[u].id == id){
        arr.push(result.json_data.response[u].region_id)
      }      
      if(u==result.json_data.response.length-1){
        $('#regionSelect').val(arr);
      }
    }    
  }
  
  $('#regionSelect').on('change', function(){
    var selected = $(this).find("option:selected");  
    selected.each(function(){
      clearErrorMsg();
    });
  });

  $('#regionSelect').multiselect({    
    allSelectedText: 'All',    
    includeSelectAllOption: true,
    nonSelectedText: "Select Region",    
    templates: { // Use the Awesome Bootstrap Checkbox structure
        li: '<li class="checkList"><a tabindex="0"><div class="aweCheckbox aweCheckbox-danger"><label for=""></label></div></a></li>'
    },      
    onChange: function(option, checked) {
        clearErrorMsg();
        //Load country after select Region Option
        if(icf_id != 1){
          var setCountryId= '';        
          if($('#regionSelect').val() != '' && $('#regionSelect').val() != null){
            setCountryId = my_implode_js(',',$('#regionSelect').val());
          }
          if($('#icfTypeSelect').val() != 1){
            countryForAssign(setIndex, userType,setCountryId,result,id) 
          }
         
        }           

        if($(option).is(':checked') ) {         
       
        }
        else{     
                     
        }
    }
  });
  multiselectCheck();

  if (regionResult.json_data.response.length >= 4) {
    $('#regionDiv ul.multiselect-container').css("height", 175);
    $('#regionDiv ul.multiselect-container').css("overflow", "auto");
  }
  else {
    $('#regionDiv ul.multiselect-container').css("height", "auto");
  }
}
// Country list display
function countryForAssign(setIndex, userType,setCountryId,result,id) {
  loaderLogin();
  $.ajax({
      url: serviceHTTPPath + "listCountry",
      type: "POST",
      dataType: 'json',
      headers: {
        "authorization": window.localStorage.getItem("token_id")
      }, 
      data: {
          region_id: setCountryId,
      },
      success: function (countryResult) {
          //alert("success="+JSON.stringify(result))
          loaderRemoveFun();	            
          attachCountryForAssign(countryResult,setIndex,userType,result,id);
      },
      error: function () {
          return;
      }
  });
}
function attachCountryForAssign(countryResult,setIndex,userType,result,id){
  $('#assignCountry #selectCountry').remove();
  var html='<div class="container-login-form-btn" id="selectCountry">'
        html+='<div class="form-group row addUserContainer">'
            html+='<label class="col-xs-4 control-label classTitle">Select Country<em class="required"> *</em></label>'
            html+='<div class="col-xs-8 selectContainer">'
                html+='<div class="input-group" id="countryDiv">'                                        
                  html+='<select name="countryAssign" multiple="multiple" placeholder="Select Country" id="countrySelect" class="SlectBox" required>'
                 
                  if(countryResult.json_data.response != null){
                  for (var k = 0; k < countryResult.json_data.response.length; k++) {    
                    if (countryResult.json_data.response[k].country_name == 'Argentina') {
                      html+='<option value="' + countryResult.json_data.response[k].country_id + '" id="'+countryResult.json_data.response[k].country_id+'">' + countryResult.json_data.response[k].country_name + '</option>' 
                    }
                    else{
                      html+='<option value="' + countryResult.json_data.response[k].country_id + '" id="'+countryResult.json_data.response[k].country_id+'">' + countryResult.json_data.response[k].country_name + '</option>' 
                    }                                                    
                  }
                 }               

                  html+='</select>';                                                                                              
                html+='</div>';
                html+='<span class="countryErrorTxt" style="color: red;"></span>';
            html+='</div>';
        html+='</div>';
    html+='</div>';

  $('#assignCountry').append(html);

  if(result !=''){
    var arr=[];    
    for(var u=0;u<result.json_data.response.length;u++){
     
      if(result.json_data.response[u].id == id){
        arr.push(result.json_data.response[u].country_id)
      }
      if(u==result.json_data.response.length-1){
        $('#countrySelect').val(arr);
      }
    }    
  }

  $('#countrySelect').on('change', function(){
    var selected = $(this).find("option:selected");  
    selected.each(function(){
      clearErrorMsg();
    });
  });


  $('#countrySelect').multiselect({
    allSelectedText: 'All',    
    includeSelectAllOption: true,
    nonSelectedText: "Select Country",    
    templates: { // Use the Awesome Bootstrap Checkbox structure
        li: '<li class="checkList"><a tabindex="0"><div class="aweCheckbox aweCheckbox-danger"><label for=""></label></div></a></li>'
    },      
    onChange: function(option, checked) {
        clearErrorMsg();    
        if($(option).is(':checked') ) {               
                        
        }
        else{                    
        }
    }
  });
  multiselectCheck();

  if(countryResult.json_data.response != null){
    if (countryResult.json_data.response.length >= 4) {
      $('#countryDiv ul.multiselect-container').css("height", 175);
      $('#countryDiv ul.multiselect-container').css("overflow", "auto");
    }
    else {
      $('#countryDiv ul.multiselect-container').css("height", "auto");
    }
  }
}
//Add Manager Options
function addManagerOption(setIndex,userType,result,id) {
  if(userType == 2){
    //Manager list
    $.ajax({
      url: serviceHTTPPath + "userManagement",
      type: "POST",
      dataType: 'json',
      headers: {
        "authorization": window.localStorage.getItem("token_id")
      }, 
      data: {
        role_id: userType
      },
      success: function (managerResult) {
         //alert("success="+JSON.stringify(result))
          loaderRemoveFun();
          attachManagers(managerResult,setIndex,userType,result,id);
      },
      error: function () {
          loaderRemoveFun();
          return;
      }
    });
  }else{
    var formId = $('#assignRoleSelect').val();
    var icf_formId = $('#icfTypeSelect').val();
    if(icf_formId == undefined){
      icf_formId=0;
    }   
    $.ajax({
      url: serviceHTTPPath + "legalListSearch",
      type: "POST",
      dataType: 'json',
      headers: {
        "authorization": window.localStorage.getItem("token_id")
      }, 
      data: {
        form_id: formId,
        icf_form_id:icf_formId,       
        forAssignment:1
      },
      success: function (managerResult) {
          loaderRemoveFun();
          //alert("success="+JSON.stringify(result))
          attachManagers(managerResult,setIndex,userType,result,id);
      },
      error: function () {
          loaderRemoveFun();
          return;
      }
    });
  } 
}
function attachManagers(managerResult,setIndex,userType,result,id){
  var addId;
  var placeholderVal;
  if(userType == 2){
    addId = "managerSelect";
    placeholderVal = "Select Managers";
  }
  else{
    addId = "legalSelectVal";
    placeholderVal = "Select Legal";
  }
  $('#assigManager #selectManager').remove();
  $('#legalManager #selectManager').remove();
  var html='<div class="container-login-form-btn" id="selectManager">'
        html+='<div class="form-group row addUserContainer">'
            html+='<label class="col-xs-4 control-label classTitle">Select Managers<em class="required"> *</em></label>'
            html+='<div class="col-xs-8 selectContainer">'
                html+='<div class="input-group" id="managerDiv">'                                        
                  html+='<select name="managerAssign" multiple="multiple" placeholder="Select Managers" id="'+addId+'" class="SlectBox managerType" required>'

                  if (managerResult.json_data.response.length !=  undefined) {
                    for (var k = 0; k < managerResult.json_data.response.length; k++) {  
                        if(managerResult.json_data.response[k].is_active != 0){
                          html+='<option value="' + managerResult.json_data.response[k].user_id + '" id="'+managerResult.json_data.response[k].user_id+'">' + managerResult.json_data.response[k].email + '</option>'                                          
                        }
                      } 
                  }

                  html+='</select>';                                                                                              
                html+='</div>';
                html+='<span class="managerErrorTxt" style="color: red;"></span>';
            html+='</div>';
        html+='</div>';
    html+='</div>';
    
    if(userType == 2){
      $('#assigManager').append(html);
    }else{
      $('#legalManager').append(html);
    }  

    if(result !=''){
      var arr=[];    
      for(var u=0;u<result.json_data.response.length;u++){
        if(result.json_data.response[u].id == id){
          if(userType == 2){
            arr.push(result.json_data.response[u].escalation_manager_email_id)
          }else{
            arr.push(result.json_data.response[u].legal_email_id)
          }         
        }
        if(u==result.json_data.response.length-1){
          $('#'+addId).val(arr);
        }        
      }    
    }

    $('#'+addId).on('change', function(){
      var selected = $(this).find("option:selected");  
      selected.each(function(){
        clearErrorMsg();
      });
    });

  $('#'+addId).multiselect({
    allSelectedText: 'All',    
    includeSelectAllOption: true,
    nonSelectedText: placeholderVal,    
    templates: { // Use the Awesome Bootstrap Checkbox structure
        li: '<li class="checkList"><a tabindex="0"><div class="aweCheckbox aweCheckbox-danger"><label for=""></label></div></a></li>'
    },      
    onChange: function(option, checked) {
        clearErrorMsg(); 
        if($(option).is(':checked') ) {               
                        
        }
        else{                    
        }
    }
  });
  multiselectCheck();

  if (managerResult.json_data.response.length >= 4) {
    $('#managerDiv ul.multiselect-container').css("height", 175);
    $('#managerDiv ul.multiselect-container').css("overflow", "auto");
  }
  else {
    $('#managerDiv ul.multiselect-container').css("height", "auto");
  }
}
function icfAssignmentList(formId,icfFormId,userType){ 
  loaderLogin();  
  $.ajax({
      url: serviceHTTPPath + "assignmentList",
      type: "POST",
      dataType: 'json',
      headers: {
        "authorization": window.localStorage.getItem("token_id")
      }, 
      data:
      {
        form_id:formId,
        icf_form_id: icfFormId,
        role_id:userType       
      },
      success: function (resultAssignmentList) {
          loaderRemoveFun();
          //alert("success="+JSON.stringify(resultAssignmentList))
          tableTdDetail(icfFormId,formId,userType,resultAssignmentList);
      },
      error: function () {
          return; 
      }
  });
}
function tableTdDetail(icfFormId,formId,userType,resultAssignmentList) { 
  var is_active = window.localStorage.getItem("is_active");
  $('#bodyUserManager .tableTr').remove();
  for (var i = 0; i < resultAssignmentList.json_data.response.length; i++) {
      var html = '<tr class="tableTr icfTable">';
     
      if(icfFormId == 0){
        if(resultAssignmentList.json_data.response[i].issue  != null){
          html += '<td>' + resultAssignmentList.json_data.response[i].issue + '</td>';
         
        }else{
          if(resultAssignmentList.json_data.response[i].cta_type !=0 ){
            html += '<td>'+resultAssignmentList.json_data.response[i].cta_type+'</td>';
          }
          //html += '<td>.......</td>';
        }
       
        html += '<td>' + resultAssignmentList.json_data.response[i].protocol_number + '</td>';
        html += '<td>' + resultAssignmentList.json_data.response[i].country_name + '</td>';
        if(resultAssignmentList.json_data.response[i].region != null){
          html += '<td>' + resultAssignmentList.json_data.response[i].region + '</td>';
        }else{
          html += '<td>.......</td>';
        }
        if(userType == 2){
          html += '<td>' + resultAssignmentList.json_data.response[i].escalation_manager_email + '</td>';
        }else{
          html += '<td>' + resultAssignmentList.json_data.response[i].legal_email + '</td>';
        }
        if(is_active == 1){
          html += '<td id="' + resultAssignmentList.json_data.response[i].issue_type_id + '"><button type="button" class="btn btn-info editAssignManager" id="' + resultAssignmentList.json_data.response[i].id + '">Edit </button><button type="button" class="btn btn-danger delAssignManager" id="' + resultAssignmentList.json_data.response[i].id + '">Delete </button></td>';
        }else{
          html += '<td id="' + resultAssignmentList.json_data.response[i].issue_type_id + '"><button type="button" class="btn btn-info disabled" id="' + resultAssignmentList.json_data.response[i].id + '" style="margin-right: 5px;">Edit </button><button type="button" class="btn btn-danger disabled" id="' + resultAssignmentList.json_data.response[i].id + '">Delete </button></td>';
        }
       
      }
      else if (icfFormId == 1) {
          if (resultAssignmentList.json_data.response[i].region != null) {
              html += '<td>' + resultAssignmentList.json_data.response[i].region + '</td>';
              //html += '<td>' + resultAssignmentList.json_data.response[i].icf_legal_email + '</td>';
              if(userType == 2){
                html += '<td>' + resultAssignmentList.json_data.response[i].escalation_manager_email + '</td>';
              }else{
                html += '<td>' + resultAssignmentList.json_data.response[i].legal_email + '</td>';
              }
              if(is_active == 1){
                html += '<td id="' + resultAssignmentList.json_data.response[i].issue_type_id + '"><button type="button" class="btn btn-info editAssignManager" id="' + resultAssignmentList.json_data.response[i].id + '">Edit </button><button type="button" class="btn btn-danger delAssignManager" id="' + resultAssignmentList.json_data.response[i].id + '">Delete </button></td>'        
              } //html += '<td id="' + resultAssignmentList.json_data.response[i].id + '"><button class="btn btn-danger btn-xs delUserManager" data-title="Delete" data-toggle="modal" data-target="#delete" style="width: 25%;"><span class="glyphicon glyphicon-trash"></span>Delete</button></td>';
              else{
                html += '<td id="' + resultAssignmentList.json_data.response[i].issue_type_id + '"><button type="button" class="btn btn-info disabled" id="' + resultAssignmentList.json_data.response[i].id + '" style="margin-right: 5px;">Edit </button><button type="button" class="btn btn-danger disabled" id="' + resultAssignmentList.json_data.response[i].id + '">Delete </button></td>'        
              }
            }

      }
      else if (icfFormId == 4) {
          if (resultAssignmentList.json_data.response[i].email != null) {
              html += '<td style="text-align: center;">' + resultAssignmentList.json_data.response[i].email + '</td>';
              if(is_active == 1){
                html += '<td id="' + resultAssignmentList.json_data.response[i].issue_type_id + '"><button type="button" class="btn btn-danger delAssignManager" id="' + resultAssignmentList.json_data.response[i].user_id + '">Delete </button></td>'        
              } //html += '<td id="' + resultAssignmentList.json_data.response[i].user_id + '"><button class="btn btn-danger btn-xs delUserManager" data-title="Delete" data-toggle="modal" data-target="#delete" style=""><span class="glyphicon glyphicon-trash"></span>Delete</button></td>';
              else{
                html += '<td id="' + resultAssignmentList.json_data.response[i].issue_type_id + '"><button type="button" class="btn btn-danger disabled" id="' + resultAssignmentList.json_data.response[i].user_id + '">Delete </button></td>'        
              }
          }
      }
      else {
          if (resultAssignmentList.json_data.response[i].protocol_number != null) {
              html += '<td>' + resultAssignmentList.json_data.response[i].protocol_number + '</td>';
              html += '<td>' + resultAssignmentList.json_data.response[i].country_name + '</td>';
              if(userType == 2){
                html += '<td>' + resultAssignmentList.json_data.response[i].escalation_manager_email + '</td>';
              }else{
                html += '<td>' + resultAssignmentList.json_data.response[i].legal_email + '</td>';
              }
              if(is_active == 1){
                html += '<td id="' + resultAssignmentList.json_data.response[i].issue_type_id + '"><button type="button" class="btn btn-info editAssignManager" id="' + resultAssignmentList.json_data.response[i].id + '" >Edit </button><button type="button" class="btn btn-danger delAssignManager" id="' + resultAssignmentList.json_data.response[i].id + '">Delete </button></td>'        
              } 
              else{
                html += '<td id="' + resultAssignmentList.json_data.response[i].issue_type_id + '"><button type="button" class="btn btn-info disabled" id="' + resultAssignmentList.json_data.response[i].id + '" style="margin-right: 5px;">Edit </button><button type="button" class="btn btn-danger disabled" id="' + resultAssignmentList.json_data.response[i].id + '">Delete </button></td>'
              }
            }
      }
      html += '</tr>';

      $('#bodyUserManager').append(html);

      if (i == resultAssignmentList.json_data.response.length - 1) {
          $('.delAssignManager').click(function () {
              var _id = $(this).attr('id');
              deleteICF(_id, icfFormId,formId,userType);
          });

          $('.editAssignManager').click(function () {
            var _id = $(this).attr('id');
            var issue_id = $(this).parent(this).attr('id');
            var setVal = $('.icfRadioOption .radionBtn input:radio[name="status"]:checked').val();
            openICFAssignPopup(resultAssignmentList,_id,setVal,userType);           
        });
      }
    }

  dataTableSet(4);  
}
//Delete ICF
function deleteICF(_id, icfFormId,formId,userType) {
  $('.vertical-alignment-helper').remove();
  $('.modal-backdrop').remove();
  $('body #myModalICF').remove();
  var html = '<div class="modal fade" id="myModalICF" tabindex="-1" role="dialog" aria-labelledby="myModalICF" aria-hidden="true">';
  html += '<div class="vertical-alignment-helper">';
  html += '<div class="modal-dialog vertical-align-center">';
  html += '<div class="modal-content">';
  html += '<div class="modal-header">';
  html += '<h4 class="modal-title" id="myModalLabel">Notification</h4>';
  html += '</div>';
  html += '<div class="modal-body">Are you sure you want to delete it?</div>';
  html += '<div class="modal-footer">';
  html += '<div class="row" style="margin-top:20px;">';
  html += '<div class="col-xs-2 col-sm-2 col-lg-2 text-left">';
  html += '</div>';

  html += '<div class="col-xs-4 col-sm-4 col-lg-4 text-right">';
  html += '<input  class="btn btn-danger" value="Yes" type="submit" name="submit" id="nextStatusBtn" style="">';
  html += '</div>';

  html += '<div class="col-xs-4 col-sm-4 col-lg-4 text-left" id="nextbtn">';
  html += '<input  class="btn btn-danger" value="No" type="submit" name="submit" id="cancelStatusBtn" style="">';
  html += '</div>';

  html += '<div class="col-xs-2 col-sm-2 col-lg-2 text-left">';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  html += '</div>';

  $('body').append(html);
  $('#myModalICF').modal();
  $('#myModalICF').on('hidden.bs.modal', function () {
      $('.modal-backdrop').remove();
      $('body #myModalICF').remove();
  });

  $('#nextStatusBtn').click(function () {
      $('.modal-backdrop').remove();
      $('body #myModalICF').remove();
      deleteICFService(_id, icfFormId,formId,userType);
  });
  $('#cancelStatusBtn').click(function () {
      $('#myModalICF').hide();
      $('.modal-backdrop').remove();
      $('body #myModalICF').remove();
  });
}
function deleteICFService(_id, icfFormId,formId,userType) {  
  loaderLogin();
 
  if(icfFormId == 4){
      $.ajax({
            url: serviceHTTPPath + "icfOthersListDelete",
            type: "POST",
            dataType: 'json',
            headers: {
              "authorization": window.localStorage.getItem("token_id")
            }, 
            data:
                {
                  user_id: _id
                },
            success: function (response) {                                
                loaderRemoveFun();
                assignICFAssignment(response.json_data.message,formId,icfFormId,userType);
            },
            error: function () {
                loaderRemoveFun();
                return;
            }
        });
  }else{
    $.ajax({
      url: serviceHTTPPath + "deleteAssignment",
      type: "POST",
      dataType: 'json',
      headers: {
        "authorization": window.localStorage.getItem("token_id")
      }, 
      data:
        {
          assignment_id: _id
        },
      success: function (response) {                               
          loaderRemoveFun();
          //alert("success="+JSON.stringify(response))
          assignICFAssignment(response.json_data.message,formId,icfFormId,userType);
      },
      error: function () {
          loaderRemoveFun();
          return;
      }
  });
  }
}
function addAssginValidations(){
  $('.multiStep').bootstrapValidator({
    // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },
    fields: {            
      assignRole: {
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
  // Assign fun validation end here
}