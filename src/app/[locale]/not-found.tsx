import { Flex, Heading, Text, Button } from "@/once-ui/components";

export default function NotFound() {
    return (
        <Flex
            as="section"
            direction="column" alignItems="center" justifyContent="center"
            style={{ minHeight: '60vh', position: 'relative' }}>
            <div className="glitch-wrapper">
                <div className="glitch" data-text="404">404</div>
            </div>
            <Heading marginBottom="l" variant="display-strong-xs">
                System Offline: Page Not Found
            </Heading>
            <Text onBackground="neutral-weak" marginBottom="xl">
                The neural pathway you requested has been severed or does not exist.
            </Text>
            <Button href="/" variant="primary" size="m">
                Return to Base
            </Button>
            <style dangerouslySetInnerHTML={{
                __html: `
                .glitch-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                .glitch {
                    font-size: 8rem;
                    font-weight: 800;
                    position: relative;
                    color: var(--brand-solid-strong);
                    text-shadow: 0 0 20px rgba(var(--brand-solid-strong), 0.5);
                    animation: glitch 1s linear infinite;
                }
                .glitch::before, .glitch::after {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: var(--page-background);
                }
                .glitch::before {
                    left: 2px;
                    text-shadow: -2px 0 red;
                    clip: rect(44px, 450px, 56px, 0);
                    animation: glitch-anim 5s infinite linear alternate-reverse;
                }
                .glitch::after {
                    left: -2px;
                    text-shadow: -2px 0 blue;
                    clip: rect(44px, 450px, 56px, 0);
                    animation: glitch-anim2 5s infinite linear alternate-reverse;
                }
                @keyframes glitch-anim {
                    0% { clip: rect(74px, 9999px, 86px, 0); }
                    5% { clip: rect(24px, 9999px, 86px, 0); }
                    10% { clip: rect(32px, 9999px, 12px, 0); }
                    15% { clip: rect(62px, 9999px, 45px, 0); }
                    20% { clip: rect(51px, 9999px, 7px, 0); }
                    100% { clip: rect(100px, 9999px, 90px, 0); }
                }
                @keyframes glitch-anim2 {
                    0% { clip: rect(65px, 9999px, 100px, 0); }
                    5% { clip: rect(52px, 9999px, 74px, 0); }
                    10% { clip: rect(79px, 9999px, 85px, 0); }
                    15% { clip: rect(14px, 9999px, 64px, 0); }
                    20% { clip: rect(68px, 9999px, 32px, 0); }
                    100% { clip: rect(32px, 9999px, 2px, 0); }
                }
                `
            }} />
        </Flex>
    )
}