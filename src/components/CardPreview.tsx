import { Paper, Group, Text, Stack, UnstyledButton } from '@mantine/core';
import { tokens } from '../theme';
import type { LoyaltyCard } from '../types';

interface CardPreviewProps {
  card: LoyaltyCard;
  onClick: () => void;
}

export function CardPreview({ card, onClick }: CardPreviewProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        width: '100%',
      }}
    >
      <Paper
        p="lg"
        radius="lg"
        style={{
          backgroundColor: tokens.colors.surface,
          border: `1px solid ${tokens.colors.elevated}`,
          transition: 'border-color 200ms ease, transform 150ms ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = tokens.colors.outlineVariant;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = tokens.colors.elevated;
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        }}
        onMouseDown={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)';
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        }}
      >
        <Group justify="space-between" wrap="nowrap">
          <Group gap="md" wrap="nowrap">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                backgroundColor: card.color,
                flexShrink: 0,
              }}
            />
            <Stack gap={4}>
              <Text size="md" fw={500} c={tokens.colors.primaryText} lineClamp={1}>
                {card.name}
              </Text>
              <Text
                size="xs"
                tt="uppercase"
                fw={500}
                style={{
                  color: tokens.colors.secondaryText,
                  letterSpacing: '0.02em',
                  fontSize: '11px',
                }}
              >
                {card.category}
              </Text>
            </Stack>
          </Group>
          <Stack gap={2} align="flex-end">
            <Text size="xl" fw={600} c={tokens.colors.primaryText}>
              {card.points.toLocaleString()}
            </Text>
            <Text size="xs" c={tokens.colors.secondaryText}>
              pts
            </Text>
          </Stack>
        </Group>
      </Paper>
    </UnstyledButton>
  );
}
