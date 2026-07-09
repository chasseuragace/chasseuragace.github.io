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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FormData>();
  const selectedStage = watch("stage");

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



  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("https://trio-worker.chasseuragace.workers.dev/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.stage,
          message: `${data.context}\n\nStage: ${data.stage}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit booking");
      }

      // Handle success
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        reset();
        onClose();
      }, 2500);
    } catch (error) {
      console.error("Booking submission error:", error);
      // Provide a more specific error message if possible, or a general one
      alert("Failed to submit booking. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
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

  const errorTextStyle: React.CSSProperties = {
    fontFamily: "'DM Mono', monospace",
    fontSize: "11px",
    color: "#8B3A3A",
    marginTop: "6px",
    display: "block",
  };

  const chipStyle = (selected: boolean, errored: boolean): React.CSSProperties => ({
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    fontFamily: "'DM Mono', monospace",
    fontSize: "13px",
    padding: "10px 16px",
    border: "1px solid",
    borderColor: errored ? "#8B3A3A" : selected ? "#C8A96E" : "#222222",
    background: selected ? "#C8A96E" : "#0A0A0A",
    color: selected ? "#0A0A0A" : "#F0EDE6",
    cursor: "pointer",
    transition: "all 200ms ease",
  });

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
            overflowY: "auto",
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
              margin: "auto",
              maxHeight: "calc(100vh - 48px)",
              overflowY: "auto",
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
                marginBottom: "12px",
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
              <>
                <p
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "12px",
                    color: "#888880",
                    marginBottom: "28px",
                    lineHeight: 1.6,
                  }}
                >
                  Takes about 2 minutes. {content.modal.confirmMessage}
                </p>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div style={{ marginBottom: "24px" }}>
                    <label htmlFor="name" style={labelStyle}>Do you have a name?</label>
                    <input
                      id="name"
                      {...register("name", { required: "Name is required" })}
                      ref={(e) => {
                        register("name").ref(e);
                        firstInputRef.current = e;
                      }}
                      style={{ ...inputStyle, borderColor: errors.name ? "#8B3A3A" : "#222222" }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "#C8A96E"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = errors.name ? "#8B3A3A" : "#222222"; }}
                    />
                    {errors.name && (
                      <span aria-live="polite" style={errorTextStyle}>
                        {errors.name.message}
                      </span>
                    )}
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <label htmlFor="email" style={labelStyle}>Your email so I can write back to you</label>
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
                      <span aria-live="polite" style={errorTextStyle}>
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <label htmlFor="context" style={labelStyle}>A little context so I know where we're headed</label>
                    <textarea
                      id="context"
                      rows={4}
                      placeholder="e.g. I want a website for my cafe…"
                      {...register("context", { required: "Context is required" })}
                      style={{ ...inputStyle, resize: "vertical", borderColor: errors.context ? "#8B3A3A" : "#222222" }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "#C8A96E"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = errors.context ? "#8B3A3A" : "#222222"; }}
                    />
                    {errors.context && (
                      <span aria-live="polite" style={errorTextStyle}>
                        {errors.context.message}
                      </span>
                    )}
                  </div>

                  <div style={{ marginBottom: "36px" }}>
                    <label style={labelStyle}>Where are you standing right now?</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {content.modal.stageOptions.map((opt) => {
                        const selected = selectedStage === opt;
                        return (
                          <label key={opt} style={chipStyle(selected, !!errors.stage && !selected)}>
                            <input
                              type="radio"
                              value={opt}
                              {...register("stage", { required: "Please select a stage" })}
                              style={{ position: "absolute", width: "1px", height: "1px", opacity: 0, pointerEvents: "none" }}
                            />
                            {opt}
                          </label>
                        );
                      })}
                    </div>
                    {errors.stage && (
                      <span aria-live="polite" style={errorTextStyle}>
                        {errors.stage.message}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      background: isSubmitting ? "#3A3A35" : "#C8A96E",
                      color: isSubmitting ? "#888880" : "#0A0A0A",
                      border: "none",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "14px",
                      padding: "14px 36px",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      width: "100%",
                      transition: "background 200ms ease",
                      letterSpacing: "0.04em",
                      opacity: isSubmitting ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => { if (!isSubmitting) { e.currentTarget.style.background = "#7A6340"; e.currentTarget.style.color = "#F0EDE6"; } }}
                    onMouseLeave={(e) => { if (!isSubmitting) { e.currentTarget.style.background = "#C8A96E"; e.currentTarget.style.color = "#0A0A0A"; } }}
                  >
                    {isSubmitting ? "Sending…" : content.modal.submitButton}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
