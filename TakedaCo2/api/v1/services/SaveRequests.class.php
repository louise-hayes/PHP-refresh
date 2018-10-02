<?php

header('Content-type: application/json');
require_once('../model/class.Functions.php');
require_once("mailer.php");
require_once 'jwt_helper.php';
require_once 'ConstantValue.php';

class SaveRequests {

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
     * save budget escalations (requests submit by cro) 
     * @param type $data
     * @return int
     */
    public function saveBudgetEscalation($data) {

        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->user_id != $data['user_id']) {
                    $response['json_data']['response'] = 5;
                    $response['json_data']['message'] = "Invalid Token or user.";
                } else {
                    $mailer = new MAILER();
                    $response = array();
                    $manvalues = array($data['currency_type'], $data['user_id'], $data['protocol_id'], $data['sitename'], $data['country'], $data['raised_by'], $data['principle_investigator'], $data['requested_by'], $data['followUp'], $data['esc_id'], $data['choose_issue'], $data['desc_issue'], $data['site_justification'], $data['do_add_attachment'], $data['request_id'], $data['attachment_file_ids']);
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    if ($checkdata === 0) {

                        $query = "SELECT issue_id FROM `coe_language_escalation` UNION SELECT issue_id FROM coe_budget_escalation UNION SELECT issue_id FROM coe_icf_escalation ORDER BY issue_id DESC LIMIT 0,1";
                        $bindparams = array();
                        $issue_id = $this->_funcObject->sqlQuery($query, $bindparams);
                        if (count($issue_id) > 0) {
                            (int) $issue_id = (int) ($issue_id['data'][0]['issue_id']) + 1;
                        } else {
                            (int) $issue_id = 1;
                        }

                        //Check whether the userID is correct or not
                        $query = "SELECT * FROM `coe_users` LEFT JOIN coe_users_roles ON coe_users_roles.user_id=coe_users.user_id WHERE coe_users_roles.user_type=1 && coe_users.user_id=?";
                        $bindparams = array($data['user_id']);
                        $result = $this->_funcObject->sqlQuery($query, $bindparams);
                        $count = (int) count($result['data']);
                        if ($count > 0) {
                            $croEmail = $result['data'][0]['email'];
                            $croName = $result['data'][0]['first_name'] . " " . $result['data'][0]['last_name'];
                        } else {
                            $response['json_data']['message'] = "User ID Not Found!";
                            $response['json_data']['response'] = 0;
                            return $response;
                        }

                        $query = "SELECT coe_protocol_numbers.protocol_number as name FROM coe_protocol_numbers WHERE coe_protocol_numbers.protocol_id=? "
                                . "UNION SELECT coe_sitenames.sitename as name FROM coe_sitenames WHERE coe_sitenames.sitename_id=?";
                        $bindparams = array($data['protocol_id'], $data['sitename']);
                        $result = $this->_funcObject->sqlQuery($query, $bindparams);
                        $protocolNo = $result['data'][0]['name'];
                        $siteName = $result['data'][1]['name'];

                        $escalationManagerId = 0;
                        $legalManagerId = 0;

                        if ($data['esc_id'] == 0) {
                            //verify the legals/escalation manager have any assignment
                            $query = "SELECT coe_users.user_id, coe_users.email, coe_users.first_name, coe_users.last_name,
                                  coe_users.last_assign_date,
                                  legal_users.user_id as legal_id,
                                  legal_users.email as legal_email, 
                                  legal_users.first_name as legal_first_name,
                                  legal_users.last_name as legal_last_name,
                                  coe_assignments.* FROM `coe_assignments`
                                  LEFT JOIN coe_users ON coe_assignments.escalation_manager_id=coe_users.user_id
                                  LEFT JOIN coe_users as legal_users ON coe_assignments.legal_id=legal_users.user_id
                                  WHERE coe_assignments.`form_id`=1 
                                  AND coe_assignments.`issue_type`=? 
                                  AND coe_assignments.`country_id`=? 
                                  AND coe_assignments.`protocol_id`=? 
                                  AND coe_assignments.`is_active`=1
                                  ORDER BY `last_assign_date` ASC LIMIT 0,1";
                            $bindparams = array($data['choose_issue'], $data['country'], $data['protocol_id']);
                            $resultAssignment = $this->_funcObject->sqlQuery($query, $bindparams);

                            if ($data['request_id'] != 0 && count($resultAssignment) == 0) {

                                $sql = "SELECT coe_issue_status.escalation_manager_id, coe_users.first_name, coe_users.last_name, coe_users.email, coe_issue_status.legal_user_id, legal_user.first_name as legal_first_name, legal_user.last_name as legal_last_name, legal_user.email as legal_email FROM `coe_escalation_request`
                                        LEFT JOIN coe_budget_escalation ON coe_budget_escalation.request_id=coe_escalation_request.request_id
                                        LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_budget_escalation.issue_id
                                        LEFT JOIN coe_users ON coe_users.user_id=coe_issue_status.escalation_manager_id
                                        LEFT JOIN coe_users as legal_user ON legal_user.user_id=coe_issue_status.legal_user_id
                                        WHERE coe_escalation_request.request_id=?";
                                $bindparams = array($data['request_id']);
                                $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                                if ($result['data'][0]['escalation_manager_id'] != 0) {
                                    $escalationManagerId = $result['data'][0]['escalation_manager_id'];
                                    $escalationManagerEmail = $result['data'][0]['email'];
                                    $escalationManagerName = $result['data'][0]['first_name'] . " " . $result['data'][0]['last_name'];
                                } else {
                                    $legalManagerId = $result['data'][0]['legal_user_id'];
                                    $legalManagerEmail = $result['data'][0]['legal_email'];
                                    $legalManagerName = $result['data'][0]['legal_first_name'] . " " . $result['data'][0]['legal_last_name'];
                                }
                            } elseif (count($resultAssignment) == 0) {
                                //START------------Getting esclation manager detail on the basis of ROUND ROBIN
                                $query = "SELECT * FROM `coe_users` LEFT JOIN coe_users_roles ON coe_users_roles.user_id=coe_users.user_id "
                                        . "WHERE coe_users_roles.user_type=2 AND coe_users_roles.is_active=1 "
                                        . "AND coe_users_roles.is_enabled=1 AND coe_users_roles.is_delete=0  "
                                        . "ORDER BY coe_users.`last_assign_date` ASC LIMIT 0,1";
                                $result = $this->_funcObject->sqlQuery($query, array());
                                if (count($result) == 0) {
                                    $response['json_data']['message'] = "Escalation Manager not found or Inactive!";
                                    $response['json_data']['response'] = 0;
                                    return $response;
                                } else {
                                    $escalationManagerId = $result['data'][0]['user_id'];
                                    $escalationManagerEmail = $result['data'][0]['email'];
                                    $escalationManagerName = $result['data'][0]['first_name'] . " " . $result['data'][0]['last_name'];
                                }
                            } else {

                                if ($resultAssignment['data'][0]['user_id'] != 0) {
                                    $escalationManagerId = $resultAssignment['data'][0]['user_id'];
                                    $escalationManagerEmail = $resultAssignment['data'][0]['email'];
                                    $escalationManagerName = $resultAssignment['data'][0]['first_name'] . " " . $resultAssignment['data'][0]['last_name'];
                                } else {
                                    $legalManagerId = $resultAssignment['data'][0]['legal_id'];
                                    $legalManagerEmail = $resultAssignment['data'][0]['legal_email'];
                                    $legalManagerName = $resultAssignment['data'][0]['legal_first_name'] . " " . $resultAssignment['data'][0]['legal_last_name'];
                                }
                            }

                            $query = "UPDATE `coe_users` SET `last_assign_date`=? WHERE `user_id`=?";
                            $bindparams = array(date('Y-m-d H:i:s'), ($escalationManagerId != 0) ? $escalationManagerId : $legalManagerId);
                            $this->_funcObject->sqlQuery($query, $bindparams);
                        } else {
                            $query = "SELECT * FROM `coe_users` LEFT JOIN coe_users_roles ON coe_users_roles.user_id=coe_users.user_id WHERE coe_users_roles.user_type=2 AND coe_users_roles.is_active=1 AND coe_users_roles.is_enabled=1 AND coe_users_roles.is_delete=0 AND coe_users.user_id=?";
                            $bindparams = array($data['esc_id']);
                            $result = $this->_funcObject->sqlQuery($query, $bindparams);

                            if (count($result) == 0) {
                                $response['json_data']['message'] = "Escalation Manager not found or Inactive!";
                                $response['json_data']['response'] = 0;
                                return $response;
                            } else {
                                $escalationManagerId = $result['data'][0]['user_id'];
                                $escalationManagerEmail = $result['data'][0]['email'];
                                $escalationManagerName = $result['data'][0]['first_name'] . " " . $result['data'][0]['last_name'];
                            }
                        }

                        if ($data['request_id'] == 0) {
                            //generating coe request if request id eqauls to 0
                            $query = "INSERT INTO `coe_escalation_request` (`user_id`, `escalation_type_id`, `protocol_id`, `sitename`, `country_id`, `raised_by`, `principle_investigator`, `requested_by`, `followUp`, `cc_email`) VALUES (?,?,?,?,?,?,?,?,?,?)";
                            $bindparams = array($data['user_id'], $data['escalation_type_id'], $data['protocol_id'], $data['sitename'], $data['country'], $data['raised_by'], $data['principle_investigator'], $data['requested_by'], $data['followUp'], $data['cc_email']);
                            $requestID = $this->_funcObject->sqlQuery($query, $bindparams);
                        } else {
                            $requestID = $data['request_id'];
                        }



                        $query = "INSERT INTO `coe_budget_escalation` (`issue_id`, `request_id`, `choose_an_issue`, `dsec_issue`, `site_request`, `initial_offer`, `percent_initial`, `FMV_high`, `percent_FMV`, `site_justification`, `any_other_details`, `add_attachment`, `attachment_file_ids`, `highPriority`, `selectPriority`, `priorityReason`, `currency_type`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                        $bindparams = array($issue_id, $requestID, $data['choose_issue'], $data['desc_issue'], $data['site_request'], $data['initial_offer'], $data['percent_over_initial'], $data['fmv_high'], $data['percent_over_fmv'], $data['site_justification'], $data['anyother_details'], $data['do_add_attachment'], $data['attachment_file_ids'], $data['highPriority'], $data['selectPriority'], $data['priorityReason'], $data['currency_type']);
                        $this->_funcObject->sqlQuery($query, $bindparams);

                        if ($legalManagerId != 0) {
                            $query = "INSERT INTO `coe_issue_status` (`issue_id`, `manager_action_id`, `manager_action`, `manager_attach_list`, `legal_user_id`, `action_flag`) VALUES (?,?,?,?,?,?)";
                            $bindparams = array($issue_id, 0, 0, 0, $legalManagerId, 2);
                            $action = $this->_funcObject->sqlQuery($query, $bindparams);
                        } else {
                            $query = "INSERT INTO `coe_issue_status` (`issue_id`, `manager_action_id`, `manager_action`, `manager_attach_list`, `escalation_manager_id`, `action_flag`) VALUES (?,?,?,?,?,?)";
                            $bindparams = array($issue_id, 0, 0, 0, $escalationManagerId, 1);
                            $action = $this->_funcObject->sqlQuery($query, $bindparams);
                        }

                        $query = "INSERT INTO `coe_issue_reassignment` (`issue_id`, `coe_id`, `coe_type`) VALUES (?,?,?)";
                        $bindparams = array($issue_id, ($escalationManagerId != 0) ? $escalationManagerId : $legalManagerId, ($escalationManagerId != 0) ? 1 : 2);
                        $this->_funcObject->sqlQuery($query, $bindparams);

                        //START-----------Request raised Email to both parties CRO and Escaltion Manager
                        $subject = "C2 Application - Escalation - " . $issue_id . " - " . $protocolNo . " - " . $siteName . " - " . $data['principle_investigator'] . " - " . $this->priorityFlag($data['selectPriority']);
                        $emailBody = "Hello,<br><br>This is a " . $this->priorityFlag($data['selectPriority']) . " request.<br><br>
                        " . $croName . " (<a href='mailto:".$croEmail."'>".$croEmail."</a>) has raised an escalation " . $issue_id . " - " . $protocolNo . " - " . $siteName . " that has been assigned to " . (isset($escalationManagerName) ? $escalationManagerName : $legalManagerName) . " (<a href='mailto:".(isset($escalationManagerEmail) ? $escalationManagerEmail : $legalManagerEmail)."'>".(isset($escalationManagerEmail) ? $escalationManagerEmail : $legalManagerEmail)."</a>). 
                        Please login into the C2 Application (https://coe.mobileprogrammingllc.com/) for further details.<br><br>To view request please click on the link below (view only):<br><br>
                        https://" . $_SERVER['HTTP_HOST'] . "/ccPage.html?request_id=" . $requestID . "&escalation_type_id=" . $data['escalation_type_id'] . "<br><br>NOTE: To perform action on this request, please log into CoE C2 Application.<br><br>
                        <br>Thank you.";

                        $mailer->sendMail($croEmail, $subject, $emailBody, $data['cc_email']);
                        $mailer->sendMail(isset($escalationManagerEmail) ? $escalationManagerEmail : $legalManagerEmail, $subject, $emailBody);
                        //END-------------Request raised Email to both parties CRO and Escaltion Manager

                        $response['json_data']['message'] = "Success";
                        $response['json_data']['response'] = 1;
                        $response['json_data']['request_id'] = $requestID;
                    }
                }
            } catch (Exception $ex) {
                $response['json_data']['response'] = 7;
                $response['json_data']['message'] = "Oops something went wrong";
            }
        } else {
            $response['json_data']['response'] = 6;
            $response['json_data']['message'] = "Authorization Token Not found";
        }
        return $response;
    }

    /**
     * save Language escalations (requests submit by cro)
     * @param type $data
     * @return int
     */
    public function saveLanguageEscalation($data) {
        $response = array();
        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->user_id != $data['user_id']) {
                    $response['json_data']['response'] = 5;
                    $response['json_data']['message'] = "Invalid Token or user.";
                } else {
                    $mailer = new MAILER();
                    $manvalues = array($data['user_id'], $data['protocol_id'], $data['sitename'], $data['country'], $data['raised_by'], $data['principle_investigator'], $data['requested_by'], $data['followUp'], $data['esc_id'], $data['type_contract'], $data['type_issues'], $data['proposed_language'], $data['site_rationale'], $data['do_add_attachment'], $data['attempts_negotiate'], $data['request_id'], $data['attachment_file_ids']);
                    $checkdata = $this->_funcObject->checkData($manvalues);

                    if ($checkdata === 0) {

                        $query = "SELECT issue_id FROM `coe_language_escalation` UNION SELECT issue_id FROM coe_budget_escalation UNION SELECT issue_id FROM coe_icf_escalation ORDER BY issue_id DESC LIMIT 0,1";
                        $bindparams = array();
                        $issue_id = $this->_funcObject->sqlQuery($query, $bindparams);
                        if (count($issue_id) > 0) {
                            $issue_id = $issue_id['data'][0]['issue_id'] + 1;
                        } else {
                            $issue_id = 1;
                        }

                        //Check whether the userID is correct or not
                        $query = "SELECT * FROM `coe_users` LEFT JOIN coe_users_roles ON coe_users_roles.user_id=coe_users.user_id WHERE coe_users_roles.user_type=1 && coe_users.user_id=?";
                        $bindparams = array($data['user_id']);
                        $result = $this->_funcObject->sqlQuery($query, $bindparams);
                        $count = (int) count($result['data']);
                        if ($count > 0) {
                            $croEmail = $result['data'][0]['email'];
                            $croName = $result['data'][0]['first_name'] . " " . $result['data'][0]['last_name'];
                        } else {
                            $response['json_data']['message'] = "User ID Not Found!";
                            $response['json_data']['response'] = 0;
                        }

                        $query = "SELECT coe_protocol_numbers.protocol_number as name FROM coe_protocol_numbers WHERE coe_protocol_numbers.protocol_id=? "
                                . "UNION SELECT coe_sitenames.sitename as name FROM coe_sitenames WHERE coe_sitenames.sitename_id=?";
                        $bindparams = array($data['protocol_id'], $data['sitename']);
                        $result = $this->_funcObject->sqlQuery($query, $bindparams);
                        $protocolNo = $result['data'][0]['name'];
                        $siteName = $result['data'][1]['name'];

                        $escalationManagerId = 0;
                        $legalManagerId = 0;

                        if ($data['esc_id'] == 0) {
                            //verify the legals/escalation manager have any assignment
                            $query = "SELECT coe_users.user_id, coe_users.email, coe_users.first_name, coe_users.last_name,
                                      coe_users.last_assign_date,
                                      legal_users.user_id as legal_id,
                                      legal_users.email as legal_email, 
                                      legal_users.first_name as legal_first_name,
                                      legal_users.last_name as legal_last_name,
                                      coe_assignments.* FROM `coe_assignments`
                                      LEFT JOIN coe_users ON coe_assignments.escalation_manager_id=coe_users.user_id
                                      LEFT JOIN coe_users as legal_users ON coe_assignments.legal_id=legal_users.user_id
                                      WHERE coe_assignments.`form_id`=2 
                                      AND coe_assignments.`cta_type`=?
                                      AND coe_assignments.`issue_type`=? 
                                      AND coe_assignments.`country_id`=? 
                                      AND coe_assignments.`protocol_id`=? 
                                      AND coe_assignments.`is_active`=1
                                      ORDER BY `last_assign_date` ASC LIMIT 0,1";
                            $bindparams = array($data['type_contract'], $data['type_issues'], $data['country'], $data['protocol_id']);
                            $resultAssignment = $this->_funcObject->sqlQuery($query, $bindparams);

                            if ($data['request_id'] != 0 && count($resultAssignment) == 0) {

                                $sql = "SELECT coe_issue_status.escalation_manager_id, coe_users.first_name, coe_users.last_name, coe_users.email, coe_issue_status.legal_user_id, legal_user.first_name as legal_first_name, legal_user.last_name as legal_last_name, legal_user.email as legal_email FROM `coe_escalation_request`
                                        LEFT JOIN coe_language_escalation ON coe_language_escalation.request_id=coe_escalation_request.request_id
                                        LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_language_escalation.issue_id
                                        LEFT JOIN coe_users ON coe_users.user_id=coe_issue_status.escalation_manager_id
                                        LEFT JOIN coe_users as legal_user ON legal_user.user_id=coe_issue_status.legal_user_id
                                        WHERE coe_escalation_request.request_id=?";
                                $bindparams = array($data['request_id']);
                                $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                                if ($result['data'][0]['escalation_manager_id'] != 0) {
                                    $escalationManagerId = $result['data'][0]['escalation_manager_id'];
                                    $escalationManagerEmail = $result['data'][0]['email'];
                                    $escalationManagerName = $result['data'][0]['first_name'] . " " . $result['data'][0]['last_name'];
                                } else {
                                    $legalManagerId = $result['data'][0]['legal_user_id'];
                                    $legalManagerEmail = $result['data'][0]['legal_email'];
                                    $legalManagerName = $result['data'][0]['legal_first_name'] . " " . $result['data'][0]['legal_last_name'];
                                }
                            } elseif (count($resultAssignment) == 0) {
                                //START------------Getting esclation manager detail on the basis of ROUND ROBIN
                                $query = "SELECT * FROM `coe_users` LEFT JOIN coe_users_roles ON coe_users_roles.user_id=coe_users.user_id "
                                        . "WHERE coe_users_roles.user_type=2 AND coe_users_roles.is_active=1 "
                                        . "AND coe_users_roles.is_enabled=1 AND coe_users_roles.is_delete=0  "
                                        . "ORDER BY coe_users.`last_assign_date` ASC LIMIT 0,1";
                                $result = $this->_funcObject->sqlQuery($query, array());
                                if (count($result) == 0) {
                                    $response['json_data']['message'] = "Escalation Manager not found or Inactive!";
                                    $response['json_data']['response'] = 0;
                                    return $response;
                                } else {
                                    $escalationManagerId = $result['data'][0]['user_id'];
                                    $escalationManagerEmail = $result['data'][0]['email'];
                                    $escalationManagerName = $result['data'][0]['first_name'] . " " . $result['data'][0]['last_name'];
                                }
                            } else {

                                if ($resultAssignment['data'][0]['user_id'] != 0) {
                                    $escalationManagerId = $resultAssignment['data'][0]['user_id'];
                                    $escalationManagerEmail = $resultAssignment['data'][0]['email'];
                                    $escalationManagerName = $resultAssignment['data'][0]['first_name'] . " " . $resultAssignment['data'][0]['last_name'];
                                } else {
                                    $legalManagerId = $resultAssignment['data'][0]['legal_id'];
                                    $legalManagerEmail = $resultAssignment['data'][0]['legal_email'];
                                    $legalManagerName = $resultAssignment['data'][0]['legal_first_name'] . " " . $resultAssignment['data'][0]['legal_last_name'];
                                }
                            }

                            $query = "UPDATE `coe_users` SET `last_assign_date`=? WHERE `user_id`=?";
                            $bindparams = array(date('Y-m-d H:i:s'), ($escalationManagerId != 0) ? $escalationManagerId : $legalManagerId);
                            $this->_funcObject->sqlQuery($query, $bindparams);
                        } else {
                            $query = "SELECT * FROM `coe_users` LEFT JOIN coe_users_roles ON coe_users_roles.user_id=coe_users.user_id WHERE coe_users_roles.user_type=2 AND coe_users_roles.is_active=1 AND coe_users_roles.is_enabled=1 AND coe_users_roles.is_delete=0 AND coe_users.user_id=?";
                            $bindparams = array($data['esc_id']);
                            $result = $this->_funcObject->sqlQuery($query, $bindparams);

                            if (count($result) == 0) {
                                $response['json_data']['message'] = "Escalation Manager not found or Inactive!";
                                $response['json_data']['response'] = 0;
                                return $response;
                            } else {
                                $escalationManagerId = $result['data'][0]['user_id'];
                                $escalationManagerEmail = $result['data'][0]['email'];
                                $escalationManagerName = $result['data'][0]['first_name'] . " " . $result['data'][0]['last_name'];
                            }
                        }

                        if ($data['request_id'] == 0) {
                            //generating coe request if request id eqauls to 0
                            $query = "INSERT INTO `coe_escalation_request` (`user_id`, `escalation_type_id`, `protocol_id`, `sitename`, `country_id`, `raised_by`, `principle_investigator`, `requested_by`, `followUp`, `cc_email`) VALUES (?,?,?,?,?,?,?,?,?,?)";
                            $bindparams = array($data['user_id'], $data['escalation_type_id'], $data['protocol_id'], $data['sitename'], $data['country'], $data['raised_by'], $data['principle_investigator'], $data['requested_by'], $data['followUp'], $data['cc_email']);
                            $requestID = $this->_funcObject->sqlQuery($query, $bindparams);
                        } else {
                            $requestID = $data['request_id'];
                        }

                        $query = "INSERT INTO `coe_language_escalation` (`issue_id`, `request_id`, `type_contract_language`, `type_issues`, `proposed_language`, `site_rationale`, `add_attachment`, `attachment_file_ids`, `attempts_negotiate`, `highPriority`, `selectPriority`, `priorityReason`, `other_detail`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
                        $bindparams = array($issue_id, $requestID, $data['type_contract'], $data['type_issues'], $data['proposed_language'], $data['site_rationale'], $data['do_add_attachment'], $data['attachment_file_ids'], $data['attempts_negotiate'], $data['highPriority'], $data['selectPriority'], $data['priorityReason'], $data['other_detail']);
                        $this->_funcObject->sqlQuery($query, $bindparams);

                        if ($legalManagerId != 0) {
                            $query = "INSERT INTO `coe_issue_status` (`issue_id`, `manager_action_id`, `manager_action`, `manager_attach_list`, `legal_user_id`, `action_flag`) VALUES (?,?,?,?,?,?)";
                            $bindparams = array($issue_id, 0, 0, 0, $legalManagerId, 2);
                            $action = $this->_funcObject->sqlQuery($query, $bindparams);
                        } else {
                            $query = "INSERT INTO `coe_issue_status` (`issue_id`, `manager_action_id`, `manager_action`, `manager_attach_list`, `escalation_manager_id`, `action_flag`) VALUES (?,?,?,?,?,?)";
                            $bindparams = array($issue_id, 0, 0, 0, $escalationManagerId, 1);
                            $action = $this->_funcObject->sqlQuery($query, $bindparams);
                        }

                        $query = "INSERT INTO `coe_issue_reassignment` (`issue_id`, `coe_id`, `coe_type`) VALUES (?,?,?)";
                        $bindparams = array($issue_id, ($escalationManagerId != 0) ? $escalationManagerId : $legalManagerId, ($escalationManagerId != 0) ? 1 : 2);
                        $this->_funcObject->sqlQuery($query, $bindparams);

                        //START-----------Request raised Email to both parties CRO and Escaltion Manager
                        $subject = "C2 Application - Escalation - " . $issue_id . " - " . $protocolNo . " - " . $siteName . " - " . $data['principle_investigator'] . " - " . $this->priorityFlag($data['selectPriority']);
                        $emailBody = "Hello,<br><br>This is a " . $this->priorityFlag($data['selectPriority']) . " request.<br><br>
                        " . $croName . " (<a href='mailto:".$croEmail."'>".$croEmail."</a>) has raised an escalation " . $issue_id . " - " . $protocolNo . " - " . $siteName . " that has been assigned to " . (isset($escalationManagerName) ? $escalationManagerName : $legalManagerName) . " (<a href='mailto:".(isset($escalationManagerEmail) ? $escalationManagerEmail : $legalManagerEmail)."'>".(isset($escalationManagerEmail) ? $escalationManagerEmail : $legalManagerEmail)."</a>). 
                        Please login into the C2 Application (https://coe.mobileprogrammingllc.com/) for further details.<br><br>To view request please click on the link below (view only):<br><br>
                        https://" . $_SERVER['HTTP_HOST'] . "/ccPage.html?request_id=" . $requestID . "&escalation_type_id=" . $data['escalation_type_id'] . "<br><br>NOTE: To perform action on this request, please log into CoE C2 Application.<br><br>
                        <br>Thank you.";

                        $mailer->sendMail($croEmail, $subject, $emailBody, $data['cc_email']);
                        $mailer->sendMail(isset($escalationManagerEmail) ? $escalationManagerEmail : $legalManagerEmail, $subject, $emailBody);
                        //END-------------Request raised Email to both parties CRO and Escaltion Manager

                        $response['json_data']['message'] = "Success";
                        $response['json_data']['response'] = 1;
                        $response['json_data']['request_id'] = $requestID;
                    }
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
     * function for save ICF Escalation
     * @param type $data
     * @return int
     */
    public function saveIcf($data) {

        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {

                    $manvalues = array($data['user_id'], $data['escalation_sub_type_id'], $data['protocol_id'], $data['region_id']);
                    $response = array();
                    $checkdata = $this->_funcObject->checkData($manvalues);

                    if ($checkdata === 0) {

                        //Check whether the userID is correct or not
                        $query = "SELECT * FROM `coe_users` LEFT JOIN coe_users_roles ON coe_users_roles.user_id=coe_users.user_id WHERE coe_users_roles.user_type=1 && coe_users.user_id=?";
                        $bindparams = array($data['user_id']);
                        $result = $this->_funcObject->sqlQuery($query, $bindparams);
                        $count = (int) count($result['data']);
                        if ($count > 0) {
                            $croEmail = $result['data'][0]['email'];
                            $croName = $result['data'][0]['first_name'] . " " . $result['data'][0]['last_name'];
                        } else {
                            $response['json_data']['message'] = "User ID Not Found!";
                            $response['json_data']['response'] = 0;
                        }

                        $query = "SELECT issue_id FROM `coe_language_escalation`"
                                . " UNION SELECT issue_id FROM coe_budget_escalation"
                                . " UNION SELECT issue_id FROM coe_icf_escalation"
                                . " ORDER BY issue_id DESC LIMIT 0,1";
                        $bindparams = array();
                        $issue_id = $this->_funcObject->sqlQuery($query, $bindparams);
                        if (count($issue_id) > 0) {
                            (int) $issue_id = (int) ($issue_id['data'][0]['issue_id']) + 1;
                        } else {
                            (int) $issue_id = 1;
                        }

                        if ($data['escalation_sub_type_id'] == 1) {
                            $query = "SELECT DISTINCT(coe_users.user_id), coe_users.* FROM `coe_assignments` 
                                    LEFT JOIN coe_users ON coe_users.user_id=coe_assignments.legal_id 
                                    LEFT JOIN coe_users_roles ON coe_users_roles.user_id=coe_users.user_id
                                    WHERE coe_assignments.icf_form_id=? AND coe_assignments.is_active=1 
                                    AND coe_assignments.`region_id`=? 
                                    AND coe_users_roles.`user_type`=3 
                                    AND coe_users_roles.is_active=1 
                                    AND coe_users_roles.is_enabled=1 
                                    AND coe_users_roles.is_delete=0
                                    ORDER BY coe_users.`last_assign_date` ASC LIMIT 0,1";
                            $bindparams = array($data['escalation_sub_type_id'], $data['region_id']);
                            $result = $this->_funcObject->sqlQuery($query, $bindparams);
                        } else {
                            $query = "SELECT  DISTINCT(coe_users.user_id), coe_users.* FROM `coe_assignments` 
                                    LEFT JOIN coe_users ON coe_users.user_id=coe_assignments.legal_id 
                                    LEFT JOIN coe_users_roles ON coe_users_roles.user_id=coe_users.user_id
                                    WHERE coe_assignments.`icf_form_id`=? 
                                    AND coe_assignments.country_id=? 
                                    AND coe_assignments.protocol_id=? 
                                    AND coe_users_roles.`user_type`=3 
                                    AND coe_users_roles.is_active=1 
                                    AND coe_users_roles.is_enabled=1 
                                    AND coe_users_roles.is_delete=0 
                                    AND coe_assignments.is_active=1
                                    ORDER BY coe_users.`last_assign_date` ASC LIMIT 0,1";
                            $bindparams = array($data['escalation_sub_type_id'], $data['country'], $data['protocol_id']);
                            $result = $this->_funcObject->sqlQuery($query, $bindparams);
                        }

                        if (count($result) == 0) {
                            //if relation not found for the both global and sitename then ifc others will assign on same request
                            $query = "SELECT DISTINCT coe_users.* FROM `coe_users_roles` 
                                    LEFT JOIN coe_users ON coe_users.user_id=coe_users_roles.user_id WHERE coe_users_roles.`esc_sub_type_id`=4
                                    AND coe_users_roles.`user_type`=3 
                                    AND coe_users_roles.is_active=1 
                                    AND coe_users_roles.is_enabled=1  
                                    AND coe_users_roles.is_delete=0 
                                    ORDER BY coe_users.`last_assign_date` ASC LIMIT 0,1";
                            $bindparams = array();
                            $result = $this->_funcObject->sqlQuery($query, $bindparams);
                            if (count($result) == 0) {
                                $response['json_data']['message'] = "Manager not found or Inactive!";
                                $response['json_data']['response'] = 0;
                                return $response;
                            }
                        }

                        $legalManagerAssignId = $result['data'][0]['user_id'];
                        $legalManagerAssignEmail = $result['data'][0]['email'];
                        $legalManagerAssignName = $result['data'][0]['first_name'] . " " . $result['data'][0]['last_name'];

                        $query = "UPDATE `coe_users` SET `last_assign_date`=? WHERE `user_id`=?";
                        $bindparams = array(date('Y-m-d H:i:s'), $legalManagerAssignId);
                        $this->_funcObject->sqlQuery($query, $bindparams);

                        //generating coe request
                        $query = "INSERT INTO `coe_escalation_request` (`user_id`, `escalation_type_id`, `escalation_sub_type_id`, `protocol_id`, `sitename`, `country_id`, `principle_investigator`, `region_id`, `cc_email`) VALUES (?,?,?,?,?,?,?,?,?)";
                        $bindparams = array($data['user_id'], 4, $data['escalation_sub_type_id'], $data['protocol_id'], $data['sitename'], $data['country'], $data['principle_investigator'], $data['region_id'], $data['cc_email']);
                        $requestID = $this->_funcObject->sqlQuery($query, $bindparams);


                        $query = "INSERT INTO `coe_icf_escalation` (`issue_id`,`request_id`, `section_requiring_legal_review`, `EC_IRB_feedback`, `any_other_detail`, `specify_relevant_document`, `attachment_global_icf`, `attachment_protocol`, `attachment_other_relevant_document`, `attachment_country_icf`, `attachment_site_icf`, `global_link`, `protocol_link`, `country_link`, `site_link`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                        $bindparams = array($issue_id, $requestID, $data['section_requiring_legal_review'], $data['EC_IRB_feedback'], $data['any_other_detail'], $data['specify_relevant_document'], $data['attachment_global_icf'], $data['attachment_protocol'], $data['attachment_other_relevant_document'], $data['attachment_country_icf'], $data['attachment_site_icf'], $data['attachment_global_link'], $data['attachment_protocol_link'], $data['attachment_country_icf_link'], $data['attachment_site_icf_link']);
                        $result = $this->_funcObject->sqlQuery($query, $bindparams);

                        $query = "INSERT INTO `coe_issue_status` (`issue_id`, `manager_action_id`, `manager_action`, `manager_attach_list`, `legal_user_id`, `action_flag`) VALUES (?,?,?,?,?,?)";
                        $bindparams = array($issue_id, 0, 0, 0, $legalManagerAssignId, 2);
                        $this->_funcObject->sqlQuery($query, $bindparams);

                        $query = "INSERT INTO `coe_issue_reassignment` (`issue_id`, `coe_id`, `coe_type`) VALUES (?,?,?)";
                        $bindparams = array($issue_id, $legalManagerAssignId, 2);
                        $this->_funcObject->sqlQuery($query, $bindparams);

                        //START-----------Request raised Email to both parties CRO and Escaltion Manager
                        $subject = "C2 Application - Escalation - " . $issue_id . " - ICF";
                        $emailBody = "Hello,<br><br>
                        " . $croName . " (<a href='mailto:".$croEmail."'>".$croEmail."</a>) has raised an escalation " . $issue_id . " - ICF that has been assigned to " . $legalManagerAssignName . "  (<a href='mailto:".$legalManagerAssignEmail."'>".$legalManagerAssignEmail."</a>). 
                        Please login into the C2 Application (https://coe.mobileprogrammingllc.com/) for further details.<br><br>To view request please click on the link below (view only):<br><br>
                        https://" . $_SERVER['HTTP_HOST'] . "/ccPage.html?request_id=" . $requestID . "&escalation_type_id=4<br><br>
                        <br>Thank you.";
                        $mailer = new MAILER();
                        $mailer->sendMail($croEmail, $subject, $emailBody, $data['cc_email']);
                        $mailer->sendMail($legalManagerAssignEmail, $subject, $emailBody);
                        //END-------------Request raised Email to both parties CRO and Escaltion Manager    

                        $response['json_data']['message'] = "Success";
                        $response['json_data']['response'] = 1;
                        $response['json_data']['request_id'] = $requestID;
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
