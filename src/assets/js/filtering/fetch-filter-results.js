// API-запрос
function fetchFilterResults()
{
    // отправь данные на проверку фильтрам
    fetch(settings.filters_url, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text-plain, */*",
            "X-Requested-With": "XMLHttpRequest",
            // не использую : "X-CSRF-TOKEN": token
        },
        method: 'post',
        credentials: "same-origin",
        body: JSON.stringify(client)
    })
        .then(response => response.json()) // response.text() или response.json(), что-то ещё ?
        .then(json => {
            console.log(json);
            // сохрани результаты в SS
            setFilterResults(json);
            // среагируй на результаты фильтров
            checkFilterResults();
        })
        .catch((error) => {
           console.error('fetch-filter-results.js :  Error : ', error);
        })
        .finally(function () {
            console.log("fetch-filter-results.js : Выход из общения с сервером.");
        });
}