document.addEventListener('DOMContentLoaded', () => {
    const tasksContainer = document.getElementById('tasks-container');

    // Function to load and render tasks
    async function loadTasks() {
        try {
            const response = await fetch('/api/tasks/');
            const tasks = await response.json();

            if (tasks.length === 0) {
                tasksContainer.innerHTML = '<p>No tasks found in the database.</p>';
                return;
            }

            tasksContainer.innerHTML = ''; // Clear loading text

            tasks.forEach(task => {
                const riskClass = task.risk_score >= 60 ? 'badge-high-risk' : 'badge-low-risk';
                
                // Parse generated steps array from JSON if needed
                let stepsHTML = '';
                if (task.generated_steps && Array.isArray(task.generated_steps)) {
                    stepsHTML = task.generated_steps.map(step => `<li>${step}</li>`).join('');
                }

                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <h3>${task.task_code} | ${task.intent}</h3>
                        <div>
                            <span class="badge ${riskClass}">Risk Score: ${task.risk_score}</span>
                            <span class="badge" style="background:#e5e7eb; color:black; margin-left:10px;">Assigned: ${task.employee_assignment}</span>
                        </div>
                    </div>
                    
                    <div class="task-grid">
                        <div>
                            <strong>Extracted Entities:</strong>
                            <pre style="font-size:12px; background:#f9fafb; padding:8px; border-radius:4px;">${JSON.stringify(task.entities, null, 2)}</pre>
                        </div>
                        <div>
                            <strong>Execution Steps:</strong>
                            <ul style="font-size:14px; margin-top:5px; padding-left:20px;">
                                ${stepsHTML}
                            </ul>
                        </div>
                    </div>

                    <div style="margin-top: 15px;">
                        <strong>Generated Messages:</strong>
                        <div class="task-grid">
                            <div class="message-box"><strong>WhatsApp:</strong><br>${task.whatsapp_message}</div>
                            <div class="message-box"><strong>SMS:</strong><br>${task.sms_message}</div>
                            <div class="message-box" style="grid-column: span 2;"><strong>Email:</strong><br>${task.email_message}</div>
                        </div>
                    </div>

                    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px;">
                        <strong>Status:</strong>
                        <select id="status-${task.id}" style="padding: 5px; border-radius: 4px;">
                            <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        </select>
                        <button onclick="updateStatus(${task.id})" style="padding: 5px 10px; font-size: 14px;">Update Status</button>
                    </div>
                `;
                tasksContainer.appendChild(card);
            });
        } catch (error) {
            tasksContainer.innerHTML = `<p style="color: red;">Failed to load tasks: ${error.message}</p>`;
        }
    }

    // Load tasks immediately on page load
    loadTasks();
});

// Function to handle the status update button click
async function updateStatus(taskId) {
    const selectElement = document.getElementById(`status-${taskId}`);
    const newStatus = selectElement.value;

    try {
        const response = await fetch(`/api/tasks/${taskId}/update/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            alert('Status updated successfully!');
        } else {
            alert('Failed to update status.');
        }
    } catch (error) {
        alert('Error updating status: ' + error.message);
    }
}