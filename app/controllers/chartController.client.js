'use strict';

    
    var poll = myPoll;
    var ctx = document.getElementById("myChart").getContext('2d');
    var data = {
        labels: [],
        datasets: [
            {
                fillColor: '#81d8d0',
                strokeColor: '#67aca6',
                highlightFill: '#9adfd9',
                highlightStroke: '#81d8d0',
                data: []
            }
        ]
        
    };
    
    function addData(data, cb) {
       for (var i = 0; i < poll.options.length; i++) {
            data.labels.push(poll.options[i].option);
            data.datasets[0].data.push(poll.options[i].votes);
            if (i === poll.options.length-1) {
                cb();
            }
        }
    }
    
addData(data, function() {
    console.log(data);
    var myNewChart = new Chart(ctx).Bar(data);
})