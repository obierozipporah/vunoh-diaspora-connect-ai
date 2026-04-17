import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from .prompts import SYSTEM_PROMPT

# Load environment variables from the .env file
load_dotenv()

# Configure the API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Use gemini-1.5-flash for fast, structured generation
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction=SYSTEM_PROMPT,
    generation_config={
        "response_mime_type": "application/json", # Forces the model to return valid JSON
        "temperature": 0.2 # Low temperature for more deterministic, consistent output
    }
)

def process_user_request(user_text):
    """
    Sends the user's plain English request to Gemini and returns a parsed dictionary.
    """
    try:
        # Generate the response
        response = model.generate_content(user_text)
        
        # Parse the JSON string returned by the model into a Python dictionary
        structured_data = json.loads(response.text)
        return structured_data

    except Exception as e:
        print(f"Error communicating with Gemini API: {e}")
        return None