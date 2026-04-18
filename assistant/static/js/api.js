document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('request-form');
    const input = document.getElementById('user-input');
    const submitBtn = document.getElementById('submit-btn');
    const responseArea = document.getElementById('response-area');
    const responseMessage = document.getElementById('response-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const text = input.value.trim();
        if (!text) return;

        // UI Loading State
        submitBtn.disabled = true;
        submitBtn.textContent = "Processing with AI...";
        responseArea.style.display = 'none';

        try {
            const response = await fetch('/api/process/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text })
            });

            const data = await response.json();

            responseArea.style.display = 'block';
            if (response.ok) {
                responseMessage.style.color = 'green';
                responseMessage.textContent = `Success! ${data.message}. Task Code: ${data.task_code}`;
                input.value = ''; // Clear input on success
            } else {
                responseMessage.style.color = 'red';
                responseMessage.textContent = `Error: ${data.error}`;
            }
        } catch (error) {
            responseArea.style.display = 'block';
            responseMessage.style.color = 'red';
            responseMessage.textContent = `Connection error: ${error.message}`;
        } finally {
            // Restore UI
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Request";
        }
    });
});