import { AppState, GameMetadata } from './types';

export const GAMES: GameMetadata[] = [
  {
    id: AppState.GAME_MARIO,
    title: "Super Plumber Odyssey",
    icon: "🍄",
    color: "from-red-500 to-red-700"
  },
  {
    id: AppState.GAME_POKEMON,
    title: "Pocket Monsters: Red",
    icon: "🔥",
    color: "from-orange-500 to-red-600"
  },
  {
    id: AppState.GAME_RACING,
    title: "Kart Legends 8",
    icon: "🏎️",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: AppState.GAME_FIGHTER,
    title: "Street Brawler II",
    icon: "🥊",
    color: "from-yellow-500 to-orange-600"
  }
];

export const KEYBOARD_MAP: Record<string, string> = {
  'ArrowUp': 'UP',
  'ArrowDown': 'DOWN',
  'ArrowLeft': 'LEFT',
  'ArrowRight': 'RIGHT',
  'w': 'UP',
  's': 'DOWN',
  'a': 'LEFT',
  'd': 'RIGHT',
  'l': 'A',
  'k': 'B',
  'i': 'X',
  'j': 'Y',
  'Enter': 'PLUS',
  'Backspace': 'MINUS',
  'h': 'HOME',
  'c': 'CAPTURE',
  'q': 'L',
  'e': 'R'
};