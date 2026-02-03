# API Key Rotation Schedule

**Purpose**: Maintain security by regularly rotating API keys and credentials used by the RAG Textbook Chatbot.

**Policy**: All API keys must be rotated **quarterly** (every 3 months) or immediately upon suspected compromise.

---

## API Keys & Credentials Inventory

| Service | Key Name | Environment Variable | Rotation Frequency | Last Rotated | Next Rotation |
|---------|----------|---------------------|-------------------|--------------|---------------|
| Gemini AI | Gemini API Key | `GEMINI_API_KEY` | Quarterly | - | - |
| Qdrant Cloud | Qdrant API Key | `QDRANT_API_KEY` | Quarterly | - | - |
| Qdrant Cloud | Qdrant URL | `QDRANT_URL` | N/A (immutable) | - | - |
| Neon Postgres | Database URL | `NEON_DATABASE_URL` | Quarterly | - | - |
| Upstash Redis | Redis URL | `UPSTASH_REDIS_URL` | Quarterly | - | - |
| Upstash Redis | Redis Token | `UPSTASH_REDIS_TOKEN` | Quarterly | - | - |
| Sentry | Sentry DSN | `SENTRY_DSN` | Quarterly | - | - |
| GitHub OAuth | Client ID | `GITHUB_CLIENT_ID` | Annually | - | - |
| GitHub OAuth | Client Secret | `GITHUB_CLIENT_SECRET` | Annually | - | - |
| Google OAuth | Client ID | `GOOGLE_CLIENT_ID` | Annually | - | - |
| Google OAuth | Client Secret | `GOOGLE_CLIENT_SECRET` | Annually | - | - |
| Session Encryption | Secret Key | `SESSION_SECRET_KEY` | Semi-annually | - | - |

---

## Rotation Process

### Preparation (1-2 days before rotation)

1. **Notify stakeholders**: Alert the team of the upcoming rotation
2. **Verify backup access**: Ensure backup admin access to all services
3. **Test rollback procedure**: Verify ability to revert to old keys if needed
4. **Schedule maintenance window**: Plan for brief downtime if needed

### Execution (Day of rotation)

#### 1. Gemini API Key

```bash
# Generate new key at: https://aistudio.google.com/app/apikey
# Update environment variable
export GEMINI_API_KEY="new-key-here"

# Test API connectivity
python backend/scripts/validate-infra.py --test-gemini

# Update production (Vercel/AWS)
vercel env add GEMINI_API_KEY production
# OR
aws ssm put-parameter --name /chatbot/gemini-api-key --value "new-key" --overwrite

# Verify deployment
curl -X POST https://your-api.com/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test","mode":"book-only","book_id":"intro-ai"}'

# Revoke old key after 24-hour grace period
```

#### 2. Qdrant Cloud API Key

```bash
# Generate new key at: https://cloud.qdrant.io/
# Navigate to cluster → Settings → API Keys → Create new key

# Update environment variable
export QDRANT_API_KEY="new-key-here"

# Test connectivity
python backend/scripts/validate-infra.py --test-qdrant

# Update production
vercel env add QDRANT_API_KEY production

# Verify vector search
python -c "from backend.src.db.qdrant import get_qdrant; print(get_qdrant().ping())"

# Delete old key in Qdrant dashboard
```

#### 3. Neon Postgres Database URL

```bash
# Option A: Generate new password
# Go to: https://console.neon.tech/ → Database → Settings → Reset Password

# Option B: Create new connection string with role
neonctl connection-string --role-name chatbot_user --database chatbot_db

# Update environment variable
export NEON_DATABASE_URL="new-connection-string"

# Test connectivity
python backend/scripts/validate-infra.py --test-postgres

# Update production
vercel env add NEON_DATABASE_URL production

# Verify database connection
python -c "from backend.src.db.postgres import get_postgres; get_postgres().ping()"

# Revoke old password/role after 24 hours
```

#### 4. Upstash Redis Credentials

```bash
# Generate new credentials at: https://console.upstash.com/
# Navigate to Redis → Database → REST API → Regenerate Token

# Update environment variables
export UPSTASH_REDIS_URL="new-url"
export UPSTASH_REDIS_TOKEN="new-token"

# Test connectivity
python backend/scripts/validate-infra.py --test-upstash

# Update production
vercel env add UPSTASH_REDIS_URL production
vercel env add UPSTASH_REDIS_TOKEN production

# Verify rate limiting
curl -X POST https://your-api.com/api/v1/chat \
  -H "Content-Type: application/json" \
  # (test multiple requests to trigger rate limit)

# Old credentials automatically invalidated after regeneration
```

#### 5. Sentry DSN

```bash
# Generate new DSN at: https://sentry.io/ → Settings → Client Keys (DSN)

# Update environment variable
export SENTRY_DSN="new-dsn-here"

# Test error reporting
python -c "import sentry_sdk; sentry_sdk.init('$SENTRY_DSN'); sentry_sdk.capture_message('Test rotation')"

# Update production
vercel env add SENTRY_DSN production

# Verify error tracking in Sentry dashboard

# Disable old DSN in Sentry settings
```

#### 6. OAuth Credentials (Annual rotation)

**GitHub OAuth:**

```bash
# Regenerate at: https://github.com/settings/developers
# Update App → Generate new client secret

export GITHUB_CLIENT_SECRET="new-secret"

# Test OAuth flow
# Visit: https://your-app.com/api/auth/github/login

# Update production
vercel env add GITHUB_CLIENT_SECRET production

# Revoke old secret in GitHub settings
```

**Google OAuth:**

```bash
# Regenerate at: https://console.cloud.google.com/apis/credentials
# Select OAuth 2.0 Client ID → Add secret

export GOOGLE_CLIENT_SECRET="new-secret"

# Test OAuth flow
# Visit: https://your-app.com/api/auth/google/login

# Update production
vercel env add GOOGLE_CLIENT_SECRET production

# Delete old secret in Google Cloud Console
```

#### 7. Session Secret Key (Semi-annual rotation)

```bash
# Generate new cryptographically secure key
export SESSION_SECRET_KEY=$(openssl rand -base64 32)

# IMPORTANT: This will invalidate all existing sessions
# Schedule rotation during low-traffic period

# Update production
vercel env add SESSION_SECRET_KEY production

# Notify users of session invalidation (logged out)
```

---

## Post-Rotation Verification

### Automated Tests (Run after each rotation)

```bash
# Full infrastructure validation
python backend/scripts/validate-infra.py --all

# Integration tests
pytest backend/tests/integration/ -v

# E2E tests
npm run test:e2e --prefix frontend

# Load test (verify performance unchanged)
locust -f backend/tests/load/locust_test.py --headless -u 100 -r 10 -t 1m
```

### Manual Verification Checklist

- [ ] Authentication flow works (GitHub + Google OAuth)
- [ ] Chat endpoint responds correctly
- [ ] Vector search returns relevant results
- [ ] Rate limiting enforces correctly
- [ ] Error tracking appears in Sentry
- [ ] Database queries execute successfully
- [ ] Session management works correctly
- [ ] No 500 errors in logs

### Rollback Procedure (If issues detected)

```bash
# Immediately revert to old keys
vercel env pull .env.production.old
vercel env add <KEY_NAME> production < .env.production.old

# Verify service restoration
curl https://your-api.com/health

# Investigate issue before next attempt
```

---

## Automation Recommendations

### Future Improvements

1. **Secret Manager Integration**
   - Use AWS Secrets Manager or HashiCorp Vault
   - Enable automatic rotation policies
   - Centralize secret storage

2. **Automated Rotation Scripts**
   - Create rotation script: `scripts/rotate-api-keys.sh`
   - Integrate with cron or GitHub Actions
   - Send notifications on completion/failure

3. **Key Expiration Monitoring**
   - Alert 7 days before rotation due date
   - Track rotation history in database
   - Generate compliance reports

4. **Zero-Downtime Rotation**
   - Support dual-key validation periods
   - Gradual rollover with canary deployments
   - Automated health checks

---

## Security Incident Response

### If Key Compromise Suspected

**IMMEDIATE ACTIONS** (within 1 hour):

1. **Revoke compromised key** in service provider dashboard
2. **Generate new key** and update all environments
3. **Force redeploy** to production immediately
4. **Audit access logs** for unauthorized usage
5. **Notify security team** and stakeholders
6. **Document incident** for post-mortem

**FOLLOW-UP** (within 24 hours):

1. Review all API usage logs for anomalies
2. Check for data exfiltration or unauthorized access
3. Rotate all related credentials (defense in depth)
4. Update incident response plan with lessons learned
5. Implement additional monitoring if needed

---

## Compliance & Audit

### Rotation Record Template

```markdown
## Rotation: [Date]

**Rotated Keys**:
- [ ] Gemini API Key
- [ ] Qdrant API Key
- [ ] Neon Database URL
- [ ] Upstash Redis Credentials
- [ ] Sentry DSN

**Performed By**: [Name]
**Verification Status**: ✅ Passed / ❌ Failed
**Issues Encountered**: [None / Description]
**Rollback Required**: [Yes / No]
**Downtime**: [0 minutes / X minutes]

**Next Rotation Due**: [Date + 3 months]
```

### Audit Trail

All rotations must be logged in:
- `docs/security/rotation-history.md`
- Sentry breadcrumbs (for tracking)
- Team Slack channel: `#security-ops`

---

## Contact & Escalation

**Rotation Owner**: DevOps Team
**Security Lead**: [Name]
**Escalation**: security@yourcompany.com
**On-Call**: PagerDuty → Infrastructure Team

---

**Last Updated**: 2026-02-03
**Next Review**: 2026-05-03 (Quarterly)
