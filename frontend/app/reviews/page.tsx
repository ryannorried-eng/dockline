import { Star } from "lucide-react";

export default function ReviewsPage() {
  return (
    <div
      className="page-enter"
      style={{
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* White card */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #EEEBE6",
          borderRadius: 10,
          padding: "64px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Icon */}
        <Star
          style={{ width: 32, height: 32, color: "#C5C0BA" }}
          strokeWidth={1.5}
        />

        {/* Heading */}
        <p
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "#1A1A1A",
            margin: 0,
          }}
        >
          Reviews
        </p>

        {/* Subtext */}
        <p
          style={{
            fontSize: 13,
            color: "#9B9589",
            maxWidth: 320,
            textAlign: "center",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Review request tracking coming soon. Send review requests from any
          qualified lead.
        </p>
      </div>
    </div>
  );
}
