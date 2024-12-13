class Matrix {
    constructor() {
        this.quadrants = document.querySelectorAll('.matrix-quadrant');
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        this.quadrants.forEach(quadrant => {
            quadrant.addEventListener('dragover', this.handleDragOver);
            quadrant.addEventListener('drop', this.handleDrop.bind(this));
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDrop(e) {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        const taskElement = document.getElementById(taskId);
        const rect = e.currentTarget.getBoundingClientRect();
        
        const urgency = (e.clientX - rect.left) / rect.width;
        const importance = 1 - ((e.clientY - rect.top) / rect.height);

        // タスクデータを更新
        const taskData = this.getTaskData(taskElement);
        taskData.urgency = urgency;
        taskData.importance = importance;

        // ローカルストレージを更新
        this.updateTaskInStorage(taskData);

        // UIを更新
        taskManager.loadTasks();
    }

    getQuadrantForTask(urgency, importance) {
        if (importance >= 0.5 && urgency >= 0.5) return 'do-first';
        if (importance >= 0.5 && urgency < 0.5) return 'schedule';
        if (importance < 0.5 && urgency >= 0.5) return 'delegate';
        return 'eliminate';
    }

    getTaskData(taskElement) {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const taskId = taskElement.id.replace('task-', '');
        return tasks.find(task => task.id === parseInt(taskId));
    }

    updateTaskInStorage(updatedTask) {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const index = tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
            tasks[index] = updatedTask;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }
}
