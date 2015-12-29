'use strict';

(function () {
    
    var deleteButton = document.getElementsByClassName('btn-delete');
    
    for (var i = 0; i < deleteButton.length; i++) {
        deleteButton[i].addEventListener('click', deletePoll, false);
    }
    function deletePoll() {
        var pollName = this.previousSibling.innerText;
        var form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', 'deletepoll');
        form.style.display = 'hidden';
        var pollInput = document.createElement('input');
        pollInput.setAttribute('name', 'pollToDelete');
        pollInput.value = pollName;
        form.appendChild(pollInput);
        document.body.appendChild(form);
        form.submit();
    }
    
})();
