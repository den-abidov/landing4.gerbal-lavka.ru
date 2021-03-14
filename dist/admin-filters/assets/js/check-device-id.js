'use strict';

console.log('check-device-id.js : зашёл.');

let deviceId = getDeviceIdFromLS();

fetch('admin-filters/assets/php/isBannedDevice.php?deviceId='+deviceId)
    .then(response => response.text()) // response.text() или response.json(), что-то ещё ?
    .then(data => {
        console.log('Сервер ответил :  ', data);
        if(data == 'banned')
        {
            console.log('Перенаправлю на 404.');
            window.location.href ='404.html';
        }
        })
    .catch((error) => {
        console.error('Error : ', error);
    });




