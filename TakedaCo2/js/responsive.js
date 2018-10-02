function croRequestList() {  
    var hamburgerActive = 0;    
    hamburgerList(hamburgerActive, window.localStorage.getItem('userType'));

    setDefaultDate();
    var fromDate =  $("#datepicker").val();
    var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( fromDate ) );
    
    var toDate = $("#toDatepicker").val(); 
    var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ) );    
    window.localStorage.setItem("dashOrArchive", 1);
    croWebService(fromDateNewFormat, todateNewFormat);    
}
function croWebService(fromDate,toDate) {
    
   // $('#datetimepicker4').datetimepicker({
   //     pickTime: false
   // });

   fromDate = "2018-01-22"
   toDate = "2018-05-22"
   var dashOrArchiveType = window.localStorage.getItem("dashOrArchive");
   var user_id = window.localStorage.getItem("user_id");
   //alert(fromDate+"--"+toDate+"=="+user_id)
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
            // if (result.json_data.response == 0) {   
            //     //location.href = "loginPage.html";          
            // }
            // else {
                croDashboard(result);
            //}
        },
        error: function (e) {
            return;
        }
    });
    /*****CroRequest list webservice call end here*****/
    var pageArr = new Array("croDashboard.html","chooseFormType.html","Archive","index.html");
    $('#raiseRequest').click(function(event){
        location.href = pageArr[1];
    })
}

var performDisplayArr = new Array("Pending", "Approved", "Denied", "Negotiation Required", "Escalated", "Approved with modification", "On hold", "Reassigned", "Closed");

function croDashboard(result) {

    // var htmlDiv = '<div id="divToInsert" >'
    // htmlDiv+='</div>'
    // $("#divToInsert").insertBefore($("#Grid"));
    var croHeaderArr = new Array("Request Type", "Issue", "Raised on", "Assigned Manager", "Escalation Manager Action", "Legal/Other Action", "Activity by Takeda", "Resolution Date");

   // $('.tableMainContainer #example1_wrapper .row').remove();

    var html= '<table id="example1" class="table table-responsive">';
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

    $('.table-responsive').append(html);      
   


    //alert(result.json_data.message)
    //alert(result.json_data.response.data.length)
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
                            var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ) );                   
                          
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

    pageResize();
    // m, extensions = 'FixedColumns',
    // options = list(
    //   dom = 't',
    //   scrollX = TRUE,
    //   fixedColumns = list(leftColumns = 2, rightColumns = 1)
    // )
    // $('#example1').DataTable({
    //     // 'fixedColumns': true,
    //     'scrollX':false,
    //     // 'scrollCollapse': true,
      
    //     //  "scrollY":'56vh',
    //     // 'scrollCollapse': true,
    //     // 'responsive': true,
    
    // //  'fixedColumns': true,

    // // other initialization configurations...
    // // ...
    //     "language": {
    //         "search": "_INPUT_",
    //         "searchPlaceholder": "Search..."
    //     },
    //     'paging'      : true,
    //     'lengthChange': false,
    //     'searching'   : false,
    //     'ordering'    : true,
    //     'info'        : false,
    //     'autoWidth'   : false,
    //     "order": [[ 0, "desc" ]],        
    // });  
    
    // $('#example1').DataTable( {
    //       "scrollX": true,
    //       "bAutoWidth": true,
    //       //"scrollY":'59vh',
    //       "autoWidth": true,
    //       "scrollCollapse": true,
    //       "paging": true,
    //       "lengthChange": false,    
    //       "order": [[ 0, "desc" ]],  
    //       "language": {
    //         "search": "_INPUT_",
    //         "searchPlaceholder": "Search..."
    //     },       
    // } );   
  
    setDateOnSelect();
  /*****Request number click event start here*****/
 
    $('#example1 tbody').on('click', '.requestNo', function (e) {      
        var request_id = $(this).attr('id');
       var request_number = $(this).children('a').attr('id');
        var escalationTypeId = $(this).children('span').attr('id');
        
        loaderLogin();
        $.ajax({
            url: serviceHTTPPath + "listIssuesTypes",
            type: "POST",
            headers: {
                "authorization": window.localStorage.getItem("token_id")
            },
            data: {
                form_id: 1
            },
            dataType: 'json',
            success: function (resultIssueType) {
               // alert("success="+JSON.stringify(resultIssueType))           
                
                if(resultIssueType.json_data.response == 1){
                    $.ajax({
                        url: serviceHTTPPath + "listEscalation",
                        type: "GET",
                        dataType: 'json',
                        headers: {
                            "authorization": window.localStorage.getItem("token_id")
                        },
                        success: function (escalationResult) {  
                           // alert("success="+JSON.stringify(escalationResult))  
                           loaderRemoveFun();            
                            var managerType = 1;
                            requestNoPopup(request_id, escalationTypeId, result, escalationResult, request_number,resultIssueType, managerType);
                        },
                        error: function (e) {
                            loaderRemoveFun();
                            return;
                        }
                    });                    
                }else{
                    loaderRemoveFun();
                    alertScreen(resultIssueType.json_data.message,'')
                }
                
            },
            error: function (e) {
                loaderRemoveFun();
                return;
            }
        });	
       
    });
    /*****Request number click event end here*****/

     /*****AttachmentIcon click event start here*****/
    $('#example1 tbody').on('click', '.imgIcon', function (e) {
        var request_id = $(this).attr('id');
        var img_id = $(this).children('img').attr('id');
        
        loaderLogin();
        var attachmentIds = 0;
        var counter = 0;

        var arr = new Array();
        for (var j = 0; j < result.json_data.response.data.length; j++) {
            if (result.json_data.response.data[j].request_number == img_id) {
                if (result.json_data.response.data[j].request_id == request_id && arr.indexOf(request_id) == -1) {
                    counter = counter + 1;
                    arr.push(request_id);
                    if (counter == 1) {
                        if (result.json_data.response.data[j].manager_attach_list != '') {
                            attachmentIds = result.json_data.response.data[j].manager_attach_list.replace(/^,|,$/g, '');

                            if (result.json_data.response.data[j].legal_attach_list != '') {
                                attachmentIds = attachmentIds + ',' + result.json_data.response.data[j].legal_attach_list.replace(/^,|,$/g, '');
                            }
                        }
                        else {
                            if (result.json_data.response.data[j].legal_attach_list != '') {
                                attachmentIds = result.json_data.response.data[j].legal_attach_list.replace(/,/g, '').replace(/^,|,$/g, '');
                            }
                        }
                    }
                    else {
                        if (result.json_data.response.data[j].manager_attach_list != '') {
                            attachmentIds = attachmentIds + ',' + result.json_data.response.data[j].manager_attach_list.replace(/^,|,$/g, '');

                            if (result.json_data.response.data[j].legal_attach_list != '') {
                                attachmentIds = attachmentIds + ',' + result.json_data.response.data[j].legal_attach_list.replace(/^,|,$/g, '');
                            }
                        }
                        else {
                            if (result.json_data.response.data[j].legal_attach_list != '') {
                                attachmentIds = result.json_data.response.data[j].legal_attach_list.replace(/^,|,$/g, '');
                            }
                        }
                    }
                }
            }

            if (j == result.json_data.response.data.length - 1) {
                attachmentIds = attachmentIds.replace(/[ ,]+/g, ",").replace(/^0+/, '').replace(/^,|,$/g, '');
                var msg = "Attachments by Takeda";
                attachCRORequestImg(attachmentIds, msg);
            }
        }
    });
    /*****AttachmentIcon click event end here*****/

    /*****Description text click event start here*****/
    $('#example1 tbody').on('click', '.txtBtn', function (e) {
        var request_id = $(this).attr('id');
        var txt_id = $(this).children('font').attr('id');
        var managerActionDesc = '';
        var arr = new Array();

        var counter = 0;
        for (var j = 0; j < result.json_data.response.data.length; j++) {
            if (result.json_data.response.data[j].request_number == txt_id) {
                if (result.json_data.response.data[j].request_id == request_id && arr.indexOf(request_id) == -1) {
                    arr.push(request_id);
                    counter = counter + 1;
                    if (result.json_data.response.data[j].legal_action_date == "0000-00-00 00:00:00" || result.json_data.response.data[j].legal_action_date == null || result.json_data.response.data[j].legal_action_date == "null") {
                        if (counter == 1) {
                            managerActionDesc = result.json_data.response.data[j].manager_action_desc;
                        }
                        else {
                            if (result.json_data.response.data[j].manager_action_desc != '') {
                                managerActionDesc = managerActionDesc + ',' + result.json_data.response.data[j].manager_action_desc;
                            }
                        }
                    }
                    else {
                        if (result.json_data.response.data[j].manager_action_date <= result.json_data.response.data[j].legal_action_date) {
                            if (counter == 1) {
                                managerActionDesc = result.json_data.response.data[j].legal_action_desc;
                            }
                            else {
                                if (result.json_data.response.data[j].legal_action_desc != '') {
                                    managerActionDesc = managerActionDesc + ',' + result.json_data.response.data[j].legal_action_desc;
                                }
                            }
                        }
                        else {
                            if (counter == 1) {
                                managerActionDesc = result.json_data.response.data[j].manager_action_desc;
                            }
                            else {
                                if (result.json_data.response.data[j].manager_action_desc != '') {
                                    managerActionDesc = managerActionDesc + ',' + result.json_data.response.data[j].manager_action_desc;
                                }
                            }
                        }
                    }
                }
            }
            if (j == result.json_data.response.data.length - 1) {
                var msg = "Description by Takeda";
                croDescFun(managerActionDesc, msg);
            }
        }
    });
    /*****Description text click event end here*****/

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
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span id="' + result.json_data.response.data[j].escalation_type_id + '"></span><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
            }
            else {             
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span id="' + result.json_data.response.data[j].escalation_type_id + '"></span><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '</a></td>';
            }
        }
        else {
            //Entries budget and contract
            if (result.json_data.response.data[j].selectPriority == 2) {
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span id="' + result.json_data.response.data[j].escalation_type_id + '"></span><img class="imgHigh" id="' + result.json_data.response.data[j].request_number + '" src="'+highIcon+'" /> <a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
            }
            else if (result.json_data.response.data[j].selectPriority == 1) {
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span id="' + result.json_data.response.data[j].escalation_type_id + '"></span><img class="imgUrgent" id="' + result.json_data.response.data[j].request_number + '" src="'+urgentIcon+'" /> <a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
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
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span id="' + result.json_data.response.data[j].escalation_type_id + '"></span><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
            }
            else {          
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span id="' + result.json_data.response.data[j].escalation_type_id + '"></span><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '</a></td>';  
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
                html += '<td>Contract - ' + result.json_data.response.data[j].type_contract_language + ' - ' + result.json_data.response.data[j].type_issues + '</td>';
            }
            else {
                html += '<td>Contract - ' + result.json_data.response.data[j].type_issues;
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
        html += '<td>Budget - ' + result.json_data.response.data[j].choose_an_issue + '</td>';
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
    if (result.json_data.response.data[j].legal_first_name === null && result.json_data.response.data[j].legal_last_name === null) {        
        if (result.json_data.response.data[j].escalation_first_name === null && result.json_data.response.data[j].escalation_last_name === null) {            
            html += '<td class="dots">.....</td>';
        }
        else{
            if (result.json_data.response.data[j].escalation_first_name === null && result.json_data.response.data[j].escalation_first_name != '0'){
                if (result.json_data.response.data[j].escalation_last_name === null && result.json_data.response.data[j].escalation_last_name != '0'){
                    html += '<td class="dots">.....</td>';
                }
                else{
                    html += '<td>' + result.json_data.response.data[j].escalation_last_name + '</td>';
                }
            }
            else{
                if (result.json_data.response.data[j].escalation_last_name === null && result.json_data.response.data[j].escalation_last_name != '0'){
                    
                    html += '<td>' + result.json_data.response.data[j].escalation_first_name + '</td>';
                }
                else{
                    html += '<td>' + result.json_data.response.data[j].escalation_first_name + " " + result.json_data.response.data[j].escalation_last_name + '</td>';
                }
            }
        }
    }
    else{
        if(result.json_data.response.data[j].legal_first_name === null && result.json_data.response.data[j].legal_first_name != '0')
        {
            if(result.json_data.response.data[j].legal_last_name === null && result.json_data.response.data[j].legal_last_name != '0'){
                html += '<td class="dots">.....</td>';
            }
            else{
                html += '<td>' + result.json_data.response.data[j].legal_last_name + '</td>';
            }
        }
        else{
            if(result.json_data.response.data[j].legal_last_name === null && result.json_data.response.data[j].legal_last_name != '0'){
                html += '<td>' + result.json_data.response.data[j].legal_first_name + '</td>';
            }
            else{
                html += '<td>' + result.json_data.response.data[j].legal_first_name + " " + result.json_data.response.data[j].legal_last_name + '</td>';
            }
        }
    }
    // Assigned Managers column end here
   
    var performActionArr = new Array("Pending", "Approved", "Denied", "Negotiation Required", "Escalated", "Approved with modification", "On hold", "Reassigned", "Closed");
    var colorClassArr = new Array("#ebe200", "#1bd850", "#e73c14", "#25d6ae", "#F90", "#090", "#ebe200", "#F60", "#000");

    var action;
    
    // Escalation Manager action column start here
    if (result.json_data.response.data[j].manager_action !== null && result.json_data.response.data[j].manager_action !== '0' && result.json_data.response.data[j].manager_action !== undefined) {
        for (p = 0; p < performActionArr.length + 1; p++) {
            if (p == result.json_data.response.data[j].manager_action) {
                action = p - 1;
                html += '<td class="performActionFont" style="color:'+colorClassArr[action]+'">' + performActionArr[action] + '</td>';
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
                    html += '<td class="new">New</td>';
            }
            else if (result.json_data.response.data[j].legal_action == 1) {
                html += '<td class="pending">Pending</td>';
            }
            else {
                var performArrICFGlobal = new Array("Approved", "Approved with modification", "Reassigned");
                var colorGlobalArr = new Array("#1bd850", "#090", "#F60");
                var dropDownArrGICF = new Array("2", "4", "7");
                for (k = 0; k < performArrICFGlobal.length; k++) {
                    if (dropDownArrGICF[k] == result.json_data.response.data[j].legal_action) {                       
                        html += '<td class="performActionFont" style="color:'+colorGlobalArr[k]+'">' + performArrICFGlobal[k] + '</td>';
                    }
                }
            }
        }
        else{
            if (result.json_data.response.data[j].legal_action == 0) {
                html += '<td class="new">New</td>';
            }
            else if (result.json_data.response.data[j].legal_action == 1) {
                html += '<td class="pending" style="color:#CC0;">Pending</td>';
            }
            else {
                var performICFCountrySite = new Array("Approved", "Denied", "Approved with modification", "Additional Consultation", "Reassigned");
                var colorICFCountrySite = new Array("#1bd850", "#e73c14", "#090", "#000", "#5bc0de");
                var dropDownArrCSICF = new Array("2", "3", "4", "9", "7");
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
        var colorGCArr = new Array("#ebe200","#1bd850", "#e73c14", "#090", "#CC0", "#ebe200", "#5bc0de", "#000");
        if(result.json_data.response.data[j].legal_action == 0){
            html += '<td class="dots">.....</td>';
        }else{
            for (p = 0; p < performGCArr.length + 1; p++) {
                if (p == result.json_data.response.data[j].legal_action) {
                    action = p - 1;
                    html += '<td class="performActionFont" style="color:'+colorGCArr[action]+'">' + performGCArr[action] + '</td>';
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
        if (result.json_data.response.data[j].manager_attach_list.replace(/^0+/, '').replace(/^,|,$/g, '') == '' || result.json_data.response.data[j].manager_attach_list == null || result.json_data.response.data[j].manager_attach_list == 'null') {
            if (result.json_data.response.data[j].legal_attach_list.replace(/^0+/, '').replace(/^,|,$/g, '') == '' || result.json_data.response.data[j].legal_attach_list == null || result.json_data.response.data[j].legal_attach_list == 'null') {
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
                            html += '<a href="#" class="desAttach txtBtn" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive" txt_ActiveIcon" id="' + result.json_data.response.data[j].request_number + '" src="'+textActive+'" /></a>';
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
        if (result.json_data.response.data[j].manager_attach_list.replace(/^0+/, '').replace(/^,|,$/g, '') == '' || result.json_data.response.data[j].manager_attach_list == null || result.json_data.response.data[j].manager_attach_list == 'null') {
            if (result.json_data.response.data[j].legal_attach_list.replace(/^0+/, '').replace(/^,|,$/g, '') == '' || result.json_data.response.data[j].legal_attach_list == null || result.json_data.response.data[j].legal_attach_list == 'null') {
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

    $('.table-responsive .tbodyContainer').append(html);
}
/*****Request number popup start here*****/
function requestNoPopup(requestId, escalationTypeId, result, escalationResult, request_number,resultIssueType, managerType) {
    //alert(requestId+"--"+escalationTypeId)
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
                displayFormDetail(viewCroResult,requestId, escalationTypeId, result, escalationResult, request_number,resultIssueType, managerType)
            }
        },
        error: function (e) {
            loaderRemoveFun();
            return;
        }
    });
}
function displayFormDetail(viewCroResult,requestId, escalationTypeId, result, escalationResult, request_number,resultIssueType, managerType){
    $('#myModal').remove();
	$('.modal-backdrop').remove();	
	var html = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
	    html += '<div class="vertical-alignment-helper">';
                html += '<div class="modal-dialog vertical-align-center checklistModel" id="checklistModel">';
                 html += '<div class="modal-content">';
                    html += '<div class="modal-header headerDiv">';					
						html += '<button type="button" class="close crossIcon"';
							html += 'data-dismiss="modal">';
							html += '<span aria-hidden="true">&times;</span>'
						html += '</button>';
                    html += '</div>';

                    html += '<div class="modal-body checkListPopup" id="requestNoBody">';
                        html += '<div class="bg-white" id="checkListDiv">';                     
                        html += '</div>';                        
                    html += '</div>';

                html += '</div>';
               html += '</div>';
       html += '</div>';
     html += '</div>';

	$('body').append(html);
	$('#myModal').modal();

	$('#myModal').on('hidden.bs.modal', function (e) {
		loaderRemoveFun();
    });
    
    var userType = window.localStorage.getItem('userType');
    var statusTextArea ='null';
    var status = 1;
    var selectUserId;

    //loaderLogin();
     /*****ListEscalation webservice call start here*****/
    //  $.ajax({
    //     url: serviceHTTPPath + "listEscalation",
    //     type: "GET",
    //     dataType: 'json',
    //     success: function (resultICFOptions) {
    //         //alert("success="+JSON.stringify(result))
    //         loaderRemoveFun();
            
            
    //     },
    //     error: function (e) {
    //         loaderRemoveFun()
    //         return;
    //     }
    // });
    /*****ListEscalation webservice call end here*****/   
    for (var p = 0; p < viewCroResult.json_data.response.length; p++) {
        if(p==0){
            appendRequestPopup(viewCroResult, p, userType, escalationResult,managerType,resultIssueType,0)
        }               
    }
    var setFileIds = 0;
    var setOption;
                
	//alert(p+"--"+viewCroResult.json_data.response[p].escalation_type_id)
	if(viewCroResult.json_data.response[0].escalation_type_id == 4)
	{                
		if(viewCroResult.json_data.response[0].escalation_sub_type_id == 1)
		{
			if(viewCroResult.json_data.response[0].attachment_global_icf != '')
			{
				setFileIds = viewCroResult.json_data.response[0].attachment_global_icf
				var setOption = "GlobalICF"
				imageAttachLogo(0,viewCroResult,setFileIds,setOption)
			}
			if(viewCroResult.json_data.response[0].attachment_protocol != '')
			{
				setFileIds = viewCroResult.json_data.response[0].attachment_protocol
				var setOption = "ProtocolICF"
				imageAttachLogo(0,viewCroResult,setFileIds,setOption)
			}
			if(viewCroResult.json_data.response[0].attachment_other_relevant_document != '')
			{
				setFileIds = viewCroResult.json_data.response[0].attachment_other_relevant_document
				var setOption = "document"
				imageAttachLogo(0,viewCroResult,setFileIds,setOption)
			}
		}
		if(viewCroResult.json_data.response[0].escalation_sub_type_id == 2)
		{
			if(viewCroResult.json_data.response[0].attachment_country_icf != '')
			{
				setFileIds = viewCroResult.json_data.response[0].attachment_country_icf
				var setOption = "CountryICF"
				imageAttachLogo(0,viewCroResult,setFileIds,setOption)
			}
			if(viewCroResult.json_data.response[0].attachment_other_relevant_document != '')
			{
				setFileIds = viewCroResult.json_data.response[0].attachment_other_relevant_document
				var setOption = "document"                           
				imageAttachLogo(0,viewCroResult,setFileIds,setOption)
			}
		}
		if(viewCroResult.json_data.response[0].escalation_sub_type_id == 3)
		{
			if(viewCroResult.json_data.response[0].attachment_site_icf != '')
			{
				setFileIds = viewCroResult.json_data.response[0].attachment_site_icf
				var setOption = "SiteICF"
				imageAttachLogo(0,viewCroResult,setFileIds,setOption)
			}
			if(viewCroResult.json_data.response[0].attachment_other_relevant_document != '')
			{
				setFileIds = viewCroResult.json_data.response[0].attachment_other_relevant_document
				var setOption = "document"
				imageAttachLogo(0,viewCroResult,setFileIds,setOption)
			}
		}
	}
	else
	{ 
	 setOption = '';
     imageAttachLogo(0, viewCroResult, viewCroResult.json_data.response[0].attachment_file_ids, setOption);
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
                    attachEditProtocol(requestId, selectUserId, request_number,escalationTypeId);
                }
            });
            /*****Load Protocol list according to input value end here*****/
        }  
     /*****EditProtocol  button click start here*****/
        $('.editProtocolClick').click(function (e) {

            $('#chooseProtocolPopUp').css("background-color", "#fff");
            var selectVal = $('#checklistModel .chooseProtocolPopUp .selectProtocol .filter-option').text();
           
            $('.chooseProtocolPopUp .attachSelect').remove();
            html += '<div class="attachSelect" id="">';				
                html += '<select class="selectpicker selectProtocol" id="selectProtocolId" name="selValue" data-show-subtext="true" data-live-search="true" style="display: none;">';
                html += '<option data-subtext="" value="">' + selectVal + '</option>';
                html += '</select>';
            html += '</div>';

            $('.chooseProtocolPopUp').append(html);
        
            $('#checklistModel .chooseProtocolPopUp .selectpicker').selectpicker('refresh');
            $('#checklistModel .chooseProtocolPopUp .selectpicker').css("position", "relative");
            $('#checklistModel .chooseProtocolPopUp .selectpicker').css("top", "auto !important");
            $('#checklistModel .chooseProtocolPopUp .btn-group bootstrap-select').css("width", 100 + "%");

            $('#checklistModel .chooseProtocolPopUp .selectpicker').attr('disabled', false);

            attachEditProtocol(requestId, 1, request_number,escalationTypeId);
        });
        /*****EditProtocol button click end here*****/
    
}

function appendRequestPopup(viewCroResult, p, userType, escalationResult, managerType,resultIssueType,resultICFOptions){
   
    //var html;     
    //alert(userType+"--"+managerType)  
    var protocolVal = viewCroResult.json_data.response[p].request_number + " - " + viewCroResult.json_data.response[p].protocol_number;

    var html = '<div class="addPopItems' + p + '">';
        html += '<h4 class="modal-title radioColor" id="myModalLabel" style="font-size:24px;">';
        html += 'Request Number- ';
        if (userType == 1) {
            html += '<span style="font-size:24px;">' + protocolVal + '</span>';
        }           
         
        //Icf Type sitename
            if (viewCroResult.json_data.response[p].escalation_type_id == 4) {
                if (viewCroResult.json_data.response[p].escalation_sub_type_id == 3) {
                    html += '<br>'
                    html += '<span style="padding-right: 28px;font-size:24px;">' + viewCroResult.json_data.response[p].sitename + '</span>';
                }
            }
            else {
                html += '<br>';
                html += '<span style="padding-right: 28px;font-size:24px;">' + viewCroResult.json_data.response[p].sitename + '</span>';
            }
            html += '<div class="modal-title radioColor" id="myModalLabel">';     
               // html += '<a class="btn-info editPerformAction performClick" href="#" id="' + viewCroResult.json_data.response[p].request_number + '" style="margin-right: 13px;float:right;"> Perform Action</a>';
               // html += '<a class="btn-info editPerformAction editProtocolClick" href="#" id="' + viewCroResult.json_data.response[p].request_id + '"> Edit Protocol</a>';
            html += '</div>';
        html += '</h4>';

        
    html += '</div>';
    
    /****** ICF Popup Start Here******/
    if (viewCroResult.json_data.response[p].escalation_type_id == 4) {
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
            html += '<p class="question text-uppercase text-bold rowMargin">Type of review of escalation</p>'
            html += '<div class="row dropBoxClass">';
                html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                    html += '<div class="form-check floatLeft">'
                        html += '<label class="radionBtn">'
                        var icfArrPopup = new Array("Global master Informed Consent Form Legal Review", "Country Level Informed Consent Form Legal Escalation", "Site Level Informed Consent Form Legal Escalation");
                            if (viewCroResult.json_data.response[p].escalation_sub_type_id == 1) {
                                html += '<input type="radio" name="review" value="" checked style="display: none;"> <span class="label-text selectedRadio">' + icfArrPopup[0] + '</span>'
                            }
                            else if (viewCroResult.json_data.response[p].escalation_sub_type_id == 2) {
                                 html += '<input type="radio" name="review" value="" checked style="display: none;"> <span class="label-text selectedRadio">' + icfArrPopup[1] + '</span>'
                            }
                            else if (viewCroResult.json_data.response[p].escalation_sub_type_id == 3) {
                                html += '<input type="radio" name="review" value="" checked style="display: none;"> <span class="label-text selectedRadio">' + icfArrPopup[2] + '</span>'
                            }
                        html += '</label>'
                    html += '</div>';
                html += '</div>';
            html += '</div>';
         
        html += '</div>';

	   var studyDetailArr = new Array("1. Protocol Number", "2. Site Name", "3. Country", "4. Raised by", "5. Principal Investigator", "6. Requested by","7. CC")
	 
			 var h;      
			 if(viewCroResult.json_data.response[p].escalation_sub_type_id == 1)//This code for ICF first option
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
								 html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response[p].protocol_number + '" placeholder="" disabled>';
								 }
								 else{
									  html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response[p].cc_email + '" placeholder="" disabled>';
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
						html += '<input type="text" class="" value="' + viewCroResult.json_data.response[p].region_name + '" placeholder="" disabled>';
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
			 if(viewCroResult.json_data.response[p].escalation_sub_type_id == 2)////This code for ICF second Country Level option
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
								 html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response[p].protocol_number + '" placeholder="" disabled>';
								 }
								 else if(h == 1){
									 html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response[p].country_name + '" placeholder="" disabled>';
								 }
								 else{
									  html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response[p].cc_email + '" placeholder="" disabled>';
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
				   // html += '<ul id="check-list-box" class="list-group checked-list-box" style="margin:0;">'
					for(var k=0;k<viewCroResult.json_data.response[p].section_requiring_legal_review.length;k++)
					{                   
						if(sectionArr[viewCroResult.json_data.response[p].section_requiring_legal_review[k]] != undefined)
						{
						   html += '<div class="row dropBoxClass">';
							html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
							 html += '<div class="form-check floatLeft">'
								html += '<label class="radionBtn">'
									html += '<input type="checkbox" name="requestType" value="" checked disabled> <span class="label-text selectedRadio">'+sectionArr[viewCroResult.json_data.response[p].section_requiring_legal_review[k]]+'</span>'
								html += '</label>'
							html += '</div>';
						   html += '</div>';
					 html += '</div>';
						 //  html += '<li class="list-group-item disabled" data-checked="true" data-color="info" style="font-size:20px;border-radius: 0;border: none; background-color:#fff;text-align: left;color:#337ab7;"><span id="chkId'+k+'" class="chkText"  style="background-color:#fff;">' + sectionArr[viewCroResult.json_data.response[p].section_requiring_legal_review[k]] + '</span></li>'    
						}
					}                
				   // html += '</ul>'
				  html += '</div>'
				  
				 html += '</div>';
				 
				  var textArr = new Array("If any of the changes are required based on change in regulation or law, you must specify and provide relevant documentation.","If any of the changes are based on Ethics Committee(EC) or Institutional Review Board(IRB) feedback, Please specify and provide relevant documentation.","Any other details")
                
                  //TextAreas attached
                    html += '<div class="pageBorder fontTitle" id="">';
                        for(var g=0;g<textArr.length;g++){
                            html+= '<div class="textInput" id="txtAreaId'+g+'">';
                                html += '<p class="studyTitle topMargin text-uppercase">'+textArr[g]+'</p>';
                                if(k==0)
                                {
                                    html += '<div class="summernote" disabled>'+viewCroResult.json_data.response[p].specify_relevant_document+'</div>';	
                                }
                                else if(k==1)
                                {
                                    html += '<div class="summernote" disabled>'+viewCroResult.json_data.response[p].EC_IRB_feedback+'</div>';	 
                                }
                                else{
                                    html += '<div class="summernote" disabled>'+viewCroResult.json_data.response[p].any_other_detail+'</div>';	 
                                }						
                            html += '</div>';
                        }
                    html += '</div>';
              
                    //Add the following attachment(s)
                    html += '<div class="pageBorder fontTitle rowMargin" id="">';//This code for ICF second
                    html += '<p class="studyTitle text-uppercase">Add the following attachment(s)</p>';
                    
                    var attArrPopup = new Array("1. Country ICF(required)","2. Other relevant document(s) (optional)");                  
                        html += '<div class="row">';
                        for (var u = 0; u < attArrPopup.length; u++) {
                                html += '<div class="col-xs-12 col-sm-12 col-lg-12 icfRadioTitle icfRadioContainer" id="">';
                                html += '<span class="">' + attArrPopup[u] + '</span>';
                                html += '<div class="imgListAdd'+u+'" style=""></div>'
                                html += '</div>';
                        }
                        html += '</div>';				
                    html += '</div>';
			 }
			 
			 // ICF Site
			 if(viewCroResult.json_data.response[p].escalation_sub_type_id == 3)//This code for ICF third option(SLI)
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
                                html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response[p].protocol_number + '" placeholder="" disabled>';
                                }
                                else if(h == 1){
                                    html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response[p].sitename + '" placeholder="" disabled>';
                                }
                                else if(h == 2){
                                    html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response[p].country_name + '" placeholder="" disabled>';
                                }
                                else if(h == 3){
                                    html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response[p].principle_investigator + '" placeholder="" disabled>';
                                }								 
                                else{
                                    html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response[p].cc_email + '" placeholder="" disabled>';
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
                    // html += '<ul id="check-list-box" class="list-group checked-list-box" style="margin:0;">'
                    for(var k=0;k<viewCroResult.json_data.response[p].section_requiring_legal_review.length;k++)
                    {                   
                        if(sectionArr[viewCroResult.json_data.response[p].section_requiring_legal_review[k]] != undefined)
                        {
                        html += '<div class="row dropBoxClass">';
                            html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                            html += '<div class="form-check floatLeft">'
                                html += '<label class="radionBtn">'
                                    html += '<input type="checkbox" name="requestType" value="" checked disabled> <span class="label-text selectedRadio">'+sectionArr[viewCroResult.json_data.response[p].section_requiring_legal_review[k]]+'</span>'
                                html += '</label>'
                            html += '</div>';
                        html += '</div>';
                    html += '</div>';
                        /* html += '<li class="list-group-item disabled" data-checked="true" data-color="info" style="font-size:20px;border-radius: 0;border: none; background-color:#fff;text-align: left;color:#337ab7;"><span id="chkId'+k+'" class="chkText"  style="background-color:#fff;">' + sectionArr[viewCroResult.json_data.response[p].section_requiring_legal_review[k]] + '</span></li>' */   
                        }
                    }                
                    // html += '</ul>'
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
                            html += '<div class="summernote descTextArea' + g + ' descArea" disabled>' + viewCroResult.json_data.response[p].EC_IRB_feedback+ '</div>'
                        }
                        else if(g==1)
                        {
                            html += '<div class="summernote descTextArea' + g + ' descArea" disabled>' + viewCroResult.json_data.response[p].any_other_detail+ '</div>'
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
         
          var _id = parseInt(viewCroResult.json_data.response[p].escalation_type_id)-1;
         
           html += '<div class="row dropBoxClass">';
            html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                html += '<div class="form-check floatLeft">'
                    html += '<label class="radionBtn">'
                        html += '<input type="radio" name="requestType" value="" checked> <span class="label-text selectedRadio">'+escalationResult.json_data.response[_id].name+'</span>'
                    html += '</label>'
                html += '</div>';
            html += '</div>';
           html += '</div>';

          html += '</div>';

          var studyDetailArr = new Array("Protocol Number", "Site Name", "Country", "Raised By", "Principal Investigator", "Requested By", "CC", "Was this issue previously raised in the app and if so, should this be directed to specific Takeda Contract manager?");

          html += '<div class="pageBorder" id="inputStudyDetail">';
            html += '<p class="studyTitle fontTitle">ENTER STUDY DETAILS</p>';
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
                        html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response[p].protocol_number + '" placeholder="" disabled>';
                       }
                       else if(h==1){
                        html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response[p].sitename + '" placeholder="" disabled>';
                       }
                       else if(h==2){
                        html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response[p].country_name + '" placeholder="" disabled>';
                       }
                       else if(h==3){
                        html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response[p].raised_by + '" placeholder="" disabled>';
                       }
                       else if(h==4){
                        html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response[p].principle_investigator + '" placeholder="" disabled>';
                       }
                       else if(h==5){
                        html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response[p].requested_by + '" placeholder="" disabled>';
                       }
                       else if(h==6){
                        html += '<input type="text" class="inputStudyDetail' + h + '" value="' + viewCroResult.json_data.response[p].cc_email + '" placeholder="" disabled>';
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
                            if (viewCroResult.json_data.response[p].followUp == 0) {
                                html += '<input type="radio" name="raised" value="" checked> <span class="label-text selectedRadio">Yes</span>'
                            }
                            else{
                                html += '<input type="radio" name="raised" value="" checked> <span class="label-text selectedRadio">No</span>'
                            }
                            html += '</label>'
                        html += '</div>';
                       html += '</div>';
                     html += '</div>';

                     if (viewCroResult.json_data.response[p].followUp != 0) {
                        var setManagerName = viewCroResult.json_data.response[p].escalation_first_name + " " + viewCroResult.json_data.response[p].escalation_last_name;
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

          //Issue types
          
          var j;
          var CTAHide = "";
          var selectCLE_Type = new Array("CTA", "CDA", "Others");
          //***Start budget Page Start Here***//
            if (viewCroResult.json_data.response[p].escalation_type_id == 1) {
                html += '<div class="pageBorder" id="">';
                html += '<p class="question studyTitle fontTitle">Choose an issue type</p>';

                for (var j = 0; j < resultIssueType.json_data.message.length; j++) {
                    if (resultIssueType.json_data.message[j].issue == viewCroResult.json_data.response[p].choose_an_issue) {
                        html += '<div class="row issueTypes">';
                            html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                                html += '<div class="form-check floatLeft">'
                                    html += '<label class="radionBtn">'
                                        html += '<input type="radio" name="issueTypeRadio" value="'+j+'" checked> <span id="issueTypeTxt'+j+'" class="label-text selectedRadio">'+resultIssueType.json_data.message[j].issue+'</span>'
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
                        html += '<div class="summernote descTextArea" disabled>'+viewCroResult.json_data.response[p].dsec_issue+'</div>';	

                        // Site Request Attach start here
                        html += '<div class="row site-box">';
                        
                            html += '<div class="col-xs-6 col-sm-6 col-lg-6" >';
                            html += '<span class="optionValTile">Site Request</span>';
                                html += '<input class="floatRight siteRText" type="text" id="" value="' + viewCroResult.json_data.response[p].site_request + '" placeholder="" disabled>';
                                html += '<input class="floatRight siteRText currencyTxT" type="text" id="" value="' + viewCroResult.json_data.response[p].currency_type + '" placeholder="" disabled>';
                            html += '</div>';

                            // Initial Offer Attach start here
                            html += '<div class="col-xs-6 col-sm-6 col-lg-6" >';
                            html += '<span class="optionValTile">Initial Offer</span>';                     
                                html += '<input class="floatRight initialText" type="text" id="" value="' + viewCroResult.json_data.response[p].initial_offer + '" placeholder="" disabled>';
                                html += '<input class="floatRight initialText currencyTxT" type="text" id="" value="' + viewCroResult.json_data.response[p].currency_type + '" placeholder="" disabled>';
                            html += '</div>';

                        html += '</div>';

                        // Percent over Initial Offer Attach start here
                        html += '<div class="row site-box">';
                            html += '<div class="col-xs-12 col-sm-12 col-lg-12" >';
                                html += '<span class="optionValTile">Percent over Initial Offer</span>';
                                html += '<input class="floatRight initialText" type="text" id="" value="' + viewCroResult.json_data.response[p].percent_initial + '" placeholder="" disabled>';	
                            html += '</div>';	
                        html += '</div>';
                        // Percent over Initial Offer Attach end here

                    html += '</div>';

                    html += '<div class="pageBorder" id="">';   
                        //FMV 75% BENCHMARK   
                        html += '<div class="row site-box">';
                        html += '<div class="col-xs-12 col-sm-12 col-lg-12" >';
                            html += '<span class="optionValTile">FMV 75% BENCHMARK</span>';
                            html += '<input class="floatRight banchmarkText inputDes" type="text" id="" value="' + viewCroResult.json_data.response[p].FMV_high + '" placeholder="" disabled>';
                            html += '<input class="floatRight initialText currencyTxT" type="text" id="" value="' + viewCroResult.json_data.response[p].currency_type + '" placeholder="" disabled>';
                        html += '</div>';
                        html += '</div>';

                        //PERCENT OVER FMV BENCHMARK
                        html += '<div class="row site-box">';
                        html += '<div class="col-xs-12 col-sm-12 col-lg-12" >';
                        html += '<span class="optionValTile">PERCENT OVER FMV BENCHMARK</span>';
                        html += '<input class="floatRight inputTxt" type="text" id="" value="' + viewCroResult.json_data.response[p].percent_FMV + '" placeholder="" disabled>';	
                        html += '</div>';
                        html += '</div>';

                    html += '</div>';

                    html += '<div class="pageBorder siteJustification" id="">';
                    //Site justification and negotiation history
                        html += '<p class="studyTitle topMargin fontTitle">Site justification and negotiation history</p>';
                        html += '<div class="summernote justification" disabled>' + viewCroResult.json_data.response[p].site_justification + '</div>';	
                    //Any other details
                        html += '<div class="otherDetails" id="">';
                            html += '<p class="studyTitle topMargin fontTitle">Any other details</p>';
                            html += '<div class="summernote details" disabled>' + viewCroResult.json_data.response[p].any_other_details + '</div>';	
                        html += '</div>';
                    html += '</div>';

                    html += '<div class="pageBorder" id="">';

                        html += '<div class="row site-box">';
                    // Do you want to add attachment start here
                        html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                        html += '<span class="addAttachment">Do you want to add attachment</span>';
                        html += '</div>';
                        html += '<div class="row previousIssue attachmentBtns">';
                                html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';

                                html += '<div class="form-check">'
                                    html += '<label class="radionBtn">'
                                    if(viewCroResult.json_data.response[p].add_attachment == 0){
                                        html += '<input type="radio" name="attachment" value="" checked> <span class="label-text selectedRadio">Yes</span>'
                                    }
                                    else{
                                        html += '<input type="radio" name="attachment" value="" checked> <span class="label-text selectedRadio">No</span>'
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
            //alert(viewCroResult.json_data.response[p].escalation_type_id +"--"+viewCroResult.json_data.response[p].type_contract_language)
            if (viewCroResult.json_data.response[p].escalation_type_id == 2) { 
                
                html += '<div class="pageBorder select_CLE" id="">';
                html += '<p class="question studyTitle fontTitle text-uppercase">Select the Type of Contract Language Escalation</p>';
                for (j = 0; j < selectCLE_Type.length; j++) {
                    if (selectCLE_Type[j] == viewCroResult.json_data.response[p].type_contract_language) {
                        CTAHide = selectCLE_Type[j];
                        html += '<div class="row issueTypes">';
                            html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                                html += '<div class="form-check floatLeft">'
                                    html += '<label class="radionBtn">'
                                        html += '<input type="radio" name="issueTypeRadio" value="'+j+'" checked> <span id="issueTypeTxt'+j+'" class="label-text selectedRadio">'+viewCroResult.json_data.response[p].type_contract_language+'</span>'
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
                    html += '<p class="question studyTitle fontTitle">Choose an issue type</p>';
                    for (j = 0; j < resultIssueType.json_data.message.length; j++) {
                       if (resultIssueType.json_data.message[j].issue == viewCroResult.json_data.response[p].type_issues) {
                           html += '<div class="row issueTypes">';
                               html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="">';
                                   html += '<div class="form-check floatLeft">'
                                       html += '<label class="radionBtn">'
                                           html += '<input type="radio" name="issueTypeRadio" value="'+j+'" checked> <span id="issueTypeTxt'+j+'" class="label-text selectedRadio">'+resultIssueType.json_data.message[j].issue+'</span>'
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
                  html += '<p class="question studyTitle fontTitle text-uppercase">ENTER DESCRIPTION OF CTA/ CDA/ OTHER ESCALATION(Include proposed or original language as applicable)</p>';
                  html += '<div class="summernote descArea disabled">' + viewCroResult.json_data.response[p].proposed_language + '</div>';
                 html += '</div>'; 

                 //Provide Site Rationale
                 html += '<div class="ProvideRationale" id="">';
                  html += '<p class="question studyTitle fontTitle text-uppercase">Provide Site Rationale</p>';
                  html += '<div class="summernote descArea disabled">' + viewCroResult.json_data.response[p].site_rationale + '</div>';
                 html += '</div>'; 

                 html += '<div class="imgListAdd' + p + '" style="overflow:hidden;"></div>';

                  //Describe Attempts to Negotiate
                 html += '<div class="ProvideRationale" id="">';
                  html += '<p class="question studyTitle fontTitle text-uppercase">Describe Attempts to Negotiate</p>';
                  html += '<div class="summernote descArea disabled">' + viewCroResult.json_data.response[p].attempts_negotiate + '</div>';
                 html += '</div>'; 

                html += '</div>';  

                //Any other details
                html += '<div class="pageBorder otherDetails" id="">';
                 html += '<p class="question studyTitle fontTitle text-uppercase">Any other details</p>';
                 html += '<div class="summernote descArea disabled">' + viewCroResult.json_data.response[p].other_detail + '</div>';

                  // Is this request of High Priority i.e response needed within 48 hours or less start here
                 html += '<div class="attachPrority' + p + '"></div>';

                html += '</div>';    

            }
        }
    }

    $('#checkListDiv').append(html);

    $('.summernote').summernote(
    {
        tabsize: 2,
        disableDragAndDrop:true
    });

    $('#summernote').summernote('disable');
    
    $(".note-editable").attr("contenteditable", "false");

    if (viewCroResult.json_data.response[p].escalation_type_id != 4) {
        // High and Urgent Prority function call
        attachHighPrority(viewCroResult, p)
    }
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
         if(viewCroResult.json_data.response[p].highPriority == 0){
             html += '<input type="radio" name="priority" value="" checked> <span class="label-text selectedRadio">Yes</span>'
         }
         else{
             html += '<input type="radio" name="priority" value="" checked> <span class="label-text selectedRadio">No</span>'
         }
         html += '</label>'
     html += '</div>'

      html += '</div>';
     html += '</div>';
        // alert(viewCroResult.json_data.response[p].selectPriority)
     if (viewCroResult.json_data.response[p].selectPriority != 0) {
        html += '<div class="row question-bg choosePriorityTxt">';

            html += '<div class="col-xs-12 col-sm-12 col-lg-12 text-right" id="">';
             html += '<p class="question priorityTitle">Choose the Priority</p>';
            html += '</div>';

            html += '<div class="col-xs-12 col-sm-12 col-lg-12 text-right urgentHigh" id="">';
            var prorityArr = new Array("High-response needed within 48 hours", "Urgent-response needed with 24 hours");

            html += '<div class="form-check">';
                html += '<label class="radionBtn">';
                if (viewCroResult.json_data.response[p].selectPriority == 1) {
                    html += '<input type="radio" name="highUrgent" value="" checked> <span class="label-text">'+viewCroResult.json_data.response[p].selectPriority[1]+'</span>';
                }
                else{
                    html += '<input type="radio" name="highUrgent" value="" checked> <span class="label-text">'+viewCroResult.json_data.response[p].selectPriority[0]+'</span>';
                }
                html += '</label>';
            html += '</div>';    

            html += '</div>';

            if (viewCroResult.json_data.response[p].priorityReason !== null && viewCroResult.json_data.response[p].priorityReason !== '' && viewCroResult.json_data.response[p].priorityReason !== 'null') {
                html += '<div class="addReasonDiv">';
                    html += '<div class="col-xs-12 col-sm-12 col-lg-12 text-right" id="">';
                    html += '<p class="question priorityTitle">Enter the reason for choosing the priority</p>';
                    html += '</div>';
        
                    html += '<div class="col-xs-12 col-sm-12 col-lg-12" id="" id="">';                    
                     html += '<textarea class="form-control summernote reasonPriority" placeholder="' + viewCroResult.json_data.response[p].priorityReason + '" id="" disabled>' + viewCroResult.json_data.response[p].priorityReason + '</textarea>';
                    html += '</div>';
                html += '</div>';
            }

        html += '</div>';
     }

 html += '</div>';

 $('.attachPrority' + p).append(html);
}
/*****Image attached in particular request number start here*****/
function imageAttachLogo(p, viewCroResult, setFileIds, setOption) {
    var setIDVal = '';
    if (setOption == '') {
        setIDVal = viewCroResult.json_data.response[p].attachment_file_ids;
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
			//alert(imgResult.json_data.response.length)
            if (imgResult.json_data.response.length != undefined) {
                for (var u = 0; u < imgResult.json_data.response.length; u++) {
                    //ICF type images attach here
                    var html;
                    if (viewCroResult.json_data.response[p].escalation_type_id == 4) {
                        if (viewCroResult.json_data.response[p].escalation_sub_type_id == 1) {
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
                        else if (viewCroResult.json_data.response[p].escalation_sub_type_id == 2) {
                            if (setOption == 'CountryICF') {
                                html = '<a class="linkTag" target="_blank" style="position: absolute;" href="' + imgResult.json_data.response[u].link + '">' + imgResult.json_data.response[u].link + '</a></br>';
                                $('.imgListAdd0').append(html);
                            }
                            if (setOption == 'document') {
                                html = '<a class="linkTag" target="_blank" style="position: absolute;" href="' + imgResult.json_data.response[u].link + '">' + imgResult.json_data.response[u].link + '</a></br>';
                                $('.imgListAdd1').append(html);
                            }
                        }
                        else if (viewCroResult.json_data.response[p].escalation_sub_type_id == 3) {
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
                        if (p == viewCroResult.json_data.response.length - 1) {
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
                if (p == viewCroResult.json_data.response.length - 1) {
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
                        $('#checklistModel .chooseProtocolPopUp .selectpicker').attr('disabled', true);

                        /*****Update protocol start here*****/
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
                                    jsonResponseMsg(msg);

                                    var fromDate = new Date($('#consultantStart').val());
                                    var _dayFrom = ("0" + fromDate.getDate()).slice(-2);
                                    var _monthFrom = ("0" + (fromDate.getMonth() + 1)).slice(-2);

                                    var toDate = new Date($('#consultantEndDate').val());
                                    var _dayTo = ("0" + toDate.getDate()).slice(-2);
                                    var _monthTo = ("0" + (toDate.getMonth() + 1)).slice(-2);

                                    var _fromDateSet = fromDate.getFullYear() + "-" + (_monthFrom) + "-" + (_dayFrom);
                                    var _toDateSet = toDate.getFullYear() + "/" + (_monthTo) + "/" + (_dayTo);
                                   // alert(selectUserId+"=="+_fromDateSet+"--"+_toDateSet)
                                   if(escalationTypeId == 4){
                                    //callLegalRequest(selectUserId, _fromDateSet, _toDateSet);
                                   }else{
                                    //callLECWebservice(selectUserId, _fromDateSet, _toDateSet);
                                   }
                                   
                                }
                                else {
                                    jsonResponseMsg(msg);
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