   <?php
   
 #ini_set('display_errors', 1); 
 header('Content-type: application/json');
 #require '../php_mailer/class.phpmailer.php';
 //require_once('../PHPMailer/PHPMailerAutoload.php');
  session_start();
 
 class functions {

    private $conn;

    //public $ip_path = "";
    // making a default constructor
    public function __construct() {
        $this->conn = self::dbconnect(); // will call the dbconnect function automatically when the class DAL will be called everytime.
    }

    /*
     * -------------------------------------------------------------------------------
     *  This function is used to execute a query that will be sent by any function of another class.
     *  It will receive two arguments
     *  1. Query String
     *  2. Bind Parameters to execute with the query.
     *  This function will receive the query string and then send that string and parameters to private query function
     *  to get the output response.
     * -------------------------------------------------------------------------------
     */

    public function sqlQuery($query, $bindParams) {
        $output = $this->query($query, $bindParams);
        return $output;
    }

    /**
     * -------------------------------------------------------
     * dbconnect function allows us to connect to the database.
     * Login Username
     * Login Password
     * Server Host name that is mysql host for now.
     * Database name
     * --------------------------------------------------------
     */
    private static function dbconnect() {
      
        
        $serverName = $_SERVER['HTTP_HOST'];
            if($serverName == "localhost"){
                 
                     $login = 'root'; // Login username of server host.
                     $password = 'welcome'; // Password of server host.
                     $dsn = "mysql:host=localhost;dbname=Takeda_C2"; // Set up a DSN for connection with Database TakedaCOE.
            }
            else{
                   $login = 'Takeda'; // Login username of server host.
                   $password = 'T@Ke$@DLC%%Cd@'; // Password of server host.
                   $dsn = "mysql:host=localhost;dbname=Takeda_C2"; // Set up a DSN for connection with Database TakedaCOE.
            }
        
        $opt = array(
            // any occurring errors wil be thrown as PDOException
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            // an SQL command to execute when connecting
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'UTF8'"
        );

        // Making a new PDO conenction.
        $conn = new PDO($dsn, $login, $password, $opt);
        // End Connection and Return to other files.
        

        return $conn; // Returning connection.
    }
    
  
 
    private function query($sql, $bindParams) {
        try {
            $data = $this->conn->prepare($sql); //Prepare SQL query for execution
            $data->execute($bindParams); //Execute query by passing bind parameters
        } catch (Exception $e) {
         
            
            die(json_encode(array(
                'error' => $e->getMessage()
                                 ))); 
      //Stop execution and print the SQL query error in case query does not execute
        }

        if (strpos($sql, 'SELECT') === false) {  //If SQL query is other then SELECT query then return last insert ID
            if(strstr($sql, 'UPDATE') or strstr($sql, 'DELETE'))
            {         
                return $data->rowCount();
            }
            return $this->conn->lastInsertId();
        }


        $res = $data->fetchAll(PDO::FETCH_ASSOC); //Fetch all the data in case SELECT query is executed

        $results = array();

        foreach ($res as $row) {
            foreach ($row as $k => $v) {
                $result[$k] = $v;
            }
            $results['data'][] = $result;
        }
         // return all the results back to called class.
         return $results;
    }

     public function checkData($data = array()) {

        $data = array_map("trim", $data);
        if (in_array("", $data)) {
            
            $response = array();
            $response['json_data']['response'] = 0;
            $response['json_data']['message'] = "Mandatory fields not filled";
            
            die(json_encode($response));
        } else {
            return 0;
        }
    }
   public function traverseArray(&$array, $keys) { 
         foreach ($array as $key => &$value) { 
           if (is_array($value)) { 
             $this->traverseArray($value, $keys); 
           } else {
             if (in_array($key, $keys)){
               unset($array[$key]);
             }
           } 
         }
       }
       
    public function like_query($sql){
    	     try {
    	     	
            $data = $this->conn->prepare($sql); //Prepare SQL query for execution
            $data->execute(); //Execute query by passing bind parameters
            $res = $data->fetchAll(PDO::FETCH_ASSOC);
            return $res;
        } catch (Exception $e) {
         
            
            die(json_encode(array(
                'error' => $e->getMessage()
                                 ))); 
        }
    }
    
 	public function clean_string($string)  
	{  
	$string =preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $string);
	return $string;
        }
        
        public function strip_symbols( $text )
   	{
   		//echo $text;
   		$plus   = '\+\x{FE62}\x{FF0B}\x{208A}\x{207A}';
   		$minus  = '\x{2012}\x{208B}\x{207B}';
   	
   		$units  = '\\x{00B0}\x{2103}\x{2109}\\x{23CD}';
   		$units .= '\\x{32CC}-\\x{32CE}';
   		$units .= '\\x{3300}-\\x{3357}';
   		$units .= '\\x{3371}-\\x{33DF}';
   		$units .= '\\x{33FF}';
   	
   		$ideo   = '\\x{2E80}-\\x{2EF3}';
   		$ideo  .= '\\x{2F00}-\\x{2FD5}';
   		$ideo  .= '\\x{2FF0}-\\x{2FFB}';
   		$ideo  .= '\\x{3037}-\\x{303F}';
   		$ideo  .= '\\x{3190}-\\x{319F}';
   		$ideo  .= '\\x{31C0}-\\x{31CF}';
   		$ideo  .= '\\x{32C0}-\\x{32CB}';
   		$ideo  .= '\\x{3358}-\\x{3370}';
   		$ideo  .= '\\x{33E0}-\\x{33FE}';
   		$ideo  .= '\\x{A490}-\\x{A4C6}';
   	
   		return  preg_replace(
   				array(
   						// Remove modifier and private use symbols.
   						'/[\p{Sk}\p{Co}]/u',
   						// Remove mathematics symbols except + - = ~ and fraction slash
   						'/\p{Sm}(?<![' . $plus . $minus . '=~\x{2044}])/u',
   						// Remove + - if space before, no number or currency after
   						'/((?<= )|^)[' . $plus . $minus . ']+((?![\p{N}\p{Sc}])|$)/u',
   						// Remove = if space before
   						'/((?<= )|^)=+/u',
   						// Remove + - = ~ if space after
   						'/[' . $plus . $minus . '=~]+((?= )|$)/u',
   						// Remove other symbols except units and ideograph parts
   						'/\p{So}(?<![' . $units . $ideo . '])/u',
   						// Remove consecutive white space
   						'/ +/',
   				),
   				' ',
   				$text );
   		
   		//echo $rtext;die;
   	}
   	
	function reArray($tarray){
		$file_ary = array();
		
		$file_count = count($tarray['name']);

		
		for ($i=0; $i<$file_count; $i++) {
			
				$file_ary[$i]['title'] = $tarray['title'][$i];
				$file_ary[$i]['path'] = $tarray['path'][$i];
			
		}
		
		return $file_ary;
	}
        
     
        public function getPasswordSalt(){
            return substr( str_pad( dechex( mt_rand() ), 8, '0', STR_PAD_LEFT ), -8 );
        }

        # calculate the hash from a salt and a password
        public function getPasswordHash( $salt, $password ){
             
            return $salt . ( hash( 'whirlpool', $salt . $password ) );
        }

        # compare a password to a hash
        public function comparePassword( $password, $hash ){
            $salt = substr( $hash, 0, 8 );
            return $hash == $this->getPasswordHash( $salt, $password );
        }

        public function sendMail($to,$subject,$body){

                
                $from = "coe@takeda.com";
                $mail = new PHPMailer();
                $mail->IsSMTP(false); // SMTP
                $mail->set('X-MSMail-Priority', 'Normal');
                $mail->addCustomHeader("X-Priority: 3");
                $mail->From = $from;
                $mail->FromName = "COE Clinical Contract Communicator App";
                $mail->addReplyTo($from, 'Reply to');
                $mail->AddAddress($to);

                $mail->isHTML(true);
                $mail->Subject = $subject;
                $mail->MsgHTML($body);
                $mail->AltBody = "This is the plain text version of the email content";
                
                if($mail->Send())
                return true;
                else
                return false;

        }

}
    ?>
