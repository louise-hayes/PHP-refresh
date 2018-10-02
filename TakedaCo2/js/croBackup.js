function croRequestList() {
    var hamburgerListArr = new Array("Dashboard","Raise New Request","Archive","Logout");
    var pageArr = new Array("croDashboard.html","chooseFormType.html","Archive","index.html");
    hamburgerList(hamburgerListArr,pageArr,0);
    
    setDefaultDate();
    var fromDate =  $("#datepicker").val();
    var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( fromDate ) );
    
    var toDate = $("#toDatepicker").val(); 
    var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ) );

    croWebService(fromDateNewFormat, todateNewFormat);
}
function croWebService(fromDate,toDate) {
    
    // $('#datetimepicker4').datetimepicker({
    //     pickTime: false
    // });

    var userId = 10;
   // var fromDate = '2017-12-09';
   // var toDate = '2018-04-09';
   //alert(fromDate+"--"+toDate)
   //05/05/18--2018-01-05
    loaderLogin();
    $.ajax({
        url: serviceHTTPPath + "displayCroRequest",
        type: "POST",
        dataType: 'json',
        data: { cro_id: userId, startDate: fromDate, endDate: toDate,dashOrArchive:1 },
        success: function (result) {
            //alert("success="+JSON.stringify(result))
            loaderRemoveFun();
            if (result.json_data.response == 0) {   
                //location.href = "loginPage.html";          
            }
            else {
                croDashboard(result);
            }
        },
        error: function (e) {
            return;
        }
    });
    /*****CroRequest list webservice call end here*****/

    $('#raiseRequest').click(function(event){
        location.href = pageArr[1];
    })
}
// Date calender controler function
function setDefaultDate(){
    var currentDate = new Date();
    $.fn.datepicker.defaults.format = "mm/dd/yy";
        //To Date picker
        $('#datepicker').datepicker({
            autoclose: true, 
            minDate: '-3M',
        })
        .on('changeDate', dateChanged); 
      
        var beforeFourMonth = new Date();
        beforeFourMonth.setMonth(beforeFourMonth.getMonth() - 4, beforeFourMonth.getDate());
        
        $("#datepicker").datepicker("setDate", beforeFourMonth);
      
        //From Date picker
        $('#toDatepicker').datepicker({
            autoclose: true,
        })
        $("#toDatepicker").datepicker("setDate", currentDate);
}
function dateChanged(ev){
    var fromDate = $("#datepicker").val(); 
    var fromdateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( fromDate ) );

    var toDate = $("#toDatepicker").val(); 
    var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ) );
   
    // if (ev.date.valueOf() > toDate.valueOf()) {
    //     var msg = "Please select the correct date range.";//next date."
    //     //popupSelectDate(msg, today, "fromDate");
    // }
    // else {
    //     if (reassignedType == "EManager" || reassignedType == "legal") {
    //         loadReassignedData(_fromDateSet, _toDateSet)
    //     }
    //     else{
    //         if (userType == 1) {
    //             callCroWebservice(_fromDateSet, _toDateSet);
    //         }
    //         else if (userType == 2) {
    //             callLECWebservice(userId, _fromDateSet, _toDateSet);
    //         }
    //         else if (userType == 3) {
    //             callLegalRequest(userId, _fromDateSet, _toDateSet);
    //         }
    //    }
    // }   
}
function croDashboard(result) {
    var croHeaderArr = new Array("Request Type", "Issue", "Raised on", "Assigned Manager", "Escalation Manager Action", "Legal/Other Action", "Activity by Takeda", "Resolution Date");

    $('.content-wrapper .tableMainContainer table').remove();

    var html= '<table id="example1" class="table display nowrap">';
    html += '<thead>';
    html += '<tr>';
    for (var i = 0; i < croHeaderArr.length; i++) {
        html += '<th>' + croHeaderArr[i] + '</th>';
    }
    html += '</tr>';
    html += '</thead>';

    html += '<tbody class="tbodyContainer">';
   
    html += '</tbody>';

    html += '</table>';
  

    $('.content-wrapper .tableMainContainer').append(html)
    var performDisplayArr = new Array("Pending", "Approved", "Denied", "Negotiation Required", "Escalated", "Approved with modification", "On hold", "Reassigned", "Closed");

    if (result.json_data.message != 'Not Found!') {
        for (var j = 0; j < result.json_data.response.data.length; j++) {
            if (result.json_data.response.data[j].manager_action != null) {
                for (var p = 0; p < performDisplayArr.length + 1; p++) {
                    if (p == result.json_data.response.data[j].manager_action) {
                        if (p == 4) {
                            var now = new Date();

                            var _fromDate = new Date(result.json_data.response.data[j].create_date); //date picker (text fields)
                            var fromDateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( _fromDate ) );
                            
                            var toDate = new Date(now.toString());        
                            var todateNewFormat = $.datepicker.formatDate( "yy-mm-dd", new Date( toDate ) );                   
                          
                            if (fromDateNewFormat <= todateNewFormat) {                               
                                croTableListFun(result, j, "bgColorYellow");
                            }
                            else {
                                addClass = "";
                                croTableListFun(result, j, "");
                            }
                        }
                        else {
                            croTableListFun(result, j, "");
                        }
                    }
                }

            }
            else {
                addClass = "";
                croTableListFun(result, j, addClass);
            }
        }
    }

    $('#example1').DataTable( {
        "scrollX": true,      
         "bAutoWidth": true,
         "scrollY":'62vh',
         "autoWidth": true,
         "scrollCollapse": true,
         "paging": true,
         "lengthChange": false,      
         "language": {
            "search": "_INPUT_",
            "searchPlaceholder": "Search..."
        },       
    } );

    // $('#example1').DataTable( {
        
    //     "scrollX": true,
    //     //  "bAutoWidth": true,
    //      "scrollY":        '64vh',
    //      "autoWidth": true,
    //      "scrollCollapse": true,
    //      "paging": true,
        // "bAutoWidth": false,
        // "scrollX": true,
        // "scrollY":        '64vh',
        // "table-layout": "fixed",
        // aoColumns : [
        //   { sWidth: '12.5%' },
        //   { sWidth: '12.5%' },
        //   { sWidth: '12.5%' },
        //   { sWidth: '12.5%' },
        //   { sWidth: '12.5%' },
        //   { sWidth: '12.5%' },
        //   { sWidth: '12.5%' },
        //   { sWidth: '12.5%' }
        // ]
        // "scrollX": true,
        // "bAutoWidth": false,
        // "scrollY":        '64vh',
        // // "table-layout": "fixed",
        // "autoWidth": true,
        // "scrollCollapse": true,
        // "paging": true,        
        // "responsive": true,
        // "columnDefs": [
        //     { "width": "12.5%", "targets": 0 },
        //     { "width": "12.5%", "targets": 1 },
        //     { "width": "12.5%", "targets": 2 },
        //     { "width": "12.5%", "targets": 3 },
        //     { "width": "12.5%", "targets": 4 },
        //     { "width": "12.5%", "targets": 5 },
        //      sScrollX: "500px",
        // aoColumnDefs: [
        //     { bSortable: false, aTargets: [ 4, 5,6 ] },
        //     { sWidth: "16%", aTargets: [  1, 2,3,4,5,6 ] },
        // ],
        // bJQueryUI: true,
        // sAutoWidth: false,       
        // "fnDrawCallback": function( oSettings ) {
        // if (oSettings._iDisplayLength == per_page)
        //     return true
        // else {
        //     $.post($(this).data("url"), {iDisplayLength: oSettings._iDisplayLength})
        //     .done(function(data){
        //         if (data.success)
        //         per_page = oSettings._iDisplayLength;
        //     });
        // }{ "width": "12.5%", "targets": 6 },
        //     { "width": "12.5%", "targets": 7 }
        //   ],
        // "fixedHeader": {
        //     header: true,
        //   }
   // } );
    
    
    // $('#example1').DataTable( {
    //     scrollY:        "300px",
    //     scrollX:        true,
    //     scrollCollapse: true,
    //     paging:         false,
    //     columnDefs: [
    //         { width: 200, targets: 0 }
    //     ],
    //     fixedColumns: true
    // } );
    // $('#example1').DataTable({
    //     // other initialization configurations...
    //     // ...
    //         "language": {
    //             "search": "_INPUT_",
    //             "searchPlaceholder": "Search..."
    //         },
    //         'responsive': false,
    //         'paging'      : true,
    //         'lengthChange': false,
    //         'searching'   : true,
    //         'ordering'    : true,
    //         'info'        : true,
    //         'autoWidth'   : false,
    //         "order": [[ 0, "desc" ]],
    //         // "columnDefs": [
    //         //   { "width": "100%"}
    //         // ]
    // });   
  
  /*****Request number click event start here*****/
  $('.requestNo').click(function (e) {
        var request_id = $(this).attr('id');
        var request_number = $(this).children('a').attr('id');
        var escalationTypeId = $(this).children('span').attr('id');
       
        loaderLogin();
        $.ajax({
            url: serviceHTTPPath + "listEscalation",
            type: "GET",
            dataType: 'json',
            success: function (escalationResult) {
                
                var managerType = 1;
                requestNoPopup(request_id, escalationTypeId, result, escalationResult, request_number, managerType);
            },
            error: function (e) {
                loaderRemoveFun();
                return;
            }
        });        

    });
    /*****Request number click event end here*****/
}
// Append table 

function croTableListFun(result, j, addClass) {
    var protocol;
    var html;
    var highIcon = "../images/high.png";
    var urgentIcon = "../images/urgent.png";
    html = '<tr class="' + result.json_data.response.data[j].escalation_type_id + ' '+addClass+'>';
    if (result.json_data.response.data[j].request_number != null) {
        protocol = result.json_data.response.data[j].request_number + "-" + result.json_data.response.data[j].protocol_number;
        //ICF type entries urgent or high
        if (result.json_data.response.data[j].escalation_type_id == 4) {
            if (result.json_data.response.data[j].escalation_sub_type_id == 3) {
                if (result.json_data.response.data[j].selectPriority == 2) {
                    html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><img class="imgHigh" id="' + result.json_data.response.data[j].request_number + '" src="'+highIcon+'" /> <a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
                }
                else if (result.json_data.response.data[j].selectPriority == 1) {
                    html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><img class="imgUrgent" id="' + result.json_data.response.data[j].request_number + '" src="'+urgentIcon+'" /> <a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
                }
                else {
                    html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
                }
            }
            else {
                if (result.json_data.response.data[j].selectPriority == 2) {
                    html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><img class="imgHigh" id="' + result.json_data.response.data[j].request_number + '" src="'+highIcon+'" /> <a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '</td>';
                }
                else if (result.json_data.response.data[j].selectPriority == 1) {
                    html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><img class="imgUrgent" id="' + result.json_data.response.data[j].request_number + '" src="'+urgentIcon+'" /> <a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '</a></td>';
                }
                else {
                    html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '</a></td>';
                }
            }
        }
        else {
            if (result.json_data.response.data[j].selectPriority == 2) {
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><img class="imgHigh" id="' + result.json_data.response.data[j].request_number + '" src="'+highIcon+'" /> <a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
            }
            else if (result.json_data.response.data[j].selectPriority == 1) {
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><img class="imgUrgent" id="' + result.json_data.response.data[j].request_number + '" src="'+urgentIcon+'" /> <a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
            }
            else {
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
            }
        }
    }
    else {
        protocol = result.json_data.response.data[j].protocol_number;
        if (result.json_data.response.data[j].escalation_type_id == 4) {
            if (result.json_data.response.data[j].escalation_sub_type_id == 3) {
                if (result.json_data.response.data[j].selectPriority == 2) {
                    html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><img class="imgHigh" id="' + result.json_data.response.data[j].request_number + '" src="'+highIcon+'" />a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
                }
                else if (result.json_data.response.data[j].selectPriority == 1) {
                    html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><img class="imgUrgent" id="' + result.json_data.response.data[j].request_number + '" src="'+urgentIcon+'" /> <a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
                }
                else {
                    html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
                }
            }
            else {
                if (result.json_data.response.data[j].selectPriority == 2) {
                    html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><img class="imgHigh" id="' + result.json_data.response.data[j].request_number + '" src="'+highIcon+'" />a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '</a></td>';
                }
                else if (result.json_data.response.data[j].selectPriority == 1) {
                    html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><img class="imgUrgent" id="' + result.json_data.response.data[j].request_number + '" src="'+urgentIcon+'" /> <a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '</a></td>';
                }
                else {
                    html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '</a></td>';
                }
            }
        }
        else {
            if (result.json_data.response.data[j].selectPriority == 2) {
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><img class="imgHigh" id="' + result.json_data.response.data[j].request_number + '" src="'+highIcon+'" />a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
            }
            else if (result.json_data.response.data[j].selectPriority == 1) {
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><img class="imgUrgent" id="' + result.json_data.response.data[j].request_number + '" src="'+urgentIcon+'" /> <a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
            }
            else {
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
            }
        }
    }

    if (result.json_data.response.data[j].escalation_type_id == 2) {
        if (result.json_data.response.data[j].type_issues != '0') {
            if (result.json_data.response.data[j].type_issues != null) {
                if (result.json_data.response.data[j].type_contract_language != null) {
                    if (result.json_data.response.data[j].type_contract_language != '0') {
                        html += '<td>Contract - ' + result.json_data.response.data[j].type_contract_language + ' - ' + result.json_data.response.data[j].type_issues + '</td>';
                    }
                    else {
                        html += '<td>Contract - ' + result.json_data.response.data[j].type_issues;
                    }
                }
                else {
                    html += '<td>Contract - ' + result.json_data.response.data[j].type_issues;
                }

            }
            else {
                if (result.json_data.response.data[j].type_contract_language != '0') {
                    if (result.json_data.response.data[j].type_contract_language != null) {
                        html += '<td>Contract - ' + result.json_data.response.data[j].type_contract_language + '</td>';
                    }
                    else {
                        html += '<td>Contract</td>';
                    }
                }
                else {
                    html += '<td>Contract</td>';
                }
            }
        }
        else {

            if (result.json_data.response.data[j].type_contract_language != '0') {
                if (result.json_data.response.data[j].type_contract_language != null) {
                    html += '<td>Contract - ' + result.json_data.response.data[j].type_contract_language + '</td>';
                }
                else {
                    html += '<td>Contract</td>';
                }
            }
            else {
                html += '<td>Contract</td>';
            }


        }
    }
    else if (result.json_data.response.data[j].escalation_type_id == 4) {

        if (result.json_data.response.data[j].escalation_sub_type_id == 1) {
            html += '<td>ICF - Global</td>';
        }
        else if (result.json_data.response.data[j].escalation_sub_type_id == 2) {
            html += '<td>ICF - Country</td>';
        }
        else {
            html += '<td>ICF - Site</td>';
        }

    }
    else {
        html += '<td>Budget - ' + result.json_data.response.data[j].choose_an_issue + '</td>';
    }
    if (result.json_data.response.data[j].create_date != null) {
        if (result.json_data.response.data[j].create_date != '0') {
            html += '<td>' + result.json_data.response.data[j].create_date + '</td>';
        }
        else {
            html += '<td class="dots">.....</td>';
        }
    }
    else {
        html += '<td class="dots">.....</td>';
    }
    var escalationManager;
    var action;
    var k;
    var p;
    // if (result.json_data.response.data[j].legal_first_name == null && result.json_data.response.data[j].legal_last_name == null) {
    //     if (result.json_data.response.data[j].escalation_first_name != null) {
    //         if (result.json_data.response.data[j].escalation_first_name != '0') {
    //             if (result.json_data.response.data[j].escalation_last_name != null) {
    //                 if (result.json_data.response.data[j].escalation_last_name != '0') {
    //                     escalationManager = result.json_data.response.data[j].escalation_first_name + " " + result.json_data.response.data[j].escalation_last_name;
    //                     html += '<td>' + escalationManager + '</td>';
    //                 }
    //                 else {
    //                     html += '<td>' + result.json_data.response.data[j].escalation_first_name + '</td>';
    //                 }
    //             }
    //             else {
    //                 html += '<td>' + result.json_data.response.data[j].escalation_first_name + '</td>';
    //             }
    //         }
    //         else {
    //             if (result.json_data.response.data[j].escalation_last_name != null) {
    //                 if (result.json_data.response.data[j].escalation_last_name != '0') {
    //                     html += '<td>' + result.json_data.response.data[j].escalation_last_name + '</td>';
    //                 }
    //                 else {
    //                     html += '<td class="dots">.....</td>';
    //                 }
    //             }
    //             else {
    //                 html += '<td class="dots">.....</td>';
    //             }
    //         }
    //     }
    //     else {
    //         if (result.json_data.response.data[j].escalation_last_name != null) {
    //             if (result.json_data.response.data[j].escalation_last_name != '0') {
    //                 html += '<td>' + result.json_data.response.data[j].escalation_last_name + '</td>';
    //             }
    //             else {
    //                 html += '<td class="dots">.....</td>';
    //             }
    //         }
    //         else {
    //             html += '<td class="dots">.....</td>';
    //         }
    //     }
    // }
    // else {
    //     if (result.json_data.response.data[j].legal_first_name != null) {
    //         if (result.json_data.response.data[j].legal_first_name != '0') {
    //             if (result.json_data.response.data[j].legal_last_name != null) {
    //                 if (result.json_data.response.data[j].legal_last_name != '0') {
    //                     escalationManager = result.json_data.response.data[j].legal_first_name + " " + result.json_data.response.data[j].legal_last_name;
    //                     html += '<td>' + escalationManager + '</td>';
    //                 }
    //                 else {
    //                     html += '<td>' + result.json_data.response.data[j].legal_first_name + '</td>';
    //                 }
    //             }
    //             else {
    //                 html += '<td>' + result.json_data.response.data[j].legal_first_name + '</td>';
    //             }
    //         }
    //         else {
    //             if (result.json_data.response.data[j].legal_last_name != null) {
    //                 if (result.json_data.response.data[j].legal_last_name != '0') {
    //                     html += '<td>' + result.json_data.response.data[j].legal_last_name + '</td>';
    //                 }
    //                 else {
    //                     html += '<td class="dots">.....</td>';
    //                 }
    //             }
    //             else {
    //                 html += '<td class="dots">.....</td>';
    //             }
    //         }
    //     }
    //     else {
    //         if (result.json_data.response.data[j].legal_last_name != null) {
    //             if (result.json_data.response.data[j].legal_last_name != '0') {
    //                 html += '<td>' + result.json_data.response.data[j].legal_last_name + '</td>';
    //             }
    //             else {
    //                 html += '<td class="dots">.....</td>';
    //             }
    //         }
    //         else {
    //             html += '<td class="dots">.....</td>';
    //         }
    //     }
    // }



    // if (result.json_data.response.data[j].manager_action != null) {
    //     if (result.json_data.response.data[j].manager_action != '0') {

    //         if (result.json_data.response.data[j].manager_action != undefined) {
    //             for (p = 0; p < performDisplayArr.length + 1; p++) {
    //                 if (p == result.json_data.response.data[j].manager_action) {
    //                     action = p - 1;
    //                     html += '<td class="' + colorClassArr[action] + '">' + performDisplayArr[action] + '</td>';
    //                 }
    //             }
    //         }
    //         else {
    //             html += '<td class="dots">.....</td>';
    //         }
    //     }
    //     else {

    //         html += '<td class="dots">.....</td>';
    //     }
    // }
    // else {

    //     html += '<td class="dots">.....</td>';
    // }
    html += '<td class="dots">.....</td>';
    html += '<td class="dots">.....</td>';
    html += '<td class="dots">.....</td>';
    html += '<td class="dots">.....</td>';
    html += '<td class="dots">.....</td>';
    html += '<td class="dots">.....</td>';
    // if (result.json_data.response.data[j].legal_action != null) {
    //     if (result.json_data.response.data[j].legal_action != '0') {
    //         if (result.json_data.response.data[j].escalation_type_id == 4) {
    //             //ICF type action
    //             if (result.json_data.response.data[j].escalation_sub_type_id == 1) {
    //                 if (result.json_data.response.data[j].legal_action == 0) {
    //                     html += '<td class="new">New</td>';

    //                 }
    //                 else if (result.json_data.response.data[j].legal_action == 1) {
    //                     html += '<td class="pending">Pending</td>';
    //                 }
    //                 else {
    //                     for (k = 0; k < performArrICFGlobal.length; k++) {
    //                         if (dropDownArrGICF[k] == result.json_data.response.data[j].legal_action) {
    //                             action = k;
    //                             html += '<td class="' + colorClassICFGlobal[action] + '">' + performArrICFGlobal[action] + '</td>';
    //                         }
    //                     }
    //                 }
    //             }
    //             else {
    //                 if (result.json_data.response.data[j].legal_action == 0) {
    //                     html += '<td class="new">New</td>';
    //                 }
    //                 else if (result.json_data.response.data[j].legal_action == 1) {
    //                     html += '<td class="pending">Pending</td>';
    //                 }
    //                 else {
    //                     for (k = 0; k < performArrICFCountrySite.length; k++) {
    //                         if (dropDownArrCSICF[k] == result.json_data.response.data[j].legal_action) {
    //                             action = k;
    //                             html += '<td class="' + colorClassICFCountrySite[action] + '">' + performArrICFCountrySite[action] + '</td>';
    //                         }
    //                     }
    //                 }

    //             }
    //         }
    //         else {
    //             for (p = 0; p < performArr4.length + 1; p++) {
    //                 if (p == result.json_data.response.data[j].legal_action) {
    //                     action = p - 1;
    //                     html += '<td class="' + colorClassArr2[action] + '">' + performArr4[action] + '</td>';
    //                 }
    //             }
    //         }

    //     }
    //     else {
    //         html += '<td class="dots">.....</td>';
    //     }
    // }
    // else {
    //     html += '<td class="dots">.....</td>';
    // }

    // if (result.json_data.response.data[j].legal_action_desc == '' || result.json_data.response.data[j].legal_action_desc == null || result.json_data.response.data[j].legal_action_desc == 'null') {
    //     if (result.json_data.response.data[j].manager_attach_list.replace(/^0+/, '').replace(/^,|,$/g, '') == '' || result.json_data.response.data[j].manager_attach_list == null || result.json_data.response.data[j].manager_attach_list == 'null') {
    //         if (result.json_data.response.data[j].legal_attach_list.replace(/^0+/, '').replace(/^,|,$/g, '') == '' || result.json_data.response.data[j].legal_attach_list == null || result.json_data.response.data[j].legal_attach_list == 'null') {
    //             if (result.json_data.response.data[j].manager_action_desc == 0 || result.json_data.response.data[j].manager_action_desc == '' || result.json_data.response.data[j].manager_action_desc == null || result.json_data.response.data[j].manager_action_desc == 'null') {
    //                 html += '<td class="boxArea">';
    //                 html += '<a href="#" class="btn btn-primary greyAttach disabled txtBtn" id="' + result.json_data.response.data[j].request_id + '">t<font id="' + result.json_data.response.data[j].request_number + '"></font></a>';
    //                 html += '<a href="#" class="btn btn-primary greyAttach disabled imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="images/attchmentIcon.png" /></a>';
    //                 html += '</td>';
    //             }
    //             else {
    //                 if (result.json_data.response.data[j].manager_action_desc == 0) {
    //                     html += '<td class="boxArea">';
    //                     html += '<a href="#" class="btn btn-primary greyAttach disabled txtBtn" id="' + result.json_data.response.data[j].request_id + '">t<font id="' + result.json_data.response.data[j].request_number + '"></font></a>';
    //                     html += '<a href="#" class="btn btn-primary greyAttach disabled imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="images/attchmentIcon.png" /></a>';
    //                     html += '</td>';
    //                 }
    //                 else {
    //                     html += '<td class="boxArea">';
    //                     html += '<a href="#" class="btn btn-primary desAttach txtBtn" id="' + result.json_data.response.data[j].request_id + '">t<font id="' + result.json_data.response.data[j].request_number + '"></font></a>';
    //                     html += '<a href="#" class="btn btn-primary greyAttach disabled imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="images/attchmentIcon.png" /></a>';
    //                     html += '</td>';
    //                 }

    //             }
    //         }
    //         else {
    //             if (result.json_data.response.data[j].manager_action_desc == '' || result.json_data.response.data[j].manager_action_desc == null || result.json_data.response.data[j].manager_action_desc == 'null') {
    //                 html += '<td class="boxArea">';
    //                 html += '<a href="#" class="btn btn-primary greyAttach disabled txtBtn" id="' + result.json_data.response.data[j].request_id + '">t<font id="' + result.json_data.response.data[j].request_number + '"></font></a>';
    //                 html += '<a href="#" class="btn btn-primary desAttach imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="images/attchmentIcon.png" /></a>';
    //                 html += '</td>';
    //             }
    //             else {
    //                 if (result.json_data.response.data[j].manager_action_desc == 0) {
    //                     html += '<td class="boxArea">';
    //                     html += '<a href="#" class="btn btn-primary greyAttach disabled txtBtn" id="' + result.json_data.response.data[j].request_id + '">t<font id="' + result.json_data.response.data[j].request_number + '"></font></a>';
    //                     html += '<a href="#" class="btn btn-primary desAttach imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="images/attchmentIcon.png" /></a>';
    //                     html += '</td>';
    //                 }
    //                 else {
    //                     html += '<td class="boxArea">';
    //                     html += '<a href="#" class="btn btn-primary desAttach txtBtn" id="' + result.json_data.response.data[j].request_id + '">t<font id="' + result.json_data.response.data[j].request_number + '"></font></a>';
    //                     html += '<a href="#" class="btn btn-primary desAttach imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="images/attchmentIcon.png" /></a>';
    //                     html += '</td>';
    //                 }

    //             }
    //         }
    //     }
    //     else {

    //         if (result.json_data.response.data[j].manager_action_desc == '' || result.json_data.response.data[j].manager_action_desc == null || result.json_data.response.data[j].manager_action_desc == 'null') {
    //             html += '<td class="boxArea">';
    //             html += '<a href="#" class="btn btn-primary greyAttach disabled txtBtn" id="' + result.json_data.response.data[j].request_id + '">t<font id="' + result.json_data.response.data[j].request_number + '"></font></a>';
    //             html += '<a href="#" class="btn btn-primary desAttach imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="images/attchmentIcon.png" /></a>';
    //             html += '</td>';
    //         }
    //         else {
    //             html += '<td class="boxArea">';
    //             html += '<a href="#" class="btn btn-primary desAttach txtBtn" id="' + result.json_data.response.data[j].request_id + '">t<font id="' + result.json_data.response.data[j].request_number + '"></font></a>';
    //             html += '<a href="#" class="btn btn-primary desAttach imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="images/attchmentIcon.png" /></a>';
    //             html += '</td>';
    //         }
    //     }
    // }
    // else {
    //     if (result.json_data.response.data[j].manager_attach_list.replace(/^0+/, '').replace(/^,|,$/g, '') == '' || result.json_data.response.data[j].manager_attach_list == null || result.json_data.response.data[j].manager_attach_list == 'null') {
    //         if (result.json_data.response.data[j].legal_attach_list.replace(/^0+/, '').replace(/^,|,$/g, '') == '' || result.json_data.response.data[j].legal_attach_list == null || result.json_data.response.data[j].legal_attach_list == 'null') {
    //             html += '<td class="boxArea">';
    //             html += '<a href="#" class="btn btn-primary desAttach txtBtn" id="' + result.json_data.response.data[j].request_id + '">t<font id="' + result.json_data.response.data[j].request_number + '"></font></a>';
    //             html += '<a href="#" class="btn btn-primary greyAttach disabled imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="images/attchmentIcon.png" /></a>';
    //             html += '</td>';
    //         }
    //         else {
    //             html += '<td class="boxArea">';
    //             html += '<a href="#" class="btn btn-primary desAttach txtBtn" id="' + result.json_data.response.data[j].request_id + '">t<font id="' + result.json_data.response.data[j].request_number + '"></font></a>';
    //             html += '<a href="#" class="btn btn-primary desAttach imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="images/attchmentIcon.png" /></a>';
    //             html += '</td>';
    //         }
    //     }
    //     else {
    //         html += '<td class="boxArea">';
    //         html += '<a href="#" class="btn btn-primary desAttach txtBtn" id="' + result.json_data.response.data[j].request_id + '">t<font id="' + result.json_data.response.data[j].request_number + '"></font></a>';
    //         html += '<a href="#" class="btn btn-primary desAttach imgIcon" id="' + result.json_data.response.data[j].request_id + '"><img class="img-responsive attach_Icon" id="' + result.json_data.response.data[j].request_number + '" src="images/attchmentIcon.png" /></a>';
    //         html += '</td>';
    //     }

    // }

    // if (result.json_data.response.data[j].resolution_date != null) {
    //     if (result.json_data.response.data[j].resolution_date != "0000-00-00 00:00:00") {
    //         html += '<td>' + result.json_data.response.data[j].resolution_date + '</td>';
    //     }
    //     else {
    //         html += '<td>.....</td>';
    //     }
    // }
    // else {
    //     html += '<td>.....</td>';
    // }
    html += '</tr>';

    $('.content-wrapper .tableMainContainer .tbodyContainer').append(html);

}
function appendTable(result){
    for (var j = 0; j < result.json_data.response.data.length; j++) {
        if (result.json_data.response.data[j].manager_action != null) {
            html += '<tr>'
            if (result.json_data.response.data[j].request_number != null) {
                protocol = result.json_data.response.data[j].request_number + "-" + result.json_data.response.data[j].protocol_number;
                //html += '<td>' + result.json_data.response.data[j].create_date + '</td>';
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><span id="' + result.json_data.response.data[j].escalation_type_id + '"></span><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
            }
            else {
                protocol = result.json_data.response.data[j].protocol_number;
                //html += '<td>' + result.json_data.response.data[j].create_date + '</td>';
                html += '<td class="requestNo" id="' + result.json_data.response.data[j].request_id + '"><a href="#" id="' + result.json_data.response.data[j].request_number + '">' + protocol + '<br>' + result.json_data.response.data[j].sitename + '</a></td>';
            }

            if (result.json_data.response.data[j].escalation_type_id == 2) {
                if (result.json_data.response.data[j].type_issues !== '0' && result.json_data.response.data[j].type_issues !== null) {
                    if (result.json_data.response.data[j].type_contract_language !== null && result.json_data.response.data[j].type_contract_language !== '0') {
                        html += '<td>Contract - ' + result.json_data.response.data[j].type_contract_language + ' - ' + result.json_data.response.data[j].type_issues + '</td>';
                    }
                    else {
                        html += '<td>Contract - ' + result.json_data.response.data[j].type_issues+ '</td>';
                    }
                }
                else {
                    if (result.json_data.response.data[j].type_contract_language !== null && result.json_data.response.data[j].type_contract_language !== '0') {
                        html += '<td>Contract - ' + result.json_data.response.data[j].type_contract_language + '</td>';
                    }
                    else {
                        html += '<td>Contract</td>';
                    }
                }
            }
            // else if (result.json_data.response.data[j].escalation_type_id == 4) {
            // }
            else {
                html += '<td>Budget - ' + result.json_data.response.data[j].choose_an_issue + '</td>';
            }

            if (result.json_data.response.data[j].create_date !== null && result.json_data.response.data[j].create_date !== '0') {
                html += '<td>' + result.json_data.response.data[j].create_date + '</td>';
            }
            else {
                html += '<td class="dots">.....</td>';
            }

            if (result.json_data.response.data[j].legal_first_name === null && result.json_data.response.data[j].legal_last_name === null) {
                if (result.json_data.response.data[j].escalation_first_name !== null && result.json_data.response.data[j].escalation_first_name !== '0') {
                    if (result.json_data.response.data[j].escalation_last_name !== null && result.json_data.response.data[j].escalation_last_name !== '0') {
                        html += '<td>' + result.json_data.response.data[j].escalation_first_name + " " + result.json_data.response.data[j].escalation_last_name + '</td>';
                    }
                    else {
                        html += '<td>' + result.json_data.response.data[j].escalation_first_name + '</td>';
                    }
                }
                else {
                    if (result.json_data.response.data[j].escalation_last_name !== null && result.json_data.response.data[j].escalation_last_name !== '0') {
                        html += '<td>' + result.json_data.response.data[j].escalation_last_name + '</td>';
                    }
                    else {
                        html += '<td class="dots">.....</td>';
                    }
                }
            }
            else {
                if (result.json_data.response.data[j].legal_first_name != '0' && result.json_data.response.data[j].legal_last_name != '0') {
                    html += '<td class="dots">.....</td>';
                }
            }
            
            html += '<td>Contract - ' + result.json_data.response.data[j].type_issues+ '</td>';
            html += '<td>Contract - ' + result.json_data.response.data[j].type_issues+ '</td>';
            html += '<td>Contract - ' + result.json_data.response.data[j].type_issues+ '</td>';
            html += '<td>Contract - ' + result.json_data.response.data[j].type_issues+ '</td>';
        
            html += '</tr>'
        }       
    }
}
/*****Request number popup start here*****/
function requestNoPopup(requestId, escalationTypeId, result, escalationResult, request_number, managerType) {
   
    $.ajax({
        url: serviceHTTPPath + "viewCroRequestID",
        type: "POST",
        dataType: 'json',
        data: { request_id: requestId, escalation_type_id: escalationTypeId },
        success: function (viewCroResult) {
            loaderRemoveFun();
            var userType = window.localStorage.getItem('userType');        
                        
            if (viewCroResult.json_data.response != 0) {
                displayFormDetail()
            }
        },
        error: function (e) {
            loaderRemoveFun();
            return;
        }
    });
}
function displayFormDetail(){
    $('#myModal').remove();
	$('.modal-backdrop').remove();	
	var html = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
	html += '<div class="vertical-alignment-helper">';
                html += '<div class="modal-dialog vertical-align-center checklistModel" id="checklistModel">';
                html += '<div class="modal-content">';
                    html += '<div class="modal-header">';
                    html += '<button type="button" class="close crossIcon"';
                        html += 'data-dismiss="modal">';
                        html += '<span aria-hidden="true">&times;</span>'
                    html += '</button>';

                    html += '</div>';

                    html += '<div class="modal-body checkListPopup" id="requestNoBody">';
                        html += '<div class="bg-white" id="checkListDiv">';
                     
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
	});
}