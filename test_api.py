import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

print("API Key Loaded:", bool(os.getenv("GEMINI_API_KEY")))

try:
    # 1. Initialize the client (NO .configure calls allowed)
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    
    # 2. Send a simple test request
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents="I need to send KES 15,000 to my mother in Kisumu urgently."
    )
    print("Connection Successful!")
    print(response.text)
except Exception as e:
    print(f"Failed to connect: {e}")