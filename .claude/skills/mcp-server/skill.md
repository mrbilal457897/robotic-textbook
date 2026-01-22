---
name: mcp-server
description: Design, implement, and maintain an MCP (Model Context Protocol) Server. Enable AI agents to safely access project context with tools, resources, and prompts. Follow official MCP specification with clean separation of concerns, context filtering, token-efficient delivery, and comprehensive security controls.
---

# MCP Server Skill

## Overview

This skill enables the design and implementation of production-ready MCP (Model Context Protocol) servers for integrating AI agents with your project. It covers MCP architecture, server setup, tool/resource registration, context scoping, permission handling, and token-efficient context delivery.

An MCP server acts as a bridge between AI agents (Claude, other LLMs) and your application's data, tools, and resources. It provides a standardized, secure way for agents to access project context without exposing sensitive information or enabling unsafe operations.

## When to Use This Skill

- Building an MCP server to expose project tools and resources to Claude or other LLMs
- Integrating an MCP server with an AI agent or chatbot
- Exposing structured project context (specifications, code, documentation) to agents
- Creating safe, permission-based access to project data
- Defining custom tools that agents can invoke (e.g., retrieve specs, run simulations)
- Implementing resources that represent structured project data
- Setting up prompts that guide agent behavior
- Managing context efficiently to stay within token budgets

## Core Principles

### MCP Architecture

**Model Context Protocol (MCP)** is a standardized protocol for connecting Claude and other language models to external tools, data, and systems. It follows a **Client-Server** pattern:

```
┌─────────────────────────────────┐
│   AI Agent / LLM Client         │
│   (Claude, etc.)                │
└──────────────┬──────────────────┘
               │
               │ MCP Protocol
               │ (stdio/HTTP/WebSocket)
               │
┌──────────────▼──────────────────┐
│   MCP Server                    │
│   ┌────────────────────────┐    │
│   │ Tools                  │    │
│   │ (Callables)            │    │
│   └────────────────────────┘    │
│   ┌────────────────────────┐    │
│   │ Resources              │    │
│   │ (Data/Context)         │    │
│   └────────────────────────┘    │
│   ┌────────────────────────┐    │
│   │ Prompts                │    │
│   │ (Prompt Templates)     │    │
│   └────────────────────────┘    │
└─────────────────────────────────┘
       │
       │ Accesses
       │
┌──────▼──────────────────────────┐
│   Your Application / Project    │
│   - Specs, Code, Data           │
│   - APIs, Databases             │
│   - Simulations, Tools          │
└─────────────────────────────────┘
```

### Key Components

1. **Tools**: Callable functions that agents can invoke with parameters
   - Example: `get_specification()`, `run_simulation()`, `search_code()`
   - Return structured results

2. **Resources**: Structured data that agents can retrieve and reference
   - Example: specification files, code snippets, documentation
   - Can be static (files) or dynamic (computed at request time)

3. **Prompts**: Prompt templates that guide agent behavior
   - Example: "Analyze this spec and suggest improvements"
   - Can include optional instructions and context

4. **Context**: Information passed to the agent (specs, code, docs)
   - Scoped to avoid token bloat
   - Validated for safety and accuracy

### Design Principles

- **Safety First**: Validate all inputs, scope all outputs, never expose secrets
- **Clarity**: Clear tool signatures and resource descriptions
- **Efficiency**: Return only necessary data, compress context intelligently
- **Isolation**: Separate concerns (tools, resources, prompts)
- **Traceability**: Log all tool invocations and context access

## MCP Architecture Explained

### Communication Model

MCP uses **bidirectional message passing** over stdio, HTTP, or WebSocket:

1. **Initialization**: Client and server exchange capabilities
2. **Tool Discovery**: Client queries available tools and resources
3. **Tool Invocation**: Client calls a tool with arguments
4. **Result Delivery**: Server returns structured results
5. **Resource Retrieval**: Client retrieves resources by URI

### Message Types

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "get_specification",
        "description": "Retrieve the specification for a feature",
        "inputSchema": {
          "type": "object",
          "properties": {
            "feature": {
              "type": "string",
              "description": "Feature name"
            }
          },
          "required": ["feature"]
        }
      }
    ]
  }
}
```

### Token Efficiency

MCP servers must be conscious of token usage:

- **Lazy Loading**: Return minimal context by default
- **Pagination**: Large results paginated or truncated
- **Caching**: Reuse frequently-accessed resources
- **Compression**: Remove whitespace, unnecessary details
- **Filtering**: Include only relevant fields

## Step-by-Step MCP Server Implementation

### Phase 1: Planning & Architecture

**1.1 Define Server Purpose & Scope**
- What tools should agents be able to invoke?
- What data/resources should be exposed?
- Who are the users? (team members, external agents)
- What are the security/permission boundaries?
- What's the expected usage pattern?

**1.2 Design Tool Set**
```
Define 3-5 core tools that solve specific agent needs:
- get_specification(feature_name) → spec data
- search_code(query, language) → code snippets
- run_test(test_name) → test results
- validate_spec(spec_id) → validation results
- list_features() → available features
```

**1.3 Design Resource Set**
```
Define resources representing project data:
- /specs/{feature}/spec.md → Feature specification
- /specs/{feature}/plan.md → Architecture plan
- /specs/{feature}/tasks.md → Task list
- /code/{path} → Source code files
- /docs/index.md → Documentation index
```

**1.4 Design Prompts**
```
Define prompt templates guiding agent behavior:
- "spec-analyzer" → Analyze a spec for clarity
- "code-reviewer" → Review code for best practices
- "architecture-suggester" → Suggest architecture improvements
```

**1.5 Identify Security Boundaries**
```
- What secrets must never be exposed? (.env, credentials)
- What operations are read-only vs. write?
- What rate limits apply?
- What audit logging is required?
- What data retention policies apply?
```

### Phase 2: Setup & Configuration

**2.1 Create Server Project Structure**

```
mcp-server/
├── server/
│   ├── __init__.py
│   ├── main.py                 # Entry point
│   ├── server.py               # Server class
│   ├── tools/
│   │   ├── __init__.py
│   │   ├── specification.py    # Tool: get_specification
│   │   ├── code_search.py      # Tool: search_code
│   │   └── validation.py       # Tool: validate_spec
│   ├── resources/
│   │   ├── __init__.py
│   │   ├── specs.py            # Resource: /specs/{feature}
│   │   ├── code.py             # Resource: /code/{path}
│   │   └── docs.py             # Resource: /docs/{path}
│   ├── prompts/
│   │   ├── __init__.py
│   │   ├── analyzer.py         # Prompt templates
│   │   └── reviewer.py
│   ├── security/
│   │   ├── __init__.py
│   │   ├── permissions.py      # Permission checking
│   │   ├── validation.py       # Input validation
│   │   └── filters.py          # Output filtering
│   └── config/
│       ├── __init__.py
│       ├── settings.py         # Configuration
│       └── constants.py        # Constants
├── tests/
│   ├── test_tools.py
│   ├── test_resources.py
│   └── test_server.py
├── requirements.txt            # Python dependencies
├── README.md                   # Setup instructions
└── config.json                 # Server configuration
```

**2.2 Initialize MCP Server (Python)**

```python
# server/main.py
import asyncio
import sys
from mcp.server import Server
from mcp.server.stdio import stdio_server

from server.server import create_mcp_server

async def main():
    """Entry point for MCP server."""
    server = create_mcp_server()
    async with stdio_server(server) as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="Textbook Context Server",
                server_version="1.0.0",
            ),
        )

if __name__ == "__main__":
    asyncio.run(main())
```

**2.3 Define Server Configuration**

```json
{
  "server_name": "textbook-context-server",
  "version": "1.0.0",
  "description": "MCP server for Physical AI & Humanoid Robotics Textbook",
  "tools": {
    "get_specification": {
      "description": "Retrieve specification for a feature",
      "scoped": true,
      "read_only": true
    },
    "search_code": {
      "description": "Search codebase for keywords",
      "scoped": true,
      "read_only": true
    }
  },
  "resources": {
    "specs": {
      "description": "Feature specifications",
      "path_pattern": "/specs/{feature}/**"
    },
    "code": {
      "description": "Source code files",
      "path_pattern": "/code/**"
    }
  },
  "security": {
    "max_result_tokens": 4000,
    "max_tool_calls_per_minute": 60,
    "allowed_paths": ["specs/", "code/", "docs/"],
    "blocked_patterns": [".env", "secrets", "credentials"]
  }
}
```

### Phase 3: Implement Tools

**3.1 Define Tool Base Class**

```python
# server/tools/base.py
from abc import ABC, abstractmethod
from typing import Any, Dict, List
from dataclasses import dataclass

@dataclass
class ToolResult:
    """Standard result format for tools."""
    success: bool
    data: Any
    error: str = None
    metadata: Dict[str, Any] = None

class BaseTool(ABC):
    """Base class for all MCP tools."""

    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description

    @abstractmethod
    async def execute(self, **kwargs) -> ToolResult:
        """Execute the tool with given parameters."""
        pass

    def get_input_schema(self) -> Dict[str, Any]:
        """Return JSON Schema for tool inputs."""
        pass
```

**3.2 Implement Example Tool: Get Specification**

```python
# server/tools/specification.py
import os
import json
from pathlib import Path
from typing import Optional
from .base import BaseTool, ToolResult

class GetSpecificationTool(BaseTool):
    """Tool to retrieve specification for a feature."""

    def __init__(self, specs_dir: str = "specs/"):
        super().__init__(
            name="get_specification",
            description="Retrieve specification for a feature"
        )
        self.specs_dir = Path(specs_dir)

    async def execute(self, feature: str) -> ToolResult:
        """
        Execute: retrieve feature specification.

        Args:
            feature: Feature name (e.g., 'authentication', 'digital-twins')

        Returns:
            ToolResult with specification content
        """
        try:
            # Validate input
            if not feature or not isinstance(feature, str):
                return ToolResult(
                    success=False,
                    error="Feature name must be non-empty string"
                )

            # Construct safe path
            spec_path = self.specs_dir / feature / "spec.md"

            # Check path is within allowed directory
            if not self._is_safe_path(spec_path):
                return ToolResult(
                    success=False,
                    error="Access denied: path outside allowed directory"
                )

            # Read specification
            if not spec_path.exists():
                return ToolResult(
                    success=False,
                    error=f"Specification not found: {feature}"
                )

            with open(spec_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Limit response size (token efficiency)
            if len(content) > 10000:
                content = content[:10000] + "\n\n[truncated...]"

            return ToolResult(
                success=True,
                data={
                    "feature": feature,
                    "content": content,
                    "path": str(spec_path)
                }
            )

        except Exception as e:
            return ToolResult(
                success=False,
                error=f"Error retrieving specification: {str(e)}"
            )

    def _is_safe_path(self, path: Path) -> bool:
        """Ensure path is within allowed directory."""
        try:
            path.resolve().relative_to(self.specs_dir.resolve())
            return True
        except ValueError:
            return False

    def get_input_schema(self) -> dict:
        """Return JSON Schema for tool inputs."""
        return {
            "type": "object",
            "properties": {
                "feature": {
                    "type": "string",
                    "description": "Feature name (e.g., 'authentication')"
                }
            },
            "required": ["feature"]
        }
```

**3.3 Example Tool: Code Search**

```python
# server/tools/code_search.py
import re
from pathlib import Path
from typing import List
from .base import BaseTool, ToolResult

class CodeSearchTool(BaseTool):
    """Tool to search codebase for keywords."""

    def __init__(self, code_dir: str = "code/"):
        super().__init__(
            name="search_code",
            description="Search codebase for keywords or patterns"
        )
        self.code_dir = Path(code_dir)
        self.max_results = 10

    async def execute(self, query: str, language: str = "python") -> ToolResult:
        """
        Execute: search codebase.

        Args:
            query: Search query or regex pattern
            language: Programming language to search in

        Returns:
            ToolResult with matching code snippets
        """
        try:
            # Validate inputs
            if not query or len(query) < 2:
                return ToolResult(
                    success=False,
                    error="Query must be at least 2 characters"
                )

            if language not in ["python", "javascript", "cpp", "java"]:
                return ToolResult(
                    success=False,
                    error=f"Unsupported language: {language}"
                )

            # Build file pattern
            ext_map = {
                "python": "*.py",
                "javascript": "*.js",
                "cpp": "*.cpp",
                "java": "*.java"
            }

            # Search files
            results = []
            for file_path in self.code_dir.rglob(ext_map[language]):
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()

                    # Find matches
                    matches = self._find_matches(content, query)
                    if matches:
                        results.append({
                            "file": str(file_path.relative_to(self.code_dir)),
                            "matches": matches[:3]  # Limit per file
                        })

                except Exception as e:
                    continue

            # Limit total results
            results = results[:self.max_results]

            return ToolResult(
                success=True,
                data={
                    "query": query,
                    "language": language,
                    "count": len(results),
                    "results": results
                }
            )

        except Exception as e:
            return ToolResult(
                success=False,
                error=f"Search error: {str(e)}"
            )

    def _find_matches(self, content: str, pattern: str) -> List[dict]:
        """Find pattern matches in content."""
        matches = []
        try:
            regex = re.compile(pattern, re.IGNORECASE)
            for i, line in enumerate(content.split('\n')):
                if regex.search(line):
                    matches.append({
                        "line": i + 1,
                        "content": line.strip()[:200]  # Truncate long lines
                    })
        except:
            # Fall back to substring search
            for i, line in enumerate(content.split('\n')):
                if pattern.lower() in line.lower():
                    matches.append({
                        "line": i + 1,
                        "content": line.strip()[:200]
                    })
        return matches

    def get_input_schema(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Search query or regex pattern"
                },
                "language": {
                    "type": "string",
                    "description": "Programming language",
                    "enum": ["python", "javascript", "cpp", "java"]
                }
            },
            "required": ["query"]
        }
```

### Phase 4: Implement Resources

**4.1 Define Resource Base Class**

```python
# server/resources/base.py
from abc import ABC, abstractmethod
from typing import Any, Dict, Optional

class BaseResource(ABC):
    """Base class for MCP resources."""

    def __init__(self, uri_pattern: str, name: str, description: str):
        self.uri_pattern = uri_pattern
        self.name = name
        self.description = description

    @abstractmethod
    async def get_contents(self, uri: str) -> Optional[str]:
        """Get resource contents by URI."""
        pass

    def matches(self, uri: str) -> bool:
        """Check if URI matches this resource's pattern."""
        import re
        pattern = self.uri_pattern.replace("{", "(?P<").replace("}", ">.*?)")
        return bool(re.match(pattern, uri))
```

**4.2 Example Resource: Specifications**

```python
# server/resources/specs.py
from pathlib import Path
from typing import Optional
from .base import BaseResource

class SpecificationsResource(BaseResource):
    """Resource for feature specifications."""

    def __init__(self, specs_dir: str = "specs/"):
        super().__init__(
            uri_pattern="/specs/{feature}/spec.md",
            name="specifications",
            description="Feature specifications"
        )
        self.specs_dir = Path(specs_dir)

    async def get_contents(self, uri: str) -> Optional[str]:
        """
        Get specification content for a URI like /specs/auth/spec.md
        """
        try:
            # Parse feature from URI
            # /specs/{feature}/spec.md → feature
            parts = uri.strip('/').split('/')
            if len(parts) < 3:
                return None

            feature = parts[1]

            # Construct safe path
            spec_path = self.specs_dir / feature / "spec.md"

            # Validate path safety
            if not self._is_safe_path(spec_path):
                return None

            # Read and return content
            if spec_path.exists():
                with open(spec_path, 'r', encoding='utf-8') as f:
                    return f.read()

            return None

        except Exception:
            return None

    def _is_safe_path(self, path: Path) -> bool:
        """Ensure path is within allowed directory."""
        try:
            path.resolve().relative_to(self.specs_dir.resolve())
            return True
        except ValueError:
            return False
```

### Phase 5: Implement Security & Validation

**5.1 Input Validation**

```python
# server/security/validation.py
import re
from typing import Any, Dict

class InputValidator:
    """Validate tool and resource inputs."""

    @staticmethod
    def validate_string(value: str, min_len: int = 1, max_len: int = 256) -> tuple[bool, str]:
        """Validate string input."""
        if not isinstance(value, str):
            return False, "Input must be a string"
        if len(value) < min_len:
            return False, f"Input too short (minimum {min_len})"
        if len(value) > max_len:
            return False, f"Input too long (maximum {max_len})"
        return True, ""

    @staticmethod
    def validate_identifier(value: str) -> tuple[bool, str]:
        """Validate that value is a valid identifier (no path traversal)."""
        if not re.match(r'^[a-zA-Z0-9_-]+$', value):
            return False, "Invalid identifier (alphanumeric, -, _ only)"
        if value.startswith('-'):
            return False, "Identifier cannot start with -"
        return True, ""

    @staticmethod
    def validate_path(value: str) -> tuple[bool, str]:
        """Validate file path (no ../../../ traversal)."""
        if '..' in value or value.startswith('/'):
            return False, "Invalid path (no absolute paths or traversal)"
        if any(char in value for char in ['*', '?', '|', '<', '>']):
            return False, "Invalid path characters"
        return True, ""

class OutputFilter:
    """Filter tool and resource outputs."""

    # Patterns to block in output
    BLOCKED_PATTERNS = [
        r'(?i)(api[_-]?key|secret|password|token)',
        r'(?i)(private[_-]?key|rsa|jwt)',
        r'mongodb://.*',
        r'postgresql://.*',
        r'\$OPENAI_API_KEY',
        r'\.env'
    ]

    @staticmethod
    def filter_sensitive_data(content: str) -> str:
        """Remove sensitive data from content."""
        for pattern in OutputFilter.BLOCKED_PATTERNS:
            content = re.sub(pattern, '[REDACTED]', content)
        return content

    @staticmethod
    def truncate_output(content: str, max_tokens: int = 4000) -> str:
        """Truncate content to token limit."""
        # Rough estimate: 1 token ≈ 4 characters
        max_chars = max_tokens * 4
        if len(content) > max_chars:
            return content[:max_chars] + "\n\n[Output truncated...]"
        return content
```

**5.2 Permission Control**

```python
# server/security/permissions.py
from enum import Enum
from typing import Set

class Permission(Enum):
    """Available permissions."""
    READ_SPEC = "read_spec"
    READ_CODE = "read_code"
    SEARCH_CODE = "search_code"
    RUN_TEST = "run_test"
    VALIDATE = "validate"

class PermissionManager:
    """Manage user permissions."""

    # Default permissions for different user roles
    ROLE_PERMISSIONS = {
        "viewer": {Permission.READ_SPEC, Permission.READ_CODE},
        "developer": {
            Permission.READ_SPEC,
            Permission.READ_CODE,
            Permission.SEARCH_CODE,
            Permission.RUN_TEST,
            Permission.VALIDATE
        },
        "admin": set(Permission)  # All permissions
    }

    def __init__(self, user_role: str = "viewer"):
        self.user_role = user_role
        self.permissions = self.ROLE_PERMISSIONS.get(user_role, set())

    def has_permission(self, permission: Permission) -> bool:
        """Check if user has permission."""
        return permission in self.permissions

    def check_permission(self, permission: Permission) -> tuple[bool, str]:
        """Check permission and return error message if denied."""
        if self.has_permission(permission):
            return True, ""
        return False, f"Permission denied: {permission.value}"
```

### Phase 6: Assemble Server

**6.1 Create Main Server Class**

```python
# server/server.py
from typing import List
from mcp.server import Server
from mcp.types import Tool, Resource, TextContent

from server.tools.specification import GetSpecificationTool
from server.tools.code_search import CodeSearchTool
from server.resources.specs import SpecificationsResource
from server.security.validation import InputValidator, OutputFilter
from server.security.permissions import PermissionManager, Permission

class TextbookContextServer:
    """Main MCP server for textbook context."""

    def __init__(self, user_role: str = "viewer"):
        self.server = Server("textbook-context-server")
        self.permission_manager = PermissionManager(user_role)
        self.validator = InputValidator()
        self.filter = OutputFilter()

        # Register tools
        self.tools = {
            "get_specification": GetSpecificationTool(),
            "search_code": CodeSearchTool()
        }

        # Register resources
        self.resources = {
            "specifications": SpecificationsResource()
        }

        # Setup handlers
        self._setup_handlers()

    def _setup_handlers(self):
        """Register MCP handlers."""

        @self.server.list_tools()
        async def list_tools():
            """List available tools."""
            tools = []
            for tool_name, tool in self.tools.items():
                tools.append(Tool(
                    name=tool_name,
                    description=tool.description,
                    inputSchema=tool.get_input_schema()
                ))
            return tools

        @self.server.call_tool()
        async def call_tool(name: str, arguments: dict):
            """Call a tool."""
            # Check permission
            perm = getattr(Permission, name.upper())
            has_perm, error = self.permission_manager.check_permission(perm)
            if not has_perm:
                return TextContent(text=f"Error: {error}", mime_type="text/plain")

            # Execute tool
            if name not in self.tools:
                return TextContent(
                    text=f"Tool not found: {name}",
                    mime_type="text/plain"
                )

            result = await self.tools[name].execute(**arguments)

            # Filter output
            output = str(result.data) if result.success else result.error
            output = self.filter.filter_sensitive_data(output)
            output = self.filter.truncate_output(output)

            return TextContent(text=output, mime_type="text/plain")

        @self.server.list_resources()
        async def list_resources():
            """List available resources."""
            resources = []
            for resource in self.resources.values():
                resources.append(Resource(
                    uri=resource.uri_pattern,
                    name=resource.name,
                    description=resource.description
                ))
            return resources

        @self.server.read_resource()
        async def read_resource(uri: str):
            """Read a resource."""
            for resource in self.resources.values():
                if resource.matches(uri):
                    content = await resource.get_contents(uri)
                    if content:
                        content = self.filter.filter_sensitive_data(content)
                        content = self.filter.truncate_output(content)
                        return TextContent(text=content, mime_type="text/markdown")

            return TextContent(
                text=f"Resource not found: {uri}",
                mime_type="text/plain"
            )

def create_mcp_server(user_role: str = "developer") -> Server:
    """Factory function to create MCP server."""
    server = TextbookContextServer(user_role)
    return server.server
```

**6.2 Update Entry Point**

```python
# server/main.py
import asyncio
from mcp.server.stdio import stdio_server
from mcp.types import InitializationOptions

from server.server import create_mcp_server

async def main():
    """Entry point for MCP server."""
    server = create_mcp_server(user_role="developer")

    async with stdio_server(server) as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="Textbook Context Server",
                server_version="1.0.0"
            )
        )

if __name__ == "__main__":
    asyncio.run(main())
```

## Example MCP Server Layout

Complete folder structure with all components:

```
mcp-textbook-server/
│
├── server/
│   ├── __init__.py
│   ├── main.py                    # Entry point
│   ├── server.py                  # Server class + handlers
│   │
│   ├── tools/                     # Tool implementations
│   │   ├── __init__.py
│   │   ├── base.py                # BaseTool class
│   │   ├── specification.py       # GetSpecificationTool
│   │   ├── code_search.py         # CodeSearchTool
│   │   ├── validation.py          # ValidateSpecTool
│   │   └── test_runner.py         # RunTestTool
│   │
│   ├── resources/                 # Resource implementations
│   │   ├── __init__.py
│   │   ├── base.py                # BaseResource class
│   │   ├── specs.py               # Specification resources
│   │   ├── code.py                # Code resources
│   │   ├── docs.py                # Documentation resources
│   │   └── tasks.py               # Task resources
│   │
│   ├── prompts/                   # Prompt templates
│   │   ├── __init__.py
│   │   ├── analyzer.py            # Spec analyzer prompt
│   │   ├── reviewer.py            # Code reviewer prompt
│   │   └── architect.py           # Architecture suggester
│   │
│   ├── security/                  # Security & validation
│   │   ├── __init__.py
│   │   ├── validation.py          # Input/output validation
│   │   ├── permissions.py         # Permission management
│   │   ├── filters.py             # Output filtering
│   │   ├── rate_limiter.py        # Rate limiting
│   │   └── audit_log.py           # Audit logging
│   │
│   ├── config/                    # Configuration
│   │   ├── __init__.py
│   │   ├── settings.py            # Server settings
│   │   └── constants.py           # Constants
│   │
│   └── utils/                     # Utilities
│       ├── __init__.py
│       ├── logger.py              # Logging setup
│       ├── tokenizer.py           # Token estimation
│       └── path_utils.py          # Path operations
│
├── tests/
│   ├── __init__.py
│   ├── test_tools.py              # Tool tests
│   ├── test_resources.py          # Resource tests
│   ├── test_server.py             # Integration tests
│   ├── test_security.py           # Security tests
│   └── fixtures/                  # Test data
│       ├── sample_specs/
│       └── sample_code/
│
├── docs/
│   ├── architecture.md            # Architecture guide
│   ├── setup.md                   # Setup instructions
│   ├── api.md                     # API documentation
│   └── examples.md                # Usage examples
│
├── scripts/
│   ├── setup.sh                   # Setup script
│   ├── test.sh                    # Run tests
│   ├── lint.sh                    # Code linting
│   └── run.sh                     # Run server
│
├── requirements.txt               # Python dependencies
├── setup.py                       # Package setup
├── config.json                    # Server config
├── .env.example                   # Environment template
├── README.md                      # Project README
└── LICENSE
```

## Testing Strategy

### Unit Tests for Tools

```python
# tests/test_tools.py
import pytest
from server.tools.specification import GetSpecificationTool
from server.tools.code_search import CodeSearchTool

@pytest.mark.asyncio
async def test_get_specification_success():
    """Test successful specification retrieval."""
    tool = GetSpecificationTool()
    result = await tool.execute(feature="authentication")

    assert result.success is True
    assert result.data["feature"] == "authentication"
    assert "content" in result.data

@pytest.mark.asyncio
async def test_get_specification_not_found():
    """Test specification not found."""
    tool = GetSpecificationTool()
    result = await tool.execute(feature="nonexistent")

    assert result.success is False
    assert "not found" in result.error

@pytest.mark.asyncio
async def test_code_search_basic():
    """Test basic code search."""
    tool = CodeSearchTool()
    result = await tool.execute(query="def ", language="python")

    assert result.success is True
    assert result.data["count"] >= 0

@pytest.mark.asyncio
async def test_code_search_invalid_query():
    """Test invalid search query."""
    tool = CodeSearchTool()
    result = await tool.execute(query="a", language="python")

    assert result.success is False
    assert "too short" in result.error
```

### Integration Tests

```python
# tests/test_server.py
import pytest
from server.server import create_mcp_server

@pytest.mark.asyncio
async def test_server_initialization():
    """Test server initializes correctly."""
    server = create_mcp_server(user_role="developer")
    assert server is not None

@pytest.mark.asyncio
async def test_list_tools():
    """Test listing tools."""
    server = create_mcp_server()
    tools = await server.list_tools()

    tool_names = [t.name for t in tools]
    assert "get_specification" in tool_names
    assert "search_code" in tool_names

@pytest.mark.asyncio
async def test_permission_denied():
    """Test permission denial for viewer role."""
    server = create_mcp_server(user_role="viewer")
    # viewer should not have RUN_TEST permission
    # test reflects this
```

## Security & Validation Patterns

### 1. Input Validation

```python
# ❌ Bad: No validation
def get_spec(feature):
    return open(f"specs/{feature}/spec.md").read()

# ✅ Good: Validate and sanitize
def get_spec(feature):
    valid, msg = InputValidator.validate_identifier(feature)
    if not valid:
        raise ValueError(msg)

    path = (Path("specs") / feature / "spec.md").resolve()

    # Ensure path is within allowed directory
    if not is_safe_path(path, Path("specs")):
        raise ValueError("Access denied")

    return path.read_text()
```

### 2. Output Filtering

```python
# ❌ Bad: Expose secrets
result = read_file("config.json")
return result

# ✅ Good: Filter sensitive data
result = read_file("config.json")
result = OutputFilter.filter_sensitive_data(result)
result = OutputFilter.truncate_output(result, max_tokens=4000)
return result
```

### 3. Permission Control

```python
# ❌ Bad: No permission checks
async def call_tool(name, args):
    tool = self.tools[name]
    return await tool.execute(**args)

# ✅ Good: Check permissions
async def call_tool(name, args):
    # Map tool name to permission
    perm = Permission[name.upper()]

    # Check if user has permission
    has_perm, error = self.permission_manager.check_permission(perm)
    if not has_perm:
        raise PermissionError(error)

    tool = self.tools[name]
    return await tool.execute(**args)
```

### 4. Safe Path Operations

```python
# ❌ Bad: Path traversal vulnerable
def read_file(path):
    return open(f"data/{path}").read()  # ../../../etc/passwd

# ✅ Good: Prevent traversal
def read_file(path):
    base = Path("data").resolve()
    full_path = (base / path).resolve()

    # Ensure resolved path is within base
    try:
        full_path.relative_to(base)
    except ValueError:
        raise ValueError("Access denied")

    return full_path.read_text()
```

## Common Mistakes & Best Practices

### ❌ Mistakes to Avoid

1. **Exposing Secrets in Output**
   - Never return API keys, passwords, or credentials
   - Filter `.env`, `secrets.json`, private keys
   - Use OutputFilter to redact sensitive patterns

2. **Unbounded Output Size**
   - Always truncate results to token budget
   - Paginate large datasets
   - Set max result limits per tool

3. **No Input Validation**
   - Always validate and sanitize inputs
   - Check types, lengths, patterns
   - Use allowlists for identifiers

4. **Path Traversal Vulnerabilities**
   - Always use resolved paths
   - Check that resolved path is within base directory
   - Avoid string concatenation for paths

5. **Missing Permission Checks**
   - Check permissions before executing tools
   - Map tools to permission levels
   - Implement role-based access

6. **Poor Error Messages**
   - Don't expose internal system details
   - Return user-friendly error messages
   - Log detailed errors internally only

7. **No Rate Limiting**
   - Implement rate limits on tool calls
   - Prevent abuse and resource exhaustion
   - Log rate limit violations

### ✅ Best Practices

1. **Design for Token Efficiency**
   - Return only necessary data
   - Estimate token usage
   - Compress and paginate large results

2. **Comprehensive Logging**
   - Log all tool invocations
   - Record inputs, outputs (sanitized), and results
   - Include timestamps and user info
   - Maintain audit trail

3. **Clear Tool Descriptions**
   - Write clear, concise tool descriptions
   - Provide examples in docstrings
   - Explain parameters and return values
   - Document limitations and assumptions

4. **Isolated Tool Implementation**
   - Each tool has single responsibility
   - Don't share state between tools
   - Make tools independent and testable

5. **Resource URI Conventions**
   - Use consistent URI patterns
   - Follow REST principles
   - Make URIs predictable and discoverable

6. **Version Compatibility**
   - Maintain backwards compatibility
   - Version your API/resources
   - Document breaking changes

7. **Testing & Validation**
   - Write unit tests for each tool
   - Test permission boundaries
   - Test error conditions
   - Validate output filtering

## Token Efficiency Strategies

### 1. Context Scoping

```python
# ❌ Bad: Return entire spec
spec = read_file("specs/auth/spec.md")  # Maybe 50KB

# ✅ Good: Return only relevant section
def get_spec_section(feature, section):
    """Return only specific section of spec."""
    spec = read_file(f"specs/{feature}/spec.md")

    # Extract section
    sections = spec.split("## ")
    for sec in sections:
        if section.lower() in sec.split('\n')[0].lower():
            return sec[:2000]  # Limit size

    return None
```

### 2. Lazy Loading

```python
# ❌ Bad: Load everything
spec = read_file("spec.md")
plan = read_file("plan.md")
tasks = read_file("tasks.md")
all_content = f"{spec}\n{plan}\n{tasks}"

# ✅ Good: Load on demand
class LazySpecResource:
    def get_contents(self, uri):
        # Only read what's requested
        if "/spec.md" in uri:
            return read_file("spec.md")
        # Don't load others
```

### 3. Compression & Summarization

```python
# ❌ Bad: Return entire content
return {
    "content": entire_spec_file,
    "length": len(entire_spec_file)
}

# ✅ Good: Return summary + headings
def summarize_spec(feature):
    spec = read_file(f"specs/{feature}/spec.md")
    lines = spec.split('\n')

    # Extract headings and first line of each section
    summary = []
    for line in lines:
        if line.startswith('#'):
            summary.append(line)

    return "\n".join(summary)  # Much smaller
```

## Configuration & Deployment

### Production Setup

```bash
#!/bin/bash
# setup.sh

# Create virtual environment
python3.10 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run tests
pytest tests/

# Start server
python -m server.main
```

### Docker Deployment

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY server/ ./server/
COPY config.json .

EXPOSE 5000

CMD ["python", "-m", "server.main"]
```

### Environment Configuration

```bash
# .env
MCP_SERVER_PORT=5000
MCP_SERVER_HOST=0.0.0.0
MCP_USER_ROLE=developer
MCP_MAX_RESULT_TOKENS=4000
MCP_RATE_LIMIT=60  # calls per minute
MCP_LOG_LEVEL=INFO
```

## Testing & Deployment Checklist

- [ ] All tools have unit tests
- [ ] All resources have unit tests
- [ ] Integration tests pass
- [ ] Security tests pass (input validation, output filtering)
- [ ] Permission tests pass
- [ ] Path traversal tests pass (confirm no vulnerabilities)
- [ ] Rate limiting works
- [ ] Error handling covers all edge cases
- [ ] Tool descriptions are clear and accurate
- [ ] Sensitive data is filtered from all outputs
- [ ] Output is truncated to token limits
- [ ] Logging captures all tool invocations
- [ ] Configuration is externalized (not hardcoded)
- [ ] Docker builds successfully
- [ ] Server initializes without errors
- [ ] MCP protocol tests pass (tool discovery, tool invocation, resource reading)

## Acceptance Criteria

- ✅ Server implements MCP specification correctly
- ✅ Tools are discoverable and callable
- ✅ Resources are accessible and content is valid
- ✅ All inputs are validated and sanitized
- ✅ All outputs are filtered for sensitive data
- ✅ All outputs are truncated to token budget
- ✅ Permissions are enforced correctly
- ✅ No path traversal vulnerabilities
- ✅ Rate limiting is implemented
- ✅ Comprehensive logging is in place
- ✅ All tests pass
- ✅ Documentation is complete
- ✅ Production deployment is tested

---

Save it as `.claude/skills/mcp-server/skill.md`
