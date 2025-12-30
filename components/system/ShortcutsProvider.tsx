"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const isEditableTarget = (target: EventTarget | null) => {
  if (!target || !(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  if (tagName === "input" || tagName === "textarea" || tagName === "select") {
    return true;
  }

  return target.isContentEditable;
};

export default function ShortcutsProvider() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (isEditableTarget(event.target)) {
        return;
      }

      if (event.key === "n") {
        event.preventDefault();
        router.push("/app/new");
        return;
      }

      if (event.key === "/") {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent("signalshelf:focus-search"));
        return;
      }

      if (event.key === "Escape") {
        window.dispatchEvent(new CustomEvent("signalshelf:escape"));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  return null;
}
