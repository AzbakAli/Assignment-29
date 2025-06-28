const firebaseConfig = {
  apiKey: "AIzaSyDK37O9OTngX7ZuH7mkmRVApFHSck59ooE",
  authDomain: "to-do-app-8a498.firebaseapp.com",
  databaseURL: "https://to-do-app-8a498-default-rtdb.firebaseio.com",
  projectId: "to-do-app-8a498",
  storageBucket: "to-do-app-8a498.firebasestorage.app",
  messagingSenderId: "453214173708",
  appId: "1:453214173708:web:64768e2f2b930589270c29"
};


const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const tasksRef = db.ref('tasks');


document.addEventListener('DOMContentLoaded', function() {
    
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');

    if (!taskInput || !addTaskBtn || !clearAllBtn || !taskList || !taskCount) {
        console.error('Critical DOM elements not found!');
        return;
    }

    
    tasksRef.on('value', (snapshot) => {
        if (!taskList) return;
        
        taskList.innerHTML = '';
        const tasks = snapshot.val() || {};
        
        Object.keys(tasks).forEach(taskId => {
            const task = tasks[taskId];
            createTaskElement(task.text, taskId);
        });
        
        updateTaskCount();
    });

    function updateTaskCount() {
        if (!taskList || !taskCount) return;
        const count = taskList.children.length;
        taskCount.textContent = `${count} ${count === 1 ? 'task' : 'tasks'}`;
    }

    function createTaskElement(taskText, taskId) {
        if (!taskList) return;
        
        const li = document.createElement('li');
        li.dataset.id = taskId;
        
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
        taskList.appendChild(li);
        
        editBtn.addEventListener('click', function() {
            const newText = prompt('Edit task:', taskText);
            if (newText !== null && newText.trim() !== '') {
                tasksRef.child(taskId).update({ text: newText.trim() });
            }
        });
        
        deleteBtn.addEventListener('click', function() {
            tasksRef.child(taskId).remove();
        });
    }

    function addTask() {
        if (!taskInput) return;
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            tasksRef.push({
                text: taskText,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            });
            taskInput.value = '';
        }
    }

    function clearAllTasks() {
        if (!taskList) return;
        if (taskList.children.length > 0) {
            if (confirm('Are you sure you want to clear all tasks?')) {
                tasksRef.remove();
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
});
