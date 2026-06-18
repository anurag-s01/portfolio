'use client';

import React, { useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import { SpacingToken } from '../types';
import styles from './RevealFx.module.scss';
import { Flex } from '.';

interface RevealFxProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	speed?: 'slow' | 'medium' | 'fast';
	delay?: number;
	revealedByDefault?: boolean;
	translateY?: number | SpacingToken;
	trigger?: boolean;
	style?: React.CSSProperties;
	className?: string;
}

const RevealFx = forwardRef<HTMLDivElement, RevealFxProps>(({
	children,
	speed = 'medium',
	delay = 0,
	revealedByDefault = false,
	translateY,
	trigger,
	style,
	className,
	...rest
}, forwardedRef) => {
	const [isRevealed, setIsRevealed] = useState(revealedByDefault);
	const localRef = useRef<HTMLDivElement | null>(null);

	const setRefs = useCallback(
		(node: HTMLDivElement) => {
			localRef.current = node;
			if (typeof forwardedRef === 'function') {
				forwardedRef(node);
			} else if (forwardedRef) {
				forwardedRef.current = node;
			}
		},
		[forwardedRef]
	);

	useEffect(() => {
		if (trigger !== undefined) {
			setIsRevealed(trigger);
			return;
		}

		if (revealedByDefault) return;

		const currentElement = localRef.current;
		if (!currentElement) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setTimeout(() => {
						setIsRevealed(true);
					}, delay * 1000);
					observer.unobserve(entry.target);
				}
			},
			{ rootMargin: '0px 0px -100px 0px', threshold: 0 }
		);

		observer.observe(currentElement);

		return () => {
			if (currentElement) {
				observer.unobserve(currentElement);
			}
		};
	}, [delay, trigger, revealedByDefault]);

	const getSpeedDuration = () => {
		switch (speed) {
			case 'fast':
				return '1s';
			case 'medium':
				return '2s';
			case 'slow':
				return '3s';
			default:
				return '2s';
		}
	};

	const getTranslateYValue = () => {
		if (typeof translateY === 'number') {
			return `${translateY}rem`;
		} else if (typeof translateY === 'string') {
			return `var(--static-space-${translateY})`;
		}
		return undefined;
	};

	const translateValue = getTranslateYValue();

	const combinedClassName = `${styles.revealFx} ${isRevealed ? styles.revealed : styles.hidden} ${className || ''}`;

	const revealStyle: React.CSSProperties = {
		transitionDuration: getSpeedDuration(),
		...style,
	};

	return (
		<Flex
			fillWidth
			justifyContent="center"
			ref={setRefs}
			aria-hidden="true"
			style={revealStyle}
			className={combinedClassName}
			{...rest}>
			{children}
		</Flex>
	);
});

RevealFx.displayName = 'RevealFx';
export { RevealFx };