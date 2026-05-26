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
        <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
          <MessageSquare className="w-5 h-5 text-[#94A3B8]" />
        </div>
        <p className="text-sm font-semibold text-[#0F172A]">No messages yet</p>
        <p className="text-xs text-[#94A3B8] mt-1">
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
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                isOutbound ? "bg-[#2563EB]" : "bg-[#F1F5F9]"
              }`}
            >
              {isOutbound ? (
                <Anchor className="w-3.5 h-3.5 text-white" />
              ) : (
                <User className="w-3.5 h-3.5 text-[#64748B]" />
              )}
            </div>

            {/* Bubble + timestamp */}
            <div
              className={`flex flex-col max-w-[70%] ${
                isOutbound ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-3 py-3 rounded-xl text-sm leading-relaxed ${
                  isOutbound
                    ? "bg-[#2563EB] text-white"
                    : "bg-white text-[#0F172A] border border-[#E2E8F0]"
                }`}
              >
                {msg.body}
              </div>
              <span className="text-[11px] text-[#94A3B8] mt-1.5 px-1">
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
