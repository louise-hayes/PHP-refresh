<?php

header('Content-type: application/json');
require_once('../model/class.Functions.php');
require_once("mailer.php");
require_once 'jwt_helper.php';
require_once 'ConstantValue.php';

class ProtocolDashboard {

    function __autoload($class_name) {

        require $class_name . '.class.php';
    }

    public function __construct() {
        $this->_funcObject = new functions();
    }

    /**
     * Function for to show graph and pie chart of Protocol
     * @param type $data
     * @return int|string
     */
    public function protocolDashboard($data) {

        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {

                    $response = array();
                    $result = array();
                    $result1 = array();
                    $result2 = array();
                    $icfForms = array('1' => 'Global Master', '2' => 'Country Level', '3' => 'Site Level');
                    $manvalues = array($data['protocolId'], $data['startDate'], $data['endDate'], $data['analyticsType']);

                    $checkdata = $this->_funcObject->checkData($manvalues);
                    if ($checkdata === 0) {

                        //check date whether the date is correct or not.
                        if (!preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $data['startDate']) || !preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $data['endDate'])) {
                            $response['json_data']['response'] = 0;
                            $response['json_data']['message'] = "Please input valid date ( YYYY-MM-DD )";
                            return $response;
                        }


                        $bindparams = array($data['protocolId'], $data['startDate'] . " 00:00:00", $data['endDate'] . " 23:59:59");

                        if (in_array("1", explode(',', $data['analyticsType']))) {
                            //coe request for Budget escalation on the basis of cro id ( User ID )
                            $sql = "SELECT coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_budget_escalation.*, coe_budget_escalation.issue_id as request_number,
                    coe_issue_status.*, 1 as escalation_type_id, coe_escalation_request.user_id,
                    coe_issue_status.escalation_manager_id, coe_escalation_request.protocol_id,
                    coe_issues_types.issue as choose_an_issue
                    FROM `coe_escalation_request`
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_budget_escalation ON coe_escalation_request.request_id=coe_budget_escalation.request_id
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_budget_escalation.issue_id
                    LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                    LEFT JOIN coe_issues_types ON coe_issues_types.id=coe_budget_escalation.choose_an_issue
                    WHERE coe_escalation_request.protocol_id=? && coe_escalation_request.escalation_type_id=1 && coe_escalation_request.insert_date BETWEEN ? AND ?";
                            $result = $this->_funcObject->sqlQuery($sql, $bindparams);
                        }

                        if (in_array("2", explode(',', $data['analyticsType']))) {
                            //coe request for contract language escalation on the basis of cro id ( User ID )
                            $sql1 = "SELECT coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_language_escalation.*, coe_language_escalation.issue_id as request_number,
                    coe_issue_status.*, 2 as escalation_type_id, coe_escalation_request.user_id,
                    coe_issue_status.escalation_manager_id, coe_escalation_request.protocol_id,
                    coe_issues_types.issue as type_issues
                    FROM `coe_escalation_request`
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_language_escalation ON coe_escalation_request.request_id=coe_language_escalation.request_id
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_language_escalation.issue_id
                    LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                    LEFT JOIN coe_issues_types ON coe_issues_types.id=coe_language_escalation.type_issues
                    WHERE coe_escalation_request.protocol_id=? && coe_escalation_request.escalation_type_id=2 && coe_escalation_request.insert_date BETWEEN ? AND ?";
                            $result1 = $this->_funcObject->sqlQuery($sql1, $bindparams);
                        }

                        if (in_array("4", explode(',', $data['analyticsType']))) {
                            //coe request for ICF escalation on the basis of cro id ( User ID )
                            $sql2 = "SELECT coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name,
                        legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                        coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                        coe_sitenames.sitename_id, coe_sitenames.sitename, 
                        coe_countries.country_id, coe_countries.country_name,
                        coe_icf_escalation.*, coe_icf_escalation.issue_id as request_number,
                        coe_issue_status.*, 4 as escalation_type_id, coe_escalation_request.user_id,
                        coe_issue_status.escalation_manager_id, coe_escalation_request.protocol_id, coe_escalation_request.escalation_sub_type_id
                        FROM `coe_escalation_request`
                        LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                        LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                        LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                        LEFT JOIN coe_icf_escalation ON coe_escalation_request.request_id=coe_icf_escalation.request_id
                        LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_icf_escalation.issue_id
                        LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                        LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                        WHERE coe_escalation_request.protocol_id=? && coe_escalation_request.escalation_type_id=4 && coe_escalation_request.insert_date BETWEEN ? AND ?";
                            $result2 = $this->_funcObject->sqlQuery($sql2, $bindparams);
                        }

                        $arrayCombine = array_merge_recursive($result, $result1, $result2);

                        $arraySortDesc = array();
                        foreach ($arrayCombine['data'] as $key => $value) {
                            if ($value['escalation_manager_id'] != 0 && $value['escalation_manager_id'] != NULL) {
                                $arraySortDesc[$value['escalation_manager_id']][] = $value;
                            }
                        }

                        krsort($arraySortDesc, SORT_ASC);

                        $arraySortDesc1 = array();
                        foreach ($arrayCombine['data'] as $key => $value) {
                            $arraySortDesc1[$value['protocol_id']][] = $value;
                        }

                        krsort($arraySortDesc1, SORT_ASC);


                        $arraySortDesc2 = array();
                        foreach ($arrayCombine['data'] as $key => $value) {
                            if ($value['legal_user_id'] != 0 && $value['legal_user_id'] != NULL) {
                                $arraySortDesc2[$value['legal_user_id']][] = $value;
                            }
                        }

                        krsort($arraySortDesc2, SORT_ASC);

                        //check record found or not
                        if (empty($arraySortDesc) && empty($arraySortDesc2)) {
                            $response['json_data']['response'] = 0;
                            $response['json_data']['message'] = "No record found, Please choose another date interval!";
                            return $response;
                        } else {
                            $response['json_data']['message'] = "Success";
                            //$response['json_data']['result'] = $arraySortDesc;
                        }

                        //for pie chart
                        $pieChart = array();

                        $requesType['Budget']['count'] = 0;
                        $requesType['Icf']['count'] = 0;
                        foreach ($arraySortDesc1 as $key => $value) {

                            $budgetIssues = 0;
                            $languageIssues = 0;
                            $icfIssues = 0;

                            //days
                            $below7['count'] = 0;
                            $below7['request_number_ids'] = array();

                            $above7['count'] = 0;
                            $above7['request_number_ids'] = array();

                            $above12['count'] = 0;
                            $above12['request_number_ids'] = array();

                            $pending['count'] = 0;
                            $pending['request_number_ids'] = array();

                            $belowBudget7['count'] = 0;
                            $belowBudget7['request_number_ids'] = array();

                            $aboveBudget7['count'] = 0;
                            $aboveBudget7['request_number_ids'] = array();

                            $aboveBudget12['count'] = 0;
                            $aboveBudget12['request_number_ids'] = array();

                            $pendingBudget['count'] = 0;
                            $pendingBudget['request_number_ids'] = array();

                            $belowIcf7['count'] = 0;
                            $belowIcf7['request_number_ids'] = array();

                            $aboveIcf7['count'] = 0;
                            $aboveIcf7['request_number_ids'] = array();

                            $aboveIcf12['count'] = 0;
                            $aboveIcf12['request_number_ids'] = array();

                            $pendingIcf['count'] = 0;
                            $pendingIcf['request_number_ids'] = array();

                            $belowCTA7['count'] = 0;
                            $belowCTA7['request_number_ids'] = array();

                            $aboveCTA7['count'] = 0;
                            $aboveCTA7['request_number_ids'] = array();

                            $aboveCTA12['count'] = 0;
                            $aboveCTA12['request_number_ids'] = array();

                            $pendingCTA['count'] = 0;
                            $pendingCTA['request_number_ids'] = array();

                            foreach ($value as $key1 => $value1) {

                                //request type
                                $datediff = strtotime($value1['manager_action_date']) - strtotime($value1['create_date']);
                                $days = floor($datediff / (60 * 60 * 24));

                                //check whether the request is 12 more days
                                $now = time(); // or your date as well
                                $datediff1 = $now - strtotime($value1['create_date']);
                                $days1 = floor($datediff1 / (60 * 60 * 24));

                                if ($days < 7 && $value1['manager_action_date'] != '' && $value1['manager_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '4') {
                                    $below7['count'] ++;
                                    $below7['request_number_ids'][] = $value1['request_number'];
                                } elseif ($days >= 7 && $days <= 12 && $value1['manager_action_date'] != '' && $value1['manager_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '4') {
                                    $above7['count'] ++;
                                    $above7['request_number_ids'][] = $value1['request_number'];
                                } elseif ($days1 < 12 && ($value1['manager_action_date'] == '' || $value1['manager_action_date'] == '0000-00-00 00:00:00' || $value1['manager_action'] == '4')) {
                                    $pending['count'] ++;
                                    $pending['request_number_ids'][] = $value1['request_number'];
                                } else {
                                    $above12['count'] ++;
                                    $above12['request_number_ids'][] = $value1['request_number'];
                                }

                                //request type
                                if ($value1['escalation_type_id'] == 4) {
                                    $requesType['Icf']['count'] ++;
                                    $requesType['Icf']['request_number_ids'][] = $value1['request_number'];

                                    $requesType['Icf']['pie_chart'][$icfForms[$value1['escalation_sub_type_id']]]['request_number_ids'][] = $value1['request_number'];

                                    $datediff = strtotime($value1['legal_action_date']) - strtotime($value1['manager_action_date']);
                                    $days = floor($datediff / (60 * 60 * 24));

                                    //check whether the request is 12 more days
                                    $now = time(); // or your date as well
                                    $datediff1 = $now - strtotime($value1['manager_action_date']);
                                    $days1 = floor($datediff1 / (60 * 60 * 24));

                                    if ($days < 7 && $value1['legal_action_date'] != '0000-00-00 00:00:00') {
                                        $belowIcf7['count'] ++;
                                        $belowIcf7['request_number_ids'][] = $value1['request_number'];
                                    } elseif ($days >= 7 && $days <= 12 && $value1['legal_action_date'] != '0000-00-00 00:00:00') {
                                        $aboveIcf7['count'] ++;
                                        $aboveIcf7['request_number_ids'][] = $value1['request_number'];
                                    } elseif ($days1 < 12 && $value1['legal_action_date'] == '0000-00-00 00:00:00') {
                                        $pendingIcf['count'] ++;
                                        $pendingIcf['request_number_ids'][] = $value1['request_number'];
                                    } else {
                                        $aboveIcf12['count'] ++;
                                        $aboveIcf12['request_number_ids'][] = $value1['request_number'];
                                    }

                                    $requesType['Icf']['bar_chart'] = array('below7' => $belowIcf7, 'above7' => $aboveIcf7, 'above12' => $aboveIcf12, 'pending' => $pendingIcf);
                                } elseif (array_key_exists("type_contract_language", $value1)) {

                                    $requesType[$value1['type_contract_language']]['count'] ++;
                                    $requesType[$value1['type_contract_language']]['request_number_ids'][] = $value1['request_number'];

                                    if ($value1['type_contract_language'] == 'CTA') {

                                        $requesType[$value1['type_contract_language']]['pie_chart'][$value1['type_issues']]['request_number_ids'][] = $value1['request_number'];

                                        $datediff = strtotime($value1['manager_action_date']) - strtotime($value1['create_date']);
                                        $days = floor($datediff / (60 * 60 * 24));

                                        //check whether the request is 12 more days
                                        $now = time(); // or your date as well
                                        $datediff1 = $now - strtotime($value1['create_date']);
                                        $days1 = floor($datediff1 / (60 * 60 * 24));

                                        if ($days < 7 && $value1['manager_action_date'] != '' && $value1['manager_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '4') {
                                            $belowCTA7['count'] ++;
                                            $belowCTA7['request_number_ids'][] = $value1['request_number'];
                                        } elseif ($days >= 7 && $days <= 12 && $value1['manager_action_date'] != '' && $value1['manager_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '4') {
                                            $aboveCTA7['count'] ++;
                                            $aboveCTA7['request_number_ids'][] = $value1['request_number'];
                                        } elseif ($days1 < 12 && ($value1['manager_action_date'] == '' || $value1['manager_action_date'] == '0000-00-00 00:00:00' || $value1['manager_action'] == '4')) {
                                            $pendingCTA['count'] ++;
                                            $pendingCTA['request_number_ids'][] = $value1['request_number'];
                                        } else {
                                            $aboveCTA12['count'] ++;
                                            $aboveCTA12['request_number_ids'][] = $value1['request_number'];
                                        }

                                        $requesType['CTA']['bar_chart'] = array('below7' => $belowCTA7, 'above7' => $aboveCTA7, 'above12' => $aboveCTA12, 'pending' => $pendingCTA);
                                    }
                                } else {
                                    $requesType['Budget']['count'] ++;
                                    $requesType['Budget']['request_number_ids'][] = $value1['request_number'];

                                    $requesType['Budget']['pie_chart'][$value1['choose_an_issue']]['request_number_ids'][] = $value1['request_number'];

                                    $datediff = strtotime($value1['manager_action_date']) - strtotime($value1['create_date']);
                                    $days = floor($datediff / (60 * 60 * 24));

                                    //check whether the request is 12 more days
                                    $now = time(); // or your date as well
                                    $datediff1 = $now - strtotime($value1['create_date']);
                                    $days1 = floor($datediff1 / (60 * 60 * 24));

                                    if ($days < 7 && $value1['manager_action_date'] != '' && $value1['manager_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '4') {
                                        $belowBudget7['count'] ++;
                                        $belowBudget7['request_number_ids'][] = $value1['request_number'];
                                    } elseif ($days >= 7 && $days <= 12 && $value1['manager_action_date'] != '' && $value1['manager_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '4') {
                                        $aboveBudget7['count'] ++;
                                        $aboveBudget7['request_number_ids'][] = $value1['request_number'];
                                    } elseif ($days1 < 12 && ($value1['manager_action_date'] == '' || $value1['manager_action_date'] == '0000-00-00 00:00:00' || $value1['manager_action'] == '4')) {
                                        $pendingBudget['count'] ++;
                                        $pendingBudget['request_number_ids'][] = $value1['request_number'];
                                    } else {
                                        $aboveBudget12['count'] ++;
                                        $aboveBudget12['request_number_ids'][] = $value1['request_number'];
                                    }

                                    $requesType['Budget']['bar_chart'] = array('below7' => $belowBudget7, 'above7' => $aboveBudget7, 'above12' => $aboveBudget12, 'pending' => $pendingBudget);
                                }

                                if ($value1['escalation_type_id'] == 1) {
                                    $budgetIssues++;
                                } else if ($value1['escalation_type_id'] == 4) {
                                    $icfIssues++;
                                } else {
                                    $languageIssues++;
                                }
                            }
                        }
                        $pieChart[] = array('languageIssues' => $languageIssues, 'budgetIssues' => $budgetIssues, 'icfIssues' => $icfIssues, 'issues_count' => count($value), 'pie_chart' => $requesType);

                        //for legal
                        $legal = array();
                        foreach ($arraySortDesc2 as $key => $value) {

                            $requesType = array();
                            $requesType['Budget']['count'] = 0;
                            $requesType['Icf']['count'] = 0;
                            $budgetIssues = 0;
                            $languageIssues = 0;
                            $icfIssues = 0;

                            //days
                            $below7['count'] = 0;
                            $below7['request_number_ids'] = array();

                            $above7['count'] = 0;
                            $above7['request_number_ids'] = array();

                            $above12['count'] = 0;
                            $above12['request_number_ids'] = array();

                            $pending['count'] = 0;
                            $pending['request_number_ids'] = array();

                            $belowIcf7['count'] = 0;
                            $belowIcf7['request_number_ids'] = array();

                            $aboveIcf7['count'] = 0;
                            $aboveIcf7['request_number_ids'] = array();

                            $aboveIcf12['count'] = 0;
                            $aboveIcf12['request_number_ids'] = array();

                            $pendingIcf['count'] = 0;
                            $pendingIcf['request_number_ids'] = array();
                            
                            $belowBudget7['count'] = 0;
                            $belowBudget7['request_number_ids'] = array();

                            $aboveBudget7['count'] = 0;
                            $aboveBudget7['request_number_ids'] = array();

                            $aboveBudget12['count'] = 0;
                            $aboveBudget12['request_number_ids'] = array();

                            $pendingBudget['count'] = 0;
                            $pendingBudget['request_number_ids'] = array();

                            $belowCTA7['count'] = 0;
                            $belowCTA7['request_number_ids'] = array();

                            $aboveCTA7['count'] = 0;
                            $aboveCTA7['request_number_ids'] = array();

                            $aboveCTA12['count'] = 0;
                            $aboveCTA12['request_number_ids'] = array();

                            $pendingCTA['count'] = 0;
                            $pendingCTA['request_number_ids'] = array();

                            foreach ($value as $key1 => $value1) {

                            if ($value1['action_flag'] == 2) {
                            
                                $datediff = strtotime($value1['legal_action_date']) - strtotime($value1['create_date']);
                                $days = floor($datediff / (60 * 60 * 24));

                                //check whether the request is 12 more days
                                $now = time(); // or your date as well
                                $datediff1 = $now - strtotime($value1['create_date']);
                                $days1 = floor($datediff1 / (60 * 60 * 24));

                                if ($days < 7 && $value1['legal_action_date'] != '0000-00-00 00:00:00') {
                                    $below7['count'] ++;
                                    $below7['request_number_ids'][] = $value1['request_number'];
                                } elseif ($days >= 7 && $days <= 12 && $value1['legal_action_date'] != '0000-00-00 00:00:00') {
                                    $above7['count'] ++;
                                    $above7['request_number_ids'][] = $value1['request_number'];
                                } elseif ($days1 < 12 && $value1['legal_action_date'] == '0000-00-00 00:00:00') {
                                    $pending['count'] ++;
                                    $pending['request_number_ids'][] = $value1['request_number'];
                                } else {
                                    $above12['count'] ++;
                                    $above12['request_number_ids'][] = $value1['request_number'];
                                }

                                /////////////////////////////////////////////
                    
                                //request type
                                if ($value1['escalation_type_id'] == 4) {
                                    $requesType['Icf']['count'] ++;
                                    $requesType['Icf']['request_number_ids'][] = $value1['request_number'];

                                    $datediff = strtotime($value1['legal_action_date']) - strtotime($value1['create_date']);
                                    $days = floor($datediff / (60 * 60 * 24));

                                    //check whether the request is 12 more days
                                    $now = time(); // or your date as well
                                    $datediff1 = $now - strtotime($value1['create_date']);
                                    $days1 = floor($datediff1 / (60 * 60 * 24));

                                    if ($days < 7 && $value1['legal_action_date'] != '0000-00-00 00:00:00') {
                                        $belowIcf7['count'] ++;
                                        $belowIcf7['request_number_ids'][] = $value1['request_number'];
                                    } elseif ($days >= 7 && $days <= 12 && $value1['legal_action_date'] != '0000-00-00 00:00:00') {
                                        $aboveIcf7['count'] ++;
                                        $aboveIcf7['request_number_ids'][] = $value1['request_number'];
                                    } elseif ($days1 < 12 && $value1['legal_action_date'] == '0000-00-00 00:00:00') {
                                        $pendingIcf['count'] ++;
                                        $pendingIcf['request_number_ids'][] = $value1['request_number'];
                                    } else {
                                        $aboveIcf12['count'] ++;
                                        $aboveIcf12['request_number_ids'][] = $value1['request_number'];
                                    }

                                    $requesType['Icf']['bar_chart'] = array('below7' => $belowIcf7, 'above7' => $aboveIcf7, 'above12' => $aboveIcf12, 'pending' => $pendingIcf);
                                } elseif (array_key_exists("type_contract_language", $value1)) {

                                    $requesType[$value1['type_contract_language']]['count'] ++;
                                    $requesType[$value1['type_contract_language']]['request_number_ids'][] = $value1['request_number'];

                                    if ($value1['type_contract_language'] == 'CTA') {

                                        $datediff = strtotime($value1['legal_action_date']) - strtotime($value1['create_date']);
                                        $days = floor($datediff / (60 * 60 * 24));

                                        //check whether the request is 12 more days
                                        $now = time(); // or your date as well
                                        $datediff1 = $now - strtotime($value1['create_date']);
                                        $days1 = floor($datediff1 / (60 * 60 * 24));

                                        if ($days < 7 && $value1['legal_action_date'] != '' && $value1['legal_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '4') {
                                            $belowCTA7['count'] ++;
                                            $belowCTA7['request_number_ids'][] = $value1['request_number'];
                                        } elseif ($days >= 7 && $days <= 12 && $value1['legal_action_date'] != '' && $value1['legal_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '4') {
                                            $aboveCTA7['count'] ++;
                                            $aboveCTA7['request_number_ids'][] = $value1['request_number'];
                                        } elseif ($days1 < 12 && ($value1['legal_action_date'] == '' || $value1['legal_action_date'] == '0000-00-00 00:00:00' || $value1['manager_action'] == '4')) {
                                            $pendingCTA['count'] ++;
                                            $pendingCTA['request_number_ids'][] = $value1['request_number'];
                                        } else {
                                            $aboveCTA12['count'] ++;
                                            $aboveCTA12['request_number_ids'][] = $value1['request_number'];
                                        }

                                        $requesType['CTA']['bar_chart'] = array('below7' => $belowCTA7, 'above7' => $aboveCTA7, 'above12' => $aboveCTA12, 'pending' => $pendingCTA);
                                    }
                                } else {
                                    $requesType['Budget']['count'] ++;
                                    $requesType['Budget']['request_number_ids'][] = $value1['request_number'];

                                    $datediff = strtotime($value1['legal_action_date']) - strtotime($value1['create_date']);
                                    $days = floor($datediff / (60 * 60 * 24));

                                    //check whether the request is 12 more days
                                    $now = time(); // or your date as well
                                    $datediff1 = $now - strtotime($value1['create_date']);
                                    $days1 = floor($datediff1 / (60 * 60 * 24));

                                    if ($days < 7 && $value1['legal_action_date'] != '' && $value1['legal_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '4') {
                                        $belowBudget7['count'] ++;
                                        $belowBudget7['request_number_ids'][] = $value1['request_number'];
                                    } elseif ($days >= 7 && $days <= 12 && $value1['legal_action_date'] != '' && $value1['legal_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '4') {
                                        $aboveBudget7['count'] ++;
                                        $aboveBudget7['request_number_ids'][] = $value1['request_number'];
                                    } elseif ($days1 < 12 && ($value1['legal_action_date'] == '' || $value1['legal_action_date'] == '0000-00-00 00:00:00' || $value1['manager_action'] == '4')) {
                                        $pendingBudget['count'] ++;
                                        $pendingBudget['request_number_ids'][] = $value1['request_number'];
                                    } else {
                                        $aboveBudget12['count'] ++;
                                        $aboveBudget12['request_number_ids'][] = $value1['request_number'];
                                    }

                                    $requesType['Budget']['bar_chart'] = array('below7' => $belowBudget7, 'above7' => $aboveBudget7, 'above12' => $aboveBudget12, 'pending' => $pendingBudget);
                                }

                                //////////////////////////////////

                                if ($value1['escalation_type_id'] == 1) {
                                    $budgetIssues++;
                                } else if ($value1['escalation_type_id'] == 4) {
                                    $icfIssues++;
                                } else {
                                    $languageIssues++;
                                }
                            }
                            }
                            $legal[] = array('below7' => $below7, 'above7' => $above7, 'above12' => $above12, 'pending' => $pending, 'languageIssues' => $languageIssues, 'budgetIssues' => $budgetIssues, 'issues_count' => count($value), 'legal_id' => $value['0']['legal_user_id'], 'legal_first_name' => $value['0']['legal_first_name'], 'legal_last_name' => $value['0']['legal_last_name'], 'barChart'=>$requesType);
                        }

                        //for escalation
                        $escalation = array();

                        foreach ($arraySortDesc as $key => $value) {

                            $requesType = array();
                            $requesType['Budget']['count'] = 0;
                            $requesType['Icf']['count'] = 0;
                            $budgetIssues = 0;
                            $languageIssues = 0;
                            $icfIssues = 0;

                            //days
                            $below7['count'] = 0;
                            $below7['request_number_ids'] = array();

                            $above7['count'] = 0;
                            $above7['request_number_ids'] = array();

                            $above12['count'] = 0;
                            $above12['request_number_ids'] = array();

                            $pending['count'] = 0;
                            $pending['request_number_ids'] = array();

                            $belowBudget7['count'] = 0;
                            $belowBudget7['request_number_ids'] = array();

                            $aboveBudget7['count'] = 0;
                            $aboveBudget7['request_number_ids'] = array();

                            $aboveBudget12['count'] = 0;
                            $aboveBudget12['request_number_ids'] = array();

                            $pendingBudget['count'] = 0;
                            $pendingBudget['request_number_ids'] = array();

                            $aboveIcf7['count'] = 0;
                            $aboveIcf7['request_number_ids'] = array();

                            $aboveIcf12['count'] = 0;
                            $aboveIcf12['request_number_ids'] = array();

                            $pendingIcf['count'] = 0;
                            $pendingIcf['request_number_ids'] = array();

                            $belowCTA7['count'] = 0;
                            $belowCTA7['request_number_ids'] = array();

                            $aboveCTA7['count'] = 0;
                            $aboveCTA7['request_number_ids'] = array();

                            $aboveCTA12['count'] = 0;
                            $aboveCTA12['request_number_ids'] = array();

                            $pendingCTA['count'] = 0;
                            $pendingCTA['request_number_ids'] = array();

                            foreach ($value as $key1 => $value1) {
                                
                                if ($value1['action_flag'] == 1) {

                                $datediff = strtotime($value1['manager_action_date']) - strtotime($value1['create_date']);
                                $days = floor($datediff / (60 * 60 * 24));

                                //check whether the request is 12 more days
                                $now = time(); // or your date as well
                                $datediff1 = $now - strtotime($value1['create_date']);
                                $days1 = floor($datediff1 / (60 * 60 * 24));

                                if ($days < 7 && $value1['manager_action_date'] != '' && $value1['manager_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '4') {
                                    $below7['count'] ++;
                                    $below7['request_number_ids'][] = $value1['request_number'];
                                } elseif ($days >= 7 && $days <= 12 && $value1['manager_action_date'] != '' && $value1['manager_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '4') {
                                    $above7['count'] ++;
                                    $above7['request_number_ids'][] = $value1['request_number'];
                                } elseif ($days1 < 12 && ($value1['manager_action_date'] == '' || $value1['manager_action_date'] == '0000-00-00 00:00:00' || $value1['manager_action'] == '4')) {
                                    $pending['count'] ++;
                                    $pending['request_number_ids'][] = $value1['request_number'];
                                } else {
                                    $above12['count'] ++;
                                    $above12['request_number_ids'][] = $value1['request_number'];
                                }

                                
                                /////////////////////////////////////////////
                    
                                //request type
                                if ($value1['escalation_type_id'] == 4) {
                                    $requesType['Icf']['count'] ++;
                                    $requesType['Icf']['request_number_ids'][] = $value1['request_number'];

                                    $datediff = strtotime($value1['legal_action_date']) - strtotime($value1['manager_action_date']);
                                    $days = floor($datediff / (60 * 60 * 24));

                                    //check whether the request is 12 more days
                                    $now = time(); // or your date as well
                                    $datediff1 = $now - strtotime($value1['manager_action_date']);
                                    $days1 = floor($datediff1 / (60 * 60 * 24));

                                    if ($days < 7 && $value1['legal_action_date'] != '0000-00-00 00:00:00') {
                                        $belowIcf7['count'] ++;
                                        $belowIcf7['request_number_ids'][] = $value1['request_number'];
                                    } elseif ($days >= 7 && $days <= 12 && $value1['legal_action_date'] != '0000-00-00 00:00:00') {
                                        $aboveIcf7['count'] ++;
                                        $aboveIcf7['request_number_ids'][] = $value1['request_number'];
                                    } elseif ($days1 < 12 && $value1['legal_action_date'] == '0000-00-00 00:00:00') {
                                        $pendingIcf['count'] ++;
                                        $pendingIcf['request_number_ids'][] = $value1['request_number'];
                                    } else {
                                        $aboveIcf12['count'] ++;
                                        $aboveIcf12['request_number_ids'][] = $value1['request_number'];
                                    }

                                    $requesType['Icf']['bar_chart'] = array('below7' => $belowIcf7, 'above7' => $aboveIcf7, 'above12' => $aboveIcf12, 'pending' => $pendingIcf);
                                } elseif (array_key_exists("type_contract_language", $value1)) {

                                    $requesType[$value1['type_contract_language']]['count'] ++;
                                    $requesType[$value1['type_contract_language']]['request_number_ids'][] = $value1['request_number'];

                                    if ($value1['type_contract_language'] == 'CTA') {

                                        $datediff = strtotime($value1['manager_action_date']) - strtotime($value1['create_date']);
                                        $days = floor($datediff / (60 * 60 * 24));

                                        //check whether the request is 12 more days
                                        $now = time(); // or your date as well
                                        $datediff1 = $now - strtotime($value1['create_date']);
                                        $days1 = floor($datediff1 / (60 * 60 * 24));

                                        if ($days < 7 && $value1['manager_action_date'] != '' && $value1['manager_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '4') {
                                            $belowCTA7['count'] ++;
                                            $belowCTA7['request_number_ids'][] = $value1['request_number'];
                                        } elseif ($days >= 7 && $days <= 12 && $value1['manager_action_date'] != '' && $value1['manager_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '4') {
                                            $aboveCTA7['count'] ++;
                                            $aboveCTA7['request_number_ids'][] = $value1['request_number'];
                                        } elseif ($days1 < 12 && ($value1['manager_action_date'] == '' || $value1['manager_action_date'] == '0000-00-00 00:00:00' || $value1['manager_action'] == '4')) {
                                            $pendingCTA['count'] ++;
                                            $pendingCTA['request_number_ids'][] = $value1['request_number'];
                                        } else {
                                            $aboveCTA12['count'] ++;
                                            $aboveCTA12['request_number_ids'][] = $value1['request_number'];
                                        }

                                        $requesType['CTA']['bar_chart'] = array('below7' => $belowCTA7, 'above7' => $aboveCTA7, 'above12' => $aboveCTA12, 'pending' => $pendingCTA);
                                    }
                                } else {
                                    $requesType['Budget']['count'] ++;
                                    $requesType['Budget']['request_number_ids'][] = $value1['request_number'];

                                    $datediff = strtotime($value1['manager_action_date']) - strtotime($value1['create_date']);
                                    $days = floor($datediff / (60 * 60 * 24));

                                    //check whether the request is 12 more days
                                    $now = time(); // or your date as well
                                    $datediff1 = $now - strtotime($value1['create_date']);
                                    $days1 = floor($datediff1 / (60 * 60 * 24));

                                    if ($days < 7 && $value1['manager_action_date'] != '' && $value1['manager_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '4') {
                                        $belowBudget7['count'] ++;
                                        $belowBudget7['request_number_ids'][] = $value1['request_number'];
                                    } elseif ($days >= 7 && $days <= 12 && $value1['manager_action_date'] != '' && $value1['manager_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '4') {
                                        $aboveBudget7['count'] ++;
                                        $aboveBudget7['request_number_ids'][] = $value1['request_number'];
                                    } elseif ($days1 < 12 && ($value1['manager_action_date'] == '' || $value1['manager_action_date'] == '0000-00-00 00:00:00' || $value1['manager_action'] == '4')) {
                                        $pendingBudget['count'] ++;
                                        $pendingBudget['request_number_ids'][] = $value1['request_number'];
                                    } else {
                                        $aboveBudget12['count'] ++;
                                        $aboveBudget12['request_number_ids'][] = $value1['request_number'];
                                    }

                                    $requesType['Budget']['bar_chart'] = array('below7' => $belowBudget7, 'above7' => $aboveBudget7, 'above12' => $aboveBudget12, 'pending' => $pendingBudget);
                                }

                                //////////////////////////////////



                                if ($value1['escalation_type_id'] == 1) {
                                    $budgetIssues++;
                                } else if ($value1['escalation_type_id'] == 4) {
                                    $icfIssues++;
                                } else {
                                    $languageIssues++;
                                }
                            }
                            }
                            $escalation[] = array('below7' => $below7, 'above7' => $above7, 'above12' => $above12, 'pending' => $pending, 'languageIssues' => $languageIssues, 'budgetIssues' => $budgetIssues, 'issues_count' => count($value), 'manager_id' => $value['0']['escalation_manager_id'], 'escalation_first_name' => $value['0']['escalation_first_name'], 'escalation_last_name' => $value['0']['escalation_last_name'], 'barChart'=>$requesType);
                        }
                        

                        $response['json_data']['response']['selectEscalation'] = $escalation;
                        $response['json_data']['response']['selectLegal'] = $legal;
                        $response['json_data']['response']['pieChart'] = $pieChart;
                    }
                } else {
                    $response['json_data']['response'] = 4;
                    $response['json_data']['message'] = "Token expired.";
                }
            } catch (Exception $ex) {
                $response['json_data']['response'] = 7;
                $response['json_data']['message'] = "Oops something went wrong.";
            }
        } else {
            $response['json_data']['response'] = 6;
            $response['json_data']['message'] = "Authorization Token Not found";
        }


        return $response;
    }

}
