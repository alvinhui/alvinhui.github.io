<?php
    header("Content-Type: text/plain");   
    echo <<<EOF
Name: {$_POST['name']}
Age: {$_POST['age']}
EOF;
?>