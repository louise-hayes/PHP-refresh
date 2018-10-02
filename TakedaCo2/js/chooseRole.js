function chooseRoles(){
    var roleTypeArr = new Array("Escalation Manager","Legal/Compliance Manager","Management");
    var _token = getQueryVariable("token");
    if(_token != null){
        //getQueryVariable function call in js/main.js        
        validateToken(_token);
    }else{
        location.href = "../index.html";
    }
}
function validateToken(_token){
    loaderLogin();
    $.ajax({
		url: serviceHTTPPath + "validateToken",
		type: "POST",
		dataType: 'json',
		headers: {
            "authorization": _token
        },
		success: function (result) {
            //alert("success="+JSON.stringify(result))
            if(result.json_data.response == 4 || result.json_data.response == 5 || result.json_data.response == 6){
                location.href = "../index.html";
            }else{
                loaderRemoveFun();
                window.localStorage.setItem("token_id", _token);            
                window.localStorage.setItem("user_name", result.json_data.response[0].first_name+" "+result.json_data.response[0].last_name);
                window.localStorage.setItem('userType',result.json_data.response[0].user_type);
                window.localStorage.setItem("user_id", result.json_data.response[0].user_id);	
            
                if(result.json_data.response == null){
                    var msg="Currently you are disabled from all roles."
                    alertScreen(msg,"../index.html");     
                }else{
                    attachRoles(result)	
                }
            }
            
        },
		error: function (e) {
			loaderRemoveFun();
			return;
		}
	});	
}
function attachRoles(result){    
    var pagesArr = new Array("EMDashboard.html","LMDashboard.html","userManagement.html")
    var pagesArrId = new Array(2,3,4)
    var flag = false;
    $('.chooseDiv a').remove();   
    
        var count=0;
        for(var i=0;i<result.json_data.response.length;i++){
            if(result.json_data.response[i].is_enabled == 1){               
                flag = true;
                count+=1;
                
                var html="<a href='#' class='btn btn-block btn-lg btn-default grey croBtn' id='"+result.json_data.response[i].user_type+"'>"+result.json_data.response[i].user_type_name+"<span class=''></span></a>";
                $('.chooseDiv').append(html);
                if(result.json_data.response[i].user_type == 4){
                    window.localStorage.setItem("is_active", result.json_data.response[i].is_active);                 
                }
            }        
            if(i == result.json_data.response.length-1){
                if(flag == false){               
                    var msg="Currently you are disabled from all roles."
                    alertScreen(msg,"../index.html");             
                }else{                   
                    if(count == 1){
                        //If only one user role
                        for(var p=0;p<pagesArrId.length;p++){
                            if(pagesArrId[p] == $(".chooseDiv a").attr('id')){
                                location.href=pagesArr[p];
                            }
                        }
                    }else{
                        $('.chooseRoleDiv').css("display","block")
                    }
                }            
            }
        }
 
    

    $(".chooseDiv a").click(function(){	
		$(".chooseDiv a").removeClass("activeBtn");
		$(".chooseDiv a span").removeClass("glyphicon glyphicon-ok pull-right");
		
		$(this).addClass("activeBtn");
		$(".chooseDiv a.activeBtn span").addClass("glyphicon glyphicon-ok pull-right");		
        
        var user_type = $(this).attr('id')
       
        window.localStorage.setItem('userType',user_type);
        if(user_type == 2){
            location.href=pagesArr[0];
        }else if(user_type == 3){
            location.href=pagesArr[1];
        }
        else if(user_type == 4){
            location.href=pagesArr[2];
        }
    });
}