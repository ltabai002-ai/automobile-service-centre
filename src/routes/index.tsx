import { createFileRoute } from "@tanstack/react-router";
import InFieldLanding from "@/components/InFieldLanding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InField — Sales Team, Test Drive & Lead Management App for Car Showrooms" },
      { name: "description", content: "Track your showroom sales team live, record every test drive, manage leads from walk-in to delivery and auto-calculate incentives — all in one app. Book a free demo." },
      { property: "og:title", content: "InField — Sales Management for Car Showrooms" },
      { property: "og:description", content: "Track your sales team, test drives and every deal from one app." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InFieldLanding,
});
