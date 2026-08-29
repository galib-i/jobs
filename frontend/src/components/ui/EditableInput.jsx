import { useState, useRef, useEffect } from "react";

export default function EditableInput({
  initialValue,
  onSave,
  className = "",
  editing,
  onEditingChange,
}) {
  const [isEditing, setIsEditing] = useState(editing ?? false);
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (editing !== undefined) setIsEditing(editing);
  }, [editing]);

  const updateEditing = (val) => {
    setIsEditing(val);
    onEditingChange?.(val);
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [isEditing, value]);

  const handleSave = () => {
    updateEditing(false);
    if (value !== initialValue && onSave) {
      onSave(value);
    }
  };

  const handleCancel = () => {
    updateEditing(false);
    setValue(initialValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") handleCancel();
  };

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        rows={1}
        className={`w-full resize-none overflow-hidden rounded border border-slate-300 bg-white p-1 font-[inherit] text-[length:inherit] text-slate-800 outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 ${className}`}
      />
    );
  }

  return (
    <span
      onDoubleClick={() => updateEditing(true)}
      className={`border border-transparent p-1 ${className}`}
    >
      {value}
    </span>
  );
}
