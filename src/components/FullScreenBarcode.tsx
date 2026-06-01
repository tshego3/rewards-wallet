import { useEffect, useRef, useCallback } from 'react';
import { Box, UnstyledButton, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import JsBarcode from 'jsbarcode';
import { tokens } from '../theme';
import type { BarcodeFormat } from '../types';

interface FullScreenBarcodeProps {
  value: string;
  format: BarcodeFormat;
  cardName: string;
  onClose: () => void;
}

export function FullScreenBarcode({ value, format, cardName, onClose }: FullScreenBarcodeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    try {
      JsBarcode(svgRef.current, value, {
        format: format === 'EAN13' ? 'EAN13' : 'CODE128',
        width: 3,
        height: 160,
        displayValue: true,
        background: tokens.barcode.background,
        lineColor: tokens.barcode.lineColor,
        margin: 24,
        fontSize: 18,
        font: 'Inter',
      });
    } catch {
      // Invalid barcode
    }
  }, [value, format]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return (
    <Box
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: tokens.barcode.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: tokens.spacing.lg,
      }}
    >
      <UnstyledButton
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          width: 44,
          height: 44,
          borderRadius: '50%',
          backgroundColor: tokens.colors.background,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Close full-screen barcode"
      >
        <IconX size={24} color={tokens.colors.accent} />
      </UnstyledButton>

      <svg ref={svgRef} style={{ width: '100%', maxWidth: '600px' }} />

      <Text
        mt="lg"
        size="lg"
        fw={500}
        style={{ color: tokens.colors.background, textAlign: 'center' }}
      >
        {cardName}
      </Text>
      <Text size="sm" style={{ color: tokens.colors.secondaryText, textAlign: 'center', marginTop: 4 }}>
        Present this barcode at checkout
      </Text>
    </Box>
  );
}
