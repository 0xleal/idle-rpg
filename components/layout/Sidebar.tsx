'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { levelForXp, formatXp } from '@/lib/experience';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  skillId?: string;
  category?: 'skills' | 'game' | 'combat';
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: '🏠', category: 'game' },
  { href: '/skills/woodcutting', label: 'Woodcutting', icon: '🪓', skillId: 'woodcutting', category: 'skills' },
  { href: '/skills/mining', label: 'Mining', icon: '⛏️', skillId: 'mining', category: 'skills' },
  { href: '/skills/fishing', label: 'Fishing', icon: '🎣', skillId: 'fishing', category: 'skills' },
  { href: '/skills/smithing', label: 'Smithing', icon: '🔨', skillId: 'smithing', category: 'skills' },
  { href: '/skills/cooking', label: 'Cooking', icon: '🍳', skillId: 'cooking', category: 'skills' },
  { href: '/skills/fletching', label: 'Fletching', icon: '🏹', skillId: 'fletching', category: 'skills' },
  { href: '/skills/crafting', label: 'Crafting', icon: '🧵', skillId: 'crafting', category: 'skills' },
  { href: '/skills/farming', label: 'Farming', icon: '🌱', skillId: 'farming', category: 'skills' },
  { href: '/skills/prayer', label: 'Prayer', icon: '🙏', skillId: 'prayer', category: 'skills' },
  { href: '/skills/herblore', label: 'Herblore', icon: '⚗️', skillId: 'herblore', category: 'skills' },
  { href: '/inventory', label: 'Inventory', icon: '🎒', category: 'game' },
  { href: '/equipment', label: 'Equipment', icon: '🛡️', category: 'game' },
  { href: '/shop', label: 'Shop', icon: '🏪', category: 'game' },
  { href: '/combat', label: 'Combat', icon: '⚔️', category: 'combat' },
];

export function Sidebar() {
  const pathname = usePathname();
  const skills = useGameStore((state) => state.skills);
  const gold = useGameStore((state) => state.gold);
  const currentAction = useGameStore((state) => state.currentAction);

  const skillItems = navItems.filter((item) => item.category === 'skills');
  const gameItems = navItems.filter((item) => item.category === 'game');
  const combatItems = navItems.filter((item) => item.category === 'combat');

  const renderNavItem = (item: NavItem, index: number) => {
    const isActive =
      pathname === item.href ||
      (item.href !== '/' && pathname.startsWith(item.href));

    const skillLevel = item.skillId ? levelForXp(skills[item.skillId as keyof typeof skills].xp) : null;
    const isTraining = currentAction?.skillId === item.skillId;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
        style={{ animationDelay: `${index * 0.03}s` }}
      >
        <span className={`nav-icon ${isTraining ? 'animate-float' : ''}`}>
          {item.icon}
        </span>
        <span className="flex-1">{item.label}</span>
        {skillLevel !== null && (
          <span className={`text-xs font-medium ${isActive ? 'text-[var(--accent-gold)]' : 'text-[var(--text-muted)]'}`}>
            {skillLevel}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
      {/* Logo */}
      <div className="p-5 border-b border-[var(--border-subtle)]">
        <h1 className="font-[var(--font-cinzel)] text-xl font-bold tracking-wide text-gradient">
          Idle RPG
        </h1>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="text-[var(--accent-gold)]">💰</span>
          <span className="font-medium text-[var(--text-primary)]">
            {formatXp(gold)}
          </span>
          <span className="text-[var(--text-muted)]">gold</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        {/* Dashboard */}
        <div className="mb-4">
          {gameItems
            .filter((item) => item.href === '/')
            .map((item, i) => renderNavItem(item, i))}
        </div>

        {/* Skills Section */}
        <div className="section-header">
          <span className="section-title">Skills</span>
          <span className="section-line" />
        </div>
        <div className="mb-4 flex flex-col gap-0.5">
          {skillItems.map((item, i) => renderNavItem(item, i))}
        </div>

        {/* Combat Section */}
        <div className="section-header">
          <span className="section-title">Combat</span>
          <span className="section-line" />
        </div>
        <div className="mb-4 flex flex-col gap-0.5">
          {combatItems.map((item, i) => renderNavItem(item, i))}
        </div>

        {/* Game Section */}
        <div className="section-header">
          <span className="section-title">Game</span>
          <span className="section-line" />
        </div>
        <div className="flex flex-col gap-0.5">
          {gameItems
            .filter((item) => item.href !== '/')
            .map((item, i) => renderNavItem(item, i))}
        </div>
      </nav>

      {/* Current Action Indicator */}
      {currentAction && (
        <div className="p-3 border-t border-[var(--border-subtle)]">
          <div className="action-banner">
            <div className="text-xs text-[var(--text-muted)] mb-1">Training</div>
            <div className="text-sm font-medium text-[var(--accent-gold)] capitalize">
              {currentAction.skillId}
            </div>
            <div className="progress-bar mt-2">
              <div
                className="progress-fill progress-xp"
                style={{
                  width: `${(currentAction.elapsedMs / currentAction.duration) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
