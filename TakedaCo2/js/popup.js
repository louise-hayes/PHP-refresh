// Common alert
function alertScreen(msg,hrefScreen) {
	$('.modal-backdrop').remove();
    $('body #alertModel').remove();
	$('.bgForLoader').remove();
	$('body .multiStep').remove();
	loaderRemoveFun();
	var html = '<div class="modal fade" id="alertModel" tabindex="-1" role="dialog" aria-labelledby="alertModel" aria-hidden="true">';
	html += '<div class="vertical-alignment-helper">';
	html += '<div class="modal-dialog vertical-align-center">';
	html += '<div class="modal-content">';
	html += '<div class="modal-header">';
    	html += '<h4 class="modal-title" id="">Notification</h4>';
	html += '</div>';
	html += '<div class="modal-body">' + msg + '</div>';
	html += '<div class="modal-footer">';
	html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="popupOkBtn">OK</button>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';

	$('body').append(html);
	$('#alertModel').modal();
	
	$('#popupOkBtn').click(function (e) {
		loaderRemoveFun();
		if(hrefScreen != ''){
			location.href = hrefScreen;
		}
		$('html').css('overflow', 'auto');
	});
	$('#alertModel').on('hidden.bs.modal', function (e) {
        loaderRemoveFun();
	});
}

// UserManagement Screen Popup
function userManagerTableActions(msg,userType,setManagerArr) {	
	$('.modal-backdrop').remove();
    $('body #myModal').remove();
    $('.bgForLoader').remove();
	var html = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModal" aria-hidden="true">';
	html += '<div class="vertical-alignment-helper">';
	html += '<div class="modal-dialog vertical-align-center">';
	html += '<div class="modal-content">';
	html += '<div class="modal-header">';
    	html += '<h4 class="modal-title" id="">Notification</h4>';
	html += '</div>';
	html += '<div class="modal-body">' + msg + '</div>';
	html += '<div class="modal-footer">';
	html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="popupOkBtn">OK</button>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';

	$('body').append(html);
	$('#myModal').modal();
	
	$('#popupOkBtn').click(function (e) {	
		$('body #myModal').remove();
		$('.modal-backdrop').remove();	
		
		userManagerType(setManagerArr,userType);       
	});
	$('#myModal').on('hidden.bs.modal', function (e) {
        loaderRemoveFun();
	});
}
//Delete Notification
function callToDeleteRow(result, userType, user_id,setManagerArr) {
	$('.vertical-alignment-helper').remove();	
	$('body #deleteModal').remove();
	var html = '<div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
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
	$('#deleteModal').modal();
	$('#deleteModal').on('hidden.bs.modal', function (e) {

	});

	$('#nextStatusBtn').click(function (e) {
		// Call in js/userManagement.js
		$('#deleteModal').hide();
		$('.modal-backdrop').remove();
		callToDeleteService(result, userType, user_id,setManagerArr);
	});
	$('#cancelStatusBtn').click(function (e) {
		$('#deleteModal').hide();
		$('.modal-backdrop').remove();
		$('body #myModal').remove();
	});
}
// Add user notification
function addUserAlert(msg,setManagerArr,formId,icfFormId,userType) {
	$('.modal-backdrop').remove();
    $('body #myModal').remove();
	$('.bgForLoader').remove();
	$('body .multiStep').remove();
	var html = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModal" aria-hidden="true">';
	html += '<div class="vertical-alignment-helper">';
	html += '<div class="modal-dialog vertical-align-center">';
	html += '<div class="modal-content">';
	html += '<div class="modal-header">';
    	html += '<h4 class="modal-title" id="">Notification</h4>';
	html += '</div>';
	html += '<div class="modal-body">' + msg + '</div>';
	html += '<div class="modal-footer">';
	html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="popupOkBtn">OK</button>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';

	$('body').append(html);
	$('#myModal').modal();
	
	$('#popupOkBtn').click(function (e) {
		$('body #myModal').remove();
		$('.modal-backdrop').remove();
	
		var radioButtons = $('.icfRadioOption .radionBtn input:radio[name="status"]');  
		var selectedRadioBtn = radioButtons.index(radioButtons.filter(':checked'));
		
		if(selectedRadioBtn == -1){
			var userType = $('.userMangerNav li.active').attr('id');
			userManagerType(setManagerArr,userType);  
		}
		else{
			var tableHeaderIndex;
			var selectedName;
			for(var i =0;i<icfDataArr.length;i++){
				if(icfDataArr[i].icfId == icfFormId && icfDataArr[i].formId == formId){
					tableHeaderIndex = icfDataArr[i].index;		
					selectedName = icfDataArr[i].name;
				}
				if(i == icfDataArr.length-1){		
					attachICFTable(icfDataArr[tableHeaderIndex].tHeader);
					if(icfFormId == 4){
						icfOthersList(formId,icfFormId,userType);
					}else{
						icfAssignmentList(formId,icfFormId,userType);	
					}
					icfRadioOptions(userType,selectedName);											
				}
			}		
		}
				
	});
	$('#myModal').on('hidden.bs.modal', function (e) {
        loaderRemoveFun();
	});
}
// Attachments
function attachmentIconPopup(imgResult, msg) {
    loaderLogin();
    $('body #myModal').remove();   
    $('.modal-backdrop').remove();

    var html = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    html += '<div class="vertical-alignment-helper">';
    html += '<div class="modal-dialog vertical-align-center checklistModel" id="ImgTxtModel">';
    html += '<div class="modal-content">';

    html += '<div class="modal-header">';
    html += '<button type="button" class="close crossIcon"';
		html += 'data-dismiss="modal">';
		html += '<span aria-hidden="true">&times;</span>'		
	html += '</button>';
    html += '<h4 class="modal-title text-center" id="myModalLabel" style="color:#000;">';
    html += msg;
    html += '</h4>';
    html += '</div>';

    html += '<div class="modal-body popupHeight" style="padding:0;" id="requestNoBody">';//checkListPopup
    html += '<div class="bg-white" id="checkListDiv">';

    html += '<ul class="attachmentIcon">';
    if (imgResult.json_data.response.length != undefined) {
        for (var u = 0; u < imgResult.json_data.response.length; u++) {
            html += '<li id="">';
            html += '<a class="linkTag" target="_blank" style="text-decoration: underline;" href="' + imgResult.json_data.response[u].link + '">' + imgResult.json_data.response[u].link + '</a>';
            html += '</li>';

            if (u == imgResult.json_data.response.length - 1) {
                loaderRemoveFun();
                $('#myModal').modal();
            }
        }
    }
    html += '</ul>';

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
        $('body #myModal').remove();
        $('.modal-backdrop').remove();
    });
}
/*****CRO Request description  text in popup function start here*****/
function croDescFun(managerActionDesc, msg) {
    $('body #myModal').remove();   
    $('.modal-backdrop').remove();

    var html = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    html += '<div class="vertical-alignment-helper">';
    html += '<div class="modal-dialog vertical-align-center checklistModel" id="ImgTxtModel">';
    html += '<div class="modal-content">';

    html += '<div class="modal-header">';
    html += '<button type="button" class="close crossIcon"';
		html += 'data-dismiss="modal">';
		html += '<span aria-hidden="true">&times;</span>'		
	html += '</button>';
    html += '<h4 class="modal-title text-center" id="myModalLabel" style="color:#000;">';
    html += msg;
    html += '</h4>';
    html += '</div>';

    html += '<div class="modal-body popupHeight" id="requestNoBody">';//checkListPopup
    html += '<div class="bg-white" id="checkListDiv">';

    html += '<div class="" id="descDiv">';
    html += '<textarea class="form-control"  placeholder="" id="" disabled>' + managerActionDesc + '</textarea>';
    html += '</div>';

    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    $('body').append(html);

    $('#myModal').modal();
    $('#myModal').on('hidden.bs.modal', function (e) {       
        $('.bgForLoader').remove();
        $('body #myModal').remove();
        $('.modal-backdrop').remove();
    });
}
/*****CRO Request description  text in popup function end here*****/

//ICF Add and Delete popup 
function assignICFAssignment(msg, formId,icfFormId,userType) {
	
    $('.modal-backdrop').remove();
	$('body #myModal').remove();
	$('body .multiStep').remove();
    var html = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    html += '<div class="vertical-alignment-helper">';
    html += '<div class="modal-dialog vertical-align-center">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';
    html += '<h4 class="modal-title" id="myModalLabel">Notification</h4>';
    html += '</div>';
    html += '<div class="modal-body">' + msg + '</div>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="popupOkBtn">OK</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    $('body').append(html);
    $('#myModal').modal();

    $('#popupOkBtn').click(function () {
        $('body #myModal').remove();
		$('.modal-backdrop').remove();
		    var radioButtons = $('.icfRadioOption .radionBtn input:radio[name="status"]');  
			var selectedRadioBtn = radioButtons.index(radioButtons.filter(':checked'));
			
			var tableHeaderIndex;
			var selectedName;
			for(var i =0;i<icfDataArr.length;i++){
				if(icfDataArr[i].icfId == icfFormId && icfDataArr[i].formId == formId){
					tableHeaderIndex = icfDataArr[i].index;		
					selectedName = icfDataArr[i].name;
				}
				if(i == icfDataArr.length-1){			
					attachICFTable(icfDataArr[tableHeaderIndex].tHeader);
					if(icfFormId == 4){
						icfOthersList(formId,icfFormId,userType);
					}else{
						icfAssignmentList(formId,icfFormId,userType);	
					}
					icfRadioOptions(userType,selectedName);											
				}
			}			
    });
    $('#myModal').on('hidden.bs.modal', function () {
        $('body #myModal').remove();
        $('.modal-backdrop').remove();
    });
}
//Delete Notification For Site and Protocol
function deleteRow(idVal, type) {
	$('body #deleteModal').remove();
	var html = '<div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModal" aria-hidden="true">';
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
	$('#deleteModal').modal();
	$('#deleteModal').on('hidden.bs.modal', function (e) {

	});

	$('#nextStatusBtn').click(function (e) {
        // Call in js/siteProtocol.js
		loaderLogin();	

		if(type == "site"){
			$.ajax({
				url: serviceHTTPPath + "deleteSitename",
				type: "POST",
				dataType: 'json',
				headers: {
					"authorization": window.localStorage.getItem("token_id")
				}, 
				data:
					{
						sitename_id: idVal,
					},
				success: function (result) {
					loaderRemoveFun();
					$('body #deleteModal').remove();
					$('.modal-backdrop').remove();	
					tableAdd();
					siteNameWebService(type);
				},
				error: function (e) {	
					return;
				}
			});
			
		}else{
			$.ajax({
				url: serviceHTTPPath + "deleteProtocol",
				type: "POST",
				dataType: 'json',
				headers: {
					"authorization": window.localStorage.getItem("token_id")
				}, 
				data:
					{
						protocol_id: idVal,
					},
				success: function (result) {
					loaderRemoveFun();
					$('body #deleteModal').remove();
					$('.modal-backdrop').remove();	
					tableAdd();
					protocolWebService(type);
				},
				error: function (e) {
	
					return;
				}
			});
		}
	});

	$('#cancelStatusBtn').click(function (e) {
		$('#deleteModal').hide();
		$('body #deleteModal').remove();
	});
}
// Common alert
function alertScreenEditProtocol(msg,hrefScreen) {
	$('.modal-backdrop').remove();
    $('body #editProtocol').remove();
	$('.bgForLoader').remove();
	$('body .multiStep').remove();
	var html = '<div class="modal fade" id="editProtocol" tabindex="-1" role="dialog" aria-labelledby="editProtocol" aria-hidden="true">';
	html += '<div class="vertical-alignment-helper">';
	html += '<div class="modal-dialog vertical-align-center">';
	html += '<div class="modal-content">';
	html += '<div class="modal-header">';
    	html += '<h4 class="modal-title" id="">Notification</h4>';
	html += '</div>';
	html += '<div class="modal-body">' + msg + '</div>';
	html += '<div class="modal-footer">';
	html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="popupOkBtn">OK</button>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';

	$('body').append(html);
	$('#editProtocol').modal();
	
	$('#popupOkBtn').click(function (e) {
		loaderRemoveFun();
		if(hrefScreen != ''){
			location.href = hrefScreen;
		}
	});
	$('#editProtocol').on('hidden.bs.modal', function (e) {
        loaderRemoveFun();
	});
}
// Perform Action Alert
function performActionPopup(msg,user_id,hamburgerType) {	
	$('.modal-backdrop').remove();
    $('body #myModal').remove();
	$('.bgForLoader').remove();
	$('body .multiStep').remove();
	loaderRemoveFun();
	var html = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModal" aria-hidden="true">';
	html += '<div class="vertical-alignment-helper">';
	html += '<div class="modal-dialog vertical-align-center">';
	html += '<div class="modal-content">';
	html += '<div class="modal-header">';
    	html += '<h4 class="modal-title" id="">Notification</h4>';
	html += '</div>';
	html += '<div class="modal-body">' + msg + '</div>';
	html += '<div class="modal-footer">';
	html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="popupOkBtn">OK</button>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';

	$('body').append(html);
	$('#myModal').modal();
	
	$('#popupOkBtn').click(function (e) {
		$('body #myModal').remove();
		$('.modal-backdrop').remove();
		var fromDate =  $("#datepicker").val();
		var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( fromDate ) );
		
		var toDate = $("#toDatepicker").val(); 
		var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ) );
		
		loaderRemoveFun();
		var userType = window.localStorage.getItem('userType');
		if(userType == 2){
			escalationMService(fromDateNewFormat, todateNewFormat,user_id,hamburgerType);
		}else{
			loadLegalData(fromDateNewFormat,todateNewFormat,user_id,hamburgerType)
		}
	});
	$('#myModal').on('hidden.bs.modal', function (e) {
		$('body #myModal').remove();
        $('.modal-backdrop').remove();
        loaderRemoveFun();
	});
}

// Nexted Model alert
function alertScreenMulti(msg,hrefScreen) {
	$('.modal-backdrop').remove();
    $('body #addEditModal').remove();

	loaderRemoveFun();
	var html = '<div class="modal fade" id="addEditModal" tabindex="-1" role="dialog" aria-labelledby="addEditModal" aria-hidden="true">';
	html += '<div class="vertical-alignment-helper">';
	html += '<div class="modal-dialog vertical-align-center">';
	html += '<div class="modal-content">';
	html += '<div class="modal-header">';
    	html += '<h4 class="modal-title" id="">Notification</h4>';
	html += '</div>';
	html += '<div class="modal-body">' + msg + '</div>';
	html += '<div class="modal-footer ">';
	html += '<a type="" class="" data-dismiss="modal" id="popupOkBtn">OK</a>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';

	$('body').append(html);
	$('#addEditModal').modal();
	
	$('#popupOkBtn').click(function (e) {
		loaderRemoveFun();
		if(hrefScreen != ''){
			location.href = hrefScreen;
		}
	});
	$('#addEditModal').on('hidden.bs.modal', function (e) {
        loaderRemoveFun();
	});
}

// Raised By for email copy
function raisedBy(first_name,last_name,email_id,title){
	$('body #raisedByModal').remove();
    var html = '<div class="modal fade" id="raisedByModal" tabindex="-1" role="dialog" aria-labelledby="raisedByModal" aria-hidden="true">';
    html += '<div class="vertical-alignment-helper">';
    html += '<div class="modal-dialog vertical-align-center checklistModel" id="ImgTxtModel">';
    html += '<div class="modal-content">';

    html += '<div class="modal-header">';
    html += '<button type="button" class="close crossIcon"';
		html += 'data-dismiss="modal">';
		html += '<span aria-hidden="true">&times;</span>'		
	html += '</button>';
	html += '<h4 class="modal-title text-center" id="myModalLabel">';
	if(title == "Assigned Manager"){
		html += title;
	}else{
		html += "Raised By";
	}
   
    html += '</h4>';
    html += '</div>';

    html += '<div class="modal-body popupHeight" id="requestNoBody">';//checkListPopup
	html += '<div class="bg-white" id="checkListDiv">';
	 html+='<div class="headerDiv">'
		html+='<p>'+title+' Details</p>'
	 html+='</div>'

	 html+='<div class="container-login-form-btn" id="userDetails">'
	   //First name
	    html+='<div class="form-group row addUserContainer">'
			html+='<label class="col-xs-3 control-label classTitle">First Name</label>'
			html+='<div class="col-xs-9 inputGroupContainer">'
				html+='<div class="input-group">'		   
					html+='<input  id="firstname" name="name" disabled placeholder="First Name" value="'+first_name+'" class="form-control"  type="text">'		   
				html+='</div>'
			html+='</div>'
		html+='</div>'
		
		// Last name
		html+='<div class="form-group row addUserContainer">'
		html+='<label class="col-xs-3 control-label classTitle">Last Name</label>'
		html+='<div class="col-xs-9 inputGroupContainer">'
			html+='<div class="input-group">'
			 html+='<input  id="lastName" name="lastName" disabled value="'+last_name+'" placeholder="Last Name" class="form-control"  type="text">'                                        
			html+='</div>'
		html+='</div>'
		html+='</div>'

		// Email
		html+='<div class="form-group row addUserContainer">'
		html+='<label class="col-xs-3 control-label classTitle">Email ID</label>'
		html+='<div class="col-xs-9 inputGroupContainer">'
			html+='<div class="input-group">'		
			if(email_id != undefined){
				html+='<input name="email" id="copyEmail" placeholder="E-Mail Address" value="'+email_id+'" class="form-control"  type="text" readonly>'
			}else{
				html+='<input name="email" id="copyEmail" placeholder="E-Mail Address" value="" class="form-control"  type="text" readonly>'
			}
			
			html+='<div class="input-group-addon right">'
			 html+='<a href="#" class="btn copyBtn">Copy</a>'
			html+='</div>'
		
			html+='</div>'
			
		html+='</div>'
		html+='</div>'

	 html+='</div>'

    html += '<div class="" id="descDiv">';
    html += '</div>';

    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    $('body').append(html);

    $('#raisedByModal').modal();
    $('#raisedByModal').on('hidden.bs.modal', function (e) { 
        $('body #raisedByModal').remove();
	});
	
	$('.copyBtn').click(function(){
		//Call in main.js
		copyEmailIdFun();
	});
}
//Legal list blank in dropdown
function alertScreenLegalList(msg,hrefScreen) {
    $('body #legalListModal').remove();	
	loaderRemoveFun();
	var html = '<div class="modal fade" id="legalListModal" tabindex="-1" role="dialog" aria-labelledby="legalListModal" aria-hidden="true">';
	html += '<div class="vertical-alignment-helper">';
	html += '<div class="modal-dialog vertical-align-center">';
	html += '<div class="modal-content">';
	html += '<div class="modal-header">';
    	html += '<h4 class="modal-title" id="">Notification</h4>';
	html += '</div>';
	html += '<div class="modal-body">' + msg + '</div>';
	html += '<div class="modal-footer">';
	html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="popupOkBtn">OK</button>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';

	$('body').append(html);
	$('#legalListModal').modal();
	
	$('#popupOkBtn').click(function (e) {
		$('body #legalListModal').remove();
		loaderRemoveFun();
		
	});
	$('#legalListModal').on('hidden.bs.modal', function (e) {
        loaderRemoveFun();
	});
}