console.log("get-ip-data.js");

/*
 * Нужно получить ip и его адрес из LS.
 * Если с момента последнего получения прошло > 30 мнут, то получи с сервера.
 */
requestIpData();

// Получи ip и его адрес
function requestIpData()
{
    console.log("requestIpData() : Нужно получить ip и его адрес.");

    if(needToUpdateIp() == true)
    {
        console.log("requestIpData() : Запрошу ip и его адрес с сервера...");
        requestIpDataFromServer();

        let now = new Date();
        localStorage.setItem("ipCallTime",JSON.stringify(now));
    }
    else
    {
        console.log("requestIpData(): использую имеющийся ip = " + getIpFromLS());
        console.log("requestIpData(): использую имеющийся ipAddress = " + getIpAddressFromLS());
    }
}

// Получи ip и его адрес с сервера
function requestIpDataFromServer()
{
    fetch(settings.ip_data_url)
        .then((response) => response.json())
        .then(response => {
            // получи данные из ответа
            let ip = response.ip;
            let ipAddress = response.ip_address;
            console.log("requestIpDataFromServer() : Получил ip и его адрес с сервера.");
            // и сохрани их в LS
            setIpToLS(ip);
            setIpAddressToLS(ipAddress);
            console.log("requestIpDataFromServer() : Сохранил ip и его адрес в LS.");
        });
}


// Замеряет сколько времени прошло с указанного момента времени
// past в формате Date()
function minutesFrom(past)
{
    let now = new Date(); // сейчас
    let mins = (now - past)*0.001/60; // конвертация миллисекунд => минуты
    return mins;
}

// true, если прошло > 30 минут с момента последнего запроса ip
function needToUpdateIp()
{
    let canWaitMinutes = 30;
    let result = false;
    let ipLastCallTime = JSON.parse(localStorage.getItem("ipCallTime"));

    if(ipLastCallTime === null)
    {
        result = true;
    }
    else
    {
        // сколько времени прошло с момента прошлого зарегистрированного события (получения ip)
        let deltaMins = minutesFrom(ipLastCallTime);
        if(deltaMins>canWaitMinutes)
        {
            result = true;
        }
    }
    /*if(result == true)
    {
        console.log("needToUpdateIp(): пора обновить ip.");
    }
    else
    {
        console.log("needToUpdateIp(): НЕ нужно обновлять ip.");
    }*/
    return result;
}
