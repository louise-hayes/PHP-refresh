<?php

header('Content-type: application/json');
require_once('../model/class.Functions.php');
require_once("mailer.php");
require_once 'jwt_helper.php';
require_once 'ConstantValue.php';

class PerformAction {

    function __autoload($class_name) {

        require $class_name . '.class.php';
    }

    public function __construct() {
        $this->_funcObject = new functions();
    }

    /**
     * priority switch
     * @param type $choosePriority
     * @return string
     */
    public function priorityFlag($choosePriority) {

        switch ($choosePriority) {

            case '1':
                $response = "Urgent";
                break;

            case '2':
                $response = "High";
                break;

            default:
                $response = "Normal";
                break;
        }

        return $response . " Priority";
    }

    /**
     * perform manager action 
     * @param type $data
     * @return int
     */
    public function escalationManagerAction($data) {
        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $mailer = new MAILER();
                    $response = array();
                    $manvalues = array($data['manager_action_id'], $data['issue_id'], $data['status'], $data['coe_id'], $data['role_id']);
                    $checkdata = $this->_funcObject->checkData($manvalues);

                    if ($checkdata === 0) {

                        if ($data['role_id'] == 'null') {
                            $data['role_id'] = 1;
                        }

                        if ($data['status'] == 1 && $data['desc'] == 'null') {
                            $data['desc'] = '';
                        }

                        $statusArray = array('2' => 'approved', '3' => 'denied', '4' => 'negotiation required', '5' => 'escalated', '6' => 'approved with modification', '7' => 'On hold', '8' => 'Reassigned', '9' => 'Closed');

                        //START------------Getting esclation manager detail from manager_action_id for mail
                        $query = "SELECT * FROM `coe_users` LEFT JOIN coe_users_roles ON coe_users_roles.user_id=coe_users.user_id WHERE coe_users_roles.user_type=2 && coe_users.user_id=?";
                        $bindparams = array($data['manager_action_id']);
                        $result = $this->_funcObject->sqlQuery($query, $bindparams);

                        $escalationManagerId = $result['data'][0]['user_id'];
                        $escalationManagerEmail = $result['data'][0]['email'];
                        $escalationManagerName = $result['data'][0]['first_name'] . " " . $result['data'][0]['last_name'];
                        //END------------Getting esclation manager detail from manager_action_id

                        $sql = "SELECT coe_users.email, coe_users.first_name, coe_users.last_name, coe_issue_status.* FROM `coe_issue_status` 
                                LEFT JOIN coe_users ON coe_users.user_id=coe_issue_status.legal_user_id
                                WHERE coe_issue_status.issue_id = ?";
                        $bindparams = array($data['issue_id']);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $legalEmail = $result['data'][0]['email'];
                        $legalName = $result['data'][0]['first_name'] . " " . $result['data'][0]['last_name'];

                        $sql = "SELECT coe_budget_escalation.request_id, '1' as escalation_type, coe_budget_escalation.selectPriority FROM coe_budget_escalation WHERE coe_budget_escalation.issue_id=? UNION SELECT coe_language_escalation.request_id, '2' as escalation_type, coe_language_escalation.selectPriority FROM coe_language_escalation WHERE coe_language_escalation.issue_id=?";
                        $bindparams = array($data['issue_id'], $data['issue_id']);
                        $requestIdData = $this->_funcObject->sqlQuery($sql, $bindparams);
                        $requestId = $requestIdData['data'][0]['request_id'];

                        $query = "SELECT coe_protocol_numbers.protocol_number, coe_sitenames.sitename,"
                                . "cro.email as croEmail, cro.first_name as croFirstName, cro.last_name as crolastName, "
                                . "coe_escalation_request.principle_investigator, coe_escalation_request.cc_email, coe_escalation_request.escalation_type_id FROM `coe_escalation_request` "
                                . "LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id "
                                . "LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id "
                                . "LEFT JOIN `coe_users` as cro ON coe_escalation_request.user_id=cro.user_id "
                                . "WHERE coe_escalation_request.request_id=?";

                        $bindparams = array($requestId);
                        $cro = $this->_funcObject->sqlQuery($query, $bindparams);

                        $croEmail = $cro['data'][0]['croEmail'];
                        $croName = $cro['data'][0]['croFirstName'] . " " . $cro['data'][0]['crolastName'];

                        $cc = $cro['data'][0]['cc_email'];
                        $escalation_type_id = $cro['data'][0]['escalation_type_id'];

                        $protocolNumber = $cro['data'][0]['protocol_number'];
                        $siteName = $cro['data'][0]['sitename'];
                        $principle_investigator = $cro['data'][0]['principle_investigator'];
                        //END------------Getting details of CRO/Escalation Manager for mail

                        $count = (int) count($result['data']);

                        //check if reassigned come for escalation manager or for legal
                        if ($data['status'] == 8) {

                            $query = "INSERT INTO `coe_issue_reassignment` (`issue_id`, `coe_id`, `coe_type`, `manager_action_id`) VALUES (?,?,?,?)";
                            $bindparams = array($data['issue_id'], $data['coe_id'], $data['role_id'], $data['manager_action_id']);
                            $insertResult = $this->_funcObject->sqlQuery($query, $bindparams);
                        }

                        if ($count > 0) {
                            $query = "UPDATE `coe_issue_status` SET `action_flag` = ?, `manager_action_id` = ?, `manager_action` = ?, `manager_action_desc` = ?";
                            $bindparams = array($data['role_id'], $data['manager_action_id'], $data['status'], $data['desc']);

                            if ($data['status'] == 8) {
                                if ($data['role_id'] == 2) {
                                    $query .= " , `legal_user_id` = ?";
                                    $bindparams[] = $data['coe_id'];
                                } else {
                                    $query .= ", `escalation_manager_id` = ?";
                                    $bindparams[] = $data['coe_id'];
                                }
                            }

                            if ($data['attachment'] != 0) {
                                $query .= ", manager_attach_list=CONCAT(manager_attach_list, '," . $data['attachment'] . "')";
                            }

                            if ($data['status'] != 0 && $data['status'] != 1) {
                                $query .= ", `manager_action_date` = ?";
                                $bindparams[] = date('Y-m-d H:i:s');
                            }
                            if ($data['status'] == 2 || $data['status'] == 3 || $data['status'] == 6 || $data['status'] == 9) {
                                $query .= ", `resolution_date` = ?";
                                $bindparams[] = date('Y-m-d H:i:s');
                            }

                            $query .= " WHERE `issue_id` = ?";
                            $bindparams[] = $data['issue_id'];
                        } else {
                            $query = "INSERT INTO `coe_issue_status` (`issue_id`, `manager_action_id`, `manager_action`, `manager_action_desc`, `manager_attach_list`, `action_flag`";
                            $bindparams = array($data['issue_id'], $data['manager_action_id'], $data['status'], $data['desc'], $data['attachment'], $data['role_id']);
                            $values = ') VALUES (?,?,?,?,?,?,?';
                            if ($data['status'] != 0 && $data['status'] != 1) {
                                $query .= ", `manager_action_date`";
                                $bindparams[] = date('Y-m-d H:i:s');
                                $values .= ',?';
                            }
                            if ($data['status'] == 2 || $data['status'] == 3 || $data['status'] == 6 || $data['status'] == 9) {
                                $query .= ", `resolution_date`";
                                $bindparams[] = date('Y-m-d H:i:s');
                                $values .= ',?';
                            }

                            if ($data['status'] == 8) {
                                if ($data['role_id'] == 2) {
                                    $query .= " , `legal_user_id` = ?";
                                    $bindparams[] = $data['coe_id'];
                                } else {
                                    $query .= ", `escalation_manager_id` = ?";
                                    $bindparams[] = $data['coe_id'];
                                }
                            }

                            $values .= ')';

                            $query = $query . $values;
                        }

                        $action = $this->_funcObject->sqlQuery($query, $bindparams);

                        if ($action) {

                            //START-----------Request raised Email to both parties CRO and Escaltion Manager
                            if ($data['status'] != 1) {
                                $subject = "C2 Application - Escalation " . $data['issue_id'] . " - " . $protocolNumber . " - " . $siteName . " - " . $principle_investigator . " - " . $this->priorityFlag($requestIdData['data'][0]['selectPriority']);
                                $emailBody = "Hello,<br><br>This is a " . $this->priorityFlag($requestIdData['data'][0]['selectPriority']) . " request.<br><br>
                                    The escalation request " . $data['issue_id'] . " - " . $protocolNumber . " - " . $siteName . " from " . $croName . " (<a href='mailto:".$croEmail."'>".$croEmail."</a>) has had the following action performed: " . $statusArray[$data['status']];


                                if (($data['status'] == 5 || $data['status'] == 8) && $data['role_id'] == 1) {

                                    //START------------Getting esclation manager detail from coe_id for mail\
                                    $query = "SELECT * FROM `coe_users` LEFT JOIN coe_users_roles ON coe_users_roles.user_id=coe_users.user_id WHERE coe_users_roles.user_type=2 && coe_users.user_id=?";
                                    //$query = "SELECT * FROM `coe_users` WHERE `user_type`=2 && `user_id`=?";
                                    $bindparams = array($data['coe_id']);
                                    $result = $this->_funcObject->sqlQuery($query, $bindparams);

                                    $escalationManagerId = $result['data'][0]['user_id'];
                                    $escalationManagerEmail = $result['data'][0]['email'];
                                    $escalationManagerName = $result['data'][0]['first_name'] . " " . $result['data'][0]['last_name'];
                                    //END------------Getting esclation manager detail from coe_id

                                    $emailBody .= " to " . $escalationManagerName. " (<a href='mailto:".$escalationManagerEmail."'>".$escalationManagerEmail."</a>)"; //validating the escalation request reassigned and to escalation manager
                                } else if (($data['status'] == 5 || $data['status'] == 8) && $data['role_id'] == 2) {
                                    
                                    //START------------Getting esclation manager detail from coe_id for mail\
                                    $query = "SELECT * FROM `coe_users` LEFT JOIN coe_users_roles ON coe_users_roles.user_id=coe_users.user_id WHERE coe_users_roles.user_type=3 && coe_users.user_id=?";
                                    //$query = "SELECT * FROM `coe_users` WHERE `user_type`=2 && `user_id`=?";
                                    $bindparams = array($data['coe_id']);
                                    $result = $this->_funcObject->sqlQuery($query, $bindparams);

                                    $legalId = $result['data'][0]['user_id'];
                                    $legalEmail = $result['data'][0]['email'];
                                    $legalName = $result['data'][0]['first_name'] . " " . $result['data'][0]['last_name'];
                                    //END------------Getting esclation manager detail from coe_id
                                    
                                    $emailBody .= " to " . $legalName. " (<a href='mailto:".$legalEmail."'>".$legalEmail."</a>)"; //validating the escalation request reassigned and to escalation manager
                                } else {
                                    $emailBody .= " by " . $escalationManagerName. "(<a href='mailto:".$escalationManagerEmail."'>".$escalationManagerEmail."</a>)"; //if other actions
                                }

                                $emailBody .= ". Please login into the C2 Application (https://coe.mobileprogrammingllc.com/) for further details.<br><br>To view request please click on the link below (view only):<br>
                                    <br>
                                    https://" . $_SERVER['HTTP_HOST'] . "/ccPage.html?request_id=" . $requestId . "&escalation_type_id=" . $escalation_type_id . "<br><br>
                                    <br>Thank you.";

                                $mailer->sendMail($croEmail, $subject, $emailBody, $cc);

                                $mailer->sendMail($escalationManagerEmail, $subject, $emailBody);

                                //copy email to legal also
                                if ($data['status'] == 5 || $data['status'] == 8) {
                                    $mailer->sendMail($legalEmail, $subject, $emailBody);
                                }
                            }
                            //END-------------Request raised Email to both parties CRO and Escaltion Manager


                            $response['json_data']['message'] = "Action Submitted";
                            $response['json_data']['response'] = $action;
                        } else {
                            $response['json_data']['message'] = "Something Went wrong!";
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
     * perform legal action
     * @param $data
     * @return int
     */
    public function legalAction($data) {
        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $mailer = new MAILER();
                    $response = array();
                    $manvalues = array($data['legal_action_id'], $data['issue_id'], $data['status'], $data['attachment'], $data['coe_id'], $data['role_id']);
                    $checkdata = $this->_funcObject->checkData($manvalues);

                    if ($checkdata === 0) {

                        if ($data['role_id'] == 'null') {
                            $data['role_id'] = 2;
                        }

                        $sql = "SELECT coe_users.email, coe_users.first_name, coe_users.last_name, coe_issue_status.* FROM `coe_issue_status` 
                                LEFT JOIN coe_users ON coe_users.user_id=coe_issue_status.escalation_manager_id
                                WHERE coe_issue_status.issue_id = ?";
                        $bindparams = array($data['issue_id']);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $escalationEmail = $result['data'][0]['email'];
                        $escalationName = $result['data'][0]['first_name'] . " " . $result['data'][0]['last_name'];

                        $count = (int) count($result['data']);
                        if ($count > 0) {

                            //$statusArray = array('2' => 'approved', '3' => 'denied', '4' => 'approved with modification', '5' => 'pending-oc', '6' => 'On hold', '7' => 'Reassigned', '8' => 'Closed', '9' => 'Additional Modification');
                            $statusArray = array('2' => 'approved', '3' => 'denied', '4' => 'Additional Modification', '5' => 'pending-oc', '6' => 'approved with modification', '7' => 'On hold', '8' => 'Reassigned', '9' => 'Closed');


                            //START------------Getting legal detail from legal_action_id for mail
                            $query = "SELECT * FROM `coe_users` LEFT JOIN coe_users_roles ON coe_users_roles.user_id=coe_users.user_id WHERE coe_users_roles.user_type=3 && coe_users.user_id=?";
                            //$query = "SELECT * FROM `coe_users` WHERE `user_type`=3 && `user_id`=?";
                            $bindparams = array($data['legal_action_id']);
                            $result = $this->_funcObject->sqlQuery($query, $bindparams);

                            $legalManagerId = $result['data'][0]['user_id'];
                            $legalManagerEmail = $result['data'][0]['email'];
                            $legalManagerName = $result['data'][0]['first_name'] . " " . $result['data'][0]['last_name'];
                            //END------------Getting legal detail from legal_action_id


                            $sql = "SELECT coe_budget_escalation.request_id, '1' as escalation_type, coe_budget_escalation.selectPriority FROM coe_budget_escalation WHERE coe_budget_escalation.issue_id=? UNION"
                                    . " SELECT coe_language_escalation.request_id, '2' as escalation_type, coe_language_escalation.selectPriority FROM coe_language_escalation WHERE coe_language_escalation.issue_id=? UNION"
                                    . " SELECT coe_icf_escalation.request_id, '3' as escalation_type, '0' as selectPriority FROM coe_icf_escalation WHERE coe_icf_escalation.issue_id=?";
                            $bindparams = array($data['issue_id'], $data['issue_id'], $data['issue_id']);
                            $requestIdData = $this->_funcObject->sqlQuery($sql, $bindparams);

                            $requestId = $requestIdData['data'][0]['request_id'];


                            //START----------Getting details of CRO/Escalation Manager for mail
                            $query = "SELECT coe_protocol_numbers.protocol_number, coe_sitenames.sitename,"
                                    . "cro.email as croEmail, cro.first_name as croFirstName, cro.last_name as crolastName, "
                                    . "coe_escalation_request.principle_investigator, coe_escalation_request.cc_email, coe_escalation_request.escalation_type_id FROM `coe_escalation_request` "
                                    . "LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id "
                                    . "LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id "
                                    . "LEFT JOIN `coe_users` as cro ON coe_escalation_request.user_id=cro.user_id "
                                    . "WHERE coe_escalation_request.request_id=?";

                            $bindparams = array($requestId);
                            $cro = $this->_funcObject->sqlQuery($query, $bindparams);

                            $croEmail = $cro['data'][0]['croEmail'];
                            $croName = $cro['data'][0]['croFirstName'] . " " . $cro['data'][0]['crolastName'];

                            $cc = $cro['data'][0]['cc_email'];
                            $escalation_type_id = $cro['data'][0]['escalation_type_id'];
                            $principle_investigator = $cro['data'][0]['principle_investigator'];

                            $protocolNumber = $cro['data'][0]['protocol_number'];
                            $siteName = $cro['data'][0]['sitename'];

                            //END------------Getting details of CRO/Escalation Manager for mail
                            //check if reassigned come for legal or escalation manager
                            if ($data['status'] == 8) {
                                $query = "INSERT INTO `coe_issue_reassignment` (`issue_id`, `coe_id`, `coe_type`, `manager_action_id`) VALUES (?,?,?,?)";
                                $bindparams = array($data['issue_id'], $data['coe_id'], $data['role_id'], $data['manager_action_id']);
                                $insertResult = $this->_funcObject->sqlQuery($query, $bindparams);
                            }

                            $query = "UPDATE `coe_issue_status`  SET `action_flag` = ?, `legal_action_id` = ?, `legal_action` = ?, `legal_action_desc` = ?";
                            $bindparams = array($data['role_id'], $data['legal_action_id'], $data['status'], $data['desc']);

                            if ($data['status'] == 8) {
                                if ($data['role_id'] == 2) {
                                    $query .= " , `legal_user_id` = ?";
                                    $bindparams[] = $data['coe_id'];
                                } else {
                                    $query .= ", `escalation_manager_id` = ?";
                                    $bindparams[] = $data['coe_id'];
                                }
                            }

                            if ($data['attachment'] != 0) {
                                $query .= ", legal_attach_list=CONCAT(legal_attach_list, '," . $data['attachment'] . "')";
                            }

                            if ($data['status'] != 0 && $data['status'] != 1) {
                                $query .= ", `legal_action_date` = ?";
                                $bindparams[] = date('Y-m-d H:i:s');
                            }
                            if ($data['status'] == 2 || $data['status'] == 3 || $data['status'] == 6 || $data['status'] == 9) {
                                $query .= ", `resolution_date` = ?";
                                $bindparams[] = date('Y-m-d H:i:s');
                            }

                            $query .= " WHERE `issue_id` = ?";
                            $bindparams[] = $data['issue_id'];

                            $action = $this->_funcObject->sqlQuery($query, $bindparams);
                            if ($action) {

                                //START-----------Request raised Email to both parties CRO and Escaltion Manager
                                if ($data['status'] == 2 || $data['status'] == 3 || $data['status'] == 4 || $data['status'] == 5 || $data['status'] == 6 || $data['status'] == 7 || $data['status'] == 8 || $data['status'] == 9) {

                                    if ($cro['data'][0]['escalation_type_id'] == 4) {
                                        $subject = "C2 Application - Escalation " . $data['issue_id'];
                                        $emailBody = "Hello,<br><br>
                                        The escalation request " . $data['issue_id'] . " from " . $croName . " (<a href='mailto:".$croEmail."'>".$croEmail."</a>) has had the following action performed: ";


                                        if ($data['status'] == 8 && $data['role_id'] == 1) {
                                            $emailBody .= " to " . $escalationName; //validating the escalation request reassigned and to escalation manager
                                        } else if ($data['status'] == 8 && $data['role_id'] == 2) {

                                            //START------------Getting esclation manager detail from coe_id for mail
                                            $query = "SELECT * FROM `coe_users` LEFT JOIN coe_users_roles ON coe_users_roles.user_id=coe_users.user_id WHERE coe_users_roles.user_type=3 && coe_users.user_id=?";
                                            //$query = "SELECT * FROM `coe_users` WHERE `user_type`=3 && `user_id`=?";
                                            $bindparams = array($data['coe_id']);
                                            $result = $this->_funcObject->sqlQuery($query, $bindparams);

                                            $legalManagerId = $result['data'][0]['user_id'];
                                            $legalManagerEmail = $result['data'][0]['email'];
                                            $legalManagerName = $result['data'][0]['first_name'] . " " . $result['data'][0]['last_name'];
                                            //END------------Getting esclation manager detail from coe_id

                                            $emailBody .= "Reassigned to " . $legalManagerName. " (<a href='mailto:".$legalManagerEmail."'>".$legalManagerEmail."</a>)"; //validating the escalation request reassigned and to escalation manager
                                        } else {
                                            $emailBody .= $statusArray[$data['status']] . " by " . $legalManagerName. "(<a href='mailto:".$legalManagerEmail."'>".$legalManagerEmail."</a>)"; //if other actions
                                        }


                                        $emailBody .= ". Please login into the CoE App (https://coe.mobileprogrammingllc.com/) for further details.<br><br>To view request please click on the link below (view only):<br>
                                        <br>
                                        https://" . $_SERVER['HTTP_HOST'] . "/ccPage.html?request_id=" . $requestId . "&escalation_type_id=" . $escalation_type_id . "<br><br>
                                        <br>Thanks";

                                        $mailer->sendMail($croEmail, $subject, $emailBody, $cc);
                                        $mailer->sendMail($legalManagerEmail, $subject, $emailBody);
                                    } else {
                                        $subject = "C2 Application - Escalation " . $data['issue_id'] . " - " . $protocolNumber . " - " . $siteName . " - " . $principle_investigator . " - " . $this->priorityFlag($requestIdData['data'][0]['selectPriority']);
                                        $emailBody = "Hello,<br><br>This is a " . $this->priorityFlag($requestIdData['data'][0]['selectPriority']) . " request.<br><br>
                                        The escalation request " . $data['issue_id'] . " - " . $protocolNumber . " - " . $siteName . " from " . $croName . " (<a href='mailto:".$croEmail."'>".$croEmail."</a>) has had the following action performed: ";

                                        if ($data['status'] == 8 && $data['role_id'] == 1) {
                                            $emailBody .= " to " . $escalationName; //validating the escalation request reassigned and to escalation manager
                                        } else if ($data['status'] == 8 && $data['role_id'] == 2) {

                                            //START------------Getting esclation manager detail from coe_id for mail
                                            $query = "SELECT * FROM `coe_users` LEFT JOIN coe_users_roles ON coe_users_roles.user_id=coe_users.user_id WHERE coe_users_roles.user_type=3 && coe_users.user_id=?";
                                            //$query = "SELECT * FROM `coe_users` WHERE `user_type`=3 && `user_id`=?";
                                            $bindparams = array($data['coe_id']);
                                            $result = $this->_funcObject->sqlQuery($query, $bindparams);

                                            $legalManagerId = $result['data'][0]['user_id'];
                                            $legalManagerEmail = $result['data'][0]['email'];
                                            $legalManagerName = $result['data'][0]['first_name'] . " " . $result['data'][0]['last_name'];
                                            //END------------Getting esclation manager detail from coe_id

                                            $emailBody .= "Reassigned to " . $legalManagerName. "(<a href='mailto:".$legalManagerEmail."'>".$legalManagerEmail."</a>)"; //validating the escalation request reassigned and to escalation manager
                                        } else {
                                            $emailBody .= $statusArray[$data['status']] . " by " . $legalManagerName. "(<a href='mailto:".$legalManagerEmail."'>".$legalManagerEmail."</a>)"; //if other actions
                                        }

                                        $emailBody .= ". Please login into the CoE App (https://coe.mobileprogrammingllc.com/) for further details.<br><br>To view request please click on the link below (view only):<br>
                                        <br>
                                        https://" . $_SERVER['HTTP_HOST'] . "/ccPage.html?request_id=" . $requestId . "&escalation_type_id=" . $escalation_type_id . "<br><br>
                                        <br>Thanks";

                                        $mailer->sendMail($croEmail, $subject, $emailBody, $cc);
                                        $mailer->sendMail($escalationEmail, $subject, $emailBody);
                                        $mailer->sendMail($legalManagerEmail, $subject, $emailBody);
                                    }
                                }
                                //END-------------Request raised Email to both parties CRO and Escaltion Manager

                                $response['json_data']['message'] = "Action Submitted";
                                $response['json_data']['response'] = $action;
                            } else {
                                $response['json_data']['message'] = "Something Went wrong!";
                                $response['json_data']['response'] = 0;
                            }
                        } else {
                            $response['json_data']['message'] = "Issue not found!";
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

}
