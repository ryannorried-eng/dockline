"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/lib/api";
import { formatTime } from "@/lib/utils";
import { MessageSquare, Anchor, User } from "lucide-react";

interface ConversationThreadProps {
  messages: Message[];
}

export default function ConversationThread({
  messages,
}: ConversationThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
          style={{
            background: "rgba(14, 116, 144, 0.1)",
            border: "1px solid rgba(14, 116, 144, 0.2)",
          }}
        >
          <MessageSquare className="w-5 h-5 text-[#0E7490]" />
        </div>
        <p className="text-sm font-medium text-[#94A3B8]">No messages yet</p>
        <p className="text-xs text-[#94A3B8]/50 mt-1">
          Conversation will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 px-2">
      {messages.map((msg) => {
        const isOutbound = msg.direction === "outbound";

        return (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${isOutbound ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={
                isOutbound
                  ? {
                      background: "rgba(6, 182, 212, 0.15)",
                      border: "1px solid rgba(6, 182, 212, 0.25)",
                    }
                  : {
                      background: "rgba(148, 163, 184, 0.1)",
                      border: "1px solid rgba(148, 163, 184, 0.15)",
                    }
              }
            >
              {isOutbound ? (
                <Anchor className="w-3.5 h-3.5 text-[#06B6D4]" />
              ) : (
                <User className="w-3.5 h-3.5 text-[#94A3B8]" />
              )}
            </div>

            {/* Bubble + timestamp */}
            <div
              className={`flex flex-col max-w-[75%] ${isOutbound ? "items-end" : "items-start"}`}
            >
              <div
                className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm"
                style={
                  isOutbound
                    ? {
                        background:
                          "linear-gradient(135deg, #0E7490 0%, #0891B2 100%)",
                        color: "#F8FAFC",
                        borderBottomRightRadius: "4px",
                        boxShadow: "0 2px 8px rgba(6, 182, 212, 0.2)",
                      }
                    : {
                        background: "rgba(248, 250, 252, 0.92)",
                        color: "#1e293b",
                        borderBottomLeftRadius: "4px",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                      }
                }
              >
                {msg.body}
              </div>
              <span className="text-[10px] text-[#94A3B8]/60 mt-1.5 px-1">
                {isOutbound ? "Dockline AI · " : "Customer · "}
                {formatTime(msg.timestamp)}
              </span>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
