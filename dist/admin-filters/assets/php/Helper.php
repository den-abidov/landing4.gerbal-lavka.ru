<?php

/**
 * Class Helper Вспомогательные методы.
 */
class Helper
{
  /**
   * @param $file string Путь к файлу. Например : ./settings/allowed-ips.txt
   * @return false|string Содержимое указанного файла
   */
    public static function readFile(string  $file)
    {
      // ОСТОРОЖНО : Вернёт null, если файла нет. Ты этого хочешь ?
      return file_exists($file)?file_get_contents($file):null;

      // А так, без проверки file_exists, если файла нет, выдаст Warning file not found
      // return file_get_contents($file);
    }

  /**
   * @param $data string Данные в виде нескольких строк
   * @return array Данные в виде массива
   */
    public static function convertMultilineToArray(string $data):array
    {
        $array = explode("\n",$data);
        // каждый элемент этого массива может содержать разделительные символы
        // поэтому нужно убрать их из каждого элемента массива
        foreach($array as &$value)
        {
          $value = str_replace("\r","",$value);
        }
        return $array;
    }

  /**
   * @param $data string Данные в виде JSON-объекта
   * @return object PHP-объект, stdClass
   */
    public static function convertToObject(string $data):object
    {
      return json_decode($data);
    }

  /**
   * Редирект на 404.html
   */
    public static function redirect404()
    {
      // редирект на PHP
      // header("Location: 404.html", true, 200); выдаёт ошибку
      // поэтому редирект на Javascript
      echo "<script>window.location.href = '404.html';</script>";
      // справка : what status code is what : https://www.rapidtables.com/web/dev/url-redirect.html
      exit();
    }

  /**
   * @param string $s "false" или "true"
   * @return bool false или true
   */
    public static function string2bool(string $s):bool
    {
      $result = null;
      if(strtoupper($s)=="TRUE") $result = true;
      if(strtoupper($s)=="FALSE") $result = false;
      return $result;
    }

  /**
   * @param $bool bool false или true
   * @return string "false" или "true"
   */
    public static function bool2string(bool $bool):string
    {
      return( $bool===true)?"true":"false";
    }

  /**
   * @param $int 0 или 1
   * @return bool false или true
   */
    public static function int2bool($int):bool
    {
      $result = null;

      if($int === 1) $result = true;
      if($int === 0) $result = false;

      return $result;
    }

  /**
   * @param string $key Имя переменной в сессии = массиве $_SESSION
   * @return mixed|null Если такой переменной нет, вернёт null. Иначе - её значение.
   */
    public static function getFromSession(string $key)
    {
      // ОШИБКА 500 !!!
      // return array_key_exists($key, $_SESSION)?$_SESSION[$key]:null;
      // Этот вид сокращённый вид записи вызывал ошибку 500, поэтому пришлось "расписывать" код полнее :
      $value = null;
      if(array_key_exists($key, $_SESSION))
      {
        $value = $_SESSION[$key];
      }
      return $value;
    }

    public static function appendToFile(string $what):void
    {
      $file = "./assets/php/log.txt";
      $current = file_get_contents($file);
      $current .= $what."\n";
      file_put_contents($file, $current);
    }

    public static function getSiteName():string
    {
      $file_url = self::pathToSettingsFolder().'site-name.txt';
      $site_name = Helper::readFile($file_url);
      return $site_name ?: 'незвание сайта не задано';
    }

    public static function getIpAddress(string $ip)
    {
      require_once("getAddressFromIP.php");
      $address = getAddressFromIP($ip);
      return $address;
    }

    public static function getIpAddressFromSessionOrRequest(string $ip)
    {
      require_once("getAddressFromIP.php");

      // Проверь : есть ли в сессии значение 'ip_address' ?
      // Если есть - верни это значение из сессии.
      // Если нет - запроси у внешнего сервиса через функцию getAddressFromIP($ip)
      // а потом сохрани полученное значение в сессию.

      $address = null; // 'Helper.php@getIpAddressFromSessionOrRequest() не нашёл адреса.';

      if(self::getFromSession("address") !== null)
      {
        $address = self::getFromSession("address");
      }
      else
      {
        // адрес в формате многомерного массива
        $address = getAddressFromIP($ip);

        // конвертация адресного массива => строка
        // $address_string = getAddressFrom($address);

        // сохрани в сессию
        $_SESSION["address"] = $address;
      }

      return $address;
    }

  /**
   * @return string Путь к папке settings, где лежат все файлы настроек.
   */
    public static function pathToSettingsFolder():string
    {
       $path = dirname( __DIR__ , 2 ).'/settings/';
       return $path;
    }
}