
# Vunoh Global - AI Assistant Platform

This is an AI-powered web application built for the Vunoh Global Internship Practical Test. It helps the Kenyan diaspora initiate and track tasks back home (like sending money, hiring services, or verifying documents) while providing an operational dashboard for employees to manage these requests.

## Tech Stack

The backend is built using Python with Django. For the frontend, I used Vanilla HTML, CSS, and JavaScript without any external frameworks. The database utilizes SQLite, and the AI Brain is powered by the Google Gemini API using the `gemini-2.5-flash` model.

## Local Setup Instructions

Follow these steps to run the application on your local machine.

### 1. Create and activate a virtual environment

If you are using Conda, create the environment and activate it using the commands below. If you are using standard Python venv, you can use `python -m venv venv` followed by `source venv/bin/activate` or `venv\Scripts\activate` on Windows.

```bash
conda create -n vunoh_env python=3.10
conda activate vunoh_env
```

### 2. Install the required dependencies

Run the pip command to install Django, python-dotenv, and the Google GenAI SDK.

```bash
pip install django python-dotenv google-genai
```

### 3. Set up your environment variables

Create a new file named `.env` in the root folder of the project. Add your Gemini API key to it exactly as shown below.

```text
GEMINI_API_KEY="your_actual_api_key_here"
```

### 4. Setup the database

Apply the migrations to create the SQLite database and the required tables.

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Run the application

Start the Django development server using the `manage.py` script. Once running, you can access the Customer Request Portal at `http://127.0.0.1:8000/` and the Employee Dashboard at `http://127.0.0.1:8000/dashboard/`.

```bash
python manage.py runserver
```

## Decisions I made and why

### AI Tools Used

I used the Google Gemini API (`gemini-2.5-flash`) as the core AI Brain for the application because of its speed and its strong ability to reliably output structured JSON data. During development, I also used Gemini as a coding assistant to help scaffold the initial Django file structure and to brainstorm CSS grid layouts for the frontend dashboard.

### System Prompt Engineering and Risk Scoring

When I first built the prompt, the AI got lazy and started anchoring to the first intent on my list by categorizing everything as `send_money`. To fix this, I engineered the prompt to include strict conditional rules. Furthermore, I wrapped the user's input in a clear label before sending it to the API so the AI knew exactly what it was analyzing. For risk scoring, I baked the diaspora context directly into the prompt instructions. The AI was instructed to output an integer from 0 to 100 based on specific rules where land title verifications trigger a high risk due to the frequency of property fraud, while standard errands default to a low risk.

### Overriding an AI Suggestion

While building the Employee Dashboard, my AI coding assistant initially suggested keeping the customer input form and the dashboard on a single, unified page, and using a simple expanding accordion row to show task details. I overrode this suggestion entirely. I decided to separate the customer-facing input and the employee-facing dashboard into two distinct HTML pages to better reflect a real-world separation of concerns. Additionally, I scrapped the accordion rows and built a custom two-column CSS Grid layout with a dedicated side panel for task details, as it looks much more professional and is easier for an employee to read.

### A Technical Hurdle I Resolved

Midway through development, the application crashed with a `ModuleNotFoundError` and a `404 NOT_FOUND` error when trying to communicate with the Gemini API. I discovered that Google had completely deprecated the old `google.generativeai` Python SDK and removed the `gemini-1.5-flash` model. To resolve this, I had to uninstall the old package, install the new `google-genai` SDK, and completely refactor my backend logic in `llm_client.py`. I updated the code to use the new `genai.Client` syntax, implemented `GenerateContentConfig` to force the JSON response formatting, and upgraded the model string to the currently supported `gemini-2.5-flash`. This got the system back online and parsing requests perfectly.
```
