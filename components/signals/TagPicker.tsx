"use client";

import { useState } from "react";

type TagPickerProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
};

export default function TagPicker({
  value,
  onChange,
  placeholder,
}: TagPickerProps) {
  const [inputValue, setInputValue] = useState("");

  const normalizeTag = (tag: string) => tag.trim().toLowerCase();

  const addTags = (tags: string[]) => {
    let nextTags = value;

    tags.forEach((tag) => {
      const normalized = normalizeTag(tag);
      if (!normalized) {
        return;
      }
      if (normalized.length < 1 || normalized.length > 24) {
        return;
      }
      if (nextTags.includes(normalized)) {
        return;
      }
      if (nextTags.length >= 12) {
        return;
      }

      nextTags = [...nextTags, normalized];
    });

    if (nextTags !== value) {
      onChange(nextTags);
    }
  };

  const addFromInput = () => {
    addTags(inputValue.split(","));
    setInputValue("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((item) => item !== tag));
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        value={inputValue}
        onChange={(event) => {
          const nextValue = event.target.value;
          if (nextValue.includes(",")) {
            const parts = nextValue.split(",");
            const lastValue = parts.pop() ?? "";
            addTags(parts);
            setInputValue(lastValue);
            return;
          }
          setInputValue(nextValue);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            addFromInput();
          }
          if (event.key === "Backspace" && inputValue.length === 0) {
            if (value.length === 0) {
              return;
            }
            event.preventDefault();
            onChange(value.slice(0, -1));
          }
        }}
        placeholder={placeholder ?? "Add tag and press Enter"}
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
