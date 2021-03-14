'use strict';

console.log('get-from-LS.js : зашёл.');

/*
 * Много get-методов, которые считывают данные из Local Storage.
 * Используются в get-JSON.js и summary.js
 */

// ip
function getIpFromLS()
{
    return JSON.parse(localStorage.getItem("ip"));
}

function setIpToLS(ip)
{
    localStorage.setItem("ip", JSON.stringify(ip));
}

// ip адрес
function getIpAddressFromLS()
{
    return JSON.parse(localStorage.getItem("ipAddress"));
}

function setIpAddressToLS(ipAddress)
{
    localStorage.setItem("ipAddress", JSON.stringify(ipAddress));
}

// пользователь
function getUserFromLS()
{
    return JSON.parse(localStorage.getItem("user"));
}

// продукты
function getProductsFromLS()
{
    return JSON.parse(localStorage.getItem("products"));
}

// общее количество продуктов в каталоге.
function getProductsCount()
{
    return JSON.parse(localStorage.getItem("products")).length;
}

// корзина = массив
function getCartFromLS()
{
    return JSON.parse(localStorage.getItem("cart"));
}

// количество товаров в корзине
function getCartCountFromLS()
{
    return JSON.parse(localStorage.getItem("cartCount"));
}

// очки за все товары в корзине
function getCartPVFromLS()
{
    return JSON.parse(localStorage.getItem("cartPV"));
}

// стоимость всех товаров в корзине
function getCartSumFromLS()
{
    return JSON.parse(localStorage.getItem("cartSum"));
}

// стоимость всех товаров в корзине без товаров "zeroMargin"
function getCartSumNZMFromLS()
{
    return JSON.parse(localStorage.getItem("cartSumNZM"));
}

// Полагается бесплатная доставка ?
// ВНИМАНИЕ: Дублирующий метод используется и в delivery.js
function getFreeDeliveryFromLS() {
    let hasFreeDelivery = JSON.parse(localStorage.getItem("hasFreeDelivery"));
    if (hasFreeDelivery == null) {
        hasFreeDelivery = false;
    }
    return hasFreeDelivery;
}

// способ доставки
function getDeliveryNameFromLS() {
    let name = localStorage.getItem("deliveryName");
    if (name == null) {
        name = "";
    }
    return name;
}

// адрес доставки
function getDeliveryAddressFromLS() {
    let address = localStorage.getItem("deliveryAddress");
    if (address == null) {
        address = "";
    }
    return address;
}

// стоимость доставки
function getDeliveryCostFromLS() {
    let cost = JSON.parse(localStorage.getItem("deliveryCost"));
    if (cost == null) {
        cost = 0;
    }
    return cost;
}

// итоговая стоимость доставки
function getFinalDeliveryCostFromLS() {
    let finalDeliveryCost = JSON.parse(localStorage.getItem("finalDeliveryCost"));
    if (finalDeliveryCost == null) {
        finalDeliveryCost = 0;
    }
    return finalDeliveryCost;
}

// полная стоимость : товар + доставка
function getTotalCostFromLS() {
    let totalCost = JSON.parse(localStorage.getItem("totalCost"));
    if (totalCost == null) {
        totalCost = 0;
    }
    return totalCost;
}

// имя заказчика
function setUserNameToLS(userName) {
    localStorage.setItem("userName", userName);
}

function getUserNameFromLS() {
    let name = localStorage.getItem("userName");
    if (name == null) {
        name = "";
    }
     return name;
}

function setUserPhoneToLS(userPhone) {
    localStorage.setItem("userPhone", userPhone);
}

// телефон заказчика
function getUserPhoneFromLS() {
    let phone = localStorage.getItem("userPhone");
    if (phone == null) {
        phone = "";
    }
    return phone;
}


// отметка, что получит другой человек
function setRecipientCheckToLS(recipientCheck) {
    localStorage.setItem("recipientCheck", recipientCheck);
}

function getRecipientCheckFromLS() {
    let recipientCheck = JSON.parse(localStorage.getItem("recipientCheck"));
    /*
     *  В LS булевы значения хранятся как строки : "true".
     *  JSON.parse преобразует их в булевые значения : JSON.parse("true") -> true
     */
    if (recipientCheck == null) {
        recipientCheck = false;
    }
    return recipientCheck;
}

// контакты получателя
function setRecipientContactsToLS(recipientContacts) {
    localStorage.setItem("recipientContacts", recipientContacts);
}

function getRecipientContactsFromLS() {
    let recipientContacts = localStorage.getItem("recipientContacts");
    if (recipientContacts == null) {
        recipientContacts = "";
    }
    return recipientContacts;
}
