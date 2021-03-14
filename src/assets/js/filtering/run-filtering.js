if(settings.check_once && filtersChecked())
{
    console.log('run-filtering.js : повторная проверка фильтров не требуется.');
    checkFilterResults();
}
else
{
    console.log('run-filtering.js : требуется проверка фильтров.');
    fetchFilterResults();
}