"use client";

import { useEffect, useRef } from "react";
import { PiX } from "react-icons/pi";
import styles from "./Lightbox.module.scss";

// Full-screen image viewer on the native <dialog>: Esc, backdrop click and the X all close it.
export function Lightbox({ src, alt, onClose }: { src: string | null; alt: string; onClose: () => void }) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (src && !ref.current?.open) ref.current?.showModal();
    }, [src]);

    return (
        <dialog ref={ref} className={styles.dialog} onClose={onClose} onClick={(e) => e.target === ref.current && ref.current?.close()}>
            {src && (
                <>
                    <img src={src} alt={alt} />
                    <button type="button" className={styles.close} onClick={() => ref.current?.close()} aria-label="Close">
                        <PiX aria-hidden />
                    </button>
                </>
            )}
        </dialog>
    );
}
