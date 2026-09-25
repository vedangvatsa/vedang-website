/** Short source names derived from the archived indicator's provider metadata. */
export function sourceCredit(metadata) {
  const source = metadata?.sourceOrganization?.trim();
  if (!source) throw new Error('Indicator metadata has no source organization');
  // This joint dataset already has a concise published name.
  if (/Tracking SDG 7/i.test(source)) return 'Tracking SDG 7';
  const names = [];
  const add = (pattern, label) => { if (pattern.test(source)) names.push(label); };
  add(/UN Population Division|United Nations Population Division|World Population Prospects|World Urbanization Prospects/i, 'UN Population Division');
  add(/International Labour Organization|\bILO\b/, 'ILO');
  add(/International Telecommunication Union|\bITU\b/, 'ITU');
  add(/Food and Agriculture Organization|\bFAO\b|FAOSTAT/, 'FAO');
  add(/World Health Organization|\bWHO\b/, 'WHO');
  add(/UNESCO|UN Educational, Scientific and Cultural Organization/, 'UNESCO');
  add(/World Intellectual Property Organization|\bWIPO\b/, 'WIPO');
  add(/International Monetary Fund|\bIMF\b/, 'IMF');
  add(/International Energy Agency|\bIEA\b/, 'IEA');
  add(/International Civil Aviation Organization|\bICAO\b/, 'ICAO');
  add(/International Union of Railways|\bUIC\b/, 'UIC');
  add(/UN Conference on Trade and Development|\bUNCTAD\b/, 'UNCTAD');
  add(/Eurostat/, 'Eurostat');
  add(/UN Statistics Division|United Nations Statistics Division/, 'UN Statistics Division');
  add(/Organisation for Economic Co-operation and Development|\bOECD\b/, 'OECD');
  add(/World Bank|\bWB\b/, 'World Bank');
  const nationalStats = /national statistical|country official statistics/i.test(source);
  const centralBanks = /central banks?/i.test(source);
  if (nationalStats) names.push(centralBanks ? 'national statistics and central banks' : 'national statistics');
  else if (centralBanks) names.push('central banks');
  if (!names.length) throw new Error(`Unrecognized provider metadata for ${metadata.id || 'indicator'}; supply an accurate source label`);
  return names.join(', ');
}
