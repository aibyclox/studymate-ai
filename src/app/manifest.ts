import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StudyMate AI — VTU Exam Prep & Study Management",
    short_name: "StudyMate AI",
    description: "Organize VTU study materials, syllabus units, important questions, and PYQs with AI.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#4f46e5",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

