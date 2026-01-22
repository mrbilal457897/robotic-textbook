---
title: 'Voice-to-Action Systems'
sidebar_label: 'Voice-to-Action Systems'
sidebar_position: 1
reading_time: 36
---

# Voice-to-Action Systems

**Reading Time:** ~36 minutes
**Difficulty Level:** Advanced

## Learning Objectives

By the end of this lesson, you will be able to:

1. Implement robust speech recognition using Whisper (OpenAI) for robotics applications
2. Parse natural language commands into structured intents and entities
3. Map language semantics to executable robot actions with safety constraints
4. Handle context, ambiguity, and edge cases in voice-controlled systems
5. Deploy voice control interfaces on edge devices (NVIDIA Jetson) with ROS 2 integration

## Introduction

Natural language interfaces transform humanoid robots from specialized tools into general-purpose assistants. Voice control enables non-expert users to command robots using everyday language—"Pick up the red box on the table" instead of writing motion planning code. However, bridging the gap between human speech and robot actions requires solving several challenges:

- **Speech recognition**: Converting audio to text in noisy environments
- **Intent understanding**: Extracting actionable commands from conversational language
- **Parameter extraction**: Identifying objects, locations, and action modifiers
- **Execution safety**: Validating commands before performing potentially dangerous actions

This lesson explores voice-to-action pipelines, focusing on Whisper (state-of-the-art speech recognition), intent classification, and safe command execution. You'll learn to build production-ready systems that handle real-world noise, ambiguity, and failure modes.

---

## 1. Voice Control Fundamentals

### Speech Recognition (ASR) Concepts

**Automatic Speech Recognition (ASR)** converts acoustic signals (audio waveforms) into text transcriptions. Modern ASR systems use deep learning:

```mermaid
graph LR
    A[Audio Waveform] --> B[Feature Extraction MFCC, Mel Spectrogram]
    B --> C[Acoustic Model Transformer/RNN]
    C --> D[Language Model GPT, BERT]
    D --> E[Text Transcription]

    style A fill:#4A90E2
    style C fill:#E74C3C
    style E fill:#2ECC71
```

**Key Metrics**:

- **Word Error Rate (WER)**: $\frac{\text{Substitutions} + \text{Deletions} + \text{Insertions}}{\text{Total Words}}$
- **Latency**: Time from speech end to transcription (critical for real-time control)
- **Noise Robustness**: Performance in SNR (Signal-to-Noise Ratio) < 10 dB environments

### Whisper Model Overview

**Whisper** (OpenAI, 2022) is a transformer-based ASR model trained on 680,000 hours of multilingual data:

**Model Variants**:

| Model        | Parameters | English WER | Latency (CPU) | Latency (GPU) | Use Case                   |
| ------------ | ---------- | ----------- | ------------- | ------------- | -------------------------- |
| **tiny**     | 39 M       | 8.0%        | 5 s           | 0.5 s         | Edge devices (Jetson Nano) |
| **base**     | 74 M       | 5.0%        | 10 s          | 1 s           | Balanced (Jetson Xavier)   |
| **small**    | 244 M      | 3.5%        | 30 s          | 3 s           | High accuracy (desktop)    |
| **medium**   | 769 M      | 2.8%        | 90 s          | 8 s           | Best quality (RTX 3070+)   |
| **large-v2** | 1550 M     | 2.3%        | 300 s         | 15 s          | Research benchmark         |

**Key Features**:

- **Multilingual**: Supports 99 languages (auto-detection)
- **Robustness**: Handles accents, background noise, domain-specific terms
- **Timestamps**: Word-level timing (useful for audio alignment)

### Language Understanding (NLU)

**Natural Language Understanding (NLU)** extracts structured meaning from text:

```
Input: "Pick up the red box on the table and put it on the shelf"

Intent: PICK_AND_PLACE
Entities:
  - object: "red box"
  - source_location: "table"
  - destination_location: "shelf"
  - action_sequence: ["pick", "place"]
```

**NLU Approaches**:

1. **Rule-Based**: Regex patterns, keyword matching (fast, brittle)
2. **Classical ML**: SVM, CRF (requires manual feature engineering)
3. **Deep Learning**: BERT, RoBERTa (best accuracy, requires labeled data)
4. **LLMs (Zero-Shot)**: GPT-4, Claude (no training, expensive inference)

### Intent and Entity Extraction

**Intent Classification** (map utterance to action category):

```python
# Example intents for humanoid robot
INTENTS = [
    "NAVIGATE",       # "Go to the kitchen"
    "PICK",           # "Pick up the mug"
    "PLACE",          # "Put it on the counter"
    "GESTURE",        # "Wave hello"
    "FOLLOW",         # "Follow me"
    "STOP",           # "Stop moving"
    "QUERY_STATUS"    # "What's your battery level?"
]
```

**Entity Recognition** (extract parameters):

```python
# Example entities
ENTITIES = {
    "object": ["box", "mug", "book", "chair"],
    "location": ["table", "shelf", "kitchen", "entrance"],
    "color": ["red", "blue", "green", "black"],
    "direction": ["left", "right", "forward", "backward"],
    "distance": "numeric_value + unit"  # "2 meters"
}
```

---

## 2. Implementing Speech Recognition

### Whisper API and Local Models

**Cloud API** (OpenAI Whisper API):

```python
import openai
import pyaudio
import wave

# Record audio
def record_audio(duration=5, sample_rate=16000):
    """Record audio from microphone."""
    p = pyaudio.PyAudio()
    stream = p.open(
        format=pyaudio.paInt16,
        channels=1,
        rate=sample_rate,
        input=True,
        frames_per_buffer=1024
    )

    print("Recording...")
    frames = []
    for _ in range(0, int(sample_rate / 1024 * duration)):
        data = stream.read(1024)
        frames.append(data)

    stream.stop_stream()
    stream.close()
    p.terminate()

    # Save to file
    wf = wave.open("command.wav", "wb")
    wf.setnchannels(1)
    wf.setsampwidth(p.get_sample_size(pyaudio.paInt16))
    wf.setframerate(sample_rate)
    wf.writeframes(b''.join(frames))
    wf.close()

    return "command.wav"

# Transcribe with OpenAI API
def transcribe_whisper_cloud(audio_file):
    """Transcribe audio using OpenAI Whisper API."""
    openai.api_key = "YOUR_API_KEY"

    with open(audio_file, "rb") as f:
        transcript = openai.Audio.transcribe(
            model="whisper-1",
            file=f,
            language="en"  # Optional: force language
        )

    return transcript["text"]

# Usage
audio_file = record_audio(duration=5)
text = transcribe_whisper_cloud(audio_file)
print(f"Transcription: {text}")
```

**Local Model** (using `faster-whisper`, optimized for CPUs/GPUs):

```bash
# Install faster-whisper (CTranslate2-based, 4x faster than OpenAI's implementation)
pip install faster-whisper
```

```python
from faster_whisper import WhisperModel

# Load model (runs locally)
model = WhisperModel(
    "base",  # Model size: tiny, base, small, medium, large-v2
    device="cuda",  # Use "cpu" for Jetson Nano
    compute_type="int8"  # Quantization: float16, int8 (faster, lower memory)
)

def transcribe_whisper_local(audio_file):
    """Transcribe using local Whisper model."""
    segments, info = model.transcribe(
        audio_file,
        language="en",
        beam_size=5,  # Decoding beam search (higher = better, slower)
        vad_filter=True  # Voice Activity Detection (remove silence)
    )

    # Concatenate segments
    transcript = " ".join([segment.text for segment in segments])
    return transcript.strip()

# Usage
text = transcribe_whisper_local("command.wav")
print(f"Transcription: {text}")
```

### Audio Preprocessing

**Noise Reduction** (using `noisereduce`):

```python
import noisereduce as nr
import librosa

def denoise_audio(audio_file):
    """Remove background noise from audio."""
    # Load audio
    audio, sr = librosa.load(audio_file, sr=16000)

    # Reduce noise
    reduced_noise = nr.reduce_noise(
        y=audio,
        sr=sr,
        stationary=True,  # Assume constant background noise
        prop_decrease=1.0  # Aggressiveness (0-1)
    )

    # Save cleaned audio
    import soundfile as sf
    sf.write("command_clean.wav", reduced_noise, sr)

    return "command_clean.wav"

# Usage
clean_audio = denoise_audio("command.wav")
text = transcribe_whisper_local(clean_audio)
```

**Voice Activity Detection (VAD)** (detect speech start/end):

```python
import webrtcvad
import wave

def trim_silence(audio_file, aggressiveness=3):
    """Remove silence from beginning/end of audio."""
    vad = webrtcvad.Vad(aggressiveness)  # 0-3 (3 = most aggressive)

    wf = wave.open(audio_file, "rb")
    assert wf.getnchannels() == 1
    assert wf.getsampwidth() == 2
    assert wf.getframerate() in [8000, 16000, 32000, 48000]

    frame_duration = 30  # ms
    frame_bytes = int(wf.getframerate() * frame_duration / 1000) * 2

    frames = []
    speech_detected = False

    while True:
        frame = wf.readframes(frame_bytes // 2)
        if len(frame) < frame_bytes:
            break

        is_speech = vad.is_speech(frame, wf.getframerate())

        if is_speech:
            speech_detected = True
            frames.append(frame)
        elif speech_detected:
            # Add small buffer after speech ends
            frames.append(frame)

    wf.close()

    # Save trimmed audio
    wf_out = wave.open("command_trimmed.wav", "wb")
    wf_out.setnchannels(1)
    wf_out.setsampwidth(2)
    wf_out.setframerate(16000)
    wf_out.writeframes(b''.join(frames))
    wf_out.close()

    return "command_trimmed.wav"
```

### Transcription Accuracy

**Confidence Scoring** (using Whisper's log probabilities):

```python
def transcribe_with_confidence(audio_file, threshold=0.7):
    """Transcribe and filter low-confidence words."""
    segments, _ = model.transcribe(audio_file, word_timestamps=True)

    high_confidence_text = []

    for segment in segments:
        for word_info in segment.words:
            word = word_info.word
            confidence = word_info.probability  # Log probability → confidence

            if confidence > threshold:
                high_confidence_text.append(word)
            else:
                print(f"Low confidence: '{word}' ({confidence:.2f})")

    return " ".join(high_confidence_text)

# Usage
text = transcribe_with_confidence("command.wav", threshold=0.8)
```

**Domain Adaptation** (fine-tune on robotics vocabulary):

```python
# Prompt engineering (guide Whisper's transcription)
def transcribe_with_context(audio_file, context):
    """Provide domain-specific context to improve accuracy."""
    segments, _ = model.transcribe(
        audio_file,
        initial_prompt=context  # Robotics-specific vocabulary
    )

    return " ".join([s.text for s in segments])

# Example context
robotics_vocab = (
    "pick, place, navigate, grasp, release, manipulator, "
    "gripper, end-effector, waypoint, trajectory, collision"
)

text = transcribe_with_context("command.wav", context=robotics_vocab)
```

### Real-Time Streaming

**Continuous Transcription** (using `speech_recognition` + Whisper):

```python
import speech_recognition as sr

def continuous_listening(callback):
    """Listen for voice commands continuously."""
    recognizer = sr.Recognizer()
    mic = sr.Microphone()

    with mic as source:
        recognizer.adjust_for_ambient_noise(source, duration=1)
        print("Listening for commands...")

    while True:
        try:
            with mic as source:
                audio = recognizer.listen(source, timeout=10)

            # Save audio to temp file
            with open("temp.wav", "wb") as f:
                f.write(audio.get_wav_data())

            # Transcribe
            text = transcribe_whisper_local("temp.wav")

            if text:
                print(f"Heard: {text}")
                callback(text)  # Process command

        except sr.WaitTimeoutError:
            continue
        except KeyboardInterrupt:
            print("Stopping...")
            break

# Usage
def process_command(text):
    print(f"Processing: {text}")
    # Intent extraction logic here...

continuous_listening(process_command)
```

---

## 3. Natural Language Understanding

### Intent Classification

**Keyword Matching** (simple, fast):

```python
import re

INTENT_PATTERNS = {
    "NAVIGATE": [r"\b(go|move|walk|navigate)\s+to\b", r"\b(location|room|area)\b"],
    "PICK": [r"\b(pick|grab|grasp|get)\s+(up|the)?\s*\w+\b"],
    "PLACE": [r"\b(put|place|drop|release)\b"],
    "STOP": [r"\b(stop|halt|freeze|pause)\b"],
}

def classify_intent_keywords(text):
    """Classify intent using regex patterns."""
    text_lower = text.lower()

    for intent, patterns in INTENT_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text_lower):
                return intent

    return "UNKNOWN"

# Test
print(classify_intent_keywords("Go to the kitchen"))  # NAVIGATE
print(classify_intent_keywords("Pick up the red box"))  # PICK
```

**ML-Based Classification** (using scikit-learn):

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

# Training data (expand with real examples)
training_data = [
    ("go to the kitchen", "NAVIGATE"),
    ("move to the living room", "NAVIGATE"),
    ("pick up the mug", "PICK"),
    ("grab the book", "PICK"),
    ("put it on the table", "PLACE"),
    ("stop moving", "STOP"),
]

texts, labels = zip(*training_data)

# Train model
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)

classifier = LogisticRegression()
classifier.fit(X, labels)

# Save model
joblib.dump(vectorizer, "intent_vectorizer.pkl")
joblib.dump(classifier, "intent_classifier.pkl")

def classify_intent_ml(text):
    """Classify intent using trained ML model."""
    X = vectorizer.transform([text])
    intent = classifier.predict(X)[0]
    confidence = classifier.predict_proba(X).max()

    return intent, confidence

# Test
intent, conf = classify_intent_ml("walk to the bedroom")
print(f"Intent: {intent}, Confidence: {conf:.2f}")
```

### Entity Extraction

**Named Entity Recognition (NER)** with spaCy:

```python
import spacy

nlp = spacy.load("en_core_web_sm")

def extract_entities_spacy(text):
    """Extract entities using spaCy NER."""
    doc = nlp(text)

    entities = {}
    for ent in doc.ents:
        entities[ent.label_] = ent.text

    return entities

# Test
entities = extract_entities_spacy("Go to the kitchen and pick up the red mug")
print(entities)  # {'CARDINAL': 'red', ...} (spaCy default labels)
```

**Custom Entity Extraction** (robotics-specific):

```python
import re

def extract_entities_custom(text):
    """Extract robotics-specific entities."""
    entities = {}

    # Extract colors
    colors = ["red", "blue", "green", "yellow", "black", "white"]
    for color in colors:
        if color in text.lower():
            entities["color"] = color

    # Extract objects (simple noun extraction)
    nouns = re.findall(r"\b(box|mug|book|chair|table|shelf)\b", text.lower())
    if nouns:
        entities["object"] = nouns[0]

    # Extract locations
    locations = re.findall(r"\b(kitchen|bedroom|table|shelf|floor)\b", text.lower())
    if locations:
        entities["location"] = locations[0]

    # Extract distances
    distance_match = re.search(r"(\d+(?:\.\d+)?)\s*(meter|cm|foot|feet)", text.lower())
    if distance_match:
        entities["distance"] = {
            "value": float(distance_match.group(1)),
            "unit": distance_match.group(2)
        }

    return entities

# Test
text = "Pick up the red box on the table and move it 2 meters forward"
entities = extract_entities_custom(text)
print(entities)
# {'color': 'red', 'object': 'box', 'location': 'table', 'distance': {'value': 2.0, 'unit': 'meter'}}
```

### Context Management

**Conversation State Tracking**:

```python
class ConversationContext:
    def __init__(self):
        self.history = []
        self.entities = {}

    def add_utterance(self, text, intent, entities):
        """Track conversation history."""
        self.history.append({
            "text": text,
            "intent": intent,
            "entities": entities
        })

        # Update persistent entities (e.g., last mentioned object)
        self.entities.update(entities)

    def resolve_reference(self, text):
        """Resolve pronouns (it, that, there)."""
        if "it" in text.lower() or "that" in text.lower():
            # Refer to last mentioned object
            if "object" in self.entities:
                return self.entities["object"]

        if "there" in text.lower():
            # Refer to last mentioned location
            if "location" in self.entities:
                return self.entities["location"]

        return None

# Usage
context = ConversationContext()

# First command
text1 = "Pick up the red box"
entities1 = extract_entities_custom(text1)
context.add_utterance(text1, "PICK", entities1)

# Second command (anaphoric reference)
text2 = "Put it on the shelf"
entities2 = extract_entities_custom(text2)

# Resolve "it"
if "object" not in entities2:
    entities2["object"] = context.resolve_reference(text2)

print(entities2)  # {'location': 'shelf', 'object': 'red box'}
```

### Handling Ambiguity and Edge Cases

**Clarification Questions**:

```python
def validate_command(intent, entities):
    """Check if command has all required parameters."""
    required_params = {
        "NAVIGATE": ["location"],
        "PICK": ["object"],
        "PLACE": ["object", "location"],
    }

    if intent not in required_params:
        return True  # No validation needed

    missing = [param for param in required_params[intent] if param not in entities]

    if missing:
        return False, f"Missing information: {', '.join(missing)}"

    return True, None

# Test
intent = "PLACE"
entities = {"object": "box"}  # Missing location

is_valid, error = validate_command(intent, entities)
if not is_valid:
    print(f"Clarification needed: {error}")
    # Ask user: "Where should I place the box?"
```

---

## 4. Action Mapping and Execution

### Translating Intent to Robot Commands

**Action Dispatcher**:

```python
import rclpy
from geometry_msgs.msg import Twist, Point
from std_msgs.msg import String

class VoiceCommandExecutor:
    def __init__(self):
        rclpy.init()
        self.node = rclpy.create_node('voice_executor')

        # Publishers
        self.cmd_vel_pub = self.node.create_publisher(Twist, '/cmd_vel', 10)
        self.goal_pub = self.node.create_publisher(Point, '/navigation/goal', 10)
        self.gripper_pub = self.node.create_publisher(String, '/gripper/command', 10)

    def execute(self, intent, entities):
        """Map intent + entities to robot actions."""
        if intent == "NAVIGATE":
            self.navigate_to(entities.get("location"))

        elif intent == "PICK":
            self.pick_object(entities.get("object"))

        elif intent == "PLACE":
            self.place_object(entities.get("location"))

        elif intent == "STOP":
            self.stop_robot()

    def navigate_to(self, location):
        """Navigate to named location."""
        # Lookup location coordinates (from semantic map)
        locations = {
            "kitchen": (5.0, 2.0),
            "bedroom": (-3.0, 4.0),
            "table": (1.0, 0.5)
        }

        if location in locations:
            goal = Point()
            goal.x, goal.y = locations[location]
            goal.z = 0.0

            self.goal_pub.publish(goal)
            print(f"Navigating to {location} at ({goal.x}, {goal.y})")
        else:
            print(f"Unknown location: {location}")

    def pick_object(self, object_name):
        """Trigger object picking sequence."""
        cmd = String(data=f"PICK:{object_name}")
        self.gripper_pub.publish(cmd)
        print(f"Picking {object_name}")

    def place_object(self, location):
        """Place held object at location."""
        cmd = String(data=f"PLACE:{location}")
        self.gripper_pub.publish(cmd)
        print(f"Placing object at {location}")

    def stop_robot(self):
        """Emergency stop."""
        stop_cmd = Twist()  # Zero velocities
        self.cmd_vel_pub.publish(stop_cmd)
        print("Robot stopped")

# Usage
executor = VoiceCommandExecutor()
executor.execute("NAVIGATE", {"location": "kitchen"})
```

### Parameter Extraction from Speech

**Numeric Values**:

```python
import re

def extract_distance(text):
    """Extract distance from command."""
    match = re.search(r"(\d+(?:\.\d+)?)\s*(meter|cm|foot)", text.lower())

    if match:
        value = float(match.group(1))
        unit = match.group(2)

        # Convert to meters
        conversions = {"meter": 1.0, "cm": 0.01, "foot": 0.3048}
        distance_m = value * conversions.get(unit, 1.0)

        return distance_m

    return None

# Test
print(extract_distance("Move forward 2 meters"))  # 2.0
print(extract_distance("Go back 50 cm"))  # 0.5
```

### Execution Safety Checks

**Pre-Execution Validation**:

```python
def safety_check(intent, entities):
    """Validate command safety before execution."""
    # Check 1: Ensure object exists in perception
    if intent == "PICK":
        if not is_object_detected(entities.get("object")):
            return False, f"Object '{entities.get('object')}' not detected"

    # Check 2: Validate navigation goal is reachable
    if intent == "NAVIGATE":
        if not is_location_safe(entities.get("location")):
            return False, f"Location '{entities.get('location')}' is not safe"

    # Check 3: Prevent dangerous commands
    dangerous_keywords = ["off", "cliff", "stairs"]
    if any(kw in str(entities.values()).lower() for kw in dangerous_keywords):
        return False, "Command contains dangerous keywords"

    return True, None

def is_object_detected(object_name):
    """Check if object is in perception system (placeholder)."""
    # Query vision system
    detected_objects = ["red box", "mug", "book"]  # From object detection
    return object_name in detected_objects

def is_location_safe(location):
    """Validate location is not near hazards."""
    unsafe_zones = ["cliff", "edge"]
    return location not in unsafe_zones

# Test
is_safe, error = safety_check("PICK", {"object": "invisible box"})
if not is_safe:
    print(f"Safety check failed: {error}")
```

### Feedback and Confirmation

**Audio Feedback** (using text-to-speech):

```python
from gtts import gTTS
import os

def speak(text):
    """Convert text to speech and play."""
    tts = gTTS(text=text, lang='en')
    tts.save("response.mp3")
    os.system("mpg321 response.mp3")  # Play audio (Linux)

# Usage
speak("Navigating to the kitchen")
```

**Visual Confirmation** (RViz markers):

```python
from visualization_msgs.msg import Marker

def visualize_target(location):
    """Show target location in RViz."""
    marker = Marker()
    marker.header.frame_id = "map"
    marker.type = Marker.SPHERE
    marker.action = Marker.ADD

    marker.pose.position.x = location[0]
    marker.pose.position.y = location[1]
    marker.pose.position.z = 0.5

    marker.scale.x = 0.3
    marker.scale.y = 0.3
    marker.scale.z = 0.3

    marker.color.r = 1.0
    marker.color.a = 1.0

    marker_pub.publish(marker)
```

---

## 5. Integration and Deployment

### ROS 2 Integration

**Voice Command Node**:

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class VoiceCommandNode(Node):
    def __init__(self):
        super().__init__('voice_command_node')

        # Publisher for recognized commands
        self.command_pub = self.create_publisher(String, '/voice_command', 10)

        # Start listening thread
        import threading
        self.listen_thread = threading.Thread(target=self.listen_loop, daemon=True)
        self.listen_thread.start()

        self.get_logger().info("Voice command node started")

    def listen_loop(self):
        """Continuous listening loop."""
        import speech_recognition as sr

        recognizer = sr.Recognizer()
        mic = sr.Microphone()

        with mic as source:
            recognizer.adjust_for_ambient_noise(source, duration=1)

        while rclpy.ok():
            try:
                with mic as source:
                    audio = recognizer.listen(source, timeout=10)

                # Transcribe
                with open("temp.wav", "wb") as f:
                    f.write(audio.get_wav_data())

                text = transcribe_whisper_local("temp.wav")

                if text:
                    self.get_logger().info(f"Recognized: {text}")

                    # Publish command
                    msg = String(data=text)
                    self.command_pub.publish(msg)

            except Exception as e:
                self.get_logger().error(f"Error: {e}")

def main():
    rclpy.init()
    node = VoiceCommandNode()
    rclpy.spin(node)

if __name__ == '__main__':
    main()
```

### Multi-Language Support

**Language Detection**:

```python
def transcribe_multilingual(audio_file):
    """Transcribe and detect language."""
    segments, info = model.transcribe(audio_file, language=None)  # Auto-detect

    detected_lang = info.language
    transcript = " ".join([s.text for s in segments])

    return transcript, detected_lang

# Test
text, lang = transcribe_multilingual("command.wav")
print(f"Language: {lang}, Text: {text}")
```

**Translation** (optional, for multilingual systems):

```python
from googletrans import Translator

translator = Translator()

def translate_to_english(text, source_lang):
    """Translate command to English for intent extraction."""
    if source_lang == "en":
        return text

    translated = translator.translate(text, src=source_lang, dest="en")
    return translated.text

# Usage
text_en = translate_to_english("Ve a la cocina", source_lang="es")
print(text_en)  # "Go to the kitchen"
```

### Privacy Considerations

**Local Processing** (no cloud API):

```python
# All processing on-device
model = WhisperModel("base", device="cuda", compute_type="int8")

# No data sent to external servers
transcript = transcribe_whisper_local("command.wav")
```

**Data Retention Policies**:

```python
import os
import time

def auto_delete_audio(file_path, max_age_seconds=3600):
    """Delete audio files older than threshold."""
    if os.path.exists(file_path):
        file_age = time.time() - os.path.getmtime(file_path)

        if file_age > max_age_seconds:
            os.remove(file_path)
            print(f"Deleted old audio: {file_path}")

# Cleanup loop
for file in os.listdir("/tmp/audio/"):
    auto_delete_audio(f"/tmp/audio/{file}", max_age_seconds=3600)
```

### Edge Deployment on Jetson

**Optimized Inference**:

```bash
# Install Whisper with CUDA support
pip3 install faster-whisper

# Set Jetson to max performance
sudo jetson_clocks
sudo nvpmodel -m 0  # Max power mode
```

**Resource Monitoring**:

```python
import subprocess

def get_gpu_usage():
    """Monitor Jetson GPU utilization."""
    result = subprocess.run(
        ["tegrastats", "--interval", "1000"],
        capture_output=True,
        text=True
    )

    # Parse output (simplified)
    gpu_usage = result.stdout  # Contains GPU, CPU, memory stats
    return gpu_usage

# Periodic monitoring
import time
while True:
    usage = get_gpu_usage()
    print(usage)
    time.sleep(5)
```

---

## Summary

This lesson covered voice-to-action pipelines for humanoid robotics:

- **Speech recognition**: Whisper provides state-of-the-art ASR with multilingual support and noise robustness
- **Intent understanding**: Combine keyword matching, ML classifiers, and entity extraction for robust NLU
- **Action mapping**: Translate natural language commands to structured robot actions with safety validation
- **Deployment**: ROS 2 integration and edge optimization enable real-time voice control on resource-constrained hardware

**Key Takeaway**: Voice interfaces democratize robot interaction, but require careful handling of ambiguity, privacy, and safety. Always validate commands before execution and provide clear feedback to users.

---

## Next Steps

1. **Hands-On Exercise**: Build a voice-controlled robot that navigates to named locations using Whisper + ROS 2
2. **Advanced Topic**: Explore [LLM-Based Cognitive Planning](./llm-cognitive-planning.md) for complex task reasoning
3. **Multi-Modal Integration**: Combine voice with gesture recognition for richer interactions
4. **Community Resources**:
   - [Whisper GitHub](https://github.com/openai/whisper)
   - [faster-whisper](https://github.com/guillaumekln/faster-whisper)
   - [ROS 2 Speech-to-Text](https://github.com/ros-planning/audio_common)

---

## Further Reading

- **"Robust Speech Recognition via Large-Scale Weak Supervision"** (OpenAI Whisper paper, 2022)
- **"Natural Language Interfaces for Robotics"** (ACM Survey, 2023)
- **Privacy-Preserving ASR**: [Mozilla DeepSpeech](https://github.com/mozilla/DeepSpeech) (alternative to Whisper)

:::info Practice Quiz
Test your understanding with the [Module 4 Quiz](./quiz.md) before proceeding to the capstone project.
:::
