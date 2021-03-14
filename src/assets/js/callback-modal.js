console.log("callback-modal.js : зашёл.");

/*
 * Зависит от
 * js/settings.js
 * js/utils.js
 * js/get-from-LS.js
 * sass/_callback-modal.scss
 * partials/modal-callback.blade.php
 */
function getCallbackModalProps()
{
    // DOM элементы
    const sendButton = document.getElementById("send");
    const sendingMessage = document.getElementById("sending");
    const successMessage = document.getElementById("success");
    const failureMessage = document.getElementById("failure");

    return{
        name: getUserNameFromLS(),
        phone: getUserPhoneFromLS(),
        whenToCall:'сейчас',
        errorVisible:false,
        sendVisible:true,
        sendingVisible:false,
        successVisible:false,
        failureVisible:false,

        whenNameChanged:function(){
            localStorage.setItem("userName", this.name);
            // см. чтобы имя в LS совпадало с именем в get-from-LS.js@getUserNameFromLS();
        },

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

            // покажи кнопку "Отправляем заявку"
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
            console.log("callback-modal.js : телефон валидный. Буду отправлять заявку.");

            // Подготовь данные и передай их на сервер,
            // чтобы контроллер на сервере отправил уведомление в Slack и внёс запись в БД.

            // упакуй данные в JSON-объект
            let data = {
                site: settings.site_name,
                user_name: this.name,
                user_phone: PhoneNumber(this.phone).formatted,
                when_to_call: this.whenToCall,
                user_time: getUserTime(),
            };

            // отправь эти данные => Laravel
            fetch(settings.notify_callback_url, {
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
                    successMessage.style.display="block";
                    sendButton.style.display="none";
                    // если захочешь спрятать через 20 секунд
                    callAfterDelay(20000, () => {
                        successMessage.style.display="none";
                        sendButton.style.display="block";
                    });
                })
                .catch((error) => {
                    console.error('callback-modal.js :  Error : ', error);
                    failureMessage.style.display="block";
                    // если захочешь спрятать через 5 секунд
                    callAfterDelay(5000, () => {
                        failureMessage.style.display="none";
                        sendButton.style.display="block";
                    });

                })
                .finally(function () {
                    console.log("callback-modal.js : Выход из общения с сервером.");
                    sendingMessage.style.display="none";
                });

            // и залогируй в БД
            logEvent("обратный звонок");

        }// whenSendPressed
    }// return
}// getCallbackModalProps()
