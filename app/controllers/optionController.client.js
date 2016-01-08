'use strict';


var showOptions = document.getElementById('options-show');
var optionsList = document.getElementById('options-list');
var addOption = document.getElementById('options-add');
var moreOptions = document.getElementById('options-more');

(function () {
    
    showOptions.addEventListener('click', function() {
        addOption.style.display = 'block';
        this.style.display = 'none';
    }, false)
    
    moreOptions.addEventListener('click', function() {
        var option = document.createElement('input')
        option.setAttribute("type", "text");
        option.setAttribute('class', 'form-control');
        option.setAttribute('name', 'options');
        optionsList.appendChild(option);
    }, false)
})();