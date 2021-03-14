<?php

// на базе route.php

$ip = $_SERVER['REMOTE_ADDR'];

require_once('Helper.php');
require_once('Checker.php');

$checker = new Checker();

$bot = $checker->isBotIp($ip);

if($bot === true)
{
  // do nothing
}
else
{
  redirect();
}

/**
 * Перенаправление на сайт, указанный в файле.
 */
function redirect()
{
  // считай название сайта для редиректа из файла
  $file_url = Helper::pathToSettingsFolder()."redirect-to-site.txt";
  $redirect_site_name = Helper::readFile($file_url);

  if($redirect_site_name === null || strlen($redirect_site_name) === 0)
  {
    // если нет файла или он пуст, просто выйди
    return;
  }

  // файла есть и он не пуст...

  // полный url текущей страницы, вместе с параметрами, но без хоста (имени сайта)
  $uri = $_SERVER['REQUEST_URI'];
  // а это параметры со значением : часть url после ?
  // $query = $_SERVER['QUERY_STRING'];

  // полный путь, куда сделать редирект
  $redirect_url = "https://$redirect_site_name".$uri;
  // редирект на Javascript
  echo "<script>window.location.href = '$redirect_url';</script>";
  // справка : what status code is what : https://www.rapidtables.com/web/dev/url-redirect.html
  exit();
}
