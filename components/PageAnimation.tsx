"use client";

import { useEffect } from "react";

export default function PageAnimation() {
  useEffect(() => {
    const elements = document.querySelectorAll(".ndc-fade");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px 120px 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}