'use strict';

/*
 * Методы для работы с объектом config.
 * config хранит настройки видимости сайта.
 * config - это JSON-объект. Имеет такую же структуру, как и файл config.json
 */

function getConfigFromLS()
{
    let config = JSON.parse(localStorage.getItem('siteConfig'));
    if(config == null)
    {
        config = {
            "siteIsOn":false,
            "mobileOnly":false,
            "filterIp":false,
        };
    }
    return config;
}

function saveConfigToLS(config)
{
    localStorage.setItem("siteConfig", JSON.stringify(config));
}

function getConfigFromServer()
{
    let request="assets/php/readFile.php";
    let response=JSON.parse(runServerCode(request));
    return response;
}

function saveConfigToServer(config)
{
    //конвертируй из JS-объекта в JSON-объект
    config=JSON.stringify(config);
    console.log("saveConfigToServer : config =");
    console.log(config);
    let request="assets/php/writeToFile.php?content="+config;
    let response=runServerCode(request);
}

function updateConfigWith(config, f,v)
{
    // обнови нужное поле
    if(f == 'siteIsOn') config.siteIsOn = v;
    if(f == 'mobileOnly') config.mobileOnly = v;
    if(f == 'filterIp') config.filterIp = v;

    return config;
}

function logConfig(config)
{
    console.log(config);
    console.log("logConfig(). siteIsOn = " + config.siteIsOn);
    console.log("logConfig(). mobileOnly = " + config.mobileOnly);
    console.log("logConfig(). filterIp = " + config.filterIp);
    console.log("");
}

function printConfig()
{
    let config = JSON.parse(localStorage.getItem('siteConfig'));
    console.log(config);
}