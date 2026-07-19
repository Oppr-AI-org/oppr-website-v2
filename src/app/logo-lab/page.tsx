import type { Metadata } from "next";
import { LogoLab } from "./LogoLab";

/*
 * Dev-only logo & favicon comparison page (see LOGO.md). Ten inline-SVG
 * iterations of the Oppr mark, side by side, for picking a direction.
 * Unindexed and unlinked; nothing here touches the live site.
 */
export const metadata: Metadata = {
  title: "Logo Lab · Oppr",
  robots: { index: false, follow: false },
};

export default function LogoLabPage() {
  return <LogoLab />;
}
