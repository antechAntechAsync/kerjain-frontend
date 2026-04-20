import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * TagInput — skill tag entry with keyboard navigation.
 * Supports adding tags via Enter/comma and removing via backspace/X.
 *
 * Usage:
 *   <TagInput value={skills} onChange={setSkills} placeholder="Add a skill..." />
 */
export default function TagInput({
  value = [],
  onChange,
  placeholder = 'Add a tag...',
  max = 20,
  label,
  error,
  className,
}) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const addTag = (raw) => {
    const tag = raw.trim();
    if (!tag || value.includes(tag) || value.length >= max) return;
    onChange([...value, tag]);
    setInput('');
  };

  const removeTag = (tag) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant ml-1">
          {label}
        </label>
      )}
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          'flex flex-wrap gap-2 p-3 min-h-[56px]',
          'rounded-sq-md bg-surface-container-lowest dark:bg-dark-surface-container-lowest',
          'border border-outline-variant dark:border-dark-outline-variant',
          'cursor-text transition-all duration-200',
          'focus-within:border-secondary/50 focus-within:[box-shadow:0_0_0_4px_rgba(60,131,246,0.15)]',
          error && 'border-error',
          className,
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed text-secondary dark:bg-secondary/20 dark:text-dark-secondary text-sm font-semibold"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-error transition-colors"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(input)}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] outline-none bg-transparent text-sm text-primary dark:text-dark-primary placeholder:text-on-surface-variant/50"
        />
      </div>
      {error && <p className="text-xs text-error ml-1">{error}</p>}
      <p className="text-xs text-on-surface-variant ml-1">
        Press Enter or comma to add • {value.length}/{max}
      </p>
    </div>
  );
}
