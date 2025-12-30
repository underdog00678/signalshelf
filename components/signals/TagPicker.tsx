"use client";

import { useState } from "react";

export default function TagPicker(props: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const { value, onChange, placeholder } = props;
  const [inputValue, setInputValue] = useState("");

  const normalize = (tag: string) => tag.trim().toLowerCase();

  const addTags = (rawTags: string[]) => {
    let nextTags = value;

    rawTags.forEach((tag) => {
      const normalized = normalize(tag);
      if (!normalized) {
        return;
      }
      if (nextTags.includes(normalized)) {
        return;
      }
      nextTags = [...nextTags, normalized];
    });

    if (nextTags !== value) {
      onChange(nextTags);
    }
  };

  const addFromInput = () => {
    const parts = inputValue.split(",");
    addTags(parts);
    setInputValue("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((item) => item !== tag));
  };

  return (
    <div className="flex flex-col gap-2">
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
            return;
          }
          if (event.key === "Backspace" && inputValue.length === 0) {
            if (value.length === 0) {
              return;
            }
            event.preventDefault();
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => {
          if (inputValue.trim().length === 0) {
            setInputValue("");
            return;
          }
          addFromInput();
        }}
        placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500"
      />
    </div>
  );
}
