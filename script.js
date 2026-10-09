var displayClock = document.getElementById('timerDisplay');
var startBtn = document.getElementById('startBtn');
var pauseBtn = document.getElementById('pauseBtn');
var resetBtn = document.getElementById('resetBtn');

var focusInput = document.getElementById('focusInput');
var breakInput = document.getElementById('breakInput');
var focusHoursSpan = document.getElementById('focusHours');

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
    displayClock.textContent = minsFormatted + ':' + secsFormatted;
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
                var minsAdded = parseFloat(focusInput.value) || 25;
                accumulatedMins += minsAdded;
                focusHoursSpan.textContent = (accumulatedMins / 60).toFixed(2) + ' hrs';

                alert('Focus session done! Time for a break.');
                isBreakMode = true;
                secsLeft = (parseFloat(breakInput.value) || 5) * 60;
            } else {
                alert('Break time over! Back to work.');
                isBreakMode = false;
                secsLeft = (parseFloat(focusInput.value) || 25) * 60;
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
    secsLeft = (parseFloat(focusInput.value) || 25) * 60;
    updateDisplay();
};

focusInput.onchange = function() {
    if (!isBreakMode) {
        secsLeft = (parseFloat(focusInput.value) || 1) * 60;
        updateDisplay();
    }
};

breakInput.onchange = function() {
    if (isBreakMode) {
        secsLeft = (parseFloat(breakInput.value) || 1) * 60;
        updateDisplay();
    }
};

document.getElementById('preset15').onclick = function() { focusInput.value = 15; isBreakMode = false; secsLeft = 15 * 60; updateDisplay(); };
document.getElementById('preset25').onclick = function() { focusInput.value = 25; isBreakMode = false; secsLeft = 25 * 60; updateDisplay(); };
document.getElementById('preset45').onclick = function() { focusInput.value = 45; isBreakMode = false; secsLeft = 45 * 60; updateDisplay(); };

var taskInput = document.getElementById('taskInput');
var addTaskBtn = document.getElementById('addTaskBtn');
var taskList = document.getElementById('taskList');
var doneCountSpan = document.getElementById('doneCount');

var tasksDoneCount = 0;

if (addTaskBtn) {
    addTaskBtn.onclick = function() {
        var text = taskInput.value.trim();
        if (!text) return;

        var li = document.createElement('li');
        li.className = 'flex justify-between items-center bg-[#0b0c10] border border-slate-800 p-2 rounded';
        li.innerHTML = '<span>' + text + '</span><button class="bg-red-800 hover:bg-red-700 text-xs text-white px-1.5 py-0.5 rounded">✔</button>';

        var checkBtn = li.querySelector('button');
        checkBtn.onclick = function() {
            li.classList.add('line-through', 'text-slate-600');
            checkBtn.remove();
            tasksDoneCount++;
            doneCountSpan.textContent = tasksDoneCount;
        };

        taskList.appendChild(li);
        taskInput.value = '';
    };
}