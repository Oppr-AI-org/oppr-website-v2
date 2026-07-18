"use client";

/*
 * FilmVideo — plays a rendered Remotion film (public/films/*) in the slot the
 * hand-built SVG sequences used to occupy. Muted, looping, inline.
 *
 * Behaviour:
 *  - Plays only while in the viewport (scroll/resize + initial check, retrying
 *    on `canplay`) so the page never runs every clip at once off-screen.
 *  - `muted` is forced on the element imperatively: React does not reliably set
 *    the muted *attribute* from the prop, and without it the browser blocks
 *    muted-autoplay so play() is rejected and the clip freezes on frame one.
 *  - `offset` seeds the playhead so sibling clips (the three capture demos) are
 *    not in lock-step.
 *  - Honours prefers-reduced-motion: never plays; the poster (a hold frame of
 *    the finished scene) stands in, matching the old reduced-motion fallback.
 */
import { useEffect, useRef } from "react";

type Props = {
  src: string;
  poster: string;
  label: string;
  /** Seconds to seed into the loop so sibling clips are not in lock-step. */
  offset?: number;
  className?: string;
};

export function FilmVideo({ src, poster, label, offset = 0, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // Force muted on the element (not just the prop) so muted-autoplay via
    // play() is actually permitted.
    video.muted = true;
    video.defaultMuted = true;

    // Seed the playhead so the sibling clips do not run in lock-step.
    const seed = () => {
      if (offset > 0 && Number.isFinite(video.duration) && video.duration > 1) {
        try {
          video.currentTime = offset % video.duration;
        } catch {
          /* not seekable yet */
        }
      }
    };
    if (video.readyState >= 1) seed();
    else video.addEventListener("loadedmetadata", seed, { once: true });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Play while the clip is in the viewport, pause when it leaves. Driven by
    // scroll/resize + the initial check rather than IntersectionObserver, so it
    // starts reliably regardless of observer quirks.
    const inView = () => {
      const r = video.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return r.bottom > 0 && r.top < vh;
    };
    const update = () => {
      if (inView()) {
        const p = video.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      } else if (!video.paused) {
        video.pause();
      }
    };

    update();
    video.addEventListener("canplay", update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      video.removeEventListener("canplay", update);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [offset]);

  return (
    <video
      ref={ref}
      className={className ? `film ${className}` : "film"}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    >
      {/* WebM first — every Chromium build decodes VP9; Safari/iOS falls to H.264 mp4 */}
      <source src={src.replace(/\.mp4$/, ".webm")} type="video/webm" />
      <source src={src} type="video/mp4" />
    </video>
  );
}
