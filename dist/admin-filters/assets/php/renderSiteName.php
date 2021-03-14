<?php

/* РАБОТАЮЩИЙ КОД
$file_url = './settings/site-name.txt';
require_once("Helper.php");
$site_name = Helper::readFile($file_url);
echo $site_name;
*/

require_once("Helper.php");
echo Helper::getSiteName();