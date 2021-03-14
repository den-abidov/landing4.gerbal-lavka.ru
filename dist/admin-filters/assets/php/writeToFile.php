<?php
    $content = $_GET["content"];
    $file_url = dirname( __DIR__ , 2 ).'/settings/config.json';
    $myfile = fopen($file_url, "w") or die("Unable to open file!");
    fwrite($myfile, $content);    
    fclose($myfile);
    echo "Успешно записал ".$content." в файл ".$fileUrl;
?>