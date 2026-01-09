"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={copy} className="copy-btn">
      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
      <span>{text}</span>
    </button>
  );
}

const lines = [
  { text: "$ npx ship18ion check", type: "input" },
  { text: "Initializing...", type: "system" },
  { text: "Scanning files...", type: "system" },
  { text: "Detected Framework: NEXTJS", type: "info" },
  { text: "", type: "gap" },
  { text: "❌ Production Readiness Check Failed", type: "error" },
  { text: "", type: "gap" },
  { text: "🔐 Secrets", type: "category" },
  { text: "  ✖ Potential secret found: AWS Access Key src/index.js:5", type: "error" },
  { text: "⚠️ Security", type: "category" },
  { text: "  ! Debug mode enabled (debug: true) src/rules/security.ts", type: "warn" },
  { text: "🧹 Code Hygiene", type: "category" },
  { text: "  ! Leftover console.log() call detected src/app/page.tsx:42", type: "warn" },
  { text: "", type: "gap" },
  { text: "Summary: 1 errors, 2 warnings", type: "system" },
];

export default function TerminalDemo() {
  const [currentLines, setCurrentLines] = useState<number[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLines((prev) => {
        if (prev.length >= lines.length) {
          clearInterval(timer);
          return prev;
        }
        return [...prev, prev.length];
      });
    }, 400);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="terminal-dots">
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
        </div>
        <div className="terminal-title">ship18ion — bash — champ18ion</div>
      </div>
      <div className="terminal-content">
        <AnimatePresence>
          {currentLines.map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`terminal-line ${lines[index].type}`}
            >
              {lines[index].text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
