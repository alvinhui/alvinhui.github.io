<?php
    header("Content-Type: text/plain");
    //you can download a PHP JSON parser from http://pecl.php.net/package/json
    //PHP 5.2 has native JSON support
    
    $jsonData = $GLOBALS['HTTP_RAW_POST_DATA'];
    
?>
Contact Saved: <?php echo $jsonData ?>