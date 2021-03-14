'use strict';

console.log('settings.js : зашёл.');

// получи конфиг с сервера
let config = getConfigFromServer();
console.log("Получил config с сервера :");
logConfig(config);

// теперь сохрани в LS
saveConfigToLS(config);
console.log("Сохранил config в LS.");

function settingsProps()
{
    return {

        // присвой значения настроек переменным компонента
        siteIsOn: config.siteIsOn,
        mobileOnly: config.mobileOnly,
        filterIp: config.filterIp,

        /*
         * В JS примитивные переменные передаются в методы только по значению.
         * По ссылке передаются только массивы и объекты.
         * Мне нужно передать в метод showMatchingCase() по ссылке реактивное свойство showCase.
         * Но т.к. я не могу этого сделать с примитивной переменной, вынужден использовать объект show.
         */
        //show:{'case':0}, /* не могу передать примитивную переменную по ссылке*/
        showCase:0,

        // вызывается при нажатии на чек-бокс => обновление фильтра
        filterUpdated:function(f,v){
            // f - filter name
            // v - filter value
            config = updateConfigWith(config, f,v,);

            saveConfigToServer(config);

            config = getConfigFromServer();

            saveConfigToLS(config);

            applyConfigToProps(this.siteIsOn, this.mobileOnly, this.filterIp);

            //showMatchingCase(this.show, this.siteIsOn, this.mobileOnly, this.filterIp)
            this.showCase = getCaseNumberFor(this.siteIsOn, this.mobileOnly, this.filterIp);
        }
    }
}

function applyConfigToProps(siteIsOn_, mobileOnly_, filterIp_)
{
    let config = getConfigFromLS();
    siteIsOn_ = config.siteIsOn;
    mobileOnly_ = config.mobileOnly;
    filterIp_ = config.filterIp;
}

function getCaseNumberFor(siteIsOn, mobileOnly, filterIp)
{
    let showCase = 0;
    if(!siteIsOn) showCase=0;
    if(siteIsOn && mobileOnly && filterIp) showCase=1;
    if(siteIsOn && mobileOnly && !filterIp) showCase=2;
    if(siteIsOn && !mobileOnly && filterIp) showCase=3;
    if(siteIsOn && !mobileOnly && !filterIp) showCase=4;
    return showCase;
}