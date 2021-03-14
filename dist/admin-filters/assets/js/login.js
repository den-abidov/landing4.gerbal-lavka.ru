// 'use strict';

console.log('login.js : зашёл.');

const correctPassword = 'korkmasonmezbusafak';

function loginProps()
{
    return {
        password: getPasswordFromLS(),
        passwordWrong:false,

        checkPassword:function()
        {
            this.passwordWrong = (this.password == correctPassword) ? false:true;
            if(!this.passwordWrong) // если пароль верный
            {
                // сохрани его в LS
                localStorage.setItem("adminPassword", this.password);
                // "впусти"
                letIn();
            }
        },

        tryAgain:function()
        {
            this.passwordWrong = false;
        }

    };
}

function letIn()
{
    document.getElementById("login").style.display = "none";
    document.getElementById("settings").style.display = "block";
}

function getPasswordFromLS()
{
    let password = localStorage.getItem("adminPassword");
    if (password == null) {
        password = "";
    }
    return password;
}