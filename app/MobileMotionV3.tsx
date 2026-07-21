"use client";

import { useEffect } from "react";
import styles from "./MobileMotionV3.module.css";

const SUBMIT_BUTTON_SELECTOR =
  ".consult form button, .consult-popup form button";

function isSuccessfulSubmit(button: HTMLButtonElement): boolean {
  return button.textContent?.trim().startsWith("Đã") ?? false;
}

export default function MobileMotionV3() {
  useEffect(() => {
    const root = document.documentElement;
    const heroImage = document.querySelector<HTMLImageElement>(".hero-photo");
    const processSection = document.querySelector<HTMLElement>(".process");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    root.classList.add(styles.root);

    const revealHero = () => {
      window.requestAnimationFrame(() => root.classList.add(styles.loaded));
    };

    if (!heroImage || heroImage.complete) {
      revealHero();
    } else {
      heroImage.addEventListener("load", revealHero, { once: true });
    }

    let processObserver: IntersectionObserver | undefined;
    if (processSection) {
      if (reduceMotion || !("IntersectionObserver" in window)) {
        processSection.classList.add(styles.processVisible);
      } else {
        processObserver = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            processSection.classList.add(styles.processVisible);
            processObserver?.disconnect();
          },
          {
            threshold: 0.18,
            rootMargin: "0px 0px -8% 0px",
          },
        );
        processObserver.observe(processSection);
      }
    }

    const syncSubmitButtons = () => {
      document
        .querySelectorAll<HTMLButtonElement>(SUBMIT_BUTTON_SELECTOR)
        .forEach((button) => {
          const successful = isSuccessfulSubmit(button);
          button.classList.toggle(styles.success, successful);
          if (successful) {
            button.setAttribute("aria-live", "polite");
          } else {
            button.removeAttribute("aria-live");
          }
        });
    };

    syncSubmitButtons();
    const submitObserver = new MutationObserver(syncSubmitButtons);
    submitObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      heroImage?.removeEventListener("load", revealHero);
      processObserver?.disconnect();
      submitObserver.disconnect();
      root.classList.remove(styles.root, styles.loaded);
      processSection?.classList.remove(styles.processVisible);
      document
        .querySelectorAll<HTMLButtonElement>(SUBMIT_BUTTON_SELECTOR)
        .forEach((button) => {
          button.classList.remove(styles.success);
          button.removeAttribute("aria-live");
        });
    };
  }, []);

  return null;
}
