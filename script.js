var dispClock = document.getElementById('timerDisp');
var startBtn = document.getElementById('startBtn');
var pauseBtn = document.getElementById('pauseBtn');
var resetBtn = document.getElementById('resetBtn');
var focusInp = document.getElementById('focusInp');
var breakInp = document.getElementById('breakInp');
var focusHrsSpan = document.getElementById('focusHrs');
var secsLeft = 25 * 60;
var timerId = null;
var isBreakMode = false;
var accumulatedMins = 0;
function updateDisplay() {
    var mins = Math.floor(secsLeft / 60);
    var secs = Math.round(secsLeft % 60);
    if (secs === 60) {
        mins += 1;
        secs = 0;
    }
    var minsFormatted = mins < 10 ? '0' + mins : mins;
    var secsFormatted = secs < 10 ? '0' + secs : secs;
    dispClock.textContent = minsFormatted + ':' + secsFormatted;
}
startBtn.onclick = function() {
    if (timerId !== null) return;
    timerId = setInterval(function() {
        if (secsLeft > 0) {
            secsLeft--;
            updateDisplay();
        } else {
            var ctx = new (window.AudioContext || window.webkitAudioContext)();
            var osc = ctx.createOscillator();
            osc.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
            if (!isBreakMode) {
                var minsAdded = parseFloat(focusInp.value) || 25;
                accumulatedMins += minsAdded;
                focusHrsSpan.textContent = (accumulatedMins / 60).toFixed(2) + ' hrs';
                alert('Focus session done! Time for a break.');
                isBreakMode = true;
                secsLeft = (parseFloat(breakInp.value) || 5) * 60;
            } else {
                alert('Break time over! Back to work.');
                isBreakMode = false;
                secsLeft = (parseFloat(focusInp.value) || 25) * 60;
            }
            updateDisplay();
            clearInterval(timerId);
            timerId = null;
        }
    }, 1000);
};
pauseBtn.onclick = function() {
    clearInterval(timerId);
    timerId = null;
};
resetBtn.onclick = function() {
    clearInterval(timerId);
    timerId = null;
    isBreakMode = false;
    secsLeft = (parseFloat(focusInp.value) || 25) * 60;
    updateDisplay();
};
focusInp.onchange = function() {
    if (!isBreakMode) {
        secsLeft = (parseFloat(focusInp.value) || 1) * 60;
        updateDisplay();
    }
};
breakInp.onchange = function() {
    if (isBreakMode) {
        secsLeft = (parseFloat(breakInp.value) || 1) * 60;
        updateDisplay();
    }
};
document.getElementById('preset15').onclick = function() { focusInp.value = 15; isBreakMode = false; secsLeft = 15 * 60; updateDisplay(); };
document.getElementById('preset25').onclick = function() { focusInp.value = 25; isBreakMode = false; secsLeft = 25 * 60; updateDisplay(); };
document.getElementById('preset45').onclick = function() { focusInp.value = 45; isBreakMode = false; secsLeft = 45 * 60; updateDisplay(); };
var taskInp = document.getElementById('taskInp');
var addTaskBtn = document.getElementById('addTaskBtn');
var taskList = document.getElementById('taskList');
var doneCountSpan = document.getElementById('doneCount');
var tasksDoneCount = 0;
if (addTaskBtn) {
    addTaskBtn.onclick = function() {
        var text = taskInp.value.trim();
        if (!text) return;
        var li = document.createElement('li');
        li.innerHTML = '<span>' + text + '</span><button>✔</button>';
        var checkBtn = li.querySelector('button');
        checkBtn.onclick = function() {
            if (!li.classList.contains('done')) {
                li.classList.add('done');
                checkBtn.style.display = 'none';
                tasksDoneCount++;
                doneCountSpan.textContent = tasksDoneCount;
            }
        };
        taskList.appendChild(li);
        taskInp.value = '';
    };
}