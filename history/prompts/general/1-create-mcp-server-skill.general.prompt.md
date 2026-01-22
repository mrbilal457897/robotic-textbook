---
id: 1
title: Create MCP Server Skill
stage: general
date: 2026-01-16
surface: agent
model: claude-haiku-4-5-20251001
feature: none
branch: 001-physical-ai-textbook
user: bilal
command: Create Claude Code Skill for MCP server design and implementation
labels: ["skill", "mcp", "architecture", "server-development", "ai-integration"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .claude/skills/mcp-server/skill.md
tests:
  - Manual verification of skill content structure
  - Validation against CLAUDE.md guidelines
---

## Prompt

Create a Claude Code Skill for the project "Physical AI & Humanoid Robotics Interactive Textbook".

Skill purpose: Design, implement, and maintain an MCP (Model Context Protocol) Server.

What this skill must do:
- Explain MCP architecture clearly (Server, Client, Tools, Resources)
- Generate a production-ready MCP server structure
- Support tools, resources, and prompts
- Enable AI agents to safely access project context
- Handle context scoping and permissions
- Ensure token-efficient context delivery

Responsibilities:
- Create MCP server folder structure
- Define server entry point
- Define tools registration pattern
- Define resources exposure pattern
- Add context filtering and validation rules
- Add security and safety notes

Technical constraints:
- Follow official MCP specification
- Node.js or Python compatible
- Clean separation of tools, resources, and prompts
- No hallucinated APIs
- Simulation-first and safe-by-design

Skill structure requirements:
- YAML frontmatter (name, description)
- Clear step-by-step instructions
- Architecture explanation
- Example MCP server layout
- Example tool + resource registration
- Common mistakes and best practices
- Tools section (Node/Python MCP SDK)
- End with this exact line: "Save it as .claude/skills/mcp-server/skill.md"

When to use this skill:
- When building an MCP server for AI agents
- When integrating Claude or other LLMs via MCP
- When exposing textbook content, specs, or simulations as structured context

## Response snapshot

Created comprehensive MCP server skill at `.claude/skills/mcp-server/skill.md` with:

### Content Coverage:
- **Overview**: MCP architecture explanation (Client-Server model, components)
- **Core Principles**: MCP design patterns, communication model, token efficiency
- **Step-by-Step Implementation**: 6-phase approach from planning to assembly
- **Architecture Explanation**: Bidirectional messaging, message types, context scoping
- **Example MCP Server**:
  - Complete folder structure with tools, resources, prompts, security modules
  - Python implementation using official MCP SDK
  - Tool implementations: GetSpecificationTool, CodeSearchTool
  - Resource implementations: SpecificationsResource, CodeResource
  - Security layer: InputValidator, OutputFilter, PermissionManager
- **Testing Strategy**: Unit tests, integration tests, security tests
- **Security & Validation Patterns**: 4 critical patterns with bad/good examples
  - Input validation (prevent path traversal)
  - Output filtering (redact secrets)
  - Permission control (role-based access)
  - Safe path operations
- **Common Mistakes & Best Practices**: 7 mistakes to avoid, 7 best practices to follow
- **Token Efficiency Strategies**: Context scoping, lazy loading, compression
- **Configuration & Deployment**: Production setup, Docker, environment config
- **Acceptance Criteria**: 11 validation checkpoints

### Technical Implementation:
- Python 3.10+ with asyncio
- Official MCP specification compliance
- Supports tools, resources, and prompts
- Safe-by-design with validation + filtering + permissions
- Token budget enforcement (4000 token limit default)
- Rate limiting ready
- Comprehensive logging

### Skill Quality:
- 1,150+ lines of detailed documentation
- 7 complete code examples (server class, tools, resources, validation, filters)
- Clear learning progression from architecture → planning → implementation → testing
- Production-ready patterns and best practices
- Security-first approach with multiple layers

## Outcome

- ✅ Impact: Comprehensive, production-ready MCP server skill enables developers to safely integrate AI agents with textbook context
- 🧪 Tests: Manual verification of YAML frontmatter, content structure, code examples, requirements checkpoints
- 📁 Files: 1 new skill file (.claude/skills/mcp-server/skill.md)
- 🔁 Next prompts:
  - Implement MCP server using this skill for textbook context
  - Create MCP client to test server endpoints
  - Integrate MCP server with Claude API
  - Add resource indexing for fast retrieval
- 🧠 Reflection: Skill provides complete toolkit for building secure, production-grade MCP servers that expose textbook context safely

## Evaluation notes (flywheel)

- Failure modes observed: None - skill successfully created with all required components
- Graders run and results: PASS - Skill meets all specification requirements and CLAUDE.md guidelines
- Prompt variant: N/A
- Next experiment: Use mcp-server skill to generate production MCP server for textbook context integration
