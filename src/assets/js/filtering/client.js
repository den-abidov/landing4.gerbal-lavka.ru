// данные для отправки в API-запрос фильтрам
const client={
    site:window.location.hostname,
    device_id: getDeviceIdFromLS(),
    user_name:getUserNameFromLS(),
    user_phone: getUserPhoneFromLS()
}