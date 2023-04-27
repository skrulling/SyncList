const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
        case 'init':
            renderTasks(data.payload);
            break;
        case 'update':
            renderTasks(data.payload);
            break;
        case 'add':
            addTask(data.payload);
            break;
        default:
            break;
    }
});

function sendAddTask(task) {
    socket.send(JSON.stringify({ type: 'add', payload: task }));
}

function sendRemoveTask(id) {
    socket.send(JSON.stringify({ type: 'remove', payload: { id } }));
}

function sendToggleTask(id) {
    socket.send(JSON.stringify({ type: 'toggle', payload: { id } }));
}
