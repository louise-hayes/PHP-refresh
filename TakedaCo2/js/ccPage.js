function calltoCCPage(){
    var requestId = getQueryVariable("request_id");
    var escalationTypeId = getQueryVariable("escalation_type_id");

    loaderLogin();
    $.ajax({
        url: serviceHTTPPath + "viewCroRequestID",
        type: "POST",
        dataType: 'json',
        headers: {
          "authorization": window.localStorage.getItem("token_id")
        },
        data: { request_id: requestId, escalation_type_id: escalationTypeId },
        success: function (result) {
            if(result.json_data.response == 4 || result.json_data.response == 5 || result.json_data.response == 6){
                location.href = "../index.html";
            }else{
                loaderRemoveFun();
                //alert("success="+JSON.stringify(result))
                ccTableDataFun(result);
            }
        },
        error: function (e) {
            loaderRemoveLogin();
            return;
        }
    });
}
//request_id and escalation_type_id get from URL using below function
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}
//viewCroRequestID Webservice call for data table
function ccTableDataFun(result) {    
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
  
    for (var j = 0; j < result.json_data.response.data.length; j++) {               
        croTableListFun(result, j, "");                
    }

     //Call in js/main.js
    dataTableSet(1);
    tableClickEvents(result,"");

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