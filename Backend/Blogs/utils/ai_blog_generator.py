import requests
import json
import re
from django.conf import settings


def extract_json_safe(content):
    """
    Safe JSON extractor for AI responses
    """

    if not content:
        return {"title": "", "excerpt": "", "content": "", "tags": []}

    # 1. direct parse attempt
    try:
        return json.loads(content)
    except:
        pass

    try:
        content = str(content).strip()

        # remove markdown code blocks if any
        content = content.replace("```json", "").replace("```", "")

        # extract JSON block
        match = re.search(r"\{[\s\S]*\}", content)
        if match:
            return json.loads(match.group())

    except Exception as e:
        print("Parse error:", e)

    return {"title": "", "excerpt": "", "content": content, "tags": []}


def generate_blog_from_ai(topic: str):
    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "Blog Generator",
    }

    prompt = f"""
You are a strict JSON generator.

Return ONLY valid JSON.

No explanation.
No markdown.
No extra text.

Rules:
- title: string
- excerpt: 50-80 words
- content: 300+ words plain text only
- tags: array of strings

Return exactly this json format:
{{"title":"","excerpt":"","content":"","tags":[]}}

Topic: {topic}
"""

    data = {
        "model": "meta-llama/llama-3-8b-instruct",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        result = response.json()

        print("STATUS:", response.status_code)
        print("RESPONSE:", result)

      
        if "choices" not in result:
            return {
                "title": str(result["title"]),
                "excerpt": str(result["excerpt"]),
                "content": str(result["content"]),
                "tags": [],
            }

        content = result["choices"][0]["message"]["content"]

        return extract_json_safe(content)

    except Exception as e:
        print("AI ERROR:", str(e))
        return {"title": "", "excerpt": "", "content": "AI error", "tags": []}
