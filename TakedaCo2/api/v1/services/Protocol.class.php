<?php

header('Content-type: application/json');
require_once('../model/class.Functions.php');
require_once 'jwt_helper.php';
require_once 'ConstantValue.php';

class Protocol {

    function __autoload($class_name) {

        require $class_name . '.class.php';
    }

    public function __construct() {
        $this->_funcObject = new functions();
    }

    /**
     * add protocol numbers in system
     * @param type $data
     * @return int
     */
    public function addProtocol($data) {
        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $manvalues = array($data['protocol_name']);
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    $response = array();
                    if ($checkdata === 0) {

                        $sql = "SELECT * FROM `coe_protocol_numbers` WHERE protocol_number LIKE ?";
                        $bindparams = array($data['protocol_name']);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $count = (int) count($result['data']);
                        if ($count > 0) {
                            if ($result['data'][0]['is_active'] == 0) {
                                $query = "UPDATE `coe_protocol_numbers` SET `is_active` = '1', `update_date` = ?, `update_user` = ? WHERE `protocol_id` = ?";
                                $bindparams = array(date('Y-m-d H:i:s'), $data1->json_data->user_id, $result['data'][0]['protocol_id']);
                                $result = $this->_funcObject->sqlQuery($query, $bindparams);
                                $response['json_data']['message'] = "Success";
                                $response['json_data']['response'] = 1;
                            } else {
                                $response['json_data']['message'] = "Already Exist!";
                                $response['json_data']['response'] = 0;
                            }
                        } else {
                            $query = "INSERT INTO `coe_protocol_numbers` ( `protocol_number`, `insert_user`) VALUES (?,?)";
                            $bindparams = array(trim($data['protocol_name']), $data1->json_data->user_id);
                            $result = $this->_funcObject->sqlQuery($query, $bindparams);

                            $response['json_data']['message'] = "Success";
                            $response['json_data']['response'] = 1;
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
     * list of protocols
     * @param type $data
     * @return string
     */
    public function listProtocols($data) {
        
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

            if (isset($data['protocol_name'])) {
                $sql = "SELECT * FROM `coe_protocol_numbers` WHERE `is_active` = 1 && `protocol_number` LIKE ? ORDER BY coe_protocol_numbers.protocol_number ASC";
                $bindparams = array($data['protocol_name'] . "%");
                $result = $this->_funcObject->sqlQuery($sql, $bindparams);
            } else {
                $sql = "SELECT * FROM `coe_protocol_numbers` ORDER BY coe_protocol_numbers.protocol_number ASC";
                $bindparams = array();
                $result = $this->_funcObject->sqlQuery($sql, $bindparams);
            }

            $count = (int) count($result['data']);
            if ($count > 0) {
                $response['json_data']['message'] = "Success";
                $response['json_data']['response'] = $result['data'];
            } else {
                $response['json_data']['message'] = "Not Found!";
                $response['json_data']['response'] = 0;
            }
        } 
                }
                else
                {
                   $response['json_data']['response'] = 4;
                   $response['json_data']['message'] = "Token expired."; 
                }
               
            } catch (Exception $ex) {
                $response['json_data']['response'] = 7;
                $response['json_data']['message'] = "Oops something went wrong.";
            }
       
        }
        else {
            $response['json_data']['response'] = 6;
            $response['json_data']['message'] = "Authorization Token Not found";
        }
        
        
        return $response;
    }

    /**
     * delete protocol
     * @param type $data
     * @return int
     */
    public function deleteProtocol($data) {
        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $response = array();
                    $manvalues = array($data['protocol_id']);
                    $checkdata = $this->_funcObject->checkData($manvalues);

                    if ($checkdata === 0) {
                        $sql = "SELECT * FROM `coe_protocol_numbers` WHERE protocol_id = ?";
                        $bindparams = array($data['protocol_id']);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $count = (int) count($result['data']);
                        if ($count > 0) {
                            $query = "UPDATE `coe_protocol_numbers` SET `is_active` = '0', `update_date` = ?, `update_user` = ? WHERE `protocol_id` = ?";
                            $bindparams = array(date('Y-m-d H:i:s'), $data1->json_data->user_id, $data['protocol_id']);
                            $result = $this->_funcObject->sqlQuery($query, $bindparams);

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
     * edit protocol
     * @param type $data
     * @return int
     */
    public function editProtocol($data) {
        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $manvalues = array($data['protocol_id'], $data['protocol_name']);
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    $response = array();
                    if ($checkdata === 0) {
                       $sql = "SELECT * FROM `coe_protocol_numbers` WHERE protocol_id = ?";
                        $bindparams = array($data['protocol_id']);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $count = (int) count($result['data']);
                        if ($count > 0) {
                            $query = "UPDATE `coe_protocol_numbers` SET `update_date` = ?, `update_user` = ?, `protocol_number` = ? WHERE `protocol_id` = ?";
                            $bindparams = array(date('Y-m-d H:i:s'), $data1->json_data->user_id, trim($data['protocol_name']), $data['protocol_id']);
                            $result = $this->_funcObject->sqlQuery($query, $bindparams);

                            $response['json_data']['message'] = "Protocol Updated Successfully";
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

}
