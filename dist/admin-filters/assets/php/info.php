<?php

require_once("Helper.php");
require_once("Checker.php");

$checker = new Checker();
$config = $checker->getConfig();

$siteIsOn = $config->{'siteIsOn'} ? "да":"нет";
$mobileOnly = $config->{'mobileOnly'} ? "да":"нет";
$filterIp = $config->{'filterIp'} ? "да":"нет";

$hasAdminKey = $checker->hasAdminKey()?"да":"нет";

$ip = isset($_GET['ip'])?$_GET['ip']:$_SERVER['REMOTE_ADDR'];

//$ip = '178.219.186.12'; // временно

$isAllowedIp = $checker->isAllowedIp($ip)?"да":"нет";
$isBannedIp = $checker->isBannedIp($ip)?"да":"нет";

$isMobile = $checker->isMobile()?"да":"нет";

$host = gethostbyaddr($ip);

$bot = $checker->isBotIp($ip)?"да":"нет";

require_once('getAddressFromIP.php');
$addressObj = getAddressFromIP($ip);
$ip_address = convertAddressToString($addressObj);
$country = getCountryFrom($addressObj);
$region = getRegionFrom($addressObj);
$city = getCityFrom($addressObj);

$bannedLocation = $checker->isBannedLocation($ip)?"да":"нет";

// Следующие значения расчитываются и сохраняются в route.php.
// Поэтому, перед тем, как открывать info.php, открой какую-либо страницу, например test.php,
// где исполняется route.php
$passed = Helper::getFromSession('passed');
if($passed === null)
{
  $passed = "не просчитано";
}
else
{
  $passed = $passed?"да":"нет";
}

$failed_check = Helper::getFromSession('failed_check');
if($failed_check === null)
{
  $failed_check = "не просчитано";
}