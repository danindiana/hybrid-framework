# Security Fix: doc-search-web Debug Mode

**Date:** January 27, 2026
**Target Machine:** smduck (192.168.1.138)
**Service:** doc-search-web (Flask Application)
**Port:** 8090

## Incident Description
The Flask application `doc-search-web` was found running with `debug=True` while binding to `0.0.0.0` (all network interfaces). 

### Risk Assessment
*   **Severity:** High
*   **Vulnerability:** Remote Code Execution (RCE) via Werkzeug Debugger, Information Disclosure (Stack Traces).
*   **Exposure:** The application was accessible to the entire local network (and potentially wider if port forwarding was in place).

## Remediation
The application configuration was modified to disable debug mode.

**File:** `/home/smduck/programs/doc-search-web/app.py`

**Change:**
```python
# Before
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8090, debug=True)

# After
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8090, debug=False)
```

## Verification
1.  The file was modified using `sed`.
2.  The systemd service `doc-search-web.service` was restarted.
3.  The service is now running in production mode.

## Recommendations
*   Ensure all new deployments of this application have `debug=False` by default.
*   Consider using a production-grade WSGI server (like Gunicorn or uWSGI) instead of the built-in Flask development server for permanent deployments.
