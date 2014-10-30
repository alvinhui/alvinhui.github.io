<?php
    header("Content-Type: text/plain");
    
    echo <<<EOF
Name: {$_GET['name']}
Age: {$_GET['age']}
EOF;
?>