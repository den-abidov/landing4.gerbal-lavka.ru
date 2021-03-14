<?php
/**
 * Получает из JS-скрипта id устройства (device_id) и проверяет : устройство находится в запрещённом списке или нет.
 * Варианты ответа скрипта :
 * 1. Если устройство находится в запрещённом списке - выдаёт 'banned'.
 * JS, получив ответ 'banned' должен сделать переадресацию на 404.html
 * 2. Если устройства нет в запрещённом списке (= не запрещено), то ничего не делай.
 */

$device_id = $_GET['deviceId']; // из check-device-id.js

require_once('Helper.php');
require_once('Checker.php');

$checker = new Checker();

$device_is_banned = $checker->isBannedDevice($device_id);

// 1. Устройство запрещено
if($device_is_banned)
{
  exit("banned");
}

// 2. Устройство НЕ запрещено
exit("Устройство разрешено.");