function chooseFormType(){
    var hamburgerActive = 1;
    if(window.localStorage.getItem('userType') != null){      
        hamburgerList(hamburgerActive, window.localStorage.getItem('userType'));

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
                if(result.json_data.response == 4 || result.json_data.response == 5 || result.json_data.response == 6){
                    location.href = "../index.html";
                }else{ 
                    listEscalationArr = result;
                    formOption(result);
                }
            },
            error: function (e) {
                loaderRemoveFun();
                return;
            }
        });
        /*****ListEscalation webservice call end here*****/
    }else{
        location.href = "../index.html";
    }
}

function formOption(result){
    var index;
    $('.chooseDiv a').remove();
    for(var i=0;i<result.json_data.response.length;i++){
        if(i !=2){
            var html="<a href='#' class='btn btn-block btn-lg btn-default grey croBtn'>"+result.json_data.response[i].name+"<span class=''></span></a>";
            $('.chooseDiv').append(html);
        }        
    }   
    
	window.localStorage.setItem("listEscalation", result.json_data.response[0].type_id);
    $(".chooseDiv a").click(function(){	
        $('.proceedBtn').css("display","block");
		$(".chooseDiv a").removeClass("activeBtn");
		$(".chooseDiv a span").removeClass("glyphicon glyphicon-ok pull-right");
		
		$(this).addClass("activeBtn");
		$(".chooseDiv a.activeBtn span").addClass("glyphicon glyphicon-ok pull-right");	
		
        index = $(this).index();
		var listEscalation = result.json_data.response[index].type_id;
		window.localStorage.setItem("listEscalation", listEscalation);
    });
    
    var formTypeArr = new Array("budgetForm.html","contractForm.html","ICFFormTypes.html");
    $('.proceedBtn').click(function(){       
        if(index !=='' && index !== undefined){           
            location.href=formTypeArr[index];
        }	
    });
}