"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PiMagnifyingGlass } from "react-icons/pi";
import styles from "./Kbar.module.scss";

// Same item shape as Once UI v2's Kbar (minus perform(): items are built on the server, so actions are hrefs).
export interface KbarItem {
    id: string;
    name: string;
    section: string;
    keywords?: string;
    href: string;
    description?: string;
}

const OPEN_EVENT = "kbar:open";

// Command palette: ⌘K / Ctrl+K anywhere, or the trigger in the header. Type to filter, arrows to move, Enter to go.
export function Kbar({ items }: { items: KbarItem[] }) {
    const router = useRouter();
    const dialog = useRef<HTMLDialogElement>(null);
    const input = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        return q ? items.filter((i) => `${i.name} ${i.keywords ?? ""} ${i.section}`.toLowerCase().includes(q)) : items;
    }, [items, query]);

    const open = () => {
        setQuery("");
        setActive(0);
        if (!dialog.current?.open) dialog.current?.showModal();
        input.current?.focus();
    };

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                if (dialog.current?.open) dialog.current.close();
                else open();
            }
        };
        window.addEventListener("keydown", onKey);
        window.addEventListener(OPEN_EVENT, open);
        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener(OPEN_EVENT, open);
        };
    }, []);

    const run = (item: KbarItem | undefined) => {
        if (!item) return;
        dialog.current?.close();
        if (/^(https?:|mailto:)/.test(item.href) || item.href.endsWith(".pdf")) window.open(item.href, item.href.startsWith("mailto:") ? "_self" : "_blank", "noopener");
        else router.push(item.href);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)); }
        if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
        if (e.key === "Enter") { e.preventDefault(); run(results[active]); }
    };

    // Keep the highlighted row in view while arrowing through a long list.
    useEffect(() => {
        dialog.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
    }, [active]);

    let lastSection = "";
    return (
        <dialog ref={dialog} className={styles.dialog} aria-label="Command menu" onClick={(e) => e.target === dialog.current && dialog.current?.close()}>
            <div className={styles.panel} onKeyDown={onKeyDown}>
                <div className={styles.search}>
                    <PiMagnifyingGlass aria-hidden />
                    <input
                        ref={input}
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                        placeholder="Search projects, pages or actions"
                        aria-label="Search"
                        aria-controls="kbar-results"
                        aria-activedescendant={results[active] ? `kbar-${results[active].id}` : undefined}
                    />
                    <kbd>esc</kbd>
                </div>
                <ul id="kbar-results" className={styles.list} role="listbox">
                    {results.length === 0 && <li className={styles.empty}>No matches for “{query}”</li>}
                    {results.map((item, i) => {
                        const header = item.section !== lastSection ? item.section : null;
                        lastSection = item.section;
                        return (
                            <li key={item.id} role="presentation">
                                {header && <div className={styles.section}>{header}</div>}
                                <button
                                    type="button"
                                    id={`kbar-${item.id}`}
                                    role="option"
                                    aria-selected={i === active}
                                    data-index={i}
                                    className={styles.item}
                                    onMouseMove={() => setActive(i)}
                                    onClick={() => run(item)}>
                                    <span>{item.name}</span>
                                    {item.description && <span className={styles.desc}>{item.description}</span>}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </dialog>
    );
}

// Header button that opens the palette (shows the shortcut on desktop, a search icon on phones).
export function KbarTrigger() {
    const [mac, setMac] = useState(true);
    useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.userAgent)), []);
    return (
        <button type="button" className={styles.trigger} onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))} aria-label="Open command menu">
            <PiMagnifyingGlass aria-hidden />
            <kbd>{mac ? "⌘K" : "Ctrl K"}</kbd>
        </button>
    );
}
