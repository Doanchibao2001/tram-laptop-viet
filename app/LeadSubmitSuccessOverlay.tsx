"use client";

import { useEffect, useState } from "react";
import styles from "./LeadSubmitSuccessOverlay.module.css";

const FACEBOOK_MOBILE_WEB_URL =
  "https://m.facebook.com/profile.php?id=61591726413298";
const REDIRECT_DELAY_MS = 3200;
const LEAD_FORM_SELECTOR = ".consult form, .consult-popup form";

export default function LeadSubmitSuccessOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let redirectTimer = 0;

    const redirectToFacebook = () => {
      window.location.replace(FACEBOOK_MOBILE_WEB_URL);
    };

    const handleSubmit = (event: SubmitEvent) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (!form.matches(LEAD_FORM_SELECTOR)) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const source = form.closest(".consult-popup")
        ? "popup-tu-van"
        : "form-trang-chu";

      window.sessionStorage.setItem(
        "tram-laptop-viet-conversion-popup-v3",
        "1",
      );
      window.dispatchEvent(
        new CustomEvent("tram:lead-submitted", { detail: { source } }),
      );

      form.reset();
      setVisible(true);
      window.clearTimeout(redirectTimer);
      redirectTimer = window.setTimeout(redirectToFacebook, REDIRECT_DELAY_MS);
    };

    document.addEventListener("submit", handleSubmit, true);

    return () => {
      document.removeEventListener("submit", handleSubmit, true);
      window.clearTimeout(redirectTimer);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={styles.backdrop}>
      <section
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="lead-success-title"
        aria-describedby="lead-success-description"
      >
        <div className={styles.icon} aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="m5 12 4 4 10-10" />
          </svg>
        </div>

        <span className={styles.eyebrow}>ĐÃ GỬI YÊU CẦU</span>
        <h2 id="lead-success-title">Thông tin đã được tiếp nhận</h2>
        <p id="lead-success-description">
          Anh chị vui lòng chờ trong giây lát, sẽ có nhân viên kỹ thuật gọi
          lại hỗ trợ.
        </p>

        <div className={styles.redirectNotice} aria-live="polite">
          <div className={styles.redirectLine}>
            <span className={styles.spinner} aria-hidden="true" />
            <span>Đang chuyển tới Fanpage Trạm Laptop Việt…</span>
          </div>
          <div className={styles.progress} aria-hidden="true">
            <i />
          </div>
        </div>

        <button
          type="button"
          className={styles.facebookButton}
          onClick={() => window.location.replace(FACEBOOK_MOBILE_WEB_URL)}
        >
          Đi tới Fanpage ngay
        </button>
        <small>Không cần gửi lại yêu cầu.</small>
      </section>
    </div>
  );
}
