'use strict';

const settings = {

    check_once:true,

        zastavka_after_callback:false, // показывать заставку после обратного звонка

        shop_url: 'https://shop-cp.gerbal-lavka.ru/catalog',

        client_card_number: 'minus35', // номер карты клиента, дающей повышенную скидку

    filters_url:'https://filters.gerbal-lavka.ru/api/filter',

    send_coupon_url: "https://services.gerbal-lavka.ru/api/coupon",

    send_comment_url: "https://services.gerbal-lavka.ru/api/comment",

    send_pricelist_url: "https://services.gerbal-lavka.ru/api/pricelist",

    site_name: window.location.hostname,

    // SMS_text: "Купон на подарок : МАРТА.\nНакопительная скидка от 30 до 50%! Сайт : https://link.gerbal24.ru/zakaz.html?kupon=true",
    SMS_text: "Купон на подарок : МАРТА.\nНакопительная скидка от 30 до 50%! Обращайтесь : тел, WhatsApp +79539233275",
    // SMS_text: "Купон на подарок : МАРТА.\nНакопительная скидка от 30 до 50%! Обращайтесь : тел, WhatsApp +79384812518",

    find_user_url: "https://crm.gerbal-lavka.ru/api/find-user/",
    ip_data_url: "https://services.gerbal-lavka.ru/api/ip",
    log_events_url: "https://services.gerbal-lavka.ru/api/event",
    notify_callback_url : "https://services.gerbal-lavka.ru/api/callback",
    notify_chat_url : "https://services.gerbal-lavka.ru/api/chat",
    notify_order_url : "https://services.gerbal-lavka.ru/api/order",

    notify_registration_request_url : "https://services.gerbal-lavka.ru/api/registration-request",
    notify_callback_request_url : "https://services.gerbal-lavka.ru/api/callback-request", // это просто немного расширенная версия /registration-request
};
/*
localStorage.setItem("settings", JSON.stringify(settings));

function getSettingsFromLS()
{
    return JSON.parse(localStorage.getItem("settings"));
}*/
