console.log("phone-coupon.js : зашёл.");

/*
 * Зависит от
 * js/settings.js
 * js/utils.js
 * js/get-from-LS.js
 * sass/_phone-coupon.scss
 * partials/phone-coupon.html
 */
function getPhoneCouponProps()
{
    // DOM элементы
    const sendButton = document.getElementById("phone-coupon-send");
    const sendingMessage = document.getElementById("phone-coupon-sending");
    const successMessage = document.getElementById("phone-coupon-success");
    const failureMessage = document.getElementById("phone-coupon-failure");

    return{
        phone: '',
        errorVisible:false,
        sendVisible:true,
        sendingVisible:false,
        successVisible:false,
        failureVisible:false,

        whenPhoneChanged:function(){
            // просто спрячь алерты ошибок и нормального завершения
            this.errorVisible = false;
            this.sendVisible = true;
            this.sendingVisible = false;
            this.successVisible = false;
            this.failureVisible = false;

            localStorage.setItem("userPhone", this.phone);
            // см. чтобы имя в LS совпадало с именем в get-from-LS.js@getUserPhoneFromLS();
        },

        whenSendPressed:function(){

            // спрячь кнопку "Позвоните мне"
            this.sendVisible = false;

            // покажи сообщение "Отправляем заявку"
            this.sendingVisible = true;

            // проверь данные с input'а : это телефонный номер ?
            let phoneIsValid = PhoneNumber(this.phone).valid;

            // если номер не валидный = значит это ошибка => покажи alert c #error через AlpineJS
            this.errorVisible = !phoneIsValid;

            // поменяй видимость элементов и выйди из функции
            if(this.errorVisible){
                this.sendingVisible = false;
                this.sendVisible = true;
                return;
            }

            // если же phoneIsValid
            console.log("phone-coupon.js : телефон валидный. Буду отправлять СМС.");

            // Подготовь данные и передай их на сервер,
            // чтобы контроллер на сервере отправил уведомление в Slack и внёс запись в БД.

            // упакуй данные в JSON-объект
            let data = {
                site: settings.site_name,
                SMS_text: settings.SMS_text,
                user_phone: PhoneNumber(this.phone).formatted,
                user_time: getUserTime(),
            };

            // отправь эти данные => Laravel
            fetch(settings.send_coupon_url, {
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
                    /**
                     * ВАЖНО! 'this' AlpineJS компонента здесь не видно.
                     * Пример : this.successVisible = true; ошибка из-за this
                     * Поэтому управляю видимостью элементов через их id.
                     */
                    console.log("phone-coupon.js : Успешно. Сервер ответил : "+data);

                    successMessage.style.display="block";
                    sendButton.style.display="none";
                    // если захочешь спрятать через 20 секунд
                    callAfterDelay(20000, () => {
                        successMessage.style.display="none";
                        sendButton.style.display="block";
                    });
                })
                .catch((error) => {
                    console.log("phone-coupon.js : Ошибка. Сервер ответил : "+error);
                    failureMessage.style.display="block";
                    // если захочешь спрятать через 5 секунд
                    callAfterDelay(5000, () => {
                        failureMessage.style.display="none";
                        sendButton.style.display="block";
                    });
                })
                .finally(function () {
                    console.log("phone-coupon.js : Выход из общения с сервером.");
                    sendingMessage.style.display="none";
                });

            // и залогируй в БД
            logEvent("подарочный купон");

        }// whenSendPressed
    }// return
}// getCallbackModalProps()
