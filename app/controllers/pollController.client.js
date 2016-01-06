'use strict';


var moreOptions = document.getElementById('options-more');
var optionsList = document.getElementById('options-list');

(function () {
    
    moreOptions.addEventListener('click', function() {
        var option = document.createElement('input')
        option.setAttribute("type", "text");
        option.setAttribute('class', 'form-control');
        option.setAttribute('name', 'options');
        optionsList.appendChild(option);
    }, false)
    
})();