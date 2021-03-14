console.log("comment-form.js : зашёл.");

/*
 * Зависит от
 * js/settings.js
 * js/utils.js
 * js/get-from-LS.js
 * sass/_comment-form.scss
 * partials/product-page/comment-form.html
 */
function getCommentFormProps()
{
    const subject_ = document.getElementById("subject").value;

    // DOM элементы
    const send = document.getElementById("send-comment");
    const sendingMessage = document.getElementById("sending-comment");
    const successMessage = document.getElementById("comment-sent-success");
    const failureMessage = document.getElementById("comment-sent-failure");

    return{
        subject:  subject_,
        site: settings.site_name,
        deviceId:getDeviceIdFromLS(),
        name: getUserNameFromLS(),
        phone: getUserPhoneFromLS(),
        place:'',
        comment: '',

        nameError:false,
        commentError:false,

        errorVisible:false,
        sendVisible:true,
        sendingVisible:false,
        successVisible:false,
        failureVisible:false,

        removeErrorMessages:function(){
            this.nameError = false;
            this.commentError = false;

            this.sendVisible = true;
            this.sendingVisible = false;
            this.successVisible = false;
            this.failureVisible = false;
        },

        whenSendPressed:function(){

            // спрячь кнопку "Позвоните мне"
            this.sendVisible = false;

            // покажи кнопку "Отправляем заявку"
            this.sendingVisible = true;

            // проверь данные с input'а : указаны = валидны ?
            let nameIsValid = this.name.length>0;
            let commentIsValid = this.comment.length>0;

            // если не валидные = значит это ошибка => покажи alert c #error через AlpineJS
            this.nameError = !nameIsValid;
            this.commentError = !commentIsValid;

            // поменяй видимость элементов и выйди из функции
            if(this.nameError || this.commentError){
                this.sendingVisible = false;
                this.sendVisible = true;
                return;
            }

            // если же данные валидны
            console.log("comment-form.js : Данные комментария валидны. Буду отправлять комментарий.");

            // Проверь : если это отзыв покупателяы, то получи значение поля "откуда"
            let comment_ = this.comment;
            if(subject_ === "отзыв покупателя")
            {
                comment_ = "<u>Откуда пользователь</u> : " + this.place + "<br/><u>Текст комментария</u> : " + this.comment;
            }

            // Подготовь данные и передай их на сервер,
            // чтобы контроллер на сервере отправил уведомление в Slack и внёс запись в БД.

            // упакуй данные в JSON-объект
            let data = {
                subject: this.subject,
                site: settings.site_name,
                device_id: this.deviceId,
                user_name: this.name,
                user_phone: this.phone,
                comment: comment_
            };

            console.log("Данные для отправки комментария. Проверька их :");
            console.log(data);

            // отправь эти данные => Laravel
            fetch(settings.send_comment_url, {
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
                    send.style.display="none";
                    // если захочешь спрятать через 20 секунд
                    callAfterDelay(20000, () => {
                        successMessage.style.display="none";
                        send.style.display="block";
                    });
                })
                .catch((error) => {
                    console.error('comment-form.js :  Error : ', error);
                    failureMessage.style.display="block";
                    // если захочешь спрятать через 5 секунд
                    callAfterDelay(5000, () => {
                        failureMessage.style.display="none";
                        send.style.display="block";
                    });

                })
                .finally(function () {
                    console.log("comment-form.js : Выход из общения с сервером.");
                    sendingMessage.style.display="none";
                });

            // и залогируй в БД
            logEvent(subject_);

        }// whenSendPressed
    }// return
}// getCommentFormProps()

// Legacy. По правде здесь не используется.
function setPageName(pageName)
{
    localStorage.setItem("currentPageInLS","продуктовая страница - "+pageName);
}
function getPageName()
{
    return localStorage.getItem("currentPageInLS");
}