import { useState, useEffect, useCallback } from 'react';
import { Stack, Box, ActionIcon, Title, Text, Group, ScrollArea } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { CardPreview } from '../components/CardPreview';
import { CategoryChip } from '../components/CategoryChip';
import { AddCardForm } from '../components/AddCardForm';
import { getAllCards, addCard, getCardsByCategory } from '../db';
import { navigate } from '../router';
import { tokens } from '../theme';
import type { LoyaltyCard, CardFormData, CardCategory } from '../types';

export function Dashboard() {
  const [cards, setCards] = useState<LoyaltyCard[]>([]);
  const [activeCategory, setActiveCategory] = useState<CardCategory | 'all'>('all');
  const [addFormOpened, setAddFormOpened] = useState(false);

  const loadCards = useCallback(async () => {
    const result =
      activeCategory === 'all' ? await getAllCards() : await getCardsByCategory(activeCategory);
    // Sort favorites first, then by updatedAt descending
    result.sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) return b.isFavorite ? 1 : -1;
      return b.updatedAt - a.updatedAt;
    });
    setCards(result);
  }, [activeCategory]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  async function handleAddCard(data: CardFormData) {
    await addCard(data);
    setAddFormOpened(false);
    await loadCards();
  }

  const categories: Array<CardCategory | 'all'> = ['all', 'retail', 'grocery', 'fuel', 'pharmacy', 'other'];

  return (
    <Box component="section" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <Box px="lg" py="md">
        <Title
          order={1}
          fw={600}
          style={{
            fontSize: '24px',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: tokens.colors.primaryText,
          }}
        >
          Rewards Wallet
        </Title>
      </Box>

      {/* Category chips */}
      <ScrollArea type="never" offsetScrollbars={false}>
        <Group gap="sm" px="lg" pb="md" wrap="nowrap">
          {categories.map((cat) => (
            <CategoryChip
              key={cat}
              category={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </Group>
      </ScrollArea>

      {/* Card list */}
      <Stack gap="md" px="lg">
        {cards.length === 0 && (
          <Box py="xl" style={{ textAlign: 'center' }}>
            <Text c={tokens.colors.secondaryText} size="md">
              No cards yet. Tap + to add your first card.
            </Text>
          </Box>
        )}
        {cards.map((card) => (
          <CardPreview
            key={card.id}
            card={card}
            onClick={() => navigate('details', card.id)}
          />
        ))}
      </Stack>

      {/* FAB - no shadow per Rule 5.11, use tonal elevation */}
      <ActionIcon
        size={56}
        radius="xl"
        onClick={() => setAddFormOpened(true)}
        style={{
          position: 'fixed',
          bottom: 96,
          right: 24,
          zIndex: 50,
          backgroundColor: tokens.colors.accent,
          color: tokens.colors.background,
        }}
        aria-label="Add new card"
      >
        <IconPlus size={24} />
      </ActionIcon>

      <AddCardForm
        opened={addFormOpened}
        onClose={() => setAddFormOpened(false)}
        onSave={handleAddCard}
        title="Add New Card"
      />
    </Box>
  );
}
