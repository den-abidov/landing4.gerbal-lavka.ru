<?php
/*
require_once('DatabaseController.php');

$dc = new DatabaseController();
$dc->recordToDB('тестовое событие');


echo "<h1 class='text-center'>"."Скрипт сработал"."</h1>";*/

// Тест на чтение файла
require_once('Helper.php');
require_once('Checker.php');
require_once('DatabaseController.php.php');
$dc = new DatabaseController();
$option = $dc->getDatabaseSettings()->{'option'};
echo $option;
// echo "Это тест.";
