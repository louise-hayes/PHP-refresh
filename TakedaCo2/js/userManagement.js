function userManager(){
    var hamburgerActive = 1;  
    if(window.localStorage.getItem('userType') != null){  
        hamburgerList(hamburgerActive, window.localStorage.getItem('userType'));
        
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
                //alert("--"+result.json_data.response.length)               
                userDashboard(result);           
            },
            error: function (e) {
                loaderRemoveFun();
                return;
            }
        });	
        
        // Attach Add User, Protocol, Site buttons
        addSiteProtocol();
    }else{
        location.href = "../index.html";
    }
}
function addSiteProtocol(){
    var is_active = window.localStorage.getItem("is_active");

    $('#addUserPSite .addUserdiv').remove();
    var html='<div class="addUserdiv">';
        if(is_active == 1){
            html+='<div class="siteProtocol">';
                html+='<a href="#" class="btn addProtocol"><img src="../images/protocol.png" alt="C3-Logo"></a>';
                html+='<a href="#" class="btn addSite"><img src="../images/site.png" alt="C3-Logo"></a>';
            html+='</div>';
        }else{
            html+='<div class="siteProtocol">';
                html+='<a href="#" class="btn addProtocol disabled"><img src="../images/protocol.png" alt="C3-Logo"></a>';
                html+='<a href="#" class="btn addSite disabled"><img src="../images/site.png" alt="C3-Logo"></a>';
            html+='</div>';
        }
      
       html+='</div>';
    $('#addUserPSite').append(html);

    $('.addProtocol').click(function(){
        addProtocolSite('protocol')
    })
    $('.addSite').click(function(){
        addProtocolSite('site')
    })

    var user_id = window.localStorage.getItem("user_id");
    var setManagerArr = new Array("Sr.No", "First Name", "Last Name", "Role", "Email Id", "Assign Requests","Login Permission", "Action");
    $('.navTabDivContainer .addUserdiv a').remove();

    var html;
    if(is_active == 1){
        html='<a href="#" class="btn add_user">Add User</a>';        
    }
    else{
        html='<a href="#" class="btn add_user disabled">Add User</a>';
    }
    $('.navTabDivContainer .addUserdiv').append(html);
    $('.add_user').click(function(){
        callToUserRole("",window.localStorage.getItem('userType'),user_id,setManagerArr);
    });
}
function userDashboard(result){    
    var defaultSetTable = 0;
    var userTypeArr = new Array("","CRO","Escalation Managers","Legal Managers","Management");
    var setManagerArr = new Array("Sr.No", "First Name", "Last Name", "Role", "Email Id", "Assign Requests","Login Permission", "Action");
    $('#tabBarUser li').remove();    
    var html = '';

    for(var i=0;i<result.json_data.response.length;i++){
        if(result.json_data.response[i].user_management != null){           
           
            var userArr = result.json_data.response[i].user_management.split(',').sort();            
            defaultSetTable = userArr[0]
            for(var j=0;j<userArr.length;j++){
                if(j == 0){
                    html += '<li class="active" id="'+userArr[j]+'">';
                     html += '<a  href="#" data-toggle="tab">'+userTypeArr[userArr[j]]+'</a>';
                    html += '</li>';
                }else{
                    html += '<li id="'+userArr[j]+'">';
                     html += '<a href="#" data-toggle="tab">'+userTypeArr[userArr[j]]+'</a>';
                    html += '</li>';
                }
            }
            $('#tabBarUser').append(html); 
        }
    }        
    
    $('#tabBarUser li').click(function (e) {
		var index = $('#tabBarUser li').index(this);
        var userType = $(this).attr('id');

        $('#searchbox').val('');
        $('.userSearch').css("display", "block");
        $('.addLegalICFBtn .legalICF').remove();       
        if(userType == 2 || userType == 3){
            legalAndAssignment(userType);
        }
        userManagerType(setManagerArr,userType);       
    });
    
    if(defaultSetTable == 2 || defaultSetTable == 3){
        legalAndAssignment(defaultSetTable);
    }
    userManagerType(setManagerArr,defaultSetTable);
}
function legalAndAssignment(userType){    
    $('.addLegalICFBtn .legalICF').remove();
    var _html = '<div class="legalICF">';
    _html += '<div class="legalICFSelect">';
        if(userType == 2){
            _html += '<span class="btn normalBtn lagelAssignTabBtn">Escalation Managers</span>'
        }else{
            _html += '<span class="btn normalBtn lagelAssignTabBtn">Legal Managers</span>'
        }
       
        _html += '<span class="btn normalBtn">Assignment</span>'
  
        var is_active = window.localStorage.getItem("is_active");
        //Search and Assign btn
        _html += '<div class="ICFSearchDiv" style="display: none;">';
            // _html += '<input type="text" id="icfSearch" class="icfSearch" style="float: left;">';  
            if(is_active == 0){
                _html += '<span class="btn assignDisabledBtn" disabled>Assign</span>';
            }else{
                _html += '<span class="btn assignBtn">Assign</span>';
            }  
            
        _html += '</div>';
    
    _html += '</div>';  
    
    //Radio Options
    _html += '<div class="icfRadioOption">';
    _html += '</div>';

    _html += '</div>';

    $('.addLegalICFBtn').append(_html);

    $('.ICFSearchDiv .assignBtn').click(function(){
        var setVal = $('.icfRadioOption .radionBtn input:radio[name="status"]:checked').val(); 
        openICFAssignPopup('',0,setVal,userType);
    });
    
    $('.legalICFSelect .normalBtn').click(function (e) {
        var _index = $(this).index();
        $('.legalICFSelect .normalBtn').removeClass("lagelAssignTabBtn");
        $(this).addClass("lagelAssignTabBtn");
        $('#searchbox').val('');  
        if(_index == 0){          
            // $('.userSearch').css("display", "block");
             $('.ICFSearchDiv').css("display", "none");
            $('.icfRadioOption .ICFRadioBtn').remove();

            var setManagerArr = new Array("Sr.No", "First Name", "Last Name", "Role", "Email Id", "Assign Requests","Login Permission", "Action");
            //attachUserTable(setManagerArr);
            userManagerType(setManagerArr,userType);
        }else{                     
            // $('.userSearch').css("display", "none");
             $('.ICFSearchDiv').css("display", "block");

            // Call in js/ICFAssignment.js
            icfAssginmentPage(userType);
        }
    });
}
function userManagerType(setManagerArr,userType) {  
    loaderLogin();
	$.ajax({
		url: serviceHTTPPath + "userManagement",
		type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        }, 
        data: { role_id: userType },
		success: function (croListResult) {
            loaderRemoveFun();
            //alert("success="+JSON.stringify(croListResult.json_data.response))
            if(croListResult.json_data.response == 4 || croListResult.json_data.response == 5 || croListResult.json_data.response == 6){
                location.href = "../index.html";
            }else{
                attachUserTable(croListResult, userType,setManagerArr);               
            }			
		},
		error: function (e) {
			loaderRemoveFun();

			return;
		}
	});
}
function attachUserTable(result,userType,setManagerArr){   
    $('.tableMainContainer #example1_wrapper').remove();
    $('.tableMainContainer #example1').remove();
    var html= '<table id="example1" class="table table-responsive display nowrap" width="100%">';
        html += '<thead>';
            html += '<tr>';
            for (var i = 0; i < setManagerArr.length; i++) {
                html += '<th>' + setManagerArr[i] + '</th>';
            }
            html += '</tr>';
        html += '</thead>';

        html += '<tbody class="tbodyContainer" id="bodyUserManager">';   
        html += '</tbody>';

    html += '</table>';
    $('.tableMainContainer').append(html);    
    
    attachTableData(result, userType);

    //Active Inactive button click event
    $('#example1 tbody').on('click', '.activeInactive', function (e) {
        var user_id = $(this).attr('id');
        activeOrInactive(result, userType, user_id,setManagerArr);
    })

    //Enable disable button click event 
    $('#example1 tbody').on('click', '.enabledDisabled', function (e) {
        var user_id = $(this).attr('id');
        enableOrDisable(result, userType, user_id,setManagerArr);
    })

    $('#example1 tbody').on('click', '.delUserManager', function (e) {
        var user_id = $(this).attr('id');
    
        // Call in js/popup.js
        callToDeleteRow(result, userType, user_id,setManagerArr);
    });	

    $('#example1 tbody').on('click', '.editUserManager', function (e) {
        var user_id = $(this).attr('id');
        callToEditUser(result, userType, user_id,setManagerArr);
    });
}

function attachTableData(result, userType) {
    
    $('#example1').DataTable().destroy();
    $('#bodyUserManager tr').remove();
    
	var t;
	for (var i = 0; i < result.json_data.response.length; i++) {
		var html = '<tr class="tableTr">';
		var srN = i + 1;
		html += '<td>' + srN + '</td>';
		if (result.json_data.response[i].first_name != 0) {
			if (result.json_data.response[i].first_name != null) {
				html += '<td>' + result.json_data.response[i].first_name + '</td>';
			}
			else {
				html += '<td>.....</td>';
			}
		}
		else {
			html += '<td>.....</td>';
		}

		if (result.json_data.response[i].last_name != 0) {
			if (result.json_data.response[i].last_name != null) {
				html += '<td>' + result.json_data.response[i].last_name + '</td>';
			}
			else {
				html += '<td>.....</td>';
			}
		}
		else {
			html += '<td>.....</td>';
		}

		if (userType == 1) {
			html += '<td>CRO</td>';
		}
		else if (userType == 2) {
			html += '<td>Escalation Manager</td>';
		}		
		else if (userType == 3) {
            
            var typeArr = new Array();
            var esc_type_idArrSet;
            for(var p=0;p<result.json_data.response[i].legalType.length;p++){
                if(result.json_data.response[i].legalType[p].esc_type_id == 4){
                    if(result.json_data.response[i].legalType[p].esc_sub_type_id == 1){
                        typeArr.push("ICF - Global");
                    }else if(result.json_data.response[i].legalType[p].esc_sub_type_id == 2){
                        typeArr.push("ICF - Country");
                    }else if(result.json_data.response[i].legalType[p].esc_sub_type_id == 3){
                        typeArr.push("ICF - Site");
                    }else{
                        typeArr.push("ICF-Other"); 
                    }
                }else{
                    if(result.json_data.response[i].legalType[p].esc_type_id == 1){
                        typeArr.push("Budget");
                    }else if(result.json_data.response[i].legalType[p].esc_type_id == 2){
                        typeArr.push("Contract");
                    }
                }
                if(p == result.json_data.response[i].legalType.length-1){
                    html += '<td>' + typeArr + '</td>';
                }
            }            
		}
		else if (userType == 4) {
			html += '<td>Management</td>';
		}
		if (result.json_data.response[i].email != 0) {
			if (result.json_data.response[i].email != null) {
				html += '<td>' + result.json_data.response[i].email + '</td>';
			}
			else {
				html += '<td>.....</td>';
			}
		}
		else {
			html += '<td>.....</td>';
        }
        
        var is_active = window.localStorage.getItem("is_active");
        
		html += '<td>';
            html += '<div class="example">';
            if (result.json_data.response[i].is_active == 1) {
                if (is_active == 1) {
                    html += '<button type="button" class="btn btn-success activeInactive" id="'+result.json_data.response[i].user_id+'">Yes </button>'
                }else{
                    html += '<button type="button" class="btn btn-success disabled" id="'+result.json_data.response[i].user_id+'">Yes </button>'
                }
            }
            else {
                if (is_active == 1) {
                    html += '<button type="button" class="btn btn-default activeInactive" id="'+result.json_data.response[i].user_id+'">No</button>'
                }else{
                    html += '<button type="button" class="btn btn-default disabled" id="'+result.json_data.response[i].user_id+'">No</button>'
                }
            }
            html += '</div>';
		html += '</td>';

		html += '<td>';
            html += '<div class="example">';

            if (result.json_data.response[i].is_enabled == 1) {
                if (is_active == 1) {
                    html += '<button type="button" class="btn btn-primary enabledDisabled" id="'+result.json_data.response[i].user_id+'">Enabled</button>'
                }else{
                    html += '<button type="button" class="btn btn-primary disabled" id="'+result.json_data.response[i].user_id+'">Enabled</button>'
                }
            }
            else {
                if (is_active == 1) {
                     html += '<button type="button" class="btn btn-default enabledDisabled" id="'+result.json_data.response[i].user_id+'">Disabled</button>'
                }else{
                    html += '<button type="button" class="btn btn-default disabled" id="'+result.json_data.response[i].user_id+'">Disabled</button>'
                }
            }

            html += '</div>';
		html += '</td>';

	   var setManagementType = window.localStorage.getItem("setManagementType");
       var setUserMangerType = window.localStorage.getItem("setUserMangerType");
      
       
	   if (setManagementType != "ICFManagement" || setUserMangerType != 1) {
        html += '<td class="">';
        if (is_active == 1) {
         html += '<button type="button" class="btn btn-info editUserManager" id="'+result.json_data.response[i].user_id+'" style="margin-right: 5px;">Edit </button>'
         html += '<button type="button" class="btn btn-danger delUserManager" id="'+result.json_data.response[i].user_id+'">Delete </button>';
        }else{
            html += '<button type="button" class="btn btn-info disabled" id="" style="margin-right: 5px;">Edit </button>'
            html += '<button type="button" class="btn btn-danger disabled" id="">Delete </button>';
        }		
		html += '</td>';
	   }

		html += '</tr>';

        $('#bodyUserManager').append(html);
    }
    dataTableSet(4);
}
function callToEditUser(result, userType, user_id,setManagerArr){
    loaderLogin();
   
	$.ajax({
		url: serviceHTTPPath + "userDetails",
		type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
        data: { 
            user_id: user_id
        },
		success: function (resultEditUser) {		
            //alert("success="+JSON.stringify(resultEditUser))
            loaderRemoveFun();
            callToUserRole(resultEditUser,userType,user_id,setManagerArr);            
		},
		error: function (e) {
			loaderRemoveFun();
			return;
		}
	});
}
// Active Inactive web service
function activeOrInactive(result, userType, user_id,setManagerArr) {
    loaderLogin();
    $.ajax({
        url: serviceHTTPPath + "userActiveInactive",
        type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        },  
        data: { user_id: user_id ,user_type:userType},
        success: function (result) {
            ///alert("successEdit="+JSON.stringify(result))
            loaderRemoveFun();
           
            // Call in js/popup.js               
            userManagerTableActions(result.json_data.message, userType,setManagerArr);
                       
        },
        error: function (e) {
            loaderRemoveFun();
            return;
        }
    });
}
// Enable Disable web service
function enableOrDisable(result, userType, user_id,setManagerArr) {
    loaderLogin();
    $.ajax({
        url: serviceHTTPPath + "userDisableEnable",
        type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        }, 
        data: { user_id: user_id,user_type:userType },
        success: function (result) {           
            loaderRemoveFun();            
               // Call in js/popup.js
               userManagerTableActions(result.json_data.message, userType,setManagerArr);          
        },
        error: function (e) {
            loaderRemoveFun();
            return;
        }
    });
}
// Call delete user type
function callToDeleteService(result, userType, user_id,setManagerArr) {
    
    loaderLogin();
    $.ajax({
        url: serviceHTTPPath + "userDelete",
        type: "POST",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        }, 
        data:{ user_id: user_id,user_type:userType },
        success: function (result) {
            loaderRemoveFun();            
            // Call in js/popup.js
            userManagerTableActions(result.json_data.message, userType,setManagerArr);
        },
        error: function (e) {
            loaderRemoveFun();
            return;
        }
    });
}