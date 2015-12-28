'use strict';


var addOption = document.getElementById('options-more');
var optionsList = document.getElementById('options-list');
(function () {
    
    
    addOption.addEventListener('click', function() {
        var option = document.createElement('input')
        option.setAttribute("type", "text");
        option.setAttribute('class', 'form-control');
        option.setAttribute('name', 'options');
        optionsList.appendChild(option);
    }, false)
    
})();
//    var addButton = document.querySelector('.btn-add');
//    var deleteButton = document.querySelector('.btn-delete');
//    var clickNbr = document.querySelector('#click-nbr');
//    var apiUrl = appUrl + '/api/:id/clicks';

//    function updateClickCount (data) {
//       var clicksObject = JSON.parse(data);
//       clickNbr.innerHTML = clicksObject.clicks;
//    }

//    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount));

//    addButton.addEventListener('click', function () {

//       ajaxFunctions.ajaxRequest('POST', apiUrl, function () {
//          ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
//       });

//    }, false);

//    deleteButton.addEventListener('click', function () {

//       ajaxFunctions.ajaxRequest('DELETE', apiUrl, function () {
//          ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
//       });

//    }, false);

// 
