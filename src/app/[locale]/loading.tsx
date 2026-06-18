"use client";
import { Flex } from '@/once-ui/components';
import React from 'react';

export default function Loading() {
    return (
        <Flex fillWidth fillHeight justifyContent="center" alignItems="center" style={{ minHeight: '60vh' }}>
            <div className="reactor-loader">
                <div className="core"></div>
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
                <div className="ring ring-4"></div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .reactor-loader {
                    perspective: 1200px;
                    width: 160px;
                    height: 160px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transform-style: preserve-3d;
                }
                .core {
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    background: #fff;
                    border-radius: 50%;
                    box-shadow: 0 0 30px 10px rgba(255, 255, 255, 0.8), 0 0 60px 20px #8b5cf6, 0 0 100px 30px #ec4899;
                    animation: pulse-core 2s ease-in-out infinite alternate;
                }
                .ring {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 2px solid transparent;
                    transform-style: preserve-3d;
                }
                .ring-1 {
                    border-top: 2px solid #8b5cf6;
                    border-bottom: 2px solid #8b5cf6;
                    box-shadow: inset 0 0 20px rgba(139, 92, 246, 0.4), 0 0 20px rgba(139, 92, 246, 0.4);
                    animation: rotate-1 4s linear infinite;
                }
                .ring-2 {
                    width: 85%;
                    height: 85%;
                    border-left: 2px solid #ec4899;
                    border-right: 2px solid #ec4899;
                    box-shadow: inset 0 0 20px rgba(236, 72, 153, 0.4), 0 0 20px rgba(236, 72, 153, 0.4);
                    animation: rotate-2 5s linear infinite;
                }
                .ring-3 {
                    width: 70%;
                    height: 70%;
                    border-top: 2px solid #14b8a6;
                    border-bottom: 2px solid #14b8a6;
                    box-shadow: inset 0 0 15px rgba(20, 184, 166, 0.4), 0 0 15px rgba(20, 184, 166, 0.4);
                    animation: rotate-3 3s linear infinite;
                }
                .ring-4 {
                    width: 55%;
                    height: 55%;
                    border-left: 2px solid #3b82f6;
                    border-right: 2px solid #3b82f6;
                    box-shadow: inset 0 0 15px rgba(59, 130, 246, 0.4), 0 0 15px rgba(59, 130, 246, 0.4);
                    animation: rotate-4 2.5s linear infinite;
                }
                
                @keyframes pulse-core {
                    0% { transform: scale(0.9); box-shadow: 0 0 20px 5px rgba(255, 255, 255, 0.6), 0 0 40px 10px #8b5cf6, 0 0 60px 15px #ec4899; }
                    100% { transform: scale(1.1); box-shadow: 0 0 40px 15px rgba(255, 255, 255, 1), 0 0 80px 30px #8b5cf6, 0 0 120px 40px #ec4899; }
                }
                @keyframes rotate-1 {
                    0% { transform: rotateX(60deg) rotateY(0deg) rotateZ(0deg); }
                    100% { transform: rotateX(60deg) rotateY(360deg) rotateZ(360deg); }
                }
                @keyframes rotate-2 {
                    0% { transform: rotateX(-45deg) rotateY(60deg) rotateZ(0deg); }
                    100% { transform: rotateX(-45deg) rotateY(60deg) rotateZ(-360deg); }
                }
                @keyframes rotate-3 {
                    0% { transform: rotateX(45deg) rotateY(-45deg) rotateZ(0deg); }
                    100% { transform: rotateX(45deg) rotateY(-45deg) rotateZ(360deg); }
                }
                @keyframes rotate-4 {
                    0% { transform: rotateX(-60deg) rotateY(-60deg) rotateZ(0deg); }
                    100% { transform: rotateX(-60deg) rotateY(-60deg) rotateZ(-360deg); }
                }
                `
            }} />
        </Flex>
    );
}
