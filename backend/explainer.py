import os
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    model_name="llama3-8b-8192",
    # "llama3-8b" = Meta's LLaMA 3 model with 8 billion parameters
    # "8192" = can read up to 8192 tokens at once 
    groq_api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.3
)

cache = {}

def get_explanation(label):
    if label in cache:
        return cache[label]

    prompt = f"""You are ARistotle, a friendly AR tutor.
The camera just detected: '{label}'.
Write exactly 2 short sentences:
Sentence 1: What this object is (simple).
Sentence 2: One surprising real-world fact about it.
Maximum 30 words total. No bullet points. No labels."""

    response = llm.invoke([HumanMessage(content=prompt)])
    result = response.content.strip()
    cache[label] = result
    return result