console.log("callback-request.js : зашёл.");

/*
 На основе registration-request.js. Просто добавил ещё 2 параметра : pageName и pageDescription для отправки на сервер.
 Получает данные,
 "пакует" их в JSON-объект
 и передаёт на сервер через post-запрос.
 */

function callbackRequest(name, phone, whenToCall, hasSponsor, pageName, pageDescription)
{
    // Подготовь данные и передай их на сервер,
    // чтобы контроллер на сервере отправил уведомление в Slack и внёс запись в БД.

    // упакуй данные в JSON-объект
    let data = {
        site: settings.site_name,
        user_name: name,
        user_phone: PhoneNumber(phone).formatted,
        when_to_call: whenToCall,
        has_sponsor: hasSponsor,
        user_time: getUserTime(),
        page_name: pageName,
        page_description: pageDescription,
    };

    // отправь эти данные => Laravel
    fetch(settings.notify_callback_request_url, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text-plain, */*",
            "X-Requested-With": "XMLHttpRequest",
            // не использую : "X-CSRF-TOKEN": token
        },
        method: 'post',
        credentials: "same-origin",
        body: JSON.stringify(data)
    })
    .then(response => response.text()) // response.text() или response.json(), что-то ещё ?
    .then(data => {
        // пометь, что пользователь уже сделал запрос
        localStorage.setItem("requestSubmitted", true);

        // залогируй в БД
        logEvent("обратный звонок");
    })
    .then(data => {

        // спрячь кнопку "Отправляю"
        document.querySelector("#call-me").style.display="none";

        // покажи сообщение "Заявка отправлена"
        document.querySelector("#submitted").style.display="block";

        if(settings.zastavka_after_callback)
        {
            // редирект
            window.location.href = "sent.html";
        }
    })
    .catch((error) => {
        console.error('callback-request.js :  Error : ', error);

        const failureMessage = document.getElementById("server-error");
        failureMessage.style.display="block";

        // если захочешь спрятать через 5 секунд
        callAfterDelay(5000, () => {
            failureMessage.style.display="none";
        });

    })
    .finally(function () {
       console.log("callback-request.js : Выход из общения с сервером.");
    });
}