<?php
session_start();
?>
<!DOCTYPE html>
<html class="no-js" lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Админ-панель</title>
    <meta name="description" content="">
    <meta name="keywords" content="">

    <!-- BootStrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">

    <!--This page specific CSS-->
    <link rel="stylesheet" href="assets/css/admin.css" inline>
    
    <!--Font Awesome-->
    <script defer src="https://use.fontawesome.com/releases/v5.0.6/js/all.js"></script>

    <!-- Alpine JS -->
    <script defer src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"></script>
      
    <!--Favicon-->
    <link rel="icon" type="image/png" href="assets/img/favicon.png">


  </head>
  <body>
    

               
    
    <main>
      <div id="hero">
          <!-- h1>herbal-boutique.ru</h1 -->
          <h1><?php include_once("assets/php/renderSiteName.php"); ?></h1>
          <div><img src="assets/img/admin.png"/></div>
      </div>
      <div id="login" x-data="loginProps()">
          <div class="form-group">
              <label>Введите пароль</label>
              <input type="text" class="form-control is-invalid" x-bind:class="{'is-invalid':passwordWrong}" x-on:click="tryAgain()" x-model="password">
              <div class="alert alert-danger" x-show="passwordWrong">Пароль неверный</div>
          </div>
          <button type="submit" class="btn btn-primary" x-on:click="checkPassword()">Войти</button>
      </div>
      <div id="settings" x-data="settingsProps()" x-init="showCase=getCaseNumberFor(siteIsOn, mobileOnly, filterIp)">
          <h5>Управление сайтом</h5>
          <table>
              <tbody>
              <tr>
                  <td>Сайт включён</td>
                  <td><div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" value="" x-model="siteIsOn" x-on:click="$nextTick(()=>filterUpdated('siteIsOn', siteIsOn))"></div></td>
                  <td>
                      <label class="form-check-label" x-show="siteIsOn"><img src="assets/img/on.png"/>&nbsp;Да</label>
                      <label class="form-check-label" x-show="!siteIsOn"><img src="assets/img/off.png"/>&nbsp;Нет</label>
                  </td>
              </tr>
              <tr>
                  <td>Только на телефонах</td>
                  <td><div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" value="" x-model="mobileOnly" x-on:click="$nextTick(()=>filterUpdated('mobileOnly', mobileOnly))"></div></td>
                  <td>
                      <label class="form-check-label" x-show="mobileOnly"><img src="assets/img/on.png"/>&nbsp;Да</label>
                      <label class="form-check-label" x-show="!mobileOnly"><img src="assets/img/off.png"/>&nbsp;Нет</label>
                  </td>
              </tr>
              <tr>
                  <td>Фильтрация по ip</td>
                  <td><div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" value="" x-model="filterIp" x-on:click="$nextTick(()=>filterUpdated('filterIp', filterIp))"></div></td>
                  <td>
                      <label class="form-check-label" x-show="filterIp"><img src="assets/img/on.png"/>&nbsp;Да</label>
                      <label class="form-check-label" x-show="!filterIp"><img src="assets/img/off.png"/>&nbsp;Нет</label>
                  </td>
              </tr>
              </tbody>
          </table>
          <br/>
          <div class="case alert alert-secondary" x-show="showCase == 0">
              <p>Сайт отключен. Пользователи увидят пустую заставку. Риск нулевой, трафика нет.</p>
              <div class="card">
              <table>
                  <tr><td>Разрешения</td><td><img src="assets/img/smartphone.png"/>&nbsp;&nbsp;<img src="assets/img/laptop.png"/>&nbsp;&nbsp;<img src="assets/img/metro.png"/></td></tr>
                  <tr><td>Риск</td><td><svg height="20" width="120"><line x1="0" y1="10" x2="120" y2="10" class="background-line" /><line x1="0" y1="10" x2="0" y2="10" class="red-line" /></svg></td></tr>
                  <tr><td>Трафик</td><td><svg height="20" width="120"><line x1="0" y1="10" x2="120" y2="10" class="background-line" /><line x1="0" y1="10" x2="0" y2="10" class="green-line" /></svg></td></tr>
              </table>
              </div>
          </div>
          <div class="case alert alert-secondary"  x-show="showCase == 1">
              <p>Сайт включен и показывается везде, кроме запрещённых городов, и только на телефонах. На больших экранах и в запрещенных городах показывается пустая заставка. Риск минимальный, и примерно 30% трафика.</p>
              <div class="card">
              <table>
                  <tr><td>Разрешения</td><td><img src="assets/img/smartphone.png"/>&nbsp;&nbsp;<img class="transparent" src="assets/img/laptop.png"/>&nbsp;&nbsp;<img class="transparent" src="assets/img/metro.png"/></td></tr>
                  <tr><td>Риск</td><td><svg height="20" width="120"><line x1="0" y1="10" x2="120" y2="10" class="background-line" /><line x1="0" y1="10" x2="40" y2="10" class="red-line" /></svg></td></tr>
                  <tr><td>Трафик</td><td><svg height="20" width="120"><line x1="0" y1="10" x2="120" y2="10" class="background-line" /><line x1="0" y1="10" x2="40" y2="10" class="green-line" /></svg></td></tr>
              </table>
              </div>
          </div>
          <div class="case alert alert-secondary" x-show="showCase == 2">
              <p>Сайт включен и показывается везде, но только на телефонах. На больших экранах показывается пустая заставка. Риск меньше, 50% трафика.</p>
              <div class="card">
              <table>
                  <tr><td>Разрешения</td><td><img src="assets/img/smartphone.png"/>&nbsp;&nbsp;<img class="transparent" src="assets/img/laptop.png"/>&nbsp;&nbsp;<img src="assets/img/metro.png"/></td></tr>
                  <tr><td>Риск</td><td><svg height="20" width="120"><line x1="0" y1="10" x2="120" y2="10" class="background-line" /><line x1="0" y1="10" x2="60" y2="10" class="red-line" /></svg></td></tr>
                  <tr><td>Трафик</td><td><svg height="20" width="120"><line x1="0" y1="10" x2="120" y2="10" class="background-line" /><line x1="0" y1="10" x2="60" y2="10" class="green-line" /></svg></td></tr>
              </table>
              </div>
          </div>
          <div class="case alert alert-secondary" x-show="showCase == 3">
              <p>Сайт включен и показывается везде, кроме запрещенных городов, зато на любых устройствах. В запрещенных городах показывается пустая заставка. Риск меньше, 80% трафика.</p>
              <div class="card">
              <table>
                  <tr><td>Разрешения</td><td><img src="assets/img/smartphone.png"/>&nbsp;&nbsp;<img src="assets/img/laptop.png"/>&nbsp;&nbsp;<img class="transparent" src="assets/img/metro.png"/></td></tr>
                  <tr><td>Риск</td><td><svg height="20" width="120"><line x1="0" y1="10" x2="120" y2="10" class="background-line" /><line x1="0" y1="10" x2="90" y2="10" class="red-line" /></svg></td></tr>
                  <tr><td>Трафик</td><td><svg height="20" width="120"><line x1="0" y1="10" x2="120" y2="10" class="background-line" /><line x1="0" y1="10" x2="90" y2="10" class="green-line" /></svg></td></tr>
              </table>
              </div>
          </div>
          <div class="case alert alert-secondary" x-show="showCase == 4">
              <p>Сайт включен и показывается везде и на любых устройствах. Большой риск, зато 100% трафик.</p>
              <div class="card">
              <table>
                  <tr><td>Разрешения</td><td><img src="assets/img/smartphone.png"/>&nbsp;&nbsp;<img src="assets/img/laptop.png"/>&nbsp;&nbsp;<img src="assets/img/metro.png"/></td></tr>
                  <tr><td>Риск</td><td><svg height="20" width="120"><line x1="0" y1="10" x2="120" y2="10" class="background-line" /><line x1="0" y1="10" x2="120" y2="10" class="red-line" /></svg></td></tr>
                  <tr><td>Трафик</td><td><svg height="20" width="120"><line x1="0" y1="10" x2="120" y2="10" class="background-line" /><line x1="0" y1="10" x2="120" y2="10" class="green-line" /></svg></td></tr>
              </table>
              </div>
          </div>
      </div>
    
      <br/>
      <ul class="nav justify-content-center">
        <li class="nav-item"><a class="nav-link" href="admin.php">Админ-панель</a></li>
        <li class="nav-item"><a class="nav-link" href="info.php">Проверка</a></li>
        <li class="nav-item"><a class="nav-link" href="test.php">Тестовая страница</a></li>
      </ul>
      <br/>>
      <!-- This page JS -->
      <script src="assets/js/utility.js"></script>
      <script src="assets/js/config.js"></script>
      <script src="assets/js/login.js"></script>
      <script src="assets/js/settings.js"></script>
    
    </main>


    <!-- Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>

    <script src="assets/js/admin.js" inline></script>

  </body>
</html>