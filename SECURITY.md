# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of RoastMe AI seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **Email**: Open an issue with the title "SECURITY" and we'll provide contact details
2. **GitHub Security Advisory**: Use GitHub's private vulnerability reporting feature

### What to Include

Please include the following information in your report:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

- **Acknowledgment**: Within 48 hours of your report
- **Updates**: Regular updates on the progress of fixing the vulnerability
- **Disclosure**: We aim to fully disclose vulnerabilities within 90 days of the initial report
- **Credit**: Public credit for the discovery (if desired)

## Security Best Practices

When using RoastMe AI:

### For Developers

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Keep Tambo API keys secure and rotate them regularly
3. **Dependencies**: Regularly update dependencies to patch vulnerabilities
4. **CORS**: Configure appropriate CORS settings for production
5. **Authentication**: Implement proper authentication for production deployments

### For Users

1. **HTTPS**: Always use HTTPS in production
2. **Updates**: Keep your deployment up to date
3. **Monitoring**: Monitor application logs for suspicious activity
4. **Secrets**: Use secure secret management systems in production

## Known Security Considerations

### Current Implementation

- The application uses client-side API keys for Tambo SDK
- WebSocket connections are not authenticated by default
- No rate limiting is implemented by default

### Recommendations for Production

1. **Implement server-side API key management**
2. **Add authentication to WebSocket connections**
3. **Implement rate limiting on all endpoints**
4. **Use environment-specific security configurations**
5. **Enable HTTPS/WSS for all connections**
6. **Implement input validation and sanitization**
7. **Add CSRF protection**
8. **Configure security headers (helmet.js)**

## Dependency Security

We use `npm audit` to check for known vulnerabilities. To check your installation:

```bash
# Backend
cd backend && npm audit

# Frontend
cd frontend && npm audit
```

## Security Updates

Security updates will be released as soon as possible after a vulnerability is discovered and patched. Updates will be announced via:

- GitHub Security Advisories
- Release notes in CHANGELOG.md
- GitHub Releases

## Questions?

If you have questions about this security policy, please open an issue with the label `security`.

---

*This security policy is effective as of February 6, 2026 and will be updated as needed.*
