# Semantic Chunking Examples

Concrete examples showing input content, chunking process, and output for different strategies.

## Example 1: Heading-Based Chunking

### Input Content
```markdown
# Week 1: Introduction to ROS 2

This week covers the fundamentals of ROS 2 (Robot Operating System 2),
the next-generation robotics middleware.

## What is ROS 2?

ROS 2 is a set of software libraries and tools for building robot applications.
It provides hardware abstraction, device drivers, communication infrastructure,
and common functionality needed for robotics development.

### Key Features

- Distributed system architecture
- Real-time capable
- Cross-platform support (Linux, Windows, macOS)
- Multiple programming languages (Python, C++)

## Publishers and Subscribers

ROS 2 uses a publish-subscribe pattern for inter-process communication.
Publishers send messages to topics, and subscribers receive messages from topics.

### Creating a Publisher

Here's how to create a simple publisher in Python:

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher_ = self.create_publisher(String, 'topic', 10)
        self.timer = self.create_timer(0.5, self.timer_callback)

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello ROS 2!'
        self.publisher_.publish(msg)
```

This creates a node that publishes "Hello ROS 2!" every 0.5 seconds.

### Creating a Subscriber

Similarly, here's a subscriber:

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalSubscriber(Node):
    def __init__(self):
        super().__init__('minimal_subscriber')
        self.subscription = self.create_subscription(
            String, 'topic', self.listener_callback, 10)

    def listener_callback(self, msg):
        self.get_logger().info(f'Received: {msg.data}')
```

## Next Steps

Now that you understand the basics, try building your own publisher-subscriber system.
```

### Chunking Configuration
```json
{
  "strategy": "heading-based",
  "target_chunk_size": 1000,
  "min_chunk_size": 600,
  "max_chunk_size": 1500,
  "chunk_overlap": 100,
  "primary_split_level": 2,
  "secondary_split_level": 3
}
```

### Output Chunks

**Chunk 1** (h1 + h2: Introduction)
```json
{
  "chunk_id": "physical-ai-textbook-a1b2c3d4e5f6g7h8",
  "content": "# Week 1: Introduction to ROS 2\n\nThis week covers the fundamentals of ROS 2 (Robot Operating System 2), the next-generation robotics middleware.\n\n## What is ROS 2?\n\nROS 2 is a set of software libraries and tools for building robot applications. It provides hardware abstraction, device drivers, communication infrastructure, and common functionality needed for robotics development.\n\n### Key Features\n\n- Distributed system architecture\n- Real-time capable\n- Cross-platform support (Linux, Windows, macOS)\n- Multiple programming languages (Python, C++)",
  "metadata": {
    "heading_context": ["Week 1: Introduction to ROS 2", "What is ROS 2?"],
    "heading_level": 2,
    "position_in_doc": 1,
    "contains_code": false,
    "contains_math": false,
    "word_count": 89,
    "token_count": 138,
    "overlap_with_previous": 0,
    "overlap_with_next": 100
  }
}
```

**Chunk 2** (h2: Publishers and Subscribers → h3: Creating a Publisher)
```json
{
  "chunk_id": "physical-ai-textbook-b2c3d4e5f6g7h8i9",
  "content": "...overlap from chunk 1...\n\n## Publishers and Subscribers\n\nROS 2 uses a publish-subscribe pattern for inter-process communication. Publishers send messages to topics, and subscribers receive messages from topics.\n\n### Creating a Publisher\n\nHere's how to create a simple publisher in Python:\n\n```python\nimport rclpy\nfrom rclpy.node import Node\nfrom std_msgs.msg import String\n\nclass MinimalPublisher(Node):\n    def __init__(self):\n        super().__init__('minimal_publisher')\n        self.publisher_ = self.create_publisher(String, 'topic', 10)\n        self.timer = self.create_timer(0.5, self.timer_callback)\n        \n    def timer_callback(self):\n        msg = String()\n        msg.data = 'Hello ROS 2!'\n        self.publisher_.publish(msg)\n```\n\nThis creates a node that publishes \"Hello ROS 2!\" every 0.5 seconds.",
  "metadata": {
    "heading_context": ["Week 1: Introduction to ROS 2", "Publishers and Subscribers", "Creating a Publisher"],
    "heading_level": 3,
    "position_in_doc": 2,
    "contains_code": true,
    "contains_math": false,
    "word_count": 112,
    "token_count": 247,
    "overlap_with_previous": 100,
    "overlap_with_next": 100
  }
}
```

**Chunk 3** (h3: Creating a Subscriber + h2: Next Steps)
```json
{
  "chunk_id": "physical-ai-textbook-c3d4e5f6g7h8i9j0",
  "content": "...overlap from chunk 2...\n\n### Creating a Subscriber\n\nSimilarly, here's a subscriber:\n\n```python\nimport rclpy\nfrom rclpy.node import Node\nfrom std_msgs.msg import String\n\nclass MinimalSubscriber(Node):\n    def __init__(self):\n        super().__init__('minimal_subscriber')\n        self.subscription = self.create_subscription(\n            String, 'topic', self.listener_callback, 10)\n            \n    def listener_callback(self, msg):\n        self.get_logger().info(f'Received: {msg.data}')\n```\n\n## Next Steps\n\nNow that you understand the basics, try building your own publisher-subscriber system.",
  "metadata": {
    "heading_context": ["Week 1: Introduction to ROS 2", "Publishers and Subscribers", "Creating a Subscriber"],
    "heading_level": 3,
    "position_in_doc": 3,
    "contains_code": true,
    "contains_math": false,
    "word_count": 86,
    "token_count": 198,
    "overlap_with_previous": 100,
    "overlap_with_next": 0
  }
}
```

---

## Example 2: Paragraph-Based Chunking

### Input Content
```markdown
# Understanding Neural Networks

Neural networks are computational models inspired by biological neural networks in the brain. They consist of interconnected nodes (neurons) organized in layers.

The basic building block is the artificial neuron, which receives inputs, applies weights, sums them, and passes the result through an activation function. This simple mechanism, when combined with millions of neurons, can learn complex patterns.

Training a neural network involves adjusting weights to minimize the difference between predicted and actual outputs. This is typically done using backpropagation and gradient descent algorithms.

Deep learning refers to neural networks with many hidden layers. These deep architectures can learn hierarchical representations of data, with each layer learning increasingly abstract features.
```

### Chunking Configuration
```json
{
  "strategy": "paragraph-based",
  "target_chunk_size": 500,
  "chunk_overlap": 75
}
```

### Output Chunks

**Chunk 1** (2 paragraphs)
```json
{
  "chunk_id": "physical-ai-textbook-d4e5f6g7h8i9j0k1",
  "content": "# Understanding Neural Networks\n\nNeural networks are computational models inspired by biological neural networks in the brain. They consist of interconnected nodes (neurons) organized in layers.\n\nThe basic building block is the artificial neuron, which receives inputs, applies weights, sums them, and passes the result through an activation function. This simple mechanism, when combined with millions of neurons, can learn complex patterns.",
  "metadata": {
    "position_in_doc": 1,
    "token_count": 92,
    "overlap_with_next": 75
  }
}
```

**Chunk 2** (with overlap, 2 new paragraphs)
```json
{
  "chunk_id": "physical-ai-textbook-e5f6g7h8i9j0k1l2",
  "content": "...overlap from chunk 1...\n\nTraining a neural network involves adjusting weights to minimize the difference between predicted and actual outputs. This is typically done using backpropagation and gradient descent algorithms.\n\nDeep learning refers to neural networks with many hidden layers. These deep architectures can learn hierarchical representations of data, with each layer learning increasingly abstract features.",
  "metadata": {
    "position_in_doc": 2,
    "token_count": 118,
    "overlap_with_previous": 75,
    "overlap_with_next": 0
  }
}
```

---

## Example 3: Fixed-Size Smart Chunking

### Input Content
```markdown
# Inverse Kinematics for Humanoid Robots

Inverse kinematics (IK) solves the problem of determining joint angles needed to achieve a desired end-effector position. For humanoid robots with many degrees of freedom, this becomes computationally challenging.

The IK problem can be formulated as:

$$\theta = f^{-1}(x, y, z)$$

where $\theta$ represents joint angles and $(x, y, z)$ is the target position.

Common approaches include:
- Jacobian-based methods
- Cyclic Coordinate Descent (CCD)
- FABRIK algorithm
- Neural network approximations

```python
def inverse_kinematics(target_position, current_angles):
    # Iterative IK solver
    max_iterations = 100
    tolerance = 0.01

    for i in range(max_iterations):
        current_pos = forward_kinematics(current_angles)
        error = target_position - current_pos

        if np.linalg.norm(error) < tolerance:
            return current_angles

        # Compute Jacobian
        J = compute_jacobian(current_angles)

        # Update angles using pseudo-inverse
        delta_angles = np.dot(np.linalg.pinv(J), error)
        current_angles += delta_angles

    return current_angles
```

This implementation uses the Jacobian pseudo-inverse method for iterative convergence.
```

### Chunking Configuration
```json
{
  "strategy": "fixed-size-smart",
  "target_chunk_size": 800,
  "tolerance_window": 100,
  "chunk_overlap": 100,
  "boundary_preference": ["heading", "code_block", "paragraph", "sentence"]
}
```

### Output Chunks

**Chunk 1** (Split before code block to respect boundary)
```json
{
  "chunk_id": "physical-ai-textbook-f6g7h8i9j0k1l2m3",
  "content": "# Inverse Kinematics for Humanoid Robots\n\nInverse kinematics (IK) solves the problem of determining joint angles needed to achieve a desired end-effector position. For humanoid robots with many degrees of freedom, this becomes computationally challenging.\n\nThe IK problem can be formulated as:\n\n$$\\theta = f^{-1}(x, y, z)$$\n\nwhere $\\theta$ represents joint angles and $(x, y, z)$ is the target position.\n\nCommon approaches include:\n- Jacobian-based methods\n- Cyclic Coordinate Descent (CCD)\n- FABRIK algorithm\n- Neural network approximations",
  "metadata": {
    "heading_context": ["Inverse Kinematics for Humanoid Robots"],
    "position_in_doc": 1,
    "token_count": 156,
    "contains_code": false,
    "contains_math": true,
    "overlap_with_next": 100
  }
}
```

**Chunk 2** (Code block kept intact)
```json
{
  "chunk_id": "physical-ai-textbook-g7h8i9j0k1l2m3n4",
  "content": "...overlap from chunk 1...\n\n```python\ndef inverse_kinematics(target_position, current_angles):\n    # Iterative IK solver\n    max_iterations = 100\n    tolerance = 0.01\n    \n    for i in range(max_iterations):\n        current_pos = forward_kinematics(current_angles)\n        error = target_position - current_pos\n        \n        if np.linalg.norm(error) < tolerance:\n            return current_angles\n            \n        # Compute Jacobian\n        J = compute_jacobian(current_angles)\n        \n        # Update angles using pseudo-inverse\n        delta_angles = np.dot(np.linalg.pinv(J), error)\n        current_angles += delta_angles\n    \n    return current_angles\n```\n\nThis implementation uses the Jacobian pseudo-inverse method for iterative convergence.",
  "metadata": {
    "heading_context": ["Inverse Kinematics for Humanoid Robots"],
    "position_in_doc": 2,
    "token_count": 243,
    "contains_code": true,
    "contains_math": false,
    "overlap_with_previous": 100,
    "overlap_with_next": 0
  }
}
```

---

## Example 4: Deterministic Chunk ID Generation

### Content-Hash Strategy

**Input**:
```json
{
  "content": "# Publishers and Subscribers\n\nROS 2 uses...",
  "metadata": {
    "book_id": "physical-ai-textbook",
    "chapter": "Week 1",
    "section": "ROS 2 Basics",
    "position_in_doc": 5
  }
}
```

**ID Generation Algorithm**:
```python
import hashlib

def generate_chunk_id(content, metadata):
    # Normalize content
    normalized = content.strip().replace('\n\n', '\n')

    # Create stable components
    components = [
        metadata['book_id'],           # "physical-ai-textbook"
        metadata['chapter'],           # "Week 1"
        metadata['section'],           # "ROS 2 Basics"
        str(metadata['position_in_doc']),  # "5"
        normalized[:200]               # First 200 chars
    ]

    # Combine and hash
    combined = "|".join(components)
    hash_obj = hashlib.sha256(combined.encode('utf-8'))
    hash_hex = hash_obj.hexdigest()[:16]

    # Format final ID
    chunk_id = f"{metadata['book_id']}-{hash_hex}"

    return chunk_id
```

**Output**: `physical-ai-textbook-7f3a9b2c1d4e5f6a`

**Properties**:
- Same content + position → same ID (deterministic)
- Content changes → different ID (detects updates)
- Position changes → different ID (tracks movement)
- Stable across re-runs (reproducible)

### Sequential Strategy

**Input**: Same as above

**ID Generation**:
```python
def generate_sequential_id(metadata):
    return f"{metadata['book_id']}-{metadata['chapter_num']}-{metadata['section_num']}-c{metadata['position_in_doc']:03d}"
```

**Output**: `physical-ai-textbook-w1-s2-c005`

**Properties**:
- Human-readable
- Sortable by position
- Easy to debug
- Not content-aware

---

## Example 5: Overlap Visualization

### Token-Based Overlap (100 tokens)

```
Chunk 1:
[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] (1000 tokens)
                                   [░░░░░░░░░░] (100 overlap)

Chunk 2:
                                   [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] (1000 tokens)
                                                                  [░░░░░░░░░░]

Chunk 3:
                                                                  [▓▓▓▓▓▓▓▓▓▓...]
```

**Legend**:
- `▓` = Unique content in chunk
- `░` = Overlapping content with adjacent chunk

### Content Example

**Chunk 1 (last 100 tokens)**:
```
...For humanoid robots, this becomes particularly important due to the high
number of degrees of freedom. Common approaches include Jacobian-based methods,
Cyclic Coordinate Descent (CCD), and the FABRIK algorithm.
```

**Chunk 2 (first 100 tokens are overlap, then new content)**:
```
...Jacobian-based methods, Cyclic Coordinate Descent (CCD), and the FABRIK
algorithm. [OVERLAP ENDS]

Let's implement a basic IK solver using the Jacobian pseudo-inverse method.
This approach iteratively updates joint angles to minimize the error between...
```

**Why Overlap Matters**:
- Maintains context for retrieval
- Prevents information loss at boundaries
- Helps LLM understand connections between chunks
- Improves answer quality when spanning topics

---

## Example 6: Edge Cases

### Case 1: Very Short Document (< min_chunk_size)

**Input**: 300 tokens total

**Behavior**: Create single chunk, ignore min_size constraint for final chunk

```json
{
  "chunk_id": "physical-ai-textbook-h8i9j0k1l2m3n4o5",
  "content": "...[entire document]...",
  "metadata": {
    "token_count": 300,
    "is_undersized": true,
    "reason": "document_shorter_than_min_size"
  }
}
```

### Case 2: Oversized Code Block (> max_chunk_size)

**Input**: Code block with 2000 tokens

**Behavior**: Create dedicated chunk exceeding max_size

```json
{
  "chunk_id": "physical-ai-textbook-i9j0k1l2m3n4o5p6",
  "content": "...oversized code block...",
  "metadata": {
    "token_count": 2000,
    "is_oversized": true,
    "reason": "preserve_code_block_integrity",
    "size_limit_waived": true
  }
}
```

### Case 3: Missing Heading Context

**Input**: Content with no headings

**Behavior**: Infer context from file path

```json
{
  "chunk_id": "physical-ai-textbook-j0k1l2m3n4o5p6q7",
  "content": "...",
  "metadata": {
    "heading_context": ["Week 2", "Advanced Topics"],
    "context_source": "inferred_from_file_path",
    "file_path": "docs/week-2/advanced-topics.mdx"
  }
}
```

---

## Statistics Report Example

After chunking 45 documents:

```json
{
  "chunking_run_id": "run-20250127-103045",
  "timestamp": "2025-01-27T10:30:45Z",
  "strategy": "heading-based",
  "configuration": {
    "target_chunk_size": 1000,
    "chunk_overlap": 100
  },
  "input_statistics": {
    "total_documents": 45,
    "total_words": 125000,
    "total_tokens_estimated": 162500
  },
  "output_statistics": {
    "total_chunks": 523,
    "avg_chunk_size": 987,
    "median_chunk_size": 945,
    "min_chunk_size": 412,
    "max_chunk_size": 1498,
    "std_dev": 203,
    "p50": 945,
    "p95": 1342,
    "p99": 1467
  },
  "size_distribution": {
    "400-600": 78,
    "600-800": 145,
    "800-1000": 178,
    "1000-1200": 98,
    "1200-1400": 22,
    "1400-1600": 2
  },
  "content_analysis": {
    "chunks_with_code": 234,
    "chunks_with_math": 12,
    "chunks_with_diagrams": 45,
    "chunks_with_tables": 18,
    "chunks_with_admonitions": 67
  },
  "overlap_statistics": {
    "total_overlap_tokens": 51700,
    "avg_overlap_per_chunk": 100,
    "overlap_percentage": 10.2,
    "chunks_with_no_overlap": 45
  },
  "quality_checks": {
    "all_within_size_limits": false,
    "oversized_chunks": 2,
    "oversized_reason": ["code_block_integrity", "code_block_integrity"],
    "undersized_chunks": 5,
    "undersized_reason": ["final_chunk", "short_document"],
    "no_split_code_blocks": true,
    "no_split_math": true,
    "all_have_context": true,
    "context_completeness": 100.0
  },
  "heading_level_distribution": {
    "h1": 45,
    "h2": 156,
    "h3": 234,
    "h4": 88,
    "h5": 0,
    "h6": 0
  },
  "boundary_analysis": {
    "split_at_h2": 156,
    "split_at_h3": 234,
    "split_at_paragraph": 88,
    "split_at_sentence": 45
  },
  "performance": {
    "processing_time_seconds": 12.4,
    "chunks_per_second": 42.2,
    "parallel_workers": 8
  }
}
```

---

## Testing Chunking Strategies

### Experiment: Compare Strategies on Same Content

**Setup**: Chunk same document with 4 strategies

**Results**:

| Strategy | Chunks | Avg Size | Std Dev | Code Splits | Retrieval Score |
|----------|--------|----------|---------|-------------|-----------------|
| Heading-based | 12 | 987 | 203 | 0 | 0.89 |
| Semantic-sim | 15 | 812 | 287 | 0 | 0.92 |
| Paragraph | 18 | 678 | 156 | 1 | 0.81 |
| Fixed-smart | 14 | 945 | 98 | 0 | 0.87 |

**Conclusion**: Semantic similarity produces most coherent chunks but takes 3x longer to process.

---

These examples demonstrate the semantic chunking skill's behavior across different strategies, content types, and edge cases. Use them as a reference when chunking your textbook content.
