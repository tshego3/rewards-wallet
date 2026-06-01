import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { tokens } from '../theme';
import type { BarcodeFormat } from '../types';

interface BarcodeDisplayProps {
  value: string;
  format: BarcodeFormat;
  height?: number;
  onClick?: () => void;
}

export function BarcodeDisplay({ value, format, height = 80, onClick }: BarcodeDisplayProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    try {
      JsBarcode(svgRef.current, value, {
        format: format === 'EAN13' ? 'EAN13' : 'CODE128',
        width: 2,
        height,
        displayValue: true,
        background: tokens.barcode.background,
        lineColor: tokens.barcode.lineColor,
        margin: 16,
        fontSize: 14,
        font: 'Inter',
      });
    } catch {
      if (svgRef.current) {
        svgRef.current.replaceChildren();
      }
    }
  }, [value, format, height]);

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
      style={{
        backgroundColor: tokens.barcode.background,
        borderRadius: tokens.radius.md,
        padding: tokens.spacing.md,
        cursor: onClick ? 'pointer' : 'default',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg ref={svgRef} style={{ width: '100%', maxWidth: '400px' }} />
    </div>
  );
}
