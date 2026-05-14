import { marked } from 'marked';
const md = `
> **The Privacy Stack for Ambient Intelligence**
> | Layer | Requirement |
> |-------|-------------|
> | Sensing | On-device processing; no raw audio/video transmitted |
`;
console.log(marked.parse(md));
