import { useState, useRef } from 'react';
import { Box, Text, Stack, Paper, Group, Button, Divider, Title } from '@mantine/core';
import { IconDownload, IconUpload, IconTrash, IconInfoCircle } from '@tabler/icons-react';
import { exportData, importData, clearAllData } from '../db';
import { tokens } from '../theme';

export function Settings() {
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleExport() {
    try {
      const json = await exportData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rewards-wallet-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMessage('Data exported successfully');
    } catch {
      setStatusMessage('Export failed');
    }
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const count = await importData(text);
      setStatusMessage(`Imported ${count} cards successfully`);
    } catch {
      setStatusMessage('Import failed - invalid file');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleClearAll() {
    if (window.confirm('Are you sure you want to delete all cards? This cannot be undone.')) {
      await clearAllData();
      setStatusMessage('All data cleared');
    }
  }

  const itemStyle = {
    backgroundColor: tokens.colors.surface,
    border: `1px solid ${tokens.colors.elevated}`,
  };

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
          Settings
        </Title>
      </Box>

      <Stack gap="md" px="lg">
        {/* Data Management */}
        <Text
          size="xs"
          fw={500}
          tt="uppercase"
          style={{ color: tokens.colors.secondaryText, letterSpacing: '0.05em', fontSize: '11px' }}
        >
          Data Management
        </Text>

        <Paper p="md" radius="md" style={itemStyle}>
          <Stack gap="md">
            <Button
              fullWidth
              variant="subtle"
              leftSection={<IconDownload size={18} />}
              justify="flex-start"
              onClick={handleExport}
              styles={{
                root: { color: tokens.colors.primaryText, height: 44 },
                inner: { justifyContent: 'flex-start' },
              }}
            >
              Export Data (JSON)
            </Button>
            <Divider color={tokens.colors.elevated} />
            <Button
              fullWidth
              variant="subtle"
              leftSection={<IconUpload size={18} />}
              justify="flex-start"
              onClick={handleImportClick}
              styles={{
                root: { color: tokens.colors.primaryText, height: 44 },
                inner: { justifyContent: 'flex-start' },
              }}
            >
              Import Data (JSON)
            </Button>
            <Divider color={tokens.colors.elevated} />
            <Button
              fullWidth
              variant="subtle"
              leftSection={<IconTrash size={18} />}
              justify="flex-start"
              onClick={handleClearAll}
              styles={{
                root: { color: tokens.colors.error, height: 44 },
                inner: { justifyContent: 'flex-start' },
              }}
            >
              Clear All Data
            </Button>
          </Stack>
        </Paper>

        {/* Status message */}
        {statusMessage && (
          <Text size="sm" ta="center" style={{ color: tokens.colors.secondaryText }}>
            {statusMessage}
          </Text>
        )}

        {/* About */}
        <Text
          size="xs"
          fw={500}
          tt="uppercase"
          mt="lg"
          style={{ color: tokens.colors.secondaryText, letterSpacing: '0.05em', fontSize: '11px' }}
        >
          About
        </Text>

        <Paper p="md" radius="md" style={itemStyle}>
          <Group gap="md">
            <IconInfoCircle size={20} color={tokens.colors.secondaryText} />
            <Stack gap={2}>
              <Text size="sm" c={tokens.colors.primaryText}>
                Rewards Wallet v1.0.0
              </Text>
              <Text size="xs" style={{ color: tokens.colors.secondaryText }}>
                Offline-first loyalty card manager. All data stored locally on your device.
              </Text>
            </Stack>
          </Group>
        </Paper>
      </Stack>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        aria-label="Import JSON file"
      />
    </Box>
  );
}
