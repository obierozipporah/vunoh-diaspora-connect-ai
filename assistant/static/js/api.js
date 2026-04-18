document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('request-form');
    const input = document.getElementById('user-input');
    const submitBtn = document.getElementById('submit-btn');
    const responseMessage = document.getElementById('response-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        submitBtn.disabled = true;
        submitBtn.textContent = "PROCESSING...";
        responseMessage.textContent = "";

        try {
            const response = await fetch('/api/process/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text })
            });

            const data = await response.json();
            
            if (response.ok) {
                input.value = '';
                responseMessage.style.color = '#10b981';
                responseMessage.textContent = "Request logged successfully. View dashboard to see task.";
            } else {
                responseMessage.style.color = '#ef4444';
                responseMessage.textContent = data.error;
            }
        } catch (error) {
            responseMessage.style.color = '#ef4444';
            responseMessage.textContent = "Network error.";
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "SUBMIT REQUEST";
        }
    });
});