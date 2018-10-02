function ssoUserRoles() {
	$('.loader').show();
	//UserRoles web service call start here
	$.ajax({
		url: serviceHTTPPath + "userRoles",
		type: "GET",
		dataType: 'json',
		success: function (result) {
			//alert("success="+JSON.stringify(result))		
            $('.loader').hide();
            attachUserRolesBtns(result);
		},
		error: function (e) {
			$('.loader').hide();
			return;
		}
	});
	//UserRoles web service call end here
}
// UserRoles Button Attached Function
function attachUserRolesBtns(result){
    if(result.json_data.response.length != 0){
        $('.ssoRoleBtns a').remove()       
        for (var i = 0; i < result.json_data.response.length; i++) {
            if (i != 0){
                var html = '<a href="#" id="' + i + '" class="btn btn-block btn-lg btn-default grey croBtn">' + result.json_data.response[i].name + '<span class=""></span></a>';
                $('.ssoRoleBtns').append(html)  
            }          
        }

        //Select UserRole For SSO Login
        $(".ssoRoleBtns a").click(function(){	
            $(".ssoRoleBtns a").removeClass("activeBtn");
            $(".ssoRoleBtns a span").removeClass("glyphicon glyphicon-ok pull-right");
            
            
            $(this).addClass("activeBtn");
            $(".ssoRoleBtns a.activeBtn span").addClass("glyphicon glyphicon-ok pull-right");
            
            var index = $(this).index()            
        });

    }
}
