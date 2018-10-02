<?php

header('Content-type: application/json');
require_once('../model/class.Functions.php');
require_once("mailer.php");
require_once 'jwt_helper.php';
require_once 'ConstantValue.php';

class Icf {

    function __autoload($class_name) {

        require $class_name . '.class.php';
    }

    public function __construct() {
        $this->_funcObject = new functions();
    }

    /**
     * legal search
     * @param type $data
     * @return list of ICF legals according to the escalation types like global, country or sitename
     */
    public function legalListSearch($data) {
        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $response = array();
                    $manvalues = array($data['form_id'], $data['icf_form_id']);

                    $checkdata = $this->_funcObject->checkData($manvalues);
                    
                    if(isset($_POST['forAssignment'])){
                        $forAssignment=1;
                    }
                    else{
                        $forAssignment=0;
                    }

                    if ($checkdata === 0) {
                       if ($data['form_id'] == 4 && $data['icf_form_id'] != 0) {
                            $query = "SELECT DISTINCT coe_users.user_id, coe_users.email, coe_users.first_name, coe_users.last_name FROM `coe_users_roles` 
                            LEFT JOIN coe_users ON coe_users.user_id=coe_users_roles.user_id WHERE
                            coe_users_roles.`esc_sub_type_id`=? AND coe_users_roles.is_active=1 AND coe_users_roles.is_enabled=1 AND coe_users_roles.is_delete=0";
                            $bindparams = array($data['icf_form_id']);
                        } elseif ($data['form_id'] != 4 && $data['icf_form_id'] == 0 && $forAssignment!=1) {
                            $query = "SELECT DISTINCT coe_users.user_id, coe_users.email, coe_users.first_name, coe_users.last_name  FROM coe_users_roles
                            LEFT JOIN coe_users ON coe_users.user_id=coe_users_roles.user_id
                            WHERE coe_users_roles.`esc_type_id`=? AND coe_users_roles.is_active=1 AND coe_users_roles.is_enabled=1 AND coe_users_roles.is_delete=0 AND coe_users_roles.user_type=3";
                            $bindparams = array($data['form_id']);
                        } elseif($data['form_id'] != 4 && $data['icf_form_id'] == 0 && $forAssignment==1) {
                            $query = "SELECT DISTINCT coe_users.user_id, coe_users.email, coe_users.first_name, coe_users.last_name  FROM `coe_legal_direct_assignees` 
                            LEFT JOIN coe_users ON coe_users.user_id=coe_legal_direct_assignees.legal_id
                            LEFT JOIN coe_users_roles ON coe_users_roles.user_id=coe_users.user_id
                            WHERE coe_legal_direct_assignees.escalation_type_id=? AND coe_legal_direct_assignees.value=1 AND coe_legal_direct_assignees.is_active=1 AND coe_users_roles.is_active=1 AND coe_users_roles.is_enabled=1 AND coe_users_roles.is_delete=0";
                            $bindparams = array($data['form_id']);
                        }
                        else {
                            $response['json_data']['message'] = "Not Found!";
                            $response['json_data']['response'] = 0;
                            return $response;
                        }

                        $result = $this->_funcObject->sqlQuery($query, $bindparams);

                        $count = (int) count($result['data']);
                        if ($count > 0) {
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

}
