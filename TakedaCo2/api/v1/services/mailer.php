<?php
require '../php_mailer/class.phpmailer.php';
class MAILER {

    /**
     * send email function
     * @param type $to
     * @param type $subject
     * @param type $emailBody
     * @param type $cc
     * @return int
     */
    public static function sendMail($to, $subject, $emailBody, $cc = "") {
        //require_once('../PHPMailer/PHPMailerAutoload.php');
        
        $mail = new PHPMailer; //New instance, with exceptions enabled

        $from = "coe@takeda.com";

        $mail->IsSMTP(true); // SMTP
        $mail->set('X-MSMail-Priority', 'Normal');
        $mail->addCustomHeader("X-Priority: 3");
        $mail->SMTPAuth = true;  // SMTP authentication
        $mail->IsHTML(true);
        $mail->Mailer = "smtp";
        $mail->Host = "tls://smtp.gmail.com";
        $mail->Port = 465;
        $mail->Username = "coec2app@gmail.com";
        $mail->Password = "Takeda123";

        $mail->From = $from;
        $mail->FromName = "COE Clinical Contract Communicator App";
        $mail->addReplyTo($from, 'Reply to');
        $mail->AddAddress($to);

        foreach (explode(';', $cc) as $ccUnique) {
            $mail->AddCC($ccUnique);
        }

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->MsgHTML($emailBody);
        $mail->AltBody = "This is the plain text version of the email content";

        if (!$mail->send()) {
            return 0;
        } else {
            return 1;
        }
    }

}

?>
