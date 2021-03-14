<?php

$do_logToFile = false; // для тестирования. Записывать лог в log.txt ?

require_once('Helper.php');
require_once('Checker.php');

$checker = new Checker();

$check_needed = null; // проводить проверку ?
$passed = null; // проверка пройдена ?

$failed_check = 'Проверка пройдена.';
/*
 * Смысл этих переменных :
 * Пока $check_needed === true, проходи проверки одну за другой.
 * Когда $check_needed === false, проверки прекратятся.
 * После прекращения проверок проверяется $passed.
 * $passed === true  => ничего не делай
 * $passed === false => редирект на 404.
 */
// Возможные комбинации значений для $check_needed и $passed :
// null,  null  => проверяй : в сессию пока ничего не записывалось.
// false, false => 404
// false, true  => ничего не делай
// true,  true  => продолжи проверять
// true, false  => 404


// достань готовые результаты проверки из сессии
// если раскомментируешь, в рамках одной сессии не будут проводиться потворные провреки при каждой загрузке страницы.
// $check_needed = Helper::getFromSession('check_needed');
// $passed = Helper::getFromSession('passed');

// При первом визите $check_needed и $passed === null


// Проверка 1 : В url есть админовский "ключик" ?
if(($check_needed === null) || $check_needed)
{
  $hasAdminKey = $checker->hasAdminKey();
  $check_needed = $hasAdminKey? false:true;
  $passed = $hasAdminKey;

  // Логическая ошибка! Предоставлен админовский ключ, но проверка засчитывается не пройденой ($check_needed = false).
  logFailureToDB($check_needed, $passed, "предъявлен админовский ключ");
  logToFile("Проверка 1 : Есть ли админовский ключ ?");
}

// Для следующих проверок нужно знать ip
$ip = $_SERVER['REMOTE_ADDR'];

// Проверка 2 : ip в "белом" списке ?
if($check_needed)
{
  $isAllowedIp = $checker->isAllowedIp($ip);
  $check_needed = $isAllowedIp? false:true;
  $passed = $isAllowedIp;

  // Логическая ошибка! IP в белом списке, но проверка засчитывается не пройденой ($check_needed = false).
  logFailureToDB($check_needed, $passed, "IP из белого списка");
  logToFile("Проверка 2 : IP в белом списке ?");
}

// Проверка 3 : ip в "чёрном" списке ?
if($check_needed)
{
  $isBannedIp = $checker->isBannedIp($ip);
  $check_needed = $isBannedIp? false:true;
  $passed = !$isBannedIp;

  logFailureToDB($check_needed, $passed, "ВНИМАНИЕ : IP в чёрном списке");
  logToFile("Проверка 3 : IP в чёрном списке ?");
}

// Проверка 4 : бот ?
if($check_needed)
{
  $bot = $checker->isBotIp($ip);
  $check_needed = $bot? false:true;
  $passed = $bot;

  if($bot){ logToDB($checker->getBotName());}
  // Логическая ошибка! Это поисковый бот, но проверка засчитывается не пройденой ($check_needed = false).
  logFailureToDB($check_needed, $passed, "это поисковой бот");
  logToFile("Проверка 4 : Это поисковой бот ?");
}

// Для следующих проверок нужно считать фильтры = настройки видимости сайта
$config = $checker->getConfig();

//Считает значения в виде строковых true или false.
//Внимание! Проверь : это булевые или всё ещё строковые значения ?
$siteIsOn = $config->{'siteIsOn'};
$filterIp = $config->{'filterIp'};
$mobileOnly = $config->{'mobileOnly'};


// Проверка 5 : сайт работает ?
if($check_needed)
{
  $check_needed = $siteIsOn? true:false;
  $passed = $siteIsOn;

  logFailureToDB($check_needed, $passed, "ВНИМАНИЕ : сайт отключён");
  logToFile("Проверка 5 : Сайт отключён ?");
}

// Проверка 6 : устройство - телефон ?
if($check_needed && $mobileOnly)
{
  $isMobile = $checker->isMobile();
  $check_needed = $isMobile? true:false;
  $passed = $isMobile;

  logFailureToDB($check_needed, $passed, "ВНИМАНИЕ : доступ с ПК закрыт");
  logToFile("Проверка 6 : Можно смотреть с телефона ?");
}

// Проверка 7 : ip из запрещённой локации : страны, области или города ?
if($check_needed && $filterIp)
{
  $bannedLocation = $checker->isBannedLocation($ip);
  $check_needed = $bannedLocation? false:true;
  $passed = !$bannedLocation;

  logFailureToDB($check_needed, $passed, "ВНИМАНИЕ : IP из запрещённой локации");
  logToFile("Проверка 7 : IP из запрещённой локации ?");
}

// напоследок, сохрани эти значения в сессию
// а перед этим пометь, что в рамках этой сессии, повторная проверка не нужна
$check_needed = false;
$_SESSION['check_needed'] = $check_needed;
$_SESSION['passed'] = $passed;
$_SESSION['failed_check'] = $failed_check; // будет использовано на станице info.php, см. info.php

// Проверь итоговое значение
if(!$passed)
{
  Helper::redirect404();
}

// КОНЕЦ СКРИПТА :
// если $passed == true, то ничего не делай. Просто выйди из скрипта.



function logToFile(string $title)
{
  global $do_logToFile, $check_needed, $passed, $failed_check;
  if($do_logToFile)
  {
    Helper::appendToFile($title);
    Helper::appendToFile("check needed = " . Helper::bool2string($check_needed) . ", passed = " . Helper::bool2string($passed));
    Helper::appendToFile($failed_check);
    Helper::appendToFile("");
  }
}

/**
 * Указываем причину непрохождения проверки
 * @param bool $check_needed
 * @param bool $passed
 * @param string $explanation описание причины
 */
function logFailureToDB(bool $check_needed, bool $passed, string $explanation)
{
  // global $check_needed, $passed
  // Почему-то global не хочет работать в Laravel-проекте.
  // Поэтому вынужден импортировать переменные $check_needed, $passed.

  if (!$check_needed && !$passed)
  {
    logToDB($explanation);
  }
}

/**
 * Логируем в БД, если включено в настройках settings/database.json
 * @param string $explanation
 */
function logToDB(string $explanation)
{
  require_once('DatabaseController.php');

  $dc = new DatabaseController();

  /*
  Такая проверка не нужна, т.к. выполняется в методе logFailureToDB()
  if($dc->suspiciousEvent($explanation))
  {
    // сохраняй в БД только подозрительные события
    $dc->addEventToDB($explanation);
  }*/
  $dc->addEventToDB($explanation);
}