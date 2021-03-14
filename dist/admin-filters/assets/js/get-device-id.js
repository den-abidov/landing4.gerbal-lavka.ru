'use strict';

console.log('get-device-id.js : зашёл.');

/**
 * Вернёт id устройства из LS.
 * Если там его нет - тут же сгенерирует.
 */
function getDeviceIdFromLS()
{
    let deviceId =  localStorage.getItem("deviceId");
    if(deviceId === null)
    {
        deviceId = generateDeviceId();
        localStorage.setItem("deviceId", deviceId);
    }
    return deviceId;
}

/**
 * Сгенерирует id устройства.
 * Формат : сайт - дата - время - буква
 * Пример : gerbal-zakaz.ru|2020.9.1|12:34:25|t
 */
function generateDeviceId()
{
    const site = 'gerbal-zakaz.ru' // <<<<<<<<<<
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
    const separator = "|";
    const deviceId = site+separator+year+"."+month+"."+date+separator+hours+':'+minutes+':'+seconds+separator+letter;
    return deviceId;
}
