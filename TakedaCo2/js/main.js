/*****Dev server URL if you run locally*****/
var serviceHTTPPath = "http://localhost:8888/TakedaCo2/api/v1/services/index.php?action=";

/*****Production server URL*****/
//var serviceHTTPPath = "https://coe.mobileprogrammingllc.com/webservices/api/v1/services/index.php?action=";


//Images Set
var highIcon = "../images/high.png";
var urgentIcon = "../images/urgent.png";
var imgAttachmentDisable = "../images/icon_attach.png";
var imgAttachment = "../images/attchmentIcon.png";
var textDisable= "../images/icon_text.png";
var textActive= "../images/icon_textsel.png";

$(document).ready(function () {	 
	// var image = new Image();
	// image.onload = function () {	
	// }	
	// image.src = "../images/splash_bg.png";
    //$('.loader').hide()
    $('[data-toggle="tooltip"]').tooltip(); 
	setTimeout(function(){		
		//$("#loginRole").css("opacity",1)
		$(".wrap-login").fadeIn();	
	}, 5000);

	pageResize();

	//Select Login type CRO or SSO
	$(".loginType a").click(function(){	
		$(".loginType a").removeClass("activeBtn");
		$(".loginType a span").removeClass("glyphicon glyphicon-ok pull-right tickIcon");
		
		
		$(this).addClass("activeBtn");
		$(".loginType a.activeBtn span").addClass("glyphicon glyphicon-ok tickIcon");	
		
		var index = $(this).index()
		if(index == 0){
			location.href = "pages/croSignIn.html";
		}
		else{
			if(serviceHTTPPath == "https://devc2.mobileprogrammingllc.com/webservices/api/v1/services/index.php?action="){
                location.href = "pages/ssoUserRoleForDev.html";
            }
            else{
                location.href = "https://coec3.takeda.com/webservices/www/Auth.php";
            }
		}
	});

    // SignUp click event
	$('.signupBtn').click(function(){	
		location.href = "pages/signUp.html";
    });

    //navbar toggle button
	$("#customIconToggle").each(function() {        
		$(this).click(function() {
            if($(this).hasClass( "active" )){
                $(this).addClass( "active" );			
                $('.logoNavDiv').hide();
                $('.sidebar-toggle').removeClass('active');                
            }else{         
                $(this).removeClass( "active" );
                $('.sidebar-toggle').addClass('active');
                $('#headerLogo').hide();
                $('.logoNavDiv').show();                            
            }
		});
	});   
    
});
function my_implode_js(separator,array){
	var temp = '';
	for(var i=0;i<array.length;i++){
		temp +=  array[i] 
		if(i!=array.length-1){
			 temp += separator; 
		}
	}//end of the for loop
    return temp;
    
}//end of the function

// Table click events
function tableClickEvents(result,hamburgerType){
    var managerType = window.localStorage.getItem('userType')
    if(hamburgerType == "archieve"){
        managerType = 4;
    }
    /*****Request number click event start here*****/ 
    $('#example1 tbody').on('click', '.requestNo', function (e) {      
        var request_id = $(this).attr('id');
        var request_number = $(this).children('a').attr('id');
        var escalationTypeId = $(this).children('span').attr('id');

        var icfType = $(this).children('span').attr('class')
        //alert(request_id +"--"+request_number+"-"+escalationTypeId)
        //alert(escalationTypeId)
        loaderLogin();
        if(icfType == undefined){ 
            $.ajax({
                url: serviceHTTPPath + "listIssuesTypes",
                type: "POST",
                headers: {
                    "authorization": window.localStorage.getItem("token_id")
                },
                data: {
                    form_id: escalationTypeId
                },
                dataType: 'json',
                success: function (resultIssueType) {
                 //alert("success="+JSON.stringify(resultIssueType))               
                    if(resultIssueType.json_data.response == 1){
                        $.ajax({
                            url: serviceHTTPPath + "listEscalation",
                            type: "GET",
                            dataType: 'json',
                            headers: {
                                "authorization": window.localStorage.getItem("token_id")
                            },
                            success: function (escalationResult) {  
                            //alert("success="+JSON.stringify(escalationResult))  
                                loaderRemoveFun(); 
                                //Call in js/croDashboard.js
                                requestNoPopup(request_id, escalationTypeId, result, escalationResult, request_number,resultIssueType, managerType,hamburgerType);
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
        }else{           
            $.ajax({
                url: serviceHTTPPath + "listEscalation",
                type: "GET",
                dataType: 'json',
                headers: {
                    "authorization": window.localStorage.getItem("token_id")
                },
                success: function (escalationResult) {  
                //alert("success="+JSON.stringify(escalationResult))  
                    loaderRemoveFun(); 
                    var resultIssueType = 0;
                    //Call in js/croDashboard.js
                    requestNoPopup(request_id, escalationTypeId, result, escalationResult, request_number,resultIssueType, managerType,hamburgerType);
                },
                error: function (e) {
                    loaderRemoveFun();
                    return;
                }
            });   
        }

    });

    /*****AttachmentIcon click event start here*****/
    $('#example1 tbody').on('click', '.imgIcon', function (e) {
        var request_id = $(this).attr('id');
        var img_id = $(this).children('img').attr('id');

        loaderLogin();
        var attachmentIds = 0;
        var counter = 0;

        for (var j = 0; j < result.json_data.response.data.length; j++) {
            if (result.json_data.response.data[j].request_number == img_id) {
                if (result.json_data.response.data[j].request_id == request_id) {
                    counter = counter + 1;

                    if (counter == 1) {

                        attachmentIds = result.json_data.response.data[j].manager_attach_list.replace(/^,|,$/g, '');

                        if (result.json_data.response.data[j].legal_attach_list != '' || result.json_data.response.data[j].legal_attach_list != 0) {
                            attachmentIds = attachmentIds + ',' + result.json_data.response.data[j].legal_attach_list.replace(/^,|,$/g, '');
                        }
                    }
                    else {
                        if (result.json_data.response.data[j].manager_attach_list != '' || result.json_data.response.data[j].manager_attach_list != 0) {
                            attachmentIds = attachmentIds + ',' + result.json_data.response.data[j].manager_attach_list.replace(/^,|,$/g, '');
                            if (result.json_data.response.data[j].legal_attach_list != '') {
                                attachmentIds = attachmentIds + ',' + result.json_data.response.data[j].legal_attach_list.replace(/^,|,$/g, '');
                            }
                        }
                        else {
                            if (result.json_data.response.data[j].legal_attach_list != '' || result.json_data.response.data[j].legal_attach_list != 0) {
                                attachmentIds = attachmentIds + ',' + result.json_data.response.data[j].legal_attach_list.replace(/^,|,$/g, '');
                            }
                        }
                    }
                }
            }

            if (j == result.json_data.response.data.length - 1) {
                attachmentIds = attachmentIds.replace(/[ ,]+/g, ",").replace(/^0+/, '').replace(/^,|,$/g, '');
                var msg = "Attachments";
                //Call in js/croDashboard.js
                attachCRORequestImg(attachmentIds, msg);
            }
        }
    });
    /*****AttachmentIcon click event end here*****/

    /*****Description text click event start here*****/
    $('#example1 tbody').on('click', '.txtBtn', function (e) {
        var request_id = $(this).attr('id');
        var txt_id = $(this).children('img.txt_ActiveIcon').attr('id');       
        var managerActionDesc = '';
        var counter = 0;
        var arr = new Array();
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
                var msg = "Description";
                 //Call in js/croDashboard.js
                croDescFun(managerActionDesc, msg);
            }
        }
    });
    /*****Description text click event end here*****/    

    /*****AttachmentIcon click event start here*****/   
    $('#example1 tbody').on('click', '.imgLegalIcon', function (e) {
        var request_id = $(this).attr('id');
        var img_id = $(this).children('img').attr('id');
        loaderLogin();
        var attachmentIds = 0;
        var counter = 0;
        for (var j = 0; j < result.json_data.response.data.length; j++) {
            if (result.json_data.response.data[j].request_number == img_id) {
                if (result.json_data.response.data[j].request_id == request_id) {
                    counter = counter + 1;

                    if (counter == 1) {
                        attachmentIds = result.json_data.response.data[j].legal_attach_list.replace(/^,|,$/g, '');
                    }
                    else {
                        if (result.json_data.response.data[j].legal_attach_list != 0) {
                            attachmentIds = attachmentIds + ',' + result.json_data.response.data[j].legal_attach_list.replace(/^,|,$/g, '');
                        }
                    }
                }
            }

            if (j == result.json_data.response.data.length - 1) {
                attachmentIds = attachmentIds.replace(/[ ,]+/g, ",").replace(/^0+/, '').replace(/^,|,$/g, '');
                var msg = "Attachments by Legal";
                attachCRORequestImg(attachmentIds, msg);
            }
        }
    });
    /*****AttachmentIcon click event end here*****/

    /*****Description text click event start here*****/    
    $('#example1 tbody').on('click', '.txtLegalBtn', function (e) {
        var request_id = $(this).attr('id');
        var txt_id = $(this).children('img.txt_ActiveIcon').attr('id');
        var managerActionDesc = '';
        var counter = 0;
        for (var j = 0; j < result.json_data.response.data.length; j++) {
            //alert(result.json_data.response.data[j].legal_action_desc)           
            
            if (result.json_data.response.data[j].request_number == txt_id) {
                if (result.json_data.response.data[j].request_id == request_id) {
                    counter = counter + 1;
                    if (counter == 1) {
                        managerActionDesc = result.json_data.response.data[j].legal_action_desc;
                    }
                    else {
                        if (result.json_data.response.data[j].legal_action_desc != '') {
                            managerActionDesc = managerActionDesc + ',' + result.json_data.response.data[j].legal_action_desc;
                        }
                    }
                }
            }

            if (j == result.json_data.response.data.length - 1) {
                var msg = "Description by Legal";
                croDescFun(managerActionDesc, msg);
            }
        }
    });
    /*****Description text click event end here*****/

}
function passwordEyeFunction() {
    var x = document.getElementById("userPw");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
// Table set
function dataTableSet(userType){   
    var height = $(window).height();
    var windowHeight = $(window).innerHeight();
    
    var headerHeight;  
    var setTableHeight;
    var setOrder=0;
    var ascDesOrder="desc";
    if(userType == 1){
        setOrder = 2;
        headerHeight = $('.calendarDiv').height()+$('.main-header').height()+$('.main-footer').height()+135;
    }
    else if(userType == 4){
        headerTab =$('.main-header').height()+$('.addLegalICFBtn').height()+$('.budgetFormHeader').height();       
        headerHeight = headerTab+parseInt($('.navTabDiv').height())+$('.main-footer').height()+135;     
    }
    else{
        headerHeight = $('.calendarDiv').height()+$('.main-header').height()+$('.main-footer').height()+135; 
    }

    setTableHeight = height - headerHeight;
    if(userType == 3){
        setTableHeight = height - headerHeight-90;
    }
    
    var table = $('#example1').DataTable({
        columnDefs: [
         { type: 'num-html', targets: 0 }
        ] ,        
        "scrollX": true,
        "fixedColumns": true,
        "fixedHeader": true,       
        "bJQueryUI": true,
        "bAutoWidth": true,        
        "scrollCollapse": true,
        "scrollY":setTableHeight,
        'responsive': true,
        "autoWidth": true,
        "scrollCollapse": true,
        "paging": true,
        "lengthChange": false,    
        "order": [[ setOrder, ascDesOrder ]], 
        "searching" : true,
        "bFilter": true,        
        "language": {
          "search": "_INPUT_",
          "searchPlaceholder": "Search..."
      },       
    });
    
    //Search Filter  
    var table = $('#example1').DataTable();
    if($('#searchbox').val() != undefined){
      table.search($('#searchbox').val()).draw();
    }
    
    $('#searchbox').on('keyup change', function () {
        table.search(this.value).draw();
    });
    $(window).resize(function() {      
        height = $(window).height();
        windowHeight = $(window).innerHeight();        
       
        if(userType == 1){
            setOrder=2;
            headerHeight = $('.calendarDiv').height()+$('.main-header').height()+$('.main-footer').height()+135; 
        }
        else if(userType == 4){
            headerTab =$('.main-header').height()+$('.addLegalICFBtn').height()+$('.budgetFormHeader').height();       
            headerHeight = headerTab+parseInt($('.navTabDiv').height())+$('.main-footer').height()+135;     
        }
        else{
            headerHeight = $('.calendarDiv').height()+$('.main-header').height()+$('.main-footer').height()+135; 
        }
        setTableHeight = height - headerHeight;
        if(userType == 3){
            setTableHeight = height - headerHeight-100;
        }
       
        $('#example1').closest('.dataTables_scrollBody').css('height', setTableHeight+"px");      
        $('#example1').DataTable().draw();      
      });     
}

// Page height adjust according to screen height start here
function pageResize() {  
	function setHeight() {
		var height = $(window).height();
		var windowHeight = $(window).innerHeight();
		
		var footerHeight = $('.bottomDiv').height()+$('#spashHeader').height()+5;
		$('#centerBGImg').css('height', height - footerHeight);
		$('#centerBGImg').css('min-height', windowHeight - footerHeight);
		$('#centerBGImg img').css('height', height - footerHeight);
		$('#centerBGImg img').css('min-height', windowHeight - footerHeight);	

		var minusHeight = parseInt($('.navbar').height())+parseInt($('thead').height())+74
		var theadHeight = $('thead').height();
		$('.tbodyContainer').css('min-height', height-minusHeight);
        $('.tbodyContainer').css('height', height-minusHeight);

        $('.content-wrapper').css('margin-top', $('.main-header').height());
        $('#formContainer').css('margin-top', $('.main-header').height()+$('.budgetFormHeader').height());
	}
	setHeight();

	$(window).resize(function () {
        setHeight();
	});
}

/*****Preloader start here*****/
function loaderLogin() {   
	$('body .loader').remove();
	var loader = '<div class="loader"></div>';
	$('body').append(loader);

	//$('.loader').css("margin-top", 250);

	$('.bgForLoader').remove();
	var _loader = '<div class="bgForLoader"></div>';
    $('body').append(_loader);   
   
	$('.bgForLoader').height( $('html').height());
}

function loaderRemoveFun() {
	$('body .loader').remove();
	$('.bgForLoader').remove();
}
/*****Preloader end here*****/

function isNumberKey(evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57))
		return false;
	return true;
}
// Date calender controler function
function setDefaultDate(){
    var currentDate = new Date();
	$.fn.datepicker.defaults.format = "mm/dd/yyyy";
	
	//To Date picker
	$('#datepicker').datepicker({
		autoclose: true,
		minDate: '-3M',
	})
	//.on('changeDate', dateChanged);
	
	var beforeFourMonth = new Date();
	beforeFourMonth.setMonth(beforeFourMonth.getMonth() - 4, beforeFourMonth.getDate());
	
	$("#datepicker").datepicker("setDate", beforeFourMonth);
	
	//From Date picker
	$('#toDatepicker').datepicker({
		autoclose: true,
	})
	//.on('changeDate', toDateChanged);

    $("#toDatepicker").datepicker("setDate", currentDate);
    
    $('.fromDateDiv .fa-calendar').click(function() {
        $("#datepicker").focus();
    });
    $('.toDateDiv .fa-calendar').click(function() {
        $("#toDatepicker").focus();
    });
}
function setDateOnSelect(user_id,hamburgerType){	
    //To Date picker   
	$('#datepicker').datepicker({
		autoclose: true,
		minDate: '-3M',
	})
	.on('changeDate',function(event) {
        dateChanged(event,user_id,hamburgerType)
    });	
	
    //From Date picker
	$('#toDatepicker').datepicker({
		autoclose: true,
	})
	.on('changeDate',function(event) {
        toDateChanged(event,user_id,hamburgerType)
    });	
}
function dateChanged(ev,user_id,hamburgerType){
    var fromDate = $("#datepicker").val(); 
    var fromdateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( fromDate ) );

    var toDate = $("#toDatepicker").val(); 
    var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ) );
	

    if (fromdateNewFormat > todateNewFormat) {
		var beforeFourMonth = new Date();
        beforeFourMonth.setMonth(beforeFourMonth.getMonth() - 4, beforeFourMonth.getDate());
		$("#datepicker").datepicker("setDate", beforeFourMonth);

        var msg = "Please select the correct date range.";//next date."
        alertScreen(msg,"");
    }
    else {	       
        manageDate(fromdateNewFormat,todateNewFormat,hamburgerType,user_id);
    }   
}
function manageDate(fromdateNewFormat,todateNewFormat,hamburgerType,user_id){
    if(hamburgerType == "graphs"){
        var analatics = window.localStorage.getItem("analatics");
        var userId = $('#pieChartUser').val();
        var userType = $('#managerDiv').val();
       
        if(userType == undefined){
            userType = $('#managersRole').val();
        }     
        //barChartAllIndividual Bar chart drop downa        
        if($('#barChartAllIndividual').val() == "All"){            
           //pieChartUser Pie chart drop down           
           if($('#pieChartUser').val() == "All"){    
                if($('#tabBarAnalatics li.active a').attr('class') == "Region" || $('#tabBarAnalatics li.active a').attr('class') == "Protocol"){
                    userType=3;
                }                
               numberOfIssues(analatics,userType,"pieChart");
           }else{               
               if($('#tabBarAnalatics li.active a').attr('class') == "Region" || $('#tabBarAnalatics li.active a').attr('class') == "Protocol"){
                    // Region and Protocol for All            
                    regionDashboard(userId,analatics,"pieChart");
               }else{                   
                   if(userType == 3){                      
                        numberOfIssues(analatics,userType,"pieChart");
                    }else{
                        // Call for particular user graph
                        issueTrendPersonWebService(userId,analatics,userType,"pieChart");
                    }
               }                
           }
       }else{           
            if($('#tabBarAnalatics li.active a').attr('class') == "Region" || $('#tabBarAnalatics li.active a').attr('class') == "Protocol"){
                // Region and Protocol for All                    
                regionDashboard(userId,analatics,"pieChart");
            }else{               
                //Call for particular user graph        
                if($('#pieChartUser').val() == "All"){
                    numberOfIssues(analatics,userType,"pieChart");
                }else{
                    if(userType == 3){                       
                        if($('#managerDiv').val() == 3){
                            numberOfIssues(analatics,userType,"pieChart");
                        }else{
                            croDashboard(userId,userType,analatics);
                        }                   
                        
                    }else{
                        issueTrendPersonWebService(userId,analatics,userType,"pieChart");
                    }        
                }             
                barTypeUsers(userType,analatics);
            }            
       }
    }else{
        if(hamburgerType == "reassigned"){            
            var coeType = window.localStorage.getItem("userType");
            if(window.localStorage.getItem("userType") == 2){
                reassignedWebService(fromdateNewFormat,todateNewFormat,$('#managerDiv').val(),hamburgerType)
            }else{
                reassignedWebService(fromdateNewFormat,todateNewFormat,$('.managerName').attr('id'),hamburgerType)
            }
        }else{
            if(window.localStorage.getItem("userType") == 1){
                croWebService(fromdateNewFormat, todateNewFormat);
            }
            else if(window.localStorage.getItem("userType") == 2){                
                escalationMService(fromdateNewFormat, todateNewFormat,$('#managerDiv').val(),hamburgerType);
            }
            else if(window.localStorage.getItem("userType") == 3){
                loadLegalData(fromdateNewFormat, todateNewFormat,user_id,hamburgerType);
            }
        }
    }    
}
function toDateChanged(ev,user_id,hamburgerType){
    var fromDate = $("#datepicker").val();
    var fromdateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( fromDate ) );

    var toDate = $("#toDatepicker").val(); 
    var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ) );
	
	var currentDate = new Date();
    if (fromdateNewFormat >= todateNewFormat) {		   
		currentDate.setMonth(currentDate.getMonth(), currentDate.getDate());
		$("#toDatepicker").datepicker("setDate", currentDate);
        alertScreen("Please select the correct date range.","");
    }
    else {		
		var currenrDateFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( currentDate ) );
		
		if(todateNewFormat > currenrDateFormat){
			currentDate.setMonth(currentDate.getMonth(), currentDate.getDate());
		    $("#toDatepicker").datepicker("setDate", currentDate);
			alertScreen("Please select the correct date range.","");
		}
		else{            
            manageDate(fromdateNewFormat,todateNewFormat,hamburgerType,user_id);
		}		 
    }   
}
/*****Forgot popup with fuctionality start here*****/
function forgotPasswordFun() {
	$('#myModal').remove();
	$('.modal-backdrop').remove();	
	var html = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
	html += '<div class="vertical-alignment-helper">';
	html += '<div class="modal-dialog vertical-align-center">';
	html += '<div class="modal-content">';

	html += '<div class="modal-header">';
	html += '<button type="button" class="close crossIcon"';
		html += 'data-dismiss="modal">';
		html += '<span aria-hidden="true">&times;</span>'
	html += '</button>';
	html += '<h4 class="modal-title" id="">';
    	html += 'Forgot Password?';
	html += '</h4>';
	html += '</div>';
	html += '<div class="modal-body">';
	html += '<form class="form-horizontal forgot-form validate-form" action="" method="post" id="forgot-form" novalidate>';

	html += '<div class="form-group row">'
		html += '<div class="col-xs-12">'
			html += ' <div class="input-group">'
			 html += '<input name="email" id="forgotEmail" placeholder="Email Id" class="form-control"  type="text">'
			html += '</div>'
		html += '</div>'
	html += '</div>'		

	//  Button
	html += '<div class="form-group row">'
		html += '<div class="col-xs-12">'
			html += '<div class="submitBtnDiv wrap-login-form-btn">'				
				html += '<button type="submit" class="btn btn-default" id="popupOkBtn">Send</button>';
			html += '</div>'
		html += '</div>'
	html += '</div>'

	html += '</form>'

	html += '</div>';
	html += '<div class="modal-footer">';	
	 
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


	$('#forgot-form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {                
                email: {
                    validators: {
                        notEmpty: {
                            message: 'Please enter your email id'
                        },
                        emailAddress: {
                            message: 'Please enter a valid Email Address'
                        }
                    }
                },                
            }
        })
        .on('success.form.bv', function(e) {
            $('#success_message').slideDown({ opacity: "show" }, "slow")            
            // Do something ...
            $('#forgot-form').data('bootstrapValidator').resetForm();
    
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
			var emailVal = getValue("email");    
			forgotPasswordEmail(emailVal);
        });
    // fogot fun validation end here
}
// Email validator function
function ValidateEmail(email) {
	var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	return re.test(email);
}

function forgotPasswordEmail(emailVal) {
	loaderLogin();
	$.ajax({
		url: serviceHTTPPath + "forgotPassword",
		type: "POST",
		dataType: 'json',
		headers: {
			"authorization": window.localStorage.getItem("token_id")
		},
		data: {
			email: emailVal
		},
		success: function (result) {
			//alert("success"+JSON.stringify(result))
			loaderRemoveFun();
			$('#myModal').remove();
	        $('.modal-backdrop').remove();
			
			var msg = JSON.stringify(result.json_data.message);
			var msgVal = msg.replace(/['"]+/g, '');
			
			alertScreen(msgVal,'')
		},
		error: function (e) {
			loaderRemoveFun();
			return;
		}
	});
}
/*****Forgot popup with fuctionality end here*****/

//Get data from URL
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

// Copy Email id
function copyEmailIdFun() {
    /* Get the text field */
    var copyText = document.getElementById("copyEmail");
  
    /* Select the text field */
    copyText.select();
  
    /* Copy the text inside the text field */
    document.execCommand("copy");
  
    /* Alert the copied text */
  }
