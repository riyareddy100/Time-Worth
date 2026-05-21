import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Screenshot Cleaner — Remove mobile status bars instantly" },
      {
        name: "description",
        content:
          "Drop a mobile screenshot, we auto-detect and crop the status bar. Clean image in one click.",
      },
    ],
  }),
});

type Result = {
  originalUrl: string;
  cleanedUrl: string;
  cleanedBlob: Blob;
  width: number;
  height: number;
  cropped: number;
};

async function detectAndCrop(file: File): Promise<Result> {
  const originalUrl = URL.createObjectURL(file);
  const img = await loadImage(originalUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  const cropY = detectStatusBarHeight(ctx, canvas.width, canvas.height);

  const out = document.createElement("canvas");
  out.width = canvas.width;
  out.height = canvas.height - cropY;
  const octx = out.getContext("2d")!;
  octx.drawImage(canvas, 0, cropY, canvas.width, out.height, 0, 0, canvas.width, out.height);

  const cleanedBlob: Blob = await new Promise((res) =>
    out.toBlob((b) => res(b!), "image/png"),
  );
  const cleanedUrl = URL.createObjectURL(cleanedBlob);

  return {
    originalUrl,
    cleanedUrl,
    cleanedBlob,
    width: out.width,
    height: out.height,
    cropped: cropY,
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

// Heuristic: scan rows top-down. A status bar row tends to have a stable
// background with small icon clusters. Find the first row that "looks like
// content" (high variance across the full width) after the status bar zone.
function detectStatusBarHeight(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
): number {
  // Cap search to top 15% of image
  const maxScan = Math.min(Math.floor(h * 0.15), 300);
  const data = ctx.getImageData(0, 0, w, maxScan).data;

  // Sample background color from very top edges
  const bg = sampleCorner(data, w);

  let lastBgRow = 0;
  for (let y = 0; y < maxScan; y++) {
    let bgCount = 0;
    const step = Math.max(1, Math.floor(w / 40));
    let samples = 0;
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      if (colorClose(data[i], data[i + 1], data[i + 2], bg)) bgCount++;
      samples++;
    }
    // Status bar rows: mostly background with a few icon pixels
    if (bgCount / samples > 0.55) {
      lastBgRow = y;
    } else if (y > 10 && lastBgRow > 0) {
      // Found first dense content row after status bar
      break;
    }
  }

  // Add small padding
  if (lastBgRow === 0) return 0;
  return Math.min(lastBgRow + 2, Math.floor(h * 0.15));
}

function sampleCorner(data: Uint8ClampedArray, w: number) {
  // Average a few pixels at top-left and top-right
  const pts = [
    [2, 2],
    [w - 3, 2],
    [10, 5],
    [w - 11, 5],
  ];
  let r = 0,
    g = 0,
    b = 0;
  for (const [x, y] of pts) {
    const i = (y * w + x) * 4;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  return [r / pts.length, g / pts.length, b / pts.length] as const;
}

function colorClose(r: number, g: number, b: number, bg: readonly [number, number, number]) {
  return (
    Math.abs(r - bg[0]) < 18 && Math.abs(g - bg[1]) < 18 && Math.abs(b - bg[2]) < 18
  );
}

function Index() {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const r = await detectAndCrop(file);
      setResult(r);
    } catch {
      setError("Couldn't process that image.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.cleanedUrl;
    a.download = "cleaned.png";
    a.click();
  };

  const reset = () => {
    if (result) {
      URL.revokeObjectURL(result.originalUrl);
      URL.revokeObjectURL(result.cleanedUrl);
    }
    setResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-neutral-900" />
          <span className="text-sm font-semibold tracking-tight">Screenshot Cleaner</span>
        </div>
        <a
          href="https://github.com"
          className="text-xs text-neutral-500 hover:text-neutral-900"
        >
          v1.0
        </a>
      </header>

      <section className="mx-auto max-w-3xl px-6 pt-8 pb-16 text-center">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Remove mobile status bars.
          <br />
          <span className="text-neutral-400">Instantly.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-pretty text-base text-neutral-500">
          Drop a screenshot. We detect the status bar and crop it out. Download the clean image.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        {!result && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={[
              "group relative flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-neutral-50 px-6 py-16 transition-all",
              dragging
                ? "border-neutral-900 bg-neutral-100 scale-[1.005]"
                : "border-neutral-200 hover:border-neutral-400 hover:bg-neutral-100",
            ].join(" ")}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-neutral-200">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v12" />
                <path d="m7 8 5-5 5 5" />
                <path d="M5 21h14" />
              </svg>
            </div>
            <p className="text-base font-medium">
              {loading ? "Processing…" : "Drop your screenshot here"}
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              or click to browse — PNG, JPG, WEBP
            </p>
            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Preview label="Before" url={result.originalUrl} />
              <Preview label="After" url={result.cleanedUrl} highlight />
            </div>
            <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4 sm:flex-row">
              <p className="text-sm text-neutral-600">
                Cropped <span className="font-medium text-neutral-900">{result.cropped}px</span> from
                top · Output {result.width}×{result.height}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={reset}
                  className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
                >
                  New image
                </button>
                <button
                  onClick={download}
                  className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
                >
                  Download PNG
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 grid grid-cols-1 gap-8 text-sm sm:grid-cols-3">
          <Feature
            title="Auto detection"
            desc="Scans the top edge of your image and finds where the status bar ends."
          />
          <Feature
            title="Runs locally"
            desc="Everything happens in your browser. Your screenshots never leave your device."
          />
          <Feature
            title="Mobile friendly"
            desc="Works just as well on your phone — paste a screenshot and clean it on the go."
          />
        </div>
      </section>

      <footer className="border-t border-neutral-100 py-8 text-center text-xs text-neutral-400">
        Built for clean screenshots.
      </footer>
    </main>
  );
}

function Preview({
  label,
  url,
  highlight,
}: {
  label: string;
  url: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          {label}
        </span>
        {highlight && (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-600">
            Cleaned
          </span>
        )}
      </div>
      <div
        className={[
          "overflow-hidden rounded-xl border bg-neutral-50",
          highlight ? "border-neutral-300" : "border-neutral-200",
        ].join(" ")}
      >
        <img src={url} alt={label} className="h-auto w-full object-contain" />
      </div>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h3 className="font-medium text-neutral-900">{title}</h3>
      <p className="mt-1 text-neutral-500">{desc}</p>
    </div>
  );
}
