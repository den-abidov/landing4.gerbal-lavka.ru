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
    <link rel="stylesheet" href="assets/css/simpletest.css" inline>
  </head>
  <body>

    <main>
      <br/>
      <h1 class="text-center">Тестирование</h1>
      <?php include_once("assets/php/redirecter.php"); ?>
      <!-- script src="assets/js/get-device-id.js" inline></script>
      <script src="assets/js/check-device-id.js" inline></script>
      <script src="assets/js/simpletest.js" inline></script -->
    </main>

  </body>
</html>