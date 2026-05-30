import { useState, useEffect, useCallback } from 'react';
import { Box, Text, Group, Stack, Button, ActionIcon, Title } from '@mantine/core';
import { IconArrowLeft, IconEdit, IconTrash, IconStar, IconStarFilled } from '@tabler/icons-react';
import { BarcodeDisplay } from '../components/BarcodeDisplay';
import { FullScreenBarcode } from '../components/FullScreenBarcode';
import { AddCardForm } from '../components/AddCardForm';
import { getCardById, deleteCard, toggleFavorite, updateCard } from '../db';
import { navigate } from '../router';
import { tokens } from '../theme';
import type { LoyaltyCard, CardFormData } from '../types';

interface CardDetailsProps {
  cardId: string;
}

export function CardDetails({ cardId }: CardDetailsProps) {
  const [card, setCard] = useState<LoyaltyCard | null>(null);
  const [showFullBarcode, setShowFullBarcode] = useState(false);
  const [editOpened, setEditOpened] = useState(false);

  const loadCard = useCallback(async () => {
    const result = await getCardById(cardId);
    setCard(result ?? null);
  }, [cardId]);

  useEffect(() => {
    loadCard();
  }, [loadCard]);

  async function handleDelete() {
    await deleteCard(cardId);
    navigate('dashboard');
  }

  async function handleToggleFavorite() {
    await toggleFavorite(cardId);
    await loadCard();
  }

  async function handleEdit(data: CardFormData) {
    await updateCard(cardId, data);
    setEditOpened(false);
    await loadCard();
  }

  if (!card) {
    return (
      <Box p="lg">
        <Text c={tokens.colors.secondaryText}>Card not found</Text>
      </Box>
    );
  }

  if (showFullBarcode) {
    return (
      <FullScreenBarcode
        value={card.barcode}
        format={card.barcodeFormat}
        cardName={card.name}
        onClose={() => setShowFullBarcode(false)}
      />
    );
  }

  return (
    <Box component="section" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <Group px="lg" py="md" justify="space-between">
        <Group gap="md">
          <ActionIcon
            variant="subtle"
            onClick={() => navigate('dashboard')}
            style={{ color: tokens.colors.primaryText }}
            aria-label="Back to dashboard"
          >
            <IconArrowLeft size={24} />
          </ActionIcon>
          <Title
            order={2}
            fw={500}
            style={{ fontSize: '18px', color: tokens.colors.primaryText }}
          >
            Card Details
          </Title>
        </Group>
        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            onClick={handleToggleFavorite}
            style={{ color: card.isFavorite ? tokens.colors.favorite : tokens.colors.secondaryText }}
            aria-label="Toggle favorite"
          >
            {card.isFavorite ? <IconStarFilled size={20} /> : <IconStar size={20} />}
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            onClick={() => setEditOpened(true)}
            style={{ color: tokens.colors.primaryText }}
            aria-label="Edit card"
          >
            <IconEdit size={20} />
          </ActionIcon>
        </Group>
      </Group>

      {/* Card visual */}
      <Box px="lg" mb="xl">
        <Box
          p="xl"
          style={{
            backgroundColor: tokens.colors.surface,
            borderRadius: 16,
            border: `1px solid ${tokens.colors.elevated}`,
          }}
        >
          <Group justify="space-between" align="flex-start" mb="lg">
            <Stack gap={4}>
              <Text
                size="xs"
                tt="uppercase"
                fw={500}
                style={{ color: tokens.colors.secondaryText, letterSpacing: '0.05em', fontSize: '11px' }}
              >
                Loyalty Member
              </Text>
              <Text
                fw={600}
                style={{
                  fontSize: '20px',
                  color: tokens.colors.primaryText,
                  letterSpacing: '-0.01em',
                }}
              >
                {card.name}
              </Text>
            </Stack>
            <Box
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                backgroundColor: card.color,
              }}
            />
          </Group>
          <Group justify="space-between" align="flex-end">
            <Stack gap={2}>
              <Text size="xs" style={{ color: tokens.colors.secondaryText }}>
                Category
              </Text>
              <Text size="sm" tt="capitalize" c={tokens.colors.primaryText}>
                {card.category}
              </Text>
            </Stack>
            <Stack gap={2} align="flex-end">
              <Text
                fw={600}
                style={{ fontSize: '32px', lineHeight: 1.2, color: tokens.colors.primaryText }}
              >
                {card.points.toLocaleString()}
              </Text>
              <Text size="xs" style={{ color: tokens.colors.secondaryText }}>
                points
              </Text>
            </Stack>
          </Group>
        </Box>
      </Box>

      {/* Barcode */}
      <Box px="lg" mb="xl">
        <BarcodeDisplay
          value={card.barcode}
          format={card.barcodeFormat}
          height={100}
          onClick={() => setShowFullBarcode(true)}
        />
        <Text
          size="xs"
          ta="center"
          mt="xs"
          style={{ color: tokens.colors.secondaryText }}
        >
          Tap barcode to enlarge for scanning
        </Text>
      </Box>

      {/* Actions */}
      <Stack gap="sm" px="lg">
        <Button
          fullWidth
          onClick={handleDelete}
          leftSection={<IconTrash size={18} />}
          variant="outline"
          styles={{
            root: {
              borderColor: tokens.colors.error,
              color: tokens.colors.error,
              height: 48,
            },
          }}
        >
          Remove Card
        </Button>
      </Stack>

      <AddCardForm
        opened={editOpened}
        onClose={() => setEditOpened(false)}
        onSave={handleEdit}
        initialData={card}
        title="Edit Card"
      />
    </Box>
  );
}
