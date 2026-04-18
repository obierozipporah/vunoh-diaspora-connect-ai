# Vunoh Global AI Assistant

## Overview
This is an AI-powered web application built to solve a specific, real-world problem for Kenyans living abroad. Often, members of the diaspora struggle to manage important tasks back home, relying on slow, informal channels like phone calls, word of mouth, or WhatsApp messages to relatives. Because these methods are unreliable and leave no audit trail when things go wrong, this platform provides a centralized, intelligent alternative. 

The application acts as a smart assistant that helps customers seamlessly initiate, manage, and track essential core services from overseas.

## What the Application Does
The platform replaces disjointed communications with an intelligent, structured workflow designed for the diaspora context. Key capabilities include:

* **Natural Language Processing:** Users can type out their requests in plain English via a simple interface (e.g., requesting to send money, verify a land title, or hire a cleaner).
* **Intelligent Intent Extraction:** The AI analyzes the user's message to instantly identify the specific service required and extracts crucial details (entities) such as the amount, recipient, location, or urgency.
* **Automated Task Generation:** Once a request is understood, the system transforms it into a structured task complete with a unique tracking code, allowing users to easily follow up.
* **Actionable Step Planning:** The AI maps out a logical sequence of specific steps required to fulfill the user's request (e.g., identity verification followed by transfer initiation for a money request).
* **Contextual Risk Scoring:** The system automatically calculates a risk score for each request based on factors like high urgency, large financial amounts, or sensitive document types to ensure secure processing.
* **Smart Employee Routing:** Tasks are automatically assigned to the correct operational department (such as Legal, Finance, or Operations) based on the extracted intent.
* **Multi-Channel Communication Drafts:** The assistant automatically generates three distinct confirmation messages tailored to the formats customers actually use: a conversational WhatsApp message, a formal Email, and a concise SMS.
* **Centralized Dashboard:** Users and administrators have access to a dashboard that displays all tasks, their statuses (Pending, In Progress, Completed), risk scores, and creation times in one clear view.

## How It Helps the User
By transitioning from informal chats to an AI-driven platform, diaspora customers gain reliability and transparency. Instead of wondering if a relative completed an errand or if money reached the right person, the user submits a straightforward request and receives a structured task with a clear audit trail, risk assessment, and tracking code. This ensures that sending money, hiring local services, and verifying important documents are handled professionally and accountably.

# Decisions I made and why
## AI Tools Used
I used the Google Gemini API (gemini-2.5-flash) as the core AI Brain for the application because of its speed and its strong ability to reliably output structured JSON data. During development, I also used Gemini as a coding assistant to help scaffold the initial Django file structure and to brainstorm CSS grid layouts for the frontend dashboard.

## System Prompt Engineering and Risk Scoring
When I first built the prompt, the AI got lazy and started anchoring to the first intent on my list by categorizing everything as send_money. To fix this, I engineered the prompt to include strict conditional rules. Furthermore, I wrapped the user's input in a clear label before sending it to the API so the AI knew exactly what it was analyzing. For risk scoring, I baked the diaspora context directly into the prompt instructions. The AI was instructed to output an integer from 0 to 100 based on specific rules where land title verifications trigger a high risk due to the frequency of property fraud, while standard errands default to a low risk.

## Overriding an AI Suggestion
While building the Employee Dashboard, my AI coding assistant initially suggested keeping the customer input form and the dashboard on a single, unified page, and using a simple expanding accordion row to show task details. I overrode this suggestion entirely. I decided to separate the customer-facing input and the employee-facing dashboard into two distinct HTML pages to better reflect a real-world separation of concerns. Additionally, I scrapped the accordion rows and built a custom two-column CSS Grid layout with a dedicated side panel for task details, as it looks much more professional and is easier for an employee to read.

## A Technical Hurdle I Resolved
Midway through development, the application crashed with a ModuleNotFoundError and a 404 NOT_FOUND error when trying to communicate with the Gemini API. I discovered that Google had completely deprecated the old google.generativeai Python SDK and removed the gemini-1.5-flash model. To resolve this, I had to uninstall the old package, install the new google-genai SDK, and completely refactor my backend logic in llm_client.py. I updated the code to use the new genai.Client syntax, implemented GenerateContentConfig to force the JSON response formatting, and upgraded the model string to the currently supported gemini-2.5-flash. This got the system back online and parsing requests perfectly.
