/*
 * Oppr brand constants — mirror of the site tokens (globals.css / IMAGERY.md).
 * Flat colour only; colour carries meaning (two-voice rule):
 * terracotta = human, teal = machine, green = verified.
 */
import { loadFont } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

export const GROUND = "#f2f2ed";
export const INK = "#15201e";
export const HUMAN = "#a65032";
export const MACHINE = "#3e6874";
export const VERIFIED = "#55745e";

export const MONO = fontFamily;

export const FPS = 30;
