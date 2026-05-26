"use client";

import { Users, CheckCircle, Coins, Zap, TrendingUp } from "lucide-react";
import type { Stats } from "@/lib/api";

interface StatsBarProps {
  stats: Stats;
}

const sparkHeights = [8, 12, 9, 14, 10, 18, 20];

function SparkBar({
  accentColor,
  lightColor,
}: {
  accentColor: string;
  lightColor: string;
}) {
  return (
    <div
      className="flex items-end"
      style={{ gap: 2, height: 20, marginBottom: 4 }}
    >
      {sparkHeights.map((h, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: h,
            borderRadius: 2,
            backgroundColor: i >= 5 ? accentColor : lightColor,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

export default function StatsBar({ stats }: StatsBarProps) {
  const conversionRate =
    stats.total_leads > 0
      ? Math.round((stats.qualified_leads / stats.total_leads) * 100)
      : 0;

  const cards = [
    {
      label: "Total leads",
      value: String(stats.total_leads),
      icon: Users,
      sparkline: { accentColor: "#4F46E5", lightColor: "#EEF2FF" },
      trend: {
        text: `+${stats.new_today} this week`,
        color: "#16A34A",
      },
    },
    {
      label: "Qualified",
      value: String(stats.qualified_leads),
      icon: CheckCircle,
      sparkline: { accentColor: "#16A34A", lightColor: "#F0FDF4" },
      trend: {
        text: `${conversionRate}% conversion rate`,
        color: "#6B6560",
      },
    },
    {
      label: "Est. revenue saved",
      value: "$16,500",
      icon: Coins,
      sparkline: { accentColor: "#D97706", lightColor: "#FEF9C3" },
      trend: {
        text: "from recovered bookings",
        color: "#16A34A",
      },
    },
    {
      label: "Avg. response time",
      value: "4s",
      icon: Zap,
      progressBar: true,
      trend: {
        text: "vs 4hr industry average",
        color: "#16A34A",
      },
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
      }}
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #EEEBE6",
              borderRadius: 10,
              padding: "16px 18px",
            }}
          >
            {/* Top row: label + icon */}
            <div
              className="flex items-center justify-between"
              style={{ marginBottom: 10 }}
            >
              <span style={{ fontSize: 12, color: "#6B6560" }}>
                {card.label}
              </span>
              <Icon style={{ width: 15, height: 15, color: "#C5C0BA" }} />
            </div>

            {/* Stat number */}
            <p
              style={{
                fontSize: 28,
                fontWeight: 500,
                color: "#1A1A1A",
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              {card.value}
            </p>

            {/* Sparkline or progress bar */}
            {card.progressBar ? (
              <div
                style={{
                  backgroundColor: "#F0EDE8",
                  height: 6,
                  borderRadius: 20,
                  marginBottom: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "3%",
                    height: "100%",
                    backgroundColor: "#4F46E5",
                    borderRadius: 20,
                  }}
                />
              </div>
            ) : (
              card.sparkline && (
                <SparkBar
                  accentColor={card.sparkline.accentColor}
                  lightColor={card.sparkline.lightColor}
                />
              )
            )}

            {/* Trend */}
            <div
              className="flex items-center"
              style={{ gap: 4 }}
            >
              <TrendingUp
                style={{ width: 11, height: 11, color: card.trend.color }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: card.trend.color,
                }}
              >
                {card.trend.text}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
