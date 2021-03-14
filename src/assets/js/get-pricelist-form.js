console.log("get-pricelist-form.js : зашёл.");

/*
 * Зависит от
 * js/settings.js
 * js/utils.js
 * js/get-from-LS.js
 * sass/_get-pricelist.scss
 * partials/get-pricelist-form.html
 */
function getPricelistFormProps()
{
    // DOM элементы
    const send = document.getElementById("send-email");
    const sendingMessage = document.getElementById("sending-email");
    const successMessage = document.getElementById("email-sent-success");
    const failureMessage = document.getElementById("email-sent-failure");

    return{
        email: '',
        emailError:false,

        errorVisible:false,
        sendVisible:true,
        sendingVisible:false,
        successVisible:false,
        failureVisible:false,

        removeErrorMessages:function(){
            this.emailError = false;

            this.sendVisible = true;
            this.sendingVisible = false;
            this.successVisible = false;
            this.failureVisible = false;
        },

        whenSendPressed:function(){

            // спрячь кнопку "Отправить"
            this.sendVisible = false;

            // покажи кнопку "Отправить"
            this.sendingVisible = true;

            // проверь данные с input'а : указаны = валидны ?
            let emailIsValid = validateEmail(this.email);

            // если не валидные = значит это ошибка => покажи alert c #error через AlpineJS
            this.emailError = !emailIsValid;

            // поменяй видимость элементов и выйди из функции
            if(this.emailError){
                this.sendingVisible = false;
                this.sendVisible = true;
                return;
            }

            // если же данные валидны
            console.log("get-pricelist-form.js : Почта валидна. Буду отправлять каталог.");

            // Подготовь данные и передай их на сервер,
            // чтобы контроллер на сервере отправил уведомление в Slack и внёс запись в БД.

            // упакуй данные в JSON-объект
            let data = {
                user_email: this.email
            };

            console.log("Электронная почта для отправки каталога. Проверька :");
            console.log(data);

            // отправь эти данные => Laravel
            fetch(settings.send_pricelist_url+'?user_email='+this.email)
                .then(response => response.text()) // response.text() или response.json(), что-то ещё ?
                .then(data => {
                    /**
                     * ВАЖНО! 'this' AlpineJS компонента здесь не видно.
                     * Пример : this.successVisible = true; ошибка из-за this
                     * Поэтому управляю видимостью элементов через их id.
                     */
                    successMessage.style.display="block";
                    send.style.display="none";
                    // если захочешь спрятать через 20 секунд
                    callAfterDelay(20000, () => {
                        successMessage.style.display="none";
                        send.style.display="block";
                    });
                })
                .catch((error) => {
                    console.error('get-pricelist-form.js :  Error : ', error);
                    failureMessage.style.display="block";
                    // если захочешь спрятать через 5 секунд
                    callAfterDelay(5000, () => {
                        failureMessage.style.display="none";
                        send.style.display="block";
                    });

                })
                .finally(function () {
                    console.log("get-pricelist-form.js : Выход из общения с сервером.");
                    sendingMessage.style.display="none";
                });

            // и залогируй в БД
            logEvent("отправил каталог на : " + this.email);

        }// whenSendPressed
    }// return
}// getCommentFormProps()
