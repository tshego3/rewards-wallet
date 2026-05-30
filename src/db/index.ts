import { openDB, IDBPDatabase } from 'idb';
import type { LoyaltyCard, CardFormData, CardCategory } from '../types';

const DB_NAME = 'rewards-wallet-db';
const DB_VERSION = 1;
const STORE_NAME = 'cards';

interface RewardsWalletDB {
  cards: {
    key: string;
    value: LoyaltyCard;
    indexes: {
      'by-category': CardCategory;
      'by-name': string;
      'by-favorite': number;
    };
  };
}

let dbInstance: IDBPDatabase<RewardsWalletDB> | null = null;

async function getDb(): Promise<IDBPDatabase<RewardsWalletDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<RewardsWalletDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      store.createIndex('by-category', 'category');
      store.createIndex('by-name', 'name');
      store.createIndex('by-favorite', 'isFavorite');
    },
  });

  return dbInstance;
}

function generateId(): string {
  return crypto.randomUUID();
}

export async function getAllCards(): Promise<LoyaltyCard[]> {
  const db = await getDb();
  return db.getAll(STORE_NAME);
}

export async function getCardById(id: string): Promise<LoyaltyCard | undefined> {
  const db = await getDb();
  return db.get(STORE_NAME, id);
}

export async function addCard(data: CardFormData): Promise<LoyaltyCard> {
  const db = await getDb();
  const now = Date.now();
  const card: LoyaltyCard = {
    id: generateId(),
    ...data,
    isFavorite: false,
    createdAt: now,
    updatedAt: now,
  };
  await db.put(STORE_NAME, card);
  return card;
}

export async function updateCard(id: string, data: Partial<CardFormData>): Promise<LoyaltyCard | undefined> {
  const db = await getDb();
  const existing = await db.get(STORE_NAME, id);
  if (!existing) return undefined;

  const updated: LoyaltyCard = {
    ...existing,
    ...data,
    updatedAt: Date.now(),
  };
  await db.put(STORE_NAME, updated);
  return updated;
}

export async function deleteCard(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE_NAME, id);
}

export async function toggleFavorite(id: string): Promise<LoyaltyCard | undefined> {
  const db = await getDb();
  const card = await db.get(STORE_NAME, id);
  if (!card) return undefined;

  const updated: LoyaltyCard = {
    ...card,
    isFavorite: !card.isFavorite,
    updatedAt: Date.now(),
  };
  await db.put(STORE_NAME, updated);
  return updated;
}

export async function getCardsByCategory(category: CardCategory): Promise<LoyaltyCard[]> {
  const db = await getDb();
  return db.getAllFromIndex(STORE_NAME, 'by-category', category);
}

export async function searchCards(query: string): Promise<LoyaltyCard[]> {
  const db = await getDb();
  const all = await db.getAll(STORE_NAME);
  const lower = query.toLowerCase();
  return all.filter((card) => card.name.toLowerCase().includes(lower));
}

export async function exportData(): Promise<string> {
  const cards = await getAllCards();
  return JSON.stringify(cards, null, 2);
}

export async function importData(json: string): Promise<number> {
  const db = await getDb();
  const parsed: unknown = JSON.parse(json);

  if (!Array.isArray(parsed)) {
    throw new Error('Invalid import data: expected an array');
  }

  const validCards: LoyaltyCard[] = [];
  for (const item of parsed) {
    if (isValidCard(item)) {
      validCards.push(item);
    }
  }

  if (validCards.length === 0) {
    throw new Error('No valid cards found in import data');
  }

  const tx = db.transaction(STORE_NAME, 'readwrite');
  for (const card of validCards) {
    await tx.store.put(card);
  }
  await tx.done;
  return validCards.length;
}

const VALID_CATEGORIES: readonly string[] = ['retail', 'grocery', 'fuel', 'pharmacy', 'other'];
const VALID_FORMATS: readonly string[] = ['EAN13', 'CODE128'];

function isValidCard(data: unknown): data is LoyaltyCard {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;

  return (
    typeof obj['id'] === 'string' &&
    typeof obj['name'] === 'string' &&
    typeof obj['barcode'] === 'string' &&
    typeof obj['color'] === 'string' &&
    typeof obj['category'] === 'string' &&
    VALID_CATEGORIES.includes(obj['category'] as string) &&
    typeof obj['barcodeFormat'] === 'string' &&
    VALID_FORMATS.includes(obj['barcodeFormat'] as string) &&
    typeof obj['points'] === 'number' &&
    typeof obj['isFavorite'] === 'boolean' &&
    typeof obj['createdAt'] === 'number' &&
    typeof obj['updatedAt'] === 'number'
  );
}

export async function clearAllData(): Promise<void> {
  const db = await getDb();
  await db.clear(STORE_NAME);
}
