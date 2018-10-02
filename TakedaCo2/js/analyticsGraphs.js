function analyticsGraphs(){
    var hamburgerActive = 0;    
    if(window.localStorage.getItem('token_id') != null){
        hamburgerList(hamburgerActive, window.localStorage.getItem('userType'));

        setDefaultDate();
        var fromDate =  $("#datepicker").val();
        var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( fromDate ));
        
        var toDate = $("#toDatepicker").val(); 
        var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ));    
        
        //Date Change click event
        var user_id = window.localStorage.getItem("user_id");
        setDateOnSelect(user_id,"graphs");

        analaticTypes();
    }else{
        location.href = "../index.html"; 
    }
}
function analaticTypes(){
    loaderLogin();
    $.ajax({
		url: serviceHTTPPath + "validateToken",
		type: "POST",
		dataType: 'json',
		headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
		success: function (result) {
            loaderRemoveFun();       
            if(result.json_data.response == 4 || result.json_data.response == 5 || result.json_data.response == 6){
                location.href = "../index.html";
            }else{    
                for(var i=0;i<result.json_data.response.length;i++){
                    if(result.json_data.response[i].user_management != null){
                        var analatics = result.json_data.response[i].analatics;
                        window.localStorage.setItem("analatics", analatics);
                        piechartAttach(analatics);
                    }
                }    
            }     
        },
		error: function (e) {
			loaderRemoveFun();
			return;
		}
    });
}
//Person Region Protocol nav bar attached
function piechartAttach(analatics){
    var headerSectionArr = new Array("Person", "Region", "Protocol");
    $('.appendChart .chartContainer').remove();
    var html='<div class="chartContainer">';
        html+='<div class="piechartMainDiv">';

            html+='<div class="chartHeader pieHeader">';
                html+='<span>Trends</span>';
                html+='<a class="chartPosition" type="button" data-toggle="collapse" data-target="#collapseChart" aria-expanded="false" aria-controls="collapseChart">';
                  html+='<em class="fa fa-caret-up"></em>';
                html+='</a>';
            html+='</div>';

            html+='<div class="chartRowPosition accordion-body collapse in" id="collapseChart">'; 

            //Person Region and Protocol nav bar attached
            html+='<div class="PRPDiv">';
                html+='<ul class="nav nav-tabs" id="tabBarAnalatics">'
                    for(var p=0;p<headerSectionArr.length;p++)
                    {
                        var setVal = p+1;
                        if(p == 0){
                            html += '<li class="active" id="'+setVal+'" >';    
                             html += '<a  class="'+headerSectionArr[p]+'" href="#" data-toggle="tab">'+headerSectionArr[p]+'</a>';
                            html += '</li>';
                        }else{
                            html += '<li class="" id="'+setVal+'" >';    
                             html += '<a class="'+headerSectionArr[p]+'" href="#" data-toggle="tab">'+headerSectionArr[p]+'</a>';
                            html += '</li>';
                        }                       
                    }   
                html+='</ul>'       
            html+='</div>';
            
            //DropDown Attachements
            html+='<div class="roleDropDown" id="pieChartDropDownWidth">';
            html+='</div>';

            //Pie graph attached
            html+='<div class="piechartContainer">';
            html+='</div>';

            html+='</div>';
        html+='</div>';

        html+='<div class="barchartMainDiv">';
            html+='<div class="chartHeader barHeader">';
                html+='<span>Average Request Cycle Time</span>';
                html+='<a class="chartPosition" type="button" data-toggle="collapse" data-target="#collapseChartBar" aria-expanded="true" aria-controls="collapseChartBar">';
                  html+='<em class="fa fa-caret-down"></em>';
                html+='</a>';
            html+='</div>';

            html+='<div class="collapse chartRowPosition" id="collapseChartBar">';   
            
            //DropDown Attachements
            html+='<div class="barDropDown">';
            html+='</div>';

            //Bar graph attached
            html+='<div class="barchartContainer">';
            html+='</div>';
            
            html+='</div>';
        html+='</div>';

        html+='</div>';
    $('.appendChart').append(html);

    piechartContainer();
    barchartContainerFun();
    takedaManagers(1,analatics);
    analyticsRole(1,analatics);  
    barchartRole(1,analatics);

    $('.paiChartTitle span').text("All");
    $('.paiChartFont font').text('Total Escalations');
    
    $('#tabBarAnalatics li').click(function (e) {
		var index = $('#tabBarAnalatics li').index(this);
        var userType = $(this).attr('id');
        $('#pieChartUser').val("All");

        //Person click event
        if(userType == 1){            
            $('.paiChartTitle span').text("All");
            $('.paiChartFont font').text('Total Escalations');
            $('.roleDropDown .userTypeDropDown').remove();
            takedaManagers(1,analatics);
            analyticsRole(1,analatics);              
        }else if(userType == 2){
            $('.paiChartTitle span').text("Type of Issues");
            $('.paiChartFont font').text('');
            $('.roleDropDown .managersDropDown').remove();
            regionClick(userType,analatics);
        }else if(userType == 3){
            $('.paiChartTitle span').text("Type of Issues");
            $('.paiChartFont font').text('');
            $('.roleDropDown .managersDropDown').remove();
            protocolClick(userType,analatics);
        }
        barchartRole(userType,analatics);
        $('.bottomTitle').text("Escalation Managers")
    });

    $('.piechartMainDiv #collapseChart').on('shown.bs.collapse', function(){
        $('.piechartMainDiv #collapseChart').parent().find(".fa-caret-down").removeClass("fa-caret-down").addClass("fa-caret-up");
    }).on('hidden.bs.collapse', function(){
           
        $('.piechartMainDiv #collapseChart').parent().find(".fa-caret-up").removeClass("fa-caret-up").addClass("fa-caret-down");           
    });

    $('.barchartMainDiv #collapseChartBar').on('shown.bs.collapse', function(){
        $('.barchartMainDiv #collapseChartBar').parent().find(".fa-caret-down").removeClass("fa-caret-down").addClass("fa-caret-up");
    }).on('hidden.bs.collapse', function(){        
      
        $('.barchartMainDiv #collapseChartBar').parent().find(".fa-caret-up").removeClass("fa-caret-up").addClass("fa-caret-down");
    });
}
//Takeda Managers type Drop Down
function takedaManagers(userType,analatics){
    var roleArr = new Array("Takeda Managers","CRO");
    var roleArrVal = new Array(1,3)
    $('.roleDropDown .managersDropDown').remove();
    var html='<div class="managersDropDown">';   
        html+='<label class="control-label">Select Role</label>';
            html+='<div class="select_DropDown">';
            html+='<div class="">';
                html+='<select name="managersRole" class="selectpicker" id="managersRole">';
                    for(var i=0;i<roleArr.length;i++){
                        var setVal = i+1;
                        html+='<option value="'+roleArrVal[i]+'" >'+roleArr[i]+'</option>';
                    }
                html+='</select>';
            html+='</div>';
            html+='</div>';       
        html+='</div>';
    $('.roleDropDown').append(html);

    $('.managersDropDown select[name=managersRole]').val(1);
    $('.managersDropDown .selectpicker').selectpicker('refresh');
    $('.btn-group bootstrap-select').css("width", 100 + "%");

    $('.managersDropDown ul').css("height", "auto");

    /*****Manager type click event start here*****/
    $('.managersDropDown #managersRole').change(function(){
        var index = $(this).val();
        personClick(3,analatics,"pieChart");
        $('.paiChartTitle span').text("All");
        if(index == 1){
            $('.roleDropDown .userTypeDropDown').remove();
            //Select manager dropDown Attach
            analyticsRole(index,analatics)
        }else{
            //Select manager dropDown remove
            $('.roleDropDown .managerTypeDropDown').remove();
            //Call Add user type drop down          
            analyticsUsers(1,analatics);
        }
    });
   
}
//Pie chart div append
function piechartContainer(){
    $('.piechartContainer .pieChartposition').remove();
    var html = '<div class="row pieChartposition" id="" style="margin:0;">';
            html += '<div class="paiChartTitle">';
             html += '<span>Type of Issues</span></br>';
            html += '</div>';
            html += '<div class="paiChartFont">';
              html += '<font></font>';
            html += '</div>';
            html += '<div class="col-sm-12" id="appendPieChart"> ';
                html += '<div id="pieChart"></div>';
            html += '</div>';
        html += '</div>';
    $('.piechartContainer').append(html);
}
//Bar chart div append
function barchartContainerFun(){    
    var arr = new Array("Escalation Managers", "Legal Managers");
    $('.barchartContainer .barChartPosition').remove();
    var html = '<div class="barChartPosition" id="">';
            html += '<div class="row" id="firatBartAdd" style="margin:0;">';
                html += '<div class="col-sm-12" id="">';
                    html += '<div id="barChart" class="barchart"></div>';
                    html += '<div class="leftTitle"></div>';            
                    html += '<div class="bottomTitle"><span>' + arr[0] + '</span></div>';
                html += '</div>';
            html += '</div>';
        html += '</div>';
    $('.barchartContainer').append(html);
}
//Bar chart select role drop down
function barchartRole(userType,analatics){
    //Select Role type drop down
    var roleArr = new Array("Escalation Managers","Legal Managers")
    $('.barDropDown .barTypeDropDown').remove();
    var html='<div class="barTypeDropDown">'   
        html+='<label class="control-label">Select Role</label>'
        html+='<div class="select_DropDown">'
        html+='<div class="">'
            html+='<select name="barTypeRole" class="selectpicker" id="barTypeRole">'  
                for(var i=0;i<roleArr.length;i++){
                    var setVal = i+1;
                    html+='<option value="'+setVal+'" >'+roleArr[i]+'</option>'
                }
            html+='</select>'
            html+='</div>'
        html+='</div>'   
        
    html+='</div>'
    $('.barDropDown').append(html);

   
    if(userType == 3){
        $('.barTypeDropDown select[name=barTypeRole]').val(2);
    }else{
        $('.barTypeDropDown select[name=barTypeRole]').val(1);
    }
    
    $('.barTypeDropDown .selectpicker').selectpicker('refresh');
    $('.btn-group bootstrap-select').css("width", 100 + "%");

    var arr = new Array("Escalation Managers", "Legal Managers");    
    $('.barTypeDropDown ul').css("height", "auto");

        /*****Manager type click event start here*****/
        $('.barTypeDropDown .select_DropDown li').click(function (e) {
            var index = $(this).index();

            $('.bottomTitle').text(arr[index])
            var userType=index+1;  
            var userId = $('#pieChartUser').val();
            if($('#tabBarAnalatics li.active a').attr('class') == "Region" || $('#tabBarAnalatics li.active a').attr('class') == "Protocol"){
                if($('#pieChartUser').val() == "All"){                   
                    numberOfIssues(analatics,userType,"barChart");
                }else{
                    // Region for individual                    
                    regionDashboard(userId,analatics,"barChart");
                }
            }else{
                 //It's only for CRO
                if($('#managersRole').val() == 3 && $('#pieChartUser').val() != "All"){
                    userType = $('#managersRole').val();               
                    croDashboard(userId,userType,analatics)
                }else{
                    numberOfIssues(analatics,userType,"barChart")
                }
               
            }
          
            //Call Add user type drop down          
            //analyticsUsers(userType,analatics);
            //personClick(userType,analatics);
        });

    //Call bar chart select user drop down

    barTypeUsers(userType,analatics);
   // personClick(userType,analatics);
}
function barTypeUsers(userType,analatics){
    $('.barDropDown .barUserDropDown').remove();
    var html='<div class="barUserDropDown">'   
        html+='<label class="control-label">Select User</label>'
        html+='<div class="select_DropDown">'
        html+='<div class="">'
            html+='<select name="userType" class="selectpicker" id="barChartAllIndividual">' 
            html+='<option value="All">All</option>'     
            html+='<option value="1">Individual</option>'                                                                        
            html+='</select>'
        html+='</div>'
    html+='</div>'   
      
   html+='</div>'
   $('.barDropDown').append(html);
   
   if($('#pieChartUser').val() !== "All" && $('#pieChartUser').val() !== undefined){
    $('.barUserDropDown select[name=userType]').val(1);
   }
   $('.barUserDropDown .selectpicker').selectpicker('refresh');
   $('.btn-group bootstrap-select').css("width", 100 + "%");

    /*****Manager type click event start here*****/
    $('.barUserDropDown #barChartAllIndividual').change(function(){
        var userId = $('#pieChartUser').val();
        var userType = $('#barTypeRole').val();
        
        //barChartAllIndividual Bar chart drop down
        if($('#barChartAllIndividual').val() == "All"){           
            //pieChartUser Pie chart drop down             
            if($('#pieChartUser').val() == "All"){
                numberOfIssues(analatics,userType,"barChart");
            }else{               
                if($('#tabBarAnalatics li.active a').attr('class') == "Region" || $('#tabBarAnalatics li.active a').attr('class') == "Protocol"){
                     // Region for All                    
                     regionDashboard(userId,analatics,"barChart");
                }else{
                     //It's only for CRO
                    if($('#managersRole').val() == 3 && $('#pieChartUser').val() != "All"){
                        userType = $('#managersRole').val();
                        croDashboard(userId,userType,analatics)
                    }else{
                        if($('#managerDiv').val() == 3){   
                            // Takeda Managers for All
                            numberOfIssues(analatics,userType,"barChart");
                        }else{
                            // Call for particular user graph
                            issueTrendPersonWebService(userId,analatics,userType,"barChart");
                        }                     
                    }                   
                }                
            }
        }else{           
            if($('#managersRole').val() == 3 && $('#pieChartUser').val() != "All"){               
                userType = $('#managersRole').val();               
                croDashboard(userId,userType,analatics)
            }else{
                if(userType == 1 || userType ==2){            
                    if($('#tabBarAnalatics li.active a').attr('class') == "Region" || $('#tabBarAnalatics li.active a').attr('class') == "Protocol"){                   
                        if($('#pieChartUser').val() == "All"){
                            numberOfIssues(analatics,userType,"barChart");
                        }else{
                         // Region for individual                    
                         regionDashboard(userId,analatics,"barChart");
                        }
                    }else{                       
                        // pieChartUser Pie chart drop down
                        if($('#pieChartUser').val() == "All"){
                            // Escalation and Legal individual drop down select
                            numberOfIssues(analatics,userType,"barChart");
                        }else{
                            if($('#managerDiv').val() == 3){                             
                                // Takeda Managers for individual
                                numberOfIssues(analatics,userType,"barChart");
                            }else{
                                issueTrendPersonWebService(userId,analatics,userType,"barChart");
                            }
                            
                        }
                    }
                    
                }else{
                    // Call for particular user graph                   
                    issueTrendPersonWebService(userId,analatics,userType,"barChart");
                }
            }
            
            
        }        
    });
}
//Pie Chart Role Type
function analyticsRole(userType,analatics){
    //Select Role type drop down
    //var roleArr = new Array("Escalation Managers","Legal Managers","CRO")
    var roleArr = new Array("All","Escalation Manager","Legal Manager")
    var roleArrVal = new Array(3,1,2)
    $('.roleDropDown .managerTypeDropDown').remove();
    var html='<div class="managerTypeDropDown">'   
        html+='<label class="control-label">Select Manager</label>'
        html+='<div class="select_DropDown">'
        html+='<div class="">'
            html+='<select name="managerType" class="selectpicker" id="managerDiv">'  
                for(var i=0;i<roleArr.length;i++){
                    var setVal = i+1;
                    html+='<option value="'+roleArrVal[i]+'" >'+roleArr[i]+'</option>'
                }
            html+='</select>'
            html+='</div>'
        html+='</div>'   
          
       html+='</div>'
       $('.roleDropDown').append(html);
    
       $('.managerTypeDropDown select[name=managerType]').val(0);
       $('.managerTypeDropDown .selectpicker').selectpicker('refresh');
       $('.btn-group bootstrap-select').css("width", 100 + "%");
    
       $('.managerTypeDropDown ul').css("height", "auto");

        /*****Manager type click event start here*****/
        $('.managerTypeDropDown #managerDiv').change(function(){
            var index = $(this).val();
            $('.paiChartTitle span').text("All");
            personClick(index,analatics,"pieChart");
            if(index == 3){
                $('.roleDropDown .userTypeDropDown').remove();
            }else{
                var userType = parseInt(index)+1;
                                
                //Call Add user type drop down          
                analyticsUsers(userType,analatics);

                //Bottom DropDown set Legal and Escalation type
                barchartRole(userType,analatics); 
            }
            // personClick(index,analatics,"pieChart");
            
            // var userType = parseInt(index)+1;
           
            // if(userType == 4){
            //     userType=1;
            // }
            // //Call Add user type drop down          
            // analyticsUsers(userType,analatics);    

            // //Bottom DropDown set Legal and Escalation type
            // barchartRole(userType,analatics);            
        });

    personClick(3,analatics,"pieChart");
    //Call Add user type drop down
    //userType=parseInt(userType)+1;  
    //analyticsUsers(userType,analatics);
   
}
//Pie Chart User Type
function analyticsUsers(userType,analatics){
    loaderLogin();
    $.ajax({
		url: serviceHTTPPath + "userManagement",
		type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        }, 
        data: { role_id: userType },
		success: function (result) {
			loaderRemoveFun();
            //alert(userType+"=success=-"+JSON.stringify(result))
            userManagementDeleted(userType,result,analatics);
		},
		error: function (e) {
			loaderRemoveFun();

			return;
		}
	});  
}
//UserManagementDeleted Users
function userManagementDeleted(userType,result,analatics){    
    loaderLogin();
    $.ajax({
		url: serviceHTTPPath + "userManagementDeleted",
		type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        }, 
        data: { role_id: userType },
		success: function (userManagementDeleted) {
            loaderRemoveFun();           
            attachAnalyticsRole(userType,result,userManagementDeleted,analatics)
            //alert(userType+"=success=-"+JSON.stringify(result))
		},
		error: function (e) {
			loaderRemoveFun();

			return;
		}
	});  
}
function attachAnalyticsRole(userType,result,userManagementDeleted,analatics){
    $('.roleDropDown .userTypeDropDown').remove();
    var html='<div class="userTypeDropDown">'   
        html+='<label class="control-label">Select User</label>'
        html+='<div class="select_DropDown">'
        html+='<div class="">'
            html+='<select name="userType" class="selectpicker" id="pieChartUser">' 
            html+='<option value="All" >All</option>'        
            for(var i=0;i<result.json_data.response.length;i++){        
                if (result.json_data.response[i].first_name !== 0 && result.json_data.response[i].first_name !== null && result.json_data.response[i].first_name !== '0') {
                    if (result.json_data.response[i].last_name !== 0 && result.json_data.response[i].last_name !== null && result.json_data.response[i].last_name !== '0') {
                        name = result.json_data.response[i].first_name +" "+result.json_data.response[i].last_name;                
                        html+='<option value="'+result.json_data.response[i].user_id+'" >'+name+'</option>'
                    }
                    else{                            
                        html+='<option value="'+result.json_data.response[i].user_id+'" >'+result.json_data.response[i].first_name+'</option>'
                    }
                }
                else{
                    if (result.json_data.response[i].last_name !== 0 && result.json_data.response[i].last_name !== null) {                           
                     html+='<option value="'+result.json_data.response[i].user_id+'" >'+result.json_data.response[i].last_name+'</option>'
                    }
                }  
                
                if(i == result.json_data.response.length-1){                              
                    if(userType == 2 || userType == 3){                                     
                        for(var r=0;r<userManagementDeleted.json_data.response.length;r++){        
                            if (userManagementDeleted.json_data.response[r].first_name !== 0 && userManagementDeleted.json_data.response[r].first_name !== null && userManagementDeleted.json_data.response[r].first_name !== '0') {
                                if (userManagementDeleted.json_data.response[r].last_name !== 0 && userManagementDeleted.json_data.response[r].last_name !== null && userManagementDeleted.json_data.response[r].last_name !== '0') {
                                    name = userManagementDeleted.json_data.response[r].first_name +" "+userManagementDeleted.json_data.response[r].last_name;                
                                    html+='<option class="deletedUser" value="'+userManagementDeleted.json_data.response[r].user_id+'" >'+name+'</option>'
                                }
                                else{                            
                                    html+='<option class="deletedUser" value="'+userManagementDeleted.json_data.response[r].user_id+'" >'+result.json_data.response[r].first_name+'</option>'
                                }
                            }
                            else{
                                if (userManagementDeleted.json_data.response[r].last_name !== 0 && userManagementDeleted.json_data.response[r].last_name !== null) {                           
                                    html+='<option class="deletedUser" value="'+userManagementDeleted.json_data.response[r].user_id+'" >'+userManagementDeleted.json_data.response[r].last_name+'</option>'
                                }
                            }       
                        }
                    }
                }     
            }                                                                               
            html+='</select>'
        html+='</div>'
    html+='</div>'   
      
   html+='</div>'
   $('.roleDropDown').append(html);

   $('.userTypeDropDown .selectpicker').selectpicker('refresh');
   $('.btn-group bootstrap-select').css("width", 100 + "%");

    if (result.json_data.response.length >= 8) {
        $('.userTypeDropDown ul').css("height", 175);
        $('.userTypeDropDown ul').css("overflow", "auto");
    }
    else {
        $('.userTypeDropDown ul').css("height", "auto");
    }
    
    /*****Manager type click event start here*****/
    $('.userTypeDropDown #pieChartUser').change(function(){
        var userId = $(this).val();
        var userType = $('#managerDiv').val();

        if(userType == undefined){
            userType = $('#managersRole').val();
        }       

        $('.paiChartTitle span').text($('.userTypeDropDown button span').text());
        $('.paiChartFont font').text("Total Escalations")
       
        //Call for particular user graph        
        if($('#pieChartUser').val() == "All"){
            numberOfIssues(analatics,userType,"pieChart");
        }else{
            if($('#managersRole').val() == 3 ){
                croDashboard(userId,userType,analatics);
            } 
            
            issueTrendPersonWebService(userId,analatics,userType,"pieChart");           
        }      
       
        barTypeUsers(userType,analatics);     
    });
}
// Particulat CRO Users
function croDashboard(userId,userType,analatics){
    var fromDate =  $("#datepicker").val();
    var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( fromDate ) );
    
    var toDate = $("#toDatepicker").val(); 
    var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ) ); 

    loaderLogin();
    $.ajax({
		url: serviceHTTPPath + "croDashboard",
		type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
		data: { croId: userId, startDate: fromDateNewFormat, endDate: todateNewFormat, analyticsType : analatics },
		success: function (result) {
            loaderRemoveFun();
            var userType =3;
            regionProtocolServiceData(result,fromDateNewFormat,todateNewFormat,userType,userId,analatics,"pieChart");
		},
		error: function (e) {
			loaderRemoveFun();
			return;
		}
	});
}
// Call for select particular user
function issueTrendPersonWebService(userId,analatics,userType,chartType){   
    var fromDate =  $("#datepicker").val();
    var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date(fromDate));
    
    var toDate = $("#toDatepicker").val(); 
    var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date(toDate )); 

    loaderLogin();
    $.ajax({
		url: serviceHTTPPath + "issueTrendPerson",
		type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
		data: { escLegal: userType, startDate: fromDateNewFormat, endDate: todateNewFormat, escalationLegalID: userId, analyticsType: analatics },
		success: function (result) {
            loaderRemoveFun();
            //alert("success=-"+JSON.stringify(result))                     
            displayChartVal(result, userType, fromDateNewFormat, todateNewFormat,analatics,chartType);
        },
		error: function () {
			loaderRemoveFun();
			return;
		}
	});
}
/*****Person click event function start here*****/
function personClick(userType,analatics,chartType) {   
    numberOfIssues(analatics,userType,chartType);
}
//Region Click Event
function regionClick(userType,analatics){
    loaderLogin();
    $.ajax({
        url: serviceHTTPPath + "listCountry",
        type: "GET",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        }, 
        success: function (result) 
		{
            loaderRemoveFun();
			//alert(JSON.stringify(result))				
			regionProtocolDropDown(result,userType,analatics);
		},
		error: function (e) {
			loaderRemove()              
			return;
		}
    });
}
function protocolClick(userType,analatics){
    loaderLogin();
    $.ajax({
        url: serviceHTTPPath + "listProtocols",
        type: "GET",
        dataType: 'json',
        data: {
            protocol_name: ''                
        },
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        }, 
        success: function (result) 
		{
            loaderRemoveFun();
			//alert(JSON.stringify(result))				
			regionProtocolDropDown(result,userType,analatics,"protocol");
		},
		error: function (e) {
			loaderRemove()              
			return;
		}
    });
}
//Region Drop Down Attached
function regionProtocolDropDown(result,userType,analatics){
  
    $('.managerTypeDropDown').remove();
    $('.roleDropDown .userTypeDropDown').remove();
    var html='<div class="userTypeDropDown">'
    if($('#tabBarAnalatics li.active a').attr('class') == "Region"){
        html+='<label class="control-label">Select Region</label>'
    }else{
        html+='<label class="control-label">Select Protocol</label>'
    }
       
        html+='<div class="select_DropDown">'
        html+='<div class="">'
            html+='<select name="userType" class="selectpicker" id="pieChartUser">' 
            html+='<option value="All" >All</option>'
               
            for(var i=0;i<result.json_data.response.length;i++){     
               
                if($('#tabBarAnalatics li.active a').attr('class') == "Region"){
                // if(result.json_data.response[i].country_name == 'Argentina')
                // {											 
                //  html += '<li><a href="#" style="border-top: 1px solid #000;">'+result.json_data.response[i].country_name+'</a></li>' 
                // }
                // else
                // {
                    html+='<option value="'+result.json_data.response[i].country_id+'">'+result.json_data.response[i].country_name+'</option>';
                //}	
                }else{
                    html+='<option value="'+result.json_data.response[i].protocol_id+'">'+result.json_data.response[i].protocol_number+'</option>'; 
                }		
            }                                                                                  
            html+='</select>'
        html+='</div>'
    html+='</div>'   
      
   html+='</div>'
   $('.roleDropDown').append(html);

   $('.userTypeDropDown .selectpicker').selectpicker('refresh');
   $('.btn-group bootstrap-select').css("width", 100 + "%");

    if (result.json_data.response.length >= 8) {
        $('.userTypeDropDown ul').css("height", 175);
        $('.userTypeDropDown ul').css("overflow", "auto");
    }
    else {
        $('.userTypeDropDown ul').css("height", "auto");
    }
    /*****Manager type click event start here*****/
    $('.userTypeDropDown #pieChartUser').change(function(){
        var userId = $(this).val();       
        var userType = $('#managerDiv').val();
        if($('#pieChartUser').val() == "All"){
            numberOfIssues(analatics,3,"pieChart");
        }else{
           regionDashboard(userId,analatics,"pieChart")
        }
        barTypeUsers(userType,analatics);      
    });
    numberOfIssues(analatics,3,"pieChart");
}
function regionDashboard(userId,analatics,chartType){
   
    var fromDate =  $("#datepicker").val();
    var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( fromDate ));
    
    var toDate = $("#toDatepicker").val(); 
    var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ));
    
    loaderLogin();
    var serviceType='';
    if($('#tabBarAnalatics li.active a').attr('class') == "Region"){
        $.ajax({
            url: serviceHTTPPath + "regionDashboard",       
            type: "POST",
            dataType: 'json',
            headers: {
                "authorization": window.localStorage.getItem("token_id")
            }, 
            data:{regionId:userId,
                startDate:fromDateNewFormat,
                endDate:todateNewFormat,
                analyticsType:analatics
            },
            success: function (result) 
            {
                loaderRemoveFun();
                var userType =3;
                regionProtocolServiceData(result,fromDateNewFormat,todateNewFormat,userType,userId,analatics,chartType);            
            },
            error: function (e) 
            {
                loaderRemove()                                
                return;
            }
        });
    }else{        
        $.ajax({
            url: serviceHTTPPath + "protocolDashboard",       
            type: "POST",
            dataType: 'json',
            headers: {
                "authorization": window.localStorage.getItem("token_id")
            }, 
            data:{protocolId:userId,
                startDate:fromDateNewFormat,
                endDate:todateNewFormat,
                analyticsType:analatics
            },
            success: function (result) 
            {
                loaderRemoveFun();
                var userType =3;
                regionProtocolServiceData(result,fromDateNewFormat,todateNewFormat,userType,userId,analatics,chartType);            
            },
            error: function (e) 
            {
                loaderRemove()                                
                return;
            }
        });
    }
    
}
//regionProtocol common function
function regionProtocolServiceData(result,fromDate,toDate,userType,userId,analatics,chartType){    
			if(result.json_data.response == 0)
			{   
                var pieChartArr = new Array();
                var pieColorArr = new Array();
				if(chartType != "barChart"){
                    var budgetArr = new Array('', parseInt(1));
                    pieChartArr.push(budgetArr);
                    pieColorArr.push("#50B432");
                    var totalPercenatge=0;
                   
                    pieChartDraw(fromDate, toDate, result, userType, pieChartArr,pieColorArr,totalPercenatge,"emptyChart",analatics);
                }
                //If bar chart empty
                var v1 = [0, 0, 0, 0, 0, 0, 0];
                var v2 = [0, 0, 0, 0, 0, 0, 0];
                var v3 = [0, 0, 0, 0, 0, 0, 0];
                var v4 = [0, 0, 0, 0, 0, 0, 0];
    
                var ticks = ['', '', '', '', '', '', ''];
                attachBarChart(v1, v2, v3, v4, ticks, result, userType, fromDate, toDate,analatics);                		
			}
			else
			{
				regionProtocol(result, userType, fromDate, toDate,analatics,chartType);	
			}			
}
function regionProtocol(result, userType, fromDate, toDate,analatics,chartType){

    var obj = new Object();
    var budget=0;
    var cda=0;
    var cta=0;
    var Others=0;
    var icf = 0;
    var totalPercenatge=0;
    var pieChartArr = new Array();
    var pieColorArr = new Array();
   
    var objPieChart = new Object(result.json_data.response.pieChart);
 
    if (objPieChart.length == undefined || objPieChart.length == 0) {
        if(chartType != "barChart"){
            var budgetArr = new Array('', parseInt(1));
            pieChartArr.push(budgetArr);
            pieColorArr.push("#50B432");
            pieChartDraw(fromDate, toDate, result, userType, pieChartArr,pieColorArr,totalPercenatge,"emptyChart",analatics);
        }
    }else{
        //Region and Protocol Pie chart value
        for (var k = 0; k < objPieChart.length; k++) {
            if (objPieChart[k].pie_chart != undefined) {
                if (objPieChart[k].pie_chart.Budget != undefined) {
					budget = objPieChart[k].pie_chart.Budget.count;
				}
				else {
					budget = 0;
				}

				if (objPieChart[k].pie_chart.CDA != undefined) {
					cda = objPieChart[k].pie_chart.CDA.count;
				}
				else {
					cda = 0;
				}

				if (objPieChart[k].pie_chart.CTA != undefined) {
					cta = objPieChart[k].pie_chart.CTA.count;
				}
				else {
					cta = 0;
                }         
                
				if (objPieChart[k].pie_chart.Others != undefined) {
					others = objPieChart[k].pie_chart.Others.count;
				}
				else {
					others = 0;
                }
               
				if (objPieChart[k].pie_chart.Icf != undefined) {
					icf = objPieChart[k].pie_chart.Icf.count;
				}
				else {
					icf = 0;
                }
               
                if (k == objPieChart.length - 1) {
                    pieChartArr=[];
                    pieColorArr=[];
                   
                    if(budget != 0){
                        var budgetArr = new Array('Budget', parseInt(budget));
                        pieChartArr.push(budgetArr);
                        pieColorArr.push("#eead3c");
                    }
                    if(cda != 0){
                        var cdaArr = new Array('CDA', parseInt(cda));
                        pieChartArr.push(cdaArr);
                        pieColorArr.push("#a686b7");
                    }
                    if(cta != 0){
                        var ctaArr = new Array('CTA', parseInt(cta));
                        pieChartArr.push(ctaArr);
                        pieColorArr.push("#e89902");
                    }
                    if(others != 0){                        
                        var othersArr = new Array('Others', parseInt(others));
                        pieChartArr.push(othersArr);
                        pieColorArr.push("#b8b656");
                    }
                    if(icf != 0){
                        var icfArr = new Array('ICF', parseInt(icf));
                        pieChartArr.push(icfArr);
                        pieColorArr.push("#7ab8c1");
                    }  
                                                  
                    totalPercenatge = parseInt(budget) + parseInt(cda) + parseInt(cta) + parseInt(others) + parseInt(icf);
                   
                    pieChartDraw(fromDate, toDate, result, userType, pieChartArr,pieColorArr,totalPercenatge,"fillChart",analatics);
               }   
           }
        }
    }

    
    //Below code for Region and Protocol barchart 
    dashboardBarChartManage(result, userType, fromDate, toDate,analatics,chartType)
   
}
 //Below function for Region,Protocol and CRO dashboard barchart 
function dashboardBarChartManage(result, userType, fromDate, toDate,analatics,chartType){
    var objBar;
 
	if ($('#barTypeRole').val() == 1) {
		objBar = new Object(result.json_data.response.selectEscalation);		
	}
	else {
		objBar = new Object(result.json_data.response.selectLegal);
    }
    
    var v1 = new Array();
	var v2 = new Array();
	var v3 = new Array();
	var v4 = new Array();

    var ticks = new Array();
    if (objBar.length == undefined || objBar.length == 0) {
         //If bar chart empty
         var v1 = [0, 0, 0, 0, 0, 0, 0];
         var v2 = [0, 0, 0, 0, 0, 0, 0];
         var v3 = [0, 0, 0, 0, 0, 0, 0];
         var v4 = [0, 0, 0, 0, 0, 0, 0];

         var ticks = ['', '', '', '', '', '', ''];
         attachBarChart(v1, v2, v3, v4, ticks, result, userType, fromDate, toDate,analatics);
    }else{
        if($('#barChartAllIndividual').val() == "All"){ 
            if (objBar.length != undefined) {
				var pending = 0;
				var below7 = 0;
				var above7 = 0;
				var above12 = 0;
				for (i = 0; i < objBar.length; i++) {
					if (objBar[i].pending != undefined) {
						pending = parseInt(pending) + parseInt(objBar[i].pending.count);
					}
					else {
						pending = 0;
					}
					if (objBar[i].below7 != undefined) {
						below7 = parseInt(below7) + parseInt(objBar[i].below7.count);
					}
					else {
						below7 = 0;
					}
					if (objBar[i].above7 != undefined) {
						above7 = parseInt(above7) + parseInt(objBar[i].above7.count);
					}
					else {
						above7 = 0;
					}
					if (objBar[i].above12 != undefined) {
						above12 = parseInt(above12) + parseInt(objBar[i].above12.count);
					}
					else {
						above12 = 0;
					}

					if (i == objBar.length - 1) {
						v1.push(pending);
                        v2.push(below7);
                        v3.push(above7);
                        v4.push(above12);
                        ticks.push("All");
                        attachBarChart(v1, v2, v3, v4, ticks, result, userType, fromDate, toDate,analatics);
					}
				}
			}
        }else{
            if (objBar.length >= 7) {
				objBar.length = 7;
			}
			var name;
			for (i = 0; i < objBar.length; i++) {
				v1.push(objBar[i].pending.count);
				v2.push(objBar[i].below7.count);
				v3.push(objBar[i].above7.count);
				v4.push(objBar[i].above12.count);

				if ($('#barTypeRole').val() == 1) {
					if (objBar[i].escalation_first_name !== 0 && objBar[i].escalation_first_name !== null) {
						if (objBar[i].escalation_last_name !== 0 && objBar[i].escalation_last_name !== null) {
                            name = objBar[i].escalation_first_name + " " + objBar[i].escalation_last_name;
                            ticks.push(name);
                        }
                        else {
                            name = objBar[i].escalation_first_name;
                            ticks.push(name);
                        }
					}
					else {
						if (objBar[i].escalation_last_name !== 0 && objBar[i].escalation_last_name !== null) {
							name = objBar[i].escalation_last_name;
							ticks.push(name);
						}
					}
				}
				else {
					if (objBar[i].legal_first_name !== 0 && objBar[i].legal_first_name !== null) {
						if (objBar[i].legal_last_name !== 0 && objBar[i].legal_last_name !== null) {
                            name = objBar[i].legal_first_name + " " + objBar[i].legal_last_name;
                            ticks.push(name);
                        }
                        else {
                            name = objBar[i].legal_first_name;
                            ticks.push(name);
                        }
					}
					else {
						if (objBar[i].legal_last_name !== 0 && objBar[i].legal_last_name !== null) {
                            name = objBar[i].legal_last_name;
                            ticks.push(name);
						}
					}
				}

				if (i == objBar.length - 1) {
                    attachBarChart(v1, v2, v3, v4, ticks, result, userType, fromDate, toDate,analatics);
				}
			}
        }
    }
}
//Call for select role dropdown
function numberOfIssues(analatics,userType,chartType){
    loaderLogin();

    var fromDate =  $("#datepicker").val();
    var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( fromDate ) );
    
    var toDate = $("#toDatepicker").val(); 
    var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ) );
    
    if(userType == 3){
        croBarChart(analatics,userType,chartType)
    }
    $.ajax({
		url: serviceHTTPPath + "numberOfIssues",
		type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
		data: { escLegal: userType, startDate: fromDateNewFormat, endDate: todateNewFormat, analyticsType: analatics },
		success: function (result) {           
            if(userType != 3){
                loaderRemoveFun();
            }
            displayChartVal(result, userType, fromDateNewFormat, todateNewFormat,analatics,chartType);            
		},
		error: function () {
			loaderRemove();
			return;
		}
	});
}
// CRO Dashboard bar chart
function croBarChart(analatics,userType,chartType){
    loaderLogin();

    var fromDate =  $("#datepicker").val();
    var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( fromDate ) );
    
    var toDate = $("#toDatepicker").val(); 
    var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ) );

    userType=1;
    $.ajax({
		url: serviceHTTPPath + "numberOfIssues",
		type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
		data: { escLegal: userType, startDate: fromDateNewFormat, endDate: todateNewFormat, analyticsType: analatics },
		success: function (result) { 
            loaderRemoveFun();           
            manageBarChartVal(result,userType, fromDate, toDate,analatics);
            //alert("success=-"+JSON.stringify(result))
		},
		error: function () {
			loaderRemove();
			return;
		}
	});
}
function displayChartVal(result, userType, fromDate, toDate,analatics,chartType){
   var obj = new Object();
   var budget=0;
   var cda=0;
   var cta=0;
   var Others=0;
   var icf = 0;
   var totalPercenatge=0;
   var pieChartArr = new Array();
   var pieColorArr = new Array();
   
    if (result.json_data.response == 0) {
        //If pie chart empty
        if(chartType != "barChart"){
            var budgetArr = new Array('', parseInt(1));
            pieChartArr.push(budgetArr);
            pieColorArr.push("#50B432");
            pieChartDraw(fromDate, toDate, result, userType, pieChartArr,pieColorArr,totalPercenatge,"emptyChart",analatics);
        }
        if(userType == 1 || userType == 2){
            //If bar chart empty
            var v1 = [0, 0, 0, 0, 0, 0, 0];
            var v2 = [0, 0, 0, 0, 0, 0, 0];
            var v3 = [0, 0, 0, 0, 0, 0, 0];
            var v4 = [0, 0, 0, 0, 0, 0, 0];

            var ticks = ['', '', '', '', '', '', ''];
            attachBarChart(v1, v2, v3, v4, ticks, result, userType, fromDate, toDate,analatics);
        }

    }else{
        // bar chart value get                  
        if(userType == 1 || userType == 2){
            manageBarChartVal(result,userType, fromDate, toDate,analatics);            
        }        
        
        for (var i = 0; i < result.json_data.response.length; i++) {           
            if(chartType != "barChart"){
                //Pie chart value get                
                if (result.json_data.response[i].pie_chart != undefined) {
                    if (result.json_data.response[i].pie_chart.Budget != undefined) {
                        budget+= parseInt(result.json_data.response[i].pie_chart.Budget.count)                  
                    }
                    if (result.json_data.response[i].pie_chart.CDA != undefined) {
                        cda+= parseInt(result.json_data.response[i].pie_chart.CDA.count)
                    }
                    if (result.json_data.response[i].pie_chart.CTA != undefined) {
                        cta+= parseInt(result.json_data.response[i].pie_chart.CTA.count)
                    }
                    if (result.json_data.response[i].pie_chart.Others != undefined) {                   
                        Others+= parseInt(result.json_data.response[i].pie_chart.Others.count)
                    }
                    if (result.json_data.response[i].pie_chart.Icf != undefined) {                   
                        icf+= parseInt(result.json_data.response[i].pie_chart.Icf.count)
                    }
                    
                    if (i == result.json_data.response.length - 1) {
                        pieChartArr=[];
                        pieColorArr=[];
                        if(budget != 0){
                            var budgetArr = new Array('Budget', parseInt(budget));
                            pieChartArr.push(budgetArr);
                            pieColorArr.push("#eead3c");
                        }
                        if(cda != 0){
                            var cdaArr = new Array('CDA', parseInt(cda));
                            pieChartArr.push(cdaArr);
                            pieColorArr.push("#a686b7");
                        }
                        if(cta != 0){
                            var ctaArr = new Array('CTA', parseInt(cta));
                            pieChartArr.push(ctaArr);
                            pieColorArr.push("#e89902");
                        }
                        if(Others != 0){
                            var othersArr = new Array('Others', parseInt(Others));
                            pieChartArr.push(othersArr);
                            pieColorArr.push("#b8b656");
                        }
                        if(icf != 0){
                            var icfArr = new Array('ICF', parseInt(icf));
                            pieChartArr.push(icfArr);
                            pieColorArr.push("#7ab8c1");
                        }                 
                        totalPercenatge = parseInt(budget) + parseInt(cda) + parseInt(cta) + parseInt(Others) + parseInt(icf);                        
                        pieChartDraw(fromDate, toDate, result, userType, pieChartArr,pieColorArr,totalPercenatge,"fillChart",analatics);
                    }
                }
                else{
                    var budgetArr = new Array('', parseInt(1));
                    pieChartArr.push(budgetArr);
                    pieColorArr.push("#eead3c");

                    pieChartDraw(fromDate, toDate, result, userType, pieChartArr,pieColorArr,totalPercenatge,"emptyChart",analatics);
                }
            }
        }
    }
    
}
//PieChartDraw function
function pieChartDraw(fromDate, toDate, result, userType, pieChartArr,pieColorArr,totalPercenatge,chartVal,analatics){

    var requestNumberIds=0;
    var requestNumberIdsArr =[];

    var xSet = 0;
    var getTotalVal = 0;  
	if (chartVal != "emptyChart") {
        xSet = 2;
        getTotalVal = "Overall " + totalPercenatge;
    }

    // Tooltip hide or show
    var setTooltipTotal = true;
	if (totalPercenatge == 0) {
		setTooltipTotal = false;
    }
    
    var selectDropVal = 'Escalations';
    
    Highcharts.setOptions({
		colors: pieColorArr,
		lang: {
			decimalPoint: '.',
			thousandsSep: ','
		}
    });

    $('#pieChart').highcharts({
		chart: {
			type: 'pie',
			options3d: {
				enabled: true,
				alpha: 45
			}
        },
        title: {
            text: getTotalVal,
            align: 'center',
            verticalAlign: 'middle',
            y: 40,           
            style: {
                color: '#337398',
                font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
             }
        },
		credits: {
			enabled: false
		},
		exporting: { enabled: false },
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				size: 280,				
				depth: 35,

				point: {
					events:
						{
							click: function (event) {     
                                var options = this.options;                         
								if(result.json_data.response.pie_chart != 0)
	                            {
									    var chartName = "pieChart";	
                                        var pointIndex = event.point.x;                                        
                                        var seriesIndex = this.series.index;
                                        requestNumberIdsArr=[];
                                       
                                        var labelName = options.name;                                       
                                        if(labelName =="Budget" || labelName =="CTA" || labelName == "ICF"){                                            
                                            piechartPopup(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics);
                                        }else{                                            
                                            var objPieChart;
                                            if($('#tabBarAnalatics li.active a').attr('class') == "Region" || $('#tabBarAnalatics li.active a').attr('class') == "Protocol" || $('#managersRole').val() == 3){
                                                if($('#pieChartUser').val() == "All"){
                                                    objPieChart = new Object(result.json_data.response);
                                                }else{
                                                    objPieChart = new Object(result.json_data.response.pieChart);
                                                }
                                                
                                            }else{//Others for graphs
                                                objPieChart = new Object(result.json_data.response);
                                            }
                                                for (var i = 0; i < objPieChart.length; i++) {
                                                    if (objPieChart[i].pie_chart[labelName] != undefined) {                                              
                                                       
                                                        for (var k = 0; k < objPieChart[i].pie_chart[labelName].request_number_ids.length; k++) {
                                                            if(objPieChart[i].pie_chart[labelName].request_number_ids[k] !=='' && objPieChart[i].pie_chart[labelName].request_number_ids[k] !== undefined && objPieChart[i].pie_chart[labelName].request_number_ids[k] !== null){
                                                                requestNumberIdsArr.push(objPieChart[i].pie_chart[labelName].request_number_ids[k]);   
                                                            }               
                                                        }
                                                    }
    
                                                    if(i == objPieChart.length-1){                                                        
                                                        requestNumberIds = my_implode_js(',',requestNumberIdsArr); 
                                                        callToRequestNuPopup(fromDate,toDate,result,pointIndex,seriesIndex,chartName,labelName,userType,requestNumberIds);                                    
                                                    }
                                                }                                                                                      
                                           
                                        }                                       
                                        
								}
							}
						}
				},
				innerSize: '70%',
				dataLabels:
					{
						distance: 20,
						enabled: setTooltipTotal,

						formatter: function () {
							if (chartVal != "emptyChart") {
								return '<b>' + this.point.name + '</b><br/> ' + this.percentage.toFixed(2) + ' %';
							}
							else {
								return '<b></b>';
							}
						}
					}
			}
		},
		tooltip: {
			enabled: setTooltipTotal,
			useHTML: true,
			followPointer: false,
			formatter: function () {
				return '<b>' + this.point.name + '<br>Total Requests = ' + this.point.y;
			}
		},
		subtitle:
			{
				align: "center",
				floating: false,
                style: { "color": "#337398", 
                font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
                },
				text: 'Total<br>' + selectDropVal,
				useHTML: false,
				verticalAlign: "middle",
				x: xSet,
				y: null
			},
		series: [{
			type: 'pie',
			name: 'Browser share',
			data: pieChartArr
		}]
    });  

    
    $('#pieChart .highcharts-subtitle').css("text-decoration", "underline");
	$('#pieChart .highcharts-subtitle').css("cursor", "pointer");
    
    function testClick() {
    }
    
    $('#pieChart .highcharts-subtitle').click(function () {
        var chartName = "pieChart";
        var pointIndex = 0;
        var seriesIndex = 0;
        var labelName = "Total";
        var chartName = "pieChart";	  
       
        var objPieChart;
        if($('#tabBarAnalatics li.active a').attr('class') == "Region" || $('#tabBarAnalatics li.active a').attr('class') == "Protocol" || $('#managersRole').val() == 3){
            if($('#pieChartUser').val() == "All"){
                objPieChart = new Object(result.json_data.response);
            }else{
                objPieChart = new Object(result.json_data.response.pieChart);
            }
            
        }else{//Others for graphs
            objPieChart = new Object(result.json_data.response);
        }  

        for (j = 0; j < objPieChart.length; j++) {
            if (objPieChart[j].pie_chart.Budget != undefined) {
                if (objPieChart[j].pie_chart.Budget.request_number_ids != undefined) {
                    for (p = 0; p < objPieChart[j].pie_chart.Budget.request_number_ids.length; p++) {
                        requestNumberIdsArr.push(objPieChart[j].pie_chart.Budget.request_number_ids[p]); 
                    }
                }
            }
            if (objPieChart[j].pie_chart.CDA != undefined) {
                if (objPieChart[j].pie_chart.CDA.request_number_ids != undefined) {

                    for (p = 0; p < objPieChart[j].pie_chart.CDA.request_number_ids.length; p++) {
                        requestNumberIdsArr.push(objPieChart[j].pie_chart.CDA.request_number_ids[p]); 
                    }
                }
            }
            if (objPieChart[j].pie_chart.CTA != undefined) {
                if (objPieChart[j].pie_chart.CTA.request_number_ids != undefined) {
                    for (p = 0; p < objPieChart[j].pie_chart.CTA.request_number_ids.length; p++) {
                        requestNumberIdsArr.push(objPieChart[j].pie_chart.CTA.request_number_ids[p]); 
                    }
                }
            }
            if (objPieChart[j].pie_chart.Others != undefined) {
                if (objPieChart[j].pie_chart.Others.request_number_ids != undefined) {
                    for (p = 0; p < objPieChart[j].pie_chart.Others.request_number_ids.length; p++) {
                        requestNumberIdsArr.push(objPieChart[j].pie_chart.Others.request_number_ids[p]); 
                    }
                }
            }
            if (objPieChart[j].pie_chart.Icf != undefined) {
                if (objPieChart[j].pie_chart.Icf.request_number_ids != undefined) {
                    for (p = 0; p < objPieChart[j].pie_chart.Icf.request_number_ids.length; p++) {
                        requestNumberIdsArr.push(objPieChart[j].pie_chart.Icf.request_number_ids[p]); 
                    }
                }
            }

            if (j == objPieChart.length - 1) {
                requestNumberIds = my_implode_js(',',requestNumberIdsArr);                
                callToRequestNuPopup(fromDate,toDate,result,pointIndex,seriesIndex,chartName,labelName,userType,requestNumberIds);
            }
        }
        
    })
}
//Manage Bar chart values from service
function manageBarChartVal(result,userType, fromDate, toDate,analatics){    

    var v1 = new Array();
    var v2 = new Array();
    var v3 = new Array();
    var v4 = new Array();
    var ticks = new Array();
   
    if($('#barChartAllIndividual').val() == "All"){    
        var pending = 0;
        var below7 = 0;
        var above7 = 0;
        var above12 = 0;    
       
        for(var i=0;i<result.json_data.response.length;i++){            
            if (result.json_data.response[i].bar_chart != undefined){ 
                if (result.json_data.response[i].bar_chart.pending != undefined) {
                    pending = parseInt(pending) + parseInt(result.json_data.response[i].bar_chart.pending.count);               
                }
                else {
                    pending = 0;
                }
                if (result.json_data.response[i].bar_chart.below7 != undefined) {
                    below7 = parseInt(below7) + parseInt(result.json_data.response[i].bar_chart.below7.count);
                }
                else {
                    below7 = 0;
                }
                if (result.json_data.response[i].bar_chart.above7 != undefined) {
                    above7 = parseInt(above7) + parseInt(result.json_data.response[i].bar_chart.above7.count);
                }
                else {
                    above7 = 0;
                }
                if (result.json_data.response[i].bar_chart.above12 != undefined) {
                    above12 = parseInt(above12) + parseInt(result.json_data.response[i].bar_chart.above12.count);
                }
                else {
                    above12 = 0;
                }
    
                if (i == result.json_data.response.length - 1) {               
                    v1.push(pending);
                    v2.push(below7);
                    v3.push(above7);
                    v4.push(above12);
                    ticks.push("All");
                attachBarChart(v1, v2, v3, v4, ticks, result, userType, fromDate, toDate,analatics);
                }
            }else{
                v1 = [0, 0];
                v2 = [0, 0];
                v3 = [0, 0];
                v4 = [0, 0];                
                attachBarChart(v1, v2, v3, v4, ticks, result, userType, fromDate, toDate,analatics);
            }
        }           

    }else{
        if (result.json_data.response.length != undefined){           
            for(var i=0;i<result.json_data.response.length;i++){
                if (result.json_data.response[i].bar_chart.pending != undefined){
                    v1.push(result.json_data.response[i].bar_chart.pending.count);
                }
                else {
                    v1.push(0);
                }
                if (result.json_data.response[i].bar_chart.below7 != undefined) {
                    v2.push(result.json_data.response[i].bar_chart.below7.count);
                }
                else {
                    v2.push(0);
                }
                if (result.json_data.response[i].bar_chart.above7 != undefined) {
                    v3.push(result.json_data.response[i].bar_chart.above7.count);
                }
                else {
                    v3.push(0);
                }
                if (result.json_data.response[i].bar_chart.above12 != undefined) {
                    v4.push(result.json_data.response[i].bar_chart.above12.count);
                }
                else {
                    v4.push(0);
                }
                var name;
                //Escalation manager Name
                if (userType == 1) {
                    if (result.json_data.response[i].escalation_first_name !== 0 && result.json_data.response[i].escalation_first_name !== null) {                   
                        if (result.json_data.response[i].escalation_last_name !== 0 && result.json_data.response[i].escalation_last_name !== null) {                       
                            name = result.json_data.response[i].escalation_first_name + " " + result.json_data.response[i].escalation_last_name;
                            ticks.push(name);                      
                        }
                        else {
                            name = result.json_data.response[i].escalation_first_name;
                            ticks.push(name);
                        }                
                    }
                    else {
                        if (result.json_data.response[i].escalation_last_name != 0) {
                            if (result.json_data.response[i].escalation_last_name != null) {
                                name = result.json_data.response[i].escalation_last_name;
                                ticks.push(name);
                            }
                            else {
            
                                ticks.push('');
                            }
                        }
                    }
                }
                else {//Legal manager Name
                    if (result.json_data.response[i].legal_first_name !== 0 && result.json_data.response[i].legal_first_name !== null) {                   
                        if (result.json_data.response[i].legal_last_name !== 0 && result.json_data.response[i].legal_last_name != null) {                        
                            name = result.json_data.response[i].legal_first_name + " " + result.json_data.response[i].legal_last_name;
                            ticks.push(name);                       
                        }
                        else {
                            name = result.json_data.response[i].legal_first_name;
                            ticks.push(name);
                        }                   
                    }
                    else {
                        if (result.json_data.response[i].legal_last_name != 0) {
                            if (result.json_data.response[i].legal_last_name != null) {
                                name = result.json_data.response[i].legal_last_name;
                                ticks.push(name);
                            }
                        }
                    }
                }
            
                if (i == result.json_data.response.length - 1) {                    
                    attachBarChart(v1, v2, v3, v4, ticks, result, userType, fromDate, toDate,analatics);
                }      
            }
        }

        
    }
}
// BarChart Draw function
function attachBarChart(v1, v2, v3, v4, ticks, result, userType, fromDate, toDate,analatics){
    var labelArr = new Array('New issues', 'Less than 7 days', 'From 7 to 12 days', 'Over 12 days');
	var colorArr = new Array('#4692c2','#1ad852','#ebe200','#e54830')
	var seriesName = new Array('New issues', 'Less than 7 days', 'From 7 to 12 days', 'Over 12 days');

	Highcharts.setOptions({
		colors: colorArr,
		lang: {
			decimalPoint: '.',
			thousandsSep: ','
		}
	});

	var alphaFlag;
	var betaFlag;
	var depthFlag;    
	if (v1 == 0 && v2 == 0 && v3 == 0 && v4 == 0) {
		alphaFlag = 0;
		betaFlag = 0;
		depthFlag = 0;
	}
	else {
		alphaFlag = 5;
		betaFlag = 5;
		depthFlag = 0;
	}
    
	$('#barChart').highcharts({
		chart: {
			type: 'column',
			zoomType: 'x',
			pinchType: 'x',
			options3d: {
				enabled: true,
				alpha: alphaFlag,
				beta: betaFlag,
				viewDistance: 0,
				depth: depthFlag
			}
		},
		title: {
			text: '',
			style: {
				display: 'none'
			}
		},
		xAxis: {
			categories: ticks,			
		},
		yAxis: {
            allowDecimals: false,
            min: 0,
			title: {
				text: 'Number of Issues',
				style: {
					color: "#4c9bcf",
					font: 'normal 15px Verdana, sans-serif',
				}
			}
		},
		exporting: { enabled: false },
		tooltip: {
			useHTML: true,
			followPointer: false,
			formatter: function () {
				return '<b>Total Requests = ' + this.point.y;
			}
		},
		legend: {
			verticalAlign: 'top',
			backgroundColor: '#FFFFFF'
		},
		plotOptions:
			{
				column:
					{
						stacking: 'normal',
						depth: 40,
						point: {
							events: {
								click: function (event) {
									var pointIndex = this.x;
									var seriesIndex = this.series.index;
                                   
									var getLabelName = labelArr[seriesIndex];
                                    var chartName = "barChart";
                                   
                                    barRequestNumberPopUp(seriesIndex,pointIndex,result.json_data.response,userType,fromDate,toDate,chartName,getLabelName);									
								}
							}
						}
					},
				series: {
					events: {
						legendItemClick: function (eventResult) {							
						}
					}
				},
				allowPointSelect: false,

			},
		series: [
			{
				name: seriesName[0],
				data: v1,
				stack: 1
			},
			{
				name: seriesName[1],
				data: v2,
				stack: 2
			},
			{
				name: seriesName[2],
				data: v3,
				stack: 3
			},
			{
				name: seriesName[3],
				data: v4,
				stack: 4
			}
		]
	});
	loaderRemoveFun();
}
function barRequestNumberPopUp(seriesIndex,pointIndex,result,userType,fromDate,toDate,chartName,getLabelName){
    var requestNumberIds = '';
    var arrOfSelectedLabel = new Array("pending","below7","above7","above12");
   
    var requestNumberIdsArr =[];   
    if($('#tabBarAnalatics li.active a').attr('class') == "Region" || $('#tabBarAnalatics li.active a').attr('class') == "Protocol" || $('#managersRole').val() == 3){ 
        // Pie chart select All for Region and Protocol
        if($('#pieChartUser').val() == "All"){
            if($('#barChartAllIndividual').val() == "All"){
                for(var i=0;i<result.length;i++)            {           
                    if(result[i].bar_chart[arrOfSelectedLabel[seriesIndex]].request_number_ids !== '' || result[i].bar_chart[arrOfSelectedLabel[seriesIndex]].request_number_ids !== null || result[i].bar_chart[arrOfSelectedLabel[seriesIndex]].request_number_ids !== 'null')
                    {	
                        for (var k = 0; k < result[i].bar_chart[arrOfSelectedLabel[seriesIndex]].request_number_ids.length; k++) {
                            requestNumberIdsArr.push(result[i].bar_chart[arrOfSelectedLabel[seriesIndex]].request_number_ids[k]);                  
                        }  
                    }
                    if(i == result.length-1){
                        requestNumberIds = my_implode_js(',',requestNumberIdsArr);
                        callToRequestNuPopup(fromDate,toDate,result,pointIndex,seriesIndex,chartName,getLabelName,userType,requestNumberIds);  	   
                    }
                }
            }else{
                requestNumberIds = my_implode_js(',',result[pointIndex].bar_chart[arrOfSelectedLabel[seriesIndex]].request_number_ids);  
                callToRequestNuPopup(fromDate,toDate,result,pointIndex,seriesIndex,chartName,getLabelName,userType,requestNumberIds);        
            }
        }else{
            //pieChartUser parent pie chart drop down value Individual like Canada
            var objBar;       
            if($('#barTypeRole').val() == 1){
                objBar = new Object(result.selectEscalation);
            }else{
                objBar = new Object(result.selectLegal);
            } 
            if($('#barChartAllIndividual').val() == "All"){
                for(var i=0;i<objBar.length;i++){         
                    if(objBar[i][arrOfSelectedLabel[seriesIndex]].request_number_ids !== '' || objBar[i][arrOfSelectedLabel[seriesIndex]].request_number_ids !== null || objBar[i][arrOfSelectedLabel[seriesIndex]].request_number_ids !== 'null'){	
                        for (var k = 0; k < objBar[i][arrOfSelectedLabel[seriesIndex]].request_number_ids.length; k++) {
                            requestNumberIdsArr.push(objBar[i][arrOfSelectedLabel[seriesIndex]].request_number_ids[k]);                  
                        } 
                    }
                    if(i == objBar.length-1){
                        requestNumberIds = my_implode_js(',',requestNumberIdsArr);
                        callToRequestNuPopup(fromDate,toDate,result,pointIndex,seriesIndex,chartName,getLabelName,userType,requestNumberIds);  	   
                    }
                }
            }else{
                requestNumberIds = my_implode_js(',',objBar[pointIndex][arrOfSelectedLabel[seriesIndex]].request_number_ids);
                callToRequestNuPopup(fromDate,toDate,result,pointIndex,seriesIndex,chartName,getLabelName,userType,requestNumberIds); 
            }
        }
      
    }else{
        if($('#barChartAllIndividual').val() == "All"){
            for(var i=0;i<result.length;i++)
            {           
                if(result[i].bar_chart[arrOfSelectedLabel[seriesIndex]].request_number_ids !== '' || result[i].bar_chart[arrOfSelectedLabel[seriesIndex]].request_number_ids !== null || result[i].bar_chart[arrOfSelectedLabel[seriesIndex]].request_number_ids !== 'null')
                {	
                    for (var k = 0; k < result[i].bar_chart[arrOfSelectedLabel[seriesIndex]].request_number_ids.length; k++) {
                        requestNumberIdsArr.push(result[i].bar_chart[arrOfSelectedLabel[seriesIndex]].request_number_ids[k]);                  
                    }  
                }
                if(i == result.length-1){
                    requestNumberIds = my_implode_js(',',requestNumberIdsArr);
                    callToRequestNuPopup(fromDate,toDate,result,pointIndex,seriesIndex,chartName,getLabelName,userType,requestNumberIds);  	   
                }
            }
        }else{                 
            requestNumberIds = my_implode_js(',',result[pointIndex].bar_chart[arrOfSelectedLabel[seriesIndex]].request_number_ids);  
            callToRequestNuPopup(fromDate,toDate,result,pointIndex,seriesIndex,chartName,getLabelName,userType,requestNumberIds);       
        }
    }
 
    
}
/*****Request Number Popup function start here*****/
function callToRequestNuPopup(fromDate,toDate,resultTable,pointIndex,seriesIndex,chartName,labelName,userType,requestNumberIds)
{
    if(requestNumberIds != '')
    {
        loaderLogin();        
        $.ajax({
            url: serviceHTTPPath + "viewRequestNumbers",       
            type: "POST",
            dataType: 'json',
            headers: {
                "authorization": window.localStorage.getItem("token_id")
            },
            data:{requestNumbers :requestNumberIds},
            success: function (result) 
            {
                //alert("success="+JSON.stringify(result))				
                loaderRemoveFun();	
                		
                var selectChart = 1;
                var labelNamePopupPai=labelName;
                popUpForTable(fromDate,toDate,resultTable,pointIndex,chartName,labelName,userType,requestNumberIds,result,labelNamePopupPai,selectChart);
            },
            error: function (e) 
            {
                loaderRemoveFun();         				
                return;
            }
        });
    }
    else
    {
        var result = "undefined"
        var selectChart = 1
        var labelNamePopupPai=labelName
        //popUpForTable(fromDate,toDate,resultTable,pointIndex,indexVal,chartName,labelName,setAll,escLegalVal,result,labelNamePopupPai,selectChart,requestNumberIds)		
    }
}
function popUpForTable(fromDate,toDate,resultTable,pointIndex,chartName,labelName,userType,requestNumberIds,result,labelNamePopupPai,selectChart){
    $('body #requestNoModal').remove();       
    var performLegalActionArr = new Array("Pending", "Approved", "Denied", "Approved with modification", "Pending OC", "On hold", "Reassigned", "Closed");
    var colorClassLegalArr = new Array("#e89902","#32b924", "#fe1631", "#916aa3", "#e89902", "#eead3c", "#4692c2", "#000");
   
    var viewManagerArr = new Array("Request Type","Raised By","Raised On","Esc.Manager","Legal Manager","Action date","Resolution Date","Status");
    var titleVal = "Issue Type - "+labelNamePopupPai;
    var setWidth = $(window).width()-100;
  
    var html = '<div class="modal fullscreen-modal fade" id="requestNoModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
            html += '<div class="vertical-alignment-helper">';
                html += '<div class="modal-dialog vertical-align-center checklistModel full-screen" id="ImgTxtModel" style="width:'+setWidth+'">';
                    html += '<div class="modal-content">';

                        html += '<div class="modal-header">';
                            html += '<button type="button" class="close crossIcon"';
                                html += 'data-dismiss="modal">';
                                html += '<span aria-hidden="true">&times;</span>';		
                            html += '</button>';
                            
                            html += '<div class="modal-header">';
                                html += '<h4 class="modal-title text-center issueTypeTitle" id="myModalLabel" style="color:#000;">';
                                html += titleVal;
                                html += '</h4>';
                              html += '<a href="#" class="btn exportBtn">Export</a>'
                            html += '</div>';
                        html += '</div>';

                        html += '<div class="modal-body popupHeight" style="padding:0;" id="requestNoBody">';
                         html += '<div class="bg-white" id="checkListDiv">';

                            html += '<table id="example1" class="table table-responsive display nowrap">';
                                html += '<thead>';
                                    html += '<tr>';                                   
                                        for (var i = 0; i < viewManagerArr.length; i++) {
                                            html += '<th>' + viewManagerArr[i] + '</th>';
                                        }
                                    html += '</tr>';
                                html += '</thead>';
                            
                                html += '<tbody class="tbodyContainer">';
                                    for(var j=0;j<result.json_data.response.data.length;j++)
                                    {
                                            if(result.json_data.response.data[j].resolution_date == null && result.json_data.response.data[j].manager_action_date != null)
                                            {
                                                if(result.json_data.response.data[j].resolution_date == "0000-00-00 00:00:00" && result.json_data.response.data[j].manager_action_date != "0000-00-00 00:00:00")
                                                {                                                    
                                                }
                                            }
                                            else
                                            {			   
                                                html+='<tr class="'+result.json_data.response.data[j].escalation_type_id+'">'
                                                    var siteName = '';
                                                    var protocol= '';
                                                    var escalationManager;
                                                    if (result.json_data.response.data[j].sitename != null) {
                                                        siteName = result.json_data.response.data[j].sitename
                                                    }
                                                    if(result.json_data.response.data[j].request_number != null){
                                                        protocol = result.json_data.response.data[j].request_number+"-"+result.json_data.response.data[j].protocol_number
                                                        if (result.json_data.response.data[j].escalation_type_id == 4){
                                                            html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span class="icfRequest" id="' + result.json_data.response.data[j].escalation_type_id + '"></span><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + siteName + '</a></td>';
                                                        }else{
                                                            html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span id="' + result.json_data.response.data[j].escalation_type_id + '"></span><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + siteName + '</a></td>';
                                                        }
                                                        
                                                    }
                                                    else{
                                                        protocol = result.json_data.response.data[j].protocol_number;
                                                        if (result.json_data.response.data[j].escalation_type_id == 4){
                                                            html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span class="icfRequest" id="' + result.json_data.response.data[j].escalation_type_id + '"></span><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + siteName + '</a></td>';
                                                        }else{
                                                            html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span id="' + result.json_data.response.data[j].escalation_type_id + '"></span><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + siteName + '</a></td>';
                                                        }                                                        
                                                    }                                            
                                            
                                                    if(result.json_data.response.data[j].raisedBy_first_name !== null && result.json_data.response.data[j].raisedBy_first_name != 0)
                                                    {
                                                        if(result.json_data.response.data[j].raisedBy_last_name !== null && result.json_data.response.data[j].raisedBy_last_name != 0)
                                                        {
                                                            var escalationManager= result.json_data.response.data[j].raisedBy_first_name+" "+result.json_data.response.data[j].raisedBy_last_name
                                                            html+='<td class="raisedBy" id="' + result.json_data.response.data[j].request_number + '">'+escalationManager+'</td>'	
                                                        } 
                                                        else
                                                        {
                                                        html+='<td class="raisedBy" id="' + result.json_data.response.data[j].request_number + '">'+result.json_data.response.data[j].raisedBy_first_name+'</td>'   
                                                        }     
                                                    
                                                    }
                                                    else
                                                    {
                                                        if(result.json_data.response.data[j].raisedBy_last_name !== null && result.json_data.response.data[j].raisedBy_last_name != 0)
                                                        {
                                                            html+='<td class="raisedBy">'+result.json_data.response.data[j].raisedBy_last_name+'</td>' 
                                                        } 
                                                        else
                                                        {
                                                        html+='<td class="dots">.....</td>'   
                                                        }
                                                    }
                                                    html+='<td>'+result.json_data.response.data[j].create_date+'</td>'
                                                
                                                    if(result.json_data.response.data[j].escalation_first_name !== null && result.json_data.response.data[j].escalation_first_name != 0)
                                                    {
                                                        if(result.json_data.response.data[j].escalation_last_name !== null && result.json_data.response.data[j].escalation_last_name != 0)
                                                        {
                                                            var escalationManager= result.json_data.response.data[j].escalation_first_name+" "+result.json_data.response.data[j].escalation_last_name
                                                            html+='<td>'+escalationManager+'</td>'
                                                        } 
                                                        else
                                                        {
                                                        html+='<td>'+result.json_data.response.data[j].escalation_first_name+'</td>'   
                                                        }   
                                                    }
                                                    else
                                                    {
                                                        if(result.json_data.response.data[j].escalation_last_name !== null && result.json_data.response.data[j].escalation_last_name !== 0)
                                                        {
                                                            html+='<td>'+result.json_data.response.data[j].escalation_last_name+'</td>'
                                                        } 
                                                        else
                                                        {
                                                        html+='<td class="dots">.....</td>'   
                                                        }
                                                    }
                                                
                                                    if(result.json_data.response.data[j].legal_first_name !== null && result.json_data.response.data[j].legal_first_name != 0)
                                                    {
                                                        if( result.json_data.response.data[j].legal_last_name !== null && result.json_data.response.data[j].legal_last_name != 0)
                                                        {
                                                            var name =  result.json_data.response.data[j].legal_first_name +" "+result.json_data.response.data[j].legal_last_name
                                                            html+='<td class="">'+name+'</td>'	
                                                        }
                                                        else
                                                        {
                                                            html+='<td class="">'+result.json_data.response.data[j].legal_first_name+'</td>'	
                                                        }										 
                                                    }
                                                    else
                                                    {
                                                    html+='<td class="dots">......</td>'
                                                    }									
                                            
                                                    if(result.json_data.response.data[j].manager_action_date !== null && result.json_data.response.data[j].manager_action_date !== "0000-00-00 00:00:00")
                                                    {
                                                        html+='<td class="">'+result.json_data.response.data[j].manager_action_date+'</td>'	
                                                    }
                                                    else
                                                    {
                                                        if(result.json_data.response.data[j].legal_action_date !== null && result.json_data.response.data[j].legal_action_date !== "0000-00-00 00:00:00")
                                                        {
                                                            html+='<td class="">'+result.json_data.response.data[j].legal_action_date+'</td>'
                                                        }else
                                                        {
                                                        html+='<td class="dots">......</td>'
                                                        }
                                                    }
                                                
                                                    if(result.json_data.response.data[j].resolution_date !== null && result.json_data.response.data[j].resolution_date !== "0000-00-00 00:00:00")
                                                    { 
                                                        html+='<td class="">'+result.json_data.response.data[j].resolution_date+'</td>'	
                                                    }
                                                    else
                                                    {
                                                        html+='<td class="dots">......</td>'
                                                    }                                                  
                                                    var k;
                                                    if (result.json_data.response.data[j].escalation_type_id == 4) {
                                                        if (result.json_data.response.data[j].escalation_sub_type_id == 1) {                                                           
                                                             colorClassArr = new Array("#32b924", "#916aa3", "#4692c2")
                                                            var dropDownArrGICF = new Array("2", "6", "8")
                                                            if (result.json_data.response.data[j].legal_action == 0) {
                                                                html += '<td class="new" style="color:#784444">New</td>'
                                
                                                            }
                                                            else if (result.json_data.response.data[j].legal_action == 1) {
                                                                html += '<td class="pending">Pending</td>'
                                                            }
                                                            else {
                                                                for (k = 0; k < dropDownArrGICF.length; k++) {
                                                                    if (dropDownArrGICF[k] == result.json_data.response.data[j].legal_action) {
                                                                        html += '<td style="color:' + colorClassArr[k] + '">' + performArrICFGlobal[k] + '</td>'
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            var dropDownArrCSICF = new Array("2", "3", "6", "4", "8")
                                                            colorClassArr = new Array("#e89902", "#fe1631", "#916aa3", "#25d6ae", "#4692c2")                                                            
                                
                                                            if (result.json_data.response.data[j].legal_action == 0) {
                                                                html += '<td class="new" style="color:#784444">New</td>'
                                                            }
                                                            else if (result.json_data.response.data[j].legal_action == 1) {
                                                                html += '<td class="pending">Pending</td>'
                                                            }
                                                            else {
                                                                for (k = 0; k < dropDownArrCSICF.length; k++) {
                                
                                                                    if (dropDownArrCSICF[k] == result.json_data.response.data[j].legal_action) {
                                                                        html += '<td style="color:' + colorClassArr[k] + '">' + performArrICFCountrySite[k] + '</td>'
                                                                    }
                                                                    else {
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else{						
                                                        var p;
                                                        var action;
                                                        
                                                       
                                                        if(result.json_data.response.data[j].legal_action !== null && result.json_data.response.data[j].legal_action != 0)
                                                        {	
                                                            var performActionArr = new Array("1","2", "3","6", "5", "7", "8","9");
                                                            var colorClassLegalArr = new Array("#f46242","#32b924", "#fe1631", "#916aa3", "#e89902", "#eead3c", "#4692c2", "#000");
                                                            for(p=0;p<performLegalActionArr.length+1;p++)
                                                            {								
                                                                if(performActionArr[p] == result.json_data.response.data[j].legal_action)
                                                                {											
                                                                    //action  = p-1;									
                                                                    html+='<td style="color:' + colorClassLegalArr[p] + '">'+performLegalActionArr[p]+'</td>'
                                                                }
                                                            }	
                                                        }
                                                        else
                                                        {								
                                                            if(result.json_data.response.data[j].manager_action !== null && result.json_data.response.data[j].manager_action != 0)
                                                            {
                                                                var performDisplayArr = new Array("Pending","Approved","Denied","Negotiation Required","Approved with modification","On hold","Reassigned","Closed");
                                                                //var performDisplayArr = new Array("Pending", "Approved", "Denied", "Negotiation Required", "Escalated", "Approved with modification", "On hold", "Reassigned", "Closed");
                                                                
                                                                var performActionArr = new Array("1","2", "3","4","6", "7", "8","9");	
                                                                var colorClassArr = new Array("#f46242", "#32b924", "#fe1631", "#25d6ae", "#916aa3","#eead3c", "#4692c2", "#000"); 

                                                                for(var p=0;p<performDisplayArr.length+1;p++)
                                                                {								
                                                                    if(performActionArr[p] == result.json_data.response.data[j].manager_action)
                                                                    { 
                                                                        //alert(performDisplayArr[p]+"--"+result.json_data.response.data[j].manager_action)
                                                                       // action  = p-1											
                                                                        html+='<td style="color:' + colorClassArr[p] + '">'+performDisplayArr[p]+'</td>'
                                                                    }
                                                                }								
                                                            }
                                                            else
                                                            {								
                                                             html+='<td class="new" style="color:#784444">New</td>'
                                                            }
                                                        }
                                                    } 
                                                    html += '</tr>';                                           
                                                }
                                    }
                                html += '</tbody>';
                        
                            html += '</table>';

                         html += '</div>';
                        html += '</div>';

                     html += '</div>';
                html += '</div>';
            html += '</div>';
        html += '</div>';

    $('body').append(html);  

    $('.modal-content').css("width",setWidth)
    $('#requestNoModal').modal();
   
 
    function alignModal(){
        var modalDialog = $(this).find(".modal-dialog");       
        var setWidth = $(window).width()-100;        
        $('.modal-content').css("width",setWidth)
    }
    // Align modal when it is displayed 
    $("#requestNoModal").on("shown.bs.modal", alignModal);    
   
    // Align modal when user resize the window
    $(window).on("resize", function(){      
        $("#requestNoModal:visible").each(alignModal);
    });
   
    setTimeout(function(){	       
        dataTableSet(3);
    }, 500);
    
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
                raisedBy(first_name,last_name,emai_id,"CRO");
            }
        }
    });
 
    /*****Export excel click event start here*****/
	$('.exportBtn').click(function (e) {       
        location.href = serviceHTTPPath + "viewRequestNumbersExport&requestNumbers=" + requestNumberIds;
	});
	/*****Export excel click event end here*****/
    $('.crossIcon').click(function(){            
    });
    
    popUpResize();  
    tableClickEvents(result,'');
   
}
//Popup on piechart click
function piechartPopup(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics){
    $('body #pieChartPopup').remove();   
    
    var selectedDropDown = $('.userTypeDropDown .bootstrap-select .filter-option').text();
    var selectUserType = labelName +" "+$('.managerTypeDropDown .bootstrap-select .filter-option').text();
    var setWidth = $(window).width()-100;
    var html = '<div class="modal fade" id="pieChartPopup" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
        html += '<div class="vertical-alignment-helper">';
            html += '<div class="modal-dialog vertical-align-center checklistModel full-screen" id="ImgTxtModel" style="width:'+setWidth+'">';
             html += '<div class="modal-content">';

                html += '<div class="modal-header">';
                    html += '<button type="button" class="close crossIcon"';
                        html += 'data-dismiss="modal">';
                        html += '<span aria-hidden="true">&times;</span>'		
                    html += '</button>';
                    
                    html += '<h4 class="modal-title text-center" id="myModalLabel" style="color:#000;">';
                     html += selectUserType
                    html += '</h4>';
                html += '</div>';

                html += '<div class="modal-body popupHeight" style="padding:0;" id="requestNoBody">';//checkListPopup
                    html += '<div class="bg-white" id="checkListDiv">';

                    //Pie chart attachment div
                    html += '<div class="popPieChartMainDiv">'
                        html += '<div class="popupChartHeader pieHeader">'
                            html += '<span>'+labelName +' Escalations</span>'
                            html += '<a class="chartPosition" type="button" data-toggle="collapse" data-target="#collapsePieChart" aria-expanded="true" aria-controls="collapsePieChart"><em class="fa fa-caret-up"></em></a>'
                        html += '</div>'

                        html+='<div class="chartRowPosition accordion-body collapse in" id="collapsePieChart">'; 
                            html += '<div class="col-sm-12" id="">'
                                html += '<div id="popUpPieChart"></div>'
                            html += '</div>' 
                        html += '</div>';
                    html += '</div>';

                    //Bar chart attachment div
                    html += '<div class="popBarChartMainDiv">'
                        html += '<div class="popupChartHeader barHeader">'
                      
                        if(labelName == "CTA"){
                            html += '<span>Average Request Cycle Time For All CTA Escalations</span>'
                        }else if(labelName == "ICF"){
                            html += '<span>Average Request Cycle Time For All ICF</span>'
                        }
                        else{
                            html += '<span>Average Request Cycle Time For All Budget Escalations</span>'
                        }
                            
                            html += '<a class="chartPosition" type="button" data-toggle="collapse" data-target="#collapsePopupBarChart" aria-expanded="true" aria-controls="collapsePopupBarChart"><em class="fa fa-caret-down"></em></a>'
                        html += '</div>'

                        html+='<div class="chartRowPosition accordion-body collapse" id="collapsePopupBarChart">'; 
                            html += '<div class="col-sm-12" id="">'
                                html += '<div id="popUpBarChartDropDRole"></div>'//For select Role
                                html += '<div id="popUpBarChartDropdown"></div>'//For All and Individual
                                html += '<div id="popUpBarChart"></div>'
                                html += '<div class="bottomTitle"><span></span></div>';
                            html += '</div>' 
                        html += '</div>';
                    html += '</div>';

                    html += '</div>';
                html += '</div>';

             html += '</div>';
            html += '</div>';
        html += '</div>';
        html += '</div>';

    $('body').append(html);

    popUpResize();

    function alignModal(){
        var modalDialog = $(this).find(".modal-dialog");       
        var setWidth = $(window).width()-100;
    }
    // Align modal when it is displayed 
    $("#pieChartPopup").on("shown.bs.modal", alignModal);
    
    // Align modal when user resize the window
    $(window).on("resize", function(){
        $('#pieChartPopup').css("display","block")	
        $("#pieChartPopup:visible").each(alignModal);
    });
    
    $('#pieChartPopup').modal(); 
    $('#pieChartPopup').on('hidden.bs.modal', function (e) {   
        loaderRemoveFun();
        $('body #pieChartPopup').remove();
    });

    $('.crossIcon').click(function(){
        $('.modal-backdrop').remove();
    });

    if($('#tabBarAnalatics li.active a').attr('class') == "Region" || $('#tabBarAnalatics li.active a').attr('class') == "Protocol" || $('#managersRole').val() == 3){
        if($('#pieChartUser').val() != "All"){
         popUpBarChartDropDRole(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics);
        }
    }
    popUpBarChartDropDown(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics);

    loaderLogin();
    setTimeout(function (){       
         popupPaiChart(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics);

        if($('#tabBarAnalatics li.active a').attr('class') == "Region" || $('#tabBarAnalatics li.active a').attr('class') == "Protocol" || $('#managersRole').val() == 3){
            if($('#pieChartUser').val() == "All"){
                popupBottomBarChart(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics);
            }else{
                popupBarChartRegionProtocol(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics);
            }
        }else{
            popupBottomBarChart(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics);
        }          
    },1000);
    
    $('.popPieChartMainDiv #collapsePieChart').on('shown.bs.collapse', function(){
        $('.popPieChartMainDiv #collapsePieChart').parent().find(".fa-caret-down").removeClass("fa-caret-down").addClass("fa-caret-up");
    }).on('hidden.bs.collapse', function(){
        $('.popPieChartMainDiv #collapsePieChart').parent().find(".fa-caret-up").removeClass("fa-caret-up").addClass("fa-caret-down");        
    });
    $('.popBarChartMainDiv #collapsePopupBarChart').on('shown.bs.collapse', function()
    {
        $('.popBarChartMainDiv #collapsePopupBarChart').parent().find(".fa-caret-down").removeClass("fa-caret-down").addClass("fa-caret-up");
        
    }).on('hidden.bs.collapse', function()
    {
        $('.popBarChartMainDiv #collapsePopupBarChart').parent().find(".fa-caret-up").removeClass("fa-caret-up").addClass("fa-caret-down");
    });
}
//popUpResize
function popUpResize(){
    var height = $(window).height()-230;
    var windowHeight = $(window).innerHeight()-230;
    $('.popupHeight').css('min-height', height);
    $('.popupHeight').css('height', height);
    
    $(window).resize(function () {
        popUpResize();
    });
   
}
//Pop up Select Role drop down for Region and Protocol 
function popUpBarChartDropDRole(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics){
    //Select Role type drop down
    var roleArr = new Array("Escalation Managers","Legal Managers")
    $('#popUpBarChartDropDRole .barTypeDropDown').remove();
    var html='<div class="barTypeDropDown">'   
        html+='<label class="control-label">Select Role</label>'
        html+='<div class="select_DropDown">'
        html+='<div class="">'
            html+='<select name="popUpBarTypeRole" class="selectpicker" id="popUpBarTypeRole">'  
                for(var i=0;i<roleArr.length;i++){
                    var setVal = i+1;
                    html+='<option value="'+setVal+'" >'+roleArr[i]+'</option>'
                }
            html+='</select>'
            html+='</div>'
        html+='</div>'   
        
    html+='</div>'
    $('#popUpBarChartDropDRole').append(html);
    if (labelName == "ICF"){
        $('#popUpBarChartDropDRole select[name=popUpBarTypeRole]').val(2);
    }else{
        $('#popUpBarChartDropDRole select[name=popUpBarTypeRole]').val(1);
    }     
   
    $('#popUpBarChartDropDRole .selectpicker').selectpicker('refresh');
    $('.btn-group bootstrap-select').css("width", 100 + "%");

    $('#popUpBarChartDropDRole ul').css("height", "auto");
        /*****Manager type click event start here*****/
        $('#popUpBarChartDropDRole #popUpBarTypeRole').change(function(){
            var index = $(this).val();
            var userType=index; 
            
            popupBarChartRegionProtocol(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics);              
        });
}
//Inter popup bar chart drop down for All and Individual
function popUpBarChartDropDown(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics){
    $('#popUpBarChartDropdown .barUserDropDown').remove();
    var html='<div class="barUserDropDown">'   
        html+='<label class="control-label">Select User</label>'
        html+='<div class="select_DropDown">'
        html+='<div class="">'
            html+='<select name="userTypePopUp" class="selectpicker" id="popupAllIndividual">' 
            html+='<option value="All">All</option>'     
            html+='<option value="1">Individual</option>'                                                                        
            html+='</select>'
        html+='</div>'
    html+='</div>'   
      
   html+='</div>'
   $('#popUpBarChartDropdown').append(html);

   if($('#pieChartUser').val() !== "All" && $('#pieChartUser').val() !== undefined){
    $('.barUserDropDown select[name=userTypePopUp]').val(1);
   }
   $('#popUpBarChartDropdown .selectpicker').selectpicker('refresh');
   $('.btn-group bootstrap-select').css("width", 100 + "%");

    /*****Manager type click event start here*****/
    $('.barUserDropDown #popupAllIndividual').change(function(){
        var userId = $(this).val();
        var userType = $('#popUpBarTypeRole').val(); 
        if(userType == undefined){
            userType = $('#managerDiv').val();    
            if(userType == undefined){
               if( $('#pieChartUser').val() == "All"){
                userType=1;
               }
            }                  
        }

        if($('#tabBarAnalatics li.active a').attr('class') == "Region" || $('#tabBarAnalatics li.active a').attr('class') == "Protocol" || $('#managersRole').val() == 3){
            if($('#pieChartUser').val() == "All"){
                userType=3;
                popupBottomBarChart(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics)
            }
            else{
                popupBarChartRegionProtocol(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics)
            }
        }else{
            popupBottomBarChart(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics)
        }
    });
}

function popupBarChartRegionProtocol(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics){
    var v1 = new Array();
    var v2 = new Array();
    var v3 = new Array();
    var v4 = new Array();
    var ticks = new Array();

    var objBar;
  
    if (labelName == "ICF"){
        labelName="Icf";
    }
    
        if($('#popUpBarTypeRole').val() == 1){
            objBar = new Object(result.json_data.response.selectEscalation);
        }else{
            objBar = new Object(result.json_data.response.selectLegal);
        }   
   
     
    if(objBar.length !== undefined && objBar.length !== 0){
        if($('#popupAllIndividual').val() == "All"){
            var pending = 0;
			var below7 = 0;
			var above7 = 0;
			var above12 = 0;
			for (i = 0; i < objBar.length; i++) { 
                if(objBar[i].barChart != undefined){
                    if(objBar[i].barChart[labelName] != undefined){
                        if(objBar[i].barChart[labelName].bar_chart != undefined){
                            if (objBar[i].barChart[labelName].bar_chart.pending != undefined) {
                                pending = parseInt(pending) + parseInt(objBar[i].barChart[labelName].bar_chart.pending.count);
                            }
                            else {
                                pending = 0;
                            }
                            if (objBar[i].barChart[labelName].bar_chart.below7 != undefined) {
                                below7 = parseInt(below7) + parseInt(objBar[i].barChart[labelName].bar_chart.below7.count);
                            }
                            else {
                                below7 = 0;
                            }
                            if (objBar[i].barChart[labelName].bar_chart.above7 != undefined) {
                                above7 = parseInt(above7) + parseInt(objBar[i].barChart[labelName].bar_chart.above7.count);
                            }
                            else {
                                above7 = 0;
                            }
                            if (objBar[i].barChart[labelName].bar_chart.above12 != undefined) {
                                above12 = parseInt(above12) + parseInt(objBar[i].barChart[labelName].bar_chart.above12.count);
                            }
                            else {
                                above12 = 0;
                            }
                        } else{ 
                        }				
                    }
                    if (i == objBar.length - 1) {
                            v1.push(pending);
                            v2.push(below7);
                            v3.push(above7);
                            v4.push(above12);
                            ticks.push("All");
                            attachPopBarchat(v1,v2,v3,v4,ticks,fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics);                        
                    }
                }                   
               
			}
        }else{          
            if (objBar.length >= 7) {
				objBar.length = 7;
            }     
                                             
			for (i = 0; i < objBar.length; i++) {                  
                if(objBar[i].barChart != undefined){
                    if(objBar[i].barChart[labelName] != undefined){
                        if(objBar[i].barChart[labelName].bar_chart != undefined){
                            if (objBar[i].barChart[labelName].bar_chart.pending != undefined) {
                                v1.push(objBar[i].barChart[labelName].bar_chart.pending.count);
                            }
                            else {
                                v1.push(0);
                            }
                            if (objBar[i].barChart[labelName].bar_chart.below7 != undefined) {
                                v2.push(objBar[i].barChart[labelName].bar_chart.below7.count);
                            }
                            else {
                                v2.push(0);
                            }
                            if (objBar[i].barChart[labelName].bar_chart.above7 != undefined) {
                                v3.push(objBar[i].barChart[labelName].bar_chart.above7.count);
                            }
                            else {
                                v3.push(0);
                            }
                            if (objBar[i].barChart[labelName].bar_chart.above12 != undefined) {
                                v4.push(objBar[i].barChart[labelName].bar_chart.above12.count);
                            }
                            else {
                                v4.push(0);
                            }
                        }
                        else{                                       
                            v1.push(0);
                            v2.push(0);
                            v3.push(0);
                            v4.push(0);                            
                        }  
                    }
                    else{                                       
                        v1.push(0);
                        v2.push(0);
                        v3.push(0);
                        v4.push(0);                        
                    }                     
                } 
                
                var name;
                if ($('#popUpBarTypeRole').val() == 1) {
                    if (objBar[i].escalation_first_name !== 0 && objBar[i].escalation_first_name !== null) {
                        if (objBar[i].escalation_last_name !== 0 && objBar[i].escalation_last_name !== null) {
                            name = objBar[i].escalation_first_name + " " + objBar[i].escalation_last_name;
                            ticks.push(name);
                        }
                        else {
                            name = objBar[i].escalation_first_name;
                            ticks.push(name);
                        }                                  
                    }
                    else {
                        if (objBar[i].escalation_last_name !== 0 && objBar[i].escalation_last_name !== null) {
                            name = objBar[i].escalation_last_name;
                            ticks.push(name);
                        }
                    }
                }
                else {
                    if (objBar[i].legal_first_name !== 0 && objBar[i].legal_first_name !== null) {
                        if (objBar[i].legal_last_name !== 0 && objBar[i].legal_last_name !== null) {
                            name = objBar[i].legal_first_name + " " + objBar[i].legal_last_name;
                            ticks.push(name);
                        }
                        else {
                            name = objBar[i].legal_first_name;
                            ticks.push(name);
                        }
                    }
                    else {
                        if (objBar[i].legal_last_name !== 0 && objBar[i].legal_last_name !== null) {
                            name = objBar[i].legal_last_name;
                            ticks.push(name);
                        }
                    }
                }
               

				if (i == objBar.length - 1) {                   
					attachPopBarchat(v1,v2,v3,v4,ticks,fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics);
				}
			}
        }
    }else{
        v1 = [0, 0];
        v2 = [0, 0];
        v3 = [0, 0];
        v4 = [0, 0];
        attachPopBarchat(v1,v2,v3,v4,ticks,fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics);
    }   
}
//Popup bar chart value manage here
function popupBottomBarChart(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics){
    
    var v1 = new Array();
    var v2 = new Array();
    var v3 = new Array();
    var v4 = new Array();
    var ticks = new Array();

    var objPieChart;
    objPieChart = new Object(result.json_data.response);
    
    if(labelName == "ICF"){
        labelName="Icf";
    }
   
    if(objPieChart.length != undefined){
        if($('#popupAllIndividual').val() == "All"){
            var pending = 0;
            var below7 = 0;
            var above7 = 0;
            var above12 = 0;          
            for(var i=0;i<objPieChart.length;i++){ 
                        
                if (objPieChart[i].pie_chart[labelName] != undefined) {                   
                    if (objPieChart[i].pie_chart[labelName].bar_chart != undefined) {  
                        if (objPieChart[i].pie_chart[labelName].bar_chart.pending != undefined) {
                            pending = parseInt(pending) + parseInt(objPieChart[i].pie_chart[labelName].bar_chart.pending.count);               
                        }
                        else {
                            pending = 0;
                        }
                        if (objPieChart[i].pie_chart[labelName].bar_chart.below7 != undefined) {
                            below7 = parseInt(below7) + parseInt(objPieChart[i].pie_chart[labelName].bar_chart.below7.count);
                        }
                        else {
                            below7 = 0;
                        }
                        if (objPieChart[i].pie_chart[labelName].bar_chart.above7 != undefined) {
                            above7 = parseInt(above7) + parseInt(objPieChart[i].pie_chart[labelName].bar_chart.above7.count);
                        }
                        else {
                            above7 = 0;
                        }
                        if (objPieChart[i].pie_chart[labelName].bar_chart.above12 != undefined) {
                            above12 = parseInt(above12) + parseInt(objPieChart[i].pie_chart[labelName].bar_chart.above12.count);
                        }
                        else {
                            above12 = 0;
                        }
                    }
                }
                if (i == result.json_data.response.length - 1) {                   
                        v1.push(pending);
                        v2.push(below7);
                        v3.push(above7);
                        v4.push(above12);
                        ticks.push("All");
                        attachPopBarchat(v1,v2,v3,v4,ticks,fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics);                    
                 }
            }   
        }else{                       
            for(var i=0;i<objPieChart.length;i++){                                        
                if (objPieChart[i].pie_chart[labelName] != undefined) {
                    if (objPieChart[i].pie_chart[labelName].bar_chart != undefined) {

                        v1.push(objPieChart[i].pie_chart[labelName].bar_chart.pending.count);   
                        v2.push(objPieChart[i].pie_chart[labelName].bar_chart.below7.count); 
                        v3.push(objPieChart[i].pie_chart[labelName].bar_chart.above7.count);
                        v4.push(objPieChart[i].pie_chart[labelName].bar_chart.above12.count);             
                          
                                          
                    }else{                       
                        v1.push(0)
                        v2.push(0)
                        v3.push(0)
                        v4.push(0)                         
                    }
                }else{
                    v1.push(0)
                    v2.push(0)
                    v3.push(0)
                    v4.push(0)
                }
              
                //Escalation manager Name               
                if (userType == 1) {
                    if (objPieChart[i].escalation_first_name !== 0 && objPieChart[i].escalation_first_name !== null) {                   
                        if (objPieChart[i].escalation_last_name !== 0 && objPieChart[i].escalation_last_name !== null) {                       
                            name = objPieChart[i].escalation_first_name + " " + objPieChart[i].escalation_last_name;
                            ticks.push(name);                      
                        }
                        else {
                            name = objPieChart[i].escalation_first_name;
                            ticks.push(name);
                        }                
                    }
                    else {
                        if (objPieChart[i].escalation_last_name != 0) {
                            if (objPieChart[i].escalation_last_name != null) {
                                name = result[i].escalation_last_name;
                                ticks.push(name);
                            }
                            else {

                                ticks.push('');
                            }
                        }
                    }
                }
                else if (userType == 2){//Legal manager Name                    
                    if (objPieChart[i].legal_first_name !== 0 && objPieChart[i].legal_first_name !== null) {                   
                        if (objPieChart[i].legal_last_name !== 0 && objPieChart[i].legal_last_name != null) {                        
                            name = objPieChart[i].legal_first_name + " " + objPieChart[i].legal_last_name;
                            ticks.push(name);                       
                        }
                        else {
                            name = objPieChart[i].legal_first_name;
                            ticks.push(name);
                        }                   
                    }
                    else {
                        if (objPieChart[i].legal_last_name != 0) {
                            if (objPieChart[i].legal_last_name != null) {
                                name = objPieChart[i].legal_last_name;
                                ticks.push(name);
                            }
                        }
                    }
                }else{//CROmanager Name
                    if (objPieChart[i].cro_first_name !== 0 && objPieChart[i].cro_first_name !== null) {                   
                        if (objPieChart[i].cro_last_name !== 0 && objPieChart[i].cro_last_name !== null) {                       
                            name = objPieChart[i].cro_first_name + " " + objPieChart[i].cro_last_name;
                            ticks.push(name);                      
                        }
                        else {
                            name = objPieChart[i].cro_first_name;
                            ticks.push(name);
                        }                
                    }
                    else {
                        if (objPieChart[i].cro_last_name != 0) {
                            if (objPieChart[i].cro_last_name != null) {
                                name = result[i].cro_last_name;
                                ticks.push(name);
                            }
                            else {

                                ticks.push('');
                            }
                        }
                    }
                }
                
        
                if(i == objPieChart.length-1){                   
                    attachPopBarchat(v1,v2,v3,v4,ticks,fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics);
                }
            }
        }
    }else{
        v1 = [0, 0];
        v2 = [0, 0];
        v3 = [0, 0];
        v4 = [0, 0];
        attachPopBarchat(v1,v2,v3,v4,ticks,fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics);
    }    

}
// Popup Bar chart attach
function attachPopBarchat(v1,v2,v3,v4,ticks,fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics){
    
    var s1 = [0, 0, 0, 0];   
    var s2 = [v1, v2, v3, v4];
    var arr = new Array("Escalation Managers", "Legal Managers");
   
    if($('#popUpBarTypeRole').val() == undefined){
        if($('#managersRole').val() == 3 || $('#managersRole').val() == undefined ){
            $('#pieChartPopup .bottomTitle').text("CRO");
        }else{
            var selectedVal = $('#managersRole').val()-1;
            $('#pieChartPopup .bottomTitle').text(arr[selectedVal]);
        }
        
    }else{
        var selectedVal = $('#popUpBarTypeRole').val()-1;
        $('#pieChartPopup .bottomTitle').text(arr[selectedVal]);
    }

    var labelArr = new Array('New issues','Less than 7 days','From 7 to 12 days','Over 12 days')
    var colorArr = new Array('#4692c2','#1ad852','#ebe200','#e54830')	
    var seriesName = new Array('New issues','Less than 7 days','From 7 to 12 days','Over 12 days')
    var arrLegend = new Array("newRequest","sevenDays","tweleveDays","over")
    
    Highcharts.setOptions({
    colors: colorArr,	
        lang: {
            decimalPoint: '.',
            thousandsSep: ','
        }
    });	
    
    var enabledFlag
    var alphaFlag
    var betaFlag
    var depthFlag
    if(v1 == 0 && v2 == 0 && v3 == 0 && v4 == 0)
    {
        alphaFlag = 0
        betaFlag = 0
        depthFlag = 0
    }
    else
    {
        alphaFlag = 5
        betaFlag = 5
        depthFlag = 40
    }
    
    Highcharts.chart('popUpBarChart', {
    chart: {
        type: 'column',
        options3d: {
            enabled: true,
            alpha: alphaFlag,
            beta: betaFlag,
            viewDistance: 0,
            depth: depthFlag
        }
    },
    title: {
    text: '',
        style: {
            display: 'none'
        }
    },
    xAxis: {
            categories: ticks
        },	
        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: 'Number of Issues',
                style:{
                        color:"#4c9bcf",
                        font: 'normal 15px Verdana, sans-serif',
                    }				
            }
    },	
    exporting: {enabled: false},
    tooltip: {
            useHTML: true,
            followPointer: false,				
            formatter: function(){
                return '<b>Total Requests = '+this.point.y;
            }
        },
        legend: {
                verticalAlign: 'top',           
                backgroundColor: '#FFFFFF'
            },
        plotOptions: 
        {
            column: 
            {
                stacking: 'normal',
                depth: 40,
                point:{
                    events:{
                        click:function()
                        {	
                            var pointIndex = this.x;
                            var seriesIndex = this.series.index;
                        
                            var getLabelName = labelArr[seriesIndex];			
                            var chartName = "barChart";                            
                            var requestNumberIds = '';
                            var selectedLabel = new Array("pending","below7","above7","above12");
                            var requestNumberIdsArr = [];      
                            
                            var objBar;
                            if($('#tabBarAnalatics li.active a').attr('class') == "Region" || $('#tabBarAnalatics li.active a').attr('class') == "Protocol" || $('#managersRole').val() == 3){
                                //pieChartUser parent pie chart drop down value All                              
                                if($('#pieChartUser').val() == "All"){
                                    objBar = new Object(result.json_data.response);
                                    //popup all indidual dropdown value for All
                                    if($('#popupAllIndividual').val() == "All"){
                                        for(var r=0;r<objBar.length;r++){                                        
                                            if (objBar[r].pie_chart[labelName] != undefined) {                                                
                                                if(objBar[r].pie_chart[labelName].bar_chart != undefined){                                              
                                                    if(objBar[r].pie_chart[labelName].bar_chart[selectedLabel[seriesIndex]].request_number_ids != ''){
                                                        requestNumberIdsArr.push(objBar[r].pie_chart[labelName].bar_chart[selectedLabel[seriesIndex]].request_number_ids);
                                                    }
                                                }
                                            }
                                            if(r == objBar.length-1){                                           
                                                var requestNumberIds = my_implode_js(',',requestNumberIdsArr);
                                                callToRequestNuPopup(fromDate,toDate,result,pointIndex,seriesIndex,chartName,getLabelName,userType,requestNumberIds);
                                            }
                                        }
                                    }else{
                                    //popup all indidual dropdown value for indidual
                                    var requestNumberIds = my_implode_js(',',objBar[pointIndex].pie_chart[labelName].bar_chart[selectedLabel[seriesIndex]].request_number_ids);
                                    callToRequestNuPopup(fromDate,toDate,result,pointIndex,seriesIndex,chartName,getLabelName,userType,requestNumberIds);
                                    }
                                   
                                }else{
                                    //pieChartUser parent pie chart drop down value Individual like Canada                                   
                                    if($('#popUpBarTypeRole').val() == 1){
                                        objBar = new Object(result.json_data.response.selectEscalation);
                                    }else{
                                        objBar = new Object(result.json_data.response.selectLegal);
                                    }
                                    //Popup bar chart value All                                   
                                    if($('#popupAllIndividual').val() == "All"){                                      
                                        for(var r=0;r<objBar.length;r++){
                                            if (objBar[r].barChart[labelName] != undefined) {
                                                if(objBar[r].barChart[labelName].bar_chart != undefined){
                                                    if(objBar[r].barChart[labelName].bar_chart[selectedLabel[seriesIndex]].request_number_ids != ''){                                           
                                                        requestNumberIdsArr.push(objBar[r].barChart[labelName].bar_chart[selectedLabel[seriesIndex]].request_number_ids);
                                                    }
                                                }
                                            }
                                            if(r == objBar.length-1){
                                                var requestNumberIds = my_implode_js(',',requestNumberIdsArr);                                                                        
                                                callToRequestNuPopup(fromDate,toDate,result,pointIndex,seriesIndex,chartName,getLabelName,userType,requestNumberIds);
                                            }
                                        }
                                    }else{ 
                                        //Popup bar chart value Individual                                
                                        var requestNumberIds = my_implode_js(',',objBar[pointIndex].barChart[labelName].bar_chart[selectedLabel[seriesIndex]].request_number_ids);                                         
                                        callToRequestNuPopup(fromDate,toDate,result,pointIndex,seriesIndex,chartName,getLabelName,userType,requestNumberIds);
                                    }                                    
                                }
                            }else{
                                objBar = new Object(result.json_data.response);
                                //Popup bar chart value All
                                if($('#popupAllIndividual').val() == "All"){                                   
                                    for(var r=0;r<objBar.length;r++){                                       
                                        if (objBar[r].pie_chart[labelName] != undefined) {
                                            if(objBar[r].pie_chart[labelName].bar_chart != undefined){                                              
                                                if(objBar[r].pie_chart[labelName].bar_chart[selectedLabel[seriesIndex]].request_number_ids != ''){
                                                    requestNumberIdsArr.push(objBar[r].pie_chart[labelName].bar_chart[selectedLabel[seriesIndex]].request_number_ids);
                                                }
                                            }
                                        }
                                        if(r == objBar.length-1){                                           
                                            var requestNumberIds = my_implode_js(',',requestNumberIdsArr);                                            
                                            callToRequestNuPopup(fromDate,toDate,result,pointIndex,seriesIndex,chartName,getLabelName,userType,requestNumberIds);
                                         }
                                    }
                                }else{
                                    //Popup bar chart value Individual                                     
                                    var requestNumberIds = my_implode_js(',',objBar[pointIndex].pie_chart[labelName].bar_chart[selectedLabel[seriesIndex]].request_number_ids);
                                    callToRequestNuPopup(fromDate,toDate,result,pointIndex,seriesIndex,chartName,getLabelName,userType,requestNumberIds);
                                }
                               
                            }
                        }
                    }
                }
            }
        },
        series: [
            {  
            name: seriesName[0],
            data: v1,
            stack: 1
            },
            {
            name: seriesName[1],
            data: v2,
            stack: 2
            }, 
            {
            name: seriesName[2],
            data: v3,
            stack: 3
            }, 
            {
            name: seriesName[3],
            data: v4,
            stack: 4
            }
        ]
    });
}
//Popup pie chart values manage
function popupPaiChart(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics)
{
	var chart_arr = new Array();			  
    var obj = new Object();
   
    var totalPercenatge = 0;
    if (labelName == "ICF"){
        labelName="Icf";
    }
    var objPieChart;
    //Region and Protocol Popup for graphs
    if($('#tabBarAnalatics li.active a').attr('class') == "Region" || $('#tabBarAnalatics li.active a').attr('class') == "Protocol" || $('#managersRole').val() == 3){
        if($('#pieChartUser').val() == "All"){
            //For All
            objPieChart = new Object(result.json_data.response);
        }else{
            //For Individual            
            objPieChart = new Object(result.json_data.response.pieChart);
        }       
    }else{//Others for graphs
        objPieChart = new Object(result.json_data.response);
    } 
    
    setTimeout(function (){       
        for(var i=0;i<objPieChart.length;i++)
        {
            if(objPieChart[i].pie_chart[labelName] !== undefined && objPieChart[i].pie_chart[labelName].pie_chart != undefined)
            {    
                var setArr = Object.keys(objPieChart[i].pie_chart[labelName].pie_chart);               
                for(var j=0;j<setArr.length;j++)
                {  
                    totalPercenatge = totalPercenatge + parseFloat(objPieChart[i].pie_chart[labelName].pie_chart[setArr[j]].request_number_ids.length);
                    var added=false;
                    $.map(chart_arr, function(elementOfArray, indexInArray) {
                    if (elementOfArray.name == setArr[j]) {                        
                         added = true;
                        }
                    })
                    if(!added) {
                       // First time issue Name                      
                        chart_arr.push({
                            name: setArr[j],
                            y: objPieChart[i].pie_chart[labelName].pie_chart[setArr[j]].request_number_ids.length  
                        });
                    }else{
                        //Repeated Issue Name
                        for(var u=0;u<chart_arr.length;u++){
                            if(chart_arr[u].name == setArr[j]){
                                // Add value to Same Index
                                chart_arr[u].y = parseInt(chart_arr[u].y) + objPieChart[i].pie_chart[labelName].pie_chart[setArr[j]].request_number_ids.length;                               
                            }
                        }                                              
                    }                    
                }
            }
            
            if(i == objPieChart.length-1)
            {
                displayPopupPieChart(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics,chart_arr);			
            }
        }	
    },500);
	
}
//Popup pie chart attach here
function displayPopupPieChart(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics,chart_arr){
    var colorArr = new Array('#eead3c','#a686b7','#e89902','#b8b656','#7ab8c1','#4692c2','#916aa3','#d44776','#dc6e8e','#dc6e8e','#eead3c','#a686b7','#e89902','#b8b656','#7ab8c1','#4692c2','#916aa3','#d44776','#dc6e8e','#dc6e8e','#eead3c','#a686b7')
	var allowPointSelectVal
	var selectDropVal = 'Escalations'
    var xSet = 0;
	var ySet;
    var objPieChart;  
   
	if (chart_arr.length <= 4) {
		ySet = -15;
	}
	else if (chart_arr.length >= 5 && chart_arr.length <= 9) {
		ySet = -25;
	}
	else if (chart_arr.length >= 10 && chart_arr.length <= 14) {
		ySet = -40;
	}
	else {
		ySet = -30;
	}
	
	allowPointSelectVal = true
	
    Highcharts.setOptions({
     colors: colorArr,	
	    lang: {
            decimalPoint: '.',
            thousandsSep: ','
        }
    });
   
	$('#popUpPieChart').highcharts({
	    chart: {
	        type: 'pie',
				options3d: {
				enabled: true,
				alpha: 45
			},			
			events: 
			{
				load: addTitle,
				redraw: addTitle,
				click:testClick,
			},
        },	       
		credits: {
            enabled: false
        },		
		tooltip: {
            useHTML: true,
            followPointer: false,				
            formatter: function() 
            {
                return '<b>'+ this.point.name+'<br>Total Requests = '+this.point.y;
            }
        },
		legend: {			
            backgroundColor: '#fff',
            layout: 'horizontal',
            floating: true,
            align: 'center',
            verticalAlign: 'bottom'			
		},
        exporting: {enabled: false},
       
	    plotOptions: {
	        pie: {
				allowPointSelect: false,
				cursor: 'pointer',	
				size: 200,	
			    innerSize: 100,
                depth: 25,					
                showInLegend: true,
				point: {
					events: 
					{
						click: function(event) 
						{
							var options = this.options;	
                            var chartName;                            
                            var labelNamePopupPai = options.name;
                            var requestNumberIds;
                            var seriesIndex = this.series.index;

                            chartName = "pieChart";                             
                            
                            var chart_arr = new Array();	
                            var requestNumberIds = '';
                            var setArr;
                            var objPieChart;
                             //Region and Protocol Popup for graphs
                            if($('#tabBarAnalatics li.active a').attr('class') == "Region" || $('#tabBarAnalatics li.active a').attr('class') == "Protocol" || $('#managersRole').val() == 3){
                                if($('#pieChartUser').val() == "All"){
                                    objPieChart = new Object(result.json_data.response);
                                }else{                                   
                                    objPieChart = new Object(result.json_data.response.pieChart);
                                }
                                
                            }else{//Others for graphs
                                objPieChart = new Object(result.json_data.response);
                            }
                         
                            for (var i = 0; i < objPieChart.length; i++) {
                                if (objPieChart[i].pie_chart[labelName] != undefined) {
                                    if (objPieChart[i].pie_chart[labelName].pie_chart != undefined) {
                                        setArr = Object.keys(objPieChart[i].pie_chart[labelName].pie_chart); 
                                                                         
                                        for(var j=0;j<setArr.length;j++){
                                            if(setArr[j] == labelNamePopupPai){ 
                                                if (setArr[j] != '') {                                                    
                                                    chart_arr.push(objPieChart[i].pie_chart[labelName].pie_chart[labelNamePopupPai].request_number_ids)                                                    
                                                }
                                            }
                                           
                                        }                                                                                
                                    }
                                }

                                if(i == objPieChart.length-1){                                                                 
                                    requestNumberIds = my_implode_js(',',chart_arr)                                   
                                    callToRequestNuPopup(fromDate,toDate,result,pointIndex,seriesIndex,chartName,labelNamePopupPai,userType,requestNumberIds);                                    
                                }
                            }
							
						 }
					}
					
				},
				
	             innerSize: '60%',
				 dataLabels: 
				 {
					distance: 0,
                    enabled: true,                   
					style: { fontFamily: '\'Lato\', sans-serif', fontSize: '12px' },
                    connectorColor: '#fff',
					connectorWidth:0,					
                    formatter: function ()
					{
                    }
                }
	        }
        },
        title: {
            text: 'Selected '+'<br>'+selectDropVal,	
            align: 'center',
            verticalAlign: 'middle',
            y: 0,           
            style: {
                color: '#337398',
                font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
             }
        },		    
		series: [{
            type: 'pie',
            name: 'Browser share',
			borderColor: "#ffffff",			
            data:chart_arr,			
            colorByPoint: true         
        }]
	});    
   
	function addTitle(){
	}	
	function testClick(){		
	 }
	$('#popUpPieChart .highcharts-title').css("text-decoration","underline")
    $('#popUpPieChart .highcharts-title').css("cursor","pointer")

    $('#popUpPieChart .highcharts-title').click(function () {
        //Click on pie center text Selected Escalations
        pieChartAllEscLegal(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics,chart_arr);
    })
    
    loaderRemoveFun();	
}
//Popup pie total escalations 
function pieChartAllEscLegal(fromDate,toDate,result,pointIndex,chartName,labelName,userType,analatics,chart_arr){
    var objPieChart;
    if($('#tabBarAnalatics li.active a').attr('class') == "Region" || $('#tabBarAnalatics li.active a').attr('class') == "Protocol" || $('#managersRole').val() == 3){
        if($('#pieChartUser').val() == "All"){
            objPieChart = new Object(result.json_data.response);
        }else{
            objPieChart = new Object(result.json_data.response.pieChart);
        }
        
    }else{//Others for graphs
        objPieChart = new Object(result.json_data.response);
    }

    var options = 0;	
    var chartName;
   
    var labelNamePopupPai = "All";
    var requestNumberIds;
    var requestNumberIdsArr = [];
    var seriesIndex = 0;
   
    for (var i = 0; i < objPieChart.length; i++) {    
        if (objPieChart[i].pie_chart[labelName] != undefined) {
           
            if (objPieChart[i].pie_chart[labelName].pie_chart != undefined) {
                setArr = Object.keys(objPieChart[i].pie_chart[labelName].pie_chart);                                     
                
                for(var j=0;j<setArr.length;j++){                                                                  
                    if (setArr[j] != '') {
                        requestNumberIdsArr.push(objPieChart[i].pie_chart[labelName].pie_chart[setArr[j]].request_number_ids);
                        
                    }                  
                }                                            
            }
        }

        if(i == objPieChart.length-1){
            requestNumberIds = my_implode_js(',',requestNumberIdsArr);             
            callToRequestNuPopup(fromDate,toDate,result,pointIndex,seriesIndex,chartName,labelNamePopupPai,userType,requestNumberIds)                                   
        }
    }
}