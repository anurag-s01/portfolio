"use client";
import { Flex } from '@/once-ui/components';
import React from 'react';

export default function Loading() {
    return (
        <Flex fillWidth fillHeight justifyContent="center" alignItems="center" style={{ minHeight: '60vh' }}>
            <div className="loader-container">
                <div className="glow-ring"></div>
                <div className="glow-ring"></div>
                <div className="glow-ring"></div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .loader-container {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .glow-ring {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 2px solid transparent;
                    border-top: 2px solid #8b5cf6; /* purple glow */
                    border-right: 2px solid #3b82f6; /* blue glow */
                    filter: drop-shadow(0 0 12px rgba(139, 92, 246, 0.6));
                    animation: spin 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
                }
                .glow-ring:nth-child(2) {
                    width: 75%;
                    height: 75%;
                    border-top: 2px solid #ec4899; /* pink */
                    border-right: 2px solid transparent;
                    filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.6));
                    animation: spin-reverse 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
                }
                .glow-ring:nth-child(3) {
                    width: 50%;
                    height: 50%;
                    border-top: 2px solid transparent;
                    border-right: 2px solid #14b8a6; /* teal */
                    filter: drop-shadow(0 0 8px rgba(20, 184, 166, 0.6));
                    animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes spin-reverse {
                    0% { transform: rotate(360deg); }
                    100% { transform: rotate(0deg); }
                }
                `
            }} />
        </Flex>
    );
}
