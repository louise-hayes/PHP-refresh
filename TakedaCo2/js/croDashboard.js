function croRequestList() {  
    var hamburgerActive = 0;     
    if(window.localStorage.getItem('userType') != null){
        hamburgerList(hamburgerActive, window.localStorage.getItem('userType'));

        setDefaultDate();
        var fromDate =  $("#datepicker").datepicker().val();       
        var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( fromDate ) );       
       
                
        var toDate = $("#toDatepicker").val(); 
        var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ) );  

        window.localStorage.setItem("dashOrArchive", 1);
        croWebService(fromDateNewFormat, todateNewFormat);   
        //Date Change click event
        var user_id = window.localStorage.getItem("user_id");
        setDateOnSelect(user_id,"");
    
        if(window.localStorage.getItem("is_active") == 0){
            $('#raiseRequest').addClass("disabled");
        }
    }else{
        location.href = "../index.html";
    }   
}
function croWebService(fromDate,toDate) {

   var dashOrArchiveType = window.localStorage.getItem("dashOrArchive");
   var user_id = window.localStorage.getItem("user_id");
   
   var token_id = window.localStorage.getItem("token_id");
   
   loaderLogin();
    $.ajax({
        url: serviceHTTPPath + "displayCroRequest",
        type: "POST",
        dataType: 'json',
        headers: {
            "authorization": token_id
        },
        data: { cro_id: user_id, startDate: fromDate, endDate: toDate,dashOrArchive:dashOrArchiveType},
        success: function (result) {
            //alert("success="+JSON.stringify(result))
            loaderRemoveFun();           
            if(result.json_data.response == 4 || result.json_data.response == 5 || result.json_data.response == 6){
                location.href = "../index.html";
            }else{
                croDashboard(result);
            }
        },
        error: function (e) {
            return;
        }
    });
    /*****CroRequest list webservice call end here*****/
    var pageArr = new Array("croDashboard.html","chooseFormType.html","Archive.html","index.html");
    $('#raiseRequest').click(function(event){
       
      location.href = pageArr[1];
        
    })
}

var performDisplayArr = new Array("Pending", "Approved", "Denied", "Negotiation Required", "Escalated", "Approved with modification", "On hold", "Reassigned", "Closed");
function croDashboard(result) {

    // var htmlDiv = '<div id="divToInsert" >'
    // htmlDiv+='</div>'
    // $("#divToInsert").insertBefore($("#Grid"));
    //$('#example1').DataTable().destroy();
   
    var croHeaderArr = new Array("Request Type", "Issue", "Raised on", "Assigned Manager", "Escalation Manager Action", "Legal/Other Action", "Activity by Takeda", "Resolution Date");

    $('.tableMainContainer #example1').remove();
    $('.tableMainContainer #example1_wrapper').remove();
    var html= '<table id="example1" class="table table-responsive display nowrap">';
    html += '<thead>';
    html += '<tr>';
    for (var i = 0; i < croHeaderArr.length; i++) {
        html += '<th>' + croHeaderArr[i] + '</th>';
    }
    html += '</tr>';
    html += '</thead>';

    html += '<tbody class="tbodyContainer">';   
    html += '</tbody>';

    html += '</table>';  

    $('.tableMainContainer').append(html);      

    if (result.json_data.message != 'Not Found!') {
        for (var j = 0; j < result.json_data.response.data.length; j++) {
            if (result.json_data.response.data[j].manager_action !== null) {
                for (var p = 0; p < performDisplayArr.length + 1; p++) {
                    if (p == result.json_data.response.data[j].manager_action) {                        
                        if (p == 4) {
                            var now = new Date();

                            var _fromDate = new Date(result.json_data.response.data[j].create_date); //date picker (text fields)
                            var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( _fromDate ) );
                            
                            var toDate = new Date(now.toString());                             

                            var newDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate()-3)
                            var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( newDate ) );                 
                          
                            if (fromDateNewFormat <= todateNewFormat) {                               
                                croTableListFun(result, j, "bgColorYellow");
                            }
                            else {                                
                                croTableListFun(result, j, "");
                            }
                        }
                        else {
                            croTableListFun(result, j, "");
                        }
                    }
                }
            }
            else {               
                croTableListFun(result, j, "");
            }
        }
    }

    dataTableSet(1)
    
    //Call in js/main.js
    tableClickEvents(result,"")

    $('#example1 tbody').on('click', '.raisedBy', function (e) {        
        var request_number = $(this).attr('id');       
        var first_name='';
        var last_name='';
        var emai_id='';
        for(var i=0;i<result.json_data.response.data.length;i++)
        {
            if(result.json_data.response.data[i].request_number == request_number)
            {
                emai_id = result.json_data.response.data[i].legal_email
                if (result.json_data.response.data[i].legal_first_name != null || result.json_data.response.data[i].legal_last_name != null) {                    
                    if (result.json_data.response.data[i].legal_first_name != 0) {
                        if (result.json_data.response.data[i].legal_last_name != 0) {
                            first_name = result.json_data.response.data[i].legal_first_name;
                            last_name = result.json_data.response.data[i].legal_last_name;                           
                        }
                        else {
                            first_name = result.json_data.response.data[i].legal_first_name;
                        }
                    }
                }else{
                    emai_id = result.json_data.response.data[i].escalation_email
                    if (result.json_data.response.data[i].escalation_first_name != null || result.json_data.response.data[i].escalation_last_name != null) {
                        if (result.json_data.response.data[i].escalation_first_name != 0) {
                            if (result.json_data.response.data[i].escalation_last_name != 0) {
                                first_name = result.json_data.response.data[i].escalation_first_name;
                                last_name = result.json_data.response.data[i].escalation_last_name;                           
                            }
                            else {
                                first_name = result.json_data.response.data[i].escalation_first_name;
                            }
                        }
                    }
                }
            }
            if(result.json_data.response.data.length-1 == i)
            {  
                //Call in js/popup.js
                raisedBy(first_name,last_name,emai_id,"Assigned Manager")
            }
        }
    });

}
/*****CRO Request images attach in popup function start here*****/
function attachCRORequestImg(attachmentIds, _msg) {
    /*****AttachmentIdsList webservice call start here*****/
    $.ajax({
        url: serviceHTTPPath + "attachmentIdsList",
        type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
        data: { attachmentIds: attachmentIds },
        success: function (imgResult) {
            //alert("success=-"+JSON.stringify(imgResult))
            //Call in js/popup.js
            attachmentIconPopup(imgResult, _msg);
        },
        error: function (e) {
            loaderRemoveFun();
            return;
        }
    });               
}
// Append table
function croTableListFun(result, j, addClass) {
    var protocol;
    var html;
  
    html = '<tr class="' + result.json_data.response.data[j].escalation_type_id + ' '+addClass+'">';   
    if (result.json_data.response.data[j].request_number != null) {
        protocol = result.json_data.response.data[j].request_number + "-" + result.json_data.response.data[j].protocol_number;        
        //ICF type entries    
        if (result.json_data.response.data[j].escalation_type_id == 4) {           
            if (result.json_data.response.data[j].escalation_sub_type_id == 3) {                    
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span class="icfRequest" id="' + result.json_data.response.data[j].escalation_type_id + '"></span><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
            }
            else {             
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span class="icfRequest" id="' + result.json_data.response.data[j].escalation_type_id + '"></span><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '</a></td>';
            }
        }
        else {
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
        }
    }
    else {
        protocol = result.json_data.response.data[j].protocol_number;

        if (result.json_data.response.data[j].escalation_type_id == 4) {
            if (result.json_data.response.data[j].escalation_sub_type_id == 3) {              
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span class="icfRequest" id="' + result.json_data.response.data[j].escalation_type_id + '"></span><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
            }
            else {          
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span class="icfRequest" id="' + result.json_data.response.data[j].escalation_type_id + '"></span><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '</a></td>';  
            }
        }
        else {
            if (result.json_data.response.data[j].selectPriority == 2) {
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span id="' + result.json_data.response.data[j].escalation_type_id + '"></span><img class="imgHigh" id="' + result.json_data.response.data[j].request_number + '" src="'+highIcon+'" />a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
            }
            else if (result.json_data.response.data[j].selectPriority == 1) {
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span id="' + result.json_data.response.data[j].escalation_type_id + '"></span><img class="imgUrgent" id="' + result.json_data.response.data[j].request_number + '" src="'+urgentIcon+'" /> <a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
            }
            else {
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span id="' + result.json_data.response.data[j].escalation_type_id + '"></span><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
            }
        }
    }

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
    else if (result.json_data.response.data[j].escalation_type_id == 4) {

        if (result.json_data.response.data[j].escalation_sub_type_id == 1) {
            html += '<td>ICF - Global</td>';
        }
        else if (result.json_data.response.data[j].escalation_sub_type_id == 2) {
            html += '<td>ICF - Country</td>';
        }
        else {
            html += '<td>ICF - Site</td>';
        }
    }
    else {
        html += '<td>Budget - ' + result.json_data.response.data[j].choose_an_issue_name + '</td>';
    }

    if (result.json_data.response.data[j].create_date != null) {
        if (result.json_data.response.data[j].create_date != '0') {
            html += '<td>' + result.json_data.response.data[j].create_date + '</td>';
        }
        else {
            html += '<td class="dots">.....</td>';
        }
    }
    else {
        html += '<td class="dots">.....</td>';
    }

    var k;
    var p;  

    // Assigned Managers column start here
    if (result.json_data.response.data[j].action_track != null) {
        if (result.json_data.response.data[j].action_track[0].first_name !== 0 && result.json_data.response.data[j].action_track[0].first_name !== null) {
            if (result.json_data.response.data[j].action_track[0].last_name !== 0 && result.json_data.response.data[j].action_track[0].last_name !== null) {
                var legalName = result.json_data.response.data[j].action_track[0].first_name + " " + result.json_data.response.data[j].action_track[0].last_name;
                html += '<td class="raisedBy" id="' + result.json_data.response.data[j].request_number + '">' + legalName + '</td>';
            }
            else {
                var legalName = result.json_data.response.data[j].action_track[0].first_name;
                html += '<td class="raisedBy" id="' + result.json_data.response.data[j].request_number + '">' + legalName + '</td>';
            }
        }
        else {
            html += '<td class="dots">......</td>';
        }       
    }
    else {
        html += '<td class="dots">......</td>';
    }

    // if (result.json_data.response.data[j].legal_first_name === null && result.json_data.response.data[j].legal_last_name === null) {        
    //     if (result.json_data.response.data[j].escalation_first_name === null && result.json_data.response.data[j].escalation_last_name === null) {            
    //         html += '<td class="dots">.....</td>';
    //     }
    //     else{
    //         if (result.json_data.response.data[j].escalation_first_name === null && result.json_data.response.data[j].escalation_first_name != '0'){
    //             if (result.json_data.response.data[j].escalation_last_name === null && result.json_data.response.data[j].escalation_last_name != '0'){
    //                 html += '<td class="dots">.....</td>';
    //             }
    //             else{
    //                 html += '<td class="raisedBy" id="' + result.json_data.response.data[j].request_number + '">' + result.json_data.response.data[j].escalation_last_name + '</td>';
    //             }
    //         }
    //         else{
    //             if (result.json_data.response.data[j].escalation_last_name === null && result.json_data.response.data[j].escalation_last_name != '0'){
                    
    //                 html += '<td class="raisedBy" id="' + result.json_data.response.data[j].request_number + '">' + result.json_data.response.data[j].escalation_first_name + '</td>';
    //             }
    //             else{
    //                 html += '<td class="raisedBy" id="' + result.json_data.response.data[j].request_number + '">' + result.json_data.response.data[j].escalation_first_name + " " + result.json_data.response.data[j].escalation_last_name + '</td>';
    //             }
    //         }
    //     }
    // }
    // else{
    //     if(result.json_data.response.data[j].legal_first_name === null && result.json_data.response.data[j].legal_first_name != '0')
    //     {
    //         if(result.json_data.response.data[j].legal_last_name === null && result.json_data.response.data[j].legal_last_name != '0'){
    //             html += '<td class="dots">.....</td>';
    //         }
    //         else{
    //             html += '<td class="raisedBy" id="' + result.json_data.response.data[j].request_number + '">' + result.json_data.response.data[j].legal_last_name + '</td>';
    //         }
    //     }
    //     else{
    //         if(result.json_data.response.data[j].legal_last_name === null && result.json_data.response.data[j].legal_last_name != '0'){
    //             html += '<td class="raisedBy" id="' + result.json_data.response.data[j].request_number + '">' + result.json_data.response.data[j].legal_first_name + '</td>';
    //         }
    //         else{
    //             html += '<td class="raisedBy" id="' + result.json_data.response.data[j].request_number + '">' + result.json_data.response.data[j].legal_first_name + " " + result.json_data.response.data[j].legal_last_name + '</td>';
    //         }
    //     }
    // }
     // var colorClassArr = new Array("#e89902", "#32b924", "#fe1631", "#25d6ae", "#F90", "#32b924", "#fe1631", "#4692c2", "#000");                
        // var escalationAction = new Array("1","2", "3", "4", "5", "6", "7", "8", "9");              
        // var performDisplayArr = new Array("Pending", "Approved", "Denied", "Negotiation Required", "Escalated", "Approved with modification", "On hold", "Reassigned", "Closed");
    // Assigned Managers column end here
    //var colorClassArr = new Array("#e89902", "#32b924", "#fe1631", "#25d6ae", "#F90", "#32b924", "#fe1631", "#4692c2", "#000");
    var performActionArr = new Array("Pending", "Approved", "Denied", "Negotiation Required", "Escalated", "Approved with modification", "On hold", "Reassigned", "Closed");
    var performNoArr = new Array("1","2", "3", "4", "5", "6", "7", "8", "9"); 
    var colorClassArr = new Array("#e89902", "#32b924", "#fe1631", "#25d6ae", "#F90", "#916aa3", "#eead3c", "#4692c2", "#000");

    var action;
    
    // Escalation Manager action column start here
    if (result.json_data.response.data[j].manager_action !== null && result.json_data.response.data[j].manager_action !== '0' && result.json_data.response.data[j].manager_action !== undefined) {
        for (p = 0; p < performActionArr.length + 1; p++) {
            if (performNoArr[p] == result.json_data.response.data[j].manager_action) {
                action = p - 1;
                html += '<td class="performActionFont" style="color:'+colorClassArr[p]+'">' + performActionArr[p] + '</td>';
            }
        }
    }
    else {

        html += '<td class="dots">.....</td>';
    }
    // Escalation Manager action column end here       
        
   // Legal Manager action column start here
   if (result.json_data.response.data[j].legal_action !== null && result.json_data.response.data[j].legal_action !== '0') {     
      //ICF type action     
    if (result.json_data.response.data[j].escalation_type_id == 4) {
       
        if (result.json_data.response.data[j].escalation_sub_type_id == 1) {           
            if (result.json_data.response.data[j].legal_action == 0) {
                html += '<td class="new" style="color:#784444">New</td>';
            }
            else if (result.json_data.response.data[j].legal_action == 1) {
                html += '<td class="pending" style="color:#e89902">Pending</td>';
            }
            else {
                var performArrICFGlobal = new Array("Approved", "Approved with modification", "Reassigned");
                var colorGlobalArr = new Array("#32b924", "#916aa3", "#4692c2");
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
                html += '<td class="pending" style="color:#e89902">Pending</td>';
            }
            else {
                var performICFCountrySite = new Array("Approved", "Denied", "Approved with modification", "Additional Consultation", "Reassigned");
                var colorICFCountrySite = new Array("#32b924", "#fe1631", "#916aa3", "#25d6ae", "#4692c2");               

                var dropDownArrCSICF = new Array("2", "3", "6", "4", "8");
                for (k = 0; k < performICFCountrySite.length; k++) {
                    if (dropDownArrCSICF[k] == result.json_data.response.data[j].legal_action) {                       
                        html += '<td class="performActionFont" style="color:'+colorICFCountrySite[k]+'">' + performICFCountrySite[k] + '</td>';
                    }
                }
            }
        }           
    }
    else{       
            
        var performGCArr = new Array("Pending", "Approved", "Denied", "Approved with modification", "Pending OC", "On hold", "Reassigned", "Closed");
        var performActionArr = new Array("1","2", "3","6", "5", "7", "8","9");
        var colorGCArr = new Array("#f46242","#32b924", "#fe1631", "#916aa3", "#e89902", "#eead3c", "#4692c2", "#000");
        if(result.json_data.response.data[j].legal_action == 0){
            html += '<td class="dots">.....</td>';
        }else{
            for (p = 0; p < performGCArr.length + 1; p++) {
                if (performActionArr[p] == result.json_data.response.data[j].legal_action) {
                    action = p - 1;
                    html += '<td class="performActionFont" style="color:'+colorGCArr[p]+'">' + performGCArr[p] + '</td>';
                }
            }
        }
        
    }
   }
   else{
    html += '<td class="dots">.....</td>';
   }
   // Legal Manager action column end here
    if (result.json_data.response.data[j].legal_action_desc == '' || result.json_data.response.data[j].legal_action_desc == null || result.json_data.response.data[j].legal_action_desc == 'null') {
        if (result.json_data.response.data[j].manager_attach_list == '' || result.json_data.response.data[j].manager_attach_list == null || result.json_data.response.data[j].manager_attach_list == 'null' || result.json_data.response.data[j].manager_attach_list == 0) {
           
            if (result.json_data.response.data[j].legal_attach_list == '' || result.json_data.response.data[j].legal_attach_list == null || result.json_data.response.data[j].legal_attach_list == 'null' || result.json_data.response.data[j].legal_attach_list == 0) {
                if (result.json_data.response.data[j].manager_action_desc == 0 || result.json_data.response.data[j].manager_action_desc == '' || result.json_data.response.data[j].manager_action_desc == null || result.json_data.response.data[j].manager_action_desc == 'null') {
                    html += '<td class="boxArea">';
                        html += '<a href="#" class="greyAttach disabledTxt" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive" id="' + result.json_data.response.data[j].request_number + '" src="'+textDisable+'" /></a>';
                        html += '<a href="#" class="greyAttach disabledImg" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachmentDisable+'" /></a>';
                    html += '</td>';
                }
                else {
                    if (result.json_data.response.data[j].manager_action_desc == 0) {
                        html += '<td class="boxArea">';
                            html += '<a href="#" class="greyAttach disabledTxt" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive" id="' + result.json_data.response.data[j].request_number + '" src="'+textDisable+'" /></a>';
                            html += '<a href="#" class="greyAttach disabledImg" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachmentDisable+'" /></a>';
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
            else {
                if (result.json_data.response.data[j].manager_action_desc == '' || result.json_data.response.data[j].manager_action_desc == null || result.json_data.response.data[j].manager_action_desc == 'null') {
                    html += '<td class="boxArea">';
                        html += '<a href="#" class="greyAttach disabledTxt" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive" id="' + result.json_data.response.data[j].request_number + '" src="'+textDisable+'" /></a>';
                        html += '<a href="#" class="desAttach imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachment+'" /></a>';
                    html += '</td>';
                }
                else {
                    if (result.json_data.response.data[j].manager_action_desc == 0) {
                        html += '<td class="boxArea">';
                            html += '<a href="#" class="greyAttach disabledTxt" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive" id="' + result.json_data.response.data[j].request_number + '" src="'+textDisable+'" /></a>';
                            html += '<a href="#" class="desAttach imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachment+'" /></a>';
                        html += '</td>';
                    }
                    else {
                        html += '<td class="boxArea">';
                            html += '<a href="#" class="desAttach txtBtn" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive txt_ActiveIcon" id="' + result.json_data.response.data[j].request_number + '" src="'+textActive+'" /></a>';
                            html += '<a href="#" class="desAttach imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachment+'" /></a>';
                        html += '</td>';
                    }
                }
            }
        }
        else {
            if (result.json_data.response.data[j].manager_action_desc == '' || result.json_data.response.data[j].manager_action_desc == null || result.json_data.response.data[j].manager_action_desc == 'null') {
                html += '<td class="boxArea">';
                    html += '<a href="#" class="greyAttach disabledTxt" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive" id="' + result.json_data.response.data[j].request_number + '" src="'+textDisable+'" /></a>';
                    html += '<a href="#" class="desAttach imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachment+'" /></a>';
                html += '</td>';
            }
            else {
                html += '<td class="boxArea">';
                    html += '<a href="#" class="desAttach txtBtn" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive txt_ActiveIcon" id="' + result.json_data.response.data[j].request_number + '" src="'+textActive+'" /></a>';
                    html += '<a href="#" class="desAttach imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachment+'" /></a>';
                html += '</td>';
            }
        }
    }
    else {
        if (result.json_data.response.data[j].manager_attach_list == '' || result.json_data.response.data[j].manager_attach_list == null || result.json_data.response.data[j].manager_attach_list == 'null' || result.json_data.response.data[j].manager_attach_list == 0) {
            if (result.json_data.response.data[j].legal_attach_list == '' || result.json_data.response.data[j].legal_attach_list == null || result.json_data.response.data[j].legal_attach_list == 'null' || result.json_data.response.data[j].legal_attach_list == 0) {
                html += '<td class="boxArea">';
                    html += '<a href="#" class="desAttach txtBtn" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive txt_ActiveIcon" id="' + result.json_data.response.data[j].request_number + '" src="'+textActive+'" /></a>';
                    html += '<a href="#" class="greyAttach disabledImg" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachmentDisable+'" /></a>';
                html += '</td>';
            }
            else {
                html += '<td class="boxArea">';
                    html += '<a href="#" class="desAttach txtBtn" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive txt_ActiveIcon" id="' + result.json_data.response.data[j].request_number + '" src="'+textActive+'" /></a>';
                    html += '<a href="#" class="desAttach imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachment+'" /></a>';
                html += '</td>';
            }
        }
        else {
            html += '<td class="boxArea">';
                html += '<a href="#" class="desAttach txtBtn" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive txt_ActiveIcon" id="' + result.json_data.response.data[j].request_number + '" src="'+textActive+'" /></a>';
                html += '<a href="#" class="desAttach imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="'+imgAttachment+'" /></a>';
            html += '</td>';
        }

    }

    if (result.json_data.response.data[j].resolution_date != null) {       
        if (result.json_data.response.data[j].resolution_date != "0000-00-00 00:00:00") {
            html += '<td>' + result.json_data.response.data[j].resolution_date + '</td>';
        }
        else {
            html += '<td>.....</td>';
        }
    }
    else {
        html += '<td>.....</td>';
    }
    html += '</tr>';

    $('.tableMainContainer .tbodyContainer').append(html);    
}
/*****Request number popup start here*****/
//Call in js/main.js
function requestNoPopup(requestId, escalationTypeId, result, escalationResult, request_number,resultIssueType, managerType,hamburgerType) {
    loaderLogin();
    $.ajax({
        url: serviceHTTPPath + "viewCroRequestID",
        type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
        data: { request_id: requestId, escalation_type_id: escalationTypeId },
        success: function (viewCroResult) {
            loaderRemoveFun();
            //alert("success=-"+JSON.stringify(viewCroResult))
            if (viewCroResult.json_data.response != 0) {
                displayFormDetail(viewCroResult,requestId, escalationTypeId, result, escalationResult, request_number,resultIssueType, managerType,hamburgerType)
            }
        },
        error: function (e) {
            loaderRemoveFun();
            return;
        }
    });
}
function displayFormDetail(viewCroResult,requestId, escalationTypeId, result, escalationResult, request_number,resultIssueType, managerType,hamburgerType){
    $('#myModal').remove();
    $('.formPrePopulate').remove();
	//$('.modal-backdrop').remove();	
	var html = '<div class="modal fade formPrePopulate" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
	    html += '<div class="vertical-alignment-helper">';
                html += '<div class="modal-dialog vertical-align-center checklistModel full-screen" id="checklistModel">';
                 html += '<div class="modal-content">';
                    html += '<div class="modal-header headerDiv">';					
						html += '<button type="button" class="close crossIcon"';
							html += 'data-dismiss="modal">';
							html += '<span aria-hidden="true">&times;</span>'
						html += '</button>';
                    html += '</div>';

                    html += '<div class="modal-body checkListPopup requestNoBody" id="requestNoBody">';
                        html += '<div class="bg-white" id="checkListDiv">';                     
                        html += '</div>';                        
                    html += '</div>';

                html += '</div>';
               html += '</div>';
       html += '</div>';
     html += '</div>';

	$('body').append(html);
    $('#myModal').modal();

    //Popup body resize
    var height = $(window).height();
    var windowHeight = $(window).innerHeight();
    $('.checkListPopup').css('min-height', windowHeight-200);
    $('.checkListPopup').css('height', height-200);
    $(window).resize(function() {     
        height = $(window).height();
        windowHeight = $(window).innerHeight(); 

        $('.checkListPopup').css('min-height', windowHeight-200);
        $('.checkListPopup').css('height', height-200);
    });

	$('#myModal').on('hidden.bs.modal', function (e) {
        loaderRemoveFun();
        $('.modal-backdrop').remove();	
    });

    $('.crossIcon').click(function(){
        $('.modal-backdrop').remove();
    });
    
    var userType = window.localStorage.getItem('userType');
    var statusTextArea ='null';
    var actionId = 1;
    var selectUserId; 
    var setUserId = $('#managerDiv').val();
   
    if($('#managerDiv').val() == undefined){
        setUserId = $('.managerName').attr('id');
    }
   
    var userType = window.localStorage.getItem('userType');
    for (var p = 0; p < viewCroResult.json_data.response.data.length; p++) {        
        if (request_number == viewCroResult.json_data.response.data[p].request_number) {           
            if (viewCroResult.json_data.response.data[p].manager_action == null || viewCroResult.json_data.response.data[p].manager_action == 0) {
                if(userType == 2){
                    escalationManagerAction(request_number,setUserId,actionId,hamburgerType);
                }
            }
            if (viewCroResult.json_data.response.data[p].legal_action == null || viewCroResult.json_data.response.data[p].legal_action == 0) {
                if(userType == 3){
                    //Call in js/LMDashboard.js                    
                    legalManagerAction(request_number,setUserId,actionId,hamburgerType);
                }
            }
        }
        //Call in js/requestListPopup.js
        appendRequestPopup(viewCroResult, p, userType, escalationResult,managerType,resultIssueType,0,hamburgerType,request_number)                      
    }
    var setFileIds = 0;
    var setOption;
                
	if (viewCroResult.json_data.response.data[0].escalation_type_id == 4) {
                    
        if (viewCroResult.json_data.response.data[0].escalation_sub_type_id == 1) {
            if (viewCroResult.json_data.response.data[0].attachment_global_icf != '' && viewCroResult.json_data.response.data[0].attachment_global_icf != 0) {
                setFileIds = viewCroResult.json_data.response.data[0].attachment_global_icf;                            
                setOption = "GlobalICF";    
                 // Call in js/requestListPopup.js                                  
                imageAttachLogo(0, viewCroResult, setFileIds, setOption);                                                     
            }
            else{                           
                setFileIds = viewCroResult.json_data.response.data[0].global_link;                                                   
                setOption = "GlobalICF";                           
                if(setFileIds != ''){   
                    // Call in js/requestListPopup.js                            
                    attachLink(0, viewCroResult, setFileIds, setOption);
                }
            }
            if (viewCroResult.json_data.response.data[0].attachment_protocol != '' && viewCroResult.json_data.response.data[0].attachment_protocol != 0) {
                setFileIds = viewCroResult.json_data.response.data[0].attachment_protocol;                            
                setOption = "ProtocolICF";          
                 // Call in js/requestListPopup.js                               
                imageAttachLogo(0, viewCroResult, setFileIds, setOption);                            
            }
            else{
                setFileIds = viewCroResult.json_data.response.data[0].protocol_link;                            
                setOption = "ProtocolICF";
             
                if(setFileIds != ''){     
                     // Call in js/requestListPopup.js                                       
                   attachLink(0, viewCroResult, setFileIds, setOption);
                }
            }
            if (viewCroResult.json_data.response.data[0].attachment_other_relevant_document != '') {
                setFileIds = viewCroResult.json_data.response.data[0].attachment_other_relevant_document;                           
                setOption = "document";
                 // Call in js/requestListPopup.js             
                imageAttachLogo(0, viewCroResult, setFileIds, setOption);
            }
        }
        if (viewCroResult.json_data.response.data[0].escalation_sub_type_id == 2) {                       
            if (viewCroResult.json_data.response.data[0].attachment_country_icf != '' && viewCroResult.json_data.response.data[0].attachment_country_icf != 0) {
                setFileIds = viewCroResult.json_data.response.data[0].attachment_country_icf;
                setOption = "CountryICF"  
                 // Call in js/requestListPopup.js                                       
                imageAttachLogo(0, viewCroResult, setFileIds, setOption);                            
            }
            else{
                setFileIds = viewCroResult.json_data.response.data[0].country_link;
                setOption = "CountryICF";                         
                if(setFileIds != ''){    
                     // Call in js/requestListPopup.js                                        
                   attachLink(0, viewCroResult, setFileIds, setOption);
                }
            }
            if (viewCroResult.json_data.response.data[0].attachment_other_relevant_document != '') {
                setFileIds = viewCroResult.json_data.response.data[0].attachment_other_relevant_document;
                setOption = "document";
                 // Call in js/requestListPopup.js             
                imageAttachLogo(0, viewCroResult, setFileIds, setOption);
            }
        }
        if (viewCroResult.json_data.response.data[0].escalation_sub_type_id == 3) {
            if (viewCroResult.json_data.response.data[0].attachment_site_icf != '' && viewCroResult.json_data.response.data[0].attachment_site_icf != 0) {
                setFileIds = viewCroResult.json_data.response.data[0].attachment_site_icf;
                setOption = "SiteICF";
                 // Call in js/requestListPopup.js             
                imageAttachLogo(0, viewCroResult, setFileIds, setOption);                                                    
            }
            else{
                setFileIds = viewCroResult.json_data.response.data[0].site_link;                            
                setOption = "SiteICF";                         
                if(setFileIds != ''){   
                     // Call in js/requestListPopup.js                                         
                   attachLink(0, viewCroResult, setFileIds, setOption);
                }
            }
            if (viewCroResult.json_data.response.data[0].attachment_other_relevant_document != '') {
                setFileIds = viewCroResult.json_data.response.data[0].attachment_other_relevant_document;
                setOption = "document";
                 // Call in js/requestListPopup.js             
                imageAttachLogo(0, viewCroResult, setFileIds, setOption);
            }
        }
    }
	else
	{ 
     setOption = '';
      // Call in js/requestListPopup.js             
     imageAttachLogo(0, viewCroResult, viewCroResult.json_data.response.data[0].attachment_file_ids, setOption);
	}
        //Default set protocol
        if ($('#checklistModel .editProtocolClick').text() != '') {
            $('#checklistModel .chooseProtocolPopUp .selectpicker').selectpicker('refresh');
            $('#checklistModel .chooseProtocolPopUp .selectpicker').css("position", "relative");
            $('#checklistModel .chooseProtocolPopUp .selectpicker').css("top", "auto !important");
            $('#checklistModel .chooseProtocolPopUp .btn-group bootstrap-select').css("width", 100 + "%");

            /*****Load Protocol list according to input value start here*****/
            $('#checklistModel .chooseProtocolPopUp .selectProtocol input').keyup(function (e) {
                if ($('#checklistModel .chooseProtocolPopUp .selectProtocol input').val() != '') {
                    //Call in js/requestListPopup.js
                    attachEditProtocol(requestId, selectUserId, request_number,escalationTypeId);
                }
            });
            /*****Load Protocol list according to input value end here*****/
        }  
     /*****EditProtocol  button click start here*****/
        var selected_userId = $('.managerTypeDropDown select[name=managerType]').val();
        if(selected_userId == undefined){
            selected_userId = $('.managerName').attr('id');
        }
        $('.formPrePopulate .editProtocolClick').click(function (e) {          
            $('#chooseProtocolPopUp').css("display","inline-block");
            $('.protocolVal').css("display","none");
            $('#chooseProtocolPopUp').css("background-color", "#fff");
            var selectVal = $('#checklistModel .chooseProtocolPopUp .selectProtocol .filter-option').text()
         
            $('#chooseProtocolPopUp .attachSelect').remove();
            var html = '<div class="attachSelect" id="">';				
                html += '<select class="selectpicker selectProtocol" id="selectProtocolId" name="selValue" data-show-subtext="true" data-live-search="true" style="display: none;">';
                html += '<option data-subtext="" value="">' + selectVal + '</option>';
                html += '</select>';
            html += '</div>';

            $('#chooseProtocolPopUp').append(html);
        
            $('#checklistModel #chooseProtocolPopUp .selectpicker').selectpicker('refresh');
            $('#checklistModel #chooseProtocolPopUp .selectpicker').css("position", "relative");
            $('#checklistModel #chooseProtocolPopUp .selectpicker').css("top", "auto !important");
            $('#checklistModel #chooseProtocolPopUp .btn-group bootstrap-select').css("width", 100 + "%");

            $('#checklistModel #chooseProtocolPopUp .selectpicker').attr('disabled', false);
            
            //Call in js/requestListPopup.js
            attachEditProtocol(requestId, selected_userId, request_number,escalationTypeId);
        });
        /*****EditProtocol button click end here*****/

        /*****PerformAction button click start here*****/
        var escalation_type = '';
        var escalation_sub_type = '';
        $('.formPrePopulate .performClick').click(function (e) {
            var request_number = $(this).attr('id');
          
            var actionId = '';
            var escalation_type = '';
            var escalation_sub_type = '';
            
            for (var i = 0; i < result.json_data.response.data.length; i++) {
                if (result.json_data.response.data[i].request_number == request_number) {
                    if (userType == 2) {
                        actionId = result.json_data.response.data[i].manager_action - 1;
                    }
                    else if (userType == 3) {
                        actionId = result.json_data.response.data[i].legal_action - 1;
                    }

                    if (result.json_data.response.data[i].escalation_type_id == 4) {
                        escalation_type = result.json_data.response.data[i].escalation_type_id;
                        escalation_sub_type = result.json_data.response.data[i].escalation_sub_type_id;
                    }
                    else {
                        escalation_type = result.json_data.response.data[i].escalation_type_id;
                        escalation_sub_type = '';
                    }
                }

                if (result.json_data.response.data.length - 1 == i) {
                    var performArr = [];
                    var performStatusArr = [];
                    if (userType == 2) {
                        performStatusArr = new Array(2,3,4,6,7,8,9);
                        if(actionId == 3 || actionId == 6)
                        {
                            performArr = new Array("Approved","Denied","Negotiation Required","Approved with modification","On hold","Reassigned","Closed");
                        }else{
                            performArr = new Array("Approved","Denied","Negotiation Required","Approved with modification","On hold","Reassigned");
                        }               
                    }
                    else if(userType == 3) {
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
                                performStatusArr = new Array("2", "3", "6", "5","7", "8");
                            }
                        }
                    }                   
                    popupSelectStatus(request_number,selected_userId,actionId,escalation_type,escalation_sub_type,hamburgerType,performStatusArr,performArr)
                    // if (userType == 2) {
                    //     callToLegalManagerList(request_number, selectUserId, actionId, escalation_type, escalation_sub_type);
                    // }
                    // else if (userType == 3) {
                    //     popforLegalPerformAction(request_number, selectUserId, actionId, escalation_type, escalation_sub_type);
                    // }
                }
            }


        });
        /*****PerformAction button click end here*****/
    
}
