// Shared Georgia "handbook" style for all Pseudodemocracy documents.
import {
  Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  ShadingType, BorderStyle, AlignmentType, LevelFormat, HeadingLevel, Footer, PageNumber,
} from 'docx'

const INK = '1F3A34', GOLD = 'B8912F', SHADE = 'EFE8D6', MUTED = '6B6B6B', HIGHLIGHT = 'F2DFA7';
const FONT = 'Georgia';
const W = 9026; // A4 content width with 1" margins (DXA)

// "Rich" text: **bold**, __highlighted amendable words__, _italic_
function runs(text, base = {}) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|__[^_]+__|_[^_]+_)/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(new TextRun({ text: text.slice(last, m.index), ...base }));
    const t = m[0];
    if (t.startsWith('**')) out.push(new TextRun({ text: t.slice(2, -2), bold: true, ...base }));
    else if (t.startsWith('__')) out.push(new TextRun({
      text: t.slice(2, -2), bold: true, color: INK, ...base,
      shading: { type: ShadingType.CLEAR, fill: HIGHLIGHT, color: 'auto' },
    }));
    else out.push(new TextRun({ text: t.slice(1, -1), italics: true, ...base }));
    last = m.index + t.length;
  }
  if (last < text.length) out.push(new TextRun({ text: text.slice(last), ...base }));
  return out;
}
const kids = (c, base) => (typeof c === 'string' ? runs(c, base) : c);

const p = (c, opts = {}) => new Paragraph({ spacing: { after: 120 }, ...opts, children: kids(c) });
const muted = (t) => new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: t, italics: true, color: MUTED })] });
const bullet = (c) => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { after: 80 }, children: kids(c) });

let listNo = 0;
const newList = () => { listNo++; };
const step = (c) => new Paragraph({ numbering: { reference: 'steps', level: 0, instance: listNo }, spacing: { after: 80 }, children: kids(c) });

const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, keepNext: true, children: [new TextRun(t)] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, children: [new TextRun(t)] });
const gap = () => new Paragraph({ spacing: { after: 60 }, children: [] });

const border = { style: BorderStyle.SINGLE, size: 4, color: 'CFC3A3' };
const borders = { top: border, bottom: border, left: border, right: border };
function cell(content, w, head, fill) {
  return new TableCell({
    width: { size: w, type: WidthType.DXA }, borders,
    shading: head || fill ? { type: ShadingType.CLEAR, fill: fill || SHADE, color: 'auto' } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ spacing: { after: 0 },
      children: head ? [new TextRun({ text: content, bold: true, color: INK })] : kids(content) })],
  });
}
function table(widths, header, rows) {
  return new Table({
    width: { size: widths.reduce((a, c) => a + c, 0), type: WidthType.DXA }, columnWidths: widths,
    rows: [
      ...(header ? [new TableRow({ tableHeader: true, cantSplit: true, children: header.map((h, k) => cell(h, widths[k], true)) })] : []),
      ...rows.map(r => new TableRow({ cantSplit: true, children: r.map((c, k) => cell(c, widths[k], false)) })),
    ],
  });
}
// A single shaded box (for callouts)
function box(paragraphs) {
  return new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [W],
    rows: [new TableRow({ cantSplit: true, children: [new TableCell({
      width: { size: W, type: WidthType.DXA },
      borders: { top: { style: BorderStyle.SINGLE, size: 12, color: GOLD }, bottom: { style: BorderStyle.SINGLE, size: 12, color: GOLD },
        left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }, right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' } },
      shading: { type: ShadingType.CLEAR, fill: 'F7F2E4', color: 'auto' },
      margins: { top: 140, bottom: 100, left: 200, right: 200 },
      children: paragraphs,
    })] })],
  });
}

function title(main, sub) {
  return [
    new Paragraph({ spacing: { before: 240, after: 60 }, children: [new TextRun({ text: main, bold: true, size: 48, color: INK, characterSpacing: 40 })] }),
    new Paragraph({ spacing: { after: 240 }, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: GOLD, space: 6 } },
      children: [new TextRun({ text: sub, italics: true, size: 24, color: MUTED })] }),
  ];
}

function makeDoc(docTitle, footerText, children) {
  return new Document({
    creator: 'SomunA', title: docTitle,
    styles: {
      default: { document: { run: { font: FONT, size: 22 }, paragraph: { spacing: { line: 276 } } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { font: FONT, size: 30, bold: true, color: INK },
          paragraph: { spacing: { before: 360, after: 140 }, outlineLevel: 0,
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 4 } } } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { font: FONT, size: 24, bold: true, italics: true, color: INK },
          paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
      ],
    },
    numbering: { config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 540, hanging: 270 } }, run: { color: GOLD } } }] },
      { reference: 'steps', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 540, hanging: 360 } }, run: { bold: true, color: INK } } }] },
    ] },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new TextRun({ text: `${footerText}  ·  `, size: 18, color: MUTED }),
        new TextRun({ children: [PageNumber.CURRENT], size: 18, color: MUTED }),
      ] })] }) },
      children,
    }],
  });
}

export { INK, GOLD, SHADE, MUTED, HIGHLIGHT, W, runs, p, muted, bullet, step, newList, h1, h2, gap, table, box, title, makeDoc, cell };
