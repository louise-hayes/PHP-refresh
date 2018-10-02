<?php

header('Content-type: application/json');
require_once('../model/class.Functions.php');
require_once 'jwt_helper.php';
require_once 'ConstantValue.php';

class Management {

    function __autoload($class_name) {

        require $class_name . '.class.php';
    }

    public function __construct() {
        $this->_funcObject = new functions();
    }

    /**
     * function for pie chart and bar graph in management
     * @param type $data
     * @return int|string
     */
    public function numberOfIssues($data) {

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
                    $manvalues = array($data['escLegal'], $data['startDate'], $data['endDate'], $data['analyticsType']);

                    $checkdata = $this->_funcObject->checkData($manvalues);
                    if ($checkdata === 0) {

                        //check date whether the date is correct or not.
                        if (!preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $data['startDate']) || !preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $data['endDate'])) {
                            $response['json_data']['response'] = 0;
                            $response['json_data']['message'] = "Please input valid date ( YYYY-MM-DD )";
                            return $response;
                        }

                        if ($data['escLegal'] == 1):

                            $bindparams = array($data['startDate'] . " 00:00:00", $data['endDate'] . " 23:59:59");
                            if (in_array("1", explode(',', $data['analyticsType']))) {
                                //coe request for Budget escalation on the basis of cro id ( User ID )
                                $sql = "SELECT manager.first_name as escalation_first_name, manager.last_name as escalation_last_name, 
                        coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                        coe_sitenames.sitename_id, coe_sitenames.sitename, 
                        coe_countries.country_id, coe_countries.country_name,
                        coe_budget_escalation.*, coe_budget_escalation.issue_id as request_number,
                        coe_issue_status.*, 1 as escalation_type_id,
                        user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name,
                        legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                        action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name,
                        coe_issue_status.escalation_manager_id, coe_issue_status.action_flag,
                        coe_issues_types.issue as choose_an_issue
                        FROM `coe_escalation_request`
                        LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                        LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                        LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                        LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                        LEFT JOIN coe_budget_escalation ON coe_escalation_request.request_id=coe_budget_escalation.request_id
                        LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_budget_escalation.issue_id
                        LEFT JOIN coe_users as manager ON coe_issue_status.escalation_manager_id=manager.user_id
                        LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                        LEFT JOIN coe_users as action_taken ON coe_issue_status.manager_action_id=action_taken.user_id
                        LEFT JOIN coe_issues_types ON coe_issues_types.id=coe_budget_escalation.choose_an_issue
                        WHERE coe_escalation_request.escalation_type_id=1 &&
                        coe_escalation_request.insert_date BETWEEN ? AND ?";
                                $result = $this->_funcObject->sqlQuery($sql, $bindparams);
                            }

                            if (in_array("2", explode(',', $data['analyticsType']))) {
                                //coe request for contract language escalation on the basis of cro id ( User ID )
                                $sql1 = "SELECT manager.first_name as escalation_first_name, manager.last_name as escalation_last_name, 
                        coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                        coe_sitenames.sitename_id, coe_sitenames.sitename, 
                        coe_countries.country_id, coe_countries.country_name,
                        coe_language_escalation.*, coe_language_escalation.issue_id as request_number,
                        coe_issue_status.*, 2 as escalation_type_id,
                        user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name,
                        legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                        action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name,
                        coe_issue_status.escalation_manager_id, coe_issue_status.action_flag,
                        coe_issues_types.issue as type_issues
                        FROM `coe_escalation_request`
                        LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                        LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                        LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                        LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                        LEFT JOIN coe_language_escalation ON coe_escalation_request.request_id=coe_language_escalation.request_id
                        LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_language_escalation.issue_id
                        LEFT JOIN coe_users as manager ON coe_issue_status.escalation_manager_id=manager.user_id
                        LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                        LEFT JOIN coe_users as action_taken ON coe_issue_status.manager_action_id=action_taken.user_id
                        LEFT JOIN coe_issues_types ON coe_issues_types.id=coe_language_escalation.type_issues
                        WHERE coe_escalation_request.escalation_type_id=2 && coe_issue_status.escalation_manager_id!=0 &&
                        coe_escalation_request.insert_date BETWEEN ? AND ?";
                                $result1 = $this->_funcObject->sqlQuery($sql1, $bindparams);
                            }

                            //array merge for more than two arrays
                            $arrayCombine = array_merge_recursive($result, $result1);

                            $arraySortDesc = array();
                            foreach ($arrayCombine['data'] as $key => $value) {
                                if ($value['action_flag'] != 2) {
                                    $arraySortDesc[$value['escalation_manager_id']][] = $value;
                                }
                            }

                            //array sort on key
                            krsort($arraySortDesc, SORT_ASC);

                            //check record found or not
                            if (empty($arraySortDesc)) {
                                $response['json_data']['response'] = 0;
                                $response['json_data']['message'] = "No record found, Please choose another date interval!";
                                return $response;
                            } else {
                                $response['json_data']['message'] = "Success";
                            }


                            foreach ($arraySortDesc as $key => $value) {
                                $budgetIssues = 0;
                                $languageIssues = 0;

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

                                $belowCTA7['count'] = 0;
                                $belowCTA7['request_number_ids'] = array();

                                $aboveCTA7['count'] = 0;
                                $aboveCTA7['request_number_ids'] = array();

                                $aboveCTA12['count'] = 0;
                                $aboveCTA12['request_number_ids'] = array();

                                $pendingCTA['count'] = 0;
                                $pendingCTA['request_number_ids'] = array();

                                $requesType = array();
                                $requesType['Budget']['count'] = 0;

                                foreach ($value as $key1 => $value1) {

                                    $datediff = strtotime($value1['manager_action_date']) - strtotime($value1['create_date']);
                                    $days = floor($datediff / (60 * 60 * 24));

                                    //check whether the request is 12 more days
                                    $now = time(); // or your date as well
                                    $datediff1 = $now - strtotime($value1['create_date']);
                                    $days1 = floor($datediff1 / (60 * 60 * 24));

                                    if ($days < 7 && $value1['manager_action_date'] != '' && $value1['manager_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '1') {
                                        $below7['count'] ++;
                                        $below7['request_number_ids'][] = $value1['request_number'];
                                    } elseif ($days >= 7 && $days <= 12 && $value1['manager_action_date'] != '' && $value1['manager_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '1') {
                                        $above7['count'] ++;
                                        $above7['request_number_ids'][] = $value1['request_number'];
                                    } elseif ($days1 < 12 && ($value1['manager_action_date'] == '' || $value1['manager_action_date'] == '0000-00-00 00:00:00' || $value1['manager_action'] == '1')) {
                                        $pending['count'] ++;
                                        $pending['request_number_ids'][] = $value1['request_number'];
                                    } else {
                                        $above12['count'] ++;
                                        $above12['request_number_ids'][] = $value1['request_number'];
                                    }

                                    //request type
                                    if (array_key_exists("type_contract_language", $value1)) {
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

                                            if ($days < 7 && $value1['manager_action_date'] != '' && $value1['manager_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '1') {
                                                $belowCTA7['count'] ++;
                                                $belowCTA7['request_number_ids'][] = $value1['request_number'];
                                            } elseif ($days >= 7 && $days <= 12 && $value1['manager_action_date'] != '' && $value1['manager_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '1') {
                                                $aboveCTA7['count'] ++;
                                                $aboveCTA7['request_number_ids'][] = $value1['request_number'];
                                            } elseif ($days1 < 12 && ($value1['manager_action_date'] == '' || $value1['manager_action_date'] == '0000-00-00 00:00:00' || $value1['manager_action'] == '1')) {
                                                $pendingCTA['count'] ++;
                                                $pendingCTA['request_number_ids'][] = $value1['request_number'];
                                            } else {
                                                $aboveCTA12['count'] ++;
                                                $aboveCTA12['request_number_ids'][] = $value1['request_number'];
                                            }

                                            $requesType[$value1['type_contract_language']]['bar_chart'] = array('below7' => $belowCTA7, 'above7' => $aboveCTA7, 'above12' => $aboveCTA12, 'pending' => $pendingCTA);
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

                                        if ($days < 7 && $value1['manager_action_date'] != '' && $value1['manager_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '1') {
                                            $belowBudget7['count'] ++;
                                            $belowBudget7['request_number_ids'][] = $value1['request_number'];
                                        } elseif ($days >= 7 && $days <= 12 && $value1['manager_action_date'] != '' && $value1['manager_action_date'] != '0000-00-00 00:00:00' && $value1['manager_action'] != '1') {
                                            $aboveBudget7['count'] ++;
                                            $aboveBudget7['request_number_ids'][] = $value1['request_number'];
                                        } elseif ($days1 < 12 && ($value1['manager_action_date'] == '' || $value1['manager_action_date'] == '0000-00-00 00:00:00' || $value1['manager_action'] == '1')) {
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
                                    } else {
                                        $languageIssues++;
                                    }
                                }
                                $response['json_data']['response'][] = array('bar_chart' => array('below7' => $below7, 'above7' => $above7, 'above12' => $above12, 'pending' => $pending), 'languageIssues' => $languageIssues, 'budgetIssues' => $budgetIssues, 'issues_count' => count($value), 'manager_id' => $value['0']['escalation_manager_id'], 'escalation_first_name' => $value['0']['escalation_first_name'], 'escalation_last_name' => $value['0']['escalation_last_name'], 'pie_chart' => $requesType);
                            } elseif ($data['escLegal'] == 2):

                            $bindparams = array(0, $data['startDate'] . " 00:00:00", $data['endDate'] . " 23:59:59");

                            if (in_array("2", explode(',', $data['analyticsType']))) {
                                //coe request for Language escalation on the basis of cro id ( User ID )
                                $sql = "SELECT coe_language_escalation.issue_id as request_number, coe_issue_status.*, 
                                    coe_language_escalation.*, coe_issues_types.issue as type_issues,
                                    legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                                    manager.first_name as escalation_first_name, manager.last_name as escalation_last_name,
                                    action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name FROM `coe_language_escalation` 
                                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_language_escalation.issue_id 
                                    LEFT JOIN coe_users as manager ON coe_issue_status.escalation_manager_id=manager.user_id 
                                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id 
                                    LEFT JOIN coe_users as action_taken ON coe_issue_status.legal_action_id=action_taken.user_id 
                                    LEFT JOIN coe_issues_types ON coe_issues_types.id=coe_language_escalation.type_issues
                                    WHERE coe_issue_status.`legal_user_id`!=? &&
                                    coe_language_escalation.create_date BETWEEN ? AND ? && coe_issue_status.action_flag=2";
                                $result = $this->_funcObject->sqlQuery($sql, $bindparams);
                            }

                            if (in_array("1", explode(',', $data['analyticsType']))) {
                                //coe request for Budget escalation on the basis of cro id ( User ID )
                                $sql = "SELECT coe_budget_escalation.issue_id as request_number, coe_issue_status.*,
                                    coe_budget_escalation.*, coe_issues_types.issue as choose_an_issue,
                                    legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                                    manager.first_name as escalation_first_name, manager.last_name as escalation_last_name,
                                    action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name FROM `coe_budget_escalation` 
                                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_budget_escalation.issue_id 
                                    LEFT JOIN coe_users as manager ON coe_issue_status.escalation_manager_id=manager.user_id 
                                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id 
                                    LEFT JOIN coe_users as action_taken ON coe_issue_status.legal_action_id=action_taken.user_id 
                                    LEFT JOIN coe_issues_types ON coe_issues_types.id=coe_budget_escalation.choose_an_issue
                                    WHERE coe_issue_status.`legal_user_id`!=? &&
                                    coe_budget_escalation.create_date BETWEEN ? AND ? && coe_issue_status.action_flag=2";
                                $result1 = $this->_funcObject->sqlQuery($sql, $bindparams);
                            }

                            if (in_array("4", explode(',', $data['analyticsType']))) {
                                //coe request for ICF escalation on the basis of cro id ( User ID )
                                $sql = "SELECT coe_icf_escalation.issue_id as request_number, coe_issue_status.*,
                                    coe_icf_escalation.*, legal.first_name as legal_first_name, 
                                    legal.last_name as legal_last_name,
                                    manager.first_name as escalation_first_name, manager.last_name as escalation_last_name,
                                    action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name FROM `coe_icf_escalation`
                                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_icf_escalation.issue_id 
                                    LEFT JOIN coe_users as manager ON coe_issue_status.escalation_manager_id=manager.user_id
                                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id 
                                    LEFT JOIN coe_users as action_taken ON coe_issue_status.legal_action_id=action_taken.user_id 
                                    WHERE coe_issue_status.`legal_user_id`!=? &&
                                    coe_icf_escalation.create_date BETWEEN ? AND ? && coe_issue_status.action_flag=2";
                                $result2 = $this->_funcObject->sqlQuery($sql, $bindparams);
                            }

                            $arrayCombine = array_merge_recursive($result, $result1, $result2);

                            $arraySortDesc = array();
                            foreach ($arrayCombine['data'] as $key => $value) {
                                $arraySortDesc[$value['request_number']] = $value;
                            }

                            krsort($arraySortDesc, SORT_DESC);
                            $arraySortDesc = array_values($arraySortDesc);


                            //check record found or not
                            if (empty($arraySortDesc)) {
                                $response['json_data']['response'] = 0;
                                $response['json_data']['message'] = "No record found, Please choose another date interval!";
                                return $response;
                            } else {
                                $response['json_data']['message'] = "Success";
                            }

                            $count = (int) count($arraySortDesc);
                            if ($count > 0) {
                                $i = 0;
                                $finalArray = array();
                                foreach ($arraySortDesc as $key => $value) {

                                    $sql = "SELECT coe_escalation_request.*,
                            coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                            coe_sitenames.sitename_id, coe_sitenames.sitename, 
                            coe_countries.country_id, coe_countries.country_name,
                            user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name
                            FROM `coe_escalation_request`
                            LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                            LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                            LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                            LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                            WHERE coe_escalation_request.request_id=?";
                                    $bindparams = array($value['request_id']);
                                    $result1 = $this->_funcObject->sqlQuery($sql, $bindparams);
                                    $arrayCombine = array_merge($value, $result1['data'][0]);

                                    $finalArray[$i] = $arrayCombine;
                                    $i++;
                                }
                            }

                            $arraySortDesc = array();
                            foreach ($finalArray as $key => $value) {
                                $arraySortDesc[$value['legal_user_id']][] = $value;
                            }

                            krsort($arraySortDesc, SORT_ASC);

                            foreach ($arraySortDesc as $key => $value) {
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


                                $requesType = array();
                                $requesType['Budget']['count'] = 0;

                                foreach ($value as $key1 => $value1) {

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

                                    //request type
                                    if ($value1['escalation_type_id'] == 4) {
                                        $requesType['Icf']['count'] ++;
                                        $requesType['Icf']['request_number_ids'][] = $value1['request_number'];

                                        $requesType['Icf']['pie_chart'][$icfForms[$value1['escalation_sub_type_id']]]['request_number_ids'][] = $value1['request_number'];

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
                                            $requesType[$value1['type_contract_language']]['pie_chart'][$value1['type_issues']]['request_number_ids'][] = $value1['request_number'];


                                            $datediff = strtotime($value1['legal_action_date']) - strtotime($value1['create_date']);
                                            $days = floor($datediff / (60 * 60 * 24));

                                            //check whether the request is 12 more days
                                            $now = time(); // or your date as well
                                            $datediff1 = $now - strtotime($value1['create_date']);
                                            $days1 = floor($datediff1 / (60 * 60 * 24));

                                            if ($days < 7 && $value1['legal_action_date'] != '0000-00-00 00:00:00') {
                                                $belowCTA7['count'] ++;
                                                $belowCTA7['request_number_ids'][] = $value1['request_number'];
                                            } elseif ($days >= 7 && $days <= 12 && $value1['legal_action_date'] != '0000-00-00 00:00:00') {
                                                $aboveCTA7['count'] ++;
                                                $aboveCTA7['request_number_ids'][] = $value1['request_number'];
                                            } elseif ($days1 < 12 && $value1['legal_action_date'] == '0000-00-00 00:00:00') {
                                                $pendingCTA['count'] ++;
                                                $pendingCTA['request_number_ids'][] = $value1['request_number'];
                                            } else {
                                                $aboveCTA12['count'] ++;
                                                $aboveCTA12['request_number_ids'][] = $value1['request_number'];
                                            }

                                            $requesType[$value1['type_contract_language']]['bar_chart'] = array('below7' => $belowCTA7, 'above7' => $aboveCTA7, 'above12' => $aboveCTA12, 'pending' => $pendingCTA);
                                        }
                                    } else {
                                        $requesType['Budget']['count'] ++;
                                        $requesType['Budget']['request_number_ids'][] = $value1['request_number'];

                                        $requesType['Budget']['pie_chart'][$value1['choose_an_issue']]['request_number_ids'][] = $value1['request_number'];

                                        $datediff = strtotime($value1['legal_action_date']) - strtotime($value1['create_date']);
                                        $days = floor($datediff / (60 * 60 * 24));

                                        //check whether the request is 12 more days
                                        $now = time(); // or your date as well
                                        $datediff1 = $now - strtotime($value1['create_date']);
                                        $days1 = floor($datediff1 / (60 * 60 * 24));

                                        if ($days < 7 && $value1['legal_action_date'] != '0000-00-00 00:00:00') {
                                            $belowBudget7['count'] ++;
                                            $belowBudget7['request_number_ids'][] = $value1['request_number'];
                                        } elseif ($days >= 7 && $days <= 12 && $value1['legal_action_date'] != '0000-00-00 00:00:00') {
                                            $aboveBudget7['count'] ++;
                                            $aboveBudget7['request_number_ids'][] = $value1['request_number'];
                                        } elseif ($days1 < 12 && $value1['legal_action_date'] == '0000-00-00 00:00:00') {
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
                                $response['json_data']['response'][] = array('bar_chart' => array('below7' => $below7, 'above7' => $above7, 'above12' => $above12, 'pending' => $pending), 'languageIssues' => $languageIssues, 'budgetIssues' => $budgetIssues, 'icfIssues' => $icfIssues, 'issues_count' => count($value), 'legal_id' => $value['0']['legal_user_id'], 'legal_first_name' => $value['0']['legal_first_name'], 'legal_last_name' => $value['0']['legal_last_name'], 'pie_chart' => $requesType);
                            } elseif ($data['escLegal'] == 3):

                            $bindparams = array($data['startDate'] . " 00:00:00", $data['endDate'] . " 23:59:59");

                            if (in_array("1", explode(',', $data['analyticsType']))) {
                                //coe request for Budget escalation on the basis of cro id ( User ID )
                                $sql = "SELECT coe_user.first_name as cro_first_name, coe_user.last_name as cro_last_name, coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name, 
                        coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                        coe_sitenames.sitename_id, coe_sitenames.sitename, 
                        coe_countries.country_id, coe_countries.country_name,
                        coe_budget_escalation.*, coe_budget_escalation.issue_id as request_number,
                        coe_issue_status.*, 1 as escalation_type_id, coe_escalation_request.user_id,
                        coe_issues_types.issue as choose_an_issue
                        FROM `coe_escalation_request`
                        LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                        LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                        LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                        LEFT JOIN coe_budget_escalation ON coe_escalation_request.request_id=coe_budget_escalation.request_id
                        LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_budget_escalation.issue_id
                        LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                        LEFT JOIN coe_issues_types ON coe_issues_types.id=coe_budget_escalation.choose_an_issue
                        LEFT JOIN coe_users as coe_user ON coe_escalation_request.user_id=coe_user.user_id
                        WHERE coe_escalation_request.escalation_type_id=1 && coe_escalation_request.insert_date BETWEEN ? AND ?";
                                $result = $this->_funcObject->sqlQuery($sql, $bindparams);
                            }

                            if (in_array("2", explode(',', $data['analyticsType']))) {
                                //coe request for contract language escalation on the basis of cro id ( User ID )
                                $sql1 = "SELECT coe_user.first_name as cro_first_name, coe_user.last_name as cro_last_name, coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name, 
                        coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                        coe_sitenames.sitename_id, coe_sitenames.sitename, 
                        coe_countries.country_id, coe_countries.country_name,
                        coe_language_escalation.*, coe_language_escalation.issue_id as request_number,
                        coe_issue_status.*, 2 as escalation_type_id, coe_escalation_request.user_id,
                        coe_issues_types.issue as type_issues
                        FROM `coe_escalation_request`
                        LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                        LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                        LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                        LEFT JOIN coe_language_escalation ON coe_escalation_request.request_id=coe_language_escalation.request_id
                        LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_language_escalation.issue_id
                        LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                        LEFT JOIN coe_issues_types ON coe_issues_types.id=coe_language_escalation.type_issues
                        LEFT JOIN coe_users as coe_user ON coe_escalation_request.user_id=coe_user.user_id
                        WHERE coe_escalation_request.escalation_type_id=2 && coe_escalation_request.insert_date BETWEEN ? AND ?";
                                $result1 = $this->_funcObject->sqlQuery($sql1, $bindparams);
                            }

                            if (in_array("4", explode(',', $data['analyticsType']))) {
                                //coe request for ICF escalation on the basis of cro id ( User ID )
                                $sql2 = "SELECT coe_user.first_name as cro_first_name, coe_user.last_name as cro_last_name, coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name, 
                            coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                            coe_sitenames.sitename_id, coe_sitenames.sitename, 
                            coe_countries.country_id, coe_countries.country_name,
                            coe_icf_escalation.*, coe_icf_escalation.issue_id as request_number,
                            coe_issue_status.*, 4 as escalation_type_id, coe_escalation_request.user_id, coe_escalation_request.escalation_sub_type_id
                            FROM `coe_escalation_request`
                            LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                            LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                            LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                            LEFT JOIN coe_icf_escalation ON coe_escalation_request.request_id=coe_icf_escalation.request_id
                            LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_icf_escalation.issue_id
                            LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                            LEFT JOIN coe_users as coe_user ON coe_escalation_request.user_id=coe_user.user_id
                            WHERE coe_escalation_request.escalation_type_id=4 && coe_escalation_request.insert_date BETWEEN ? AND ?";
                                $result2 = $this->_funcObject->sqlQuery($sql2, $bindparams);
                            }

                            $arrayCombine = array_merge_recursive($result, $result1, $result2);

                            $arraySortDesc = array();
                            foreach ($arrayCombine['data'] as $key => $value) {
                                $arraySortDesc[$value['user_id']][] = $value;
                            }

                            krsort($arraySortDesc, SORT_ASC);

                            //check record found or not
                            if (empty($arraySortDesc)) {
                                $response['json_data']['response'] = 0;
                                $response['json_data']['message'] = "No record found, Please choose another date interval!";
                                return $response;
                            } else {
                                $response['json_data']['message'] = "Success";
                            }

                            $requesType['Budget']['count'] = 0;

                            foreach ($arraySortDesc as $key => $value) {

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


                                $requesType = array();
                                $requesType['Budget']['count'] = 0;

                                foreach ($value as $key1 => $value1) {

                                    $datediff = strtotime($value1['resolution_date']) - strtotime($value1['create_date']);
                                    $days = floor($datediff / (60 * 60 * 24));

                                    //check whether the request is 12 more days
                                    $now = time(); // or your date as well
                                    $datediff1 = $now - strtotime($value1['create_date']);
                                    $days1 = floor($datediff1 / (60 * 60 * 24));

                                    if ($days < 7 && $value1['resolution_date'] != '0000-00-00 00:00:00') {
                                        $below7['count'] ++;
                                        $below7['request_number_ids'][] = $value1['request_number'];
                                    } elseif ($days >= 7 && $days <= 12 && $value1['resolution_date'] != '0000-00-00 00:00:00') {
                                        $above7['count'] ++;
                                        $above7['request_number_ids'][] = $value1['request_number'];
                                    } elseif ($days1 < 12 && $value1['resolution_date'] == '0000-00-00 00:00:00') {
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

                                        $datediff = strtotime($value1['resolution_date']) - strtotime($value1['create_date']);
                                        $days = floor($datediff / (60 * 60 * 24));

                                        //check whether the request is 12 more days
                                        $now = time(); // or your date as well
                                        $datediff1 = $now - strtotime($value1['create_date']);
                                        $days1 = floor($datediff1 / (60 * 60 * 24));

                                        if ($days < 7 && $value1['resolution_date'] != '0000-00-00 00:00:00') {
                                            $belowIcf7['count'] ++;
                                            $belowIcf7['request_number_ids'][] = $value1['request_number'];
                                        } elseif ($days >= 7 && $days <= 12 && $value1['resolution_date'] != '0000-00-00 00:00:00') {
                                            $aboveIcf7['count'] ++;
                                            $aboveIcf7['request_number_ids'][] = $value1['request_number'];
                                        } elseif ($days1 < 12 && $value1['resolution_date'] == '0000-00-00 00:00:00') {
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


                                            $datediff = strtotime($value1['resolution_date']) - strtotime($value1['create_date']);
                                            $days = floor($datediff / (60 * 60 * 24));

                                            //check whether the request is 12 more days
                                            $now = time(); // or your date as well
                                            $datediff1 = $now - strtotime($value1['create_date']);
                                            $days1 = floor($datediff1 / (60 * 60 * 24));

                                            if ($days < 7 && $value1['resolution_date'] != '0000-00-00 00:00:00') {
                                                $belowCTA7['count'] ++;
                                                $belowCTA7['request_number_ids'][] = $value1['request_number'];
                                            } elseif ($days >= 7 && $days <= 12 && $value1['resolution_date'] != '0000-00-00 00:00:00') {
                                                $aboveCTA7['count'] ++;
                                                $aboveCTA7['request_number_ids'][] = $value1['request_number'];
                                            } elseif ($days1 < 12 && $value1['resolution_date'] == '0000-00-00 00:00:00') {
                                                $pendingCTA['count'] ++;
                                                $pendingCTA['request_number_ids'][] = $value1['request_number'];
                                            } else {
                                                $aboveCTA12['count'] ++;
                                                $aboveCTA12['request_number_ids'][] = $value1['request_number'];
                                            }

                                            $requesType[$value1['type_contract_language']]['bar_chart'] = array('below7' => $belowCTA7, 'above7' => $aboveCTA7, 'above12' => $aboveCTA12, 'pending' => $pendingCTA);
                                        }
                                    } else {
                                        $requesType['Budget']['count'] ++;
                                        $requesType['Budget']['request_number_ids'][] = $value1['request_number'];

                                        $requesType['Budget']['pie_chart'][$value1['choose_an_issue']]['request_number_ids'][] = $value1['request_number'];

                                        $datediff = strtotime($value1['resolution_date']) - strtotime($value1['create_date']);
                                        $days = floor($datediff / (60 * 60 * 24));

                                        //check whether the request is 12 more days
                                        $now = time(); // or your date as well
                                        $datediff1 = $now - strtotime($value1['create_date']);
                                        $days1 = floor($datediff1 / (60 * 60 * 24));

                                        if ($days < 7 && $value1['resolution_date'] != '0000-00-00 00:00:00') {
                                            $belowBudget7['count'] ++;
                                            $belowBudget7['request_number_ids'][] = $value1['request_number'];
                                        } elseif ($days >= 7 && $days <= 12 && $value1['resolution_date'] != '0000-00-00 00:00:00') {
                                            $aboveBudget7['count'] ++;
                                            $aboveBudget7['request_number_ids'][] = $value1['request_number'];
                                        } elseif ($days1 < 12 && $value1['resolution_date'] == '0000-00-00 00:00:00') {
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
                                $response['json_data']['response'][] = array('userId' => $value1['user_id'], 'languageIssues' => $languageIssues, 'icfIssues' => $icfIssues, 'budgetIssues' => $budgetIssues, 'issues_count' => count($value), 'cro_first_name' => $value['0']['cro_first_name'], 'cro_last_name' => $value['0']['cro_last_name'], 'pie_chart' => $requesType);
                            }
                        else:

                            $response['json_data']['message'] = "Request ID Not Found!";
                            $response['json_data']['response'] = 0;

                        endif;
                    }
                }
                else {
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

    /**
     * function for issue trend in management for particular PERSON / REGION / PROTOCOL
     * @param type $data
     * @return int|string
     */
    public function issueTrendPerson($data) {
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
                    $manvalues = array($data['escLegal'], $data['startDate'], $data['endDate'], $data['escalationLegalID']);

                    $checkdata = $this->_funcObject->checkData($manvalues);
                    if ($checkdata === 0) {

                        //check date whether the date is correct or not.
                        if (!preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $data['startDate']) || !preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $data['endDate'])) {
                            $response['json_data']['response'] = 0;
                            $response['json_data']['message'] = "Please input valid date ( YYYY-MM-DD )";
                            return $response;
                        }

                        if ($data['escLegal'] == 1):

                            $bindparams = array($data['startDate'] . " 00:00:00", $data['endDate'] . " 23:59:59", $data['escalationLegalID']);

                            if (in_array("1", explode(',', $data['analyticsType']))) {
                                //coe request for Budget escalation on the basis of cro id ( User ID )
                                $sql = "SELECT manager.first_name as escalation_first_name, manager.last_name as escalation_last_name, 
                        coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                        coe_sitenames.sitename_id, coe_sitenames.sitename, 
                        coe_countries.country_id, coe_countries.country_name,
                        coe_budget_escalation.*, coe_budget_escalation.issue_id as request_number,
                        coe_issue_status.*, 1 as escalation_type_id,
                        user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name,
                        legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                        action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name,
                        coe_escalation_request.escalation_manager_id,
                        coe_issues_types.issue as choose_an_issue
                        FROM `coe_escalation_request`
                        LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                        LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                        LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                        LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                        LEFT JOIN coe_budget_escalation ON coe_escalation_request.request_id=coe_budget_escalation.request_id
                        LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_budget_escalation.issue_id
                        LEFT JOIN coe_users as manager ON coe_issue_status.escalation_manager_id=manager.user_id
                        LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                        LEFT JOIN coe_users as action_taken ON coe_issue_status.manager_action_id=action_taken.user_id
                        LEFT JOIN coe_issues_types ON coe_issues_types.id=coe_budget_escalation.choose_an_issue
                        WHERE coe_escalation_request.escalation_type_id=1 &&
                        coe_escalation_request.insert_date BETWEEN ? AND ? && coe_issue_status.escalation_manager_id=?";
                                $result = $this->_funcObject->sqlQuery($sql, $bindparams);
                            }

                            if (in_array("2", explode(',', $data['analyticsType']))) {
                                //coe request for contract language escalation on the basis of cro id ( User ID )
                                $sql1 = "SELECT manager.first_name as escalation_first_name, manager.last_name as escalation_last_name, 
                        coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                        coe_sitenames.sitename_id, coe_sitenames.sitename, 
                        coe_countries.country_id, coe_countries.country_name,
                        coe_language_escalation.*, coe_language_escalation.issue_id as request_number,
                        coe_issue_status.*, 2 as escalation_type_id,
                        user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name,
                        legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                        action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name,
                        coe_escalation_request.escalation_manager_id,
                        coe_issues_types.issue as type_issues
                        FROM `coe_escalation_request`
                        LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                        LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                        LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                        LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                        LEFT JOIN coe_language_escalation ON coe_escalation_request.request_id=coe_language_escalation.request_id
                        LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_language_escalation.issue_id
                        LEFT JOIN coe_users as manager ON coe_issue_status.escalation_manager_id=manager.user_id
                        LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                        LEFT JOIN coe_users as action_taken ON coe_issue_status.manager_action_id=action_taken.user_id
                        LEFT JOIN coe_issues_types ON coe_issues_types.id=coe_language_escalation.type_issues
                        WHERE coe_escalation_request.escalation_type_id=2 &&
                        coe_escalation_request.insert_date BETWEEN ? AND ? && coe_issue_status.escalation_manager_id=?";
                                $result1 = $this->_funcObject->sqlQuery($sql1, $bindparams);
                            }

                            $arrayCombine = array_merge_recursive($result, $result1);
                            $arraySortDesc = array();
                            foreach ($arrayCombine['data'] as $key => $value) {
                                $arraySortDesc[$value['escalation_manager_id']][] = $value;
                            }

                            krsort($arraySortDesc, SORT_ASC);

                            //check record found or not
                            if (empty($arraySortDesc)) {
                                $response['json_data']['response'] = 0;
                                $response['json_data']['message'] = "No record found, Please choose another date interval!";
                                return $response;
                            } else {
                                $response['json_data']['message'] = "Success";
                            }

                            $requesType['Budget']['count'] = 0;

                            foreach ($arraySortDesc as $key => $value) {
                                $budgetIssues = 0;
                                $languageIssues = 0;

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

                                $belowCTA7['count'] = 0;
                                $belowCTA7['request_number_ids'] = array();

                                $aboveCTA7['count'] = 0;
                                $aboveCTA7['request_number_ids'] = array();

                                $aboveCTA12['count'] = 0;
                                $aboveCTA12['request_number_ids'] = array();

                                $pendingCTA['count'] = 0;
                                $pendingCTA['request_number_ids'] = array();

                                foreach ($value as $key1 => $value1) {

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

                                    if (array_key_exists("type_contract_language", $value1)) {
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

                                            $requesType[$value1['type_contract_language']]['bar_chart'] = array('below7' => $belowCTA7, 'above7' => $aboveCTA7, 'above12' => $aboveCTA12, 'pending' => $pendingCTA);
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
                                    } else {
                                        $languageIssues++;
                                    }
                                }
                                $response['json_data']['response'][] = array('bar_chart' => array('below7' => $below7, 'above7' => $above7, 'above12' => $above12, 'pending' => $pending), 'languageIssues' => $languageIssues, 'budgetIssues' => $budgetIssues, 'issues_count' => count($value), 'manager_id' => $value['0']['escalation_manager_id'], 'escalation_first_name' => $value['0']['escalation_first_name'], 'escalation_last_name' => $value['0']['escalation_last_name'], 'pie_chart' => $requesType);
                            } elseif ($data['escLegal'] == 2):

                            $bindparams = array($data['escalationLegalID'], $data['startDate'] . " 00:00:00", $data['endDate'] . " 23:59:59");

                            if (in_array("2", explode(',', $data['analyticsType']))) {
                                //coe request for Language escalation on the basis of cro id ( User ID )
                                $sql = "SELECT coe_language_escalation.issue_id as request_number, coe_issue_status.*,
                                    manager.first_name as escalation_first_name, manager.last_name as escalation_last_name, coe_language_escalation.*, coe_issues_types.issue as type_issues, legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                    action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name FROM `coe_language_escalation` 
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_language_escalation.issue_id 
                    LEFT JOIN coe_users as manager ON coe_issue_status.escalation_manager_id=manager.user_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id LEFT JOIN coe_users as action_taken ON coe_issue_status.legal_action_id=action_taken.user_id LEFT JOIN coe_issues_types ON coe_issues_types.id=coe_language_escalation.type_issues WHERE coe_issue_status.`legal_user_id`=? &&
                    coe_language_escalation.create_date BETWEEN ? AND ?";
                                $result = $this->_funcObject->sqlQuery($sql, $bindparams);
                            }

                            if (in_array("1", explode(',', $data['analyticsType']))) {
                                //coe request for Budget escalation on the basis of cro id ( User ID )
                                $sql = "SELECT coe_budget_escalation.issue_id as request_number, coe_issue_status.*, 
                                    manager.first_name as escalation_first_name, manager.last_name as escalation_last_name, coe_budget_escalation.*, coe_issues_types.issue as choose_an_issue, legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                    action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name FROM `coe_budget_escalation` 
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_budget_escalation.issue_id 
                    LEFT JOIN coe_users as manager ON coe_issue_status.escalation_manager_id=manager.user_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id LEFT JOIN coe_users as action_taken ON coe_issue_status.legal_action_id=action_taken.user_id LEFT JOIN coe_issues_types ON coe_issues_types.id=coe_budget_escalation.choose_an_issue WHERE coe_issue_status.`legal_user_id`=? &&
                    coe_budget_escalation.create_date BETWEEN ? AND ?";
                                $result1 = $this->_funcObject->sqlQuery($sql, $bindparams);
                            }

                            if (in_array("4", explode(',', $data['analyticsType']))) {
                                //coe request for ICF escalation on the basis of cro id ( User ID )
                                $sql = "SELECT coe_icf_escalation.issue_id as request_number, coe_issue_status.*, 
                                    manager.first_name as escalation_first_name, manager.last_name as escalation_last_name, coe_icf_escalation.*, legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                        action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name FROM `coe_icf_escalation` 
                        LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_icf_escalation.issue_id 
                        LEFT JOIN coe_users as manager ON coe_issue_status.escalation_manager_id=manager.user_id
                        LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id LEFT JOIN coe_users as action_taken ON coe_issue_status.legal_action_id=action_taken.user_id WHERE coe_issue_status.`legal_user_id`=? &&
                        coe_icf_escalation.create_date BETWEEN ? AND ?";
                                $result2 = $this->_funcObject->sqlQuery($sql, $bindparams);
                            }

                            $arrayCombine = array_merge_recursive($result, $result1, $result2);

                            $arraySortDesc = array();
                            foreach ($arrayCombine['data'] as $key => $value) {
                                $arraySortDesc[$value['request_number']] = $value;
                            }

                            krsort($arraySortDesc, SORT_DESC);
                            $arraySortDesc = array_values($arraySortDesc);


                            //check record found or not
                            if (empty($arraySortDesc)) {
                                $response['json_data']['response'] = 0;
                                $response['json_data']['message'] = "No record found, Please choose another date interval!";
                                return $response;
                            } else {
                                $response['json_data']['message'] = "Success";
                            }


                            $count = (int) count($arraySortDesc);
                            if ($count > 0) {
                                $i = 0;
                                $finalArray = array();
                                foreach ($arraySortDesc as $key => $value) {

                                    $sql = "SELECT coe_escalation_request.*,
                            coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                            coe_sitenames.sitename_id, coe_sitenames.sitename, 
                            coe_countries.country_id, coe_countries.country_name,
                            user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name
                            FROM `coe_escalation_request`
                            LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                            LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                            LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                            LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                            WHERE coe_escalation_request.request_id=?";
                                    $bindparams = array($value['request_id']);
                                    $result1 = $this->_funcObject->sqlQuery($sql, $bindparams);
                                    $arrayCombine = array_merge($value, $result1['data'][0]);

                                    $finalArray[$i] = $arrayCombine;
                                    $i++;
                                }
                            }

                            $arraySortDesc = array();
                            foreach ($finalArray as $key => $value) {
                                $arraySortDesc[$value['legal_user_id']][] = $value;
                            }

                            krsort($arraySortDesc, SORT_ASC);

                            $response['json_data']['message'] = "Success";

                            $requesType['Budget']['count'] = 0;
                            $requesType['Icf']['count'] = 0;
                            foreach ($arraySortDesc as $key => $value) {
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

                                    //request type
                                    if ($value1['escalation_type_id'] == 4) {
                                        $requesType['Icf']['count'] ++;
                                        $requesType['Icf']['request_number_ids'][] = $value1['request_number'];

                                        $requesType['Icf']['pie_chart'][$icfForms[$value1['escalation_sub_type_id']]]['request_number_ids'][] = $value1['request_number'];

                                        $datediff = strtotime($value1['legal_action_date']) - strtotime($value1['create_date']);
                                        $days = floor($datediff / (60 * 60 * 24));

                                        //check whether the request is 12 more days
                                        $now = time(); // or your date as well
                                        $datediff1 = $now - strtotime($value1['create_date']);
                                        $days1 = floor($datediff1 / (60 * 60 * 24));

                                        if ($days < 7 && $value1['legal_action_date'] != '0000-00-00 00:00:00') {
                                            $belowBudget7['count'] ++;
                                            $belowBudget7['request_number_ids'][] = $value1['request_number'];
                                        } elseif ($days >= 7 && $days <= 12 && $value1['legal_action_date'] != '0000-00-00 00:00:00') {
                                            $aboveBudget7['count'] ++;
                                            $aboveBudget7['request_number_ids'][] = $value1['request_number'];
                                        } elseif ($days1 < 12 && $value1['legal_action_date'] == '0000-00-00 00:00:00') {
                                            $pendingBudget['count'] ++;
                                            $pendingBudget['request_number_ids'][] = $value1['request_number'];
                                        } else {
                                            $aboveBudget12['count'] ++;
                                            $aboveBudget12['request_number_ids'][] = $value1['request_number'];
                                        }

                                        $requesType['Icf']['bar_chart'] = array('below7' => $belowBudget7, 'above7' => $aboveBudget7, 'above12' => $aboveBudget12, 'pending' => $pendingBudget);
                                    } else if (array_key_exists("type_contract_language", $value1)) {
                                        $requesType[$value1['type_contract_language']]['count'] ++;
                                        $requesType[$value1['type_contract_language']]['request_number_ids'][] = $value1['request_number'];

                                        if ($value1['type_contract_language'] == 'CTA') {
                                            $requesType[$value1['type_contract_language']]['pie_chart'][$value1['type_issues']]['request_number_ids'][] = $value1['request_number'];


                                            $datediff = strtotime($value1['legal_action_date']) - strtotime($value1['create_date']);
                                            $days = floor($datediff / (60 * 60 * 24));

                                            //check whether the request is 12 more days
                                            $now = time(); // or your date as well
                                            $datediff1 = $now - strtotime($value1['create_date']);
                                            $days1 = floor($datediff1 / (60 * 60 * 24));

                                            if ($days < 7 && $value1['legal_action_date'] != '0000-00-00 00:00:00') {
                                                $belowCTA7['count'] ++;
                                                $belowCTA7['request_number_ids'][] = $value1['request_number'];
                                            } elseif ($days >= 7 && $days <= 12 && $value1['legal_action_date'] != '0000-00-00 00:00:00') {
                                                $aboveCTA7['count'] ++;
                                                $aboveCTA7['request_number_ids'][] = $value1['request_number'];
                                            } elseif ($days1 < 12 && $value1['legal_action_date'] == '0000-00-00 00:00:00') {
                                                $pendingCTA['count'] ++;
                                                $pendingCTA['request_number_ids'][] = $value1['request_number'];
                                            } else {
                                                $aboveCTA12['count'] ++;
                                                $aboveCTA12['request_number_ids'][] = $value1['request_number'];
                                            }

                                            $requesType[$value1['type_contract_language']]['bar_chart'] = array('below7' => $belowCTA7, 'above7' => $aboveCTA7, 'above12' => $aboveCTA12, 'pending' => $pendingCTA);
                                        }
                                    } else {
                                        $requesType['Budget']['count'] ++;
                                        $requesType['Budget']['request_number_ids'][] = $value1['request_number'];

                                        $requesType['Budget']['pie_chart'][$value1['choose_an_issue']]['request_number_ids'][] = $value1['request_number'];

                                        $datediff = strtotime($value1['legal_action_date']) - strtotime($value1['create_date']);
                                        $days = floor($datediff / (60 * 60 * 24));

                                        //check whether the request is 12 more days
                                        $now = time(); // or your date as well
                                        $datediff1 = $now - strtotime($value1['create_date']);
                                        $days1 = floor($datediff1 / (60 * 60 * 24));

                                        if ($days < 7 && $value1['legal_action_date'] != '0000-00-00 00:00:00') {
                                            $belowBudget7['count'] ++;
                                            $belowBudget7['request_number_ids'][] = $value1['request_number'];
                                        } elseif ($days >= 7 && $days <= 12 && $value1['legal_action_date'] != '0000-00-00 00:00:00') {
                                            $aboveBudget7['count'] ++;
                                            $aboveBudget7['request_number_ids'][] = $value1['request_number'];
                                        } elseif ($days1 < 12 && $value1['legal_action_date'] == '0000-00-00 00:00:00') {
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
                                $response['json_data']['response'][] = array('bar_chart' => array('below7' => $below7, 'above7' => $above7, 'above12' => $above12, 'pending' => $pending), 'languageIssues' => $languageIssues, 'icfIssues' => $icfIssues, 'budgetIssues' => $budgetIssues, 'issues_count' => count($value), 'legal_id' => $value['0']['legal_user_id'], 'legal_first_name' => $value['0']['legal_first_name'], 'legal_last_name' => $value['0']['legal_last_name'], 'pie_chart' => $requesType);
                            } elseif ($data['escLegal'] == 3):

                            $bindparams = array($data['escalationLegalID'], $data['startDate'] . " 00:00:00", $data['endDate'] . " 23:59:59");

                            if (in_array("1", explode(',', $data['analyticsType']))) {
                                //coe request for Budget escalation on the basis of cro id ( User ID )
                                $sql = "SELECT coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name, 
                        coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                        coe_sitenames.sitename_id, coe_sitenames.sitename, 
                        coe_countries.country_id, coe_countries.country_name,
                        coe_budget_escalation.*, coe_budget_escalation.issue_id as request_number,
                        coe_issue_status.*, 1 as escalation_type_id, coe_escalation_request.user_id,
                        coe_issues_types.issue as choose_an_issue
                        FROM `coe_escalation_request`
                        LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                        LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                        LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                        LEFT JOIN coe_budget_escalation ON coe_escalation_request.request_id=coe_budget_escalation.request_id
                        LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_budget_escalation.issue_id
                        LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                        LEFT JOIN coe_issues_types ON coe_issues_types.id=coe_budget_escalation.choose_an_issue
                        WHERE coe_escalation_request.user_id=? && coe_escalation_request.escalation_type_id=1 && coe_escalation_request.insert_date BETWEEN ? AND ?";
                                $result = $this->_funcObject->sqlQuery($sql, $bindparams);
                            }

                            if (in_array("2", explode(',', $data['analyticsType']))) {
                                //coe request for contract language escalation on the basis of cro id ( User ID )
                                $sql1 = "SELECT coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name, 
                        coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                        coe_sitenames.sitename_id, coe_sitenames.sitename, 
                        coe_countries.country_id, coe_countries.country_name,
                        coe_language_escalation.*, coe_language_escalation.issue_id as request_number,
                        coe_issue_status.*, 2 as escalation_type_id, coe_escalation_request.user_id,
                        coe_issues_types.issue as type_issues
                        FROM `coe_escalation_request`
                        LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                        LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                        LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                        LEFT JOIN coe_language_escalation ON coe_escalation_request.request_id=coe_language_escalation.request_id
                        LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_language_escalation.issue_id
                        LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                        LEFT JOIN coe_issues_types ON coe_issues_types.id=coe_language_escalation.type_issues
                        WHERE coe_escalation_request.user_id=? && coe_escalation_request.escalation_type_id=2 && coe_escalation_request.insert_date BETWEEN ? AND ?";
                                $result1 = $this->_funcObject->sqlQuery($sql1, $bindparams);
                            }

                            if (in_array("4", explode(',', $data['analyticsType']))) {
                                //coe request for ICF escalation on the basis of cro id ( User ID )
                                $sql2 = "SELECT coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name, 
                            coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                            coe_sitenames.sitename_id, coe_sitenames.sitename, 
                            coe_countries.country_id, coe_countries.country_name,
                            coe_language_escalation.*, coe_language_escalation.issue_id as request_number,
                            coe_issue_status.*, 4 as escalation_type_id, coe_escalation_request.user_id, coe_escalation_request.escalation_sub_type_id
                            FROM `coe_escalation_request`
                            LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                            LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                            LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                            LEFT JOIN coe_language_escalation ON coe_escalation_request.request_id=coe_language_escalation.request_id
                            LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_language_escalation.issue_id
                            LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                            WHERE coe_escalation_request.user_id=? && coe_escalation_request.escalation_type_id=4 && coe_escalation_request.insert_date BETWEEN ? AND ?";
                                $result2 = $this->_funcObject->sqlQuery($sql2, $bindparams);
                            }

                            $arrayCombine = array_merge_recursive($result, $result1, $result2);

                            $arraySortDesc = array();
                            foreach ($arrayCombine['data'] as $key => $value) {
                                $arraySortDesc[$value['user_id']][] = $value;
                            }

                            krsort($arraySortDesc, SORT_ASC);

                            //check record found or not
                            if (empty($arraySortDesc)) {
                                $response['json_data']['response'] = 0;
                                $response['json_data']['message'] = "No record found, Please choose another date interval!";
                                return $response;
                            } else {
                                $response['json_data']['message'] = "Success";
                            }

                            $requesType['Budget']['count'] = 0;
                            $requesType['Icf']['count'] = 0;
                            foreach ($arraySortDesc as $key => $value) {
                                $budgetIssues = 0;
                                $languageIssues = 0;
                                $icfIssues = 0;

                                foreach ($value as $key1 => $value1) {

                                    //request type
                                    if ($value1['escalation_type_id'] == 4) {
                                        $requesType['Icf']['count'] ++;
                                        $requesType['Icf']['request_number_ids'][] = $value1['request_number'];

                                        $requesType['Icf']['pie_chart'][$value1['choose_an_issue']]['request_number_ids'][] = $value1['request_number'];
                                    } else if (array_key_exists("type_contract_language", $value1)) {
                                        $requesType[$value1['type_contract_language']]['count'] ++;
                                        $requesType[$value1['type_contract_language']]['request_number_ids'][] = $value1['request_number'];

                                        if ($value1['type_contract_language'] == 'CTA') {
                                            $requesType[$value1['type_contract_language']]['pie_chart'][$value1['type_issues']]['request_number_ids'][] = $value1['request_number'];
                                        }
                                    } else {
                                        $requesType['Budget']['count'] ++;
                                        $requesType['Budget']['request_number_ids'][] = $value1['request_number'];

                                        $requesType['Budget']['pie_chart'][$value1['choose_an_issue']]['request_number_ids'][] = $value1['request_number'];
                                    }


                                    if ($value1['escalation_type_id'] == 1) {
                                        $budgetIssues++;
                                    } else if ($value1['escalation_type_id'] == 4) {
                                        $icfIssues++;
                                    } else {
                                        $languageIssues++;
                                    }
                                }
                                $response['json_data']['response'][] = array('userId' => $value1['user_id'], 'languageIssues' => $languageIssues, 'budgetIssues' => $budgetIssues, 'icfIssues' => $icfIssues, 'issues_count' => count($value), 'pie_chart' => $requesType);
                            }
                        else:

                            $response['json_data']['message'] = "Request ID Not Found!";
                            $response['json_data']['response'] = 0;

                        endif;
                    }
                }
                else {
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

    /**
     * function for multiple view request numbers
     * @param type $data
     * @return int
     */
    public function viewRequestNumbers($data) {

        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $manvalues = array($data['requestNumbers']);
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    $response = array();
                    if ($checkdata === 0) {
                        //coe request for Budget escalation on the basis of issue ID
                        $sql = "SELECT coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name, 
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_budget_escalation.*, coe_budget_escalation.issue_id as request_number,
                    coe_issue_status.*, 1 as escalation_type_id,
                    user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name, user.email as raisedBy_email,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                    coe_issues_types.issue as choose_an_issue
                    FROM `coe_escalation_request`
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                    LEFT JOIN coe_budget_escalation ON coe_escalation_request.request_id=coe_budget_escalation.request_id
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_budget_escalation.issue_id
                    LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                    LEFT JOIN coe_issues_types ON coe_issues_types.id=coe_budget_escalation.choose_an_issue
                    WHERE coe_budget_escalation.issue_id IN (" . $data['requestNumbers'] . ") && coe_escalation_request.escalation_type_id=1";
                        $bindparams = array();
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        //coe request for contract language escalation on the basis of issue ID
                        $sql1 = "SELECT coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name, 
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_language_escalation.*, coe_language_escalation.issue_id as request_number,
                    coe_issue_status.*, 2 as escalation_type_id,
                    user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name, user.email as raisedBy_email,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                    coe_issues_types.issue as type_issues
                    FROM `coe_escalation_request`
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                    LEFT JOIN coe_language_escalation ON coe_escalation_request.request_id=coe_language_escalation.request_id
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_language_escalation.issue_id
                    LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                    LEFT JOIN coe_issues_types ON coe_issues_types.id=coe_language_escalation.type_issues
                    WHERE coe_language_escalation.issue_id IN (" . $data['requestNumbers'] . ") && coe_escalation_request.escalation_type_id=2";
                        $result1 = $this->_funcObject->sqlQuery($sql1, $bindparams);

                        //coe request for ICF escalation on the basis of issue ID
                        $sql2 = "SELECT coe_escalation_request.escalation_sub_type_id, coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name, 
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_icf_escalation.*, coe_icf_escalation.issue_id as request_number,
                    coe_issue_status.*, 4 as escalation_type_id,
                    user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name, user.email as raisedBy_email,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name
                    FROM `coe_escalation_request`
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                    LEFT JOIN coe_icf_escalation ON coe_escalation_request.request_id=coe_icf_escalation.request_id
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_icf_escalation.issue_id
                    LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                    WHERE coe_icf_escalation.issue_id IN (" . $data['requestNumbers'] . ") && coe_escalation_request.escalation_type_id=4";
                        $result2 = $this->_funcObject->sqlQuery($sql2, $bindparams);

                        //array merge
                        $arrayCombine = array_merge_recursive($result, $result1, $result2);

                        $arraySortDesc = array();
                        foreach ($arrayCombine['data'] as $key => $value) {
                            $arraySortDesc[$value['request_number']][] = $value;
                        }

                        //sort the array keys
                        krsort($arraySortDesc, SORT_ASC);

                        $array = array();
                        $i = 0;
                        foreach ($arraySortDesc as $value) {

                            $array[$i] = $value[0];
                            $array[$i]['proposed_language'] = utf8_encode(preg_replace('/\s\s+/', ' ', $value[0]['proposed_language']));
                            $array[$i]['dsec_issue'] = utf8_encode(preg_replace('/\s\s+/', ' ', $value[0]['dsec_issue']));

                            //get the track of actions
                            $sql1 = "SELECT coe_issue_reassignment.*, coe_users.first_name, coe_users.last_name FROM coe_issue_reassignment
                            LEFT JOIN coe_users ON coe_users.user_id = coe_issue_reassignment.coe_id
                            WHERE coe_issue_reassignment.issue_id=? ORDER BY coe_issue_reassignment.id DESC";
                            $bindparams = array($value[0]['issue_id']);
                            $result1 = $this->_funcObject->sqlQuery($sql1, $bindparams);

                            $array [$i]['action_track'] = $result1['data'];

                            if ($array[$i]['manager_attach_list'] == NULL) {
                                $array[$i]['manager_attach_list'] = '';
                            }

                            if ($array[$i]['legal_attach_list'] == NULL) {
                                $array[$i]['legal_attach_list'] = '';
                            }

                            $i++;
                        }

                        $count = (int) count($arrayCombine['data']);
                        if ($count > 0) {
                            $response['json_data']['message'] = "Success";
                            $response['json_data']['response']['data'] = $array;
                        } else {
                            $response['json_data']['message'] = "Not Found!";
                            $response['json_data']['response'] = 0;
                        }
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

    /**
     * list of users according to role
     * @return string
     */
    public function userManagement($data) {

        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $response = array();
                    $manvalues = array($data['role_id']);
                    $checkdata = $this->_funcObject->checkData($manvalues);

                    if ($checkdata === 0) {
                        $sql = "SELECT coe_users.user_id, coe_users.email, coe_users.first_name, coe_users.last_name, "
                                . "coe_users_roles.is_active, coe_users_roles.is_enabled, coe_users_roles.analatics, coe_users_roles.user_management, coe_users_roles.esc_type_id, coe_users_roles.esc_sub_type_id "
                                . "FROM `coe_users_roles` "
                                . "LEFT JOIN coe_users ON coe_users_roles.user_id = coe_users.user_id "
                                . "WHERE coe_users_roles.user_type=? AND coe_users_roles.is_delete=0";
                        $bindparams = array($data['role_id']);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $count = (int) count($result['data']);
                        if ($count > 0) {


                            if ($data['role_id'] == 3) {

                                $legalList = array();
                                foreach ($result['data'] as $key => $value) {

                                    $legalList[$value['user_id']]['user_id'] = $value['user_id'];
                                    $legalList[$value['user_id']]['email'] = $value['email'];
                                    $legalList[$value['user_id']]['first_name'] = $value['first_name'];
                                    $legalList[$value['user_id']]['last_name'] = $value['last_name'];
                                    $legalList[$value['user_id']]['is_active'] = $value['is_active'];
                                    $legalList[$value['user_id']]['is_enabled'] = $value['is_enabled'];
                                    $legalList[$value['user_id']]['analatics'] = $value['analatics'];
                                    $legalList[$value['user_id']]['user_management'] = $value['user_management'];

                                    $legalList[$value['user_id']]['legalType'][$key]['esc_type_id'] = $value['esc_type_id'];
                                    $legalList[$value['user_id']]['legalType'][$key]['esc_sub_type_id'] = $value['esc_sub_type_id'];
                                }

                                $result['data'] = array_values($legalList);

                                $legalList = array();
                                foreach ($result['data'] as $key => $value) {
                                    $legalList[$key] = $value;
                                    $legalList[$key]['legalType'] = array_values($legalList[$key]['legalType']);
                                }

                                $result['data'] = array_values($legalList);
                            }

                            $response['json_data']['message'] = "Success";
                            $response['json_data']['response'] = $result['data'];
                        } else {
                            $response['json_data']['message'] = "Not Found!";
                            $response['json_data']['response'] = 0;
                        }
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
    
    
    /**
     * list of deleted users according to role
     * @return string
     */
    public function userManagementDeleted($data) {

        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $response = array();
                    $manvalues = array($data['role_id']);
                    $checkdata = $this->_funcObject->checkData($manvalues);

                    if ($checkdata === 0) {
                        $sql = "SELECT DISTINCT coe_users.user_id, coe_users.email, coe_users.first_name, coe_users.last_name, 
                            coe_users_roles.is_active, coe_users_roles.is_enabled, coe_users_roles.analatics, coe_users_roles.user_management, coe_users_roles.esc_type_id, coe_users_roles.esc_sub_type_id FROM coe_users_roles 
                            LEFT JOIN coe_users ON coe_users_roles.user_id = coe_users.user_id 
                            LEFT JOIN coe_issue_reassignment ON coe_issue_reassignment.coe_id = coe_users.user_id
                            WHERE coe_users_roles.user_type=? 
                            AND coe_users_roles.is_delete=1 
                            AND coe_issue_reassignment.coe_id IS NOT NULL 
                            AND coe_issue_reassignment.coe_type = ? 
                            AND coe_users_roles.user_id NOT IN 
                            (SELECT DISTINCT coe_users_roles.user_id
                            FROM `coe_users_roles` 
                            WHERE coe_users_roles.user_type=? AND coe_users_roles.is_delete=0)";
                        $bindparams = array($data['role_id'], ($data['role_id']==2) ? '1' : '2' , $data['role_id']);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $count = (int) count($result['data']);
                        if ($count > 0) {

                            

                            if ($data['role_id'] == 3) {

                                $legalList = array();
                                foreach ($result['data'] as $key => $value) {

                                    $legalList[$value['user_id']]['user_id'] = $value['user_id'];
                                    $legalList[$value['user_id']]['email'] = $value['email'];
                                    $legalList[$value['user_id']]['first_name'] = $value['first_name'];
                                    $legalList[$value['user_id']]['last_name'] = $value['last_name'];
                                    $legalList[$value['user_id']]['is_active'] = $value['is_active'];
                                    $legalList[$value['user_id']]['is_enabled'] = $value['is_enabled'];
                                    $legalList[$value['user_id']]['analatics'] = $value['analatics'];
                                    $legalList[$value['user_id']]['user_management'] = $value['user_management'];

                                    $legalList[$value['user_id']]['legalType'][$key]['esc_type_id'] = $value['esc_type_id'];
                                    $legalList[$value['user_id']]['legalType'][$key]['esc_sub_type_id'] = $value['esc_sub_type_id'];
                                }

                                $result['data'] = array_values($legalList);

                                $legalList = array();
                                foreach ($result['data'] as $key => $value) {
                                    $legalList[$key] = $value;
                                    $legalList[$key]['legalType'] = array_values($legalList[$key]['legalType']);
                                }

                                $result['data'] = array_values($legalList);
                            }

                            $response['json_data']['message'] = "Success";
                            $response['json_data']['response'] = $result['data'];
                        } else {
                            $response['json_data']['message'] = "Not Found!";
                            $response['json_data']['response'] = 0;
                        }
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
    

    /**
     * Api patch for user roles
     * @return string
     */
    public function patchUserRoles() {

        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $response = array();
                    $manvalues = array();
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    if ($checkdata === 0) {
                        $sql = "SELECT * FROM coe_users ORDER BY user_id ASC";
                        $bindparams = array();
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $count = (int) count($result['data']);
                        if ($count > 0) {

                            foreach ($result['data'] as $key => $value) {

                                if ($value['user_type'] != 3 && $value['user_type'] != NULL) {

                                    $query = "INSERT INTO `coe_users_roles` (`esc_type_id`, `esc_sub_type_id`, `user_type`, `user_id` ";
                                    $values = " VALUES (?,?,?,?";
                                    $bindparams = array(0, 0, $value['user_type'], $value['user_id']);

                                    $query .= ", `is_enabled`, `is_active`, `is_delete`";
                                    $values .= ",?,?,?";

                                    $bindparams[] = $value['is_enabled'];
                                    $bindparams[] = $value['is_active'];
                                    $bindparams[] = $value['is_delete'];

                                    $query .= " )";
                                    $values .= " )";

                                    $this->_funcObject->sqlQuery($query . $values, $bindparams);
                                } elseif ($value['user_type'] == 3) {
                                    $directLegalQuery = "INSERT INTO `coe_legal_direct_assignees` (`legal_id`, `escalation_type_id`, `value`) VALUES (?,1,?), (?,2,?)";
                                    $bindparams = array($value['user_id'], 0, $value['user_id'], 0);
                                    $this->_funcObject->sqlQuery($directLegalQuery, $bindparams);
                                } else {
                                    //do nothing
                                }
                            }

                            $response['json_data']['message'] = "Success";
                            $response['json_data']['response'] = 1;
                        } else {
                            $response['json_data']['message'] = "Not Found!";
                            $response['json_data']['response'] = 0;
                        }
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

    /**
     * Api patch for choose an issue in Budget and Contract
     * @return string
     */
    public function patchChooseIssue() {

        $response = array();
        $manvalues = array();
        $checkdata = $this->_funcObject->checkData($manvalues);

        if ($checkdata === 0) {
            $sql = "SELECT coe_budget_escalation.issue_id, coe_issues_types.id, '1' as esclation_type FROM `coe_budget_escalation` 
                    LEFT JOIN coe_issues_types ON coe_issues_types.issue=coe_budget_escalation.choose_an_issue
                    UNION 
                    SELECT coe_language_escalation.issue_id, coe_issues_types.id, '2' as esclation_type FROM `coe_language_escalation` 
                    LEFT JOIN coe_issues_types ON coe_issues_types.issue=coe_language_escalation.type_issues
                    WHERE coe_language_escalation.type_contract_language='CTA'";
            $bindparams = array();
            $result = $this->_funcObject->sqlQuery($sql, $bindparams);

            $count = (int) count($result['data']);
            if ($count > 0) {
                foreach ($result['data'] as $key => $value) {
                    if ($value['id'] != NULL) {
                        if ($value['esclation_type'] == 1) {
                            $query = "UPDATE `coe_budget_escalation` SET `choose_an_issue`=? WHERE `issue_id`=?";
                            $bindparams = array($value['id'], $value['issue_id']);
                            $this->_funcObject->sqlQuery($query, $bindparams);
                        } else {
                            $query = "UPDATE `coe_language_escalation` SET `type_issues`=? WHERE `issue_id`=?";
                            $bindparams = array($value['id'], $value['issue_id']);
                            $this->_funcObject->sqlQuery($query, $bindparams);
                        }
                    }
                }


                $response['json_data']['message'] = "Success";
                $response['json_data']['response'] = 1;
            } else {
                $response['json_data']['message'] = "Not Found!";
                $response['json_data']['response'] = 0;
            }
        }
        return $response;
    }
    
    
     /**
     * Api patch for choose an issue in Budget and Contract
     * @return string
     */
    public function putManagerIdIssueStatus() {

        $response = array();
        $manvalues = array();
        $checkdata = $this->_funcObject->checkData($manvalues);

        if ($checkdata === 0) {
            $sql = "SELECT coe_budget_escalation.issue_id, coe_escalation_request.escalation_manager_id, '1' as esclation_type FROM `coe_budget_escalation` 
                    LEFT JOIN coe_escalation_request ON coe_escalation_request.request_id=coe_budget_escalation.request_id
                    UNION 
                    SELECT coe_language_escalation.issue_id, coe_escalation_request.escalation_manager_id, '2' as esclation_type FROM `coe_language_escalation` 
                    LEFT JOIN coe_escalation_request ON coe_escalation_request.request_id=coe_language_escalation.request_id";
            $bindparams = array();
            $result = $this->_funcObject->sqlQuery($sql, $bindparams);

            $count = (int) count($result['data']);
            if ($count > 0) {
                foreach ($result['data'] as $key => $value) {
                    if ($value['escalation_manager_id'] != NULL) {
                        
                        $sql = "SELECT * FROM `coe_issue_status` WHERE `issue_id`=?";
                        $bindparams = array($value['issue_id']);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);
                        if (count($result['data'])==1) {
                            $query = "UPDATE `coe_issue_status` SET `escalation_manager_id`=? WHERE `issue_id`=?";
                            $bindparams = array($value['escalation_manager_id'], $value['issue_id']);
                            $this->_funcObject->sqlQuery($query, $bindparams);
                        } else {
                            $query = "INSERT INTO `coe_issue_status` (`issue_id`, `manager_action_id`, `manager_action`, `manager_attach_list`, `escalation_manager_id`, `action_flag`) VALUES (?,?,?,?,?,?)";
                            $bindparams = array($value['issue_id'], 0, 0, 0, $value['escalation_manager_id'], 1);
                            $this->_funcObject->sqlQuery($query, $bindparams);
                        }
                    }
                }


                $response['json_data']['message'] = "Success";
                $response['json_data']['response'] = 1;
            } else {
                $response['json_data']['message'] = "Not Found!";
                $response['json_data']['response'] = 0;
            }
        }
        return $response;
    }

}
