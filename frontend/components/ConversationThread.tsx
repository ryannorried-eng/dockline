"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/lib/api";
import { formatTime } from "@/lib/utils";
import { Anchor, User } from "lucide-react";

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
      <div
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <p style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}>
          No messages yet
        </p>
        <p style={{ fontSize: 11, color: "#9B9589", marginTop: 4 }}>
          Conversation will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ gap: 12, padding: "16px 0" }}>
      {messages.map((msg) => {
        const isOutbound = msg.direction === "outbound";

        return (
          <div
            key={msg.id}
            className="flex"
            style={{
              flexDirection: isOutbound ? "row-reverse" : "row",
              gap: 10,
              alignItems: "flex-end",
            }}
          >
            {/* Avatar */}
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: isOutbound ? "#4F46E5" : "#F0EDE8",
              }}
            >
              {isOutbound ? (
                <Anchor style={{ width: 13, height: 13, color: "#FFFFFF" }} />
              ) : (
                <User style={{ width: 13, height: 13, color: "#6B6560" }} />
              )}
            </div>

            {/* Bubble */}
            <div
              className="flex flex-col"
              style={{
                maxWidth: isOutbound ? "65%" : "60%",
                alignItems: isOutbound ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  backgroundColor: isOutbound ? "#4F46E5" : "#F5F2EE",
                  borderRadius: isOutbound
                    ? "10px 0 10px 10px"
                    : "0 10px 10px 10px",
                  padding: "10px 14px",
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    color: isOutbound ? "#FFFFFF" : "#1A1A1A",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {msg.body}
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: isOutbound ? "rgba(255,255,255,0.6)" : "#9B9589",
                    marginTop: 4,
                    marginBottom: 0,
                  }}
                >
                  {isOutbound ? "Dockline AI" : "Customer"} · {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
