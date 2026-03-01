#!/usr/bin/env python3
"""
Test Chat Endpoint
Quick script to test if the chat endpoint is working
"""

import requests
import json

# Test 1: Health check
print("=" * 60)
print("Test 1: Health Check")
print("=" * 60)
try:
    response = requests.get("http://localhost:8000/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print("✓ Health check PASSED\n")
except Exception as e:
    print(f"✗ Health check FAILED: {e}\n")
    exit(1)

# Test 2: Chat endpoint
print("=" * 60)
print("Test 2: Chat Endpoint")
print("=" * 60)

chat_request = {
    "message": "What is inverse kinematics?",
    "mode": "book-only",
    "tone": "academic",
    "book_id": "physical-ai-robotics",
}

print(f"Sending request:")
print(json.dumps(chat_request, indent=2))
print()

try:
    response = requests.post(
        "http://localhost:8000/api/v1/chat",
        json=chat_request,
        headers={"Content-Type": "application/json"},
        timeout=60,  # 60 second timeout
    )

    print(f"Status Code: {response.status_code}")
    print()

    if response.status_code == 200:
        data = response.json()
        print("✓ Chat request SUCCEEDED")
        print()
        print(f"Conversation ID: {data.get('conversation_id')}")
        print(f"Response (first 200 chars): {data['message']['content'][:200]}...")
        print(f"Citations: {len(data['message'].get('citations', []))}")
    else:
        print(f"✗ Chat request FAILED")
        print(f"Response: {response.text}")

except requests.exceptions.Timeout:
    print("✗ Request TIMEOUT - backend is not responding")
    print("\nPossible causes:")
    print("1. Gemini API key is invalid or blocked")
    print("2. Qdrant connection is hanging")
    print("3. Database connection is slow")
    print("\nCheck backend logs for errors")

except requests.exceptions.ConnectionError:
    print("✗ CONNECTION ERROR - backend is not running")
    print("\nMake sure backend is running:")
    print("  cd backend")
    print("  python run_server.py")

except Exception as e:
    print(f"✗ Unexpected error: {e}")
    import traceback
    traceback.print_exc()
