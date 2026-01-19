"use client";

import React from 'react';
import { Flex, Text, Icon } from '@/once-ui/components';

interface TerminalProps {
    title?: string;
    children: React.ReactNode;
}

export const Terminal: React.FC<TerminalProps> = ({ title = "Terminal", children }) => {
    return (
        <Flex
            direction="column"
            fillWidth
            style={{
                backgroundColor: '#1e1e1e',
                borderRadius: 'var(--radius-m)',
                overflow: 'hidden',
                border: '1px solid var(--neutral-border-medium)',
                margin: 'var(--static-space-24) 0'
            }}>
            <Flex
                fillWidth
                paddingX="16"
                paddingY="8"
                alignItems="center"
                style={{
                    backgroundColor: '#2d2d2d',
                    borderBottom: '1px solid #333'
                }}>
                <Flex gap="8">
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#27c93f' }} />
                </Flex>
                <Text
                    variant="body-default-s"
                    onBackground="neutral-medium"
                    style={{ marginLeft: '16px', fontFamily: 'monospace' }}>
                    {title}
                </Text>
            </Flex>
            <Flex
                padding="16"
                direction="column"
                style={{
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    color: '#d4d4d4'
                }}>
                {children}
            </Flex>
        </Flex>
    );
};
