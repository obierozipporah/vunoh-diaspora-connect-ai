import os
import json
import time
from google import genai
from google.genai import types
from dotenv import load_dotenv
from .prompts import SYSTEM_PROMPT

# Load environment variables from the .env file
load_dotenv()

# Initialize the new SDK client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def process_user_request(user_text, retries=3, delay=2):
    """
    Sends the user's request to Gemini. 
    Includes retry logic and a fallback mock response to prevent development blocking.
    """
    for attempt in range(retries):
        try:
            # Using 1.5-flash as it often has better availability during high demand
            response = client.models.generate_content(
                model='gemini-1.5-flash',
                contents=user_text,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2,
                    system_instruction=SYSTEM_PROMPT
                )
            )
            
            structured_data = json.loads(response.text)
            return structured_data

        except Exception as e:
            print(f"API Attempt {attempt + 1} failed: {e}")
            if attempt < retries - 1:
                time.sleep(delay) # Wait before trying again
            else:
                print("All API attempts failed. Returning mock data to keep the system running.")
                
                # Mock data so you can keep building your frontend even if the API is down
                return {
                    "intent": "send_money",
                    "entities": {"amount": "15000", "currency": "KES", "location": "Kisumu"},
                    "risk_score": 80,
                    "generated_steps": ["Verify user identity", "Confirm recipient details", "Initiate transfer"],
                    "employee_assignment": "Finance",
                    "whatsapp_message": "Hey! We are processing your transfer to Kisumu right now. Your reference is [TASK_CODE].",
                    "email_message": "Dear Customer, your request to send funds to Kisumu has been initiated. Task Reference: [TASK_CODE].",
                    "sms_message": "Vunoh: Transfer initiated. Ref: [TASK_CODE]"
                }