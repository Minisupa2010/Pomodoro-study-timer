document.addEventListener('DOMContentLoaded', () => {
    let timer;
    let time;
    let isRunning = false;
    let mode = 'focus'; // 'focus', 'short', 'long'

    const timeSettings = {
        focus: 25 * 60,
        short: 5 * 60,
        long: 15 * 60,
    };
    time = timeSettings.focus;

    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('start');
    const resetBtn = document.getElementById('reset');
    const themeToggle = document.getElementById('theme-toggle');
    const fullscreenToggle = document.getElementById('fullscreen-toggle');
    
    const modeButtons = document.querySelectorAll('.mode-button');
    const addTaskBtn = document.getElementById('add-task');
    const newTaskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');

    function updateTimerDisplay() {
        const minutes = Math.floor(time / 60).toString().padStart(2, '0');
        const seconds = (time % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${minutes}:${seconds}`;
        document.title = `${minutes}:${seconds} - Pomodoro`;
    }

    function switchMode(newMode) {
        mode = newMode;
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = 'Start';
        time = timeSettings[mode];
        updateTimerDisplay();

        modeButtons.forEach(button => {
            button.classList.remove('active');
            if(button.id === `mode-${mode}`) {
                button.classList.add('active');
            }
        });
    }

    function startTimer() {
        if (isRunning) {
            clearInterval(timer);
            isRunning = false;
            startBtn.textContent = 'Start';
        } else {
            isRunning = true;
            startBtn.textContent = 'Pause';
            timer = setInterval(() => {
                if (time > 0) {
                    time--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timer);
                    isRunning = false;
                    startBtn.textContent = 'Start';
                    // Automatically switch to the next appropriate mode
                    if (mode === 'focus') {
                        switchMode('short');
                    } else {
                        switchMode('focus');
                    }
                    new Audio('https://www.soundjay.com/buttons/sounds/button-1.mp3').play(); // Notification sound
                }
            }, 1000);
        }
    }

    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = 'Start';
        time = timeSettings[mode];
        updateTimerDisplay();
    }
    
    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText === '') return;
        
        const li = document.createElement('li');
        
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = taskText;
        span.onclick = () => li.classList.toggle('completed');

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-task';
        deleteBtn.textContent = '×';
        deleteBtn.onclick = () => li.remove();
        
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
        
        newTaskInput.value = '';
    }

    // Event Listeners
    startBtn.onclick = startTimer;
    resetBtn.onclick = resetTimer;
    
    modeButtons.forEach(button => {
        button.onclick = () => switchMode(button.id.replace('mode-', ''));
    });

    addTaskBtn.onclick = addTask;
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Theme Toggle
    themeToggle.onclick = () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    };

    // Fullscreen Toggle
    fullscreenToggle.onclick = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.log(err));
        } else {
            document.exitFullscreen();
        }
    };

    // Load initial theme
    if (localStorage.getItem('theme') === 'dark' || (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))) {
        document.body.classList.add('dark');
    }

    // Initial setup
    updateTimerDisplay();
});