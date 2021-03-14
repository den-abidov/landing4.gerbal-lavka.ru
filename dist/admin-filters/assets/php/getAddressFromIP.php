<?php

function getAddressFromIP($ip):array
{
  $query="https://suggestions.dadata.ru/suggestions/api/4_1/rs/detectAddressByIp?ip=".$ip;

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $query);

    //curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,0);
    //curl_setopt($ch,CURLOPT_SSL_VERIFYHOST,0);

  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");

  $headers = array();
  $headers[] = "Accept: application/json";
  $headers[] = "Authorization: Token 717fec7c4e5cbb81a35820d2e060095fd8b918f3";//мой токен с dadata.ru
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

  $result = curl_exec($ch);//результат = объект JSON. Содержит много свойств/полей, но нам нужно только одно свойство 'city'
  if (curl_errno($ch)) {
      echo 'Error:' . curl_error($ch);
  }
  curl_close ($ch);

  // Бывает, что не может определить адрес по заданному ip.
  // Тогда возвращает $result['location'] === null

  //$result в формате JSON
  $arr = json_decode($result, true);//конвертация JSON => array

  /* имеем на выходе многомерный ассоциативный PHP-массив :
     $country=$arr['location']['data']['country'];
     $region=$arr['location']['data']['region_with_type'];  есть и вариант 'region'
     $city=$arr['location']['data']['city_with_type'];      есть и вариант 'city'
   */

  return $arr;
}

function convertAddressToString(array $address):string
{
  if($address['location'] !== null)
  {
    $country=$address['location']['data']['country'];
    $region=$address['location']['data']['region_with_type'];
    $city=$address['location']['data']['city_with_type'];

    return $country.", ".$region.", ".$city;
  }
  else
  {
    return "?";
  }

}

function getCountryFrom(array $address):string
{
  if($address['location'] !== null)
  {
    return $address['location']['data']['country'];
  }
  else
  {
    return "?";
  }
}

function getRegionFrom(array $address):string
{
  if($address['location'] !== null)
  {
    return $address['location']['data']['region'];
  }
  else
  {
    return "?";
  }
}

function getCityFrom(array $address):string
{
  if($address['location'] !== null)
  {
    return $address['location']['data']['city'];
  }
  else
  {
    return "?";
  }
}
