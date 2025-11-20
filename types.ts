export enum ButtonType {
  A = 'A',
  B = 'B',
  X = 'X',
  Y = 'Y',
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  MINUS = 'MINUS',
  PLUS = 'PLUS',
  HOME = 'HOME',
  CAPTURE = 'CAPTURE',
  L = 'L',
  R = 'R',
  ZL = 'ZL',
  ZR = 'ZR',
  L3 = 'L3', // Stick click
  R3 = 'R3'  // Stick click
}

export enum AppState {
  HOME = 'HOME',
  GAME_MARIO = 'GAME_MARIO',
  GAME_POKEMON = 'GAME_POKEMON',
  GAME_RACING = 'GAME_RACING',
  GAME_FIGHTER = 'GAME_FIGHTER',
  SETTINGS = 'SETTINGS',
  SLEEP = 'SLEEP'
}

export interface GameMetadata {
  id: AppState;
  title: string;
  icon: string; // emoji or color
  color: string;
}