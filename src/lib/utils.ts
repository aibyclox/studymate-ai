import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(dateString);
}

export type FileCategory = "pdf" | "document" | "presentation" | "image" | "text" | "other";

export function getFileCategory(fileName: string, mimeType?: string): FileCategory {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  if (ext === "pdf" || mimeType === "application/pdf") return "pdf";
  if (["doc", "docx"].includes(ext) || mimeType?.includes("word")) return "document";
  if (["ppt", "pptx"].includes(ext) || mimeType?.includes("presentation")) return "presentation";
  if (["png", "jpg", "jpeg", "webp"].includes(ext) || mimeType?.startsWith("image/")) return "image";
  if (["txt", "md"].includes(ext) || mimeType?.startsWith("text/")) return "text";
  return "other";
}

