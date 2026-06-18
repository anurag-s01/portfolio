"use client";

import { useEffect } from 'react';
import { Flex, Heading, Text, Button } from "@/once-ui/components";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to the front-end console for debugging
        console.error("Application Error Caught by Boundary:", error);
    }, [error]);

    return (
        <Flex
            as="section"
            direction="column" alignItems="center" justifyContent="center"
            style={{ minHeight: '60vh', position: 'relative' }}>
            <div className="error-icon">
                <div className="pulse-ring"></div>
                <div className="pulse-ring-2"></div>
                <span>⚠</span>
            </div>
            <Heading marginBottom="l" variant="display-strong-xs">
                Internal System Error
            </Heading>
            <Text onBackground="neutral-weak" marginBottom="xl" style={{ textAlign: 'center', maxWidth: '400px' }}>
                We encountered an unexpected anomaly while processing your request. The issue has been logged for our engineering team.
            </Text>
            <Button onClick={() => reset()} variant="primary" size="m">
                Reboot System
            </Button>
            <style dangerouslySetInnerHTML={{
                __html: `
                .error-icon {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 3rem;
                    color: #ef4444;
                    margin-bottom: 2rem;
                }
                .pulse-ring, .pulse-ring-2 {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 2px solid #ef4444;
                    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                .pulse-ring-2 {
                    animation-delay: 1s;
                }
                @keyframes ping {
                    75%, 100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
                `
            }} />
        </Flex>
    );
}
