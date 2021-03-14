'use strict';

console.log("logEvent.js : зашёл.");

/**
 * Данный метод логирует событие в БД.
 * api-запрос : см. ниже.
 * БД : 'crm', таблица : 'events'. См. код проекта-Laravel-CRM : routes/api.php.
 * ВНИМАНИЕ! Данный метод зависит от get-from-LS.js
 */
function logEvent(eventName)
{
    let event = {
        site: settings.site_name,
        event: eventName,
        user_name: getUserNameFromLS(),
        user_phone: getUserPhoneFromLS(),
        device_id: getDeviceIdFromLS(),
        ip: getIpFromLS(),
        ip_address: getIpAddressFromLS()
    };

    console.log(event);

    fetch(settings.log_events_url, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text-plain, */*",
            "X-Requested-With": "XMLHttpRequest",
            // не использую : "X-CSRF-TOKEN": token
        },
        method: 'post',
        credentials: "same-origin",
        body: JSON.stringify(event)
    })
        .then(response => response.text()) // response.text() или response.json(), что-то ещё ?
        .then(data => {
            console.log('logEvent.js : Success. Server reply : ', data);
        })
        .catch((error) => {
            console.error('logEvent.js : Error : ', error);
        })
        .finally(function () {
            console.log("logEvent.js : finally");
        });
}
