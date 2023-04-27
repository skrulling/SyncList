const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Render tasks
function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('task-item');
        li.dataset.taskId = task.id;
        li.textContent = task.text;

        if (task.done) {
            li.classList.add('done');
        }

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('removeBtn');
        removeBtn.textContent = 'X';
        li.appendChild(removeBtn);

        taskList.appendChild(li);
    });
}

// Add task
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();

    if (taskText.length > 0) {
        const task = {
            id: Date.now(),
            text: taskText,
            done: false
        };
        taskInput.value = '';
        sendAddTask(task);
    }
});

// Press Enter to add task
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTaskBtn.click();
    }
});

// Toggle task status
taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('task-item')) {
        const taskId = parseInt(e.target.dataset.taskId);
        sendToggleTask(taskId);
    }
});

// Remove task
taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('removeBtn')) {
        const taskId = parseInt(e.target.parentElement.dataset.taskId);
        sendRemoveTask(taskId);
    }
});

// Request initial tasks
function requestInitialTasks() {
    socket.send(JSON.stringify({ type: 'request_init' }));
}

// ...existing code...

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    requestInitialTasks();
});

