"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { iconLibrary } from "@/once-ui/icons";
import styles from "./NavBar.module.scss";

type NavItem = { href: string; label: string; icon: string; active: boolean };

// Glass pill with a metallic edge; the active highlight slides between items.
export function NavBar({ items }: { items: NavItem[] }) {
    return (
        <nav className={styles.bar} aria-label="Main">
            {items.map((item) => {
                const Icon = iconLibrary[item.icon];
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={styles.item}
                        data-active={item.active || undefined}
                        aria-current={item.active ? "page" : undefined}>
                        {item.active && (
                            <motion.span
                                layoutId="nav-active"
                                className={styles.active}
                                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                            />
                        )}
                        {Icon && <Icon className={styles.icon} aria-hidden />}
                        <span className={styles.label}>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
