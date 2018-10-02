<p>Hello World</p>

<?php
if ($argc !== 2) { 
    echo "Usage: php hello.php [name].\n";
    exit(1);
}

echo "louise here\n";
$name = $argv[1];
echo "hi there, $name\n";
?>
