function legalFun(){    
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
        loaderLogin();
        legalName(user_id);
        // Drop drow select manager type 
        loadLegalData(fromDateNewFormat, todateNewFormat,user_id,"dashboard");

        //Date Change click event
        setDateOnSelect(user_id,"dashboard"); 
    }else{
        location.href = "../index.html";
    }
}
function legalName(user_id){
    $('.dropDownDiv .managerTypeDropDown').remove();
    var html='<div class="managerTypeDropDown">'
        html+='<label class="control-label">Legal Manager</label>'
        html+='<input type="text" id="'+user_id+'" class="managerName" value="'+ window.localStorage.getItem("user_name")+'" disabled="">'
        html+='</div>'
    $('.dropDownDiv').append(html);
}
function loadLegalData(fromDate,toDate,user_id,hamburgerType){
   loaderLogin();

   var dashOrArchiveType = window.localStorage.getItem("dashOrArchive");    
    /*****Legal Manager Request webservice call start here*****/  
    $.ajax({
        url: serviceHTTPPath + "viewLegalRequest",
        type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
        data: { legal_id: user_id, startDate: fromDate, endDate: toDate },
        success: function (result) {
            loaderRemoveFun();
            //alert("success=-"+JSON.stringify(result))	  
            if(result.json_data.response == 4 || result.json_data.response == 5 || result.json_data.response == 6){
                location.href = "../index.html";
            }else{          
                legalManagerList(result,user_id,hamburgerType);
            }
        },
        error: function (e) {
            loaderRemoveFun();
            return;
        }
    });
    /*****Legal Manager Request webservice call end here*****/
}

function legalManagerList(result,user_id,hamburgerType){
    viewLegalRequest(result,user_id,hamburgerType);
}
function viewLegalRequest(result,user_id,hamburgerType){
    var viewManagerArr;
   
    if(hamburgerType == "reassigned"){
        viewManagerArr = new Array("Request Type", "Country", "Issue", "Raised by", "Raised on", "Reassigned To", "Activity by Escalation Manager", "Activity by Legal", "Action Date", "Action Taken by", "Status", "Action");
    }else{
        viewManagerArr = new Array("Request Type", "Country", "Issue", "Raised by", "Raised on", "Reassigned by", "Activity by Escalation Manager", "Activity by Legal", "Action Date", "Action Taken by", "Status", "Action");
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
                if (result.json_data.response.data[j].resolution_date == null || result.json_data.response.data[j].resolution_date == "0000-00-00 00:00:00") {
                    // Legal dashboard Table data
                    if (result.json_data.response.data[j].action_flag == 2 && result.json_data.response.data[j].legal_action != 6) {
                        attachLegalTable(result, j,hamburgerType,user_id);
                    }   
                }
            }else if(hamburgerType == "archieve"){                
                if (result.json_data.response.data[j].resolution_date !== null && result.json_data.response.data[j].resolution_date !== "0000-00-00 00:00:00" && result.json_data.response.data[j].resolution_date !== 'null') {
                    // Archieve Table data                    
                    if (result.json_data.response.data[j].action_flag != 1) {
                        attachLegalTable(result, j,hamburgerType,user_id);
                    }
                }
            }else if(hamburgerType == "reassigned"){
                if(result.json_data.response.data[j] != null){
                    if (result.json_data.response.data[j].resolution_date !== null){
                        if (result.json_data.response.data[j].legal_action == 8){
                        attachLegalTable(result, j,hamburgerType,user_id);
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
        var request_number = $(this).attr('id');
        
        var actionId = '';
        var escalation_type = '';
        var escalation_sub_type = '';

        for (var i = 0; i < result.json_data.response.data.length; i++) {
            if (result.json_data.response.data[i].request_number == request_number) {
                actionId = result.json_data.response.data[i].legal_action - 1;
                               
                if (result.json_data.response.data[i].escalation_type_id == 4) {
                    escalation_type = result.json_data.response.data[i].escalation_type_id;
                    escalation_sub_type = result.json_data.response.data[i].escalation_sub_type_id;
                }
                else {
                    escalation_type = result.json_data.response.data[i].escalation_type_id;
                    escalation_sub_type = '';
                }
            }

            if (i == result.json_data.response.data.length - 1) {
                var performArr = [];
                var performStatusArr = [];
                if (actionId == 4 || actionId == 5) {
                    performArr = new Array("Approved", "Denied", "Approved with modification", "Pending-OC", "On hold", "Reassigned", "Closed");
                    performStatusArr = new Array("2", "3", "6", "5", "7", "8","9");
                }
                else{
                    if (escalation_type == 4) {
                        if (escalation_sub_type == 1) {
                            performArr = new Array("Approved", "Approved with modification", "Reassigned");
                            performStatusArr = new Array("2", "6", "8");
                        }else{
                            performArr = new Array("Approved", "Denied", "Approved with modification", "Additional Consultation", "Reassigned");
                            performStatusArr = new Array("2", "3", "6", "4", "8");
                        }
                    }else{
                        performArr = new Array("Approved", "Denied", "Approved with modification", "Pending-OC", "On hold", "Reassigned");
                        performStatusArr = new Array("2", "3", "6", "5","7","8");
                    }
                }
             
                popupSelectStatus(request_number,user_id,actionId,escalation_type,escalation_sub_type,hamburgerType,performStatusArr,performArr)               
            }
        }       
    })
}
// Perform action for Legal
function legalManagerAction(request_number,user_id,actionId,hamburgerType){
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
    var userType = $('#managerDivPerform').val();
    if($("#roleSelect").val() == '' || $("#roleSelect").val() == undefined){
        role_Id = "null";
    }else{
        role_Id = $("#roleSelect").val()-1;
    }
  
    if(userType == '' || userType == undefined){
        userType = "null";
    }    
   
    var loginUser_id = window.localStorage.getItem("user_id");    
    loaderLogin();
    $.ajax({
        url: serviceHTTPPath + "legalAction",
        type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
        data: { legal_action_id: loginUser_id,
                issue_id: request_number, 
                status: status_Id, 
                attachment: attachmentList,
                desc: descriptionTxt, 
                coe_id: userType, 
                role_id: role_Id },
        success: function (result) {
            //alert("success=-"+JSON.stringify(result))
            loaderRemoveFun();           
            if(result.json_data.response == 0){
                alertScreen(result.json_data.message,"")
            }else{
                if($('#userStatusSelect').val() == undefined){
                    var fromDate =  $("#datepicker").val();
                    var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( fromDate ) );
                    
                    var toDate = $("#toDatepicker").val();
                    var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ) );
                    loadLegalData(fromDateNewFormat,todateNewFormat,user_id,hamburgerType)
                }else{
                    performActionPopup(result.json_data.message,user_id,hamburgerType);
                }
                
            }
        },
        error: function (e) {
            loaderRemoveFun();
            return;
        }
    });
}

var performArr = new Array("Pending", "Approved", "Denied");

var dropDownArrGICF = new Array("2", "6", "8");
var performArrICFGlobal = new Array("Approved", "Approved with modification", "Reassigned");
var dropDownArrCSICF = new Array("2", "3", "4", "9", "7");
var performArrICFCountrySite = new Array("Approved", "Denied", "Approved with modification", "Additional Consultation", "Reassigned");

var performLegalActionArr = new Array("Pending", "Approved", "Denied", "Approved with modification", "Pending OC", "On hold", "Reassigned", "Closed");
function attachLegalTable(result, j,hamburgerType,user_id){
    var html;
    var protocol = result.json_data.response.data[j].request_number + "-" + result.json_data.response.data[j].protocol_number;
    html += '<tr class="' + result.json_data.response.data[j].escalation_type_id + '">';
    var setSitName = '';
    if (result.json_data.response.data[j].sitename == null) {
        setSitName = '';
    }
    else {
        setSitName = result.json_data.response.data[j].sitename;
    }
    
    //Entries budget and contract    
    if (result.json_data.response.data[j].selectPriority == 2) {
        html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span id="' + result.json_data.response.data[j].escalation_type_id + '"></span><img class="imgUrgent" id="' + result.json_data.response.data[j].request_number + '" src="'+urgentIcon+'" /> <a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + setSitName + '</a></td>';
        
    }
    else if (result.json_data.response.data[j].selectPriority == 1) {
        html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span id="' + result.json_data.response.data[j].escalation_type_id + '"></span><img class="imgHigh" id="' + result.json_data.response.data[j].request_number + '" src="'+highIcon+'" /> <a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + setSitName + '</a></td>';  
    }
    else {
        if (result.json_data.response.data[j].escalation_type_id == 4) {         
            html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span class="icfRequest" id="' + result.json_data.response.data[j].escalation_type_id + '"></span><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + setSitName + '</a></td>';
        }else{
            html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span id="' + result.json_data.response.data[j].escalation_type_id + '"></span><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + setSitName + '</a></td>';
        }        
    }

    //Country
    if (result.json_data.response.data[j].country_name != null) {
        if (result.json_data.response.data[j].escalation_type_id == 4) {
            if (result.json_data.response.data[j].escalation_sub_type_id == 1) {
                html += '<td class="dots">......</td>';
            }
            else {
                html += '<td>' + result.json_data.response.data[j].country_name + '</td>';
            }
        }
        else {
            html += '<td>' + result.json_data.response.data[j].country_name + '</td>';
        }
    }
    else {
        html += '<td class="dots">......</td>';
    }

    //Issue Type
    if (result.json_data.response.data[j].escalation_type_id == 4) {
        if (result.json_data.response.data[j].escalation_sub_type_id == 1) {
            html += '<td>ICF - Global</td>';
        }
        else if (result.json_data.response.data[j].escalation_sub_type_id == 2) {
            html += '<td>ICF - Country</td>';
        }
        else if (result.json_data.response.data[j].escalation_sub_type_id == 3) {
            html += '<td>ICF - Site</td>';
        }
        else {
            html += '<td>ICF - Other</td>';
        }
    }
    else {
        if (result.json_data.response.data[j].escalation_type_id == 2) {
            if (result.json_data.response.data[j].type_issues != 0) {
                html += '<td>Contract - ' + result.json_data.response.data[j].type_contract_language + ' - ' + result.json_data.response.data[j].choose_an_issue_name + '</td>';
            }
            else {
                html += '<td>Contract - ' + result.json_data.response.data[j].type_contract_language + '</td>';
            }
        }
        else {
            html += '<td>Budget - ' + result.json_data.response.data[j].choose_an_issue_name + '</td>';
        }
    }

    //Raised By    
    if (result.json_data.response.data[j].raisedBy_first_name !== null && result.json_data.response.data[j].raisedBy_first_name != 0) {
        if (result.json_data.response.data[j].raisedBy_last_name !== null && result.json_data.response.data[j].raisedBy_last_name != 0) {
            var raisedBy = result.json_data.response.data[j].raisedBy_first_name + " " + result.json_data.response.data[j].raisedBy_last_name;
            html += '<td class="raisedBy" id="' + result.json_data.response.data[j].request_number + '">' + raisedBy + '</td>';
        }
        else {
            html += '<td class="raisedBy" id="' + result.json_data.response.data[j].request_number + '">' + result.json_data.response.data[j].raisedBy_first_name + '</td>';
        }

    }
    else {
        if (result.json_data.response.data[j].raisedBy_last_name !== null && result.json_data.response.data[j].raisedBy_last_name != 0) {
            html += '<td class="raisedBy" id="' + result.json_data.response.data[j].request_number + '">' + result.json_data.response.data[j].raisedBy_last_name + '</td>';
        }
        html += '<td class="dots">......</td>';
    }

    //Raised On Date
    html += '<td>' + result.json_data.response.data[j].create_date + '</td>';

    if(hamburgerType == "reassigned"){
         //Reassigned To        
         if (result.json_data.response.data[j].action_track != null) {                
            for (var l = 0; l < result.json_data.response.data[j].action_track.length; l++) {
                if (result.json_data.response.data[j].action_track.length != 1) {
                    if ($('.managerName').attr('id') == result.json_data.response.data[j].action_track[l].coe_id) {
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
    }else {
        //Reassigned By
        if (result.json_data.response.data[j].action_track != null) {                
            for (var l = 0; l < result.json_data.response.data[j].action_track.length; l++) {
                if (result.json_data.response.data[j].action_track.length != 1) {
                    if ($('.managerName').attr('id') == result.json_data.response.data[j].action_track[l].coe_id) {
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
    

    //Activity by Escalation Manager
    if (result.json_data.response.data[j].manager_action_desc == '' || result.json_data.response.data[j].manager_action_desc == null || result.json_data.response.data[j].manager_action_desc == 'null') {
        if (result.json_data.response.data[j].manager_attach_list !== null && result.json_data.response.data[j].manager_attach_list != '' && result.json_data.response.data[j].manager_attach_list != 0) {
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
    else {
        if (result.json_data.response.data[j].manager_attach_list !== null && result.json_data.response.data[j].manager_attach_list != '' && result.json_data.response.data[j].manager_attach_list != 0) {
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

    //Activity by Legal Manager
    if (result.json_data.response.data[j].legal_action_desc == '' || result.json_data.response.data[j].legal_action_desc == null || result.json_data.response.data[j].legal_action_desc == 'null') {
        if (result.json_data.response.data[j].legal_attach_list !== null && result.json_data.response.data[j].legal_attach_list != '' && result.json_data.response.data[j].legal_attach_list != 0) {
            html += '<td class="boxArea">';
                html += '<a href="#" class="greyAttach disabledTxt" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive" id="' + result.json_data.response.data[j].request_number + '" src="'+textDisable+'" /></a>';
                html += '<a href="#" class="desAttach imgLegalIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachment+'" /></a>';
            html += '</td>';
        }
        else {
            html += '<td class="boxArea">';
                html += '<a href="#" class="greyAttach disabledTxt" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive" id="' + result.json_data.response.data[j].request_number + '" src="'+textDisable+'" /></a>';
                html += '<a href="#" class="greyAttach disabledImg" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachmentDisable+'" /></a>';
            html += '</td>';
        }
    }
    else {
        if (result.json_data.response.data[j].legal_attach_list !== null && result.json_data.response.data[j].legal_attach_list != '' && result.json_data.response.data[j].legal_attach_list != 0) {
            html += '<td class="boxArea">';
                html += '<a href="#" class="desAttach txtLegalBtn" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive txt_ActiveIcon" id="' + result.json_data.response.data[j].request_number + '" src="'+textActive+'" /></a>';
                html += '<a href="#" class="desAttach imgLegalIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachment+'" /></a>';
            html += '</td>'
        }
        else {
            html += '<td class="boxArea">';
                html += '<a href="#" class="desAttach txtLegalBtn" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive txt_ActiveIcon" id="' + result.json_data.response.data[j].request_number + '" src="'+textActive+'" /></a>';
                html += '<a href="#" class="greyAttach disabledImg" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachmentDisable+'" /></a>';
            html += '</td>';
        }
    }

    //Manager Action Date
    if (result.json_data.response.data[j].legal_action_date !== null && result.json_data.response.data[j].legal_action_date !== "0000-00-00 00:00:00") {
        html += '<td class="">' + result.json_data.response.data[j].legal_action_date + '</td>';
    }
    else {
        html += '<td class="dots">......</td>';
    }

    //Action Taken By
    if(hamburgerType == "reassigned"){
         //Action Taken By           
         if (result.json_data.response.data[j].action_track != null) {                
            for (var l = 0; l < result.json_data.response.data[j].action_track.length; l++) {
                if (result.json_data.response.data[j].action_track.length != 1) {
                    if ($('.managerName').attr('id') == result.json_data.response.data[j].action_track[l].coe_id) {                               
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
    }else if(hamburgerType == "dashboard"){
        if (result.json_data.response.data[j].action_track != null) {                
            for (var l = 0; l < result.json_data.response.data[j].action_track.length; l++) {
                if (result.json_data.response.data[j].action_track.length != 1) {
                    if ($('.managerName').attr('id') == result.json_data.response.data[j].action_track[l].coe_id && result.json_data.response.data[j].action_track[l].coe_type == 2) {
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
                }else {
                    html += '<td class="dots">......</td>';
                }
            }
        }        
    }
    else{
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
   

    //Status    
    if (result.json_data.response.data[j].escalation_type_id == 4) {        
        if (result.json_data.response.data[j].escalation_sub_type_id == 1) {
           
            if (result.json_data.response.data[j].legal_action == 0) {
                    html += '<td class="new" style="color:#784444;">New</td>';
            }
            else if (result.json_data.response.data[j].legal_action == 1) {
                html += '<td class="pending" style="color:#f46242;font-weight:bold;">Pending</td>';
            }
            else {
                var performArrICFGlobal = new Array("Approved", "Approved with modification", "Reassigned");
                var colorGlobalArr = new Array("#1bd850", "#090", "#4692c2");
                var dropDownArrGICF = new Array("2", "6", "8");
                for (k = 0; k < performArrICFGlobal.length; k++) {
                    if (dropDownArrGICF[k] == result.json_data.response.data[j].legal_action) {
                        html += '<td class="performActionFont" style="color:'+colorGlobalArr[k]+'">' + performArrICFGlobal[k] + '</td>';
                    }
                }
            }
        }
        else{
            if (result.json_data.response.data[j].legal_action == 0) {
                html += '<td class="new" style="color:#784444">New</td>';
            }
            else if (result.json_data.response.data[j].legal_action == 1) {
                html += '<td class="pending" style="color:#f46242;font-weight:bold;">Pending</td>';
            }
            else {
                var performICFCountrySite = new Array("Approved", "Denied", "Approved with modification", "Additional Consultation", "Reassigned");
                var colorICFCountrySite = new Array("#1bd850", "#e73c14", "#090", "#000", "#4692c2");
                var dropDownArrCSICF = new Array("2", "3", "6", "4", "8");
                for (k = 0; k < performICFCountrySite.length; k++) {
                    if (dropDownArrCSICF[k] == result.json_data.response.data[j].legal_action) {                       
                        html += '<td class="performActionFont" style="color:'+colorICFCountrySite[k]+'">' + performICFCountrySite[k] + '</td>';
                    }
                }
            }
        } 
    }
    else {
        if (result.json_data.response.data[j].legal_action != null) {
            if (result.json_data.response.data[j].legal_action != 0) {               
                 
                var performLegalActionArr = new Array("Pending", "Approved", "Denied", "Approved with modification", "Pending OC", "On hold", "Reassigned", "Closed");
                colorClassArr = new Array("#f46242", "#32b924", "#fe1631", "#916aa3", "#e89902", "#eead3c", "#4692c2", "#000");
                var legalAction = new Array("1","2", "3", "6", "5", "7", "8", "9");
                for (var p = 0; p < performLegalActionArr.length + 1; p++) {
                    if (legalAction[p] == result.json_data.response.data[j].legal_action) {
                        var action = p - 1;
                        html += '<td class="performActionFont" style="color:'+colorClassArr[p]+'">' + performLegalActionArr[p] + '</td>';
                    }
                }
            }
            else {
                html += '<td class="new" style="color:#784444">New</td>';
            }
        }
        else {
            html += '<td class="new" style="color:#784444">New</td>';
        }
    }
    
    if(hamburgerType == "archieve" || hamburgerType == "reassigned"){
        html += '<td class="text-center"><a class="btn btn-info performActionDisable performClick disabled" href="#" id="' + result.json_data.response.data[j].request_number + '"> Perform Action</a></td>';
    }
    else{
        html += '<td class="text-center"><a class="btn btn-info performAction performClick" href="#" id="' + result.json_data.response.data[j].request_number + '"> Perform Action</a></td>';
    }
    

    html += '</tr>';

    $('.content-wrapper .tableMainContainer .tbodyContainer').append(html);
}
