export const TEAM_BRAND_MAP: Record<string, { primary: string; secondary: string; nickname: string }> = {
  ARS: { primary: '#EF0107', secondary: '#FFFFFF', nickname: 'The Gunners' },
  AVL: { primary: '#95BFE5', secondary: '#670E36', nickname: 'Villans' },
  BOU: { primary: '#DA291C', secondary: '#fffbfb', nickname: 'The Cherries' },
  BRE: { primary: '#E30613', secondary: '#FBB800', nickname: 'The Bees' },
  BHA: { primary: '#0057B8', secondary: '#FFCD00', nickname: 'The Seagulls' },
  CHE: { primary: '#034694', secondary: '#EE242C', nickname: 'The Blues' },
  COV: { primary: '#00A3E0', secondary: '#1D2A44', nickname: 'The Sky Blues' },
  CRY: { primary: '#1B458F', secondary: '#C4122D', nickname: 'The Eagles' },
  EVE: { primary: '#003399', secondary: '#FFFFFF', nickname: 'The Toffees' },
  FUL: { primary: '#1A1A1A', secondary: '#CC0000', nickname: 'The Cottagers' },
  HUL: { primary: '#F5A800', secondary: '#1A1A1A', nickname: 'The Tigers' },
  IPS: { primary: '#00539F', secondary: '#D31145', nickname: 'The Tractor Boys' },
  LEE: { primary: '#FFCD00', secondary: '#1D428A', nickname: 'The Whites' },
  LIV: { primary: '#C8102E', secondary: '#00B2A9', nickname: 'The Reds' },
  MCI: { primary: '#6CABDD', secondary: '#1C2C5B', nickname: 'City / Cityzens' },
  MUN: { primary: '#DA291C', secondary: '#FBE122', nickname: 'The Red Devils' },
  NEW: { primary: '#241F20', secondary: '#41B6E6', nickname: 'The Magpies' },
  NFO: { primary: '#DD0000', secondary: '#FFFFFF', nickname: 'Forest' },
  TOT: { primary: '#132257', secondary: '#FFFFFF', nickname: 'Spurs' },
  SUN: { primary: '#EB172B', secondary: '#1A1A1A', nickname: 'The Black Cats' },
};

// Known star / marquee players to prioritize for news and spotlighting
export const STAR_PLAYERS_KEYWORDS = new Set([
  'haaland', 'saka', 'salah', 'palmer', 'son', 'de bruyne', 'alexander-arnold',
  'fernandes', 'watkins', 'odegaard', 'foden', 'rice', 'saliba', 'van dijk',
  'alisson', 'raya', 'martinelli', 'israel', 'cherki', 'groß', 'de cuyper',
  'joão pedro', 'gvardiol', 'tarkowski', 'mbeumo', 'bowen', 'rodri', 'rashford',
  'mainoo', 'eze', 'gordon', 'bruno guimarães', 'diaz', 'szoboszlai'
]);
