# CI/CD Setup Guide - Vertex Multi-Tenant Deployments

This guide explains how to configure and use the GitHub Actions CI/CD pipeline for deploying Vertex and Vertex+ applications.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [GitHub Configuration](#github-configuration)
- [AWS Configuration](#aws-configuration)
- [Deployment Workflows](#deployment-workflows)
- [Manual Deployments](#manual-deployments)
- [Troubleshooting](#troubleshooting)

---

## Overview

The CI/CD pipeline supports deploying **6 different configurations** from a single codebase:

| Tenant | Environment | Build Config | Deployment Target |
|--------|-------------|--------------|-------------------|
| Vertex | Development | devel-vertex | `vertex-devel.asf.alaska.edu` |
| Vertex | Test | test-vertex | `vertex-test.asf.alaska.edu` |
| Vertex | Production | prod-vertex | `search.asf.alaska.edu` |
| Vertex+ | Development | devel-vertex-plus | `vertex-plus-devel.asf.alaska.edu` |
| Vertex+ | Test | test-vertex-plus | `vertex-plus-test.asf.alaska.edu` |
| Vertex+ | Production | prod-vertex-plus | `vertex-plus.asf.alaska.edu` |

### Key Features
- ✅ **Matrix builds** - Deploy multiple tenants in parallel
- ✅ **Branch-based deployment** - Automatic deployment based on branch name
- ✅ **Manual deployment** - Deploy specific tenant/environment via UI
- ✅ **AWS OIDC** - Secure credential-less deployments
- ✅ **CloudFront invalidation** - Automatic cache clearing
- ✅ **Build verification** - Automated checks before deployment

---

## Architecture

### Deployment Flow

```
┌─────────────────┐
│  Git Push       │
│  to Branch      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  GitHub Actions Workflow    │
│  (deploy-vertex-*.yml)      │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Composite Action           │
│  (vertex-deploy-composite)  │
│  • Validate inputs          │
│  • Install dependencies     │
│  • Build with ng CLI        │
│  • Verify output            │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  AWS Deployment             │
│  • Sync to S3               │
│  • Invalidate CloudFront    │
└─────────────────────────────┘
```

### Workflow Files

1. **`deploy-vertex-multitenant.yml`** - Master workflow with matrix strategy
2. **`deploy-vertex-test.yml`** - Dedicated Vertex test deployment
3. **`deploy-vertex-plus-test.yml`** - Dedicated Vertex+ test deployment
4. **`vertex-deploy-composite/action.yml`** - Reusable deployment action

---

## GitHub Configuration

### 1. Environments

Create GitHub Environments for each tenant/environment combination:

**Repository Settings → Environments → New Environment**

Create these 6 environments:
- `devel-vertex`
- `test-vertex`
- `prod-vertex`
- `devel-vertex-plus`
- `test-vertex-plus`
- `prod-vertex-plus`

#### Environment Protection Rules (Recommended)

**For Production Environments:**
- ✅ Required reviewers (1-2 people)
- ✅ Deployment branch: `main` only
- ✅ Wait timer: 5 minutes

**For Test Environments:**
- ✅ Deployment branch: `test` or `main`
- ❌ No reviewers required

**For Development Environments:**
- ❌ No restrictions

### 2. Environment Variables

For **each environment**, configure these variables:

| Variable Name | Example Value | Description |
|---------------|---------------|-------------|
| `CDN_ID` | `E1234567890ABC` | CloudFront distribution ID |
| `S3_BUCKET` | `vertex-test-bucket` | S3 bucket name |
| `DEPLOYMENT_URL` | `https://vertex-test.asf.alaska.edu` | Public URL (optional) |

**How to add:**
1. Go to Environment settings
2. Click "Add variable"
3. Enter name and value
4. Save

#### Variable Naming Convention

**Option 1: Separate variables per environment**
```
CDN_ID_VERTEX_TEST
S3_BUCKET_VERTEX_TEST
CDN_ID_VERTEX_PLUS_TEST
S3_BUCKET_VERTEX_PLUS_TEST
```

**Option 2: Environment-scoped variables (Recommended)**
- Each environment has its own `CDN_ID` and `S3_BUCKET`
- Simpler to manage
- Used in our workflows

### 3. Repository Secrets

Add these **organization/repository-level secrets**:

**Repository Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `AWS_ACCOUNT_ID` | AWS account ID (12 digits) | AWS Console → Account ID |

---

## AWS Configuration

### 1. S3 Buckets

Create S3 buckets for each deployment:

```bash
# Vertex buckets
vertex-devel
vertex-test
vertex-prod

# Vertex+ buckets
vertex-plus-devel
vertex-plus-test
vertex-plus-prod
```

**Bucket Configuration:**
- ✅ Static website hosting enabled
- ✅ Block public access: OFF (for CloudFront)
- ✅ Bucket policy allows CloudFront OAI
- ✅ Versioning: Optional (recommended for prod)

### 2. CloudFront Distributions

Create CloudFront distributions for each S3 bucket:

**Key Settings:**
- Origin: S3 bucket
- Origin Access: Origin Access Identity (OAI)
- Default root object: `index.html`
- Error pages: 404 → `/index.html` (for Angular routing)
- Custom domain: e.g., `search.asf.alaska.edu`
- SSL certificate: ACM certificate for domain

**Note the Distribution ID** - needed for GitHub variables

### 3. IAM Roles for GitHub Actions (OIDC)

Create IAM roles for each deployment target:

#### Role Naming Convention
```
GitHub_Actions_Role_Vertex_vertex_devel
GitHub_Actions_Role_Vertex_vertex_test
GitHub_Actions_Role_Vertex_vertex_prod
GitHub_Actions_Role_Vertex_vertex-plus_devel
GitHub_Actions_Role_Vertex_vertex-plus_test
GitHub_Actions_Role_Vertex_vertex-plus_prod
```

#### Trust Policy (OIDC)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:asfadmin/Discovery-SearchUI:*"
        }
      }
    }
  ]
}
```

#### Permissions Policy

Attach a policy with these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::BUCKET_NAME",
        "arn:aws:s3:::BUCKET_NAME/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
    }
  ]
}
```

### 4. OIDC Provider Setup

If not already configured, create the GitHub OIDC provider:

**AWS IAM → Identity providers → Add provider**

- Provider type: `OpenID Connect`
- Provider URL: `https://token.actions.githubusercontent.com`
- Audience: `sts.amazonaws.com`

---

## Deployment Workflows

### Automatic Deployments

Deployments trigger automatically based on branch:

| Branch | Deploys | Target |
|--------|---------|--------|
| `main` | Both tenants | Production |
| `test` | Both tenants | Test |
| `vertex/*` | Vertex only | Development |
| `vertex-plus/*` | Vertex+ only | Development |

**Example:**
```bash
git checkout -b vertex/my-feature
git push origin vertex/my-feature
# → Deploys Vertex to development
```

### Matrix Deployment

The `deploy-vertex-multitenant.yml` workflow deploys multiple tenants in parallel:

```yaml
strategy:
  matrix:
    include:
      - tenant: vertex
        env: test
      - tenant: vertex-plus
        env: test
```

Both deployments run simultaneously, failing independently.

### Individual Tenant Workflows

Use dedicated workflows for single-tenant deployments:

- `deploy-vertex-test.yml` - Vertex test only
- `deploy-vertex-plus-test.yml` - Vertex+ test only

These are useful for:
- Faster CI/CD (one tenant at a time)
- Testing specific tenant changes
- Hotfixes to one tenant

---

## Manual Deployments

### Via GitHub UI

**Repository → Actions → Deploy Vertex Multi-Tenant → Run workflow**

Options:
1. **Tenant:**
   - `both` (default) - Deploy both Vertex and Vertex+
   - `vertex` - Deploy Vertex only
   - `vertex-plus` - Deploy Vertex+ only

2. **Environment:**
   - `devel`
   - `test` (default)
   - `prod`

3. **Branch:** Select branch to deploy from

**Example:** Deploy only Vertex+ to test:
- Tenant: `vertex-plus`
- Environment: `test`
- Branch: `main`

### Via GitHub CLI

```bash
# Deploy both tenants to test
gh workflow run deploy-vertex-multitenant.yml \
  -f tenant=both \
  -f environment=test

# Deploy Vertex to production
gh workflow run deploy-vertex-multitenant.yml \
  -f tenant=vertex \
  -f environment=prod

# Deploy Vertex+ to development
gh workflow run deploy-vertex-multitenant.yml \
  -f tenant=vertex-plus \
  -f environment=devel
```

---

## Build Process

The deployment uses Angular CLI build configurations:

```bash
# What the CI/CD runs
npm run build:test:vertex        # For Vertex test
npm run build:prod:vertex-plus   # For Vertex+ prod
```

**Build outputs:**
- Directory: `dist/search-ui/browser`
- Includes: All compiled JS, CSS, assets
- Optimization: Enabled for prod, disabled for devel/test

**File replacements:**
- `src/app/services/env.ts` → tenant-specific env file
- Feature flags and branding set per tenant

---

## Deployment Process

### 1. S3 Sync

Files are uploaded to S3 with appropriate cache headers:

**Long cache (1 year):**
- All JS bundles
- CSS files
- Images/assets

**No cache:**
- `index.html`
- `manifest.json`
- `ngsw.json` (service worker)

```bash
# Long cache
aws s3 sync . s3://bucket \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"

# No cache
aws s3 cp index.html s3://bucket/index.html \
  --cache-control "no-cache, no-store, must-revalidate"
```

### 2. CloudFront Invalidation

After S3 upload, CloudFront cache is invalidated:

```bash
aws cloudfront create-invalidation \
  --distribution-id XXXXXX \
  --paths \
    /index.html \
    /assets/* \
    "/*"
```

**Invalidation completes in 1-5 minutes.**

---

## Monitoring Deployments

### GitHub Actions UI

**Repository → Actions**

- View running deployments
- See build logs
- Check deployment status
- Download artifacts (if configured)

### Logs

Each step produces detailed logs:
- ✅ Build success/failure
- 📦 Bundle size
- ☁️ S3 sync progress
- 🔄 CloudFront invalidation ID

### Notifications

Add notifications (optional):
- Slack webhook
- Email on failure
- GitHub deployments API

---

## Troubleshooting

### Build Failures

**Error: "Cannot find module '@models'"**
- Cause: TypeScript path mapping issue
- Fix: Ensure `tsconfig.json` paths are correct
- Check: `npm install` completed successfully

**Error: "Schema validation failed"**
- Cause: Invalid angular.json configuration
- Fix: Verify build configuration exists
- Check: `ng build --configuration=test-vertex` works locally

### Deployment Failures

**Error: "Access Denied" to S3**
- Cause: IAM role permissions
- Fix: Check role has `s3:PutObject` permission
- Verify: Bucket name matches environment variable

**Error: "InvalidClientTokenId"**
- Cause: AWS credentials issue
- Fix: Verify OIDC trust policy
- Check: `AWS_ACCOUNT_ID` secret is correct

**Error: "An error occurred (AccessDenied) when calling CreateInvalidation"**
- Cause: Missing CloudFront permissions
- Fix: Add `cloudfront:CreateInvalidation` to role
- Verify: Distribution ID is correct

### Cache Issues

**Old version still showing:**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Check CloudFront invalidation completed
- Verify `index.html` has no-cache header

**Assets not loading:**
- Check S3 bucket policy allows CloudFront
- Verify CloudFront distribution is "Deployed"
- Check browser console for 403/404 errors

---

## Best Practices

### 1. Test Before Production

Always deploy to test environment first:
```bash
git push origin test          # Deploy to test
# Verify functionality
git push origin main          # Deploy to production
```

### 2. Use Protected Branches

Configure branch protection:
- `main` → Require PR reviews
- `test` → Require status checks
- No direct pushes to protected branches

### 3. Monitor Deployments

- Watch deployment logs
- Check application after deploy
- Test critical functionality
- Monitor error rates

### 4. Rollback Strategy

**If deployment fails:**
1. Revert commit: `git revert HEAD`
2. Push revert: `git push origin main`
3. Automatic deployment triggers
4. Or manually deploy previous commit

**CloudFront rollback:**
1. Get previous build artifacts
2. Manual S3 upload
3. Invalidate CloudFront

### 5. Environment Parity

Keep environments similar:
- Same Node.js version
- Same dependencies
- Same build process
- Test in lower environments first

---

## Configuration Checklist

Before first deployment, verify:

### GitHub
- [ ] 6 environments created
- [ ] Environment variables set (CDN_ID, S3_BUCKET)
- [ ] Repository secrets configured (AWS_ACCOUNT_ID)
- [ ] Workflows enabled

### AWS
- [ ] 6 S3 buckets created
- [ ] Static website hosting enabled
- [ ] 6 CloudFront distributions created
- [ ] Custom domains configured (if applicable)
- [ ] SSL certificates issued
- [ ] 6 IAM roles created with OIDC trust
- [ ] IAM permissions policies attached
- [ ] OIDC provider configured

### Testing
- [ ] Test build locally: `npm run build:test:vertex`
- [ ] Test build locally: `npm run build:test:vertex-plus`
- [ ] Manual workflow run successful
- [ ] Automatic deployment successful
- [ ] Application loads correctly
- [ ] CloudFront invalidation works

---

## Example Deployment Scenarios

### Scenario 1: Feature Branch for Vertex

```bash
git checkout -b vertex/new-feature
# Make changes
git commit -am "Add new feature"
git push origin vertex/new-feature
```
**Result:** Deploys Vertex to development environment

### Scenario 2: Test Both Tenants

```bash
git checkout test
git merge main
git push origin test
```
**Result:** Deploys both Vertex and Vertex+ to test environment

### Scenario 3: Production Release

```bash
# After testing in test environment
git checkout main
git merge test
git push origin main
```
**Result:** Deploys both Vertex and Vertex+ to production

### Scenario 4: Hotfix for Vertex+ Only

```bash
# Manual deployment via GitHub UI
# Tenant: vertex-plus
# Environment: prod
# Branch: hotfix/urgent-fix
```
**Result:** Deploys only Vertex+ to production

---

## Support & Resources

- **Workflow files:** `.github/workflows/`
- **Composite action:** `.github/workflows/vertex-deploy-composite/`
- **Build configs:** `angular.json`
- **Feature flags:** `FEATURE_FLAGS_GUIDE.md`
- **Multi-tenant guide:** `vertex-multi-brand-project-brief.md`

---

**Last Updated:** 2025-10-27
**CI/CD Pipeline Version:** 1.0
**Status:** Ready for deployment
