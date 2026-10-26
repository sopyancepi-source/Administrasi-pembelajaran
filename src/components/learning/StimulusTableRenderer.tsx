import React from 'react';

export interface ParsedTable {
  headers: string[];
  rows: string[][];
}

/**
 * Parses raw tabular text (pipe-separated, tab-separated, or markdown format)
 * into a structured headers array and 2D rows array.
 */
export function parseTableText(raw?: string): ParsedTable | null {
  if (!raw || typeof raw !== 'string') return null;

  const lines = raw
    .trim()
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 0) return null;

  // Determine separator: pipe '|' is primary, fallback to tab '\t'
  let sep = '|';
  if (!lines[0].includes('|') && lines[0].includes('\t')) {
    sep = '\t';
  }

  const parsedRows: string[][] = [];

  for (const line of lines) {
    // Skip markdown divider lines like |---|---| or |:---:|
    if (/^[|\s\-:]+$/.test(line)) continue;

    let cells = line.split(sep).map(c => c.trim());

    // If line had leading and trailing pipe like | A | B |, split produces empty first and last elements
    if (cells.length > 2 && cells[0] === '' && cells[cells.length - 1] === '') {
      cells = cells.slice(1, -1);
    } else {
      if (cells.length > 1 && cells[0] === '') cells = cells.slice(1);
      if (cells.length > 1 && cells[cells.length - 1] === '') cells = cells.slice(0, -1);
    }

    if (cells.length > 0) {
      parsedRows.push(cells);
    }
  }

  if (parsedRows.length === 0) return null;
  // If only 1 row or single cell without columns
  if (parsedRows.length === 1 && parsedRows[0].length <= 1) return null;

  const headers = parsedRows[0];
  const rows = parsedRows.slice(1);

  // Pad or align row cells if some rows are shorter than headers
  const normalizedRows = rows.map(r => {
    if (r.length < headers.length) {
      const padded = [...r];
      while (padded.length < headers.length) padded.push('-');
      return padded;
    }
    return r;
  });

  return { headers, rows: normalizedRows };
}

/**
 * Checks if a cell value represents a currency, number, quantity, or short index
 * so we can align it logically (e.g. right-aligned for currency/numbers, center for No).
 */
export function getCellAlignment(header: string, cell: string): 'left' | 'center' | 'right' {
  const normHeader = (header || '').trim().toLowerCase();
  const trimmed = (cell || '').trim();

  // Column header indicates sequence or code
  if (normHeader === 'no' || normHeader === 'no.' || normHeader === 'nomor' || normHeader === 'kode') {
    return 'center';
  }

  // Pure integer / short code (1, 2, A, B)
  if (/^\d{1,4}$/.test(trimmed) || /^[A-E]$/i.test(trimmed)) {
    return 'center';
  }

  // Indonesian Currency or Numeric values with units (Rp, kg, gram, orang, siswa, %, etc.)
  if (/^Rp\.?\s*[\d.,]+/i.test(trimmed)) {
    return 'right';
  }

  if (/^[\d.,]+\s*(kg|g|gram|cm|m|meter|buah|butir|orang|siswa|kantong|lembar|derajat|%|hari|tahun)/i.test(trimmed)) {
    return 'right';
  }

  return 'left';
}

/**
 * Generates clean, standard HTML markup for Microsoft Word (.doc MHTML) export.
 * Word natively understands <table> with border-collapse and inline border styles.
 */
export function renderStimulusTableToWordHtml(raw?: string, fontSzPt = 9): string {
  if (!raw) return '';
  const parsed = parseTableText(raw);

  if (!parsed) {
    return `<div style="margin: 4pt 0 6pt 0; padding: 4pt 6pt; background-color: #f8fafc; border: 1pt solid #cbd5e1; font-family: 'Times New Roman', serif; font-size: ${fontSzPt}pt; line-height: 1.4;">${raw.replace(/\n/g, '<br/>')}</div>`;
  }

  const { headers, rows } = parsed;

  const thHtml = headers
    .map(h => {
      const normH = h.trim().toLowerCase();
      const isCenter = normH === 'no' || normH === 'no.' || normH.length <= 3;
      return `<th style="border: 1pt solid #1e293b; background-color: #f1f5f9; padding: 4pt 7pt; font-weight: bold; font-size: ${fontSzPt}pt; text-align: ${isCenter ? 'center' : 'left'}; color: #0f172a; vertical-align: middle;">${h}</th>`;
    })
    .join('');

  const trHtml = rows
    .map((row, rIdx) => {
      const bg = rIdx % 2 === 1 ? 'background-color: #f8fafc;' : 'background-color: #ffffff;';
      const tdHtml = headers
        .map((h, cIdx) => {
          const val = row[cIdx] || '';
          const align = getCellAlignment(h, val);
          return `<td style="border: 1pt solid #475569; padding: 3.5pt 7pt; font-size: ${fontSzPt}pt; text-align: ${align}; color: #0f172a; vertical-align: middle;">${val}</td>`;
        })
        .join('');
      return `<tr style="${bg}">${tdHtml}</tr>`;
    })
    .join('');

  return `
    <table style="border-collapse: collapse; width: auto; min-width: 65%; max-width: 100%; margin: 5pt 0 7pt 0; font-family: 'Times New Roman', Times, serif; font-size: ${fontSzPt}pt; border: 1.2pt solid #1e293b;">
      <thead>
        <tr>${thHtml}</tr>
      </thead>
      <tbody>
        ${trHtml}
      </tbody>
    </table>
  `;
}

interface StimulusTableRendererProps {
  tableText?: string;
  title?: string;
  compact?: boolean;
  className?: string;
  isExamPaper?: boolean;
}

/**
 * StimulusTableRenderer Component
 * Renders raw table data string as an authentic, high-quality, professional school exam table.
 */
export default function StimulusTableRenderer({
  tableText,
  title,
  compact = false,
  className = '',
  isExamPaper = false
}: StimulusTableRendererProps) {
  if (!tableText) return null;

  const parsed = parseTableText(tableText);

  if (!parsed) {
    return (
      <div className={`my-1 text-xs font-sans text-slate-800 ${className}`}>
        {tableText}
      </div>
    );
  }

  const { headers, rows } = parsed;

  return (
    <div className={`my-2 select-text overflow-x-auto ${className}`}>
      {title && (
        <div className="font-bold text-xs sm:text-sm text-slate-900 mb-1">
          {title}
        </div>
      )}
      <table className="w-auto min-w-[65%] max-w-full border-collapse text-left font-sans text-slate-900 border border-slate-600 print:border-black">
        <thead>
          <tr className="bg-slate-100 print:bg-slate-200 border-b border-slate-600 print:border-black">
            {headers.map((h, i) => {
              const normH = h.trim().toLowerCase();
              const isCenter = normH === 'no' || normH === 'no.' || normH.length <= 3;
              return (
                <th
                  key={i}
                  className={`border border-slate-600 print:border-black font-bold text-slate-900 print:text-black ${
                    compact ? 'px-2 py-1 text-[10.5px]' : 'px-3 py-1.5 text-xs'
                  } ${isCenter ? 'text-center w-12' : 'text-left'}`}
                >
                  {h}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr
              key={rIdx}
              className={rIdx % 2 === 1 ? 'bg-slate-50/60 print:bg-white' : 'bg-white'}
            >
              {headers.map((h, cIdx) => {
                const val = row[cIdx] || '';
                const align = getCellAlignment(h, val);
                return (
                  <td
                    key={cIdx}
                    className={`border border-slate-600 print:border-black ${
                      compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'
                    } ${
                      align === 'center'
                        ? 'text-center font-medium'
                        : align === 'right'
                        ? 'text-right font-medium tabular-nums'
                        : 'text-left'
                    }`}
                  >
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
