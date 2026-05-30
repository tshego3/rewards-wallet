import { UnstyledButton, Text } from '@mantine/core';
import { tokens } from '../theme';
import type { CardCategory } from '../types';

interface CategoryChipProps {
  category: CardCategory | 'all';
  active: boolean;
  onClick: () => void;
}

const LABELS: Record<CardCategory | 'all', string> = {
  all: 'All Cards',
  retail: 'Retail',
  grocery: 'Grocery',
  fuel: 'Fuel',
  pharmacy: 'Pharmacy',
  other: 'Other',
};

export function CategoryChip({ category, active, onClick }: CategoryChipProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: tokens.radius.full,
        backgroundColor: active ? tokens.colors.accent : tokens.colors.elevated,
        whiteSpace: 'nowrap',
        transition: 'background-color 200ms ease',
        minHeight: 44,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Text
        size="xs"
        fw={500}
        style={{
          color: active ? tokens.colors.onPrimary : tokens.colors.secondaryText,
          fontSize: '13px',
          letterSpacing: '0.02em',
        }}
      >
        {LABELS[category]}
      </Text>
    </UnstyledButton>
  );
}
