import { useState, useEffect, useCallback } from 'react';
import { Box, TextInput, Stack, Group, ScrollArea, Text, Title } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { CardPreview } from '../components/CardPreview';
import { CategoryChip } from '../components/CategoryChip';
import { searchCards, getAllCards, getCardsByCategory } from '../db';
import { navigate } from '../router';
import { tokens } from '../theme';
import type { LoyaltyCard, CardCategory } from '../types';

export function Search() {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [cards, setCards] = useState<LoyaltyCard[]>([]);
  const [activeCategory, setActiveCategory] = useState<CardCategory | 'all'>('all');

  const loadCards = useCallback(async () => {
    let result: LoyaltyCard[];
    if (debouncedQuery.trim()) {
      result = await searchCards(debouncedQuery);
    } else if (activeCategory === 'all') {
      result = await getAllCards();
    } else {
      result = await getCardsByCategory(activeCategory);
    }
    if (debouncedQuery.trim() && activeCategory !== 'all') {
      result = result.filter((c) => c.category === activeCategory);
    }
    setCards(result);
  }, [debouncedQuery, activeCategory]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const categories: Array<CardCategory | 'all'> = ['all', 'retail', 'grocery', 'fuel', 'pharmacy', 'other'];

  return (
    <Box component="section" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <Box px="lg" pt="md" pb="xs">
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
          Search
        </Title>
      </Box>

      {/* Search bar */}
      <Box px="lg" pt="sm" pb="sm" style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: tokens.colors.background }}>
        <TextInput
          placeholder="Search cards or categories..."
          leftSection={<IconSearch size={18} color={tokens.colors.outline} />}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          autoFocus
          aria-label="Search cards"
          styles={{
            input: {
              backgroundColor: tokens.colors.surface,
              borderColor: tokens.colors.outlineVariant,
              color: tokens.colors.primaryText,
              height: 48,
              borderRadius: 12,
            },
          }}
        />
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

      {/* Results */}
      <Stack gap="md" px="lg">
        {cards.length === 0 && (
          <Box py="xl" style={{ textAlign: 'center' }}>
            <Text c={tokens.colors.secondaryText} size="md">
              {query.trim() ? 'No cards found' : 'No cards yet'}
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
    </Box>
  );
}
