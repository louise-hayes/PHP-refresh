function reassignedFun(){
    var hamburgerActive = 1;    
    if(window.localStorage.getItem('userType') != null){  
        hamburgerList(hamburgerActive, window.localStorage.getItem('userType'));   

        setDefaultDate();
        var fromDate =  $("#datepicker").val();
        var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( fromDate ) );
        
        var toDate = $("#toDatepicker").val(); 
        var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ) );    
        window.localStorage.setItem("dashOrArchive", 1);
        var user_id = window.localStorage.getItem("user_id");
    
        var coeType = window.localStorage.getItem("userType");
        if(coeType == 2){
            //Drop drow select manager type
            selectManagerType(user_id,"reassigned");
        }else{
            legalName(user_id);
            reassignedWebService(fromDateNewFormat, todateNewFormat,user_id,coeType,"reassigned");
        }
    
        //Date Change click event
        setDateOnSelect(user_id,"reassigned");
    }else{
        location.href = "../index.html";
    }

   
}
function reassignedWebService(fromDate,toDate,user_id,hamburgerType)
{
    loaderLogin();
    /*****Manager Request webservice call start here*****/
    var coeType = window.localStorage.getItem("userType");
        coeType = coeType-1;
    
    $.ajax({
        url: serviceHTTPPath + "reassignedRequest",
        type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        }, 
        data:{
            coe_manager_id :user_id,
            coe_type:coeType,
            startDate:fromDate,
            endDate:toDate
        },
        success: function (result)
        {   //alert("success="+JSON.stringify(result))
            loaderRemoveFun(); 

            if(result.json_data.response == 4 || result.json_data.response == 5 || result.json_data.response == 6){
                location.href = "../index.html";
            }else{            
                if(coeType == 1){
                    viewManagerRequest(result,user_id,"reassigned");
                }else{
                    //call in js/LMDashboard.html
                    legalManagerList(result,user_id,"reassigned");
                }
                
            }
        },
        error: function (e)
        {
            loaderRemoveLogin()
            return;
        }
    });
    /*****Manager Request webservice call end here*****/
}
function reassignedManagerList(result,user_id,coeType,viewManagerArr){

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

    if(result.json_data.message != 'Not Found!')
    {
        for(var j=0;j<result.json_data.response.length;j++)
        {
            var protocol = result.json_data.response[j].request_number+"-"+result.json_data.response[j].protocol_number
            var reassignedManager= result.json_data.response[j].escalation_first_name+" "+result.json_data.response[j].escalation_last_name
            sortTableForEM(j,result,protocol,reassignedManager,selectUserId)
        }
    }

    //Call in js/main.js
    dataTableSet("");

    //Call in js/main.js
    tableClickEvents(result);
}