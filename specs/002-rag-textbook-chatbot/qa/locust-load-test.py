"""
Locust Load Testing Script for RAG Textbook Chatbot API
Usage: locust -f locust-load-test.py --host=http://localhost:8000
Web UI: http://localhost:8089
"""

import random
import uuid
from locust import HttpUser, task, between


class ChatbotUser(HttpUser):
    """Simulates a user interacting with the chatbot API"""

    wait_time = between(2, 5)  # Wait 2-5 seconds between requests (simulates reading)

    # Test questions from T084
    QUESTIONS = [
        # Definition questions (20)
        "What is inverse kinematics?",
        "What is forward kinematics?",
        "What is a Denavit-Hartenberg parameter?",
        "What is a digital twin?",
        "What is URDF?",
        "What is SDF?",
        "What is a trajectory in robotics?",
        "What is an end-effector?",
        "What is a joint space?",
        "What is Cartesian space?",
        "What is a humanoid robot?",
        "What is a degree of freedom?",
        "What is a collision mesh?",
        "What is a visual mesh?",
        "What is Gazebo?",
        "What is ROS 2?",
        "What is NVIDIA Isaac Sim?",
        "What is path planning?",
        "What is motion planning?",
        "What is a configuration space?",
        # Explanation questions (10)
        "How does inverse kinematics work in robotic arms?",
        "How do you create a URDF model for a robot?",
        "How does ROS 2 differ from ROS 1?",
        "How does collision detection work in Gazebo?",
        "How do you simulate physics in Isaac Sim?",
        "How does trajectory generation work for humanoid locomotion?",
        "How do digital twins enable robot testing?",
        "How does the Denavit-Hartenberg convention work?",
        "How do you define joint limits in URDF?",
        "How does real-time control work in robotics?",
        # Comparison questions (10)
        "Compare forward kinematics and inverse kinematics.",
        "Compare URDF and SDF formats.",
        "Compare Gazebo and Isaac Sim.",
        "Compare ROS 1 and ROS 2.",
        "Compare joint space and Cartesian space.",
        "Compare collision meshes and visual meshes.",
        "Compare path planning and motion planning.",
        "Compare revolute joints and prismatic joints.",
        "Compare serial manipulators and parallel manipulators.",
        "Compare open-loop control and closed-loop control.",
        # Application questions (5)
        "How do I set up a ROS 2 workspace for a humanoid robot simulation?",
        "How do I define a kinematic chain in URDF for a robotic arm?",
        "How do I configure physics parameters in Gazebo for accurate simulation?",
        "How do I implement a PID controller for joint position control?",
        "How do I visualize robot trajectories in RViz?",
    ]

    def on_start(self):
        """Called when a simulated user starts"""
        # Generate a unique session ID for this user
        self.session_id = f"test_session_{uuid.uuid4().hex[:8]}"
        self.conversation_id = None
        self.last_updated_at = None

    @task(10)  # Weight 10: most common operation
    def ask_question_new_conversation(self):
        """Ask a question in a new conversation (anonymous user)"""
        question = random.choice(self.QUESTIONS)

        payload = {
            "question": question,
            "mode": "book-only",
            "tone": "academic",
            "book_id": "physical-ai-robotics",
            "chapter_number": 3,
        }

        cookies = {"session_id": self.session_id}

        with self.client.post(
            "/api/v1/chat",
            json=payload,
            cookies=cookies,
            catch_response=True,
            name="POST /chat (new conversation)",
        ) as response:
            if response.status_code == 200:
                data = response.json()
                # Store conversation ID for follow-up questions
                self.conversation_id = data.get("conversation_id")
                self.last_updated_at = data.get("conversation_updated_at")
                response.success()
            elif response.status_code == 409:
                # Optimistic locking conflict - expected occasionally
                response.success()
            else:
                response.failure(f"Unexpected status code: {response.status_code}")

    @task(5)  # Weight 5: follow-up questions
    def ask_followup_question(self):
        """Ask a follow-up question in existing conversation"""
        if not self.conversation_id:
            # No conversation yet, skip this task
            return

        question = random.choice(self.QUESTIONS)

        payload = {
            "question": question,
            "mode": "book-only",
            "tone": "academic",
            "book_id": "physical-ai-robotics",
            "chapter_number": 3,
            "conversation_id": self.conversation_id,
            "last_updated_at": self.last_updated_at,
        }

        cookies = {"session_id": self.session_id}

        with self.client.post(
            "/api/v1/chat",
            json=payload,
            cookies=cookies,
            catch_response=True,
            name="POST /chat (follow-up)",
        ) as response:
            if response.status_code == 200:
                data = response.json()
                # Update last_updated_at for optimistic locking
                self.last_updated_at = data.get("conversation_updated_at")
                response.success()
            elif response.status_code == 409:
                # Optimistic locking conflict - start new conversation
                self.conversation_id = None
                self.last_updated_at = None
                response.success()
            elif response.status_code == 404:
                # Conversation not found - start new one
                self.conversation_id = None
                self.last_updated_at = None
                response.success()
            else:
                response.failure(f"Unexpected status code: {response.status_code}")

    @task(1)  # Weight 1: edge case testing
    def ask_edge_case_question(self):
        """Ask edge case questions that may trigger refusal"""
        edge_questions = [
            "What is the latest version of ROS 2?",
            "How do I deploy a robot to Mars?",
            "What are the ethical implications of humanoid robots?",
            "What is the best robot for manufacturing?",
        ]

        question = random.choice(edge_questions)

        payload = {
            "question": question,
            "mode": "book-only",
            "tone": "academic",
            "book_id": "physical-ai-robotics",
            "chapter_number": 3,
        }

        cookies = {"session_id": self.session_id}

        with self.client.post(
            "/api/v1/chat",
            json=payload,
            cookies=cookies,
            catch_response=True,
            name="POST /chat (edge case)",
        ) as response:
            # Accept both success (200) and refusal responses
            if response.status_code in [200, 400]:
                response.success()
            else:
                response.failure(f"Unexpected status code: {response.status_code}")


# Run configuration for headless mode
if __name__ == "__main__":
    import os
    os.system("locust -f locust-load-test.py --headless --users 100 --spawn-rate 10 --run-time 5m --host http://localhost:8000")
