class TaskManager {
    constructor() {
        this.matrix = new Matrix();
        this.setupEventListeners();
        this.loadTasks();
    }

    setupEventListeners() {
        document.getElementById('task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTask();
        });

        document.getElementById('task-modal').addEventListener('hidden.bs.modal', () => {
            document.getElementById('task-form').reset();
        });
    }

    loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        
        document.querySelectorAll('.matrix-quadrant').forEach(quadrant => {
            quadrant.querySelector('.tasks').innerHTML = '';
        });

        tasks.forEach(task => this.renderTask(task));
    }

    createTask() {
        const formData = new FormData(document.getElementById('task-form'));
        const task = {
            id: Date.now(),
            title: formData.get('title'),
            description: formData.get('description'),
            urgency: parseFloat(formData.get('urgency')),
            importance: parseFloat(formData.get('importance')),
            due_date: formData.get('due_date'),
            created_at: new Date().toISOString()
        };

        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        const modal = bootstrap.Modal.getInstance(document.getElementById('task-modal'));
        modal.hide();
        
        this.loadTasks();
    }

    renderTask(task) {
        const quadrant = this.matrix.getQuadrantForTask(task.urgency, task.importance);
        const taskElement = document.createElement('div');
        taskElement.id = `task-${task.id}`;
        taskElement.className = 'task';
        taskElement.draggable = true;
        
        const dueDate = task.due_date ? 
            new Date(task.due_date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }) : '期限なし';

        taskElement.innerHTML = `
            <h5 class="task-title mb-2">${task.title}</h5>
            <p class="task-description text-truncate mb-2">${task.description || '説明なし'}</p>
            <div class="task-meta text-muted">
                <small>期限: ${dueDate}</small>
            </div>
        `;

        taskElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', taskElement.id);
        });

        taskElement.addEventListener('click', () => this.showTaskDetails(task));

        document.querySelector(`#${quadrant} .tasks`).appendChild(taskElement);
    }

    showTaskDetails(task) {
        const modal = new bootstrap.Modal(document.getElementById('task-detail-modal'));
        document.getElementById('task-detail-title').textContent = task.title;
        document.getElementById('task-detail-description').textContent = task.description || '説明なし';
        
        const dueDate = task.due_date ? 
            new Date(task.due_date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }) : '期限なし';
        
        document.getElementById('task-detail-due-date').textContent = dueDate;
        modal.show();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
});
