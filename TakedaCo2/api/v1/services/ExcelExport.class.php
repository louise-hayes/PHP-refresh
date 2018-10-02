<?php

header('Content-type: application/json');
require_once('../model/class.Functions.php');

class ExcelExport {

    function __autoload($class_name) {

        require $class_name . '.class.php';
    }

    public function __construct() {
        $this->_funcObject = new functions();
    }

    /**
     * Function for Excel Export For Cro
     * @param type $data
     */
    public function ExcelExportCro($data) {
        $manvalues = array($data['cro_id']);
        $checkdata = $this->_funcObject->checkData($manvalues);

        if ($checkdata == 0) {

            //coe request for Budget escalation on the basis of cro id ( User ID )
            $sql = "SELECT coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name, 
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_budget_escalation.*, coe_budget_escalation.issue_id as request_number,
                    coe_issue_status.*, 1 as escalation_type_id
                    FROM `coe_escalation_request`
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_users ON coe_escalation_request.escalation_manager_id=coe_users.user_id
                    LEFT JOIN coe_budget_escalation ON coe_escalation_request.request_id=coe_budget_escalation.request_id
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_budget_escalation.issue_id
                    WHERE coe_escalation_request.user_id=? && coe_escalation_request.escalation_type_id=1";
            $bindparams = array($data['cro_id']);
            $result = $this->_funcObject->sqlQuery($sql, $bindparams);

            //coe request for contract language escalation on the basis of cro id ( User ID )
            $sql1 = "SELECT coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name, 
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_language_escalation.*, coe_language_escalation.issue_id as request_number,
                    coe_issue_status.*, 2 as escalation_type_id
                    FROM `coe_escalation_request`
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_users ON coe_escalation_request.escalation_manager_id=coe_users.user_id
                    LEFT JOIN coe_language_escalation ON coe_escalation_request.request_id=coe_language_escalation.request_id
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_language_escalation.issue_id
                    WHERE coe_escalation_request.user_id=? && coe_escalation_request.escalation_type_id=2";
            $result1 = $this->_funcObject->sqlQuery($sql1, $bindparams);

            $sql = "SELECT coe_escalation_request.followUp, coe_escalation_request.principle_investigator, coe_escalation_request.requested_by, coe_escalation_request.raised_by,
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name,
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
                    WHERE coe_escalation_request.user_id=? && coe_escalation_request.escalation_type_id=4";
            $result2 = $this->_funcObject->sqlQuery($sql, $bindparams);

            $arrayCombine = array_merge_recursive($result, $result1, $result2);


            $arraySortDesc = array();
            if (!empty($arrayCombine)) {
                foreach ($arrayCombine['data'] as $value) {
                    $arraySortDesc[$value['request_number']] = $value;
                }
            }


            krsort($arraySortDesc, SORT_DESC);
            $arraySortDesc = array_values($arraySortDesc);
            $data = array();

            if (!empty($arraySortDesc)) {
                foreach ($arraySortDesc as $result1) {
                    if ($result1['escalation_type_id'] == 1) {
                        $issue_type = 'Budget' . " - " . $result1['choose_an_issue'];
                    } elseif ($result1['escalation_type_id'] == 2) {
                        $issue_type = 'Contract' . " - " . $result1['type_contract_language'];
                    } elseif ($result1['escalation_type_id'] == 4) {
                        $issue_type = 'ICF' . " - ";

                        if ($result1['escalation_sub_type_id'] == 1) {
                            $issue_type .= "Global Master";
                        } elseif ($result1['escalation_sub_type_id'] == 2) {
                            $issue_type .= "Country Level";
                        } else {
                            $issue_type .= "Site Level";
                        }
                    } else {
                        $issue_type = '-------';
                    }

                    if ($result1['legal_action_desc'] == 'null' || $result1['legal_action_desc'] == '' && $result1['manager_action_desc'] == 'null' || $result1['manager_action_desc'] == 'null') {
                        $LatestDescriptionByCOE = "-------";
                    } elseif ($result1['legal_action_desc'] == 'null' || $result1['legal_action_desc'] == '') {

                        $LatestDescriptionByCOE = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['manager_action_desc']));
                    } else {
                        $LatestDescriptionByCOE = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['legal_action_desc']));
                    }


                    if ($result1['manager_action'] == 1) {
                        $ManagerAction = 'Pending';
                    } elseif ($result1['manager_action'] == 2) {
                        $ManagerAction = 'Approved';
                    } elseif ($result1['manager_action'] == 3) {
                        $ManagerAction = 'Denied';
                    } elseif ($result1['manager_action'] == 4) {
                        $ManagerAction = 'Negotiation';
                    } elseif ($result1['manager_action'] == 5) {
                        $ManagerAction = 'Escalated';
                    } elseif ($result1['manager_action'] == 6) {
                        $ManagerAction = 'Approved With Negotiation';
                    } elseif ($result1['manager_action'] == 7) {
                        $ManagerAction = 'On Hold';
                    } elseif ($result1['manager_action'] == 8) {
                        $ManagerAction = 'Reassign';
                    } elseif ($result1['manager_action'] == 9) {
                        $ManagerAction = 'Closed';
                    } else {
                        $ManagerAction = '-------';
                    }

                    if ($result1['legal_action'] == 1) {
                        $LegalAction = 'Pending';
                    } elseif ($result1['legal_action'] == 2) {
                        $LegalAction = 'Approved';
                    } elseif ($result1['legal_action'] == 3) {
                        $LegalAction = 'Denied';
                    } elseif ($result1['legal_action'] == 4) {
                        $LegalAction = 'Approved with modification';
                    } elseif ($result1['legal_action'] == 5) {
                        $LegalAction = 'Pending-OC';
                    } elseif ($result1['manager_action'] == 6) {
                        $ManagerAction = 'On Hold';
                    } elseif ($result1['manager_action'] == 7) {
                        $ManagerAction = 'Reassign';
                    } elseif ($result1['manager_action'] == 8) {
                        $ManagerAction = 'Closed';
                    } else {
                        $LegalAction = '-------';
                    }

                    if ($result1['legal_action_desc'] == 'null' || $result1['legal_action_desc'] == '') {
                        $legalActionDesc = '-------';
                    } else {
                        $legalActionDesc = $result1['legal_action_desc'];
                    }
                    if ($result1['manager_action_desc'] == 'null' || $result1['manager_action_desc'] == '') {
                        $managerActionDesc = '-------';
                    } else {
                        $managerActionDesc = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['manager_action_desc']));
                    }

                    if ($result1['resolution_date'] == '' || $result1['resolution_date'] == '0000-00-00 00:00:00') {
                        $resolution_date = '-------';
                    } else {
                        $resolution_date = $result1['resolution_date'];
                    }

                    if ($result1['type_contract_language'] == 'null' || $result1['type_contract_language'] == '') {
                        $typecontractlanguage = '-------';
                    } else {
                        $typecontractlanguage = strip_tags($result1['type_contract_language']);
                    }

                    if ($result1['proposed_language'] == 'null' || $result1['proposed_language'] == '') {
                        $ProposedLanguage = '-------';
                    } else {
                        $ProposedLanguage = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['proposed_language']));
                    }
                    if ($result1['site_rationale'] == 'null' || $result1['site_rationale'] == '') {
                        $SiteRationale = '-------';
                    } else {
                        $SiteRationale = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['site_rationale']));
                    }

                    if ($result1['attempts_negotiate'] == 'null' || $result1['attempts_negotiate'] == '') {
                        $AttemptsNegotiate = '------';
                    } else {
                        $AttemptsNegotiate = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['attempts_negotiate']));
                    }

                    if ($result1['FMV_high'] == 'null' || $result1['FMV_high'] == '') {
                        $FMVHigh = '-------';
                    } else {
                        $FMVHigh = $result1['FMV_high'];
                    }
                    if ($result1['percent_FMV'] == 'null' || $result1['percent_FMV'] == '') {
                        $percentFMV = '-------';
                    } else {
                        $percentFMV = $result1['percent_FMV'];
                    }
                    if ($result1['site_justification'] == 'null' || $result1['site_justification'] == '') {
                        $SiteJustification = '-------';
                    } else {
                        $SiteJustification = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['site_justification']));
                    }
                    if ($result1['any_other_details'] == 'null' || $result1['any_other_details'] == '') {
                        $AnyOtherDetails = '-------';
                    } else {
                        $AnyOtherDetails = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['any_other_details']));
                    }

                    $sitename = str_replace(',', '-', $result1['sitename']);
                    $rtype = $result1['request_number'] . "-" . $result1['protocol_number'] . "-" . $sitename;
                    $data[] = array("Request Type" => $rtype, "Issue" => $issue_type, "Raised on" => $result1['create_date'], "Escalation Manager" => $result1['escalation_first_name'] . " " . $result1['escalation_last_name'], "Escalation Manager Action" => $ManagerAction, "Legal/Other Action" => $LegalAction, "Latest Description By COE" => $LatestDescriptionByCOE, "Resolution Date" => $resolution_date, "Country Name" => $result1['country_name'], "Type Contract Language" => $typecontractlanguage, "Proposed Language" => $ProposedLanguage, "Site Rationale" => $SiteRationale, "Attempts Negotiate" => $AttemptsNegotiate, "FMV High" => $FMVHigh, "percent_FMV" => $percentFMV, "Site Justification" => $SiteJustification, "Any Other Details" => $AnyOtherDetails, "Manager Action Desc" => $managerActionDesc, "Legal Action Desc" => $legalActionDesc);
                }
                // file name for download
                $fileName = "excelcro.xls";
                // headers for download
                header("Content-Disposition: attachment; filename=\"$fileName\"");
                header("Content-Type: application/vnd.ms-excel");
                $flag = false;
                foreach ($data as $row) {
                    if (!$flag) {
                        // display column names as first row
                        echo implode("\t", array_keys($row)) . "\n";
                        $flag = true;
                    }
                    // filter data
                    $row = str_replace('', '', $row);
                    echo implode("\t", array_values($row)) . "\n";
                }
            }
        }die;
        //return null;
    }

    /**
     * Function for Export Excel For Manager
     * @param type $data
     */
    public function ExportExcelManager($data) {
        $manvalues = array($data['escalation_manager_id']);
        $checkdata = $this->_funcObject->checkData($manvalues);

        if ($checkdata == 0) {
            //coe request for Budget escalation on the basis of manager id ( User ID )
            $sql = "SELECT manager.first_name as escalation_first_name, manager.last_name as escalation_last_name, 
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_budget_escalation.*, coe_budget_escalation.issue_id as request_number,
                    coe_issue_status.*, 1 as escalation_type_id,
                    user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                    action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name
                    FROM `coe_escalation_request`
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_users as manager ON coe_escalation_request.escalation_manager_id=manager.user_id
                    LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                    LEFT JOIN coe_budget_escalation ON coe_escalation_request.request_id=coe_budget_escalation.request_id
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_budget_escalation.issue_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                    LEFT JOIN coe_users as action_taken ON coe_issue_status.manager_action_id=action_taken.user_id
                    WHERE coe_escalation_request.escalation_manager_id=? && coe_escalation_request.escalation_type_id=1";
            $bindparams = array($data['escalation_manager_id']);
            $result = $this->_funcObject->sqlQuery($sql, $bindparams);

            //coe request for contract language escalation on the basis of manager id ( User ID )
            $sql1 = "SELECT manager.first_name as escalation_first_name, manager.last_name as escalation_last_name, 
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_language_escalation.*, coe_language_escalation.issue_id as request_number,
                    coe_issue_status.*, 2 as escalation_type_id,
                    user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                    action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name
                    FROM `coe_escalation_request`
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_users as manager ON coe_escalation_request.escalation_manager_id=manager.user_id
                    LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                    LEFT JOIN coe_language_escalation ON coe_escalation_request.request_id=coe_language_escalation.request_id
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_language_escalation.issue_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                    LEFT JOIN coe_users as action_taken ON coe_issue_status.manager_action_id=action_taken.user_id
                    WHERE coe_escalation_request.escalation_manager_id=? && coe_escalation_request.escalation_type_id=2";
            $result1 = $this->_funcObject->sqlQuery($sql1, $bindparams);
            $arrayCombine = array_merge_recursive($result, $result1);

            $arraySortDesc = array();
            if (!empty($arrayCombine)) {
                foreach ($arrayCombine['data'] as $value) {
                    $arraySortDesc[$value['request_number']] = $value;
                }
            }

            krsort($arraySortDesc, SORT_DESC);

            $arraySortDesc = array_values($arraySortDesc);
            $count = (int) count($arraySortDesc);
            if ($count > 0) {
                $data = array();
                if (!empty($arraySortDesc)) {
                    foreach ($arraySortDesc as $result1) {

                        if ($result1['escalation_type_id'] == 1) {
                            $issue_type = 'Budget' . " - " . $result1['choose_an_issue'];
                        } elseif ($result1['escalation_type_id'] == 2) {
                            $issue_type = 'Contract' . " - " . $result1['type_contract_language'];
                        } elseif ($result1['escalation_type_id'] == 4) {
                            $issue_type = 'ICF' . " - ";

                            if ($result1['escalation_sub_type_id'] == 1) {
                                $issue_type .= "Global Master";
                            } elseif ($result1['escalation_sub_type_id'] == 2) {
                                $issue_type .= "Country Level";
                            } else {
                                $issue_type .= "Site Level";
                            }
                        } else {
                            $issue_type = '-------';
                        }


                        if ($result1['legal_action_desc'] == 'null' && $result1['manager_action_desc'] == 'null') {
                            $LatestDescriptionByCOE = "-------";
                        } elseif ($result1['legal_action_desc'] == 'null') {
                            $LatestDescriptionByCOE = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['manager_action_desc']));
                        } else {
                            $LatestDescriptionByCOE = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['legal_action_desc']));
                        }
                        if ($result1['manager_action'] == 1) {
                            $ManagerAction = 'Pending';
                        } elseif ($result1['manager_action'] == 2) {
                            $ManagerAction = 'Approved';
                        } elseif ($result1['manager_action'] == 3) {
                            $ManagerAction = 'Denied';
                        } elseif ($result1['manager_action'] == 4) {
                            $ManagerAction = 'Negotiation';
                        } elseif ($result1['manager_action'] == 5) {
                            $ManagerAction = 'Escalated';
                        } elseif ($result1['manager_action'] == 6) {
                            $ManagerAction = 'Approved With Negotiation';
                        } elseif ($result1['manager_action'] == 7) {
                            $ManagerAction = 'On Hold';
                        } elseif ($result1['manager_action'] == 8) {
                            $ManagerAction = 'Reassign';
                        } elseif ($result1['manager_action'] == 9) {
                            $ManagerAction = 'Closed';
                        } else {
                            $ManagerAction = '-------';
                        }

                        if ($result1['legal_action'] == 1) {
                            $LegalAction = 'Pending';
                        } elseif ($result1['legal_action'] == 2) {
                            $LegalAction = 'Approved';
                        } elseif ($result1['legal_action'] == 3) {
                            $LegalAction = 'Denied';
                        } elseif ($result1['legal_action'] == 4) {
                            $LegalAction = 'Approved with modification';
                        } elseif ($result1['legal_action'] == 5) {
                            $LegalAction = 'Pending-OC';
                        } elseif ($result1['manager_action'] == 6) {
                            $ManagerAction = 'On Hold';
                        } elseif ($result1['manager_action'] == 7) {
                            $ManagerAction = 'Reassign';
                        } elseif ($result1['manager_action'] == 8) {
                            $ManagerAction = 'Closed';
                        } else {
                            $LegalAction = '-------';
                        }


                        if ($result1['legal_action_desc'] == 'null' || $result1['legal_action_desc'] == ' ') {
                            $legalActionDesc = '-------';
                        } else {
                            $legalActionDesc = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['legal_action_desc']));
                        }
                        if ($result1['manager_action_desc'] == 'null' || $result1['manager_action_desc'] == '') {
                            $managerActionDesc = '-------';
                        } else {
                            $managerActionDesc = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['manager_action_desc']));
                        }

                        if ($result1['resolution_date'] == '' || $result1['resolution_date'] == '0000-00-00 00:00:00') {
                            $resolution_date = '-------';
                        } else {
                            $resolution_date = $result1['resolution_date'];
                        }

                        if ($result1['type_contract_language'] == 'null' || $result1['type_contract_language'] == '') {
                            $typecontractlanguage = '-------';
                        } else {
                            $typecontractlanguage = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['type_contract_language']));
                        }

                        if ($result1['proposed_language'] == 'null' || $result1['proposed_language'] == '') {
                            $ProposedLanguage = '-------';
                        } else {
                            $ProposedLanguage = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['proposed_language']));
                        }
                        if ($result1['site_rationale'] == 'null' || $result1['site_rationale'] == '') {
                            $SiteRationale = '-------';
                        } else {
                            $SiteRationale = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['site_rationale']));
                        }

                        if ($result1['attempts_negotiate'] == 'null' || $result1['attempts_negotiate'] == '') {
                            $AttemptsNegotiate = '------';
                        } else {
                            $AttemptsNegotiate = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['attempts_negotiate']));
                        }

                        if ($result1['FMV_high'] == 'null' || $result1['FMV_high'] == '') {
                            $FMVHigh = '-------';
                        } else {
                            $FMVHigh = $result1['FMV_high'];
                        }
                        if ($result1['percent_FMV'] == 'null' || $result1['percent_FMV'] == '') {
                            $percentFMV = '-------';
                        } else {
                            $percentFMV = $result1['percent_FMV'];
                        }
                        if ($result1['site_justification'] == 'null' || $result1['site_justification'] == '') {
                            $SiteJustification = '-------';
                        } else {
                            $SiteJustification = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['site_justification']));
                        }
                        if ($result1['any_other_details'] == 'null' || $result1['any_other_details'] == '') {
                            $AnyOtherDetails = '-------';
                        } else {
                            $AnyOtherDetails = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['any_other_details']));
                        }
                        if ($result1['manager_action_date'] == 'null' || $result1['manager_action_date'] == '') {
                            $actionDate = '-------';
                        } else {
                            $actionDate = $result1['manager_action_date'];
                        }
                        if ($result1['type_issues'] == '0') {
                            $issue = '';
                        } else {
                            $issue = "-" . $result1['type_issues'];
                        }

                        $sitename = str_replace(',', '-', $result1['sitename']);
                        $rtype = $result1['request_number'] . "-" . $result1['protocol_number'] . "-" . $sitename;

                        $raisedBy = $result1['raisedBy_first_name'] . " " . $result1['raisedBy_last_name'];
                        $actionTakenBy = $result1['actionTakenBy_first_name'] . " " . $result1['actionTakenBy_last_name'];
                        $escalatedTo = $result1['legal_first_name'] . " " . $result1['legal_last_name'];
                        $data[] = array("Request Type" => $rtype, "Country Name" => $result1['country_name'], "Issue" => $issue_type . "" . $issue, "Raised By" => $raisedBy, "Raised on" => $result1['create_date'], "Manager Action Desc" => $managerActionDesc, "Action Taken By" => $actionTakenBy, "Escalated to" => $escalatedTo, "Action Date" => $actionDate, "Resolution Date" => $resolution_date, "Manager Action" => $ManagerAction, "Legal/Other Action" => $LegalAction, "Latest Description By COE" => $LatestDescriptionByCOE, "Type Contract Language" => $typecontractlanguage, "Proposed Language" => $ProposedLanguage, "Site Rationale" => $SiteRationale, "Attempts Negotiate" => $AttemptsNegotiate, "FMV High" => $FMVHigh, "percent_FMV" => $percentFMV, "Site Justification" => $SiteJustification, "Any Other Details" => $AnyOtherDetails, "Legal Action Desc" => $legalActionDesc);
                    }
                    // file name for download
                    $fileName = "exportmanager.xls";
                    // headers for download
                    header("Content-Disposition: attachment; filename=\"$fileName\"");
                    header("Content-Type: application/vnd.ms-excel");
                    $flag = false;
                    foreach ($data as $row) {
                        if (!$flag) {
                            // display column names as first row
                            echo implode("\t", array_keys($row)) . "\n";
                            $flag = true;
                        }
                        // filter data
                        $row = str_replace('', '', $row);
                        echo implode("\t", array_values($row)) . "\n";
                    }
                }
            }
        }die;
    }

    /**
     * Function for Export Excel For Legal
     * @param type $data
     */
    public function ExportExcelLegal($data) {
        $manvalues = array($data['legal_id']);
        $checkdata = $this->_funcObject->checkData($manvalues);

        if ($checkdata == 0) {
            //coe request for Language escalation on the basis of cro id ( User ID )
            $sql = "SELECT coe_language_escalation.issue_id as request_number, coe_issue_status.*, coe_language_escalation.*, legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                    action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name FROM `coe_language_escalation` LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_language_escalation.issue_id LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id LEFT JOIN coe_users as action_taken ON coe_issue_status.legal_action_id=action_taken.user_id WHERE coe_issue_status.`legal_user_id`=?";
            $bindparams = array($data['legal_id']);
            $result = $this->_funcObject->sqlQuery($sql, $bindparams);

            //coe request for Budget escalation on the basis of cro id ( User ID )
            $sql = "SELECT coe_budget_escalation.issue_id as request_number, coe_issue_status.*, coe_budget_escalation.*, legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                    action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name FROM `coe_budget_escalation` LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_budget_escalation.issue_id LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id LEFT JOIN coe_users as action_taken ON coe_issue_status.legal_action_id=action_taken.user_id WHERE coe_issue_status.`legal_user_id`=?";
            $result1 = $this->_funcObject->sqlQuery($sql, $bindparams);

            //coe request for Budget escalation on the basis of cro id ( User ID )
            $sql = "SELECT coe_icf_escalation.issue_id as request_number, coe_issue_status.*, coe_icf_escalation.*, legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                    action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name FROM `coe_icf_escalation` LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_icf_escalation.issue_id LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id LEFT JOIN coe_users as action_taken ON coe_issue_status.legal_action_id=action_taken.user_id WHERE coe_issue_status.`legal_user_id`=?";
            $result2 = $this->_funcObject->sqlQuery($sql, $bindparams);

            $arrayCombine = array_merge_recursive($result, $result1, $result2);

            $arraySortDesc = array();
            if (!empty($arrayCombine)) {
                foreach ($arrayCombine['data'] as $key => $value) {
                    $arraySortDesc[$value['request_number']] = $value;
                }
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
                            manager.first_name as escalation_first_name, manager.last_name as escalation_last_name,
                            user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name
                            FROM `coe_escalation_request`
                            LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                            LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                            LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                            LEFT JOIN coe_users as manager ON coe_escalation_request.escalation_manager_id=manager.user_id
                            LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                            WHERE coe_escalation_request.request_id=?";
                    $bindparams = array($value['request_id']);
                    $result1 = $this->_funcObject->sqlQuery($sql, $bindparams);
                    $arrayCombine = array_merge($value, $result1['data'][0]);

                    $finalArray[$i] = $arrayCombine;
                    $i++;
                }
            }

            $count = (int) count($finalArray);
            if ($count > 0) {
                $data = array();
                if (!empty($finalArray)) {
                    foreach ($finalArray as $result1) {

                        if ($result1['escalation_type_id'] == 1) {
                            $issue_type = 'Budget' . " - " . $result1['choose_an_issue'];
                        } elseif ($result1['escalation_type_id'] == 2) {
                            $issue_type = 'Contract' . " - " . $result1['type_contract_language'];
                        } elseif ($result1['escalation_type_id'] == 4) {
                            $issue_type = 'ICF' . " - ";

                            if ($result1['escalation_sub_type_id'] == 1) {
                                $issue_type .= "Global Master";
                            } elseif ($result1['escalation_sub_type_id'] == 2) {
                                $issue_type .= "Country Level";
                            } else {
                                $issue_type .= "Site Level";
                            }
                        } else {
                            $issue_type = '-------';
                        }

                        if ($result1['legal_action_desc'] == 'null' && $result1['manager_action_desc'] == 'null') {
                            $LatestDescriptionByCOE = "-------";
                        } elseif ($result1['legal_action_desc'] == 'null') {
                            $LatestDescriptionByCOE = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['manager_action_desc']));
                        } else {
                            $LatestDescriptionByCOE = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['legal_action_desc']));
                        }
                        if ($result1['manager_action'] == 1) {
                            $ManagerAction = 'Pending';
                        } elseif ($result1['manager_action'] == 2) {
                            $ManagerAction = 'Approved';
                        } elseif ($result1['manager_action'] == 3) {
                            $ManagerAction = 'Denied';
                        } elseif ($result1['manager_action'] == 4) {
                            $ManagerAction = 'Negotiation';
                        } elseif ($result1['manager_action'] == 5) {
                            $ManagerAction = 'Escalated';
                        } elseif ($result1['manager_action'] == 6) {
                            $ManagerAction = 'Approved With Negotiation';
                        } elseif ($result1['manager_action'] == 7) {
                            $ManagerAction = 'On Hold';
                        } elseif ($result1['manager_action'] == 8) {
                            $ManagerAction = 'Reassign';
                        } elseif ($result1['manager_action'] == 9) {
                            $ManagerAction = 'Closed';
                        } else {
                            $ManagerAction = '-------';
                        }

                        if ($result1['legal_action'] == 1) {
                            $LegalAction = 'Pending';
                        } elseif ($result1['legal_action'] == 2) {
                            $LegalAction = 'Approved';
                        } elseif ($result1['legal_action'] == 3) {
                            $LegalAction = 'Denied';
                        } elseif ($result1['legal_action'] == 4) {
                            $LegalAction = 'Approved with modification';
                        } elseif ($result1['legal_action'] == 5) {
                            $LegalAction = 'Pending-OC';
                        } elseif ($result1['manager_action'] == 6) {
                            $ManagerAction = 'On Hold';
                        } elseif ($result1['manager_action'] == 7) {
                            $ManagerAction = 'Reassign';
                        } elseif ($result1['manager_action'] == 8) {
                            $ManagerAction = 'Closed';
                        } else {
                            $LegalAction = '-------';
                        }



                        if ($result1['legal_action_desc'] == 'null' || $result1['legal_action_desc'] == '') {
                            $legalActionDesc = '-------';
                        } else {
                            $legalActionDesc = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['legal_action_desc']));
                        }
                        if ($result1['manager_action_desc'] == 'null' || $result1['manager_action_desc'] == '') {
                            $managerActionDesc = '-------';
                        } else {
                            $managerActionDesc = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['manager_action_desc']));
                        }

                        if ($result1['resolution_date'] == '' || $result1['resolution_date'] == '0000-00-00 00:00:00') {
                            $resolution_date = '-------';
                        } else {
                            $resolution_date = $result1['resolution_date'];
                        }

                        if ($result1['type_contract_language'] == 'null' || $result1['type_contract_language'] == '') {
                            $typecontractlanguage = '-------';
                        } else {
                            $typecontractlanguage = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['type_contract_language']));
                        }

                        if ($result1['proposed_language'] == 'null' || $result1['proposed_language'] == '') {
                            $ProposedLanguage = '-------';
                        } else {
                            $ProposedLanguage = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['proposed_language']));
                        }
                        if ($result1['site_rationale'] == 'null' || $result1['site_rationale'] == '') {
                            $SiteRationale = '-------';
                        } else {
                            $SiteRationale = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['site_rationale']));
                        }

                        if ($result1['attempts_negotiate'] == 'null' || $result1['attempts_negotiate'] == '') {
                            $AttemptsNegotiate = '------';
                        } else {
                            $AttemptsNegotiate = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['attempts_negotiate']));
                        }

                        if ($result1['FMV_high'] == 'null' || $result1['FMV_high'] == '') {
                            $FMVHigh = '-------';
                        } else {
                            $FMVHigh = $result1['FMV_high'];
                        }
                        if ($result1['percent_FMV'] == 'null' || $result1['percent_FMV'] == '') {
                            $percentFMV = '-------';
                        } else {
                            $percentFMV = $result1['percent_FMV'];
                        }
                        if ($result1['site_justification'] == 'null' || $result1['site_justification'] == '') {
                            $SiteJustification = '-------';
                        } else {
                            $SiteJustification = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['site_justification']));
                        }
                        if ($result1['any_other_details'] == 'null' || $result1['any_other_details'] == '') {
                            $AnyOtherDetails = '-------';
                        } else {
                            $AnyOtherDetails = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['any_other_details']));
                        }
                        if ($result1['manager_action_date'] == 'null' || $result1['manager_action_date'] == '') {
                            $actionDate = '-------';
                        } else {
                            $actionDate = $result1['manager_action_date'];
                        }
                        if ($result1['type_issues'] == '0') {
                            $issue = '';
                        } else {
                            $issue = "-" . $result1['type_issues'];
                        }

                        $sitename = str_replace(',', '-', $result1['sitename']);
                        $rtype = $result1['request_number'] . "-" . $result1['protocol_number'] . "-" . $sitename;
                        $escalatedBy = $result1['escalation_first_name'] . " " . $result1['escalation_last_name'];
                        $escalatedOn = $result1['insert_date'];
                        $raisedBy = $result1['raisedBy_first_name'] . " " . $result1['raisedBy_last_name'];
                        $actionTakenBy = $result1['actionTakenBy_first_name'] . " " . $result1['actionTakenBy_last_name'];
                        $escalatedTo = $result1['legal_first_name'] . " " . $result1['legal_last_name'];
                        $data[] = array("Request Type" => $rtype, "Country Name" => $result1['country_name'], "Issue" => $issue_type . " " . $issue, "Raised on" => $result1['create_date'], "Escalated By" => $escalatedBy, "Escalated On" => $escalatedOn, "Description By Escalated Manager" => $managerActionDesc, "Description By Legal" => $legalActionDesc, "Action Taken By" => $actionTakenBy, "Resolution Date" => $resolution_date, "Manager Action" => $ManagerAction, "Legal/Other Action" => $LegalAction, "Latest Description By COE" => $LatestDescriptionByCOE, "Type Contract Language" => $typecontractlanguage, "Proposed Language" => $ProposedLanguage, "Site Rationale" => $SiteRationale, "Attempts Negotiate" => $AttemptsNegotiate, "FMV High" => $FMVHigh, "percent_FMV" => $percentFMV, "Site Justification" => $SiteJustification, "Any Other Details" => $AnyOtherDetails);
                    }

                    // file name for download
                    $fileName = "exportlegal.xls";
                    // headers for download
                    header("Content-Disposition: attachment; filename=\"$fileName\"");
                    header("Content-Type: application/vnd.ms-excel");
                    $flag = false;
                    foreach ($data as $row) {
                        if (!$flag) {
                            // display column names as first row
                            echo implode("\t", array_keys($row)) . "\n";
                            $flag = true;
                        }
                        // filter data
                        $row = str_replace('', '', $row);
                        echo implode("\t", array_values($row)) . "\n";
                    }
                }
            }
        }die;
    }

    /**
     * Function for View Request Numbers Export Excel
     * @param type $data
     */
    public function viewRequestNumbersExport($data) {
        $manvalues = array($data['requestNumbers']);
        $checkdata = $this->_funcObject->checkData($manvalues);
        $icfForms = array('1' => 'Global Master', '2' => 'Country Level', '3' => 'Site Level');
        if ($checkdata === 0) {

            //coe request for Budget escalation on the basis of request numbers
            $sql = "SELECT  coe_issues_types.issue as choose_an_issue_name, coe_escalation_request.raised_by, coe_escalation_request.principle_investigator, coe_escalation_request.escalation_sub_type_id,
                    coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name, 
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_budget_escalation.*, coe_budget_escalation.issue_id as request_number,
                    coe_issue_status.*, 1 as escalation_type_id,
                    user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                    action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name
                    FROM `coe_escalation_request`
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                    LEFT JOIN coe_budget_escalation ON coe_escalation_request.request_id=coe_budget_escalation.request_id
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_budget_escalation.issue_id
                    LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                    LEFT JOIN coe_users as action_taken ON coe_issue_status.manager_action_id=action_taken.user_id
                    LEFT JOIN coe_issues_types ON coe_budget_escalation.choose_an_issue=coe_issues_types.id
                    WHERE coe_budget_escalation.issue_id IN (" . $data['requestNumbers'] . ") && coe_escalation_request.escalation_type_id=1";
            $bindparams = array();
            $result = $this->_funcObject->sqlQuery($sql, $bindparams);

            //coe request for contract language escalation on the basis of request numbers
            $sql1 = "SELECT coe_issues_types.issue as choose_an_issue_name, coe_escalation_request.raised_by, coe_escalation_request.principle_investigator, coe_escalation_request.escalation_sub_type_id,
                    coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name, 
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_language_escalation.*, coe_language_escalation.issue_id as request_number,
                    coe_issue_status.*, 2 as escalation_type_id,
                    user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                    action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name
                    FROM `coe_escalation_request`
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                    LEFT JOIN coe_language_escalation ON coe_escalation_request.request_id=coe_language_escalation.request_id
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_language_escalation.issue_id
                    LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                    LEFT JOIN coe_users as action_taken ON coe_issue_status.manager_action_id=action_taken.user_id
                    LEFT JOIN coe_issues_types ON coe_language_escalation.type_issues=coe_issues_types.id
                    WHERE coe_language_escalation.issue_id IN (" . $data['requestNumbers'] . ") && coe_escalation_request.escalation_type_id=2";
            $result1 = $this->_funcObject->sqlQuery($sql1, $bindparams);

            //coe request for ICF escalation on the basis of request numbers
            $sql2 = "SELECT coe_escalation_request.raised_by, coe_escalation_request.principle_investigator, 					  	coe_escalation_request.escalation_sub_type_id,
                    coe_users.first_name as escalation_first_name, coe_users.last_name as escalation_last_name, 
                    coe_protocol_numbers.protocol_id ,coe_protocol_numbers.protocol_number, 
                    coe_sitenames.sitename_id, coe_sitenames.sitename, 
                    coe_countries.country_id, coe_countries.country_name,
                    coe_icf_escalation.*, coe_icf_escalation.issue_id as request_number,
                    coe_issue_status.*, 4 as escalation_type_id,
                    user.first_name as raisedBy_first_name, user.last_name as raisedBy_last_name,
                    legal.first_name as legal_first_name, legal.last_name as legal_last_name,
                    action_taken.first_name as actionTakenBy_first_name, action_taken.last_name as actionTakenBy_last_name
                    FROM `coe_escalation_request`
                    LEFT JOIN coe_protocol_numbers ON coe_escalation_request.protocol_id=coe_protocol_numbers.protocol_id
                    LEFT JOIN coe_sitenames ON coe_escalation_request.sitename=coe_sitenames.sitename_id
                    LEFT JOIN coe_countries ON coe_escalation_request.country_id=coe_countries.country_id
                    LEFT JOIN coe_users as user ON coe_escalation_request.user_id=user.user_id
                    LEFT JOIN coe_icf_escalation ON coe_escalation_request.request_id=coe_icf_escalation.request_id
                    LEFT JOIN coe_issue_status ON coe_issue_status.issue_id=coe_icf_escalation.issue_id
                    LEFT JOIN coe_users ON coe_issue_status.escalation_manager_id=coe_users.user_id
                    LEFT JOIN coe_users as legal ON coe_issue_status.legal_user_id=legal.user_id
                    LEFT JOIN coe_users as action_taken ON coe_issue_status.manager_action_id=action_taken.user_id
                    WHERE coe_icf_escalation.issue_id IN (" . $data['requestNumbers'] . ") && coe_escalation_request.escalation_type_id=4";
            $result2 = $this->_funcObject->sqlQuery($sql2, $bindparams);

            $arrayCombine = array_merge_recursive($result, $result1, $result2);

            $count = (int) count($arrayCombine['data']);
            if ($count > 0) {

                $data = array();
                if (!empty($arrayCombine)) {
                    foreach ($arrayCombine['data'] as $result1) {

                        if ($result1['escalation_type_id'] == 1) {
                            $issue_type = 'Budget - ' . strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['choose_an_issue_name']));
                        } elseif ($result1['escalation_type_id'] == 2) {
                            $issue_type = 'Contract - ' . strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['type_contract_language'])) . ' - ' . $result1['choose_an_issue_name'];
                        } elseif ($result1['escalation_type_id'] == 4) {
                            $issue_type = 'ICF - ' . strip_tags(preg_replace("/\s|&nbsp;/", ' ', $icfForms[$result1['escalation_sub_type_id']]));
                        }

                        if ($result1['legal_action_desc'] == 'null' && $result1['manager_action_desc'] == 'null') {
                            $LatestDescriptionByCOE = "-------";
                        } elseif ($result1['legal_action_desc'] == 'null') {
                            //$LatestDescriptionByCOE = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['manager_action_desc']));
                        } else {
                            $LatestDescriptionByCOE = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['legal_action_desc']));
                        }
                        if ($result1['manager_action'] == 1) {
                            $ManagerAction = 'Pending';
                        } elseif ($result1['manager_action'] == 2) {
                            $ManagerAction = 'Approved';
                        } elseif ($result1['manager_action'] == 3) {
                            $ManagerAction = 'Denied';
                        } elseif ($result1['manager_action'] == 4) {
                            $ManagerAction = 'Negotiation';
                        } elseif ($result1['manager_action'] == 5) {
                            $ManagerAction = 'Escalated';
                        } elseif ($result1['manager_action'] == 6) {
                            $ManagerAction = 'Approved With Negotiation';
                        } else {
                            $ManagerAction = '-------';
                        }

                        if ($result1['legal_action'] == 1) {
                            $LegalAction = 'Pending';
                        } elseif ($result1['legal_action'] == 2) {
                            $LegalAction = 'Approved';
                        } elseif ($result1['legal_action'] == 3) {
                            $LegalAction = 'Denied';
                        } else {
                            $LegalAction = '-------';
                        }
                        if ($result1['legal_action_desc'] == 'null' || $result1['legal_action_desc'] == '') {
                            $legalActionDesc = '-------';
                        } else {
                            $legalActionDesc = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['legal_action_desc']));
                        }
                        if ($result1['manager_action_desc'] == 'null' || $result1['manager_action_desc'] == '') {
                            $managerActionDesc = '-------';
                        } else {
                            $managerActionDesc = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['manager_action_desc']));
                        }

                        if ($result1['resolution_date'] == '' || $result1['resolution_date'] == '0000-00-00 00:00:00') {
                            $resolution_date = '-------';
                        } else {
                            $resolution_date = $result1['resolution_date'];
                        }

                        if ($result1['proposed_language'] == 'null' || $result1['proposed_language'] == '') {
                            $ProposedLanguage = '-------';
                        } else {
                            $ProposedLanguage = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['proposed_language']));
                        }
                        if ($result1['site_rationale'] == 'null' || $result1['site_rationale'] == '') {
                            $SiteRationale = '-------';
                        } else {
                            $SiteRationale = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['site_rationale']));
                        }

                        if ($result1['attempts_negotiate'] == 'null' || $result1['attempts_negotiate'] == '') {
                            $AttemptsNegotiate = '------';
                        } else {
                            $AttemptsNegotiate = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['attempts_negotiate']));
                        }

                        if ($result1['FMV_high'] == 'null' || $result1['FMV_high'] == '') {
                            $FMVHigh = '-------';
                        } else {
                            $FMVHigh = $result1['FMV_high'];
                        }
                        if ($result1['percent_FMV'] == 'null' || $result1['percent_FMV'] == '') {
                            $percentFMV = '-------';
                        } else {
                            $percentFMV = $result1['percent_FMV'];
                        }
                        if ($result1['site_justification'] == 'null' || $result1['site_justification'] == '') {
                            $SiteJustification = '-------';
                        } else {
                            $SiteJustification = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['site_justification']));
                        }
                        if ($result1['any_other_details'] == 'null' || $result1['any_other_details'] == '') {
                            $AnyOtherDetails = '-------';
                        } else {
                            $AnyOtherDetails = strip_tags(preg_replace("/\s|&nbsp;/", ' ', $result1['any_other_details']));
                        }
                        if ($result1['manager_action_date'] == 'null' || $result1['manager_action_date'] == '') {
                            $actionDate = '-------';
                        } else {
                            $actionDate = $result1['manager_action_date'];
                        }

                        $sitename = str_replace(',', '-', $result1['sitename']);
                        $rtype = $result1['request_number'] . "-" . $result1['protocol_number'] . "-" . $sitename;

                        $raisedBy = $result1['raisedBy_first_name'] . " " . $result1['raisedBy_last_name'];
                        $actionTakenBy = $result1['actionTakenBy_first_name'] . " " . $result1['actionTakenBy_last_name'];
                        //$escalatedTo = $result1['legal_first_name'] . " " . $result1['legal_last_name'];
                        $escalationName = $result1['escalation_first_name'] . " " . $result1['escalation_last_name'];
                        //$data[] = array("Request Type" => $rtype, "Country Name" => $result1['country_name'], "Issue" => $issue_type . " - " . $result1['type_contract_language'] . "" . $issue, "Raised By" => $raisedBy, "Raised on" => $result1['create_date'], "Manager Action Desc" => $managerActionDesc, "Action Taken By" => $actionTakenBy, "Escalated to" => $escalatedTo, "Action Date" => $actionDate, "Resolution Date" => $resolution_date, "Manager Action" => $ManagerAction, "Legal/Other Action" => $LegalAction, "Latest Description By COE" => $LatestDescriptionByCOE, "Type Contract Language" => $typecontractlanguage, "Proposed Language" => $ProposedLanguage, "Site Rationale" => $SiteRationale, "Attempts Negotiate" => $AttemptsNegotiate, "FMV High" => $FMVHigh, "percent_FMV" => $percentFMV, "Site Justification" => $SiteJustification, "Any Other Details" => $AnyOtherDetails, "Legal Action Desc" => $legalActionDesc);
                        $data[] = array("Request Type" => $rtype, "Country Name" => $result1['country_name'], "Issue" => $issue_type, "Escalation Manager" => $escalationName, "Raised By" => $raisedBy, "Requested By" => $result1['raised_by'], "Principle Investigator" => $result1['principle_investigator'], "Raised on" => $result1['create_date'], "Manager Action Desc" => $managerActionDesc, "Action Taken By" => $actionTakenBy, "Action Date" => $actionDate, "Resolution Date" => $resolution_date, "Manager Action" => $ManagerAction, "Legal/Other Action" => $LegalAction, "Latest Description By COE" => $LatestDescriptionByCOE, "Type Contract Language" => $typecontractlanguage, "Proposed Language" => $ProposedLanguage, "Site Rationale" => $SiteRationale, "Attempts Negotiate" => $AttemptsNegotiate, "FMV High" => $FMVHigh, "percent_FMV" => $percentFMV, "Legal Action Desc" => $legalActionDesc);
                    }

                    // file name for download
                    $fileName = "export_" . date('Y-m-d') . ".xls";

                    // headers for download
                    header("Content-Disposition: attachment; filename=\"$fileName\"");
                    header("Content-Type: application/vnd.ms-excel");
                    $flag = false;
                    foreach ($data as $row) {
                        if (!$flag) {
                            // display column names as first row
                            echo implode("\t", array_keys($row)) . "\n";
                            $flag = true;
                        }
                        // filter data
                        $row = str_replace('', '', $row);
                        echo implode("\t", array_values($row)) . "\n";
                    }
                }
            } else {
                $response['json_data']['message'] = "Not Found!";
                $response['json_data']['response'] = 0;
            }
        }
        die;
    }

}
