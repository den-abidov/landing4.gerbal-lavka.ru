// Cохранение и получение результатов работы фильтров в Session Storage.
// filtersChecked : true|false - фильтра в данной сессии уже были проверены или ещё нет
// filterResults, data - JSON-объект, который получаешь в ответе сервера

function filtersChecked()
{
    return JSON.parse(sessionStorage.getItem("filtersChecked"));
}

function setFilterResults(data)
{
    sessionStorage.setItem("filterResults", JSON.stringify(data));
    sessionStorage.setItem("filtersChecked", JSON.stringify(true));
}

function getFilterResults()
{
    return JSON.parse(sessionStorage.getItem("filterResults"));
}

