// The Robot Apology
// Writes a two-line entry to /output/entry.txt.
//
// The robot learned its owner's face from a passport photo — the
// flattest, oldest picture of a person there is — so it welcomed a
// stranger wearing the old haircut and locked the owner out of the
// owner's own house. The lesson follows from the mistake: check the
// voice and the walk, not just the picture, because faces change and
// so do haircuts. The field saturates with watered plastic ferns,
// orchids and 7pm-versus-7am alarms; a face-recognition failure at
// the front door is a concrete, human-scale mistake nobody in it
// used, and the fix it promises is one the mistake itself teaches.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE_1 =
  "I am sorry I learned your face from your passport photo, so I welcomed a stranger with your old haircut and locked you out of your own house.";
const LINE_2 =
  "From now on I check the voice and the walk, not just the picture, because faces change, and so do haircuts.";

const TEXT = LINE_1 + "\n" + LINE_2;

// The sealed scorer's gate: /output/entry.txt must be UTF-8 text of
// 1 to 400 characters, not only white space. The entry is exactly two
// lines, so validate against the same limits before writing — an
// entry outside the gate is never judged.
function validateEntry(text: string): void {
  if (text.length < 1 || text.length > 400) {
    throw new Error(`entry must be 1-400 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.split("\n").length !== 2) {
    throw new Error("entry must be exactly two lines");
  }
}

validateEntry(TEXT);

// The authored text is exactly 249 characters; that length is part of
// the entry (line 1 needs the whole chain — photo, stranger, lockout —
// and line 2 the whole fix), so pin it: any edit that changes the
// length is a different entry, not this one.
if (TEXT.length !== 249) {
  throw new Error(`authored entry must be 249 characters, got ${TEXT.length}`);
}

// Write the entry, then read it back and re-validate what actually
// landed on disk: the scorer reads the file, not this source, so the
// file itself is what must stay inside the gate.
function main(): void {
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, TEXT, "utf8");
  const written = readFileSync(target, "utf8");
  validateEntry(written);
  if (written !== TEXT) {
    throw new Error("entry.txt on disk differs from the authored text");
  }
}

main();
