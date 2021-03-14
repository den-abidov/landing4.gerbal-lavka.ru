/**
 * Получает из Session Storage результаты фильтров и реагирует на них.
 */
function checkFilterResults()
{
    let filters = getFilterResults();

    // если фильтры ещё не провели проверку, просто выйди
    if(!filtersChecked()) return;

    // если фильтры уже провели проверку ...

    // если проверка успешно пройдена - спрячь заставку - покажи контент
    if(filters.passed) showContent();

    // это бот : ничего не делай, просто выйди из проверки
    if (filters.is_bot) return;

    // далее, это уже не бот ...

    // проверка не пройдена : => 404
    if(!filters.passed) window.location.href = "/404.html";

    // далее, проверка пройдена ...

    // редирект не используется : ничего не делай, просто выйди
    if (!filters.uses_redirect) return;

    // редирект используется
    if (filters.uses_redirect && (filters.redirect_to.length>0))
    {
        /* Cформируй ссылку для редиректа.
         * Полезная статья, про парсинг url JS'ом : https://dmitripavlutin.com/parse-url-javascript/
         * Пример :
         * window.location.href     => https://shop.gerbal-lavka.ru/catalog?user_phone=89528900109
         * window.location.hostname => shop.gerbal-lavka.ru
         * window.location.pathname => /catalog
         * window.location.search   => ?user_phone=89528900109
         */
        let newUrl = "https://" + filters.redirect_to + window.location.pathname + window.location.search;
        console.log("check-filter-results.js : Будет редирект на : " + newUrl);
        window.location.href = newUrl;
        console.log("check-filter-results.js : Редирект принудительно остановлен.");

    }
    console.log("check-filter-results.js : Проверка завершена.");
}