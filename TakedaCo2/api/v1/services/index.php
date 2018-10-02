<?php
#ini_set('display_errors', 1);
if ($_GET['debug'] == 1) {
    ini_set('display_errors', 1);
}

header('Content-type: application/json');
header("access-control-allow-origin: *");
require_once('../model/class.Functions.php');

function __autoload($class_name) {
    include $class_name . ".class.php";
}

$funcObject = new functions();

try {
    $postInput = array();
    $response = array();

    // Handling the supported actions:
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $postInput = $_POST;
    }

    switch (isset($_GET['action']) ? ($_GET['action']) : 'Wrong') {

        case 'registerUser':
            $data['first_name'] = isset($_POST['first_name']) ? $_POST['first_name'] : '';
            $data['last_name'] = isset($_POST['last_name']) ? $_POST['last_name'] : '';
            $data['email'] = isset($_POST['email']) ? $_POST['email'] : '';
            $data['user_type'] = isset($_POST['user_type']) ? $_POST['user_type'] : '';
            $data['password'] = isset($_POST['password']) ? $_POST['password'] : '';
            $data['country'] = isset($_POST['country']) ? $_POST['country'] : '';
            $data['phone'] = isset($_POST['phone']) ? $_POST['phone'] : '';
            $data['status'] = isset($_POST['status']) ? $_POST['status'] : '';

            $data['esc_type_id'] = isset($_POST['esc_type_id']) ? $_POST['esc_type_id'] : '';
            $data['esc_sub_type_id'] = isset($_POST['esc_sub_type_id']) ? $_POST['esc_sub_type_id'] : '';
            
            $data['analatics'] = isset($_POST['analatics']) ? $_POST['analatics'] : '';
            $data['user_management'] = isset($_POST['user_management']) ? $_POST['user_management'] : '';
            $data['budgetDirect'] = isset($_POST['budgetDirect']) ? $_POST['budgetDirect'] : '';
            $data['contractDirect'] = isset($_POST['contractDirect']) ? $_POST['contractDirect'] : '';

            $loginAppUserobj = new LoginAppUser;
            $response = $loginAppUserobj->registerUser($data);
            break;
        
        case 'editUser':
            $data['user_id'] = isset($_POST['user_id']) ? $_POST['user_id'] : '';
            $data['first_name'] = isset($_POST['first_name']) ? $_POST['first_name'] : '';
            $data['last_name'] = isset($_POST['last_name']) ? $_POST['last_name'] : '';
            $data['user_type'] = isset($_POST['user_type']) ? $_POST['user_type'] : '';

            $data['esc_type_id'] = isset($_POST['esc_type_id']) ? $_POST['esc_type_id'] : '';
            $data['esc_sub_type_id'] = isset($_POST['esc_sub_type_id']) ? $_POST['esc_sub_type_id'] : '';

            $data['analatics'] = isset($_POST['analatics']) ? $_POST['analatics'] : '';
            $data['user_management'] = isset($_POST['user_management']) ? $_POST['user_management'] : '';
            $data['budgetDirect'] = isset($_POST['budgetDirect']) ? $_POST['budgetDirect'] : '';
            $data['contractDirect'] = isset($_POST['contractDirect']) ? $_POST['contractDirect'] : '';
            
            $loginAppUserobj = new LoginAppUser;
            $response = $loginAppUserobj->editUser($data);
            break;

        case 'authenticateUser':
            $data['email'] = isset($_POST['email']) ? $_POST['email'] : '';
            $data['password'] = isset($_POST['password']) ? $_POST['password'] : '';
            $data['type_id'] = isset($_POST['type_id']) ? $_POST['type_id'] : '';
            $loginAppUserobj = new LoginAppUser;
            $response = $loginAppUserobj->authenticateUser($data);
            break;
        
        case 'authenticateSso':
            $data['email'] = isset($_POST['email']) ? $_POST['email'] : '';
            $data['password'] = isset($_POST['password']) ? $_POST['password'] : '';
            $loginAppUserobj = new LoginAppUser;
            $response = $loginAppUserobj->authenticateSso($data);
            break;

        case 'validateToken':
            $loginAppUserobj = new LoginAppUser;
            $response = $loginAppUserobj->validateToken();
            break;
        
        case 'userDetails':
            $loginAppUserobj = new LoginAppUser;
            $data['user_id'] = isset($_POST['user_id']) ? $_POST['user_id'] : '';
            $response = $loginAppUserobj->userDetails($data);
            break;
        
        case 'ssoUserLogin':
            $data['email'] = isset($_POST['email']) ? $_POST['email'] : '';
            $data['userRole_id'] = isset($_POST['userRole_id']) ? $_POST['userRole_id'] : '';
            $loginAppUserobj = new LoginAppUser;
            $response = $loginAppUserobj->ssoUserLogin($data);
            break;

        case 'listEscalation':
            $loginAppUserobj = new LoginAppUser;
            $response = $loginAppUserobj->listEscalation();
            break;

        case 'addProtocol':
            $data['protocol_name'] = isset($_POST['protocol_name']) ? $_POST['protocol_name'] : '';
            $protocolobj = new Protocol;
            $response = $protocolobj->addProtocol($data);
            break;

        case 'listProtocols':
            $data['protocol_name'] = isset($_POST['protocol_name']) ? $_POST['protocol_name'] : '';
            $protocolobj = new Protocol;
            $response = $protocolobj->listProtocols($data);
            break;

        case 'deleteProtocol':
            $data['protocol_id'] = isset($_POST['protocol_id']) ? $_POST['protocol_id'] : '';
            $protocolobj = new Protocol;
            $response = $protocolobj->deleteProtocol($data);
            break;

        case 'editProtocol':
            $data['protocol_id'] = isset($_POST['protocol_id']) ? $_POST['protocol_id'] : '';
            $data['protocol_name'] = isset($_POST['protocol_name']) ? $_POST['protocol_name'] : '';
            $protocolobj = new Protocol;
            $response = $protocolobj->editProtocol($data);
            break;

        case 'addSitename':
            $data['sitename'] = isset($_POST['sitename']) ? $_POST['sitename'] : '';
            $sitenameobj = new Sitename;
            $response = $sitenameobj->addSitename($data);
            break;

        case 'listSitename':
            $data['sitename'] = isset($_POST['sitename']) ? $_POST['sitename'] : '';
            $sitenameobj = new Sitename;
            $response = $sitenameobj->listSitename($data);
            break;

        case 'deleteSitename':
            $data['sitename_id'] = isset($_POST['sitename_id']) ? $_POST['sitename_id'] : '';
            $sitenameobj = new Sitename;
            $response = $sitenameobj->deleteSitename($data);
            break;

        case 'editSitename':
            $data['sitename_id'] = isset($_POST['sitename_id']) ? $_POST['sitename_id'] : '';
            $data['sitename'] = isset($_POST['sitename']) ? $_POST['sitename'] : '';
            $sitenameobj = new Sitename;
            $response = $sitenameobj->editSitename($data);
            break;

        case 'listCountry':
            $loginAppUserobj = new LoginAppUser;
            $data['region_id'] = isset($_POST['region_id']) ? $_POST['region_id'] : '';
            $response = $loginAppUserobj->listCountry($data);
            break;

        case 'saveBudgetEscalation':
            $data['user_id'] = isset($_POST['user_id']) ? $_POST['user_id'] : '';
            $data['escalation_type_id'] = isset($_POST['escalation_type_id']) ? $_POST['escalation_type_id'] : '';
            $data['protocol_id'] = isset($_POST['protocol_id']) ? $_POST['protocol_id'] : '';
            $data['sitename'] = isset($_POST['sitename']) ? $_POST['sitename'] : '';
            $data['country'] = isset($_POST['country']) ? $_POST['country'] : '';

            $data['raised_by'] = isset($_POST['raised_by']) ? $_POST['raised_by'] : '';
            $data['principle_investigator'] = isset($_POST['principle_investigator']) ? $_POST['principle_investigator'] : '';
            $data['requested_by'] = isset($_POST['requested_by']) ? $_POST['requested_by'] : '';

            $data['followUp'] = isset($_POST['followUp']) ? $_POST['followUp'] : '';
            $data['esc_id'] = isset($_POST['esc_id']) ? $_POST['esc_id'] : '';

            $data['choose_issue'] = isset($_POST['choose_issue']) ? $_POST['choose_issue'] : '';
            $data['desc_issue'] = isset($_POST['desc_issue']) ? $_POST['desc_issue'] : '';
            $data['site_request'] = isset($_POST['site_request']) ? $_POST['site_request'] : '';
            $data['initial_offer'] = isset($_POST['initial_offer']) ? $_POST['initial_offer'] : '';
            $data['percent_over_initial'] = isset($_POST['percent_over_initial']) ? $_POST['percent_over_initial'] : '';
            $data['fmv_high'] = isset($_POST['fmv_high']) ? $_POST['fmv_high'] : '';
            $data['percent_over_fmv'] = isset($_POST['percent_over_fmv']) ? $_POST['percent_over_fmv'] : '';
            $data['site_justification'] = isset($_POST['site_justification']) ? $_POST['site_justification'] : '';
            $data['anyother_details'] = isset($_POST['anyother_details']) ? $_POST['anyother_details'] : '';
            $data['do_add_attachment'] = isset($_POST['do_add_attachment']) ? $_POST['do_add_attachment'] : '';
            $data['request_id'] = isset($_POST['request_id']) ? $_POST['request_id'] : '';
            $data['attachment_file_ids'] = isset($_POST['attachment_file_ids']) ? $_POST['attachment_file_ids'] : '';
            $data['currency_type'] = isset($_POST['currency_type']) ? $_POST['currency_type'] : '';

            $data['highPriority'] = isset($_POST['highPriority']) ? $_POST['highPriority'] : '';
            $data['selectPriority'] = isset($_POST['selectPriority']) ? $_POST['selectPriority'] : '';
            $data['priorityReason'] = isset($_POST['priorityReason']) ? $_POST['priorityReason'] : '';
            $data['cc_email'] = isset($_POST['cc_email']) ? $_POST['cc_email'] : '';

            $saveRequestsobj = new SaveRequests;
            $response = $saveRequestsobj->saveBudgetEscalation($data);
            break;

        case 'saveLanguageEscalation':
            $data['user_id'] = isset($_POST['user_id']) ? $_POST['user_id'] : '';
            $data['escalation_type_id'] = isset($_POST['escalation_type_id']) ? $_POST['escalation_type_id'] : '';
            $data['protocol_id'] = isset($_POST['protocol_id']) ? $_POST['protocol_id'] : '';
            $data['sitename'] = isset($_POST['sitename']) ? $_POST['sitename'] : '';
            $data['country'] = isset($_POST['country']) ? $_POST['country'] : '';

            $data['raised_by'] = isset($_POST['raised_by']) ? $_POST['raised_by'] : '';
            $data['principle_investigator'] = isset($_POST['principle_investigator']) ? $_POST['principle_investigator'] : '';
            $data['requested_by'] = isset($_POST['requested_by']) ? $_POST['requested_by'] : '';

            $data['followUp'] = isset($_POST['followUp']) ? $_POST['followUp'] : '';
            $data['esc_id'] = isset($_POST['esc_id']) ? $_POST['esc_id'] : '';

            $data['type_contract'] = isset($_POST['type_contract']) ? $_POST['type_contract'] : '';
            $data['type_issues'] = isset($_POST['type_issues']) ? $_POST['type_issues'] : '';
            $data['proposed_language'] = isset($_POST['proposed_language']) ? $_POST['proposed_language'] : '';
            $data['site_rationale'] = isset($_POST['site_rationale']) ? $_POST['site_rationale'] : '';
            $data['do_add_attachment'] = isset($_POST['do_add_attachment']) ? $_POST['do_add_attachment'] : '';
            $data['attempts_negotiate'] = isset($_POST['attempts_negotiate']) ? $_POST['attempts_negotiate'] : '';
            $data['other_detail'] = isset($_POST['other_detail']) ? $_POST['other_detail'] : '';
            $data['request_id'] = isset($_POST['request_id']) ? $_POST['request_id'] : '';
            $data['attachment_file_ids'] = isset($_POST['attachment_file_ids']) ? $_POST['attachment_file_ids'] : '';

            $data['highPriority'] = isset($_POST['highPriority']) ? $_POST['highPriority'] : '';
            $data['selectPriority'] = isset($_POST['selectPriority']) ? $_POST['selectPriority'] : '';
            $data['priorityReason'] = isset($_POST['priorityReason']) ? $_POST['priorityReason'] : '';
            $data['cc_email'] = isset($_POST['cc_email']) ? $_POST['cc_email'] : '';

            $saveRequestsobj = new SaveRequests;
            $response = $saveRequestsobj->saveLanguageEscalation($data);
            break;

        case 'displayCroRequest':
            $data['cro_id'] = isset($_POST['cro_id']) ? $_POST['cro_id'] : '';
            $data['startDate'] = isset($_POST['startDate']) ? $_POST['startDate'] : '';
            $data['endDate'] = isset($_POST['endDate']) ? $_POST['endDate'] : '';
            $data['dashOrArchive'] = isset($_POST['dashOrArchive']) ? $_POST['dashOrArchive'] : '';
            $loginAppUserobj = new LoginAppUser;
            $response = $loginAppUserobj->displayCroRequest($data);
            break;

        case 'uploadAttachment':
            $attachmentsobj = new Attachments;
            $response = $attachmentsobj->uploadAttachment();
            break;

        case 'attachmentIdsList':
            $data['attachmentIds'] = isset($_POST['attachmentIds']) ? $_POST['attachmentIds'] : '';
            $attachmentsobj = new Attachments;
            $response = $attachmentsobj->attachmentIdsList($data);
            break;

        case 'userRoles':
            $loginAppUserobj = new LoginAppUser;
            $response = $loginAppUserobj->userRoles();
            break;

        case 'viewCroRequestID':
            $data['request_id'] = isset($_POST['request_id']) ? $_POST['request_id'] : '';
            $data['escalation_type_id'] = isset($_POST['escalation_type_id']) ? $_POST['escalation_type_id'] : '';
            $loginAppUserobj = new LoginAppUser;
            $response = $loginAppUserobj->viewCroRequestID($data);
            break;

        case 'currencyList':
            $loginAppUserobj = new LoginAppUser;
            $response = $loginAppUserobj->currencyList();
            break;

        case 'viewManagerRequest':
            $data['manager_id'] = isset($_POST['manager_id']) ? $_POST['manager_id'] : '';
            $data['startDate'] = isset($_POST['startDate']) ? $_POST['startDate'] : '';
            $data['endDate'] = isset($_POST['endDate']) ? $_POST['endDate'] : '';
            $loginAppUserobj = new LoginAppUser;
            $response = $loginAppUserobj->viewManagerRequest($data);
            break;

        case 'viewLegalRequest':
            $data['legal_id'] = isset($_POST['legal_id']) ? $_POST['legal_id'] : '';
            $data['startDate'] = isset($_POST['startDate']) ? $_POST['startDate'] : '';
            $data['endDate'] = isset($_POST['endDate']) ? $_POST['endDate'] : '';
            $loginAppUserobj = new LoginAppUser;
            $response = $loginAppUserobj->viewLegalRequest($data);
            break;

        case 'escalationManagerAction':
            $data['manager_action_id'] = isset($_POST['manager_action_id']) ? $_POST['manager_action_id'] : '';
            $data['issue_id'] = isset($_POST['issue_id']) ? $_POST['issue_id'] : '';
            $data['status'] = isset($_POST['status']) ? $_POST['status'] : '';
            $data['desc'] = isset($_POST['desc']) ? $_POST['desc'] : '';
            $data['attachment'] = isset($_POST['attachment']) ? $_POST['attachment'] : '';
            $data['coe_id'] = isset($_POST['coe_id']) ? $_POST['coe_id'] : '';
            $data['role_id'] = isset($_POST['role_id']) ? $_POST['role_id'] : '';
            $performActionobj = new PerformAction;
            $response = $performActionobj->escalationManagerAction($data);
            break;

        case 'legalAction':
            $data['legal_action_id'] = isset($_POST['legal_action_id']) ? $_POST['legal_action_id'] : '';
            $data['issue_id'] = isset($_POST['issue_id']) ? $_POST['issue_id'] : '';
            $data['status'] = isset($_POST['status']) ? $_POST['status'] : '';
            $data['desc'] = isset($_POST['desc']) ? $_POST['desc'] : '';
            $data['attachment'] = isset($_POST['attachment']) ? $_POST['attachment'] : '';
            $data['coe_id'] = isset($_POST['coe_id']) ? $_POST['coe_id'] : '';
            $data['role_id'] = isset($_POST['role_id']) ? $_POST['role_id'] : '';

            $performActionobj = new PerformAction;
            $response = $performActionobj->legalAction($data);
            break;

        case 'forgotPassword':
            $data['email'] = isset($_POST['email']) ? $_POST['email'] : '';
            $loginAppUserobj = new LoginAppUser;
            $response = $loginAppUserobj->forgotPassword($data);
            break;

        case 'userManagement':
            $managementobj = new Management;
            $data['role_id'] = isset($_POST['role_id']) ? $_POST['role_id'] : '';
            $response = $managementobj->userManagement($data);
            break;

        case 'changePassword':
            $loginAppUserobj = new LoginAppUser;
            $data['user_id'] = isset($_POST['user_id']) ? $_POST['user_id'] : '';
            $data['old_pass'] = isset($_POST['old_pass']) ? $_POST['old_pass'] : '';
            $data['new_pass'] = isset($_POST['new_pass']) ? $_POST['new_pass'] : '';
            $response = $loginAppUserobj->changePassword($data);
            break;

        case 'ExportExcelCro':
            $data['cro_id'] = isset($_GET['cro_id']) ? $_GET['cro_id'] : '';
            $excelExportobj = new ExcelExport;
            $excelExportobj->ExcelExportCro($data);
            break;

        case 'ExportExcelLegal':
            $data['legal_id'] = isset($_GET['legal_id']) ? $_GET['legal_id'] : '';
            $excelExportobj = new ExcelExport;
            $excelExportobj->ExportExcelLegal($data);
            break;

        case 'ExportExcelManager':
            $data['escalation_manager_id'] = isset($_GET['escalation_manager_id']) ? $_GET['escalation_manager_id'] : '';
            $excelExportobj = new ExcelExport;
            $excelExportobj->ExportExcelManager($data);
            break;

        case 'numberOfIssues':
            $data['escLegal'] = isset($_POST['escLegal']) ? $_POST['escLegal'] : '';
            $data['startDate'] = isset($_POST['startDate']) ? $_POST['startDate'] : '';
            $data['endDate'] = isset($_POST['endDate']) ? $_POST['endDate'] : '';
            $data['analyticsType'] = isset($_POST['analyticsType']) ? $_POST['analyticsType'] : '';
            $management = new Management;
            $response = $management->numberOfIssues($data);
            break;

        case 'issueTrendPerson':
            $data['escLegal'] = isset($_POST['escLegal']) ? $_POST['escLegal'] : '';
            $data['startDate'] = isset($_POST['startDate']) ? $_POST['startDate'] : '';
            $data['endDate'] = isset($_POST['endDate']) ? $_POST['endDate'] : '';
            $data['escalationLegalID'] = isset($_POST['escalationLegalID']) ? $_POST['escalationLegalID'] : '';
            $data['analyticsType'] = isset($_POST['analyticsType']) ? $_POST['analyticsType'] : '';
            $management = new Management;
            $response = $management->issueTrendPerson($data);
            break;

        case 'userDisableEnable':
            $loginAppUserobj = new LoginAppUser;
            $data['user_id'] = isset($_POST['user_id']) ? $_POST['user_id'] : '';
            $data['user_type'] = isset($_POST['user_type']) ? $_POST['user_type'] : '';
            $response = $loginAppUserobj->userDisableEnable($data);
            break;

        case 'viewRequestNumbers':
            $data['requestNumbers'] = isset($_POST['requestNumbers']) ? $_POST['requestNumbers'] : '';
            $management = new Management;
            $response = $management->viewRequestNumbers($data);
            break;

        case 'userDelete':
            $loginAppUserobj = new LoginAppUser;
            $data['user_id'] = isset($_POST['user_id']) ? $_POST['user_id'] : '';
            $data['user_type'] = isset($_POST['user_type']) ? $_POST['user_type'] : '';
            $response = $loginAppUserobj->userDelete($data);
            break;

        case 'viewRequestNumbersExport':
            $data['requestNumbers'] = isset($_GET['requestNumbers']) ? $_GET['requestNumbers'] : '';
            $excelExportobj = new ExcelExport;
            $response = $excelExportobj->viewRequestNumbersExport($data);
            break;

        case 'session':
            $loginAppUserobj = new LoginAppUser;
            $response = $loginAppUserobj->session();
            break;

        case 'userLogout':
            $loginAppUserobj = new LoginAppUser;
            $response = $loginAppUserobj->userLogout();
            break;

        case 'sendEmail':
            $data['email'] = isset($_REQUEST['email']) ? $_REQUEST['email'] : '';
            $loginAppUserobj = new LoginAppUser;
            $response = $loginAppUserobj->sendEmail($data);
            break;

        case 'croNegotiationCron':
            $cronJob = new CronJob;
            $response = $cronJob->croNegotiationCron();
            break;

        case 'userActiveInactive':
            $loginAppUserobj = new LoginAppUser;
            $data['user_id'] = isset($_POST['user_id']) ? $_POST['user_id'] : '';
            $data['user_type'] = isset($_POST['user_type']) ? $_POST['user_type'] : '';
            $response = $loginAppUserobj->userActiveInactive($data);
            break;

        case 'updateProtocolId':
            $loginAppUserobj = new LoginAppUser;
            $data['request_id'] = isset($_POST['request_id']) ? $_POST['request_id'] : '';
            $data['protocol_id'] = isset($_POST['protocol_id']) ? $_POST['protocol_id'] : '';
            $response = $loginAppUserobj->updateProtocolId($data);
            break;

        case 'reassignedRequest':
            $loginAppUserobj = new LoginAppUser;
            $data['coe_manager_id'] = isset($_POST['coe_manager_id']) ? $_POST['coe_manager_id'] : '';
            $data['coe_type'] = isset($_POST['coe_type']) ? $_POST['coe_type'] : '';
            $data['startDate'] = isset($_POST['startDate']) ? $_POST['startDate'] : '';
            $data['endDate'] = isset($_POST['endDate']) ? $_POST['endDate'] : '';
            $response = $loginAppUserobj->reassignedRequest($data);
            break;

        case 'pieChartAll':
            $managementobj = new Management;
            $data['startDate'] = isset($_POST['startDate']) ? $_POST['startDate'] : '';
            $data['endDate'] = isset($_POST['endDate']) ? $_POST['endDate'] : '';
            $data['escLegal'] = isset($_POST['escLegal']) ? $_POST['escLegal'] : '';
            $data['analyticsType'] = isset($_POST['analyticsType']) ? $_POST['analyticsType'] : '';
            $response = $managementobj->pieChartAll($data);
            break;

        case 'regionDashboard':
            $managementobj = new RegionDashboard;
            $data['startDate'] = isset($_POST['startDate']) ? $_POST['startDate'] : '';
            $data['endDate'] = isset($_POST['endDate']) ? $_POST['endDate'] : '';
            $data['regionId'] = isset($_POST['regionId']) ? $_POST['regionId'] : '';
            $data['analyticsType'] = isset($_POST['analyticsType']) ? $_POST['analyticsType'] : '';
            $response = $managementobj->regionDashboard($data);
            break;

        case 'protocolDashboard':
            $managementobj = new ProtocolDashboard;
            $data['startDate'] = isset($_POST['startDate']) ? $_POST['startDate'] : '';
            $data['endDate'] = isset($_POST['endDate']) ? $_POST['endDate'] : '';
            $data['protocolId'] = isset($_POST['protocolId']) ? $_POST['protocolId'] : '';
            $data['analyticsType'] = isset($_POST['analyticsType']) ? $_POST['analyticsType'] : '';
            $response = $managementobj->protocolDashboard($data);
            break;

        case 'croDashboard':
            $managementobj = new CroDashboard;
            $data['startDate'] = isset($_POST['startDate']) ? $_POST['startDate'] : '';
            $data['endDate'] = isset($_POST['endDate']) ? $_POST['endDate'] : '';
            $data['croId'] = isset($_POST['croId']) ? $_POST['croId'] : '';
            $data['analyticsType'] = isset($_POST['analyticsType']) ? $_POST['analyticsType'] : '';
            $response = $managementobj->croDashboard($data);
            break;

        case 'saveIcf':
            $data['user_id'] = isset($_POST['user_id']) ? $_POST['user_id'] : '';
            $data['escalation_sub_type_id'] = isset($_POST['escalation_sub_type_id']) ? $_POST['escalation_sub_type_id'] : '';
            $data['protocol_id'] = isset($_POST['protocol_id']) ? $_POST['protocol_id'] : '';
            $data['sitename'] = !empty($_POST['sitename']) ? $_POST['sitename'] : 0;
            $data['region_id'] = !empty($_POST['region_id']) ? $_POST['region_id'] : 0;
            $data['country'] = !empty($_POST['country']) ? $_POST['country'] : 0;
            $data['principle_investigator'] = isset($_POST['principle_investigator']) ? $_POST['principle_investigator'] : '';

            $data['section_requiring_legal_review'] = isset($_POST['section_requiring_legal_review']) ? $_POST['section_requiring_legal_review'] : '';
            $data['EC_IRB_feedback'] = isset($_POST['EC_IRB_feedback']) ? $_POST['EC_IRB_feedback'] : '';
            $data['any_other_detail'] = isset($_POST['any_other_detail']) ? $_POST['any_other_detail'] : '';
            $data['specify_relevant_document'] = isset($_POST['specify_relevant_document']) ? $_POST['specify_relevant_document'] : '';

            $data['attachment_global_icf'] = isset($_POST['attachment_global_icf']) ? $_POST['attachment_global_icf'] : '';
            $data['attachment_protocol'] = isset($_POST['attachment_protocol']) ? $_POST['attachment_protocol'] : '';
            $data['attachment_other_relevant_document'] = isset($_POST['attachment_other_relevant_document']) ? $_POST['attachment_other_relevant_document'] : '';
            $data['attachment_country_icf'] = isset($_POST['attachment_country_icf']) ? $_POST['attachment_country_icf'] : '';
            $data['attachment_site_icf'] = isset($_POST['attachment_site_icf']) ? $_POST['attachment_site_icf'] : '';
            $data['cc_email'] = isset($_POST['cc_email']) ? $_POST['cc_email'] : '';
            
            $data['attachment_global_link'] = isset($_POST['attachment_global_link']) ? $_POST['attachment_global_link'] : '';
            $data['attachment_protocol_link'] = isset($_POST['attachment_protocol_link']) ? $_POST['attachment_protocol_link'] : '';
            $data['attachment_country_icf_link'] = isset($_POST['attachment_country_icf_link']) ? $_POST['attachment_country_icf_link'] : '';
            $data['attachment_site_icf_link'] = isset($_POST['attachment_site_icf_link']) ? $_POST['attachment_site_icf_link'] : '';

            $saveRequestsobj = new SaveRequests;
            $response = $saveRequestsobj->saveIcf($data);
            break;

        case 'listRegions':
            $loginAppUserobj = new LoginAppUser;
            $response = $loginAppUserobj->listRegions();
            break;

        case 'legalListSearch':
            $icfObj = new Icf;
            $data['form_id'] = isset($_POST['form_id']) ? $_POST['form_id'] : '';
            $data['icf_form_id'] = isset($_POST['icf_form_id']) ? $_POST['icf_form_id'] : '';
            $response = $icfObj->legalListSearch($data);
            break;

        case 'assignmentList':
            $assignmentobj = new Assignment;
            $data['form_id'] = isset($_POST['form_id']) ? $_POST['form_id'] : '';
            $data['icf_form_id'] = isset($_POST['icf_form_id']) ? $_POST['icf_form_id'] : '';
            $data['role_id'] = isset($_POST['role_id']) ? $_POST['role_id'] : '';
            $data['page_id'] = isset($_POST['page_id']) ? $_POST['page_id'] : '';
            $response = $assignmentobj->assignmentList($data);
            break;

        case 'legalList':
            $assignmentobj = new Assignment;
            $data['form_id'] = isset($_POST['form_id']) ? $_POST['form_id'] : '';
            $data['icf_form_id'] = isset($_POST['icf_form_id']) ? $_POST['icf_form_id'] : '';
            $response = $assignmentobj->legalList($data);
            break;

        case 'patchForLegalManagers':
            $assignmentobj = new Assignment;
            $response = $assignmentobj->patchForLegalManagers();
            break;

        case 'deleteAssignment':
            $assignmentobj = new Assignment;
            $data['assignment_id'] = isset($_POST['assignment_id']) ? $_POST['assignment_id'] : '';
            $response = $assignmentobj->deleteAssignment($data);
            break;

        case 'saveAssignments':
            $assignmentobj = new Assignment;
            $data['form_id'] = isset($_POST['icf_form_id']) ? $_POST['form_id'] : '';
            $data['icf_form_id'] = isset($_POST['icf_form_id']) ? $_POST['icf_form_id'] : '';
            $data['cta_type'] = isset($_POST['cta_type']) ? $_POST['cta_type'] : '';
            $data['issue_type'] = isset($_POST['issue_type']) ? $_POST['issue_type'] : '';
            $data['region_id'] = isset($_POST['region_id']) ? $_POST['region_id'] : '';
            $data['country_id'] = isset($_POST['country_id']) ? $_POST['country_id'] : '';
            $data['protocol_id'] = isset($_POST['protocol_id']) ? $_POST['protocol_id'] : '';
            $data['legal_id'] = isset($_POST['legal_id']) ? $_POST['legal_id'] : '';
            $data['escalation_manager_id'] = isset($_POST['escalation_manager_id']) ? $_POST['escalation_manager_id'] : '';
            $response = $assignmentobj->saveAssignments($data);
            break;
        
        case 'editAssignments':
            $assignmentobj = new Assignment;
            $data['assignment_id'] = isset($_POST['assignment_id']) ? $_POST['assignment_id'] : '';
            $data['form_id'] = isset($_POST['icf_form_id']) ? $_POST['form_id'] : '';
            $data['icf_form_id'] = isset($_POST['icf_form_id']) ? $_POST['icf_form_id'] : '';
            $data['cta_type'] = isset($_POST['cta_type']) ? $_POST['cta_type'] : '';
            $data['issue_type'] = isset($_POST['issue_type']) ? $_POST['issue_type'] : '';
            $data['region_id'] = isset($_POST['region_id']) ? $_POST['region_id'] : '';
            $data['country_id'] = isset($_POST['country_id']) ? $_POST['country_id'] : '';
            $data['protocol_id'] = isset($_POST['protocol_id']) ? $_POST['protocol_id'] : '';
            $data['legal_id'] = isset($_POST['legal_id']) ? $_POST['legal_id'] : '';
            $data['escalation_manager_id'] = isset($_POST['escalation_manager_id']) ? $_POST['escalation_manager_id'] : '';
            $response = $assignmentobj->saveAssignments($data);
            break;

        case 'icfOthersList':
            $assignmentobj = new Assignment;
            $response = $assignmentobj->icfOthersList();
            break;

        case 'icfOthersListDelete':
            $assignmentobj = new Assignment;
            $data['user_id'] = isset($_POST['user_id']) ? $_POST['user_id'] : '';
            $response = $assignmentobj->icfOthersListDelete($data);
            break;
        
        case 'patchUserRoles':
            $managementobj = new Management;
            $response = $managementobj->patchUserRoles();
            break;
        
        case 'listIssuesTypes':
            $loginObj = new LoginAppUser;
            $data['form_id'] = isset($_POST['form_id']) ? $_POST['form_id'] : '';
            $response = $loginObj->listIssuesTypes($data);
            break;

        case 'patchChooseIssue':
            $managementobj = new Management;
            $response = $managementobj->patchChooseIssue();
            break;
        
        case 'putManagerIdIssueStatus':
            $managementobj = new Management;
            $response = $managementobj->putManagerIdIssueStatus();
            break;
        
        case 'userManagementDeleted':
            $managementobj = new Management;
            $data['role_id'] = isset($_POST['role_id']) ? $_POST['role_id'] : '';
            $response = $managementobj->userManagementDeleted($data);
            break;
        
        default:
            throw new Exception('Wrong action !');
    }

    if ($_SERVER['HTTP_HOST'] === 'localhost'):
        echo str_replace("\/", "/", json_pretty(json_encode($response)));
    else:
        echo str_replace("\/", "/", json_pretty(json_encode($response)));
    endif;
} catch (Exception $e) {
    die(json_encode(array('error' => $e->getMessage())));
}

// function to check whether we are getting data in post or not. If POST is empty then show error in json format.
function inputPostCheck($postInput) {
    if (empty($postInput)) {
        die(json_encode(array('error' => 'Some parameters missing')));
    }
}

function rip_tags($string) {

    // ----- remove HTML TAGs ----- 
    $string = preg_replace('/<[^>]*>/', ' ', $string);

    // ----- remove control characters ----- 
    $string = str_replace("\r", '', $string);    // --- replace with empty space
    $string = str_replace("\n", ' ', $string);   // --- replace with space
    $string = str_replace("\t", ' ', $string);   // --- replace with space
    $string = str_replace("\/", "/", $string);
    // ----- remove multiple spaces ----- 
    $string = trim(preg_replace('/ {2,}/', ' ', $string));
    $string = json_pretty($string);
    return $string;
}

function json_pretty($json, $options = array()) {
    $tokens = preg_split('|([\{\}\]\[,])|', $json, -1, PREG_SPLIT_DELIM_CAPTURE);
    $result = '';
    $indent = 0;

    $format = 'txt';

    $ind = "    ";

    if (isset($options['format'])) {
        $format = $options['format'];
    }

    switch ($format) {
        case 'html':
            $lineBreak = '<br />';
            $ind = '&nbsp;&nbsp;&nbsp;&nbsp;';
            break;
        default:
        case 'txt':
            $lineBreak = "\n";
            $ind = "    ";
            break;
    }

    // override the defined indent setting with the supplied option
    if (isset($options['indent'])) {
        $ind = $options['indent'];
    }

    $inLiteral = false;
    foreach ($tokens as $token) {
        if ($token == '') {
            continue;
        }

        $prefix = str_repeat($ind, $indent);
        if (!$inLiteral && ($token == '{' || $token == '[')) {
            $indent++;
            if (($result != '') && ($result[(strlen($result) - 1)] == $lineBreak)) {
                $result .= $prefix;
            }
            $result .= $token . $lineBreak;
        } elseif (!$inLiteral && ($token == '}' || $token == ']')) {
            $indent--;
            $prefix = str_repeat($ind, $indent);
            $result .= $lineBreak . $prefix . $token;
        } elseif (!$inLiteral && $token == ',') {
            $result .= $token . $lineBreak;
        } else {
            $result .= ( $inLiteral ? '' : $prefix ) . $token;

            // Count # of unescaped double-quotes in token, subtract # of
            // escaped double-quotes and if the result is odd then we are 
            // inside a string literal
            if ((substr_count($token, "\"") - substr_count($token, "\\\"")) % 2 != 0) {
                $inLiteral = !$inLiteral;
            }
        }
    }
    return $result;
}

/* End of file index.php */
/* Location: index.php */
?>
