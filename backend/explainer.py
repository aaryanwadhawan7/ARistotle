import os
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage 
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    model_name="llama-3.1-8b-instant",
    groq_api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.4
)

cache = {}

def get_explanation(label):
    if label in cache:
        return cache[label]

    prompt = f"""You are ARistotle, an intelligent AR assistant.
The camera detected: '{label}'.

Write 2 sentences only:
1. What this object is and its primary purpose (clear, simple).
2. One genuinely surprising fact most people don't know.

Rules: Max 35 words total. No bullet points. No labels like "Fact:". 
Sound like a knowledgeable friend, not a textbook."""

    response = llm.invoke([HumanMessage(content=prompt)])
    result = response.content.strip()
    cache[label] = result
    return result