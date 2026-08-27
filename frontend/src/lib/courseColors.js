// Deterministic accent color per course, based on id — gives each course card
// a bit of visual variety without needing the user to pick a color.
const PALETTE = [
  { bar: 'bg-gold', text: 'text-gold', ring: 'border-gold/30', soft: 'bg-gold/10' },
  { bar: 'bg-mint', text: 'text-mint', ring: 'border-mint/30', soft: 'bg-mint/10' },
  { bar: 'bg-amber', text: 'text-amber', ring: 'border-amber/30', soft: 'bg-amber/10' },
  { bar: 'bg-rose', text: 'text-rose', ring: 'border-rose/30', soft: 'bg-rose/10' },
];

export function courseAccent(id) {
  return PALETTE[id % PALETTE.length];
}