/** PascalCase component name → kebab-case filename stem */
export function componentToSlug(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

const KEEP = new Set([
  'Figure',
  'Stat',
  'StatRow',
  'Callout',
  'PullQuote',
  'KeyTakeaway',
  'ResearchPaper',
  'Columns',
  'Column',
  'Timeline',
  'TimelineItem',
  'SectionLabel',
  'Table',
  'XEmbed',
  'ZoomableImage',
]);

export function isEssayChartComponent(name) {
  return !KEEP.has(name);
}

export function humanizeAlt(name) {
  const words = componentToSlug(name).replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}