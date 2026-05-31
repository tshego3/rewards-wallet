import { lazy, Suspense } from 'react';
import { Box, UnstyledButton, Text, Stack, Title, Group } from '@mantine/core';
import { IconHome, IconSearch, IconSettings } from '@tabler/icons-react';
import { useRouter } from './router';
import { navigate } from './router';
import { tokens } from './theme';
import type { Screen } from './types';

const Dashboard = lazy(() => import('./screens/Dashboard').then(m => ({ default: m.Dashboard })));
const CardDetails = lazy(() => import('./screens/CardDetails').then(m => ({ default: m.CardDetails })));
const Search = lazy(() => import('./screens/Search').then(m => ({ default: m.Search })));
const Settings = lazy(() => import('./screens/Settings').then(m => ({ default: m.Settings })));

function AppContent() {
  const route = useRouter();

  switch (route.screen) {
    case 'dashboard':
      return <Dashboard />;
    case 'details':
      return <CardDetails cardId={route.cardId ?? ''} />;
    case 'search':
      return <Search />;
    case 'settings':
      return <Settings />;
    case 'add':
      return <Dashboard />;
    case 'edit':
      return <Dashboard />;
    default:
      return <Dashboard />;
  }
}

interface NavItemProps {
  icon: typeof IconHome;
  label: string;
  screen: Screen;
  active: boolean;
}

function NavItem({ icon: Icon, label, screen, active }: NavItemProps) {
  return (
    <UnstyledButton
      onClick={() => navigate(screen)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 24px',
        borderRadius: tokens.radius.full,
        backgroundColor: active ? tokens.colors.elevated : 'transparent',
        transition: 'background-color 200ms ease',
        minWidth: 64,
        minHeight: 44,
      }}
    >
      <Icon size={22} color={active ? tokens.colors.primaryText : tokens.colors.secondaryText} />
      <Text
        size="xs"
        mt={4}
        fw={500}
        style={{
          color: active ? tokens.colors.primaryText : tokens.colors.secondaryText,
          fontSize: '11px',
        }}
      >
        {label}
      </Text>
    </UnstyledButton>
  );
}

export function App() {
  const route = useRouter();

  const activeTab = (() => {
    switch (route.screen) {
      case 'search':
        return 'search';
      case 'settings':
        return 'settings';
      default:
        return 'dashboard';
    }
  })();

  return (
    <Box
      style={{
        minHeight: '100dvh',
        backgroundColor: tokens.colors.background,
        color: tokens.colors.primaryText,
      }}
    >
      {/* Skip to content link for keyboard users */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLElement).style.position = 'fixed';
          (e.currentTarget as HTMLElement).style.top = '8px';
          (e.currentTarget as HTMLElement).style.left = '8px';
          (e.currentTarget as HTMLElement).style.width = 'auto';
          (e.currentTarget as HTMLElement).style.height = 'auto';
          (e.currentTarget as HTMLElement).style.overflow = 'visible';
          (e.currentTarget as HTMLElement).style.zIndex = '9999';
          (e.currentTarget as HTMLElement).style.padding = '8px 16px';
          (e.currentTarget as HTMLElement).style.backgroundColor = tokens.colors.accent;
          (e.currentTarget as HTMLElement).style.color = tokens.colors.background;
          (e.currentTarget as HTMLElement).style.borderRadius = tokens.radius.sm;
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLElement).style.position = 'absolute';
          (e.currentTarget as HTMLElement).style.left = '-9999px';
          (e.currentTarget as HTMLElement).style.width = '1px';
          (e.currentTarget as HTMLElement).style.height = '1px';
          (e.currentTarget as HTMLElement).style.overflow = 'hidden';
        }}
      >
        Skip to content
      </a>

      {/* Main content area - offset for desktop sidebar */}
      <Box
        component="main"
        id="main-content"
        ml={{ base: 0, md: 240 }}
        style={{ minHeight: '100dvh' }}
      >
        <Suspense fallback={null}>
          <AppContent />
        </Suspense>
      </Box>

      {/* Bottom navigation - mobile only */}
      <Box
        component="nav"
        aria-label="Main navigation"
        hiddenFrom="md"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: tokens.colors.surfaceContainer,
          borderTop: `1px solid ${tokens.colors.elevated}`,
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: 72,
        }}
      >
        <NavItem icon={IconHome} label="Home" screen="dashboard" active={activeTab === 'dashboard'} />
        <NavItem icon={IconSearch} label="Search" screen="search" active={activeTab === 'search'} />
        <NavItem icon={IconSettings} label="Settings" screen="settings" active={activeTab === 'settings'} />
      </Box>

      {/* Desktop sidebar - shown on larger screens */}
      <Box
        component="nav"
        aria-label="Main navigation"
        visibleFrom="md"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 240,
          backgroundColor: tokens.colors.surface,
          borderRight: `1px solid ${tokens.colors.elevated}`,
          padding: '24px 0',
          zIndex: 50,
        }}
      >
        <Group gap="sm" px="lg" mb="xl" wrap="nowrap">
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" width={24} height={24} />
          <Title
            order={1}
            fw={600}
            style={{
              fontSize: '20px',
              color: tokens.colors.primaryText,
              letterSpacing: '-0.01em',
            }}
          >
            Rewards Wallet
          </Title>
        </Group>
        <Stack gap={0}>
          <DesktopNavItem icon={IconHome} label="Home" screen="dashboard" active={activeTab === 'dashboard'} />
          <DesktopNavItem icon={IconSearch} label="Search" screen="search" active={activeTab === 'search'} />
          <DesktopNavItem icon={IconSettings} label="Settings" screen="settings" active={activeTab === 'settings'} />
        </Stack>
      </Box>
    </Box>
  );
}

interface DesktopNavItemProps {
  icon: typeof IconHome;
  label: string;
  screen: Screen;
  active: boolean;
}

function DesktopNavItem({ icon: Icon, label, screen, active }: DesktopNavItemProps) {
  return (
    <UnstyledButton
      onClick={() => navigate(screen)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 24px',
        minHeight: 44,
        borderLeft: active ? `2px solid ${tokens.colors.accent}` : '2px solid transparent',
        backgroundColor: active ? tokens.colors.elevated : 'transparent',
        transition: 'background-color 200ms ease',
      }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = tokens.colors.elevated;
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
      }}
    >
      <Icon size={20} color={active ? tokens.colors.accent : tokens.colors.secondaryText} />
      <Text
        size="sm"
        fw={active ? 500 : 400}
        style={{ color: active ? tokens.colors.accent : tokens.colors.secondaryText }}
      >
        {label}
      </Text>
    </UnstyledButton>
  );
}
