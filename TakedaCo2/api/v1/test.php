<?php
$server_path = "https://" . $_SERVER['HTTP_HOST'] . "/webservices";
?>
<html>
    <title>Takeda COE Test Page</title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <style>
        body{
            font-family:arial;
        }
        #api{
            text-align: left;font-size: 27px;
            padding-top: 30px;
        }
    </style>
    <body>
        <div style="
             text-align: center;
             font-size: 27px;
             padding-top: 16px;
             height: 65px;
             ">Takeda COE C2 Test Page</div>
        <p>Request Type : POST<br/>
        <hr>

        <div style="background:#d3d3d3">
            <p id="api">1. Register User: <font color="red">[<u>On swagger</u>]</font></p>
            <p>Parameters : first_name, last_name, email, user_type, password, country, phone, status, esc_type_id, esc_sub_type_id, analatics, user_management, budgetDirect, contractDirect<br/>
                Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=registerUser</p>
            <form action="services/index.php?action=registerUser" method="post">
                First Name : <input type='text' name='first_name' >*<br/>
                Last Name : <input type='text' name='last_name' >*<br/>
                Email :<input type='text' name='email' >*<br/>
                User Type :<input type='text' name='user_type' >*<br/>
                ---------------------------------------------------<br>
                Escalation Type ID :<input type='text' name='esc_type_id' >*  eg. 1,2,3 (comma separate value if none then send 0)<br/>
                ICF Sub Category ID :<input type='text' name='esc_sub_type_id' >*  eg. 1,2,3 (comma separate value if none then send 0)<br/>
                -----------------------------------------------------<br>
                Password :<input type='text' name='password' >*<br/>
                Country :<input type='text' name='country' >*<br/>
                Phone :<input type='text' name='phone' >*<br/>
                Status :<input type='text' name='status' >*<br/>
                <br/><br/>--------------------IF MANAGEMENT USER----------------------<br><br/>
                Analatics :<input type='text' name='analatics' >* eg. 1,2,3<br/>
                User Management :<input type='text' name='user_management' >* eg. 1,2,3<br/>
                <br/><br/>--------------------IF LEGAL USER----------------------<br><br/>
                Direct Assign Budget Request  :<input type='text' name='budgetDirect' >* eg. 1=>Yes, 0=>No<br/>
                Direct Assign Contract Request :<input type='text' name='contractDirect' >* eg. 1=>Yes, 0=>No<br/>
                
                </span> <input type="submit" style="
                               color: #EE2424;
                               border-radius: 20px;
                               "/>
            </form>
        </div>





        <div style="background:#d3d3d3">    
            
            <p id="api">2. CRO Authenticate User <font color="red">[<u>On swagger</u>]</font></p>
            Parameters  : email, password, type_id<br/>
            Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=authenticateUser</p>
       
        
        <form action="services/index.php?action=authenticateUser" method="post">

            Email: <input type='text' name='email' >*<br/>
            Password :<input type='text' name='password' >*<br/>
            User Role ID :<input type='text' name='type_id' >*<br/>
            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>
        
        
     
        
     <div style="background:#d3d3d3">    
            
            <p id="api">2.1. SSO Authenticate User</p>
            Parameters  : email, password<br/>
            Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=authenticateSso</p>
       
        
        <form action="services/index.php?action=authenticateSso" method="post">

            Email: <input type='text' name='email' >*<br/>
            Password :<input type='text' name='password' >*<br/>
            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>





    <div>    
        
        <p id="api">3. List of Escalations Type <font color="red">[Required <u>authorization</u> token in header]</font></p>
        <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=listEscalation</p>
        <form action="services/index.php?action=listEscalation" method="post">
            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>




    <div>    
        
        <p id="api">4. Add Protocol <font color="red">[Required <u>authorization</u> token in header]</font></p>
        Parameters  : protocol_name<br/>
        <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=addProtocol</p>
        <form action="services/index.php?action=addProtocol" method="post">
            Protocol Name: <input type='text' name='protocol_name' >*<br/>
            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>



    <div>    
        
        <p id="api">5. List of Protocols <font color="red">[Required <u>authorization</u> token in header]</font></p>
        Parameters  : protocol_name <br/>
        <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=listProtocols</p>
        <form action="services/index.php?action=listProtocols" method="post">
            Protocol Name: <input type='text' name='protocol_name' >*<br/>
            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>



    <div>    
        
        <p id="api">6. Delete Protocols <font color="red">[Required <u>authorization</u> token in header]</font></p>
        Parameters  : protocol_id<br/>
        <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=deleteProtocol</p>
        <form action="services/index.php?action=deleteProtocol" method="post">
            Protocol ID: <input type='text' name='protocol_id' >*<br/>
            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>


    <div>    
        
        <p id="api">7. Country List <font color="red">[<u>On swagger</u>]</font></p>
        Parameters  : region_id<br/>
        <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=listCountry</p>
        <form action="services/index.php?action=listCountry" method="post">
            Region ID: <input type='text' name='region_id' >*<br/>
            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>


    <div>    
        
        <p id="api">8. Save Budget Escalation   <font color="red">[Required <u>authorization</u> token in header]</font> </p>
        Parameters  : user_id, escalation_type_id, protocol_id,sitename,country, raised_by, principle_investigator, requested_by, followUp (1=>yes, 0=>no), esc_id (if follow up yes then send escalation manager id), choose_issue,desc_issue,site_request,initial_offer,percent_over_initial,fmv_high,percent_over_fmv
        ,site_justification,anyother_details,do_add_attachment,request_id,attachment_file_ids,currency_type, highPriority(0=>no, 1=>yes),  selectPriority(0=>no selection, 1=>urgent within 24 hours, 2=>urgent within 48 hours), priorityReason, cc_email<br/>
        <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=saveBudgetEscalation</p>
        <form action="services/index.php?action=saveBudgetEscalation" method="post">
            User ID: <input type='text' name='user_id' >*<br/>
            Escalation Type ID: <input type='text' name='escalation_type_id' >*<br/>
            Protocol ID: <input type='text' name='protocol_id' >*<br/>
            Sitename: <input type='text' name='sitename' >*<br/>
            Country :<input type='text' name='country' >*<br/>

            Raised BY :<input type='text' name='raised_by' >*<br/>
            Principle Investigator :<input type='text' name='principle_investigator' >*<br/>
            Requested By :<input type='text' name='requested_by' >*<br/>

            ----------------------------------------------------------<br>
            Follow Up :<input type='text' name='followUp' >*<br/>
            Escalation manager ID :<input type='text' name='esc_id' >*<br/>
            ----------------------------------------------------------<br>

            Choose Issue: <input type='text' name='choose_issue' >*<br/>
            Desc of Issue :<input type='text' name='desc_issue' >*<br/>
            Site Request: <input type='text' name='site_request' >*<br/>
            Initial Offer :<input type='text' name='initial_offer' >*<br/>
            Percent Over Initial: <input type='text' name='percent_over_initial' >*<br/>
            GP High :<input type='text' name='fmv_high' >*<br/>
            Percent Over GP High: <input type='text' name='percent_over_fmv' >*<br/>
            Site Justification :<input type='text' name='site_justification' >*<br/>
            Anyother Details: <input type='text' name='anyother_details' >*<br/>
            Do you want to add attachment :<input type='text' name='do_add_attachment' >*(1=>Yes, 0=>No)<br/>
            Request ID: <input type='text' name='request_id' >*<br/>
            Attachment Ids: <input type='text' name='attachment_file_ids' >*<br/>
            Currency Type: <input type='text' name='currency_type' >*<br/>

            ---------------------------------------------------------<br>
            High Priority :<input type='text' name='highPriority' >*<br/>
            Select Priority :<input type='text' name='selectPriority' >*<br/>
            Priority Reason:<input type='text' name='priorityReason' >*<br/>
            ----------------------------------------------------------<br>
            CC :<input type='email' name='cc_email'>*<br/>

            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>



    <div>    
        
        <p id="api">9. Save Language Escalation <font color="red">[Required <u>authorization</u> token in header]</font></p>
        Parameters  : user_id, escalation_type_id, protocol_id,sitename,country, raised_by, principle_investigator, requested_by, followUp (1=>yes, 0=>no), esc_id (if follow up yes then send escalation manager id),type_contract,type_issues,proposed_language,site_rationale,do_add_attachment,attempts_negotiate,other_detail,request_id
        , highPriority(0=>no, 1=>yes),  selectPriority(0=>no selection, 1=>urgent within 24 hours, 2=>urgent within 48 hours), priorityReason, cc_email<br/>
        <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=saveLanguageEscalation</p>
        <form action="services/index.php?action=saveLanguageEscalation" method="post">
            User ID: <input type='text' name='user_id' >*<br/>
            Escalation Type ID: <input type='text' name='escalation_type_id' >*<br/>
            Protocol ID: <input type='text' name='protocol_id' >*<br/>
            Sitename: <input type='text' name='sitename' >*<br/>
            Country :<input type='text' name='country' >*<br/>

            Raised BY :<input type='text' name='raised_by' >*<br/>
            Principle Investigator :<input type='text' name='principle_investigator' >*<br/>
            Requested By :<input type='text' name='requested_by' >*<br/>

            ----------------------------------------------------------<br>
            Follow Up :<input type='text' name='followUp' >*<br/>
            Escalation manager ID :<input type='text' name='esc_id' >*<br/>
            ----------------------------------------------------------<br>

            Type of Contract Language: <input type='text' name='type_contract' >*<br/>
            Type of Issue: <input type='text' name='type_issues' >*<br/>
            Proposed language :<input type='text' name='proposed_language' >*<br/>
            Site rationale :<input type='text' name='site_rationale' >*<br/>
            Do you want to add attachment :<input type='text' name='do_add_attachment' >*(1=>Yes, 0=>No)<br/>
            Attempts negotiate :<input type='text' name='attempts_negotiate' >*<br/>
            Other detail: <input type='text' name='other_detail' >*<br/>
            Request ID: <input type='text' name='request_id' >*<br/>
            Attachment Ids: <input type='text' name='attachment_file_ids' >*<br/>


            ---------------------------------------------------------<br>
            High Priority :<input type='text' name='highPriority' >*<br/>
            Select Priority :<input type='text' name='selectPriority' >*<br/>
            Priority Reason:<input type='text' name='priorityReason' >*<br/>
            ----------------------------------------------------------<br>
            CC :<input type='email' name='cc_email'>*<br/>

            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>


    <div style="background:#d3d3d3">    
        
        <p id="api">10. CRO Display Request <font color="red">[Required <u>authorization</u> token in header]</font></p>
        Parameters  : cro_id, startDate, endDate, dashOrArchive (1=>Dashboard, 2=>Archive)<br/>
        <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=displayCroRequest</p>
        <form action="services/index.php?action=displayCroRequest" method="post">
            CRO ID: <input type='text' name='cro_id' >*<br/>
            Start Date : <input type='text' name='startDate' >*<br/>
            End Date : <input type='text' name='endDate' >*<br/>
            -----------------------------------------------------<br/>
            Dashboard Or Archive : <input type='text' name='dashOrArchive' >*<br/>
            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>




    <div>    
        
        <p id="api">11. Upload Attachment</p>
        <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=uploadAttachment</p>
        <pre>
$('#submit').on('click', function() {
    var file_data = $('#sortpicture').prop('files')[0];   
    var form_data = new FormData();                  
    form_data.append('file', file_data);
    alert(form_data);                             
    $.ajax({
                url: '<?php echo $server_path; ?>/api/v1/services/index.php?action=uploadAttachment', // point to server-side PHP script 
                dataType: 'text',  // what to expect back from the PHP script, if anything
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,                         
                type: 'post',
                success: function(php_script_response){
                    alert(php_script_response); // display response from the PHP script, if any
                }
     });
});

        </pre>
        <form action="services/index.php?action=uploadAttachment" method="post" enctype= multipart/form-data>
            File: <input type='file' name='file' >*
            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>



    <div>    
        
        <p id="api">12. Add Sitename <font color="red">[Required <u>authorization</u> token in header]</font></p>
        Parameters  : sitename<br/>
        <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=addSitename</p>
        <form action="services/index.php?action=addSitename" method="post">
            Sitename Name: <input type='text' name='sitename' >*<br/>
            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>



    <div>    
        
        <p id="api">13. List of Sitename <font color="red">[Required <u>authorization</u> token in header]</font></p>
        Parameters  : sitename<br/>
        <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=listSitename</p>
        <form action="services/index.php?action=listSitename" method="post">
            Sitename Name: <input type='text' name='sitename' >*<br/>
            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>



    <div>    
        
        <p id="api">14. Edit Sitename <font color="red">[Required <u>authorization</u> token in header]</font></p>
        Parameters  : sitename_id, sitename<br/>
        <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=editSitename</p>
        <form action="services/index.php?action=editSitename" method="post">
            Sitename ID: <input type='text' name='sitename_id' >*<br/>
            Sitename: <input type='text' name='sitename' >*<br/>
            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>



    <div>    
        
        <p id="api">15. Edit Protocol <font color="red">[Required <u>authorization</u> token in header]</font></p>
        Parameters  : protocol_id, protocol_name<br/>
        <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=editProtocol</p>
        <form action="services/index.php?action=editProtocol" method="post">
            Protocol ID: <input type='text' name='protocol_id' >*<br/>
            Protocol Name: <input type='text' name='protocol_name' >*<br/>
            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>



    <div>    
        
        <p id="api">16. User Roles  <font color="red">[<u>On swagger</u>]</font></p>
        <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=userRoles</p>
        <form action="services/index.php?action=userRoles" method="post">
            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>



    <div>    
        
        <p id="api">17. Delete Sitename <font color="red">[Required <u>authorization</u> token in header]</font></p>
        Parameters  : sitename_id<br/>
        <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=deleteSitename</p>
        <form action="services/index.php?action=deleteSitename" method="post">
            Sitename ID: <input type='text' name='sitename_id' >*<br/>
            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>




    <div>    
        
        <p id="api">18. View Request ID Details <font color="red">[Required <u>authorization</u> token in header]</font></p>
        Parameters  : request_id, escalation_type_id<br/>
        <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=viewCroRequestID</p>
        <form action="services/index.php?action=viewCroRequestID" method="post">
            Request ID: <input type='text' name='request_id' >*<br/>
            Escalation Type ID: <input type='text' name='escalation_type_id' >*<br/>
            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>



    <div>    
        
        <p id="api">19. Currency List  <font color="red">[<u>On swagger</u>]</font></p> 
        <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=currencyList</p>
        <form action="services/index.php?action=currencyList" method="post">
            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>


    <div>    
        
        <p id="api">20. View Escalation Manager Request <font color="red">[Required <u>authorization</u> token in header]</font></p>
        Parameters  : manager_id, startDate, endDate<br/>
        <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=viewManagerRequest</p>
        <form action="services/index.php?action=viewManagerRequest" method="post">
            Manager ID: <input type='text' name='manager_id' >*<br/>
            Start Date : <input type='text' name='startDate' >*<br/>
            End Date : <input type='text' name='endDate' >*<br/>
            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>


    <div>    
        
        <p id="api">21. Attachment Ids Link <font color="red">[Required <u>authorization</u> token in header]</font></p>
        Parameters  : attachmentIds<br/>
        <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=attachmentIdsList</p>
        <form action="services/index.php?action=attachmentIdsList" method="post">
            Attachments ID: <input type='text' name='attachmentIds' >*<br/>
            <input type="submit" style="
                   color: #EE2424;
                   border-radius: 20px;
                   "/>
        </form>
    </div>

    <div>    
        
        <p id="api">22. SSO User Login <font color="red">[Required <u>authorization</u> token in header]</font></p>
        Parameters  : email, userRole_id<br/>
        Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=ssoUserLogin</p>
    <form action="services/index.php?action=ssoUserLogin" method="post">
        Email: <input type='text' name='email' >*<br/>
        User Role ID: <input type='text' name='userRole_id' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>



<div>    
    
    <p id="api">23. Escalation Manager Action <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : manager_action_id, issue_id, status (1=>pending, 2=>approve, 3=>denied, 4=>negotiation, 5=>escalated, 6=>approved with modification, 7=>On hold, 9=>Closed, 8=>Reassigned), desc, attachment, coe_id, role_id (1=>escalation, 2=>legal)<br/>
    Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=escalationManagerAction</p>
<form action="services/index.php?action=escalationManagerAction" method="post">
    Manager Action ID: <input type='text' name='manager_action_id' >*<br/>
    Issue ID: <input type='text' name='issue_id' >*<br/>
    Status: <input type='text' name='status' >*<br/>
    Description: <input type='text' name='desc' >*<br/>
    Attachment: <input type='text' name='attachment' >*<br/>
    COE ID: <input type='text' name='coe_id' >*<br/>
    Role ID: <input type='text' name='role_id' >*<br/>
    <input type="submit" style="
           color: #EE2424;
           border-radius: 20px;
           "/>
</form>
</div>


<div>    
    
    <p id="api">24. Forgot Password <font color="red">[<u>On swagger</u>]</font></p>
    Parameters  : email<br/>
    Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=forgotPassword</p>
<form action="services/index.php?action=forgotPassword" method="post">
    Email: <input type='text' name='email' >*
    <input type="submit" style="
           color: #EE2424;
           border-radius: 20px;
           "/>
</form>
</div>



        <div style="background:#d3d3d3">    
    
    <p id="api">25. User Management <font color="red">[Required <u>authorization</u> token in header]</font></p>'
    Parameters  : role_id<br/>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=userManagement</p>
    <form action="services/index.php?action=userManagement" method="post">
        Role: <input type='text' name='role_id' >*
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>


<div>    
    
    <p id="api">27. Change Password <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : user_id, old_pass, new_pass<br/>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=changePassword</p>
    
    <p>
           $.ajax({
            url: "http://localhost:8080/login",
            type: 'GET',
            // Fetch the stored token from localStorage and set in the header
            headers: {"Authorization": localStorage.getItem('token')}
          });
    </p>
    
    <form action="services/index.php?action=changePassword" method="post">
        User ID: <input type='text' name='user_id' >*<br>
        Old Password: <input type='text' name='old_pass' >*<br>
        New Password: <input type='text' name='new_pass' >*
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>


<div>    
    
    <p id="api">28. View Legal Request <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : legal_id , startDate, endDate<br/>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=viewLegalRequest</p>
    <form action="services/index.php?action=viewLegalRequest" method="post">
        Legal ID: <input type='text' name='legal_id' >*<br/>
        Start Date : <input type='text' name='startDate' >*<br/>
        End Date : <input type='text' name='endDate' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>

<div>    
    
    <p id="api">29. Export CRO Excel <font color="red">[<u>On swagger</u>]</font></p>
    Parameters  : cro_id
    <br/>
    method : GET
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=ExportExcelCro</p>
    <form action="services/index.php?action=ExportExcelCro" method="get">
        CRO ID: <input type='text' name='cro_id' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>


<div>    
    
    <p id="api">30. Legal Action <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : legal_action_id, issue_id, status (old(1=>pending, 2=>approve, 3=>denied, 4=>approved with modification, 5=>pending-oc, 6=>On hold, 8=>Closed, 7=>Reassigned, '9' => 'Additional Modification'), new(1=>pending, '2' => 'approved', '3' => 'denied', '4' => 'Additional Modification', '5' => 'pending-oc', '6' => 'approved with modification', '7' => 'On hold', '8' => 'Reassigned', '9' => 'Closed')), desc, attachment, coe_id, role_id (1=>escalation, 2=>legal)<br/>
    Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=legalAction</p>
<form action="services/index.php?action=legalAction" method="post">
    Legal Action ID: <input type='text' name='legal_action_id' >*<br/>
    Issue ID: <input type='text' name='issue_id' >*<br/>
    Status: <input type='text' name='status' >*<br/>
    Description: <input type='text' name='desc' >*<br/>
    Attachment: <input type='text' name='attachment' >*<br/>
    COE ID: <input type='text' name='coe_id' >*<br/>
    Role ID: <input type='text' name='role_id' >*<br/>
    <input type="submit" style="
           color: #EE2424;
           border-radius: 20px;
           "/>
</form>
</div>    


<div>    
    
    <p id="api">31. Export Escalation Manager Excel <font color="red">[<u>On swagger</u>]</font></p>
    Parameters  : escalation_manager_id
    <br/>
    method : GET
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=ExportExcelManager</p>
    <form action="services/index.php?action=ExportExcelManager" method="get">
        Manager ID: <input type='text' name='escalation_manager_id' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>


<div>    
    
    <p id="api">32. Export Legal Excel <font color="red">[<u>On swagger</u>]</font></p>
    Parameters  : legal_id
    <br/>
    method : GET
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=ExportExcelLegal</p>
    <form action="services/index.php?action=ExportExcelLegal" method="get">
        Legal ID: <input type='text' name='legal_id' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>




<div>    
    
    <p id="api">33. Number of Issues <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : escLegal <span style="color:red">( 1 => Escalation, 2 => Legal, 3=>CRO )</span>, startDate, endDate <span style="color:red">Date Format ( YYYY-MM-DD )</span>, analyticsType (1,2,4)
    <br/>
    method : POST
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=numberOfIssues</p>
    <form action="services/index.php?action=numberOfIssues" method="post">
        Escalation / Legal Type: <input type='text' name='escLegal' >*<br/>
        Start Date : <input type='text' name='startDate' >*<br/>
        End Date : <input type='text' name='endDate' >*<br/>
        Type Analytics : <input type='text' name='analyticsType'>*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>




<div>    
    
    <p id="api">34. Issue Trend (PERSON / REGION / PROTOCOL) <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : escLegal <span style="color:red">( 1 => Escalation, 2 => Legal, 3 => CRO, 4 => Region, 5 => Protocol )</span>, startDate, endDate <span style="color:red">Date Format ( YYYY-MM-DD )</span>, escalationLegalID, , analyticsType (1,2,4)
    <br/>
    method : POST
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=issueTrendPerson</p>
    <form action="services/index.php?action=issueTrendPerson" method="post">
        Escalation / Legal / CRO / Region / Protocol Type : <input type='text' name='escLegal' >*<br/>
        Start Date : <input type='text' name='startDate' >*<br/>
        End Date : <input type='text' name='endDate' >*<br/>
        Escalation / Legal / CRO / Region / Protocol ID : <input type='text' name='escalationLegalID' >*<br/>
        Type Analytics : <input type='text' name='analyticsType'>*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>



<div style="background:#d3d3d3">    
    
    <p id="api">36. User Disable / Enable <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : user_id, user_type<br/>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=userDisableEnable</p>
    <form action="services/index.php?action=userDisableEnable" method="post">
        User ID: <input type='text' name='user_id' >*<br/>
        User Type: <input type='text' name='user_type' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>



<div>    
    
    <p id="api">37. View Request Numbers <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : requestNumbers <span style="color:red"> ( Input request numbers having (,) Example : 23,54,24 )</span><br/>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=viewRequestNumbers</p>
    <form action="services/index.php?action=viewRequestNumbers" method="post">
        Request Numbers: <input type='text' name='requestNumbers' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>



<div style="background:#d3d3d3">    
    
    <p id="api">38. User Delete <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : user_id, user_type<br/>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=userDelete</p>
    <form action="services/index.php?action=userDelete" method="post">
        User ID: <input type='text' name='user_id' >*<br/>
        User Type: <input type='text' name='user_type' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>


<div>
    <p id="api">39. Edit User: <font color="red">[Required <u>authorization</u> token in header]</font></p>
    <p>Parameters : user_id, first_name, last_name, user_type, esc_type_id, esc_sub_type_id, analatics, user_management, budgetDirect, contractDirect<br/>
        Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=editUser</p>
    <form action="services/index.php?action=editUser" method="post">
        User ID: <input type='text' name='user_id' >*<br/>
        First Name : <input type='text' name='first_name' >*<br/>
        Last Name : <input type='text' name='last_name' >*<br/>
        User Type :<input type='text' name='user_type' >*<br/>

        ---------------------------------------------------<br>
        Escalation Type ID :<input type='text' name='esc_type_id' >*  eg. 1,2,3 (comma separate value if none then send 0)<br/>
        ICF Sub Category ID :<input type='text' name='esc_sub_type_id' >*  eg. 1,2,3 (comma separate value if none then send 0)<br/>
        -----------------------------------------------------<br>

        <br/><br/>--------------------IF MANAGEMENT USER----------------------<br><br/>
        Analatics :<input type='text' name='analatics' >* eg. 1,2,3<br/>
        User Management :<input type='text' name='user_management' >* eg. 1,2,3<br/>
        <br/><br/>--------------------IF LEGAL USER----------------------<br><br/>
        Direct Assign Budget Request  :<input type='text' name='budgetDirect' >* eg. 1=>Yes, 0=>No<br/>
        Direct Assign Contract Request :<input type='text' name='contractDirect' >* eg. 1=>Yes, 0=>No<br/>
        </span> <input type="submit" style="
                       color: #EE2424;
                       border-radius: 20px;
                       "/>
    </form>
</div>



<div>    
    
    <p id="api">40. View Request Numbers Export <font color="red">[<u>On swagger</u>]</font></p>
    Parameters  : requestNumbers <span style="color:red"> ( Input request numbers having (,) Example : 23,54,24 )</span><br/>
    method : GET<br>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=viewRequestNumbersExport</p>
    <form action="services/index.php?action=viewRequestNumbersExport" method="post">
        Request Numbers: <input type='text' name='requestNumbers' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>

<div>    
    
    <p id="api">41. Send Test Mail</p>
    Parameters  : email_id
    method : POST<br>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=sendEmail</p>
    <form action="services/index.php?action=sendEmail" method="post">
        Email ID: <input type='text' name='email' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>



<div>    
    
    <p id="api">42. Session</p>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=session</p>
    <form action="services/index.php?action=session" method="post">
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>



<div>    
    
    <p id="api">43. Session Logout  <font color="red">[<u>On swagger</u>]</font></p>
    Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=userLogout</p>
<form action="services/index.php?action=userLogout" method="post">
    <input type="submit" style="
           color: #EE2424;
           border-radius: 20px;
           "/>
</form>
</div>



<div>    
    
    <p id="api">44. Cron Job  <font color="red">[<u>On swagger</u>]</font> </p>
    Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=croNegotiationCron</p>
<form action="services/index.php?action=croNegotiationCron" method="post">
    <input type="submit" style="
           color: #EE2424;
           border-radius: 20px;
           "/>
</form>
</div>


<div style="background:#d3d3d3">    
    
    <p id="api">45. User Active / InActive <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : user_id, user_type<br/>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=userActiveInactive</p>
    <form action="services/index.php?action=userActiveInactive" method="post">
        User ID: <input type='text' name='user_id' >*<br/>
        User Type: <input type='text' name='user_type' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>


<div>    
    
    <p id="api">46. Update Protocol ID in Request <font color="red">[Required <u>authorization</u> token in header]</font> </p>
    Parameters  : request_id, protocol_id<br/>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=updateProtocolId</p>
    <form action="services/index.php?action=updateProtocolId" method="post">
        Request ID: <input type='text' name='request_id' >*<br/>
        Protocol ID: <input type='text' name='protocol_id' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>


<div>    
    
    <p id="api">47. Reassigned Request <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : coe_manager_id, coe_type<br/>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=reassignedRequest</p>
    <form action="services/index.php?action=reassignedRequest" method="post">
        COE Manager ID: <input type='text' name='coe_manager_id' >*<br/>
        COE Type: <input type='text' name='coe_type' >*<br/>
        Start Date : <input type='text' name='startDate' >*<br/>
        End Date : <input type='text' name='endDate' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>


<div>    
    
    <p id="api">48. Pie Chart All <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : escLegal <span style="color:red">( 1 => Escalation, 2 => Legal, 3 => CRO )</span>, startDate, endDate <span style="color:red">Date Format ( YYYY-MM-DD )</span>, analyticsType (1,2,4)
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=pieChartAll</p>
    <form action="services/index.php?action=pieChartAll" method="post">
        Start Date : <input type='text' name='startDate' >*<br/>
        End Date : <input type='text' name='endDate' >*<br/>
        Escalation / Legal / CRO <input type='text' name='escLegal' >*<br/>
        Type Analytics : <input type='text' name='analyticsType'>*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>


<div>    
    
    <p id="api">49. Region Dashboard <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : regionId, startDate, endDate <span style="color:red">Date Format ( YYYY-MM-DD )</span>, analyticsType (1,2,4)
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=regionDashboard</p>
    <form action="services/index.php?action=regionDashboard" method="post">
        Start Date : <input type='text' name='startDate' >*<br/>
        End Date : <input type='text' name='endDate' >*<br/>
        Region ID : <input type='text' name='regionId' >*<br/>
        Type Analytics : <input type='text' name='analyticsType'>*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>



<div>    
    
    <p id="api">50. Protocol Dashboard <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : protocolId, startDate, endDate <span style="color:red">Date Format ( YYYY-MM-DD )</span>, analyticsType (1,2,4)
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=protocolDashboard</p>
    <form action="services/index.php?action=protocolDashboard" method="post">
        Start Date : <input type='text' name='startDate' >*<br/>
        End Date : <input type='text' name='endDate' >*<br/>
        Protocol ID : <input type='text' name='protocolId' >*<br/>
        Type Analytics : <input type='text' name='analyticsType'>*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>



<div>    
    
    <p id="api">51. CRO Dashboard <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : croId, startDate, endDate <span style="color:red">Date Format ( YYYY-MM-DD )</span>, analyticsType (1,2,4)
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=croDashboard</p>
    <form action="services/index.php?action=croDashboard" method="post">
        Start Date : <input type='text' name='startDate' >*<br/>
        End Date : <input type='text' name='endDate' >*<br/>
        CRO ID : <input type='text' name='croId' >*<br/>
        Type Analytics : <input type='text' name='analyticsType'>*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>


<div>    
    
    <p id="api">52. Save ICFs Forms  <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : user_id, escalation_sub_type_id (1=>Global, 2=>Country, 3=>Sitename), protocol_id, sitename, region, country, principle_investigator, 
    section_requiring_legal_review, EC_IRB_feedback, any_other_detail, specify_relevant_document, 
    attachment_global_icf, attachment_protocol, attachment_other_relevant_document, attachment_country_icf, attachment_site_icf, cc_email, attachment_global_link,
    attachment_protocol_link, attachment_country_icf_link, attachment_site_icf_link
    <br/>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=saveIcf</p>

    <form action="services/index.php?action=saveIcf" method="post">
        User ID: <input type='text' name='user_id' >*<br/>
        Escalation Sub Type ID: <input type='text' name='escalation_sub_type_id' >*<br/>
        Protocol ID: <input type='text' name='protocol_id' >*<br/>
        Sitename: <input type='text' name='sitename' >*<br/>
        Region: <input type='text' name='region_id' >*<br/>
        Country :<input type='text' name='country' >*<br/>

        Principle Investigator :<input type='text' name='principle_investigator' >*<br/>

        ----------------------------------------------------------<br>
        Section Requiring Legal Review :<input type='text' name='section_requiring_legal_review' >*<br/>
        EC/IRB Feedback :<input type='text' name='EC_IRB_feedback' >*<br/>
        Any Other Detail :<input type='text' name='any_other_detail' >*<br/>
        Specify Relevant Document :<input type='text' name='specify_relevant_document' >*<br/>
        ----------------------------------------------------------<br>


        Attachment Global ICF Ids: <input type='text' name='attachment_global_icf' >*<br/>
        Attachment Protocol Ids: <input type='text' name='attachment_protocol' >*<br/>
        Attachment Other Relevant Document Ids: <input type='text' name='attachment_other_relevant_document' >*<br/>
        Attachment Country ICF Ids: <input type='text' name='attachment_country_icf' >*<br/>
        Attachment Sitename ICF Ids: <input type='text' name='attachment_site_icf' >*<br/>
        ----------------------------------------------------------<br>
        CC :<input type='email' name='cc_email'>*<br/>
        ----------------------------------------------------------<br>
        
        Attachment Global ICF Link: <input type='text' name='attachment_global_link' >*<br/>
        Attachment Protocol Link: <input type='text' name='attachment_protocol_link' >*<br/>
        Attachment Country Link: <input type='text' name='attachment_country_icf_link' >*<br/>
        Attachment Sitename Link: <input type='text' name='attachment_site_icf_link' >*<br/>
        
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>    


<div>    
    
    <p id="api">53. List of Regions <font color="red">[<u>On swagger</u>]</font>    </p>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=listRegions</p>
    <form action="services/index.php?action=listRegions" method="post">
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>


<div>    
    
    <p id="api">54. ICF Legal Search <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : form_id, icf_form_id, forAssignment (1=>yes, 2=>no)
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=legalListSearch</p>
    <form action="services/index.php?action=legalListSearch" method="post">
        Form ID: <input type='text' name='form_id' >*<br/>
        ICF form ID: <input type='text' name='icf_form_id' >*<br/>
        For Assignment: <input type='text' name='forAssignment' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>

<div style="background:#d3d3d3">
    <p id="api">56. Assignment List <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : form_id, icf_form_id, role_id, page_id
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=assignmentList</p>
    <form action="services/index.php?action=assignmentList" method="post">
        Form ID: <input type='text' name='form_id' >*<br/>
        ICF form ID: <input type='text' name='icf_form_id' >*<br/>
        Role ID: <input type='text' name='role_id' >*<br/> 2=>Escalation Manager, 3=>Legal
        Page ID: <input type='text' name='page_id' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>


<div>
    <p id="api">57. Legal List for Perform Action in Escalation Manager <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : form_id, icf_form_id
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=legalList</p>
    <form action="services/index.php?action=legalList" method="post">
        Form ID: <input type='text' name='form_id' >*<br/>
        ICF form ID: <input type='text' name='icf_form_id' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>


<div>
    <p id="api">58. API patch for all legal managers that exist in previous DB <font color="red">[<u>On swagger</u>]</font> </p>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=patchForLegalManagers</p>
    <form action="services/index.php?action=patchForLegalManagers" method="post">
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>


<div style="background:#d3d3d3">
    <p id="api">59. Delete Assignment <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : assignment_id
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=deleteAssignment</p>
    <form action="services/index.php?action=deleteAssignment" method="post">
        Assignment ID: <input type='text' name='assignment_id' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>


<div style="background:#d3d3d3">
    <p id="api">61. Save Assignments for escalation and legal managers <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : form_id, icf_form_id, cta_type, issue_type, region_id, country_id (67,35,34) (, seprated values accepted), protocol_id (67,35,34) (, seprated values accepted), legal_id  (67,35,34) (, seprated values accepted), escalation_manager_id  (67,35,34) (, seprated values accepted)
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=saveAssignments</p>
    <form action="services/index.php?action=saveAssignments" method="post">
        Form ID: <input type='text' name='form_id' >*<br/>
        ICF form ID: <input type='text' name='icf_form_id' >*<br/>
        CTA Type: <input type='text' name='cta_type' >*<br/>
        Issue Type ID: <input type='text' name='issue_type' >*<br/>
        Region ID: <input type='text' name='region_id' >*<br/>
        Country ID: <input type='text' name='country_id' >*<br/>
        Protocol ID: <input type='text' name='protocol_id' >*<br/>
        Legal ID: <input type='text' name='legal_id' >*<br/>
        Escalation Manager ID: <input type='text' name='escalation_manager_id' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>


<div>    
    
    <p id="api">62. ICF Others List <font color="red">[Required <u>authorization</u> token in header]</font></p>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=icfOthersList</p>
    <form action="services/index.php?action=icfOthersList" method="post">
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>

        
<div style="background:#d3d3d3">
    <p id="api">63. Edit Assignments for escalation and legal managers <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : assignment_id, form_id, icf_form_id, cta_type, issue_type, region_id, country_id (67,35,34) (, seprated values accepted), protocol_id (67,35,34) (, seprated values accepted), legal_id  (67,35,34) (, seprated values accepted), escalation_manager_id  (67,35,34) (, seprated values accepted)
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=editAssignments</p>
    <form action="services/index.php?action=editAssignments" method="post">
        Assignment ID: <input type='text' name='assignment_id' >*<br/>
        Form ID: <input type='text' name='form_id' >*<br/>
        ICF form ID: <input type='text' name='icf_form_id' >*<br/>
        CTA Type: <input type='text' name='cta_type' >*<br/>
        Issue Type ID: <input type='text' name='issue_type' >*<br/>
        Region ID: <input type='text' name='region_id' >*<br/>
        Country ID: <input type='text' name='country_id' >*<br/>
        Protocol ID: <input type='text' name='protocol_id' >*<br/>
        Legal ID: <input type='text' name='legal_id' >*<br/>
        Escalation Manager ID: <input type='text' name='escalation_manager_id' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>

<div>    
    
    <p id="api">64. ICF Others List Delete <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : user_id
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=icfOthersListDelete</p>
    <form action="services/index.php?action=icfOthersListDelete" method="post">
        Email :<input type='text' name='user_id' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>

        
<div style="background:#d3d3d3">    
    
    <p id="api">65. API patch for userRoles <font color="red">[Required <u>authorization</u> token in header]</font></p>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=patchUserRoles</p>
    <form action="services/index.php?action=patchUserRoles" method="post">
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>
        
        
        
<div style="background:#d3d3d3">    
    
    <p id="api">66. List of Issues Types <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : user_id
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=listIssuesTypes</p>
    <form action="services/index.php?action=listIssuesTypes" method="post">
        Form ID :<input type='text' name='form_id' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>
        
        
<div style="background:#d3d3d3">    
    
    <p id="api">67. API patch for choose an issue in Budget and Contract <font color="red">[<u>On swagger</u>]</font></p>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=patchChooseIssue</p>
    <form action="services/index.php?action=patchChooseIssue" method="post">
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>
        
        
<div style="background:#d3d3d3">    
    
    <p id="api">68. Validate Token and Return the details</p>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=validateToken</p>
    <form action="services/index.php?action=validateToken" method="post">
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>
        
        
<div style="background:#d3d3d3">    
    
    <p id="api">69. User details <font color="red">[Required <u>authorization</u> token in header]</font></p>
    Parameters  : user_id
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=userDetails</p>
    <form action="services/index.php?action=userDetails" method="post">
        User ID :<input type='text' name='user_id' >*<br/>
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>
        
        
            <div style="background:#d3d3d3">    
    
    <p id="api">25. Deleted User Management <font color="red">[Required <u>authorization</u> token in header]</font></p>'
    Parameters  : role_id<br/>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=userManagementDeleted</p>
    <form action="services/index.php?action=userManagementDeleted" method="post">
        Role: <input type='text' name='role_id' >*
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>
        
        
        <div style="background:#d3d3d3">    
    
    <p id="api">67. API patch for add escalation manager id in Issue status <font color="red">[<u>On swagger</u>]</font></p>
    <p>Url : <?php echo $server_path; ?>/api/v1/services/index.php?action=putManagerIdIssueStatus</p>
    <form action="services/index.php?action=putManagerIdIssueStatus" method="post">
        <input type="submit" style="
               color: #EE2424;
               border-radius: 20px;
               "/>
    </form>
</div>
        

<br/><br/><br/>    
</body>

</html>
