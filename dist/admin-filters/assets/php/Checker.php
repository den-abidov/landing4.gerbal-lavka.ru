<?php

/**
 * Class Checker Содержит методы для определения того : можно ли показывать сайт посетителю.
 */
class Checker
{
  // Слово-пароль в GET-запросе, админовский "ключик".
  // Если в GET-запрос добавить ?key='show', то показать сайт, несмотря на любые настройки, ip и локации.
  private $admin_key = 'show';

  // путь к файлам настроек. Задаётся в конструкторе.
  private $file_path = '';

  // файлы, хранящие настройки
  private $banned_devices_file = 'banned-devices.txt'; // id-номера забаненых устройств, список запрещённых устройств
  private $allowed_ips_file = 'allowed-ips.txt';// "админовские" ip, ip из "белого" (разрешительного) списка
  private $banned_ips_file = 'banned-ips.txt'; // забаненые ip, ip из "чёрного" (запретительного) списка
  private $banned_locations_file = 'banned-locations.txt';// запрещённые локации : страны, области, города
  private $config_file = 'config.json';// самый важный файл - в нём настройки видимости сайта

  private string $bot_name;

  public function __construct()
  {
    $this->file_path = Helper::pathToSettingsFolder();
  }

  /**
   * @return bool Есть ли "админовский ключик" ?
   */
  public function hasAdminKey():bool
  {
    $given_key = null;
    if(!empty($_REQUEST['key']))
    {
      $given_key = $_REQUEST['key'];
    }
    return $given_key === $this->admin_key;
  }

  /**
   * @param string $device_id
   * @return bool устройство из "чёрного", запретительного списка ?
   */
  public function isBannedDevice(string $device_id):bool
  {
    $file_url = $this->file_path.$this->banned_devices_file;
    $contents = Helper::readFile($file_url);
    $device_ids = Helper::convertMultilineToArray($contents);
    return in_array($device_id, $device_ids);
  }

  /**
   * @param string $ip
   * @return bool ip из "белого", разрешительного списка ?
   */
  public function isAllowedIp(string $ip):bool
  {
    $file_url = $this->file_path.$this->allowed_ips_file;
    $contents = Helper::readFile($file_url);
    $ips = Helper::convertMultilineToArray($contents);
    return in_array($ip, $ips);
  }

  /**
   * @param string $ip
   * @return bool ip из "чёрного", запретительного списка ?
   */
  public function isBannedIp(string $ip):bool
  {
    $file_url = $this->file_path.$this->banned_ips_file;
    $contents = Helper::readFile($file_url);
    $ips = Helper::convertMultilineToArray($contents);
    return in_array($ip, $ips);
  }

  /**
   * @param $ip
   * @return bool Это ip поискового Гугл- или Яндекс-бота ?
   */
  public function isBotIp($ip)
  {
    // Источник : http://www.liamdelahunty.com/tips/php_gethostbyaddr_googlebot.php

    // Получи имя хоста, с которого был заход на сайт.
    // Боты заходят с хостов **googlebot.com, **yandex.ru, **yandex.com, **yandex.net
    $name = gethostbyaddr($ip);

      $this->setBotName($name);

    // поиск слова Googlebot, yandex.ru, yandex.net, yandex.com в имени хоста $name
    // флаг i - регистронезависимый поиск совпадения
    // результат : 1 - совпало, 0 - не совпало.
    $pm1 = preg_match("/Googlebot/i",$name);
    $pm2 = preg_match("/yandex.ru/i",$name);
    $pm3 = preg_match("/yandex.com/i",$name);
    $pm4 = preg_match("/yandex.net/i",$name);

    // полученные 1 и 0 нужно конвертировать в true или false
    $pm1 = Helper::int2bool($pm1);
    $pm2 = Helper::int2bool($pm2);
    $pm3 = Helper::int2bool($pm3);
    $pm4 = Helper::int2bool($pm4);

    // итоговый результат
    $pm = $pm1 OR $pm2 OR $pm3 OR $pm4;

    return $pm;
  }

  /**
   * @param string $host_name название хоста
   * Назначает упрощённое имя бота из названия его хоста
   */
  private function setBotName(string $host_name = '')
  {
      $bot_name = '';

      if(strpos($host_name, 'google') !== false)
      {
        $bot_name = 'Google-бот';
      }
      if(strpos($host_name, 'yandex') !== false)
      {
        $bot_name = 'Яндекс-бот';
      }

      $this->bot_name = $bot_name;
  }

  /**
   * @return string имя бота
   */
  public function getBotName():string
  {
    return $this->bot_name;
  }

  /**
   * @return object Содержимое файла настроек config.json
   */
  public function getConfig():object
  {
    $file_url = $this->file_path.$this->config_file;
    $contents = Helper::readFile($file_url);
    $object = Helper::convertToObject($contents);
    return $object;
  }

  /**
   * @return bool Это мобильное устройство ?
   */
  public function isMobile():bool
  {
    // Определи тип браузера
    // Источник : http://mobiledetect.net/
    require_once('Mobile_Detect.php');
    $detect = new Mobile_Detect;
    return $detect->isMobile();
  }

  /**
   * @param $ip
   * @return bool ip принадлежит запрещённой локации : стране, области или городу ?
   * Список запрещённых локаций в файле settings/banned-locations.txt
   */
  public function isBannedLocation($ip):bool
  {
    require_once('getAddressFromIP.php');

    // получи список запрещённых локаций : стран, областей и городов
    $file_url = $this->file_path.$this->banned_locations_file;
    $contents = Helper::readFile($file_url);
    $banned_locations = Helper::convertMultilineToArray($contents);

    // Определи адрес по ip.
    // Вначале было просто так :
    // $address = getAddressFromIP($ip);
    // Т.е. проверка при каждом запросе.
    // Но зачем каждый раз проводить проверку, если можно это сделать один раз за сессию ?
    require_once("Helper.php");

    // если ip = 127.0.0.1 или ::1- это localhost
    // нужно выполнить проверку, и на этот случай, присвой значения по умолчанию :
    $country = 'Россия';
    $region = 'волость';
    $city = 'уездный город Н.';

    if(($ip !== '127.0.0.1') && ($ip !== '::1'))
    {
      // адрес в виде многомерного массива
      $address = Helper::getIpAddressFromSessionOrRequest($ip);

      // получи из адреса
      $country = getCountryFrom($address);
      $region = getRegionFrom($address);
      $city = getCityFrom($address);
    }

    return (($country !== "Россия") || in_array($region, $banned_locations) || in_array($city, $banned_locations));
  }

}