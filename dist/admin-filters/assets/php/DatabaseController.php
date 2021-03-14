<?php

/**
 * Class DatabaseController Для работы с БД.
 */
class DatabaseController
{
  // путь к файлам настроек
  private string $file_path = ''; // Пустое значение-"заглушка".
  // Раньше было './settings/'. Сейчас это неправильно.
  // Правильное значение для $file_path теперь присваивается в конструкторе.

  private string $database_settings_file = 'database.json'; // файл настроек
  public string $events_table;  // название таблицы с данными событий
  private $database_settings; // содержимое файла настроек
  private $database_connection; // настроеный инстанс коннекта к MySQL
  protected $output; // временная переменная

  public function __construct()
  {
    // Вычисляемое выражение нельзя использовать при объявлении переменной в начале класса
    // Поэтому вычислим $file_path здесь, в конструкторе :
    $this->file_path = Helper::pathToSettingsFolder();

    $this->prepareDatabaseSettings();

    // название таблиц в БД
    // опция для настроек доступа к БД : dev или production
    $option = $this->database_settings->{'option'};
    $this->events_table = $this->database_settings->{ $option }->{'table'};
  }

  /**
   * Считай содержимое файла настроек database.json => в $this->database_settings
   */
  private function prepareDatabaseSettings()
  {
    require_once('Helper.php');
    $file_url = $this->file_path.$this->database_settings_file;
    $contents = Helper::readFile($file_url);
    $this->database_settings = Helper::convertToObject($contents);
  }

  /**
   * @return object Содержимое файла настроек database.json
   */
  public function getDatabaseSettings():object
  {
    return $this->database_settings;
  }

  /**
   * Подготовь инстанс MySQL для коннекта к БД
   */
  private function prepareDatabaseConnection()
  {
    //параметры доступа к БД
    $option = $this->database_settings->{'option'};
    $host = $this->database_settings->{ $option }->{'host'};
    $user = $this->database_settings->{ $option }->{'user'};
    $password = $this->database_settings->{ $option }->{'password'};
    $database = $this->database_settings->{ $option }->{'database'};

    // коннект к БД
    $conn = new mysqli($host,$user,$password,$database);

    //кодировка
    $conn->set_charset("utf8");

    $this->database_connection = $conn;
  }

  /**
   * @param string $sql SQL-запрос на исполнение
   * @return bool|mixed результат
   * ВАЖНО! Этот метод возвращает инстанс mysqli_result.
   * mysqli_result->fetch_object()    - возвращает результаты в виде объекта
   * mysqli_result->fetch_array()     - возвращает результаты в виде массива
   * mysqli_result->...               - методов много
   * mysqli_result->fetch_array()[0]; - возвращает 1 значение
   */
  public function runSQL(string $sql)
  {
    // подготовь и открой коннект к БД
    $this->prepareDatabaseConnection();

    // получи коннект к БД
    $conn = $this->database_connection;

    //проверка коннекта
    if ($conn->connect_error)
    {
      die("No connection with database : ".$conn->connect_error);
    }

    //обработай запрос
    $result = $conn->query($sql);

    if ($conn->error)
    {
      echo "Ошибка: " . $sql . "<br>" . $conn->error;
    }

    //отсоединись от БД
    $conn->close();

    return $result;
  }

  /**
   * Сохранить в БД информацию о событии, если в settings/database.json указано, что нужно сохранять в БД.
   * @param string $message
   */
  public function addEventToDB(string $message)
  {

    // Параметры из файла настройки settings/database.json :
    // Cохранять или нет в БД ?
    $use = $this->database_settings->{'use'};

    if(!$use)
    {
      return; // Если сохранять в БД ничего не нужно, то просто выйди из этого метода!
    }

    // Если $use === true, то всё что ниже исполнится.

    // Данные для сохранения
    $parameters = $this->prepareData($message);

    // Считай куда сохранять запись :
    if($this->database_settings->{'option'} === "api")
    {
      $this->saveToRemoteDB($parameters);
    }
    else
    {
      $this->saveToLocalDB($parameters);
    }
  }

  /**
   * @param $message
   * @return bool
   */
  public function suspiciousEvent($message):bool
  {
    // событие подозрительное, если сообщение содержит слово 'ВНИМАНИЕ'
    return strpos($message, 'ВНИМАНИЕ') !== false;
  }
  /**
   * Подготовка данных для передачи методам записи.
   */
  private function prepareData($message)
  {
    // Cтруктура таблицы, куда будем сохранять :
    // id - time  - site  - event - user_name - user_phone  - device_id - ip  - ip_address  - risk - comment
    // Соот-но нужно собрать данные для полей таблицы.
    // В данном скрипте не заполняю колонки user_name, user_phone, device_id, т.к. не получаю их из JS.

    $events_table = $this->events_table;

    // Событие вызвано подозрительным действием ?
    $event = $this->suspiciousEvent($message)?'сработал фильтр':'';
    // Если "сработал фильтр ...", значит это подозрительное действие
    $risk = 'вероятно';

    $time = $this->getMoscowTime()->format('Y-m-d H:i:s');

    require_once("Helper.php");
    $site = Helper::getSiteName();

    $ip = $_SERVER['REMOTE_ADDR'];

    // если ip = 127.0.0.1 или ::1- это localhost
    $ip_address = 'localhost';

    if(($ip !== '127.0.0.1') && ($ip !== '::1'))
    {
      // адрес в виде многомерного массива
      $address = Helper::getIpAddressFromSessionOrRequest($ip);

      // Не проверяй сессию, а просто сразу запроси адрес ip.
      // Не использую. Но есть возможность.
      // $address = Helper::getIpAddress($ip);

      // этот же адрес $address, в виде строки
      $ip_address = convertAddressToString($address);
    }

    // Данные для записи
    $parameters = [
      'events_table' => $events_table,
      'time' => $time,
      'site' => $site,
      'event' => $event,
      'user_name' => '',
      'user_phone' => '',
      'device_id' => '',
      'ip' => $ip,
      'ip_address' => $ip_address,
      'risk' => $risk,
      'comment' => $message
    ];

    return $parameters;
  }

  /**
   *
   * @param $parameters
   * @throws \GuzzleHttp\Exception\GuzzleException
   */
  private function saveToRemoteDB($parameters)
  {
    // Соверши API-запрос => запись в БД
    // ВАЖНО :
    // 1. При разработке используй путь 'vendor/autoload.php'
    // 2. При деплое на сайт, используй путь 'admin-filters/vendor/autoload.php'
    require 'admin-filters/vendor/autoload.php';

    /* БЫЛ такой хардкод :
    $client = new GuzzleHttp\Client(['base_uri' => 'https://services.gerbal-lavka.ru/api/']);
    $response = $client->request('POST','https://services.gerbal-lavka.ru/api/event', [ 'query' => $parameters ]);)*/

    $base_uri = $this->database_settings->{'api'}->{'base_uri'};
    $request = $this->database_settings->{'api'}->{'request'};

    $client = new GuzzleHttp\Client(['base_uri' => $base_uri]);
    $response = $client->request('POST',$request, [ 'query' => $parameters ]);

    $result = $response->getBody();
  }

  /**
   * Сохрани в БД, которая хостируется там же, где и данный admin-filters.
   * @param $parameters
   */
  private function saveToLocalDB($parameters)
  {
    // Назначь значения перменным

    $events_table = $parameters['events_table'];
    $time = $parameters['time'];
    $site = $parameters['site'];
    $event = $parameters['event'];
    $ip = $parameters['ip'];
    $ip_address = $parameters['ip_address'];
    $risk = $parameters['risk'];
    $comment = $parameters['comment'];

    // Подготовь SQL-запрос
    $sql = "INSERT INTO `$events_table` set `time`='$time', `site`='$site', `event`='$event', `ip`='$ip', `ip_address`='$ip_address', `risk`='$risk', `comment`='$comment';";

    // Запиши в БД
    $result = $this->runSQL($sql);
  }

  /**
   * @return DateTime
   * @throws Exception
   */
  private function getMoscowTime()
  {
    // get timezone - UTC
    $utcTimezone = new DateTimeZone('UTC');

    // current time on server
    $now = date('Y-m-d H:i:s');

    // set time
    $time = new DateTime($now, $utcTimezone );

    // get Moscow timezone
    $moscowTimezone = new DateTimeZone('Europe/Moscow');

    $time->setTimeZone($moscowTimezone);

    return $time;
  }
}
