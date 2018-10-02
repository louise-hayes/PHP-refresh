<?php

header('Content-type: application/json');

require_once('../model/class.Functions.php');
require_once("mailer.php");
require_once 'jwt_helper.php';
require_once 'ConstantValue.php';
class CronJob {

    function __autoload($class_name) {

        require $class_name . '.class.php';
    }

    public function __construct() {
        $this->_funcObject = new functions();
    }

    /**
     * Function for reminder emails to cro/escalation manager for pending tasks
     * @return type
     */
    public function croNegotiationCron() {
        $response = array();
        $mailer = new MAILER();
        $manvalues = array();
        $checkdata = $this->_funcObject->checkData($manvalues);

        if ($checkdata === 0) {

            //find negotiation required records
            $sql = "SELECT  coe_escalation_request.*,
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    manager.first_name as escalation_first_name, manager.last_name as escalation_last_name, manager.email as escalation_email,
                    user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name, user.email as raisedBy_email,
                    coe_issue_status.manager_action_date, coe_budget_escalation.issue_id as request_number
                    FROM `coe_issue_status` 
                    RIGHT JOIN coe_budget_escalation ON coe_budget_escalation.issue_id=coe_issue_status.issue_id
                    LEFT JOIN coe_escalation_request ON coe_budget_escalation.request_id=coe_escalation_request.request_id
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_users as manager ON coe_escalation_request.escalation_manager_id=manager.user_id
                    LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                    WHERE coe_issue_status.manager_action=4";
            $bindparams = array();
            $result = $this->_funcObject->sqlQuery($sql, $bindparams);

            //find negotiation required records
            $sql = "SELECT  coe_escalation_request.*,
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    manager.first_name as escalation_first_name, manager.last_name as escalation_last_name, manager.email as escalation_email,
                    user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name, user.email as raisedBy_email,
                    coe_issue_status.manager_action_date, coe_language_escalation.issue_id as request_number
                    FROM `coe_issue_status`
                    RIGHT JOIN coe_language_escalation ON coe_language_escalation.issue_id=coe_issue_status.issue_id
                    LEFT JOIN coe_escalation_request ON coe_language_escalation.request_id=coe_escalation_request.request_id
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_users as manager ON coe_escalation_request.escalation_manager_id=manager.user_id
                    LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                    WHERE coe_issue_status.manager_action=4";
            $bindparams = array();
            $result1 = $this->_funcObject->sqlQuery($sql, $bindparams);

            $arrayCombine = array_merge_recursive($result, $result1);
            $arrayResult = array();
            $arrayResult1 = array();

            foreach ($arrayCombine['data'] as $key => $value) {
                //check whether the request is 3 more days
                $now = time(); // or your date as well
                $datediff1 = $now - strtotime($value['manager_action_date']);
                $days = floor($datediff1 / (60 * 60 * 24));

                if (($days % 3) == 0 && $days != 0) {
                    $subject = "C2 Application reminder mail- " . $value['request_number'] . " - " . $value['protocol_number'] . " " . $value['sitename'] . " - in Negotiation Required status";
                    $emailBody = "Hello,<br><br>
                        The escalation request " . $value['request_number'] . " " . $value['protocol_number'] . " " . $value['sitename'] . " raised by " . $value['raisedBy_first_name'] . " " . $value['raisedBy_last_name'] . " is in Negotiation Required status since
                            " . $value['manager_action_date'] . ". Kindly connect with the Escalation Manager " . $value['escalation_first_name'] . " " . $value['escalation_last_name'] . " " . $value['escalation_email'] . "  for its resolution at the earliest. 
                        <br><br>Thank you.";
                    $sendmail = $mailer->sendMail($value['raisedBy_email'], $subject, $emailBody);
                    $arrayResult[] = $value;
                }

                if (($days % 6) == 0 && $days != 0) {
                    $subject = "C2 Application reminder mail- " . $value['request_number'] . " - " . $value['protocol_number'] . " " . $value['sitename'] . " - in Negotiation Required status";
                    $emailBody = "Hello,<br><br>
                        The escalation request " . $value['request_number'] . " " . $value['protocol_number'] . " " . $value['sitename'] . " raised by " . $value['raisedBy_first_name'] . " " . $value['raisedBy_last_name'] . " is in Negotiation Required status since
                            " . $value['manager_action_date'] . ". Kindly connect with the requestor if required.
                        <br><br>Thank you.";
                    $sendmail = $mailer->sendMail($value['escalation_email'], $subject, $emailBody);
                    $arrayResult1[] = $value;
                }
            }

            //find pending-oc records
            $sql = "SELECT  coe_escalation_request.*,
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    manager.first_name as escalation_first_name, manager.last_name as escalation_last_name, manager.email as escalation_email,
                    user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name, user.email as raisedBy_email,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name, legal.email as legal_email,
                    coe_issue_status.manager_action_date, coe_issue_status.legal_action_date, coe_budget_escalation.issue_id as request_number
                    FROM `coe_issue_status` 
                    RIGHT JOIN coe_budget_escalation ON coe_budget_escalation.issue_id=coe_issue_status.issue_id
                    LEFT JOIN coe_escalation_request ON coe_budget_escalation.request_id=coe_escalation_request.request_id
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_users as manager ON coe_escalation_request.escalation_manager_id=manager.user_id
                    LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id 
                    WHERE coe_issue_status.legal_action=5";
            $bindparams = array();
            $result = $this->_funcObject->sqlQuery($sql, $bindparams);

            //find  pending-oc records
            $sql = "SELECT  coe_escalation_request.*,
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    manager.first_name as escalation_first_name, manager.last_name as escalation_last_name, manager.email as escalation_email,
                    user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name, user.email as raisedBy_email,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name, legal.email as legal_email,
                    coe_issue_status.manager_action_date, coe_issue_status.legal_action_date, coe_language_escalation.issue_id as request_number
                    FROM `coe_issue_status`
                    RIGHT JOIN coe_language_escalation ON coe_language_escalation.issue_id=coe_issue_status.issue_id
                    LEFT JOIN coe_escalation_request ON coe_language_escalation.request_id=coe_escalation_request.request_id
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_users as manager ON coe_escalation_request.escalation_manager_id=manager.user_id
                    LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id 
                    WHERE coe_issue_status.legal_action=5";
            $bindparams = array();
            $result1 = $this->_funcObject->sqlQuery($sql, $bindparams);

            $arrayCombine = array_merge_recursive($result, $result1);
            $arrayResult2 = array();

            foreach ($arrayCombine['data'] as $key => $value) {
                //check whether the request is 3 more days
                $now = time(); // or your date as well
                $datediff1 = strtotime($value['legal_action_date']) - strtotime($value['manager_action_date']);
                $days = floor($datediff1 / (60 * 60 * 24));

                if (($days % 7) == 0 && $days != 0) {
                    $subject = "C2 Application reminder mail- " . $value['request_number'] . " - " . $value['protocol_number'] . " " . $value['sitename'] . " - in Pending OC status";
                    $emailBody = "Hello,<br><br>
                        The escalation request " . $value['request_number'] . " " . $value['protocol_number'] . " " . $value['sitename'] . " raised by " . $value['raisedBy_first_name'] . " " . $value['raisedBy_last_name'] . " is in Pending OC status since
                            " . $value['legal_action_date'] . ". Kindly action on this request. 
                        <br><br>Thank you.";
                    $sendmail = $mailer->sendMail($value['legal_email'], $subject, $emailBody);
                    $arrayResult2[] = $value;
                }
            }


            $response['json_data']['message'] = "Success";
            $response['json_data']['response'] = array('cro_after_3_days' => $arrayResult, 'escalation_manager_after_6_days' => $arrayResult1, 'legal_after_6_days' => $arrayResult2);
        }
        return $response;
    }

}
