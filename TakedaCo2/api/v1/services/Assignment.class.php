<?php

header('Content-type: application/json');

require_once('../model/class.Functions.php');
require_once 'jwt_helper.php';
require_once 'ConstantValue.php';

class Assignment {

    function __autoload($class_name) {

        require $class_name . '.class.php';
    }

    public function __construct() {

        $this->_funcObject = new functions();
    }

    /**
     * list of assignments
     * @param type $data
     * @return list of assignments according to form
     */
    public function assignmentList($data) {

        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {

                    $manvalues = array($data['form_id'], $data['icf_form_id'], $data['role_id']);
                    $response = array();
                    $checkdata = $this->_funcObject->checkData($manvalues);

                    if ($checkdata === 0) {

                        $query = "SELECT coe_assignments.id, coe_assignments.cta_type
                                , coe_issues_types.issue, coe_issues_types.id as issue_type_id
                                , coe_users.email as legal_email, coe_users.user_id as legal_email_id
                                , esc.email as escalation_manager_email, esc.user_id as escalation_manager_email_id
                                , coe_regions.name as region, coe_regions.id as region_id
                                , coe_countries.country_name, coe_countries.country_id
                                , coe_protocol_numbers.protocol_number, coe_protocol_numbers.protocol_id
                                FROM `coe_assignments`
                                LEFT JOIN coe_users ON coe_users.user_id=coe_assignments.legal_id
                                LEFT JOIN coe_users as esc ON esc.user_id=coe_assignments.escalation_manager_id
                                LEFT JOIN coe_regions ON coe_regions.id=coe_assignments.region_id
                                LEFT JOIN coe_countries ON coe_countries.country_id=coe_assignments.country_id
                                LEFT JOIN coe_issues_types ON coe_issues_types.id=coe_assignments.issue_type
                                LEFT JOIN coe_protocol_numbers ON coe_protocol_numbers.protocol_id=coe_assignments.protocol_id
                                WHERE coe_assignments.`form_id`=?  AND coe_assignments.`icf_form_id`=? AND coe_assignments.is_active=1 AND ";

                        if ($data['role_id'] == 2) {
                            $query .= "`legal_id`=0";
                        } else {
                            $query .= "`escalation_manager_id`=0";
                        }
                        
                        $query.= " GROUP BY coe_assignments.cta_type
                                , coe_issues_types.issue, issue_type_id
                                , legal_email, legal_email_id
                                , escalation_manager_email, escalation_manager_email_id
                                , region, region_id
                                , coe_countries.country_name, coe_countries.country_id
                                , coe_protocol_numbers.protocol_number, coe_protocol_numbers.protocol_id";

                        $bindparams = array($data['form_id'], $data['icf_form_id']);
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
    
    
    /**
     * list of legals (API using while performing action in escalation manager and reassigned to legal)
     * @param type $data
     * @return list of legals
     */
    public function legalList($data) {
        
         $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $manvalues = array($data['form_id'], $data['icf_form_id']);
                    $response = array();
                    $checkdata = $this->_funcObject->checkData($manvalues);

                    if ($checkdata === 0) {

                        $query = "SELECT coe_users.user_id, coe_users.first_name, coe_users.last_name, coe_users.email FROM `coe_users_roles` LEFT JOIN coe_users ON coe_users.user_id=coe_users_roles.user_id "
                                . "WHERE coe_users_roles.`esc_sub_type_id`=? && coe_users_roles.`esc_type_id`=? && coe_users.user_type=3 && coe_users.is_active=1 && coe_users.is_enabled=1 && coe_users.is_delete=0 GROUP BY user_id";
                        $bindparams = array($data['icf_form_id'], $data['form_id']);
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
     * delete the existing icf assignments
     * @param type $data
     * @return int
     */
    public function deleteAssignment($data) {
        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $manvalues = array($data['assignment_id']);
                    $response = array();
                    $checkdata = $this->_funcObject->checkData($manvalues);

                    if ($checkdata === 0) {
                        //select all rows related to the coe_icf_assgnment id
                        $query = "SELECT * FROM `coe_assignments` WHERE `id`=?";
                        $bindparams = array($data['assignment_id']);
                        $result = $this->_funcObject->sqlQuery($query, $bindparams);

                        $count = (int) count($result['data']);
                        if ($count > 0) {
                            $queryDel = "DELETE FROM `coe_assignments` WHERE `cta_type`=? AND `issue_type`=? AND `form_id`=? AND `icf_form_id`=? AND `region_id`=? AND `country_id`=? AND `protocol_id`=? AND `legal_id`=?  AND `escalation_manager_id`=?";
                            $bindparams = array($result['data'][0]['cta_type'], $result['data'][0]['issue_type'], $result['data'][0]['form_id'], $result['data'][0]['icf_form_id'], $result['data'][0]['region_id'], $result['data'][0]['country_id'], $result['data'][0]['protocol_id'], $result['data'][0]['legal_id'], $result['data'][0]['escalation_manager_id']);
                            $this->_funcObject->sqlQuery($queryDel, $bindparams);
                        }

//            $queryDel = "DELETE FROM `Takeda_COE`.`coe_icf_assgnments` WHERE `coe_icf_assgnments`.`id` = ?";
//            $bindparams = array($data['assignment_id']);
//            $this->_funcObject->sqlQuery($queryDel, $bindparams);

                        $response['json_data']['message'] = "Success";
                        $response['json_data']['response'] = 1;
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
     * function for to create many to many relation of more than two arrays
     * @param type $input
     * @return type
     */
    public function cartesian($input) {
        $result = array();

        while (list($key, $values) = each($input)) {
            // If a sub-array is empty, it doesn't affect the cartesian product
            if (empty($values)) {
                continue;
            }

            // Seeding the product array with the values from the first sub-array
            if (empty($result)) {
                foreach ($values as $value) {
                    $result[] = array($key => $value);
                }
            } else {
                // Second and subsequent input sub-arrays work like this:
                //   1. In each existing array inside $product, add an item with
                //      key == $key and value == first item in input sub-array
                //   2. Then, for each remaining item in current input sub-array,
                //      add a copy of each existing array inside $product with
                //      key == $key and value == first item of input sub-array
                // Store all items to be added to $product here; adding them
                // inside the foreach will result in an infinite loop
                $append = array();

                foreach ($result as &$product) {
                    // Do step 1 above. array_shift is not the most efficient, but
                    // it allows us to iterate over the rest of the items with a
                    // simple foreach, making the code short and easy to read.
                    $product[$key] = array_shift($values);

                    // $product is by reference (that's why the key we added above
                    // will appear in the end result), so make a copy of it here
                    $copy = $product;

                    // Do step 2 above.
                    foreach ($values as $item) {
                        $copy[$key] = $item;
                        $append[] = $copy;
                    }

                    // Undo the side effecst of array_shift
                    array_unshift($values, $product[$key]);
                }

                // Out of the foreach, we can add to $results now
                $result = array_merge($result, $append);
            }
        }

        return $result;
    }
    
    
    /**
     * save assignments for the escalation manager and for legals
     * @param type $data
     * @return int
     */
    public function saveAssignments($data) {
        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $manvalues = array($data['form_id'], $data['icf_form_id'], $data['cta_type'], $data['issue_type'], $data['region_id'], $data['country_id'], $data['protocol_id'], $data['legal_id'], $data['escalation_manager_id']);
                    $response = array();
                    $checkdata = $this->_funcObject->checkData($manvalues);

                    if ($checkdata === 0) {

                        if (isset($data['assignment_id'])) {
                            $delQuery = "DELETE FROM `coe_assignments` WHERE `id` = ?";
                            $bindparams = array($data['assignment_id']);
                            $this->_funcObject->sqlQuery($delQuery, $bindparams);
                        }

                        if ($data['icf_form_id'] == 1) {
                            foreach (explode(',', $data['region_id']) as $region_id) {
                                foreach (explode(',', $data['legal_id']) as $legal_id) {
                                    $query = "INSERT INTO `coe_assignments` (`form_id`, `icf_form_id`, `region_id`, `country_id`, `protocol_id`, `legal_id`) VALUES (?,?,?,?,?,?)";
                                    $bindparams = array($data['form_id'], 1, $region_id, 0, 0, $legal_id);
                                    $this->_funcObject->sqlQuery($query, $bindparams);
                                }
                            }
                        } else {
                            $cta_type = explode(',', $data['cta_type']);
                            $issue_type = explode(',', $data['issue_type']);
                            $country_ids = explode(',', $data['country_id']);
                            $protocol_ids = explode(',', $data['protocol_id']);
                            $legal_ids = explode(',', $data['legal_id']);
                            $escalation_manager_id = explode(',', $data['escalation_manager_id']);

                            $arrayInput[] = $cta_type;
                            $arrayInput[] = $issue_type;
                            $arrayInput[] = $country_ids;
                            $arrayInput[] = $protocol_ids;
                            $arrayInput[] = $legal_ids;
                            $arrayInput[] = $escalation_manager_id;

                            $arrayReturn = $this->cartesian($arrayInput);

                            foreach ($arrayReturn as $value) {
                                
                                $sql="SELECT region_id FROM `coe_countries` WHERE coe_countries.country_id=?";
                                $bindparams = array($value[2]);
                                $region=$this->_funcObject->sqlQuery($sql, $bindparams);
                                
                                $query = "INSERT INTO `coe_assignments` (`form_id`, `icf_form_id`, `cta_type`, `issue_type`, `region_id`, `country_id`, `protocol_id`, `legal_id`, `escalation_manager_id`) VALUES (?,?,?,?,?,?,?,?,?)";
                                $bindparams = array($data['form_id'], $data['icf_form_id'], $value[0], $value[1], $region['data'][0]['region_id'], $value[2], $value[3], $value[4], $value[5]);
                                $this->_funcObject->sqlQuery($query, $bindparams);
                            }
                        }

                        $response['json_data']['message'] = "Success";
                        $response['json_data']['response'] = 1;
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
     * list of icf others legals
     * @return int
     */
    public function icfOthersList() {

        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {
                    $manvalues = array();
                    $checkdata = $this->_funcObject->checkData($manvalues);
                    if ($checkdata === 0) {
                        $query = "SELECT DISTINCT coe_users.user_id, coe_users.email FROM `coe_users_roles` LEFT JOIN coe_users ON coe_users.user_id=coe_users_roles.user_id WHERE coe_users_roles.`esc_sub_type_id`=4 AND coe_users.is_delete=0 ORDER BY coe_users.email ASC";
                        $bindparams = array();
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

    /**
     * only for backend use specifying the role for old legal managers
     * @return int
     */
    public function patchForLegalManagers() {
        $manvalues = array();
        $response = array();
        $checkdata = $this->_funcObject->checkData($manvalues);
        if ($checkdata === 0) {
            $query = "SELECT * FROM `coe_users` WHERE coe_users.user_id NOT IN (SELECT coe_users_roles.user_id FROM coe_users_roles) && `coe_users`.`user_type`=3";
            $bindparams = array($data['icf_form_id'], $data['form_id']);
            $result = $this->_funcObject->sqlQuery($query, $bindparams);

            $count = (int) count($result['data']);
            if ($count > 0) {

                foreach ($result['data'] as $value) {
                    $query = "INSERT INTO `coe_users_roles` (`esc_type_id`, `esc_sub_type_id`, `user_type`, `user_id`) VALUES (?,?,?,?), (?,?,?,?)";
                    $bindparams = array(1, 0, 3, $value['user_id'], 2, 0, 3, $value['user_id']);
                    $this->_funcObject->sqlQuery($query, $bindparams);
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
     * delete the icf other legal
     * @param type $data
     * @return int
     */
    public function icfOthersListDelete($data) {

        $headers = getallheaders();
        if (array_key_exists('authorization', $headers)) {
            $token = $headers['authorization'];
            try {
                $data1 = JWT::decode($token, SECRET_KEY);
                if ($data1->json_data->exp >= time()) {

                    $checkdata = $this->_funcObject->checkData($manvalues);
                    if ($checkdata === 0) {
                        $query = "DELETE FROM coe_users_roles WHERE coe_users_roles.user_id=? AND coe_users_roles.user_type=3 AND coe_users_roles.esc_sub_type_id=4";
                        $bindparams = array($data['user_id']);
                        $this->_funcObject->sqlQuery($query, $bindparams);

                        $response['json_data']['message'] = "Success";
                        $response['json_data']['response'] = 1;
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
