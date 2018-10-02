<?php

header('Content-type: application/json');

require_once('../model/class.Functions.php');
require_once 'jwt_helper.php';
require_once 'ConstantValue.php';
class Attachments {

    function __autoload($class_name) {

        require $class_name . '.class.php';
    }

    public function __construct() {

        $this->_funcObject = new functions();
    }

    /**
     * Upload attachment function
     * @param type $data
     * @return attachment id
     */
    public function uploadAttachment() {
        $response = array();
        $manvalues = array();
        $checkdata = $this->_funcObject->checkData($manvalues);

        if ($checkdata === 0) {
            move_uploaded_file($_FILES['file']['tmp_name'], '../../../attachments/' . time() . $_FILES['file']['name']);

            $query = "INSERT INTO `coe_attachments` (`attachment_name`) VALUES (?)";
            $bindparams = array(time() . $_FILES['file']['name']);
            $result = $this->_funcObject->sqlQuery($query, $bindparams);

            $response['json_data']['message'] = "Success";
            $response['json_data']['response'] = 1;
            $response['json_data']['attachment_id'] = $result;
        }
        return $response;
    }

    /**
     * get full links of attachments from attachment Ids
     * @param type $data
     * @return link of attachments
     */
    public function attachmentIdsList($data) {
        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $response = array();
                    $manvalues = array($data['attachmentIds']);
                    $checkdata = $this->_funcObject->checkData($manvalues);

                    if ($checkdata === 0) {
                        $attachmemtIds = explode(',', $data['attachmentIds']);
                        $array = array();
                        foreach ($attachmemtIds as $value) {
                            $sql = "SELECT * FROM `coe_attachments` WHERE attachment_id=?";
                            $bindparams = array($value);
                            $result = $this->_funcObject->sqlQuery($sql, $bindparams);
                            $array[] = array('id' => $result['data'][0]['attachment_id'], 'link' => "https://" . $_SERVER['HTTP_HOST'] . "/webservices/attachments/" . $result['data'][0]['attachment_name']);
                        }

                        $count = (int) count($result['data']);
                        if ($count > 0) {
                            $response['json_data']['message'] = "Success";
                            $response['json_data']['response'] = $array;
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
