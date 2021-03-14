<?php
session_start();
?>
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Отчёт</title>
    <!-- BootStrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
    <!--This page specific CSS-->
    <link rel="stylesheet" href="assets/css/info.css" inline>
  </head>
  <body>

    <main>
      <?php include_once "assets/php/info.php"; ?>
      <br/>
      <h1 class="text-center">Проверка</h1>
      <div class="container">
    
        <div class="table-wrap">
          <h5>Фильтры</h5>
          <table class="table table-hover">
            <tbody>
              <tr><td>Сайт включён</td><td><?= $siteIsOn ?></td></tr>
              <tr><td>Только на телефонах</td><td><?= $mobileOnly ?></td></tr>
              <tr><td>Фильтрация по ip</td><td><?= $filterIp ?></td></tr>
            </tbody>
          </table>
        </div>
        <br/>
    
        <div class="table-wrap">
          <h5>Параметры пользователя</h5>
          <table class="table table-hover">
            <tbody>
            <tr><td>Админовский ключик</td><td><?= $hasAdminKey ?></td></tr>
            <tr><td>ip в белом списке</td><td><?= $isAllowedIp ?></td></tr>
            <tr><td>ip в чёрном списке</td><td><?= $isBannedIp ?></td></tr>
            <tr><td>мобильное устройство</td><td><?= $isMobile ?></td></tr>
            <tr><td>ip</td><td><?= $ip ?></td></tr>
            <tr><td>хост</td><td><?= $host ?></td></tr>
            <tr><td>бот</td><td><?= $bot ?></td></tr>
            <tr><td>ip => адрес</td><td><?= $ip_address ?></td></tr>
            <tr><td>ip => страна</td><td><?= $country ?></td></tr>
            <tr><td>ip => область</td><td><?= $region ?></td></tr>
            <tr><td>ip => город</td><td><?= $city ?></td></tr>
            <tr><td>запрещённая локация</td><td><?= $bannedLocation ?></td></tr>
            </tbody>
          </table>
        </div>
        <br/>
    
        <div class="table-wrap">
          <h5>Выводы</h5>
          <table class="table table-hover">
            <tbody>
            <tr><td>Просмотр разрешён</td><td><?= $passed ?></td></tr>
            <tr><td>Причина</td><td><?= $failed_check ?></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    
      <br/>
      <ul class="nav justify-content-center">
        <li class="nav-item"><a class="nav-link" href="admin.php">Админ-панель</a></li>
        <li class="nav-item"><a class="nav-link" href="info.php">Проверка</a></li>
        <li class="nav-item"><a class="nav-link" href="test.php">Тестовая страница</a></li>
      </ul>
      <br/>>
    </main>

  </body>
</html>