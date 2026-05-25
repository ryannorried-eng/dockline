"use client";

import type { Message } from "@/lib/api";
import { formatTime } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

interface ConversationThreadProps {
  messages: Message[];
}

export default function ConversationThread({ messages }: ConversationThreadProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <MessageSquare className="w-5 h-5 text-slate-400" />
        </div>
        <p className="text-sm text-slate-500">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 py-4 px-2">
      {messages.map((msg) => {
        const isOutbound = msg.direction === "outbound";

        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isOutbound ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                isOutbound
                  ? "bg-[#0E7490] text-white rounded-br-md"
                  : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
              }`}
            >
              {msg.body}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">
              {isOutbound ? "Dockline · " : "Customer · "}
              {formatTime(msg.timestamp)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
