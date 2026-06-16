// Client-side document text extraction, run at upload time so the CLEAR Leverage
// pass can read the actual contents of uploaded files. Parsers are loaded with
// dynamic import() so these heavy deps land in their own chunk and never bloat the
// main bundle or the Puppeteer prerender of the marketing routes.

// Cap per-document text. renderIntake (edge) further slices to 20k/doc; this keeps
// rows and request payloads sane for large spreadsheets/PDFs.
const MAX_CHARS = 50_000;

function ext(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot === -1 ? "" : filename.slice(dot + 1).toLowerCase();
}

async function extractPdf(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default as string;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const parts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const items = content.items as Array<{ str?: string }>;
    parts.push(items.map((it) => it.str ?? "").join(" "));
  }
  return parts.join("\n");
}

async function extractDocx(file: File): Promise<string> {
  // The browser build avoids Node fs/path deps that break the Vite bundle. It's a
  // UMD bundle, so unwrap the CJS-interop `default` Vite may add around it.
  type Mammoth = { extractRawText: (o: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }> };
  const mod = (await import("mammoth/mammoth.browser.js")) as Mammoth & { default?: Mammoth };
  const mammoth = mod.default ?? mod;
  const res = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return res.value;
}

async function extractXlsx(file: File): Promise<string> {
  const XLSX = await import("xlsx");
  const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
  return wb.SheetNames.map(
    (name) => `# ${name}\n${XLSX.utils.sheet_to_csv(wb.Sheets[name])}`,
  ).join("\n\n");
}

/**
 * Best-effort extraction of plain text from an uploaded file. Returns null when the
 * type is unsupported or parsing fails — callers should treat null as "no text" and
 * keep going rather than failing the whole upload.
 */
export async function extractText(file: File): Promise<string | null> {
  try {
    let text: string;
    switch (ext(file.name)) {
      case "pdf":
        text = await extractPdf(file);
        break;
      case "docx":
        text = await extractDocx(file);
        break;
      case "xlsx":
      case "xls":
        text = await extractXlsx(file);
        break;
      case "txt":
      case "md":
      case "csv":
        text = await file.text();
        break;
      default:
        return null;
    }
    text = text.trim();
    return text ? text.slice(0, MAX_CHARS) : null;
  } catch {
    return null;
  }
}
