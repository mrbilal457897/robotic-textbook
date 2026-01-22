---
name: auth-flow
description: Design authentication and protected access flows for the Physical AI & Humanoid Robotics Interactive Textbook. Create secure login/signup flows, implement content protection for premium or advanced sections, and enforce security best practices without storing or exposing secrets for the Interactive Textbook.
---

# Auth Flow Skill

## Overview

This skill enables the conceptual design and implementation of secure authentication flows and content protection mechanisms for gated or premium textbook sections. It provides guidance on user authentication patterns, access control strategies, and security best practices while emphasizing that this skill is for conceptual design only—all sensitive implementation details (secrets, tokens, credentials) are handled securely outside the scope of this skill.

## When to Use This Skill

- When adding gated or premium content sections to the textbook
- When designing user authentication for learning progress tracking
- When implementing role-based access control (student, instructor, premium)
- When protecting advanced modules or experimental features
- When requiring user accounts for progress persistence
- When implementing instructor-only content or grading features
- When designing trial/freemium access models
- When creating learner communities with member-only features

## Core Principles

### Security First
- Design with security assumptions from the start
- Follow principle of least privilege (minimal necessary access)
- Separate concerns (auth, authorization, data access)
- Defense in depth (multiple security layers)
- Fail securely (deny by default)

### Secrets Management Boundary
- This skill handles conceptual flow design only
- All secrets (passwords, tokens, keys) managed externally
- Never embed credentials in code or documentation
- Use environment variables and secure vaults
- Assume infrastructure handles encryption

### User-Centered Design
- Authentication should be frictionless
- Minimum required information collection
- Clear privacy policies and data handling
- Easy account recovery and management
- Progressive authentication (ask for more info when needed)

### Standards Compliance
- Follow industry standards (OAuth 2.0, OpenID Connect)
- WCAG compliance for login UI
- GDPR/privacy law compliance
- SOC 2 security practices
- Regular security audits

## Step-by-Step Authentication Flow Design

### Phase 1: Define Authentication Requirements

**1.1 Identify User Roles**
```
Typical Textbook Roles:

1. Anonymous User
   - Can access: Public lessons, sample content
   - Cannot: See progress, unlock premium content
   - Conversion path: Signup → Student

2. Student / Learner
   - Can access: All public content, track progress
   - Cannot: See instructor analytics, create content
   - Permissions: Read lessons, save bookmarks, track completion

3. Premium Student
   - Extends Student with:
   - Access: Advanced modules, simulation labs, code playgrounds
   - Storage: Increased quota for projects
   - Support: Priority help forums

4. Instructor / Educator
   - Can access: Student content + instructor dashboard
   - Cannot: See other instructor data (isolation)
   - Permissions: View student progress, manage classes, create content

5. Administrator
   - Full system access (use minimally)
   - Can: Manage users, audit logs, system configuration
   - Constraints: Audit all actions, require 2FA
```

**1.2 Define Access Resources**
```
Content Access Levels:

1. Public
   - No authentication required
   - Examples: Introduction, free lessons, demos
   - Default: Everyone can access

2. Authenticated Only
   - Requires user login
   - Examples: Progress tracking, bookmarks, saved work
   - Default: Logged-in students

3. Premium Only
   - Requires student + active premium subscription
   - Examples: Advanced modules, simulation labs, certificates
   - Enforcement: License/subscription check at access time

4. Instructor Only
   - Requires instructor role
   - Examples: Grade book, student analytics, attendance
   - Enforcement: Role check, course ownership

5. Admin Only
   - Requires administrator role
   - Examples: User management, system logs, configuration
   - Enforcement: Role + MFA check
```

**1.3 Define User Information Needs**
```
Minimal Data Collection:

Required:
- Email (unique, verified)
- Password (never stored plaintext)

Optional (with consent):
- Display name
- Learning goals
- Programming experience level
- Timezone

Never Collect:
- Passwords in plaintext
- Credit card details (use payment processor)
- Sensitive identity documents
- Medical/disability information unless directly relevant

Data Handling:
- Encryption at rest
- HTTPS in transit
- Retention policy (delete after account closure)
- User can export/delete data
```

**1.4 Plan Security Features**
```
Essential Security Measures:

1. Password Security
   - Minimum entropy (14+ characters, mixed case/numbers/symbols)
   - Never send via email
   - Reset links expire in 24 hours
   - Rate limiting on password resets

2. Multi-Factor Authentication (MFA)
   - Optional for students, required for instructors/admins
   - Support: TOTP (authenticator apps), email codes, SMS backup
   - Recovery codes for account lockout

3. Session Management
   - Secure HTTP-only cookies (not localStorage)
   - Session timeout (activity-based, 30 min to 24 hours)
   - Logout clears all sessions
   - Single sign-out (logout everywhere)

4. API Security
   - JWT or OAuth 2.0 for API auth
   - Rate limiting per user/IP
   - CORS properly configured
   - No secrets in URL parameters

5. Audit & Monitoring
   - Log all authentication events
   - Monitor failed login attempts
   - Alert on unusual patterns (multiple IPs, rapid logins)
   - Regular audit of access logs
```

### Phase 2: Design Authentication Flows

**2.1 Signup Flow**
```
High-Level Flow:

User initiates signup
    ↓
Display signup form (email, password, optional name)
    ↓
Validate input (format, length, complexity)
    ↓
Check email uniqueness
    ↓
Send verification email (link expires in 24h)
    ↓
User clicks email verification link
    ↓
Mark email as verified
    ↓
Create student account (default role)
    ↓
Set initial access level (public + authenticated content)
    ↓
Redirect to onboarding or dashboard

Security Considerations:
- Rate limit signup attempts per IP (10/hour)
- Use CSRF token for form submission
- Hash password before storage (bcrypt, Argon2)
- Don't reveal if email already exists (prevent enumeration)
- Verify email before allowing certain actions
- Log signup events with IP, timestamp, user agent
```

**2.2 Login Flow**
```
High-Level Flow:

User enters email and password
    ↓
Rate limit check (prevent brute force)
    ↓
Validate email format
    ↓
Lookup user by email
    ↓
Compare provided password with stored hash
    ↓
If credentials invalid: Increment failed attempt counter
    ↓
If failed attempts > threshold: Lock account (send unlock email)
    ↓
If credentials valid: Check if MFA enabled
    ↓
If MFA required: Send/display MFA prompt (TOTP, email code, SMS)
    ↓
If MFA invalid: Reject (log attempt)
    ↓
If MFA valid: Create session
    ↓
Generate session token (JWT or secure cookie)
    ↓
Log successful login (IP, device, location)
    ↓
Redirect to dashboard or intended page

Security Considerations:
- Rate limit: Max 5 failed attempts, 15 min lockout
- Use constant-time password comparison
- MFA should be stateless (no storing codes)
- Session tokens should be cryptographically random
- Include user ID and roles in token (signed, not encrypted)
- Set secure flags on cookies (HttpOnly, Secure, SameSite)
- Clear failed attempt counter on success
```

**2.3 Password Reset Flow**
```
High-Level Flow:

User clicks "Forgot Password"
    ↓
Enter email address
    ↓
Rate limit check (3 requests per 24h per email)
    ↓
Lookup user by email
    ↓
Generate reset token (cryptographically random, 32+ bytes)
    ↓
Store token hash (don't store plaintext)
    ↓
Token expires in 24 hours
    ↓
Send reset link via email (contains token)
    ↓
User clicks link in email
    ↓
Verify token (check hash, expiration)
    ↓
Display new password form
    ↓
Validate new password (complexity, not same as old)
    ↓
Hash and store new password
    ↓
Invalidate all existing sessions (force re-login)
    ↓
Send confirmation email
    ↓
Redirect to login

Security Considerations:
- Never confirm if email exists (prevents enumeration)
- Reset tokens valid for 24h only
- One-time use (invalidate after use)
- Inform user of reset attempt (even if email not found)
- Include IP/timestamp in confirmation email
- Require strong password (enforce entropy)
- Don't expire old password-based sessions immediately in some cases
```

**2.4 Email Verification Flow**
```
High-Level Flow:

User provides email during signup/update
    ↓
Generate verification token (time-limited, single-use)
    ↓
Send verification email with link
    ↓
User clicks verification link
    ↓
Validate token (check expiration, one-time use)
    ↓
Mark email as verified in user profile
    ↓
Log verification event
    ↓
Optionally auto-login user
    ↓
Redirect to onboarding or dashboard

Security Considerations:
- Tokens expire in 24-48 hours
- Allow resending verification email (rate limited: 3/hour)
- Track verification attempts (log suspicious patterns)
- Separate verified flag from email (can have unverified backup)
- Require verified email before accessing premium content
```

**2.5 Multi-Factor Authentication (MFA) Flow**
```
High-Level Flow (TOTP - Time-based One-Time Password):

User enables MFA in settings
    ↓
Generate secret key (random, ~32 bytes)
    ↓
Display QR code (user scans with authenticator app)
    ↓
User enters code from app to verify setup
    ↓
Validate code (must be current or previous code, ±30 seconds)
    ↓
Generate recovery codes (10 single-use codes)
    ↓
Display recovery codes (user saves securely)
    ↓
Mark MFA as enabled
    ↓
Log MFA enablement

High-Level Flow (Login with MFA):

User enters email and password
    ↓
Credentials validated
    ↓
Check if MFA enabled
    ↓
Display MFA entry field
    ↓
User enters 6-digit code from authenticator app
    ↓
Validate code (check current window ±30 seconds)
    ↓
If valid: Create session
    ↓
If invalid: Increment MFA attempt counter (max 5)
    ↓
If exceeded: Require password reset or recovery code
    ↓
Log MFA verification (success/failure)

Security Considerations:
- Secret key stored hashed (never plaintext)
- TOTP codes valid for 30-second window (±1 period)
- Recovery codes are single-use, irreversible hashes
- Don't allow reuse of previous TOTP codes
- Require MFA disable to have MFA enabled first
- Alert user when MFA used (notification email)
- Backup MFA methods required (email, SMS, recovery codes)
```

### Phase 3: Design Authorization System

**3.1 Role-Based Access Control (RBAC)**
```
Role Definition:

role Student {
    permissions: [
        "lessons.read",
        "lessons.track_progress",
        "bookmarks.manage",
        "profile.edit"
    ]
}

role Premium {
    extends: Student
    permissions: [
        "advanced_modules.read",
        "labs.execute",
        "certifications.earn"
    ]
}

role Instructor {
    permissions: [
        "students.view_progress",
        "classes.manage",
        "grades.enter",
        "content.create"
    ]
}

role Admin {
    permissions: [
        "users.manage",
        "system.configure",
        "audit_logs.view",
        "enforcement.actions"
    ]
}

Implementation Pattern:
// Pseudocode
function checkPermission(user, action) {
    for each role in user.roles {
        if role.permissions.contains(action) {
            return true
        }
    }
    return false
}

// Usage
if (checkPermission(user, "labs.execute")) {
    allowAccessToLabs()
} else {
    redirectToUpgradeFlow()
}
```

**3.2 Attribute-Based Access Control (ABAC)**
```
Access Rules (more fine-grained):

rule: Access lesson based on attributes
requires {
    user.email_verified = true
    user.account_age > 1_day  // Prevent immediately gating access
    lesson.access_level in [user.max_access_level]
    NOT (lesson.instructor_only AND user.role != "instructor")
}

rule: Access premium lab
requires {
    user.role in ["Student", "Premium", "Instructor"]
    user.subscription.status = "active" OR user.role = "Instructor"
    lab.difficulty <= user.skill_level
}

Implementation Pattern:
// Evaluate multiple conditions
function canAccessResource(user, resource) {
    checks = [
        user.isAuthenticated(),
        user.emailVerified(),
        user.hasRequiredRole(resource.requiredRole),
        user.hasActiveSubscription() OR resource.isPaid == false,
        user.skillLevel >= resource.minimumSkillLevel
    ]
    return all(checks)
}
```

**3.3 Content Protection Strategy**
```
Protection Levels:

Level 1: Public (no authentication)
- No user check required
- Example: "Introduction to ROS 2"
- Visible on public pages

Level 2: Authenticated (login required)
- Check: user.authenticated = true
- Example: "Your Learning Progress"
- Redirect to login if not authenticated

Level 3: Premium (subscription required)
- Check: user.hasActiveSubscription() AND user.subscription.tier = "premium"
- Example: "Advanced Simulation Lab"
- Show upgrade CTA if not premium

Level 4: Instructor (role required)
- Check: user.role = "instructor"
- Example: "Student Grade Book"
- Show upgrade CTA if not instructor

Level 5: Admin (administrator role)
- Check: user.role = "admin" AND user.mfaEnabled = true
- Example: "System Configuration"
- Strictly limited access

Implementation (Conceptual):
function protectContent(content, user) {
    switch(content.accessLevel) {
        case "PUBLIC":
            return content  // Always accessible

        case "AUTHENTICATED":
            if (user.authenticated) {
                return content
            } else {
                return redirectToLogin()
            }

        case "PREMIUM":
            if (user.hasActiveSubscription("premium")) {
                return content
            } else {
                return showUpgradePrompt()
            }

        case "INSTRUCTOR":
            if (user.role == "instructor") {
                return content
            } else {
                return accessDeniedPage()
            }

        case "ADMIN":
            if (user.role == "admin" && user.mfaEnabled) {
                return content
            } else {
                return accessDeniedPage()
            }
    }
}
```

### Phase 4: Design Account Management Flows

**4.1 Profile Management**
```
User Profile Update Flow:

User logs in
    ↓
Access account settings
    ↓
Display profile form (name, timezone, learning goals)
    ↓
User edits fields
    ↓
Validate changes (length limits, format)
    ↓
If email change: Send verification email to new address
    ↓
Mark new email as pending verification
    ↓
Store profile changes
    ↓
Log profile update event
    ↓
Show confirmation message

Security Considerations:
- Require password re-entry for sensitive changes (email, password)
- Verify new email before making active
- Send notification to old email if email changes
- Track all profile changes in audit log
```

**4.2 Password Change**
```
Password Change Flow:

User in account settings
    ↓
Click "Change Password"
    ↓
Require current password entry (verify user is present)
    ↓
Verify current password against stored hash
    ↓
If invalid: Show error, log attempt
    ↓
Display new password form
    ↓
Validate new password (complexity, entropy)
    ↓
Ensure new password ≠ current password
    ↓
Hash and store new password
    ↓
Optionally invalidate other sessions
    ↓
Send confirmation email
    ↓
Log password change

Security Considerations:
- Always require current password (prevent unauthorized changes)
- Compare new vs. old (prevent reuse)
- Rate limit (1 change per hour max)
- Invalidate all sessions after change (force re-login)
- Send email notification to account email
```

**4.3 Account Deactivation/Deletion**
```
Account Deactivation Flow:

User requests account deactivation
    ↓
Display warning (data will be deleted, action permanent)
    ↓
Require password entry (confirm user authorization)
    ↓
Send confirmation email with 24-hour deadline
    ↓
User clicks confirmation in email
    ↓
Mark account as deactivated (soft delete initially)
    ↓
Schedule data deletion for 30 days (allow recovery period)
    ↓
Revoke all sessions
    ↓
Disable API access
    ↓
After 30 days: Permanently delete account and associated data
    ↓
Log deactivation/deletion events

Security Considerations:
- Require confirmation email (prevent accidental deletion)
- 30-day grace period for recovery
- Archive data before deletion (compliance, auditing)
- Don't delete immediately (allow dispute resolution)
- Notify user of scheduled deletion
- Log all deletion actions with timestamp/user
```

**4.4 Subscription Management**
```
Subscription Upgrade Flow:

User clicks "Upgrade to Premium"
    ↓
Display upgrade options (monthly, annual, etc.)
    ↓
Redirect to payment processor (Stripe, etc.)
    ↓
User enters payment information
    ↓
Process payment (don't handle directly, use processor)
    ↓
Receive webhook confirmation from payment processor
    ↓
Validate webhook signature (prevent spoofing)
    ↓
Update user subscription status in database
    ↓
Create subscription record with expiration
    ↓
Grant premium permissions
    ↓
Send confirmation email
    ↓
Log subscription event
    ↓
Unlock premium content

Subscription Expiration Flow:

Check: user.subscription.expiration <= today
    ↓
If yes: Mark subscription as expired
    ↓
Revoke premium permissions
    ↓
Send renewal reminder email (1 week before expiration)
    ↓
If not renewed: Downgrade to student role
    ↓
Restrict access to premium content
    ↓
Show upgrade CTA on premium content

Security Considerations:
- Never handle credit card directly (use payment processor)
- Validate all webhooks from payment processor
- Store subscription state separately from payment state
- Implement idempotency (handle duplicate webhooks)
- Log all subscription changes
- Don't store payment information locally
```

### Phase 5: Design Session Management

**5.1 Session Token Strategy**
```
Token Structure (JWT - Conceptual):

{
    "header": {
        "alg": "HS256",
        "typ": "JWT"
    },
    "payload": {
        "user_id": "user_123",
        "roles": ["student", "premium"],
        "email": "user@example.com",
        "issued_at": 1609459200,
        "expires_at": 1609545600,
        "session_id": "session_xyz"
    },
    "signature": "HMACSHA256(base64(header) + '.' + base64(payload), secret)"
}

Token Usage:
- Include in Authorization header: "Bearer {token}"
- Or in secure HTTP-only cookie
- Server validates signature (verify secret)
- Server checks expiration
- Server validates session_id (prevent token forgery)

Security Considerations:
- Sign tokens, don't encrypt (receiver needs to verify)
- Include session_id (prevents token reuse)
- Short expiration (15 min to 1 hour)
- Use refresh tokens for longer sessions
- Revoke tokens on logout
- Rotate signing keys periodically
```

**5.2 Session Timeout Strategy**
```
Timeout Types:

Idle Timeout (inactivity):
- User inactive for 30 minutes → automatic logout
- Save work before logout
- Show warning 5 minutes before logout

Absolute Timeout:
- Session valid for max 24 hours (regardless of activity)
- Prevents extended access with stale token
- Requires re-login after 24 hours

Sliding Expiration:
- Each request extends session (common for web apps)
- User stays logged in as long as active
- Logout on inactivity period

Implementation (Conceptual):
function validateSession(token) {
    currentTime = getCurrentTimestamp()

    // Check expiration
    if (token.expires_at < currentTime) {
        return invalidSessionExpired()
    }

    // Check idle timeout (sliding window)
    if (currentTime - token.last_activity > IDLE_TIMEOUT) {
        return invalidSessionIdleTimeout()
    }

    // Check absolute timeout (24 hours)
    if (currentTime - token.issued_at > ABSOLUTE_TIMEOUT) {
        return invalidSessionAbsoluteTimeout()
    }

    // Update last_activity
    token.last_activity = currentTime

    return validSession()
}
```

**5.3 Multi-Device Session Management**
```
Multi-Device Flow:

User logs in on Device A
    ↓
Session created for Device A
    ↓
Store session metadata (device name, IP, timestamp)
    ↓
User logs in on Device B
    ↓
Session created for Device B
    ↓
Both sessions valid simultaneously
    ↓
User logs out on Device A
    ↓
Invalidate only Device A session
    ↓
Device B remains logged in

Device Management Interface:

User sees list of active sessions:
- Device name (browser, mobile, etc.)
- IP address and location
- Last active time
- "Logout this device" option

Security Considerations:
- Allow user to see all active sessions
- Enable per-device logout
- Enable "logout all devices" option
- Alert on new device login (email notification)
- Show suspicious sessions (new location, device)
- Allow user to mark sessions as unrecognized
```

### Phase 6: Design Error Handling & Security

**6.1 Error Messages Strategy**
```
Principle: Reveal minimum information to prevent enumeration

GOOD Error Messages:
- Generic: "Invalid email or password"
- Reason: Doesn't reveal if email exists
- Impact: Prevents account enumeration

BAD Error Messages:
- Specific: "Email not found" / "Password incorrect"
- Reason: Attacker learns which emails have accounts
- Impact: Enables targeted attacks

Error Message Examples:

Instead of: "Email not registered"
Use: "We couldn't find your account"

Instead of: "Incorrect password"
Use: "Invalid email or password"

Instead of: "Account locked (too many attempts)"
Use: "Account temporarily unavailable, try again later"

Instead of: "MFA code expired"
Use: "Invalid code, please try again"

Logging:
- Log detailed errors server-side (for debugging)
- Send generic errors to client (for security)
- Example:
    // Server log (detailed)
    logger.info("Password mismatch for user user@example.com")

    // Client message (generic)
    showError("Invalid email or password")
```

**6.2 Rate Limiting Strategy**
```
Rate Limits by Endpoint:

Login attempts:
- Max 5 failed attempts per 15 minutes per user
- Max 20 failed attempts per hour per IP
- Exponential backoff (increasing delay between attempts)

Password reset requests:
- Max 3 requests per 24 hours per email
- Max 10 requests per hour per IP

Email verification:
- Max 5 verification emails per hour per email address
- Max 20 verification emails per day per IP

MFA attempts:
- Max 5 failed MFA codes per 15 minutes
- Max 10 failed attempts per hour

API endpoints:
- Authenticated users: 1000 requests per hour
- Unauthenticated: 100 requests per hour per IP

Implementation Pattern:
function rateLimit(user, action, limit, timeWindow) {
    key = user.id + ":" + action
    count = redis.get(key) || 0

    if (count >= limit) {
        throw RateLimitExceeded()
    }

    redis.increment(key)
    redis.expire(key, timeWindow)
}

// Usage
rateLimit(user, "login_attempt", 5, 900)  // 5 in 15 min
```

**6.3 CSRF Protection**
```
CSRF (Cross-Site Request Forgery) Prevention:

Problem:
- Attacker tricks user into submitting form from attacker site
- User's browser includes session cookie automatically
- Action executed without user's knowledge

Solution: CSRF Tokens

Implementation:
1. On form page load:
   - Generate random token (per session or per request)
   - Include token in form as hidden field
   - Store token server-side (session)

2. On form submission:
   - User submits form with CSRF token
   - Extract token from request
   - Compare with token in session
   - If mismatch: Reject request
   - If valid: Process request

Example (Conceptual):

// Generate token
<form method="POST" action="/login">
    <input type="hidden" name="csrf_token" value="random_xyz">
    <input type="email" name="email">
    <input type="password" name="password">
    <button type="submit">Login</button>
</form>

// Validate on submission
function validateCSRF(request) {
    submittedToken = request.body.csrf_token
    sessionToken = request.session.csrf_token

    if (submittedToken != sessionToken) {
        throw CSRFTokenMismatch()
    }
}
```

### Phase 7: Security Monitoring & Compliance

**7.1 Audit Logging**
```
Events to Log:

Authentication:
- Signup (email, timestamp, IP)
- Email verification (success/failure)
- Login (success/failure, IP, device)
- Logout (timestamp)
- Password change (timestamp)
- Password reset (request/completion)
- MFA enabled/disabled
- MFA verification (success/failure)

Authorization:
- Access to protected content (user, resource, timestamp)
- Permission granted/revoked
- Role assigned/removed

Account Changes:
- Profile updates
- Email changes
- Subscription changes
- Account deactivation/deletion

Security Events:
- Failed login attempts
- Suspicious patterns (multiple IPs, rapid requests)
- MFA bypasses/failures
- Session terminations
- Password reset abuse

Log Content (Never Include):
- Passwords
- Credit card information
- API secrets or tokens
- Personally identifiable information (beyond email)

Log Content (Always Include):
- User ID (not email, use ID)
- Action (what happened)
- Timestamp (when)
- IP address (where)
- Success/failure status
- Change details (what changed, from/to)

Example Log Entry:
{
    "timestamp": "2024-01-15T10:30:45Z",
    "event_type": "login_success",
    "user_id": "user_123",
    "ip_address": "192.168.1.1",
    "device": "Chrome on Windows",
    "location": "New York, USA"
}
```

**7.2 Alerting & Incident Response**
```
Alert Triggers:

Critical Alerts:
- Multiple failed login attempts (> 10 in 1 hour)
- MFA bypass attempts
- Unauthorized API access
- Bulk account creation
- Payment processor failures

High Priority:
- Unusual location (login from new country)
- Impossible travel (login from distant location in short time)
- Credential stuffing patterns
- Privilege escalation attempts

Medium Priority:
- First login of new user
- Email change request
- Password reset request
- Subscription upgrade/downgrade

Response Actions:
- Alert security team (critical)
- Notify user (suspicious activity)
- Require MFA (after suspicious login)
- Session termination (after compromise)
- Account lockdown (during investigation)
```

**7.3 GDPR Compliance**
```
GDPR Requirements:

1. Consent
   - Explicit consent for data collection
   - Separate consent for email/marketing
   - Documented consent records

2. Data Minimization
   - Collect only necessary data
   - Don't collect "just in case"
   - Audit quarterly for excess data

3. User Rights
   - Right to access (provide data export)
   - Right to delete (provide deletion option)
   - Right to portability (export in standard format)
   - Right to object (opt-out of processing)

4. Data Protection
   - Encryption at rest and in transit
   - Access controls (principle of least privilege)
   - Regular security audits
   - Breach notification (within 72 hours)

5. Data Retention
   - Define retention periods
   - Delete data after retention period
   - Document deletion
   - Exception: Legal holds for disputes

Implementation Checklist:
- [ ] Privacy policy clearly states data use
- [ ] Consent obtained before collection
- [ ] Data export feature available
- [ ] Account deletion feature available
- [ ] Encryption in place (TLS, AES-256)
- [ ] Access controls documented
- [ ] Breach notification plan documented
- [ ] Data processor agreements signed
- [ ] Regular security assessments conducted
```

## Conceptual Implementation Examples

### Example 1: Login Flow (Conceptual Pseudocode)

```
USER SUBMITS LOGIN FORM
    email = request.form.email
    password = request.form.password

    // Rate limiting
    if (rateLimit.exceeded(email, "login")) {
        return error("Too many attempts, try later")
    }

    // Lookup user
    user = database.findByEmail(email)
    if (user not found) {
        increment(rateLimit[email])
        return error("Invalid email or password")  // Generic
    }

    // Verify password (constant-time comparison)
    if (not verifyPassword(password, user.passwordHash)) {
        increment(rateLimit[email])
        increment(failedAttempts[user.id])

        if (failedAttempts[user.id] > 5) {
            sendAccountLockEmail(user.email)
            return error("Account temporarily locked")
        }

        return error("Invalid email or password")  // Generic
    }

    // Check if MFA enabled
    if (user.mfaEnabled) {
        // Generate MFA challenge
        mfaChallenge = generateMFAChallenge()
        cacheWithTTL(mfaChallenge, 5_minutes)
        return showMFAPrompt(mfaChallenge)
    }

    // Create session
    sessionToken = generateSessionToken({
        user_id: user.id,
        roles: user.roles,
        issued_at: now(),
        expires_at: now() + 1_hour
    })

    // Set secure cookie
    setSecureCookie("session_token", sessionToken, {
        secure: true,           // HTTPS only
        httpOnly: true,         // No JavaScript access
        sameSite: "strict"      // CSRF protection
    })

    // Log successful login
    auditLog.create({
        event: "login_success",
        user_id: user.id,
        ip_address: request.ip,
        timestamp: now()
    })

    // Clear failed attempt counter
    failedAttempts[user.id] = 0
    rateLimit[email] = 0

    // Redirect to dashboard
    return redirect("/dashboard")
```

### Example 2: Protected Content Access (Conceptual)

```
ROUTE: GET /lesson/advanced-simulation

// Middleware: Check authentication
function authMiddleware(request) {
    token = request.cookies.session_token
    if (not token) {
        return redirect("/login")
    }

    // Verify token signature
    if (not verifyTokenSignature(token, SECRET)) {
        clearSessionCookie()
        return redirect("/login")
    }

    // Check expiration
    if (token.expires_at < now()) {
        clearSessionCookie()
        return redirect("/login")
    }

    // Attach user to request
    request.user = decodeToken(token)
    return next()
}

// Middleware: Check authorization
function authorizationMiddleware(request) {
    lesson = database.findLesson("advanced-simulation")
    user = request.user

    switch (lesson.accessLevel) {
        case "PUBLIC":
            return next()  // Always allow

        case "AUTHENTICATED":
            if (user.authenticated) {
                return next()
            }
            return error(401, "Login required")

        case "PREMIUM":
            if (user.hasActiveSubscription("premium")) {
                return next()
            }
            return showUpgradePrompt()

        case "INSTRUCTOR":
            if ("instructor" in user.roles) {
                return next()
            }
            return error(403, "Instructor access required")

        default:
            return error(403, "Access denied")
    }
}

// Route handler
function getLessonPage(request) {
    lesson = database.findLesson(request.params.lessonId)

    // Log access
    auditLog.create({
        event: "content_access",
        user_id: request.user.id,
        resource: lesson.id,
        timestamp: now()
    })

    // Render lesson
    return render("lesson.html", {
        lesson: lesson,
        user: request.user,
        progress: getUserProgress(request.user.id, lesson.id)
    })
}
```

### Example 3: MFA Verification (Conceptual)

```
USER SUBMITS MFA CODE
    code = request.form.code
    mfaChallenge = request.session.mfaChallenge

    // Validate challenge exists
    if (not mfaChallenge) {
        return error("MFA challenge expired, please login again")
    }

    // Rate limit MFA attempts
    if (rateLimit.exceeded(user.id, "mfa_attempts")) {
        return error("Too many attempts, please try again later")
    }

    // Get user's MFA secret
    user = database.findUser(mfaChallenge.user_id)
    if (not user.mfaEnabled) {
        return error("MFA not enabled for this account")
    }

    // Verify TOTP code (time-based)
    // Accept current window ±1 period (±30 seconds)
    validCodes = [
        generateTOTP(user.mfaSecret, time - 30),
        generateTOTP(user.mfaSecret, time),
        generateTOTP(user.mfaSecret, time + 30)
    ]

    if (code not in validCodes) {
        increment(rateLimit[user.id + ":mfa"])
        return error("Invalid code, please try again")
    }

    // Check if code was recently used (prevent replay)
    if (recentlyUsedCodes.contains(code)) {
        return error("Code already used, please wait for new code")
    }

    // Mark code as used
    recentlyUsedCodes.add(code)

    // Create session (same as login flow)
    sessionToken = generateSessionToken({
        user_id: user.id,
        roles: user.roles,
        mfa_verified: true,
        issued_at: now(),
        expires_at: now() + 1_hour
    })

    // Set secure cookie
    setSecureCookie("session_token", sessionToken, {
        secure: true,
        httpOnly: true,
        sameSite: "strict"
    })

    // Log MFA verification
    auditLog.create({
        event: "mfa_success",
        user_id: user.id,
        timestamp: now()
    })

    // Clean up
    delete(request.session.mfaChallenge)
    rateLimit[user.id + ":mfa"] = 0

    return redirect("/dashboard")
```

## Tools & Services

### Authentication Services (Managed)
- **Auth0** — Complete auth platform with built-in security
- **Okta** — Enterprise identity management
- **Firebase Authentication** — Google's auth service
- **AWS Cognito** — Amazon's user management
- **Supabase Auth** — Open-source Firebase alternative
- **NextAuth.js** — Authentication for Next.js

### Session & Token Management
- **JWT.io** — JWT resources and debugging
- **jsonwebtoken (Node.js)** — JWT library
- **PyJWT (Python)** — JWT for Python
- **express-session** — Session middleware
- **Redis** — Session storage

### Password Hashing
- **bcrypt** — Industry-standard password hashing
- **Argon2** — Modern password hashing algorithm
- **scrypt** — Key derivation function
- **PBKDF2** — Older standard (avoid for new projects)

### MFA Implementation
- **Speakeasy (Node.js)** — TOTP/HOTP generation
- **pyotp (Python)** — TOTP for Python
- **Twilio** — SMS-based MFA
- **Authy** — Third-party MFA service

### Security Testing
- **OWASP Top 10** — Security best practices
- **Burp Suite** — Security testing tool
- **OWASP ZAP** — Automated security scanning
- **sqlmap** — SQL injection testing
- **Postman** — API security testing

### Monitoring & Logging
- **Sentry** — Error and event tracking
- **DataDog** — Monitoring and analytics
- **CloudFlare** — DDoS protection, WAF
- **Splunk** — Log analysis and monitoring
- **ELK Stack** — Elasticsearch, Logstash, Kibana

### Compliance & Auditing
- **Snyk** — Vulnerability scanning
- **SonarQube** — Code quality and security
- **Synopsys** — Application security
- **Imperva** — Web application firewall

## Security Best Practices Checklist

**Password Security:**
- [ ] Minimum 12–16 character entropy
- [ ] Hash before storage (bcrypt, Argon2)
- [ ] Never send plaintext via email
- [ ] Support password managers
- [ ] Password history (don't reuse last 5)
- [ ] Require update every 90 days (or event-driven)

**Session Management:**
- [ ] HTTP-only cookies (no JavaScript access)
- [ ] Secure flag (HTTPS only)
- [ ] SameSite flag (CSRF protection)
- [ ] Short expiration (1 hour typical)
- [ ] Refresh tokens for longer sessions
- [ ] Invalidate on logout

**Multi-Factor Authentication:**
- [ ] Support multiple MFA methods (TOTP, email, SMS)
- [ ] Recovery codes for account lockout
- [ ] Require MFA for admin/instructor accounts
- [ ] Optional MFA for students
- [ ] Don't allow MFA bypass

**API Security:**
- [ ] HTTPS/TLS required
- [ ] Rate limiting per user/IP
- [ ] API key rotation
- [ ] CORS properly configured
- [ ] No secrets in URLs
- [ ] Input validation and sanitization

**Data Protection:**
- [ ] Encryption at rest (AES-256)
- [ ] Encryption in transit (TLS 1.2+)
- [ ] Minimal data collection
- [ ] GDPR compliance
- [ ] Data retention policies
- [ ] Audit logging

**Monitoring & Response:**
- [ ] Failed login detection
- [ ] Unusual activity alerts
- [ ] Breach notification plan
- [ ] Incident response team
- [ ] Regular security audits
- [ ] Penetration testing

## Acceptance Criteria

- [ ] Authentication flows clearly documented
- [ ] Authorization rules specified for all content levels
- [ ] Security best practices applied throughout
- [ ] Rate limiting implemented for sensitive endpoints
- [ ] CSRF protection in place
- [ ] Session management secure (HTTP-only, expiration)
- [ ] MFA design documented
- [ ] Error messages generic (no enumeration)
- [ ] Audit logging comprehensive
- [ ] GDPR compliance verified
- [ ] No secrets in code or documentation
- [ ] Conceptual design (no implementation details)
- [ ] Security review completed
- [ ] Compliance requirements addressed

## Quality Checklist

**Design Quality:**
- [ ] All user roles clearly defined
- [ ] Access levels consistent across content
- [ ] Flows address all use cases
- [ ] Security assumptions documented
- [ ] Recovery mechanisms in place

**Security:**
- [ ] No password/credential storage shown
- [ ] Error messages prevent enumeration
- [ ] Rate limiting on all sensitive actions
- [ ] MFA support documented
- [ ] Audit logging comprehensive
- [ ] GDPR compliance considered

**Documentation:**
- [ ] Flows clear and unambiguous
- [ ] Security measures documented
- [ ] Tools/services listed for implementation
- [ ] Best practices included
- [ ] Compliance requirements addressed

**Implementation Readiness:**
- [ ] Ready for developer team
- [ ] Security assumptions clear
- [ ] External service dependencies listed
- [ ] Logging/monitoring specified
- [ ] No hardcoded values or secrets

---

Save it as `.claude/skills/auth-flow/skill.md`
