"use client";

import { useState } from "react";

type TagPickerProps = {
  value: string[];
  onChange: (tags: string[]) => void;
};

export default function TagPicker({ value, onChange }: TagPickerProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const normalized = inputValue.trim().toLowerCase();
    if (!normalized) {
      return;
    }
    if (normalized.length < 1 || normalized.length > 24) {
      return;
    }
    if (value.includes(normalized)) {
      return;
    }
    if (value.length >= 12) {
      return;
    }

    onChange([...value, normalized]);
    setInputValue("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((item) => item !== tag));
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            addTag();
          }
        }}
        placeholder="Add tag and press Enter"
        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500"
      />
      {value.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-2 py-1 text-xs text-neutral-300"
            >
              {tag}
              <button
                type="button"
                className="text-neutral-400 transition hover:text-neutral-200"
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
