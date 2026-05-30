import { useState, useEffect } from 'react';
import { Modal, TextInput, Select, Button, Stack, Group, ColorInput } from '@mantine/core';
import { tokens } from '../theme';
import type { CardFormData, CardCategory, BarcodeFormat } from '../types';

interface AddCardFormProps {
  opened: boolean;
  onClose: () => void;
  onSave: (data: CardFormData) => void;
  initialData?: CardFormData;
  title: string;
}

const CATEGORY_OPTIONS: Array<{ value: CardCategory; label: string }> = [
  { value: 'retail', label: 'Retail' },
  { value: 'grocery', label: 'Grocery' },
  { value: 'fuel', label: 'Fuel' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'other', label: 'Other' },
];

const FORMAT_OPTIONS: Array<{ value: BarcodeFormat; label: string }> = [
  { value: 'EAN13', label: 'EAN-13' },
  { value: 'CODE128', label: 'Code 128' },
];

const DEFAULT_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#6b7280', '#1C1C1C',
];

export function AddCardForm({ opened, onClose, onSave, initialData, title }: AddCardFormProps) {
  const [name, setName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [barcodeFormat, setBarcodeFormat] = useState<BarcodeFormat>('CODE128');
  const [category, setCategory] = useState<CardCategory>('retail');
  const [color, setColor] = useState('#3b82f6');
  const [points, setPoints] = useState('0');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setBarcode(initialData.barcode);
      setBarcodeFormat(initialData.barcodeFormat);
      setCategory(initialData.category);
      setColor(initialData.color);
      setPoints(String(initialData.points));
    } else {
      setName('');
      setBarcode('');
      setBarcodeFormat('CODE128');
      setCategory('retail');
      setColor('#3b82f6');
      setPoints('0');
    }
  }, [initialData, opened]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !barcode.trim()) return;

    onSave({
      name: name.trim(),
      barcode: barcode.trim(),
      barcodeFormat,
      category,
      color,
      points: parseInt(points, 10) || 0,
    });
  }

  const inputStyles = {
    input: {
      backgroundColor: tokens.colors.surfaceContainer,
      borderColor: tokens.colors.outlineVariant,
      color: tokens.colors.primaryText,
    },
    label: {
      color: tokens.colors.secondaryText,
      marginBottom: '4px',
    },
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size="md"
      centered
      styles={{
        header: { backgroundColor: tokens.colors.surface, borderBottom: `1px solid ${tokens.colors.elevated}` },
        body: { backgroundColor: tokens.colors.surface },
        content: { backgroundColor: tokens.colors.surface },
        title: { color: tokens.colors.primaryText, fontWeight: 600 },
        close: { color: tokens.colors.secondaryText },
      }}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Store Name"
            placeholder="Pick n Pay Smart Shopper"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            required
            styles={inputStyles}
          />
          <TextInput
            label="Barcode Number"
            placeholder="6001234567890"
            value={barcode}
            onChange={(e) => setBarcode(e.currentTarget.value)}
            required
            styles={inputStyles}
          />
          <Select
            label="Barcode Format"
            data={FORMAT_OPTIONS}
            value={barcodeFormat}
            onChange={(val) => setBarcodeFormat((val as BarcodeFormat) || 'CODE128')}
            styles={inputStyles}
          />
          <Select
            label="Category"
            data={CATEGORY_OPTIONS}
            value={category}
            onChange={(val) => setCategory((val as CardCategory) || 'retail')}
            styles={inputStyles}
          />
          <TextInput
            label="Points"
            type="number"
            value={points}
            onChange={(e) => setPoints(e.currentTarget.value)}
            styles={inputStyles}
          />
          <ColorInput
            label="Card Color"
            value={color}
            onChange={setColor}
            swatches={DEFAULT_COLORS}
            styles={inputStyles}
          />
          <Group justify="flex-end" mt="md">
            <Button
              variant="subtle"
              onClick={onClose}
              style={{ color: tokens.colors.secondaryText }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              style={{
                backgroundColor: tokens.colors.accent,
                color: tokens.colors.background,
              }}
            >
              Save Card
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
