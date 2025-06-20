document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');

    function updateTaskCount() {
        const count = taskList.children.length;
        taskCount.textContent = `${count} ${count === 1 ? 'task' : 'tasks'}`;
    }

    function createTaskElement(taskText) {
        const li = document.createElement('li');
        
        const taskSpan = document.createElement('span');
        taskSpan.className = 'task-text';
        taskSpan.textContent = taskText;
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        
        li.appendChild(taskSpan);
        li.appendChild(actionsDiv);
        
        editBtn.addEventListener('click', function() {
            const newText = prompt('Edit task:', taskText);
            if (newText !== null && newText.trim() !== '') {
                taskSpan.textContent = newText.trim();
            }
        });
        
        deleteBtn.addEventListener('click', function() {
            taskList.removeChild(li);
            updateTaskCount();
        });
        
        return li;
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        
        if (taskText !== '') {
            const taskElement = createTaskElement(taskText);
            taskList.appendChild(taskElement);
            taskInput.value = '';
            updateTaskCount();
        }
    }

    function clearAllTasks() {
        if (taskList.children.length > 0) {
            if (confirm('Are you sure you want to clear all tasks?')) {
                while (taskList.firstChild) {
                    taskList.removeChild(taskList.firstChild);
                }
                updateTaskCount();
            }
        }
    }

    addTaskBtn.addEventListener('click', addTask);
    clearAllBtn.addEventListener('click', clearAllTasks);
    
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    updateTaskCount();
});