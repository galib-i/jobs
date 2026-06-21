import { useState, useRef, useEffect } from "react";

const EditableInput = ({ initialValue, onSave, className = "" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [isEditing, value]);

  const handleSave = () => {
    setIsEditing(false);
    if (value !== initialValue && onSave) {
      onSave(value);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
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
        style={{
          padding: "4px",
          fontSize: "inherit",
          fontFamily: "inherit",
          width: "100%",
          resize: "none",
          overflow: "hidden",
          backgroundColor: "#1e293b",
          color: "#e2e8f0",
          border: "1px solid #475569",
          borderRadius: "4px",
        }}
        className={className}
      />
    );
  }

  return (
    <span
      onDoubleClick={() => setIsEditing(true)}
      style={{
        cursor: "pointer",
        padding: "4px",
        border: "1px solid transparent",
      }}
      className={className}
    >
      {value}
    </span>
  );
};

export default EditableInput;
