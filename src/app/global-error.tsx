"use client";

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
    useEffect(() => {
        console.error("Global Application Error Caught:", error);
    }, [error]);

  return (
    <html lang="en">
      <head>
        <title>500 - Internal Server Error</title>
        <style dangerouslySetInnerHTML={{
            __html: `
            body {
                margin: 0;
                padding: 0;
                background-color: #0a0a0a;
                color: #e5e5e5;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                overflow: hidden;
            }
            .container {
                text-align: center;
                position: relative;
                z-index: 10;
                padding: 4rem 3rem;
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 24px;
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                max-width: 500px;
                width: 90%;
            }
            .error-code {
                font-size: 6rem;
                font-weight: 900;
                margin: 0;
                background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                line-height: 1;
            }
            .message {
                font-size: 1.1rem;
                margin-top: 1rem;
                color: #a3a3a3;
                line-height: 1.6;
            }
            .button {
                margin-top: 2.5rem;
                padding: 0.875rem 2.5rem;
                font-size: 1rem;
                font-weight: 600;
                color: #fff;
                background: rgba(239, 68, 68, 0.15);
                border: 1px solid rgba(239, 68, 68, 0.4);
                border-radius: 9999px;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .button:hover {
                background: rgba(239, 68, 68, 0.3);
                transform: translateY(-2px);
                box-shadow: 0 10px 20px -10px rgba(239, 68, 68, 0.5);
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: .8; transform: scale(0.98); }
            }
            .bg-glow {
                position: absolute;
                width: 800px;
                height: 800px;
                background: radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, rgba(0,0,0,0) 70%);
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 0;
                pointer-events: none;
            }
            `
        }} />
      </head>
      <body>
        <div className="bg-glow"></div>
        <div className="container">
            <h1 className="error-code">500</h1>
            <h2 style={{ fontSize: '1.75rem', marginTop: '1rem', marginBottom: '1rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Internal Server Error</h2>
            <p className="message">
                Our servers encountered an unexpected anomaly. The engineering team has been notified and is actively investigating the situation.
            </p>
            <button className="button" onClick={() => reset()}>
                Attempt Recovery
            </button>
        </div>
      </body>
    </html>
  )
}
