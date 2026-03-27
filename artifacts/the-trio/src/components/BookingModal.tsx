import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import content from "../data/content.json";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  context: string;
  stage: string;
}

export function BookingModal({ open, onClose }: BookingModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const onSubmit = (_data: FormData) => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      reset();
      onClose();
    }, 2500);
  };

  const inputStyle: React.CSSProperties = {
    background: "#0A0A0A",
    border: "1px solid #222222",
    color: "#F0EDE6",
    fontFamily: "'DM Mono', monospace",
    fontSize: "14px",
    padding: "12px 16px",
    width: "100%",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 200ms ease",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'DM Mono', monospace",
    fontSize: "11px",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "#888880",
    display: "block",
    marginBottom: "8px",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: "#111111",
              border: "1px solid #222222",
              padding: "48px",
              width: "100%",
              maxWidth: "520px",
              position: "relative",
            }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: "absolute",
                top: "20px",
                right: "24px",
                background: "none",
                border: "none",
                color: "#888880",
                fontFamily: "'DM Mono', monospace",
                fontSize: "18px",
                cursor: "pointer",
                padding: "4px 8px",
              }}
            >
              ×
            </button>

            <h2
              id="modal-title"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "28px",
                color: "#F0EDE6",
                marginBottom: "32px",
                lineHeight: 1.15,
              }}
            >
              {content.modal.title}
            </h2>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  color: "#888880",
                  fontSize: "14px",
                  lineHeight: 1.75,
                }}
              >
                <p style={{ color: "#C8A96E", marginBottom: "12px" }}>Context received.</p>
                <p>{content.modal.confirmMessage}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div style={{ marginBottom: "24px" }}>
                  <label htmlFor="name" style={labelStyle}>Name</label>
                  <input
                    id="name"
                    ref={firstInputRef}
                    {...register("name", { required: "Name is required" })}
                    style={{ ...inputStyle, borderColor: errors.name ? "#8B3A3A" : "#222222" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#C8A96E"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = errors.name ? "#8B3A3A" : "#222222"; }}
                  />
                  {errors.name && (
                    <span aria-live="polite" style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#8B3A3A", marginTop: "6px", display: "block" }}>
                      {errors.name.message}
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label htmlFor="email" style={labelStyle}>Email</label>
                  <input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Valid email required" }
                    })}
                    style={{ ...inputStyle, borderColor: errors.email ? "#8B3A3A" : "#222222" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#C8A96E"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = errors.email ? "#8B3A3A" : "#222222"; }}
                  />
                  {errors.email && (
                    <span aria-live="polite" style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#8B3A3A", marginTop: "6px", display: "block" }}>
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label htmlFor="context" style={labelStyle}>What are you working on?</label>
                  <textarea
                    id="context"
                    rows={4}
                    {...register("context", { required: "Context is required" })}
                    style={{ ...inputStyle, resize: "vertical", borderColor: errors.context ? "#8B3A3A" : "#222222" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#C8A96E"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = errors.context ? "#8B3A3A" : "#222222"; }}
                  />
                  {errors.context && (
                    <span aria-live="polite" style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#8B3A3A", marginTop: "6px", display: "block" }}>
                      {errors.context.message}
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: "36px" }}>
                  <label htmlFor="stage" style={labelStyle}>Where is it at?</label>
                  <select
                    id="stage"
                    {...register("stage", { required: true })}
                    style={{ ...inputStyle, appearance: "none", cursor: "pointer", borderColor: "#222222" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#C8A96E"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#222222"; }}
                  >
                    <option value="" style={{ background: "#0A0A0A" }}>Select a stage</option>
                    {content.modal.stageOptions.map((opt) => (
                      <option key={opt} value={opt} style={{ background: "#0A0A0A" }}>{opt}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  style={{
                    background: "#C8A96E",
                    color: "#0A0A0A",
                    border: "none",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "14px",
                    padding: "14px 36px",
                    cursor: "pointer",
                    width: "100%",
                    transition: "background 200ms ease",
                    letterSpacing: "0.04em",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#7A6340"; e.currentTarget.style.color = "#F0EDE6"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#C8A96E"; e.currentTarget.style.color = "#0A0A0A"; }}
                >
                  {content.modal.submitButton}
                </button>

                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#333330", textAlign: "center", marginTop: "16px" }}>
                  {content.modal.confirmMessage}
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
