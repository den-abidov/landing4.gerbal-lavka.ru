<?php
  // получи содержимое файла

  // вариант 1 : не работает
  // $file_url = './settings/config.json';
  // $str = file_get_contents($file_url);

  // вариант 2 : не работает
  // require_once("Helper.php");
  // $str = Helper::readFile($file_url);
  // $str = file_get_contents($file_url);

  // вариант 3 : через dirname()
  $file_url = dirname( __DIR__ , 2 ).'/settings/config.json';
  $str = file_get_contents($file_url);

  echo $str;
