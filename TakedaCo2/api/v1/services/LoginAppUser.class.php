<?php

header('Content-type: application/json');
require_once('../model/class.Functions.php');
require_once("mailer.php");
require_once 'jwt_helper.php';
require_once 'ConstantValue.php';

class LoginAppUser {

    function __autoload($class_name) {

        require $class_name . '.class.php';
    }

    public function __construct() {
        $this->_funcObject = new functions();
    }

    /**
     * register user
     * @param type $data
     * @return int
     */
    public function registerUser($data) {

        $response = array();
        $manvalues = array($data['first_name'], $data['last_name'], $data['email'], $data['user_type'], $data['status']);

        $checkdata = $this->_funcObject->checkData($manvalues);
        if ($checkdata === 0) {

            //check email exist in system or not
            $checkUser = "SELECT coe_users_roles.* FROM `coe_users` LEFT JOIN coe_users_roles ON coe_users_roles.user_id=coe_users.user_id WHERE coe_users.`email` = ?";
            $userparams = array($data['email']);
            $user_result = $this->_funcObject->sqlQuery($checkUser, $userparams);
            $count = count($user_result['data'][0]['user_id']);


            if ($count >= 1) {

                //flag for to check whether the user delete from all roles or not
                $flag = false;
                foreach ($user_result['data'] as $key => $value) {
                    if ($value['is_delete'] == 0) {
                        $flag = true;
                    }
                }

                //if email exist and in delete state user activate and edit the user fields
                if ($flag == false) {
                    $sql = "UPDATE `coe_users` SET `first_name`=?, `last_name`=?, `update_date`=? WHERE `email` = ?";
                    $bindparams = array($data['first_name'], $data['last_name'], date('Y-m-d H:i:s'), $data['email']);
                    $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                    $queryDel = "DELETE FROM `coe_users_roles` WHERE `user_id`=?";
                    $bindparams = array($user_result['data'][0]["user_id"]);
                    $this->_funcObject->sqlQuery($queryDel, $bindparams);

                    foreach (explode(',', $data['user_type']) as $userType) {
                        //adding user roles if user is legal (user_type=3)
                        if ($userType == 3) {
                            foreach (explode(',', $data['esc_type_id']) as $value) {
                                if ($value != 4) {
                                    $query = "INSERT INTO `coe_users_roles` (`esc_type_id`, `esc_sub_type_id`, `user_type`, `user_id`, `is_active`)"
                                            . " VALUES (?,?,?,?,?)";
                                    $bindparams = array($value, 0, 3, $user_result['data'][0]["user_id"], $data['status']);
                                    $userRole = $this->_funcObject->sqlQuery($query, $bindparams);
                                } else {
                                    foreach (explode(',', $data['esc_sub_type_id']) as $value1) {
                                        $query = "INSERT INTO `coe_users_roles` (`esc_type_id`, `esc_sub_type_id`, `user_type`, `user_id`, `is_active`)"
                                                . " VALUES (?,?,?,?,?)";
                                        $bindparams = array($value, $value1, 3, $user_result['data'][0]["user_id"], $data['status']);
                                        $userRole = $this->_funcObject->sqlQuery($query, $bindparams);
                                    }
                                }
                            }

                            $directLegalQuery = "INSERT INTO `coe_legal_direct_assignees` (`legal_id`, `escalation_type_id`, `value`) VALUES (?,1,?), (?,2,?)";
                            $bindparams = array($user_result['data'][0]["user_id"], $data['budgetDirect'], $user_result['data'][0]["user_id"], $data['contractDirect']);
                            $userRole = $this->_funcObject->sqlQuery($directLegalQuery, $bindparams);
                        } else {
                            $query = "INSERT INTO `coe_users_roles` (`esc_type_id`, `esc_sub_type_id`, `user_type`, `user_id`, `is_active`";
                            $values = " VALUES (?,?,?,?,?";
                            $bindparams = array(0, 0, $userType, $user_result['data'][0]["user_id"], $data['status']);

                            if ($userType == 4) {
                                $query .= ", `analatics`, `user_management`";
                                $values .= ",?,?";
                                $bindparams[] = $data['analatics'];
                                $bindparams[] = $data['user_management'];
                            }

                            $query .= " )";
                            $values .= " )";

                            $userRole = $this->_funcObject->sqlQuery($query . $values, $bindparams);
                        }
                    }

                    $response['json_data']['response'] = 1;
                    $response['json_data']['message'] = "Successfully registered. ";
                } else {
                    $response['json_data']['response'] = 0;
                    $response['json_data']['message'] = "Email already existing !";
                }
            } else {

                //check password parameter
                if ($data['password'] != '') {
                    $salt = $this->_funcObject->getPasswordSalt();
                    $passwordhash = $this->_funcObject->getPasswordHash($salt, $data['password']);
                } else {
                    $salt = $this->_funcObject->getPasswordSalt();
                    $passwordhash = $this->_funcObject->getPasswordHash($salt, "111111");
                }

                $sql = "INSERT INTO `coe_users` (`email`, `first_name`, `last_name`, `user_pass`, `country_id`, `phone`, `is_active`, `update_date`) VALUES (?,?,?,?,?,?,?,?)";
                $bindparams = array($data['email'], $data['first_name'], $data['last_name'], $passwordhash, $data['country'], $data['phone'], $data['status'], date('Y-m-d H:i:s'));
                $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                foreach (explode(',', $data['user_type']) as $userType) {
                    //adding user roles if user is legal (user_type=3)
                    if ($userType == 3) {
                        foreach (explode(',', $data['esc_type_id']) as $value) {
                            if ($value != 4) {
                                $query = "INSERT INTO `coe_users_roles` (`esc_type_id`, `esc_sub_type_id`, `user_type`, `user_id`, `is_active`)"
                                        . " VALUES (?,?,?,?,?)";
                                $bindparams = array($value, 0, 3, $result, $data['status']);
                                $userRole = $this->_funcObject->sqlQuery($query, $bindparams);
                            } else {
                                foreach (explode(',', $data['esc_sub_type_id']) as $value1) {
                                    $query = "INSERT INTO `coe_users_roles` (`esc_type_id`, `esc_sub_type_id`, `user_type`, `user_id`, `is_active`)"
                                            . " VALUES (?,?,?,?,?)";
                                    $bindparams = array($value, $value1, 3, $result, $data['status']);
                                    $userRole = $this->_funcObject->sqlQuery($query, $bindparams);
                                }
                            }
                        }

                        $directLegalQuery = "INSERT INTO `coe_legal_direct_assignees` (`legal_id`, `escalation_type_id`, `value`) VALUES (?,1,?), (?,2,?)";
                        $bindparams = array($result, $data['budgetDirect'], $result, $data['contractDirect']);
                        $userRole = $this->_funcObject->sqlQuery($directLegalQuery, $bindparams);
                    } else {
                        $query = "INSERT INTO `coe_users_roles` (`esc_type_id`, `esc_sub_type_id`, `user_type`, `user_id`, `is_active`";
                        $values = " VALUES (?,?,?,?,?";
                        $bindparams = array(0, 0, $userType, $result, $data['status']);

                        if ($userType == 4) {
                            $query .= ", `analatics`, `user_management`";
                            $values .= ",?,?";
                            $bindparams[] = $data['analatics'];
                            $bindparams[] = $data['user_management'];
                        }

                        $query .= " )";
                        $values .= " )";

                        $userRole = $this->_funcObject->sqlQuery($query . $values, $bindparams);
                    }
                }

                $response['json_data']['response'] = 1;
                $response['json_data']['message'] = "Successfully registered. ";
            }
        }

        return $response;
    }

    /**
     * Update user information
     * @param type $data
     * @return string
     */
    public function editUser($data) {
        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {

                    $response = array();
                    $manvalues = array($data['user_id'], $data['first_name'], $data['last_name'], $data['user_type']);

                    $checkdata = $this->_funcObject->checkData($manvalues);
                    if ($checkdata === 0) {

                        //check user id exist in our system or not
                        $sql = "SELECT DISTINCT(coe_users_roles.user_type), coe_users_roles.is_active, coe_users_roles.is_enabled FROM `coe_users` LEFT JOIN coe_users_roles ON coe_users_roles.user_id=coe_users.user_id WHERE coe_users.user_id=? AND coe_users_roles.is_delete=0";
                        $bindparams = array($data['user_id']);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $user_count = (int) count($result['data']);
                        if ($user_count >= 1) {

                            $status = array('1'=>'1', '2'=>'1', '3'=>'1', '4'=>'1');
                            foreach ($result['data'] as $key => $value) {
                                $status[$value['user_type']] = $value;
                            }

                            $sql = "UPDATE `coe_users` SET `first_name`=?,`last_name`=?, `update_date`=? WHERE `user_id` = ?";
                            $bindparams = array($data['first_name'], $data['last_name'], date('Y-m-d H:i:s'), $data['user_id']);
                            $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                            //soft delete the previous user roles
                            $queryDel = "UPDATE `coe_users_roles` SET `is_delete` = '1', `update_date`=? WHERE `coe_users_roles`.`user_id` = ?";
                            $bindparamsDel = array(date('Y-m-d H:i:s'), $data['user_id']);
                            $this->_funcObject->sqlQuery($queryDel, $bindparamsDel);

                            $bindparamsDel = array($data['user_id']);
                            if(!in_array("3", explode(',', $data['user_type']))){
                                $sql = "UPDATE `coe_assignments` SET `is_active`=0 WHERE `legal_id`=?";
                                $this->_funcObject->sqlQuery($sql, $bindparamsDel);
                            }

                            if(!in_array("2", explode(',', $data['user_type']))){
                                $sql = "UPDATE `coe_assignments` SET `is_active`=0 WHERE `escalation_manager_id`=?";
                                $this->_funcObject->sqlQuery($sql, $bindparamsDel);
                            }
                                
                            $sql = "UPDATE `coe_legal_direct_assignees` SET `is_active` = '0' WHERE `legal_id` =?";
                            $this->_funcObject->sqlQuery($sql, $bindparamsDel);

                            foreach (explode(',', $data['user_type']) as $userType) {
                                //adding user roles if user is legal (user_type=3)
                                if ($userType == 3) {

                                    foreach (explode(',', $data['esc_type_id']) as $value) {
                                        if ($value != 4) {
                                            $query = "INSERT INTO `coe_users_roles` (`esc_type_id`, `esc_sub_type_id`, `user_type`, `user_id`, `is_active`, `is_enabled`)"
                                                    . " VALUES (?,?,?,?,?,?)";
                                            $bindparams = array($value, 0, 3, $data['user_id'], $status['3']['is_active'], $status['3']['is_enabled']);
                                            $userRole = $this->_funcObject->sqlQuery($query, $bindparams);
                                        } else {
                                            foreach (explode(',', $data['esc_sub_type_id']) as $value1) {
                                                $query = "INSERT INTO `coe_users_roles` (`esc_type_id`, `esc_sub_type_id`, `user_type`, `user_id`, `is_active`, `is_enabled`)"
                                                        . " VALUES (?,?,?,?,?,?)";
                                                $bindparams = array($value, $value1, 3, $data['user_id'], $status['3']['is_active'], $status['3']['is_enabled']);
                                                $userRole = $this->_funcObject->sqlQuery($query, $bindparams);
                                            }
                                        }
                                    }

                                    $directLegalQuery = "INSERT INTO `coe_legal_direct_assignees` (`legal_id`, `escalation_type_id`, `value`) VALUES (?,1,?), (?,2,?)";
                                    $bindparams = array($data['user_id'], $data['budgetDirect'], $data['user_id'], $data['contractDirect']);
                                    $userRole = $this->_funcObject->sqlQuery($directLegalQuery, $bindparams);
                                } else {
                                    $query = "INSERT INTO `coe_users_roles` (`esc_type_id`, `esc_sub_type_id`, `user_type`, `user_id`, `is_active`, `is_enabled`";
                                    $values = " VALUES (?,?,?,?,?,?";
                                    $bindparams = array(0, 0, $userType, $data['user_id'], $status[$userType]['is_active'], $status[$userType]['is_enabled']);

                                    if ($userType == 4) {
                                        $query .= ", `analatics`, `user_management`";
                                        $values .= ",?,?";
                                        $bindparams[] = $data['analatics'];
                                        $bindparams[] = $data['user_management'];
                                    }

                                    $query .= " )";
                                    $values .= " )";

                                    $userRole = $this->_funcObject->sqlQuery($query . $values, $bindparams);
                                }
                            }

                            $response['json_data']['response'] = 1;
                            $response['json_data']['message'] = "User edit successfully";
                        } else {
                            $response['json_data']['response'] = 0;
                            $response['json_data']['message'] = "User not exist!";
                        }
                        return $response;
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
     * login user api
     * @param type $data
     * @return string
     */
    public function authenticateUser($data) {

        $manvalues = array($data['email'], $data['password'], $data['type_id']);
        $checkdata = $this->_funcObject->checkData($manvalues);
        $response = array();
        if ($checkdata === 0) {

            //check email exist in our system
            $sql = "SELECT coe_users_roles.*, coe_users.user_pass, coe_users.first_name, coe_users.last_name FROM `coe_users` LEFT JOIN `coe_users_roles` ON coe_users_roles.user_id = coe_users.user_id WHERE coe_users.email = ? AND coe_users_roles.user_type = ? AND coe_users_roles.is_delete = 0";
            $bindparams = array($data['email'], $data['type_id']);
            $result = $this->_funcObject->sqlQuery($sql, $bindparams);

            $user_count = (int) count($result['data']);
            if ($user_count == 1) {
                if ($result['data'][0]["is_enabled"] == 0) {
                    $response['json_data']['response'] = 3;
                    $response['json_data']['message'] = "Account disabled!";
                } elseif ($result['data'][0]["is_delete"] == 1) {

                    $response['json_data']['response'] = 5;
                    $response['json_data']['message'] = "Account deleted!";
                } else {
                    //comparing the password that exist in our system
                    if ($this->_funcObject->comparePassword($data['password'], $result['data'][0]['user_pass'])) {
                        $response['json_data']['response'] = 1;
                        $response['json_data']['user_id'] = $result['data'][0]['user_id'];
                        $response['json_data']['user_type'] = $result['data'][0]['user_type'];
                        $response['json_data']['message'] = "Login Success!";
                        $response['json_data']['is_active'] = $result['data'][0]['is_active'];
                        $response['json_data']['is_enabled'] = $result['data'][0]['is_enabled'];
                        $response['json_data']['first_name'] = $result['data'][0]['first_name'];
                        $response['json_data']['last_name'] = $result['data'][0]['last_name'];
                        $response['json_data']['analatics'] = $result['data'][0]['analatics'];
                        $response['json_data']['user_management'] = $result['data'][0]['user_management'];
                        $response['json_data']['exp'] = time() + VALID_FOR;
                        $response['json_data']['token'] = JWT::encode($response, SECRET_KEY);

//                        $_SESSION['app_user_id'] = $result['data'][0]['user_id'];
//                        $_SESSION['app_user_type'] = $result['data'][0]['user_type'];
//                        $_SESSION['is_active'] = $result['data'][0]['is_active'];
//                        $_SESSION['is_enabled'] = $result['data'][0]['is_enabled'];
                    } else {  # bad password
                        $response['json_data']['response'] = 0;
                        $response['json_data']['message'] = "Sign In Failed. Check Email and Password.";
                    }
                }
            } else {
                $response['json_data']['response'] = 2;
                $response['json_data']['message'] = "You are not registered user.";
            }
        }
        return $response;
    }

    /**
     * login user api
     * @param type $data
     * @return string
     */
    public function authenticateSso($data) {

        $manvalues = array($data['email'], $data['password']);
        $checkdata = $this->_funcObject->checkData($manvalues);
        $response = array();
        if ($checkdata === 0) {

            //check email exist in our system
            $sql = "SELECT coe_users.user_id, coe_users.user_pass, coe_users.first_name, coe_users.last_name FROM `coe_users` WHERE coe_users.email = ?";
            $bindparams = array($data['email']);
            $result = $this->_funcObject->sqlQuery($sql, $bindparams);

            $user_count = (int) count($result['data']);
            if ($user_count == 1) {
                //comparing the password that exist in our system
                if ($this->_funcObject->comparePassword($data['password'], $result['data'][0]['user_pass'])) {
                    $response['json_data']['response'] = 1;
                    $response['json_data']['user_id'] = $result['data'][0]['user_id'];
                    $response['json_data']['message'] = "Login Success!";
                    $response['json_data']['first_name'] = $result['data'][0]['first_name'];
                    $response['json_data']['last_name'] = $result['data'][0]['last_name'];
                    $response['json_data']['exp'] = time() + VALID_FOR;
                    $response['json_data']['token'] = JWT::encode($response, SECRET_KEY);
                } else {  # bad password
                    $response['json_data']['response'] = 0;
                    $response['json_data']['message'] = "Sign In Failed. Check Email and Password.";
                }
            } else {
                $response['json_data']['response'] = 2;
                $response['json_data']['message'] = "You are not registered user.";
            }
        }
        return $response;
    }

    /**
     * change password
     * @param type $data
     * @return string
     */
    public function validateToken() {
        // print_r($data);die;
        $headers = getallheaders();

        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);

                if ($data1->json_data->exp >= time()) {
                    $manvalues = array();
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    $response = array();
                    if ($checkdata === 0) {
                        $sql = "SELECT DISTINCT(coe_users_roles.user_type), coe_users_roles.analatics, coe_users_roles.is_active, coe_users_roles.user_management, coe_users_roles.is_enabled, coe_users_type.name as user_type_name, coe_users.user_id, coe_users.first_name, coe_users.last_name FROM `coe_users`"
                                . " LEFT JOIN coe_users_roles ON coe_users_roles.user_id=coe_users.user_id"
                                . " LEFT JOIN coe_users_type ON coe_users_type.type_id=coe_users_roles.user_type"
                                . " WHERE coe_users.user_id=? AND coe_users_roles.is_delete=0";
                        $bindparams = array($data1->json_data->user_id);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);
                        $response['json_data']['response'] = $result['data'];
                        $response['json_data']['message'] = "Success";
                    }
                } else {

                    $response['json_data']['response'] = 4;
                    $response['json_data']['message'] = "Token expired.";
                }
            } catch (\Exception $e) { // Also tried JwtException
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
     * change password
     * @param type $data
     * @return string
     */
    public function userDetails($data) {

        $headers = getallheaders();

        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);

                if ($data1->json_data->exp >= time()) {
                    $manvalues = array($data['user_id']);
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    $response = array();
                    if ($checkdata === 0) {
                        $sql = "SELECT coe_users.user_id, coe_users.first_name, coe_users.last_name, coe_users.email, coe_users_roles.user_type, coe_users_roles.esc_type_id, coe_users_roles.esc_sub_type_id, coe_users_roles.analatics, coe_users_roles.is_active, coe_users_roles.user_management, coe_users_roles.is_enabled, coe_users_type.name as user_type_name, coe_legal_direct_assignees.escalation_type_id, coe_legal_direct_assignees.value "
                                . " FROM `coe_users`"
                                . " LEFT JOIN coe_users_roles ON coe_users_roles.user_id=coe_users.user_id"
                                . " LEFT JOIN coe_users_type ON coe_users_type.type_id=coe_users_roles.user_type"
                                . " LEFT JOIN coe_legal_direct_assignees ON coe_legal_direct_assignees.legal_id=coe_users.user_id"
                                . " WHERE coe_users.user_id=? AND coe_users_roles.is_delete=0";
                        $bindparams = array($data['user_id']);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $arrayDetails = array();
                        foreach ($result['data'] as $key => $value) {
                            if ($value['user_type'] == 3) {

                                $arrayDetails[3]['user_id'] = $value['user_id'];
                                $arrayDetails[3]['first_name'] = $value['first_name'];
                                $arrayDetails[3]['last_name'] = $value['last_name'];
                                $arrayDetails[3]['email'] = $value['email'];
                                $arrayDetails[3]['user_type'] = $value['user_type'];
                                $arrayDetails[3]['is_active'] = $value['is_active'];
                                $arrayDetails[3]['user_type_name'] = $value['user_type_name'];
                                $arrayDetails[3]['is_enabled'] = $value['is_enabled'];

                                if ($value['escalation_type_id'] == 1) {
                                    $arrayDetails[3]['directBudget'] = $value['value'];
                                } else {
                                    $arrayDetails[3]['directContract'] = $value['value'];
                                }

                                if ($value['esc_type_id'] != 0 && !in_array($value['esc_type_id'], $arrayDetails[3]['esc_type_id'])) {
                                    $arrayDetails[3]['esc_type_id'][] = $value['esc_type_id'];
                                }

                                if ($value['esc_sub_type_id'] != 0 && !in_array($value['esc_sub_type_id'], $arrayDetails[3]['esc_sub_type_id'])) {
                                    $arrayDetails[3]['esc_sub_type_id'][] = $value['esc_sub_type_id'];
                                }
                            } else {
                                $arrayDetails[$value['user_type']] = $value;
                            }
                        }

                        $arrayDetails = array_values($arrayDetails);

                        $response['json_data']['response'] = $arrayDetails;
                        $response['json_data']['message'] = "Success";
                    }
                } else {

                    $response['json_data']['response'] = 4;
                    $response['json_data']['message'] = "Token expired.";
                }
            } catch (\Exception $e) { // Also tried JwtException
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
     * list of issues types
     * @param type $data
     * @return string
     */
    public function listIssuesTypes($data) {

        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $manvalues = array($data['form_id']);
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    $response = array();
                    if ($checkdata === 0) {
                        $sql = "SELECT * FROM `coe_issues_types` WHERE `form_id` = ? AND `is_active`=1 ORDER BY id ASC";
                        $bindparams = array($data['form_id']);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $count = (int) count($result['data']);
                        if ($count >= 1) {
                            $response['json_data']['response'] = 1;
                            $response['json_data']['message'] = $result['data'];
                        } else {
                            $response['json_data']['response'] = 0;
                            $response['json_data']['message'] = "Issues not exist!";
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
     * user soft delete by user id
     * @param type $data
     * @return string
     */
    public function userDelete($data) {

        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $manvalues = array($data['user_id'], $data['user_type']);
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    $response = array();
                    if ($checkdata === 0) {
                        $sql = "SELECT * FROM `coe_users` WHERE `user_id` = ?";
                        $bindparams = array($data['user_id']);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $user_count = (int) count($result['data']);
                        if ($user_count == 1) {
                            $sql = "UPDATE `coe_users_roles` SET `is_delete`=1, `is_active`=0, `is_enabled`=0 WHERE `user_id` = ? AND `user_type` = ?";
                            $bindparams = array($data['user_id'], $data['user_type']);
                            $this->_funcObject->sqlQuery($sql, $bindparams);

                            if ($data['user_type'] == 2) {
                                $sql = "UPDATE `coe_assignments` SET `is_active`=0 WHERE `escalation_manager_id`=?";
                                $bindparams = array($data['user_id']);
                                $this->_funcObject->sqlQuery($sql, $bindparams);
                            } elseif ($data['user_type'] == 3) {
                                $sql = "UPDATE `coe_assignments` SET `is_active`=0 WHERE `legal_id`=?";
                                $bindparams = array($data['user_id']);
                                $this->_funcObject->sqlQuery($sql, $bindparams);

                                $sql = "UPDATE `coe_legal_direct_assignees` SET `is_active` = '0' WHERE `legal_id` =?";
                                $bindparams = array($data['user_id']);
                                $this->_funcObject->sqlQuery($sql, $bindparams);
                            }

                            $response['json_data']['response'] = 1;
                            $response['json_data']['message'] = "User deleted successfully";
                        } else {
                            $response['json_data']['response'] = 0;
                            $response['json_data']['message'] = "User not exist!";
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
     * forgot password email sent to register email having new password
     * @param type $data
     * @return string
     */
    public function forgotPassword($data) {
        $manvalues = array($data['email']);
        $checkdata = $this->_funcObject->checkData($manvalues);
        $response = array();
        if ($checkdata === 0) {
            $sql = "SELECT * FROM `coe_users` WHERE `email` = ?";
            $bindparams = array($data['email']);
            $result = $this->_funcObject->sqlQuery($sql, $bindparams);

            $user_count = (int) count($result['data']);
            if ($user_count == 1) {

                $password = substr(str_shuffle(str_repeat('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 8)), 0, 8);
                $salt = $this->_funcObject->getPasswordSalt();
                $passwordhash = $this->_funcObject->getPasswordHash($salt, $password);

                $query = 'UPDATE `coe_users` SET `user_pass`=? WHERE user_id=?';
                $bindparams = array($passwordhash, $result['data']['0']['user_id']);
                $result = $this->_funcObject->sqlQuery($query, $bindparams);

                $email = $data['email'];
                $actual_link = "https://$_SERVER[HTTP_HOST]";
                $email_subject = "COE Forgot Password";
                $email_body = '';
                $from = '<takeda@mobileprogrammingllc.com>';
                $headers = "From: " . ($from) . "\r\n";
                $headers .= 'MIME-Version: 1.0' . "\r\n";
                $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
                $email_body .= '<table style="600px;border:1px solid #5ab7ce;" cellpadding="0" cellspacing="0"> 
                <tr>';
                $email_body .= "Dear User,";
                $email_body .= "<br/><br/>";
                $email_body .= "This email is being sent because you want to know your Takeda account password.";
                $email_body .= "<br/><br/>";
                $email_body .= "Please check below Your password";
                $email_body .= "<br/><br/>";
                $email_body .= "Your Password is: " . $password . "";
                $email_body .= "<br/><br/>";
                $email_body .= "Please click on the link for login : " . $actual_link . "";
                $email_body .= '</table>';

                if (mail($email, $email_subject, $email_body, $headers)) {
                    $response['json_data']['response'] = 1;
                    $response['json_data']['message'] = "New password sent to your email!";
                }
            } else {
                $response['json_data']['response'] = 2;
                $response['json_data']['message'] = "You are not registered user.";
            }
        }
        return $response;
    }

    /**
     * enable disable user
     * @param type $data
     * @return string
     */
    public function userDisableEnable($data) {
        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $manvalues = array($data['user_id'], $data['user_type']);
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    $response = array();
                    if ($checkdata === 0) {

                        $sql = "SELECT * FROM `coe_users` WHERE `user_id` = ?";
                        $bindparams = array($data['user_id']);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $user_count = (int) count($result['data']);
                        if ($user_count == 1) {

                            //toggle the enabled disabled state
                            $query = "UPDATE coe_users_roles SET `is_enabled` = IF(`is_enabled`=1, 0, 1) WHERE user_id=? && user_type=?";
                            $bindparams = array($data['user_id'], $data['user_type']);
                            $result = $this->_funcObject->sqlQuery($query, $bindparams);

                            $response['json_data']['response'] = 1;
                            $response['json_data']['message'] = "Success";
                        } else {
                            $response['json_data']['response'] = 0;
                            $response['json_data']['message'] = "You are not registered user.";
                        }
                    }
                } else {
                    $response['json_data']['response'] = 5;
                    $response['json_data']['message'] = "Invalid Token or user.";
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
     * Active or inactive user
     * @param type $data
     * @return string
     */
    public function userActiveInactive($data) {
        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);

                if ($data1->json_data->exp >= time()) {
                    $manvalues = array($data['user_id'], $data['user_type']);
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    $response = array();
                    if ($checkdata === 0) {

                        $sql = "SELECT * FROM `coe_users` WHERE `user_id` = ?";
                        $bindparams = array($data['user_id']);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $user_count = (int) count($result['data']);
                        if ($user_count == 1) {

                            //toggle the active inactive state
                            $query = "UPDATE coe_users_roles SET `is_active` = IF(`is_active`=1, 0, 1) WHERE user_id=? && user_type=?";
                            $bindparams = array($data['user_id'], $data['user_type']);
                            $this->_funcObject->sqlQuery($query, $bindparams);

                            $response['json_data']['response'] = 1;
                            $response['json_data']['message'] = "Success";
                        } else {
                            $response['json_data']['response'] = 0;
                            $response['json_data']['message'] = "You are not registered user.";
                        }
                    }
                } else {
                    $response['json_data']['response'] = 5;
                    $response['json_data']['message'] = "Invalid Token or user.";
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
     * change password
     * @param type $data
     * @return string
     */
    public function changePassword($data) {
        // print_r($data);die;
        $headers = getallheaders();

        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $manvalues = array($data['user_id'], $data['old_pass'], $data['new_pass']);
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    $response = array();
                    if ($checkdata === 0) {
                        $sql = "SELECT * FROM `coe_users` WHERE `user_id` = ?";
                        $bindparams = array($data['user_id']);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);
                        $user_count = (int) count($result['data']);
                        if ($user_count == 1) {
                            if ($this->_funcObject->comparePassword($data['old_pass'], $result['data'][0]['user_pass'])) {
                                $password = $data['new_pass'];
                                $salt = $this->_funcObject->getPasswordSalt();
                                $passwordhash = $this->_funcObject->getPasswordHash($salt, $password);

                                $query = 'UPDATE `coe_users` SET `user_pass`=? WHERE user_id=?';
                                $bindparams = array($passwordhash, $data['user_id']);
                                $this->_funcObject->sqlQuery($query, $bindparams);

                                $response['json_data']['response'] = 1;
                                $response['json_data']['message'] = "New password updated successfully.";
                            } else {
                                $response['json_data']['response'] = 2;
                                $response['json_data']['message'] = "Current password incorrect!";
                            }
                        } else {
                            $response['json_data']['response'] = 2;
                            $response['json_data']['message'] = "You are not registered user.";
                        }
                    }
                } else {

                    $response['json_data']['response'] = 4;
                    $response['json_data']['message'] = "Token expired.";
                }
            } catch (\Exception $e) { // Also tried JwtException
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
     * sso user login
     * @param type $data
     * @return string
     */
    public function ssoUserLogin($data) {
        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $manvalues = array($data['email'], $data['userRole_id']);
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    $response = array();
                    if ($checkdata === 0) {

                        $sql = "SELECT * FROM `coe_users` WHERE `email` = ?";
                        $bindparams = array($data['email']);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $user_count = (int) count($result['data']);
                        if ($user_count == 1) {
                            if ($data['userRole_id'] == $result['data'][0]['user_type']) {
                                if ($result['data'][0]["is_delete"] == 1 && $data['userRole_id'] != 4) {
                                    $response['json_data']['response'] = 5;
                                    $response['json_data']['message'] = "Account deleted!";
                                } elseif ($result['data'][0]["is_enabled"] == 0 && $data['userRole_id'] != 4) {
                                    $response['json_data']['response'] = 3;
                                    $response['json_data']['message'] = "Account disabled!";
                                } else {
                                    $response['json_data']['response'] = 1;
                                    $response['json_data']['user_id'] = $result['data'][0]['user_id'];
                                    $response['json_data']['user_type'] = $result['data'][0]['user_type'];
                                    $response['json_data']['message'] = "Login Success!";

                                    $response['json_data']['is_active'] = $result['data'][0]['is_active'];
                                    $response['json_data']['is_enabled'] = $result['data'][0]['is_enabled'];

                                    $_SESSION['app_user_id'] = $result['data'][0]['user_id'];
                                    $_SESSION['app_user_type'] = $result['data'][0]['user_type'];
                                    $_SESSION['is_active'] = $result['data'][0]['is_active'];
                                    $_SESSION['is_enabled'] = $result['data'][0]['is_enabled'];
                                }
                            } elseif ($result['data'][0]['isUserManagement'] == 1 && $data['userRole_id'] == 4) {
                                $response['json_data']['response'] = 1;
                                $response['json_data']['user_id'] = $result['data'][0]['user_id'];
                                $response['json_data']['user_type'] = 4;
                                $response['json_data']['message'] = "Login Success!";
                                $response['json_data']['is_active'] = $result['data'][0]['is_active'];
                                $response['json_data']['is_enabled'] = $result['data'][0]['is_enabled'];

                                $_SESSION['app_user_id'] = $result['data'][0]['user_id'];
                                $_SESSION['app_user_type'] = 4;
                                $_SESSION['is_active'] = $result['data'][0]['is_active'];
                                $_SESSION['is_enabled'] = $result['data'][0]['is_enabled'];
                            } else {
                                $response['json_data']['response'] = 0;
                                $response['json_data']['message'] = "Please verify the user role.";
                            }
                        } else {
                            $response['json_data']['response'] = 2;
                            $response['json_data']['message'] = "You are not registered user.";
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
     * list of escalation and sub escalation type
     * @return int
     */
    public function listEscalation() {

        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            try {
                $token = $headers['authorization'];
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $manvalues = array();
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    $response = array();
                    if ($checkdata === 0) {

                        $sql = "SELECT coe_escalation_type.*, coe_escalation_sub_type.sub_type_id, coe_escalation_sub_type.name as subname FROM `coe_escalation_type` LEFT JOIN coe_escalation_sub_type ON coe_escalation_sub_type.type_id=coe_escalation_type.type_id";
                        $bindparams = array();
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $count = (int) count($result['data']);
                        if ($count > 0) {

                            $array = array();
                            foreach ($result['data'] as $key => $value) {
                                $array[$value['type_id']][] = $value;
                            }
                            //sort array
                            sort($array);
                            $i = 0;
                            $array1 = array();
                            foreach ($array as $key => $value) {
                                $array1[$i]['type_id'] = $value[0]['type_id'];
                                $array1[$i]['name'] = $value[0]['name'];
                                if (!empty($value[0]['sub_type_id'])) {
                                    foreach ($array[$key] as $key1 => $value1) {
                                        $array1[$i]['sub_types'][] = array('sub_type_id' => $value1['sub_type_id'], 'subname' => $value1['subname']);
                                    }
                                }
                                $i++;
                            }

                            $response['json_data']['message'] = "Success";
                            $response['json_data']['response'] = $array1;
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
     * list of countries
     * @param type $data
     * @return int
     */
    public function listCountry($data) {
        $manvalues = array();
        $checkdata = $this->_funcObject->checkData($manvalues);
        $response = array();
        if ($checkdata === 0) {

            if ($data['region_id'] == '') {
                $sql = "SELECT * FROM `coe_countries`";
                $bindparams = array();
            } else {
                $sql = "SELECT * FROM `coe_countries` WHERE region_id IN (" . $data['region_id'] . ") ORDER BY country_name ASC";
                $bindparams = array();
            }
            $result = $this->_funcObject->sqlQuery($sql, $bindparams);

            $count = (int) count($result['data']);
            if ($count > 0) {

                $countryArrayFirst = array();
                $countryArrayAfter = array();

                foreach ($result['data'] as $value) {
                    if ($value['country_id'] == 5 || $value['country_id'] == 7 || $value['country_id'] == 17 || $value['country_id'] == 18 || $value['country_id'] == 48 || $value['country_id'] == 55 || $value['country_id'] == 56) {
                        $countryArrayFirst[] = $value;
                    } else {
                        $countryArrayAfter[] = $value;
                    }
                }

                //array merge two or many arrays
                $arrayCombine = array_merge_recursive($countryArrayFirst, $countryArrayAfter);

                $response['json_data']['message'] = "Success";
                $response['json_data']['response'] = $arrayCombine;
            } else {
                $response['json_data']['message'] = "Not Found!";
                $response['json_data']['response'] = 0;
            }
        }
        return $response;
    }

    /**
     * list of regions 
     * @return int
     */
    public function listRegions() {
        $manvalues = array();
        $checkdata = $this->_funcObject->checkData($manvalues);
        $response = array();
        if ($checkdata === 0) {

            $sql = "SELECT * FROM `coe_regions` ORDER BY name ASC";
            $bindparams = array();
            $result = $this->_funcObject->sqlQuery($sql, $bindparams);

            $count = (int) count($result['data']);
            if ($count > 0) {
                $response['json_data']['message'] = "Success";
                $response['json_data']['response'] = $result;
            } else {
                $response['json_data']['message'] = "Not Found!";
                $response['json_data']['response'] = 0;
            }
        }
        return $response;
    }

    /**
     * display cro requests
     * @param type $data
     * @return string
     */
    public function displayCroRequest($data) {
        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);

                if ($data1->json_data->user_id != $data['cro_id']) {

                    $response['json_data']['response'] = 5;
                    $response['json_data']['message'] = "Invalid Token or user.";
                } else {

                    $manvalues = array($data['cro_id'], $data['startDate'], $data['endDate'], $data['dashOrArchive']);
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    $response = array();
                    if ($checkdata === 0) {

                        //verify the request comes for Dashboard and Archive
                        if ($data['dashOrArchive'] == 1) {
                            $whereClause = " && (coe_issue_status.resolution_date IS NULL || coe_issue_status.resolution_date='0000-00-00 00:00:00')";
                        } else {
                            $whereClause = " && (coe_issue_status.resolution_date IS NOT NULL AND coe_issue_status.resolution_date!='0000-00-00 00:00:00')";
                        }

                        //coe request for Budget escalation on the basis of cro id ( User ID )
                        $sql = "SELECT coe_issues_types.issue as choose_an_issue_name, 
                    coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name, coe_users.email as escalation_email,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name, legal.email as legal_email,
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_budget_escalation.*, coe_budget_escalation.issue_id as request_number,
                    coe_issue_status.*, 1 as escalation_type_id
                    FROM `coe_escalation_request`
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_budget_escalation ON coe_escalation_request.request_id=coe_budget_escalation.request_id
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_budget_escalation.issue_id
                    LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                    LEFT JOIN coe_issues_types ON coe_budget_escalation.choose_an_issue=coe_issues_types.id
                    WHERE coe_escalation_request.user_id=? && coe_escalation_request.escalation_type_id=1 &&
                    coe_escalation_request.insert_date BETWEEN ? AND ?" . $whereClause;
                        $bindparams = array($data['cro_id'], $data['startDate'] . " 00:00:00", $data['endDate'] . " 23:59:59");
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        //coe request for contract language escalation on the basis of cro id ( User ID )
                        $sql1 = "SELECT coe_issues_types.issue as choose_an_issue_name, 
                    coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name, coe_users.email as escalation_email,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name, legal.email as legal_email,
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_language_escalation.*, coe_language_escalation.issue_id as request_number,
                    coe_issue_status.*, 2 as escalation_type_id
                    FROM `coe_escalation_request`
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_language_escalation ON coe_escalation_request.request_id=coe_language_escalation.request_id
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_language_escalation.issue_id
                    LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                    LEFT JOIN coe_issues_types ON coe_language_escalation.type_issues=coe_issues_types.id
                    WHERE coe_escalation_request.user_id=? && coe_escalation_request.escalation_type_id=2 &&
                    coe_escalation_request.insert_date BETWEEN ? AND ?" . $whereClause;
                        $result1 = $this->_funcObject->sqlQuery($sql1, $bindparams);

                        //coe request for ICF escalation on the basis of cro id ( User ID )
                        $sql2 = "SELECT coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name, legal.email as legal_email,
                    coe_escalation_request.escalation_sub_type_id, coe_escalation_request.escalation_type_id,
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_icf_escalation.*, coe_icf_escalation.issue_id as request_number,
                    coe_issue_status.*
                    FROM `coe_escalation_request`
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_icf_escalation ON coe_escalation_request.request_id=coe_icf_escalation.request_id
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_icf_escalation.issue_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                    WHERE coe_escalation_request.user_id=? && coe_escalation_request.escalation_type_id=4 &&
                    coe_escalation_request.insert_date BETWEEN ? AND ?" . $whereClause;
                        $result2 = $this->_funcObject->sqlQuery($sql2, $bindparams);

                        //array merge two or many arrays
                        $arrayCombine = array_merge_recursive($result, $result1, $result2);

                        $array = array();
                        $i = 0;
                        foreach ($arrayCombine['data'] as $value) {
                            $array['data'][$i] = $value;
                            $array['data'][$i]['proposed_language'] = utf8_encode(preg_replace('/\s\s+/', ' ', $value['proposed_language']));
                            $array['data'][$i]['dsec_issue'] = utf8_encode(preg_replace('/\s\s+/', ' ', $value['dsec_issue']));

                            //get the track of actions
                            $sql1 = "SELECT coe_issue_reassignment.*, coe_users.first_name, coe_users.last_name FROM coe_issue_reassignment
                            LEFT JOIN coe_users ON coe_users.user_id = coe_issue_reassignment.coe_id
                            WHERE coe_issue_reassignment.issue_id=? ORDER BY coe_issue_reassignment.id DESC";
                            $bindparams = array($value['issue_id']);
                            $result1 = $this->_funcObject->sqlQuery($sql1, $bindparams);

                            $array['data'] [$i]['action_track'] = $result1['data'];

                            if ($array['data'][$i]['manager_attach_list'] == NULL) {
                                $array['data'][$i]['manager_attach_list'] = '';
                            }

                            if ($array['data'][$i]['legal_attach_list'] == NULL) {
                                $array['data'][$i]['legal_attach_list'] = '';
                            }

                            $i++;
                        }


                        $count = (int) count($arrayCombine['data']);
                        if ($count > 0) {
                            $response['json_data']['message'] = "Success";
                            $response['json_data']['response'] = $array;
                        } else {
                            $response['json_data']['message'] = "Not Found!";
                            $response['json_data']['response'] = 0;
                        }
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
     * list of roles
     * @return string
     */
    public function userRoles() {
        $manvalues = array();
        $checkdata = $this->_funcObject->checkData($manvalues);
        $response = array();
        if ($checkdata === 0) {

            $sql = "SELECT * FROM `coe_users_type`";
            $bindparams = array();
            $result = $this->_funcObject->sqlQuery($sql, $bindparams);

            $count = (int) count($result['data']);
            if ($count > 0) {
                $response['json_data']['message'] = "Success";
                $response['json_data']['response'] = $result['data'];
            } else {
                $response['json_data']['message'] = "Not Found!";
                $response['json_data']['response'] = 0;
            }
        }
        return $response;
    }

    public function addScheme($url, $scheme = 'http://') {
        return parse_url($url, PHP_URL_SCHEME) === null ?
                $scheme . $url : $url;
    }

    /**
     * view request id according to the escalation type
     * @param type $data
     * @return int
     */
    public function viewCroRequestID($data) {

        $manvalues = array($data['request_id'], $data['escalation_type_id']);
        $checkdata = $this->_funcObject->checkData($manvalues);
        $response = array();
        if ($checkdata === 0) {

            // 1 means Budget Escalation
            if ($data['escalation_type_id'] == 1) {

                $sql = "SELECT coe_issues_types.issue as choose_an_issue_name, 
                coe_escalation_request.followUp, coe_escalation_request.principle_investigator, coe_escalation_request.requested_by, coe_escalation_request.raised_by,
                coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name, coe_users.email as escalation_email,
                legal.first_name as legal_first_name, legal.last_name as legal_last_name, legal.email as legal_email,
                coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                coe_sitenames.sitename_id, coe_sitenames.sitename, 
                coe_countries.country_id, coe_countries.country_name,
                coe_budget_escalation.*, coe_budget_escalation.issue_id as request_number,
                coe_issue_status.*, coe_escalation_request.cc_email, 1 as escalation_type_id
                FROM `coe_escalation_request`
                LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                LEFT JOIN coe_budget_escalation ON coe_escalation_request.request_id=coe_budget_escalation.request_id
                LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_budget_escalation.issue_id
                LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                LEFT JOIN coe_issues_types ON coe_budget_escalation.choose_an_issue=coe_issues_types.id
                WHERE coe_escalation_request.request_id=? && coe_escalation_request.escalation_type_id=1";
                $bindparams = array($data['request_id']);
                $result = $this->_funcObject->sqlQuery($sql, $bindparams);
                
                $array = array();
                $i = 0;
                foreach ($result['data'] as $value) {
                    $array [$i] = $value;
                    $array [$i]['proposed_language'] = utf8_encode(preg_replace('/\s\s+/', ' ', $value['proposed_language']));
                    $array [$i]['dsec_issue'] = utf8_encode(preg_replace('/\s\s+/', ' ', $value['dsec_issue']));

                    //get the track of actions
                    $sql1 = "SELECT coe_issue_reassignment.*, coe_users.first_name, coe_users.last_name FROM coe_issue_reassignment
                            LEFT JOIN coe_users ON coe_users.user_id = coe_issue_reassignment.coe_id
                            WHERE coe_issue_reassignment.issue_id=? ORDER BY coe_issue_reassignment.id DESC";
                    $bindparams = array($value['issue_id']);
                    $result1 = $this->_funcObject->sqlQuery($sql1, $bindparams);

                    $array [$i]['action_track'] = $result1['data'];

                    if ($array [$i]['manager_attach_list'] == NULL) {
                        $array [$i]['manager_attach_list'] = '';
                    }

                    if ($array [$i]['legal_attach_list'] == NULL) {
                        $array [$i]['legal_attach_list'] = '';
                    }

                    $i++;
                }
                
                $count = (int) count($result['data']);
                if ($count > 0) {
                    $response['json_data']['message'] = "Success";
                    $response['json_data']['response']['data'] = $array;
                } else {
                    $response['json_data']['message'] = "Not Found!";
                    $response['json_data']['response'] = 0;
                }
            } elseif ($data['escalation_type_id'] == 4) {
                $sql = "SELECT coe_escalation_request.followUp, coe_escalation_request.principle_investigator, coe_escalation_request.requested_by, coe_escalation_request.raised_by,
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name, legal.email as legal_email,
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_icf_escalation.*, coe_icf_escalation.issue_id as request_number,
                    coe_issue_status.*, coe_escalation_request.cc_email, coe_escalation_request.escalation_type_id, coe_escalation_request.escalation_sub_type_id, coe_escalation_request.region_id, coe_regions.name as region_name
                    FROM `coe_escalation_request`
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_icf_escalation ON coe_escalation_request.request_id=coe_icf_escalation.request_id
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_icf_escalation.issue_id
                    LEFT JOIN coe_regions ON coe_regions.id=coe_escalation_request.region_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                    WHERE coe_escalation_request.request_id=? && coe_escalation_request.escalation_type_id=4";
                $bindparams = array($data['request_id']);
                $result = $this->_funcObject->sqlQuery($sql, $bindparams);
                $count = (int) count($result['data']);
                if ($count > 0) {

                    $arrayFinal = array();
                    foreach ($result['data'] as $key => $value) {
                        $arrayFinal[$key] = $value;
                        $arrayFinal[$key]['global_link'] = ($value['global_link'] != '') ? $this->addScheme($value['global_link']) : '';
                        $arrayFinal[$key]['protocol_link'] = ($value['protocol_link'] != '') ? $this->addScheme($value['protocol_link']) : '';
                        $arrayFinal[$key]['country_link'] = ($value['country_link'] != '') ? $this->addScheme($value['country_link']) : '';
                        $arrayFinal[$key]['site_link'] = ($value['site_link'] != '') ? $this->addScheme($value['site_link']) : '';
                    }
                    
                $array = array();
                $i = 0;
                foreach ($arrayFinal as $value) {
                    $array [$i] = $value;

                    //get the track of actions
                    $sql1 = "SELECT coe_issue_reassignment.*, coe_users.first_name, coe_users.last_name FROM coe_issue_reassignment
                            LEFT JOIN coe_users ON coe_users.user_id = coe_issue_reassignment.coe_id
                            WHERE coe_issue_reassignment.issue_id=? ORDER BY coe_issue_reassignment.id DESC";
                    $bindparams = array($value['issue_id']);
                    $result1 = $this->_funcObject->sqlQuery($sql1, $bindparams);

                    $array [$i]['action_track'] = $result1['data'];

                    if ($array [$i]['manager_attach_list'] == NULL) {
                        $array [$i]['manager_attach_list'] = '';
                    }

                    if ($array [$i]['legal_attach_list'] == NULL) {
                        $array [$i]['legal_attach_list'] = '';
                    }

                    $i++;
                }

                    $response['json_data']['message'] = "Success";
                    $response['json_data']['response']['data'] = $array;
                } else {
                    $response['json_data']['message'] = "Not Found!";
                    $response['json_data']['response'] = 0;
                }
            } elseif ($data['escalation_type_id'] == 2) {

                $sql = "SELECT coe_issues_types.issue as choose_an_issue_name, 
                coe_escalation_request.followUp, coe_escalation_request.principle_investigator, coe_escalation_request.requested_by, coe_escalation_request.raised_by,
                coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name, coe_users.email as escalation_email,
                coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                legal.first_name as legal_first_name, legal.last_name as legal_last_name, legal.email as legal_email,
                coe_sitenames.sitename_id, coe_sitenames.sitename, 
                coe_countries.country_id, coe_countries.country_name,
                coe_language_escalation.*, coe_language_escalation.issue_id as request_number,
                coe_issue_status.*, coe_escalation_request.cc_email, 2 as escalation_type_id
                FROM `coe_escalation_request`
                LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                LEFT JOIN coe_language_escalation ON coe_escalation_request.request_id=coe_language_escalation.request_id
                LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_language_escalation.issue_id
                LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                LEFT JOIN coe_issues_types ON coe_language_escalation.type_issues=coe_issues_types.id
                WHERE coe_escalation_request.request_id=? && coe_escalation_request.escalation_type_id=2";
                $bindparams = array($data['request_id']);
                $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                $array = array();
                $i = 0;
                foreach ($result['data'] as $value) {
                    $array [$i] = $value;
                    $array [$i]['proposed_language'] = utf8_encode(preg_replace('/\s\s+/', ' ', $value['proposed_language']));
                    $array [$i]['dsec_issue'] = utf8_encode(preg_replace('/\s\s+/', ' ', $value['dsec_issue']));


                    //get the track of actions
                    $sql1 = "SELECT coe_issue_reassignment.*, coe_users.first_name, coe_users.last_name FROM coe_issue_reassignment
                            LEFT JOIN coe_users ON coe_users.user_id = coe_issue_reassignment.coe_id
                            WHERE coe_issue_reassignment.issue_id=? ORDER BY coe_issue_reassignment.id DESC";
                    $bindparams = array($value['issue_id']);
                    $result1 = $this->_funcObject->sqlQuery($sql1, $bindparams);

                    $array [$i]['action_track'] = $result1['data'];

                    if ($array [$i]['manager_attach_list'] == NULL) {
                        $array [$i]['manager_attach_list'] = '';
                    }

                    if ($array [$i]['legal_attach_list'] == NULL) {
                        $array [$i]['legal_attach_list'] = '';
                    }

                    $i++;
                }

                $count = (int) count($result['data']);
                if ($count > 0) {
                    $response['json_data']['message'] = "Success";
                    $response['json_data']['response']['data'] = $array;
                } else {
                    $response['json_data']['message'] = "Not Found!";
                    $response['json_data']['response'] = 0;
                }
            } else {
                $response['json_data']['message'] = "Escalation Type not Exist";
                $response['json_data']['response'] = 0;
            }
        }

        return $response;
    }

    /**
     * display currency list
     * @return int
     */
    public function currencyList() {
        $manvalues = array();
        $checkdata = $this->_funcObject->checkData($manvalues);
        $response = array();
        if ($checkdata === 0) {

            $sql = "SELECT * FROM `coe_currency` ORDER BY short_code ASC";
            $bindparams = array();
            $result = $this->_funcObject->sqlQuery($sql, $bindparams);

            $count = (int) count($result['data']);
            if ($count > 0) {
                $response['json_data']['message'] = "Success";
                $response['json_data']['response'] = $result['data'];
            } else {
                $response['json_data']['message'] = "Not Found!";
                $response['json_data']['response'] = 0;
            }
        }
        return $response;
    }

    /**
     * View Escalation Manager Request
     * @param type $data
     * @return string
     */
    public function viewManagerRequest($data) {
        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $manvalues = array($data['manager_id'], $data['startDate'], $data['endDate']);
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    $response = array();
                    if ($checkdata === 0) {
                        //coe request for Budget escalation on the basis of cro id ( User ID )
                        $sql = "SELECT coe_issues_types.issue as choose_an_issue_name, manager.first_name as escalation_first_name, manager.last_name as escalation_last_name, 
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_budget_escalation.*, coe_budget_escalation.issue_id as request_number,
                    coe_issue_status.*, 1 as escalation_type_id,
                    user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name, user.email as raisedBy_email,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name, legal.email as legal_email,
                    action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name
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
                    LEFT JOIN coe_issues_types ON coe_budget_escalation.choose_an_issue=coe_issues_types.id
                    WHERE coe_issue_status.escalation_manager_id=? && coe_escalation_request.escalation_type_id=1 &&
                    coe_escalation_request.insert_date BETWEEN ? AND ?";
                        $bindparams = array($data['manager_id'], $data['startDate'] . " 00:00:00", $data['endDate'] . " 23:59:59");
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        //coe request for contract language escalation on the basis of cro id ( User ID )
                        $sql1 = "SELECT coe_issues_types.issue as choose_an_issue_name, manager.first_name as escalation_first_name, manager.last_name as escalation_last_name, 
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_language_escalation.*, coe_language_escalation.issue_id as request_number,
                    coe_issue_status.*, 2 as escalation_type_id,
                    user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name, user.email as raisedBy_email,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name, legal.email as legal_email,
                    action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name
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
                    LEFT JOIN coe_issues_types ON coe_language_escalation.type_issues=coe_issues_types.id
                    WHERE coe_issue_status.escalation_manager_id=? && coe_escalation_request.escalation_type_id=2 &&
                    coe_escalation_request.insert_date BETWEEN ? AND ?";
                        $result1 = $this->_funcObject->sqlQuery($sql1, $bindparams);

                        //array combine
                        $arrayCombine = array_merge_recursive($result, $result1);

                        $arraySortDesc = array();
                        foreach ($arrayCombine['data'] as $key => $value) {
                            $arraySortDesc[$value['request_number']] = $value;
                        }

                        //array sort on key
                        krsort($arraySortDesc, SORT_DESC);

                        $arraySortDesc = array_values($arraySortDesc);

                        $array = array();
                        $i = 0;
                        foreach ($arraySortDesc as $value) {
                            $array [$i] = $value;
                            $array [$i]['proposed_language'] = utf8_encode(preg_replace('/\s\s+/', ' ', $value['proposed_language']));
                            $array [$i]['dsec_issue'] = utf8_encode(preg_replace('/\s\s+/', ' ', $value['dsec_issue']));

                            //get the track of actions
                            $sql1 = "SELECT coe_issue_reassignment.*, coe_users.first_name, coe_users.last_name, actionTaken.first_name as actionTakenBy_first_name, actionTaken.last_name as actionTakenBy_last_name FROM coe_issue_reassignment
                            LEFT JOIN coe_users ON coe_users.user_id = coe_issue_reassignment.coe_id
                            LEFT JOIN coe_users as actionTaken ON coe_issue_reassignment.manager_action_id=actionTaken.user_id
                            WHERE coe_issue_reassignment.issue_id=? ORDER BY coe_issue_reassignment.id DESC";
                            $bindparams = array($value['issue_id']);
                            $result1 = $this->_funcObject->sqlQuery($sql1, $bindparams);

                            $array [$i]['action_track'] = $result1['data'];


                            if ($array [$i]['manager_attach_list'] == NULL) {
                                $array [$i]['manager_attach_list'] = '';
                            }

                            if ($array [$i]['legal_attach_list'] == NULL) {
                                $array [$i]['legal_attach_list'] = '';
                            }

                            $i++;
                        }

                        $count = (int) count($array);
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
     * view legal requests
     * @param type $data
     * @return string
     */
    public function viewLegalRequest($data) {
        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {

                    $manvalues = array($data['legal_id'], $data['startDate'], $data['endDate']);
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    $response = array();
                    if ($checkdata === 0) {
                        //coe request for Language escalation on the basis of cro id ( User ID )
                        $sql = "SELECT  coe_issues_types.issue as choose_an_issue_name, coe_language_escalation.issue_id as request_number, coe_issue_status.*, coe_language_escalation.*, legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                    action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name, action_taken.email as actionTakenBy_email, manager.first_name as escalation_first_name, manager.last_name as escalation_last_name, manager.email as escalation_email
                    FROM `coe_language_escalation` 
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_language_escalation.issue_id 
                    LEFT JOIN coe_users as manager ON coe_issue_status.escalation_manager_id=manager.user_id 
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id 
                    LEFT JOIN coe_issues_types ON coe_language_escalation.type_issues=coe_issues_types.id 
                    LEFT JOIN coe_users as action_taken ON coe_issue_status.legal_action_id=action_taken.user_id WHERE coe_issue_status.`legal_user_id`=?
                    && coe_language_escalation.create_date BETWEEN ? AND ?";
                        $bindparams = array($data['legal_id'], $data['startDate'] . " 00:00:00", $data['endDate'] . " 23:59:59");
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        //coe request for Budget escalation on the basis of cro id ( User ID )
                        $sql = "SELECT coe_issues_types.issue as choose_an_issue_name, coe_budget_escalation.issue_id as request_number, coe_issue_status.*, coe_budget_escalation.*, legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                    action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name, action_taken.email as actionTakenBy_email, manager.first_name as escalation_first_name, manager.last_name as escalation_last_name, manager.email as escalation_email 
                    FROM `coe_budget_escalation` 
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_budget_escalation.issue_id 
                    LEFT JOIN coe_users as manager ON coe_issue_status.escalation_manager_id=manager.user_id 
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id 
                    LEFT JOIN coe_issues_types ON coe_budget_escalation.choose_an_issue=coe_issues_types.id 
                    LEFT JOIN coe_users as action_taken ON coe_issue_status.legal_action_id=action_taken.user_id WHERE coe_issue_status.`legal_user_id`=?
                    && coe_budget_escalation.create_date BETWEEN ? AND ?";
                        $result1 = $this->_funcObject->sqlQuery($sql, $bindparams);


                        //coe request for ICF escalation on the basis of cro id ( User ID )
                        $sql = "SELECT coe_icf_escalation.issue_id as request_number, coe_issue_status.*, coe_icf_escalation.*, legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                    action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name, action_taken.email as actionTakenBy_email
                    FROM `coe_icf_escalation` 
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_icf_escalation.issue_id 
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id 
                    LEFT JOIN coe_users as action_taken ON coe_issue_status.legal_action_id=action_taken.user_id WHERE coe_issue_status.`legal_user_id`=? 
                    && coe_icf_escalation.create_date BETWEEN ? AND ?";
                        $result2 = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $arrayCombine = array_merge_recursive($result, $result1, $result2);

                        $arraySortDesc = array();
                        foreach ($arrayCombine['data'] as $key => $value) {
                            $arraySortDesc[$value['request_number']] = $value;
                        }

                        krsort($arraySortDesc, SORT_DESC);
                        $arraySortDesc = array_values($arraySortDesc);

                        $count = (int) count($arraySortDesc);
                        if ($count > 0) {
                            $i = 0;
                            $finalArray = array();
                            foreach ($arraySortDesc as $key => $value) {

                                $sql = "SELECT coe_escalation_request.*,
                            coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                            coe_sitenames.sitename_id, coe_sitenames.sitename, 
                            coe_countries.country_id, coe_countries.country_name,
                            user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name, user.email as raisedBy_email
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

                        $array = array();
                        $i = 0;
                        foreach ($finalArray as $value) {
                            $array[$i] = $value;
                            $array[$i]['proposed_language'] = utf8_encode(preg_replace('/\s\s+/', ' ', $value['proposed_language']));
                            $array[$i]['dsec_issue'] = utf8_encode(preg_replace('/\s\s+/', ' ', $value['dsec_issue']));

                            //get the track of actions
                            $sql1 = "SELECT coe_issue_reassignment.*, coe_users.first_name, coe_users.last_name, actionTaken.first_name as actionTakenBy_first_name, actionTaken.last_name as actionTakenBy_last_name FROM coe_issue_reassignment
                            LEFT JOIN coe_users ON coe_users.user_id = coe_issue_reassignment.coe_id
                            LEFT JOIN coe_users as actionTaken ON coe_issue_reassignment.manager_action_id=actionTaken.user_id
                            WHERE coe_issue_reassignment.issue_id=? ORDER BY coe_issue_reassignment.id DESC";
                            $bindparams = array($value['issue_id']);
                            $result1 = $this->_funcObject->sqlQuery($sql1, $bindparams);

                            $array[$i]['action_track'] = $result1['data'];


                            if ($array[$i]['manager_attach_list'] == NULL) {
                                $array[$i]['manager_attach_list'] = '';
                            }

                            if ($array[$i]['legal_attach_list'] == NULL) {
                                $array[$i]['legal_attach_list'] = '';
                            }

                            $i++;
                        }

                        $count = (int) count($array);
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
     * only for backend to test email
     * @param type $data
     * @return string
     */
    public function sendEmail($data) {

        $mailer = new MAILER();
        $response = array();
        $sendEmail = $data['email'];
        $issue_id = 1;
        $protocolNo = 345;
        
        $siteName =23432;
        $escalationManagerName ="sdfs";
        $requestID=34;
        $data['escalation_type_id']=1;
        $croName="akshya";
        $croEmail = "akshay.suri@mobileprogramming.net";
        $escalationManagerEmail ="akshay.suri@mobileprogramming.net";
        $subject = 'Test Mail';
        //$emailBody = "Hello,<br><br>This is a  request.<br><br>akshay (<a href='mailto:".$croEmail."'>".$croEmail."</a>) has raised an escalation <br>Thank you.";
        $emailBody = "Hello,<br><br>This is a  Normal request.<br><br>
                        " . $croName . " (<a href='mailto:".$croEmail."'>".$croEmail."</a>) has raised an escalation " . $issue_id . " - " . $protocolNo . " - " . $siteName . " that has been assigned to " . (isset($escalationManagerName) ? $escalationManagerName : $legalManagerName) . " (<a href='mailto:".(isset($escalationManagerEmail) ? $escalationManagerEmail : $legalManagerEmail)."'>".(isset($escalationManagerEmail) ? $escalationManagerEmail : $legalManagerEmail)."</a>). 
                        Please login into the C2 Application (https://coe.mobileprogrammingllc.com/) for further details.<br><br>To view request please click on the link below (view only):<br><br>
                        https://" . $_SERVER['HTTP_HOST'] . "/ccPage.html?request_id=" . $requestID . "&escalation_type_id=" . $data['escalation_type_id'] . "<br><br>NOTE: To perform action on this request, please log into CoE C2 Application.<br><br>
                        <br>Thank you.";
        $sendmail = $mailer->sendMail($sendEmail, $subject, $emailBody);
        if ($sendmail) {
            $response['json_data']['message'] = "sent";
        } else {
            $response['json_data']['message'] = "not sent";
        }
        return $response;
    }

    /**
     * check session is set or not
     * @return string
     */
    public function session() {

        $response = array();

        if (isset($_SESSION['app_user_id'])) {
            $response['json_data']['response'] = $_SESSION;
            $response['json_data']['message'] = "success";
        } else {
            $response['json_data']['response'] = 0;
            $response['json_data']['message'] = "Session expired!";
        }
        return $response;
    }

    /**
     * user logout
     * @return int
     */
    public function userLogout() {
        $manvalues = array();
        $checkdata = $this->_funcObject->checkData($manvalues);
        $response = array();
        if ($checkdata === 0) {
            session_unset($_SESSION['app_user_id']);
            session_unset($_SESSION['app_user_type']);

            $response['json_data']['response'] = 1;
            $response['json_data']['message'] = "Logout Success. ";
        }
        return $response;
    }

    /**
     * update protcol id
     * @param type $data
     * @return string
     */
    public function updateProtocolId($data) {
        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $manvalues = array($data['request_id'], $data['protocol_id']);
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    $response = array();
                    if ($checkdata === 0) {
                        $sql = "UPDATE `coe_escalation_request` SET `protocol_id` = ? WHERE `request_id` = ?";
                        $bindparams = array($data['protocol_id'], $data['request_id']);
                        $this->_funcObject->sqlQuery($sql, $bindparams);

                        $response['json_data']['response'] = 1;
                        $response['json_data']['message'] = "Protocol updated successfully!";
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
     * for check reassigned request of escalation manager
     * @param type $data
     * @return int
     */
    public function reassignedRequest($data) {

        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $response = array();
                    $manvalues = array($data['coe_manager_id'], $data['coe_type'], $data['startDate'], $data['endDate']);
                    $checkdata = $this->_funcObject->checkData($manvalues);

                    if ($checkdata === 0) {

                        //get the issues distinct values from escalation/legal issues tracking table
                        $sql = "SELECT DISTINCT issue_id  FROM `coe_issue_reassignment` WHERE `coe_id` = ? AND `coe_type` = ? ORDER BY id DESC";
                        $bindparams = array($data['coe_manager_id'], $data['coe_type']);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $array = array();
                        foreach ($result['data'] as $key => $value) {

                            //fetch all track detail about issue id 
                            $sql = "SELECT *  FROM `coe_issue_reassignment` WHERE `issue_id` = ?";
                            $bindparams = array($value['issue_id']);
                            $result1 = $this->_funcObject->sqlQuery($sql, $bindparams);

                            $array[] = $result1;
                        }

                        $filterArray = array();
                        foreach ($array as $value) {
                            if (count($value['data']) > 1) {
                                $check1 = 0;
                                $check2 = 1;
                                foreach ($value['data'] as $key => $issueValues) {

                                    if ($issueValues['coe_id'] == $data['coe_manager_id'] && $check1 != 1) {
                                        $check1++;
                                    } elseif (($key + 1) == count($value['data']) && $issueValues['coe_id'] != $data['coe_manager_id']) {
                                        $check2 = 0;                      //check whether the issue still reassigned to same person
                                    }

                                    //if check1 and check2 true then it add the reassigned issue in filterArray
                                    if ($check1 > 0 && $check2 == 0) {
                                        $filterArray[] = $value['data'];
                                    }
                                }
                            }
                        }

                        //for getting the list of issues that are reassigned
                        $finalArray = array();
                        foreach ($filterArray as $value) {
                            //coe request for Budget escalation on the basis of issue id
                            $sql = "SELECT coe_issues_types.issue as choose_an_issue_name, coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name, coe_users.email as escalation_email, 
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_budget_escalation.*, coe_budget_escalation.issue_id as request_number,
                    coe_issue_status.*, 1 as escalation_type_id,
                    user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name, user.email as raisedBy_email,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name, legal.email as legal_email,
                    action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name, action_taken.email as actionTakenBy_email
                    FROM `coe_escalation_request`
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_budget_escalation ON coe_escalation_request.request_id=coe_budget_escalation.request_id
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_budget_escalation.issue_id
                    LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                    LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                    LEFT JOIN coe_users as action_taken ON coe_issue_status.manager_action_id=action_taken.user_id
                    LEFT JOIN coe_issues_types ON coe_budget_escalation.choose_an_issue=coe_issues_types.id 
                    WHERE coe_issue_status.issue_id=? && coe_escalation_request.escalation_type_id=1 
                    && coe_escalation_request.insert_date BETWEEN ? AND ?";
                            $bindparams = array($value[0]['issue_id'], $data['startDate'] . " 00:00:00", $data['endDate'] . " 23:59:59");
                            $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                            //coe request for contract language escalation on the basis of issue id
                            $sql1 = "SELECT coe_issues_types.issue as choose_an_issue_name, coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name, coe_users.email as escalation_email, 
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_language_escalation.*, coe_language_escalation.issue_id as request_number,
                    coe_issue_status.*, 2 as escalation_type_id,
                    user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name, user.email as raisedBy_email,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name, legal.email as legal_email,
                    action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name, action_taken.email as actionTakenBy_email
                    FROM `coe_escalation_request`
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_language_escalation ON coe_escalation_request.request_id=coe_language_escalation.request_id
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_language_escalation.issue_id
                    LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                    LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                    LEFT JOIN coe_users as action_taken ON coe_issue_status.manager_action_id=action_taken.user_id
                    LEFT JOIN coe_issues_types ON coe_language_escalation.type_issues=coe_issues_types.id 
                    WHERE coe_issue_status.issue_id=? && coe_escalation_request.escalation_type_id=2 
                    && coe_escalation_request.insert_date BETWEEN ? AND ?";
                            $result1 = $this->_funcObject->sqlQuery($sql1, $bindparams);

                            //coe request for icf escalation on the basis of issue id
                            $sql1 = "SELECT user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name, user.email as raisedBy_email,
                    coe_escalation_request.followUp, coe_escalation_request.principle_investigator, coe_escalation_request.requested_by, coe_escalation_request.raised_by,
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name, legal.email as legal_email,
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_icf_escalation.*, coe_icf_escalation.issue_id as request_number,
                    coe_issue_status.*, coe_escalation_request.cc_email, coe_escalation_request.escalation_type_id, coe_escalation_request.escalation_sub_type_id, coe_escalation_request.region_id, coe_regions.name as region_name
                    FROM `coe_escalation_request`
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_icf_escalation ON coe_escalation_request.request_id=coe_icf_escalation.request_id
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_icf_escalation.issue_id
                    LEFT JOIN coe_regions ON coe_regions.id=coe_escalation_request.region_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                    LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                    WHERE coe_issue_status.issue_id=? && coe_escalation_request.escalation_type_id=4 
                    && coe_escalation_request.insert_date BETWEEN ? AND ?";
                            $result2 = $this->_funcObject->sqlQuery($sql1, $bindparams);

                            //array merge
                            $arrayCombine = array_merge_recursive($result, $result1, $result2);

                            $array1 = array();
                            $i = 0;

                            foreach ($arrayCombine as $value) {

                                $array1['data'][$i] = $value[0];
                                $array1['data'][$i]['proposed_language'] = utf8_encode(preg_replace('/\s\s+/', ' ', $value[0]['proposed_language']));
                                $array1['data'][$i]['dsec_issue'] = utf8_encode(preg_replace('/\s\s+/', ' ', $value[0]['dsec_issue']));

                                //get the track of actions
                                $sql1 = "SELECT coe_issue_reassignment.*, coe_users.first_name, coe_users.last_name, actionTaken.first_name as actionTakenBy_first_name, actionTaken.last_name as actionTakenBy_last_name FROM coe_issue_reassignment
                            LEFT JOIN coe_users ON coe_users.user_id = coe_issue_reassignment.coe_id
                            LEFT JOIN coe_users as actionTaken ON coe_issue_reassignment.manager_action_id=actionTaken.user_id
                            WHERE coe_issue_reassignment.issue_id=? ORDER BY coe_issue_reassignment.id DESC";
                                $bindparams = array($value[0]['issue_id']);
                                $result1 = $this->_funcObject->sqlQuery($sql1, $bindparams);

                                $array1['data'] [$i]['action_track'] = $result1['data'];

                                if ($array1['data'][$i]['manager_attach_list'] == NULL) {
                                    $array1['data'][$i]['manager_attach_list'] = '';
                                }

                                if ($array1['data'][$i]['legal_attach_list'] == NULL) {
                                    $array1['data'][$i]['legal_attach_list'] = '';
                                }

                                $i++;
                            }

                            $finalArray[] = $array1['data'][0];
                        }

                        $count = (int) count($finalArray);
                        if ($count > 0) {
                            $response['json_data']['message'] = "Success";
                            $response['json_data']['response']['data'] = $finalArray;
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
