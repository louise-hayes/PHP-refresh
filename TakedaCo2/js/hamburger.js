function hamburgerList(selectedTab,userType){
    var hamburgerListArr;
    var pageArr;
    var hamburger_iconArr;

   
    //User Name on top right side
    $(".user-menu .userName").text(window.localStorage.getItem("user_name"));

    if(userType == 1){        
        hamburgerListArr = new Array("Dashboard","Raise New Request","Archive","Logout");
        pageArr = new Array("croDashboard.html","chooseFormType.html","archive.html","index.html");
        hamburger_iconArr= new Array("dashboard_icon.png","newRequest_icon.png","Archiev_icon.png","logout.png");
    }
    else if(userType == 2){
        hamburgerListArr = new Array("Dashboard","Reassigned","Archive","Logout");
        pageArr = new Array("EMDashboard.html","reassigned.html","archive.html","index.html");
        hamburger_iconArr= new Array("dashboard_icon.png","reassigned.png","Archiev_icon.png","logout.png");
    }
    else if(userType == 3){
        hamburgerListArr = new Array("Dashboard","Reassigned","Archive","Logout");
        pageArr = new Array("LMDashboard.html","reassigned.html","archive.html","index.html");
        hamburger_iconArr= new Array("dashboard_icon.png","reassigned.png","Archiev_icon.png","logout.png");
    }
    else if(userType == 4){
        hamburgerListArr = new Array("Dashboard","User Management","Logout");
        pageArr = new Array("analyticsGraphs.html","userManagement.html","index.html");
        hamburger_iconArr= new Array("dashboard_icon.png","user_manager.png","logout.png");
    }
    $('.sidebar-menu li').remove();
    var activeTag="";   
    
    for(var i=0;i<hamburgerListArr.length;i++){
        if(selectedTab == i){
            activeTag= "active";
        }
        else{
            activeTag = '';
        }
            
            var html='<li class="'+activeTag+' treeview nav'+i+'" id="'+hamburgerListArr[i]+'">';
                html+='<a href="#">';
                html+='<i class="fa"><img class="img-responsive attach_Icon" id="332" src="../images/'+hamburger_iconArr[i]+'"></i> <span>'+hamburgerListArr[i]+'</span>';
                html+='</a>';
            html+='</li>';
        
        $('.sidebar-menu').append(html);

       
            if(window.localStorage.getItem("is_active") == 0){
                if(hamburgerListArr[i] == "Raise New Request")
                {  
                    $('.nav'+i).addClass("disabled");
                }
            }            
       
    }
    
    $('.sidebar-menu li').click(function(event){
        //remove all pre-existing active classes
        $('.active').removeClass('active');
        var index= $(this).index();
       
        $('.arrowBtn').remove();
        loaderLogin();
       
        if(hamburgerListArr[index] == "Logout"){
            localStorage.clear();
			location.href = "../"+pageArr[index];
        }
        else{ 
            location.href = pageArr[index];
        }
        //add the active class to the link we clicked
        $(this).addClass('active'); 
        event.preventDefault();
    });
}

/*****Logout click event start here*****/
function calltoLogoutService(pagePath) {
	/*****UserLogout webservice call start here*****/
	loaderLogin();
	$.ajax({
		url: serviceHTTPPath + "userLogout",
		type: "GET",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        },
		success: function (result) {
			//alert("success="+JSON.stringify(result))
			loaderRemoveFun();
			localStorage.clear();
			location.href = "../"+pagePath;
		},
		error: function (e) {
			return;
		}
	});
	/*****UserLogout webservice call end here*****/
}
/*****Logout click event end here*****/