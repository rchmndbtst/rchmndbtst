#!/usr/bin/env python3
"""
Simple static file server for local testing of the UI.

Usage:
    python3 script.py [--port PORT]
    python3 script.py --port 8000

This lightweight server binds to `localhost` by default to avoid exposing the
dev server on external interfaces.
"""
from __future__ import annotations

import argparse
import socketserver
import http.server
import sys

def main() -> int:
    parser = argparse.ArgumentParser(description='Serve the UI directory for local testing')
    parser.add_argument('--port', '-p', type=int, default=8000, help='Port to listen on')
    args = parser.parse_args()

    # Bind only to localhost to keep the server local to the machine.
    try:
        handler = http.server.SimpleHTTPRequestHandler
        with socketserver.TCPServer(('localhost', args.port), handler) as httpd:
            print(f"Serving HTTP on localhost port {args.port} (http://localhost:{args.port}/) ...")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nServer stopped by user')
        return 0
    except Exception as e:
        print('Server error:', e, file=sys.stderr)
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
