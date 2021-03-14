<?php
session_start();
?>
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Тестовая страница</title>
    <!-- BootStrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
    <!--This page specific CSS-->
    <link rel="stylesheet" href="assets/css/test.css" inline>
  </head>
  <body>

    <main>
      <?php include_once "assets/php/route.php"; ?>
      <br/>
      <h1 class="text-center">Тестовая страница</h1>
      <p class="text-center">Если видишь этот текст, значит сервер пропустил твой запрос.</p>
    
      <br/>
      <ul class="nav justify-content-center">
        <li class="nav-item"><a class="nav-link" href="admin.php">Админ-панель</a></li>
        <li class="nav-item"><a class="nav-link" href="info.php">Проверка</a></li>
        <li class="nav-item"><a class="nav-link" href="test.php">Тестовая страница</a></li>
      </ul>
      <br/>></main>

  </body>
</html>