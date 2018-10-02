// Protocol and Site common popup
function addProtocolSite(type){
    var nameSet = "";
    var addBtn = "";
    var title = "";
    var addServicePath="";
    var addParameter = "";
    if(type == "protocol"){
        nameSet = 'Protocol Management';
        title = "Protocol Number";
        addBtn = 'Add Protocol'
        addServicePath = "addProtocol";
        addParameter = "protocol_name";
        protocolWebService(type);
    }else{
        nameSet = 'Site Management';
        title = "Site Name";
        addBtn = 'Add Site'
        addServicePath = "addSitename";
        addParameter = "sitename";
        siteNameWebService(type);
    }
    
    loaderLogin();
 
	$('.modal-backdrop').remove();
    $('body #myModal').remove();
    $('.bgForLoader').remove();
	var html = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModal" aria-hidden="true">';
	html += '<div class="vertical-alignment-helper">';
	html += '<div class="modal-dialog vertical-align-center modal-lg">';
	html += '<div class="modal-content">';
	html += '<div class="modal-header">';
		html += '<button type="button" class="close crossIcon"';
			html += 'data-dismiss="modal">';
			html += '<span aria-hidden="true">&times;</span>'		
		html += '</button>';

    	html += '<h4 class="modal-title" id="">'+nameSet+'</h4>';
	html += '</div>';

	html += '<div class="modal-body siteProtocolModal" id="requestNoBody">';
		html += '<div class="row marginClass">';

			html += '<div class="fluid-container">';
			
		     html += '<div style="width: 100%;" class="titleType">'+title+'</div>';
            
                html += '<div class="col-xs-12 col-sm-12 col-lg-12" style="margin-top: 5px;">';
                html += '<div id="" class="tableWidth">';
                    html += '<div id="" class="addAndSearch">';
                       // Add Protocol and Site button
                        html += '<a href="#" class="btn addSiteProtocol">'+addBtn+'</a>'

                        // Add Protocol and Site Input
                        html += '<div id="" class="inputProtocolSite" style="display:none;">';
                            html += '<div style="display: inline-block;margin-top: 10px;" class="PSdiv"><input type="text" name="checkbox1" id="addProtocolText" placeholder="'+addBtn+'" class="box-boder"/></div>';
                           // html += '<span class="btn addBtnDiv" id="addProtocol2" style="">ADD</span>';
                            html += '<a href="#" class="btn addBtnDiv" id="addbtnSiteP">ADD</a>'
                        html += '</div>'

                        // Search Input
                        html += '<div class="form-group has-success has-feedback">'
                            html += '<label class="control-label" for="searchboxSiteProtocol"></label>'
                            html += '<span class="glyphicon glyphicon-search form-control-feedback" id="searchIcon"></span>'
                            html += '<input type="text" class="form-control" id="searchboxSiteProtocol" placeholder="Search">'                            
                        html += '</div>'
                        //html += '<input type="text" id="searchboxSiteProtocol">'
                    html += '</div>'

                        html += '<div id="" class="tableHeight">';        
                        html += '</div>';                
                     html += '</div>';
				html += '</div>';
			html += '</div>'

		html += '</div>'
	html += '</div>'

	html += '<div class="modal-footer footerSiteProtocol">';
	 html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="popupOkBtn">DONE</button>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';

	$('body').append(html);
    $('#myModal').modal();    
    
    tableAdd();

    $('.crossIcon').click(function(){
        $('.modal-backdrop').remove();
    })
    
   
    $('.addSiteProtocol').click(function(){
        $('.addSiteProtocol').css("display","none");
        $('.inputProtocolSite').css("display","inline-block");
    });
   
    //Add Button click event
    $('#addbtnSiteP').click(function (e) {
        if ($('#addProtocolText').val() != '') {
            if(type == "protocol"){
                $.ajax({
                    url: serviceHTTPPath + "addProtocol",
                    type: "POST",
                    dataType: 'json',
                    headers: {
                        "authorization": window.localStorage.getItem("token_id")
                    }, 
                
                    data:
                        {
                            protocol_name: $('#addProtocolText').val(),
                        },
                    success: function (result) {
                        //alert("success="+JSON.stringify(result))
                        $('#addProtocolText').val(''); 
                        $('.addSiteProtocol').css("display","block");   
                        $('.inputProtocolSite').css("display","none");  
                                  
                        tableAdd();
                        protocolWebService(type);                    
                    },
                    error: function (e) {
                        return;
                    }
                });
            }else{
                $.ajax({
                    url: serviceHTTPPath + "addSitename",
                    type: "POST",
                    dataType: 'json',
                    headers: {
                        "authorization": window.localStorage.getItem("token_id")
                    }, 
                
                    data:
                        {
                            sitename: $('#addProtocolText').val(),
                        },
                    success: function (result) {
                        //alert("success=-"+JSON.stringify(result))
                        $('#addProtocolText').val('');
                        $('.addSiteProtocol').css("display","block");  
                        $('.inputProtocolSite').css("display","none");                     
                        tableAdd();
                        siteNameWebService(type);
                    
                    },
                    error: function (e) {
                        return;
                    }
                });
            }
        }
        else{
            alertScreen("Please enter protocol first",'')
        }
    });
	
	$('#popupOkBtn').click(function (e) {	
		loaderRemoveFun();	
	});
	$('#myModal').on('hidden.bs.modal', function (e) {	
        loaderRemoveFun();
	});
}
function tableAdd(){
    $('#example2_wrapper').remove();
    $('.tableHeight table').remove();
    var html = '<table id="example2" class="table table-responsive display nowrap">';
                html += '<thead class="thead">';
                    html += '<tr id="tableHead">';
                        html += '<th></th>';
                        html += '<th></th>';
                    html += '</tr>';
                html += '</thead>';

                html += '<tbody class="tbodyHeight" id="protocolTbody">';                                						
                html += '</tbody>';
         html += '</table>';
       
    $('.tableHeight').append(html)
}
/*****Protocol Web Service call function start here*****/
function protocolWebService(type) {
    loaderLogin();
    $.ajax({
        url: serviceHTTPPath + "listProtocols",
        type: "GET",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        }, 
        success: function (result) {
            //alert("success="+JSON.stringify(result))           
            $('#protocolTbody').css("opacity","0")
            $('#protocolTbody tr').remove();
            var html = '';           
            for (var i = 0; i < result.json_data.response.length; i++) {
                html += '<tr>';
                html += '<td id="protocolTxt' + i + '" style="white-space: normal;"><span>' + result.json_data.response[i].protocol_number + '</span><input type="text" style="display:none;background: #fff;" name="checkbox1" id="addProtocolText" placeholder="Protocol Number" class="box-boder"/></td>'
                html += '<td class="text-center" id="protocolEditDel' + i + '"><span id="' + result.json_data.response[i].protocol_id + '"><img id="deleteId' + i + '" class="deleteProtocol" src="../images/delete_btn.png" /></span><span id="' + result.json_data.response[i].protocol_id + '" class="' + result.json_data.response[i].protocol_number + '"><em  id="'+i+'"><img class="editProtocol" id="editId' + i + '" src="../images/edit_btn.png" /></em></span><a href="#" class="btn midSiz editSiteProtocol" id="addProtocol" style="display:none;">Add</a></td>';
               
                html += '</tr>';  
    
            }
            $('#protocolTbody').append(html);   
            
        
            /*****Edit Protocol click event start here*****/
            $('#example2 tbody').on('click', '.editProtocol', function (e) {            
                var index =$(this).parent(this).attr('id')
                var protocol_id = $(this).parent().parent().attr('id');
                var protocol_number = $(this).parent().parent().attr('class');
                
                $('#protocolTxt' + index+' span').css("display", "none");
                $('#protocolEditDel' + index+' img').css("display", "none");

                $('#protocolTxt' + index + ' input').val(protocol_number);
                $('#protocolTxt' + index+' input').css("display", "block");
                $('#protocolEditDel' + index+' a').css("display", "block");                

                $('#protocolEditDel' + index+' a').click(function (e) {
                    if ($('#protocolTxt' + index+' input').val() != '') {
                        $.ajax({
                            url: serviceHTTPPath + "editProtocol",
                            type: "POST",
                            dataType: 'json',
                            headers: {
                                "authorization": window.localStorage.getItem("token_id")
                            },
                            data:
                                {
                                    protocol_id: protocol_id,
                                    protocol_name: $('#protocolTxt' + index + ' input').val(),
                                },
                            success: function (result) {
                                tableAdd();
                                protocolWebService(type);
                            },
                            error: function (e) {
                                return;
                            }
                        })
                    }
                });

            });
            /*****Edit Protocol click event end here*****/

            /*****Delete Protocol click event start here*****/
            $('#example2 tbody').on('click', '.deleteProtocol', function (e) {            
                var index = $(this).parent().attr('id');
               
                // Call in js/popup.js
                var protocolIdVal = $(this).parent().attr('id');               
                deleteRow(protocolIdVal,type)            

            });
            /*****Delete Protocol click event end here*****/

            dataTableSiteProtocol();
        },
        error: function (e) {
            
            return;
        }
    });
}
/*****Protocol Web Service call function end here*****/
function dataTableSiteProtocol(){
    setTimeout(function(){	
        loaderRemoveFun();
        $('#protocolTbody').css("opacity","1")
       
        $('#example2').DataTable({
            columnDefs: [
                { width: '90%', targets: 0 },
                { width: '10%', targets: 1 }
            ],  
            "scrollX": true,           
            "fixedColumns": true,
            "fixedHeader": true,
            "bJQueryUI": true,
            "bAutoWidth": true,        
            'responsive': false,
            "autoWidth": false,
            "scrollCollapse": false,
            "paging": true,
            "lengthChange": false,    
            "order": [[ 0, "desc" ]], 
            'searching'   : true,     
              
            "language": {
            "search": "_INPUT_",
            "searchPlaceholder": "Search..."
        },       
        });  

        var table = $('#example2').DataTable();
        $('#searchboxSiteProtocol').on('keyup change', function () {
            table.search(this.value).draw();
        }); 
    }, 100); 

  
}
/*****Site Name Web Service call function start here*****/
function siteNameWebService(type) {
    loaderLogin();
    $.ajax({
        url: serviceHTTPPath + "listSitename",
        type: "GET",
        dataType: 'json',
        headers: {
            "authorization": window.localStorage.getItem("token_id")
        }, 
        success: function (result) {          
            $('#protocolTbody').css("opacity","0")
            $('#protocolTbody tr').remove();
            var html = '';

            for (var i = 0; i < result.json_data.response.length; i++) {
                
     
                html += '<tr>';
                html += '<td id="editSiteName' + i + '" style="white-space: normal;"><span>' + result.json_data.response[i].sitename + '</span> <input style="display:none;background: #fff;" type="text" name="checkbox1" id="addSiteText" placeholder="Site Name" class="box-boder"/></td>';
                html += '<td class="text-center" id="editDel' + i + '"><span id="' + result.json_data.response[i].sitename_id + '"><img class="deleteSite" src="../images/delete_btn.png" /></span><span id="' + result.json_data.response[i].sitename_id + '" class="' + result.json_data.response[i].sitename + '"><em  id="'+i+'"><img class="editSite" src="../images/edit_btn.png" /></em></span><a href="#" class="btn midSiz editSiteProtocol" id="editBtnSave' + i + '"style="display:none;">Add</a></td>';
                html += '</tr>';

            }

            $('#protocolTbody').append(html);          
           
            /*****Edit site click event start here*****/
            $('#example2 tbody').on('click', '.editSite', function (e) {            
                var index =$(this).parent(this).attr('id')
                var sitename_id = $(this).parent().parent().attr('id')
                var sitename = $(this).parent().parent().attr('class')

                $('#editSiteName' + index+' span').css("display", "none");
                $('#editDel' + index+' img').css("display", "none");

                $('#editSiteName' + index + ' input').val(sitename);

                $('#editSiteName' + index+' input').css("display", "block");
                $('#editDel' + index+' a').css("display", "block");

                $('#editDel' + index+' a').click(function (e) {
                    if ($('#editSiteName' + index+' input').val() != '') {
                        $.ajax({
                            url: serviceHTTPPath + "editSitename",
                            type: "POST",
                            dataType: 'json',
                            headers: {
                                "authorization": window.localStorage.getItem("token_id")
                            }, 
                            data:
                                {
                                    sitename_id: sitename_id,
                                    sitename: $('#editSiteName' + index + ' input').val(),
                                },
                            success: function (result) {
                                tableAdd();
                                siteNameWebService(type);
                            },
                            error: function (e) {

                                return;
                            }
                        })
                    }
                });

            });
            /*****Edit site click event end here*****/

            /*****Delete site click event start here*****/
            $('#example2 tbody').on('click', '.deleteSite', function (e) {            
                var index = $('.deleteSite').index(this);
                // Call in js/popup.js
                var siteIdVal = $(this).parent().attr('id');             
                deleteRow(siteIdVal,type)
            });
            /*****Delete site click event end here*****/

            dataTableSiteProtocol();
        },
        error: function (e) {
            loaderRemoveFun();
            return;
        }
    });
}
/*****Site Name Web Service call function end here*****/
