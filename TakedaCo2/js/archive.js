function archiveDashboard(){   
    var hamburgerActive = 2;    
    if(window.localStorage.getItem('userType') != null){
        hamburgerList(hamburgerActive, window.localStorage.getItem('userType'));

        setDefaultDate();
        var fromDate =  $("#datepicker").val();
        var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( fromDate ) );
        
        var toDate = $("#toDatepicker").val(); 
        
        var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ) );

        window.localStorage.setItem("dashOrArchive", 2);
        var user_id = window.localStorage.getItem("user_id");

        var user_id = window.localStorage.getItem("user_id");
        var coeType = window.localStorage.getItem("userType");
    
        if(coeType == 1){   
            $('#archiveDropDown').css("display","none")     
            croWebService(fromDateNewFormat, todateNewFormat);
        }
        else if(coeType == 2){      
            // Drop drow select manager type
            selectManagerType(user_id,"archieve");            
        }
        else if(coeType == 3){
            loadLegalData(fromDateNewFormat, todateNewFormat,user_id,"archieve");
            legalName(user_id)
        }
        setDateOnSelect(user_id,"archieve");
    }else{
        location.href = "../index.html";
    }
}