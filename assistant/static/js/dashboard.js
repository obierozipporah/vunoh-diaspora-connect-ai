document.addEventListener('DOMContentLoaded', () => {
    const tasksContainer = document.getElementById('tasks-container');

    async function loadTasks() {
        try {
            const response = await fetch('/api/tasks/');
            const tasks = await response.json();
            
            tasksContainer.innerHTML = '';
            
            tasks.forEach(task => {
                const riskLevel = task.risk_score >= 60 ? 'high' : 'low';
                const row = document.createElement('div');
                row.className = 'task-row';
                
                row.innerHTML = `
                    <div class="task-col">
                        <span>Task Code</span>
                        <strong>${task.task_code}</strong>
                    </div>
                    <div class="task-col">
                        <span>Intent</span>
                        <strong>${task.intent.replace(/_/g, ' ').toUpperCase()}</strong>
                    </div>
                    <div class="task-col">
                        <span>Status</span>
                        <div class="status-badge status-${task.status.replace(' ', '')}">${task.status}</div>
                    </div>
                    <div class="task-col">
                        <span>Risk Score</span>
                        <strong class="risk-badge ${riskLevel}">${task.risk_score} ${riskLevel.toUpperCase()}</strong>
                    </div>
                    <div class="task-col">
                        <span>Assigned To</span>
                        <strong>${task.employee_assignment}</strong>
                    </div>
                    
                    <div class="task-details">
                        <div>
                            <span style="color:#9ca3af; font-size:12px;">Entities</span>
                            <pre style="margin:5px 0 15px 0; font-size:12px; color:#f3f4f6;">${JSON.stringify(task.entities, null, 2)}</pre>
                            <span style="color:#9ca3af; font-size:12px;">Update Status</span>
                            <select onchange="updateTaskStatus(${task.id}, this.value)" style="background:transparent; color:white; border:1px solid #374151; padding:5px; border-radius:4px; margin-top:5px;">
                                <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            </select>
                        </div>
                        <div>
                            <span style="color:#9ca3af; font-size:12px; display:block; margin-bottom:5px;">Generated Messages</span>
                            <div class="msg-box"><strong>WhatsApp:</strong><br>${task.whatsapp_message}</div>
                            <div class="msg-box"><strong>SMS:</strong><br>${task.sms_message}</div>
                            <div class="msg-box"><strong>Email:</strong><br>${task.email_message}</div>
                        </div>
                    </div>
                `;
                
                row.addEventListener('click', (e) => {
                    if(e.target.tagName !== 'SELECT') {
                        row.classList.toggle('expanded');
                    }
                });
                
                tasksContainer.appendChild(row);
            });
        } catch (error) {
            tasksContainer.innerHTML = `<p style="color:red">Failed to load: ${error.message}</p>`;
        }
    }

    window.updateTaskStatus = async function(taskId, newStatus) {
        try {
            await fetch(`/api/tasks/${taskId}/update/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            loadTasks(); 
        } catch(err) {
            alert('Failed to update status');
        }
    }

    loadTasks();
});