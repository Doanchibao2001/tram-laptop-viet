"use client";

import { useEffect } from "react";
import performanceStyles from "./MobileMotionPerformance.module.css";
import styles from "./MobileMotionV3.module.css";

const SUBMIT_BUTTON_SELECTOR =
  ".consult form button, .consult-popup form button";

const REVEAL_SECTION_SELECTOR = [
  ".brand-showcase",
  ".trust-strip",
  ".services",
  ".products",
  ".locations",
  ".seo-section",
  ".consult",
].join(",");

function isSuccessfulSubmit(button: HTMLButtonElement): boolean {
  return button.textContent?.trim().startsWith("Đã") ?? false;
}

export default function MobileMotionV3() {
  useEffect(() => {
    const root = document.documentElement;
    const heroImage = document.querySelector<HTMLImageElement>(".hero-photo");
    const processSection = document.querySelector<HTMLElement>(".process");
    const revealSections = Array.from(
      document.querySelectorAll<HTMLElement>(REVEAL_SECTION_SELECTOR),
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    root.classList.add(styles.root, performanceStyles.root);
    revealSections.forEach((section) => section.classList.add(styles.revealSection));

    const revealHero = () => {
      window.requestAnimationFrame(() => root.classList.add(styles.loaded));
    };

    if (!heroImage || heroImage.complete) {
      revealHero();
    } else {
      heroImage.addEventListener("load", revealHero, { once: true });
    }

    let processObserver: IntersectionObserver | undefined;
    let sectionObserver: IntersectionObserver | undefined;

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
            threshold: 0.14,
            rootMargin: "0px 0px -4% 0px",
          },
        );
        processObserver.observe(processSection);
      }
    }

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealSections.forEach((section) => section.classList.add(styles.revealVisible));
    } else {
      sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add(styles.revealVisible);
            sectionObserver?.unobserve(entry.target);
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -2% 0px",
        },
      );
      revealSections.forEach((section) => sectionObserver?.observe(section));
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

    const handleSubmit = (event: SubmitEvent) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (!form.matches(".consult form, .consult-popup form")) return;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(syncSubmitButtons);
      });
    };

    syncSubmitButtons();
    document.addEventListener("submit", handleSubmit, true);

    return () => {
      heroImage?.removeEventListener("load", revealHero);
      processObserver?.disconnect();
      sectionObserver?.disconnect();
      document.removeEventListener("submit", handleSubmit, true);
      root.classList.remove(styles.root, styles.loaded, performanceStyles.root);
      processSection?.classList.remove(styles.processVisible);
      revealSections.forEach((section) =>
        section.classList.remove(styles.revealSection, styles.revealVisible),
      );
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
