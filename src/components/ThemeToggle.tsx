"use client";

import { useEffect, useState } from "react";
import { PiDesktop, PiMoon, PiSun } from "react-icons/pi";
import styles from "./ThemeToggle.module.scss";

type Choice = "system" | "light" | "dark";
const KEY = "theme";

// Runs in <head> before first paint: saved choice wins, otherwise follow the OS. No flash of the wrong theme.
export const themeScript = `(function(){try{var c=localStorage.getItem('${KEY}');var t=c==='light'||c==='dark'?c:(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`;

const apply = (choice: Choice) => {
    const t = choice === "system" ? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : choice;
    document.documentElement.setAttribute("data-theme", t);
};

// Current resolved theme, for canvas/WebGL code that can't read CSS variables reactively.
export function useResolvedTheme() {
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    useEffect(() => {
        const el = document.documentElement;
        const read = () => setTheme(el.getAttribute("data-theme") === "light" ? "light" : "dark");
        read();
        const mo = new MutationObserver(read);
        mo.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
        return () => mo.disconnect();
    }, []);
    return theme;
}

// A theme token as the browser resolved it, for WebGL/canvas code that needs a literal colour.
export const cssVar = (name: string, fallback = "#000") =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

const NEXT: Record<Choice, Choice> = { system: "light", light: "dark", dark: "system" };
const LABEL: Record<Choice, string> = { system: "Theme: system", light: "Theme: light", dark: "Theme: dark" };

export function ThemeToggle() {
    const [choice, setChoice] = useState<Choice>("system");

    useEffect(() => {
        let saved: Choice = "system";
        try {
            const c = localStorage.getItem(KEY);
            if (c === "light" || c === "dark") saved = c;
        } catch { /* storage blocked: stay on system */ }
        setChoice(saved);

        // While on "system", follow OS changes live.
        const mq = matchMedia("(prefers-color-scheme: light)");
        const onChange = () => {
            try { if (!localStorage.getItem(KEY)) apply("system"); } catch { apply("system"); }
        };
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    const cycle = () => {
        const next = NEXT[choice];
        setChoice(next);
        try {
            if (next === "system") localStorage.removeItem(KEY);
            else localStorage.setItem(KEY, next);
        } catch { /* storage blocked: choice lasts for this page only */ }
        apply(next);
    };

    const Icon = choice === "light" ? PiSun : choice === "dark" ? PiMoon : PiDesktop;
    return (
        <button type="button" className={styles.toggle} onClick={cycle} aria-label={`${LABEL[choice]}. Switch to ${NEXT[choice]}`} title={LABEL[choice]}>
            <Icon aria-hidden />
        </button>
    );
}
