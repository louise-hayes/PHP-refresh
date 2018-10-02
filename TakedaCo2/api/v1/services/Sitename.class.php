<?php

header('Content-type: application/json');
require_once('../model/class.Functions.php');
require_once 'jwt_helper.php';
require_once 'ConstantValue.php';
class Sitename {

    function __autoload($class_name) {

        require $class_name . '.class.php';
    }

    public function __construct() {
        $this->_funcObject = new functions();
    }

    /**
     * Function for Add Sitename
     * @param type $data
     * @return int
     */
    public function addSitename($data) {

        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {

                    $manvalues = array($data['sitename']);
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    $response = array();
                    if ($checkdata === 0) {

                        $sql = "SELECT * FROM `coe_sitenames` WHERE sitename LIKE ?";
                        $bindparams = array($data['sitename']);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $count = (int) count($result['data']);
                        if ($count > 0) {
                            if ($result['data'][0]['is_active'] == 0) {
                                $query = "UPDATE `coe_sitenames` SET `is_active` = '1', `update_date` = ?, `update_user` = ? WHERE `sitename_id` = ?";
                                $bindparams = array(date('Y-m-d H:i:s'), $data1->json_data->user_id, $result['data'][0]['sitename_id']);
                                $result = $this->_funcObject->sqlQuery($query, $bindparams);
                                $response['json_data']['message'] = "Success";
                                $response['json_data']['response'] = 1;
                            } else {
                                $response['json_data']['message'] = "Already Exist!";
                                $response['json_data']['response'] = 0;
                            }
                        } else {
                            $query = "INSERT INTO `coe_sitenames` (`sitename`) VALUES (?)";
                            $bindparams = array(trim($data['sitename']));
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
     * Function for Edit Sitename
     * @param type $data
     * @return int
     */
    public function editSitename($data) {

        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                   $manvalues = array($data['sitename_id'], $data['sitename']);
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    $response = array();
                    if ($checkdata === 0) {
                        $sql = "SELECT * FROM `coe_sitenames` WHERE sitename_id = ?";
                        $bindparams = array($data['sitename_id']);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $count = (int) count($result['data']);
                        if ($count > 0) {
                            $query = "UPDATE `coe_sitenames` SET `update_date` = ?, `update_user` = ?, `sitename` = ? WHERE `sitename_id` = ?";
                            $bindparams = array(date('Y-m-d H:i:s'), $data1->json_data->user_id, trim($data['sitename']), $data['sitename_id']);
                            $result = $this->_funcObject->sqlQuery($query, $bindparams);

                            $response['json_data']['message'] = "Sitename Updated Successfully";
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
     * list of sitenames
     * @param type $data
     * @return int
     */
    public function listSitename($data) {

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
                        if (isset($data['sitename'])) {
                            $sql = "SELECT * FROM `coe_sitenames` WHERE `is_active` = 1 && sitename LIKE ? ORDER BY coe_sitenames.sitename ASC";
                            $bindparams = array($data['sitename'] . '%');
                        } else {
                            $sql = "SELECT * FROM `coe_sitenames` ORDER BY coe_sitenames.sitename ASC";
                            $bindparams = array();
                        }

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
     * delete sitename
     * @param type $data
     * @return int
     */
    public function deleteSitename($data) {
        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $manvalues = array($data['sitename_id']);
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    $response = array();
                    if ($checkdata === 0) {

                        $sql = "SELECT * FROM `coe_sitenames` WHERE sitename_id = ?";
                        $bindparams = array($data['sitename_id']);
                        $result = $this->_funcObject->sqlQuery($sql, $bindparams);

                        $count = (int) count($result['data']);
                        if ($count > 0) {
                            $query = "UPDATE `coe_sitenames` SET `is_active` = '0', `update_date` = ?, `update_user` = ? WHERE `sitename_id` = ?";
                            $bindparams = array(date('Y-m-d H:i:s'), $data1->json_data->user_id, $data['sitename_id']);
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

}
