function icfFormOptions(){
    var hamburgerActive = 1;   
    if(window.localStorage.getItem('userType') != null){  
        hamburgerList(hamburgerActive, window.localStorage.getItem('userType'));

        createOptionsType();
    }else{
        location.href = "../index.html";
    }
}
function createOptionsType(){
    loaderLogin();
     /*****ListEscalation webservice call start here*****/
     $.ajax({
        url: serviceHTTPPath + "listEscalation",
        type: "GET",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
        success: function (result) {
            //alert("success="+JSON.stringify(result))
            loaderRemoveFun();
            if(result.json_data.response == 5 || result.json_data.response == 6){
                location.href = "../index.html";
            }else{
                icfformOption(result);
            }
        },
        error: function (e) {
            loaderRemoveFun()
            return;
        }
    });
    /*****ListEscalation webservice call end here*****/
}
function icfformOption(result){
    var index;
    $('.chooseDiv a').remove();
    for (var i = 0; i < result.json_data.response[3].sub_types.length; i++) {
        var html="<a href='#' class='btn btn-block btn-lg btn-default grey croBtn'>"+result.json_data.response[3].sub_types[i].subname+"<span class=''></span></a>";
        $('.chooseDiv').append(html);
    }   
    
    $(".chooseDiv a").click(function(){	
        $('.proceedBtn').css("display","block");
		$(".chooseDiv a").removeClass("activeBtn");
		$(".chooseDiv a span").removeClass("glyphicon glyphicon-ok pull-right");
		
		$(this).addClass("activeBtn");
		$(".chooseDiv a.activeBtn span").addClass("glyphicon glyphicon-ok pull-right");	
		
        index = $(this).index();
    });
    
    var formTypeArr = new Array("globalMaster.html","countryLevel.html","siteLevel.html");
    $('.proceedBtn').click(function(){       
        if(index !=='' && index !== undefined){           
            location.href=formTypeArr[index];
        }	
    });
}