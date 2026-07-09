'use client';

import { useState, useCallback } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Plus, Trash2, Download, ChevronDown, X } from 'lucide-react';

/* ─── Types ─── */
type ProfileKey = 'hashtag-web3' | 'vedang-vatsa' | 'custom';

interface Item { id: string; description: string; quantity: number; rate: number }
interface Profile { label: string; name: string; address: string; logo: string; notes: string }

const PROFILES: Record<ProfileKey, Profile> = {
  'hashtag-web3': {
    label: 'Hashtag Web3',
    name: 'Hashtag Web3',
    address: 'Level 39, Marina Bay Financial Centre Tower 2\n10 Marina Boulevard\nSingapore 018983',
    logo: 'https://hashtagweb3.com/logo/HashtagWeb3.png',
    notes: 'Please use this ETH/ USDC/ USDT (ERC 20) or MATIC/ USDC (Polygon) address for payment:\n\n0xe249f9c23721f30F975e38Ac19848B3268fABd3C',
  },
  'vedang-vatsa': {
    label: 'Vedang Ratan Vatsa',
    name: 'Vedang Ratan Vatsa',
    address: 'L-601, Antriksh Golf View.1, Sector-78,\nNoida, Gautam Buddha Nagar,\nUttar Pradesh, 201301\n\nGST Number: 09AOVPV3257P1ZM',
    logo: '',
    notes: 'Beneficiary Name: Vedang Ratan Vatsa\nBeneficiary Account Number: 2746203813\nBank Name: Kotak Mahindra Bank\nBank IFSC code: KKBK0005042\nBank Swift Code: KKBKINBB',
  },
  custom: { label: 'Custom', name: '', address: '', logo: '', notes: '' },
};

const CURRENCIES = [
  { code: 'USD', sym: '$' }, { code: 'EUR', sym: '€' }, { code: 'GBP', sym: '£' },
  { code: 'INR', sym: '₹' }, { code: 'SGD', sym: 'S$' },
] as const;

const today = () => new Date().toISOString().split('T')[0];
const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function InvoicePage() {
  const [profileKey, setProfileKey] = useState<ProfileKey>('hashtag-web3');
  const [fromName, setFromName] = useState(PROFILES['hashtag-web3'].name);
  const [fromAddress, setFromAddress] = useState(PROFILES['hashtag-web3'].address);
  const [fromLogo, setFromLogo] = useState(PROFILES['hashtag-web3'].logo);
  const [billTo, setBillTo] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
  const [invoiceDate, setInvoiceDate] = useState(today());
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [items, setItems] = useState<Item[]>([{ id: '1', description: '', quantity: 1, rate: 0 }]);
  const [notes, setNotes] = useState(PROFILES['hashtag-web3'].notes);
  const [showTax, setShowTax] = useState(false);
  const [taxLabel, setTaxLabel] = useState('Tax');
  const [taxRate, setTaxRate] = useState(0);

  const sym = CURRENCIES.find((c) => c.code === currency)?.sym ?? '$';

  const switchProfile = useCallback((key: ProfileKey) => {
    setProfileKey(key);
    const p = PROFILES[key];
    setFromName(p.name); setFromAddress(p.address); setFromLogo(p.logo); setNotes(p.notes);
  }, []);

  const addItem = useCallback(() => setItems((p) => [...p, { id: String(Date.now()), description: '', quantity: 1, rate: 0 }]), []);
  const removeItem = useCallback((id: string) => setItems((p) => p.length === 1 ? p : p.filter((i) => i.id !== id)), []);
  const updateItem = useCallback((id: string, f: keyof Item, v: string | number) => setItems((p) => p.map((i) => i.id === id ? { ...i, [f]: v } : i)), []);

  const subtotal = items.reduce((s, i) => s + i.quantity * i.rate, 0);
  const taxAmt = showTax ? subtotal * (taxRate / 100) : 0;
  const total = subtotal + taxAmt;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="inv-no-print"><Header /></div>
      <main id="main" className="flex-grow py-4 sm:py-8">
        <div className="content-width">

          {/* ── Title ── */}
          <div className="text-center mb-4 sm:mb-6 inv-no-print">
            <h1 className="text-xl sm:text-3xl font-semibold tracking-tight">Invoice Generator</h1>
          </div>

          {/* ── Toolbar ── */}
          <div className="inv-no-print mb-3 sm:mb-6 flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 p-2 sm:p-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Sel value={profileKey} onChange={(v) => switchProfile(v as ProfileKey)} className="flex-1 sm:flex-none sm:w-48">
                {Object.entries(PROFILES).map(([k, p]) => <option key={k} value={k}>{p.label}</option>)}
              </Sel>
              <Sel value={currency} onChange={setCurrency} className="w-[82px] sm:w-24">
                {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.sym} {c.code}</option>)}
              </Sel>
            </div>
            <button onClick={() => window.print()} className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs sm:text-sm font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-all">
              <Download className="h-3.5 w-3.5" /> PDF
            </button>
          </div>

          {/* ── Invoice sheet ── */}
          <div className="inv-sheet rounded-lg border border-border bg-white">
            <div className="inv-body p-4 sm:p-10">

              {/* Header: From + Meta */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 pb-5 sm:pb-8 border-b border-border/50">
                <div className="flex-1 min-w-0">
                  {fromLogo && (
                    <img src={fromLogo} alt={`${fromName} logo`} className="h-8 sm:h-10 w-auto object-contain mb-2" />
                  )}
                  <input className="block w-full font-semibold text-base sm:text-lg bg-transparent outline-none placeholder:text-muted-foreground/40" value={fromName} onChange={(e) => setFromName(e.target.value)} placeholder="Your name or company" aria-label="From name" />
                  <textarea className="mt-1 block w-full text-xs sm:text-sm text-muted-foreground bg-transparent outline-none placeholder:text-muted-foreground/40 resize-none leading-relaxed" value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} rows={3} placeholder="Your address" aria-label="From address" />
                </div>
                <div className="sm:text-right shrink-0 sm:w-48">
                  <h2 className="text-xl sm:text-3xl font-extralight tracking-wider text-muted-foreground/40 uppercase mb-2 sm:mb-4">Invoice</h2>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <MR label="#"><input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="w-full sm:w-28 text-right bg-transparent outline-none tabular-nums" aria-label="Invoice number" /></MR>
                    <MR label="Date"><input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="w-full sm:w-28 text-right bg-transparent outline-none tabular-nums" aria-label="Invoice date" /></MR>
                    <MR label="Due"><span className="relative inline-flex items-center"><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full sm:w-28 text-right bg-transparent outline-none tabular-nums" aria-label="Due date" />{dueDate && <button onClick={() => setDueDate('')} className="inv-no-print absolute -right-4 text-muted-foreground/40 hover:text-destructive" aria-label="Clear due date"><X className="h-3 w-3" /></button>}</span></MR>
                  </div>
                </div>
              </div>

              {/* Bill To — single field */}
              <div className="py-5 sm:py-8">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1">Bill To</p>
                <textarea className="block w-full sm:max-w-sm text-xs sm:text-sm bg-transparent outline-none placeholder:text-muted-foreground/40 resize-none leading-relaxed" value={billTo} onChange={(e) => setBillTo(e.target.value)} rows={3} placeholder={"Client name & address"} aria-label="Bill to" />
              </div>

              {/* ── Line items ── */}
              <div className="pb-5 sm:pb-8">
                {/* Desktop header */}
                <div className="hidden sm:grid grid-cols-[1fr_90px_60px_100px_28px] gap-2 px-2 py-1.5 rounded bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Description</span><span className="text-right">Rate</span><span className="text-right">Qty</span><span className="text-right">Amount</span><span className="inv-no-print" />
                </div>

                {/* Desktop rows */}
                <div className="hidden sm:block divide-y divide-border/30">
                  {items.map((item) => (
                    <div key={item.id} className="group grid grid-cols-[1fr_90px_60px_100px_28px] gap-2 px-2 py-2 items-center">
                      <textarea className="w-full text-sm bg-transparent outline-none placeholder:text-muted-foreground/40 resize-none" placeholder="Description" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} rows={1} aria-label="Description" />
                      <input type="number" className="w-full text-sm text-right bg-transparent outline-none tabular-nums" value={item.rate || ''} onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} placeholder="0" aria-label="Rate" />
                      <input type="number" className="w-full text-sm text-right bg-transparent outline-none tabular-nums" value={item.quantity || ''} onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} placeholder="1" aria-label="Qty" />
                      <span className="text-sm font-medium tabular-nums text-right">{sym}{fmt(item.quantity * item.rate)}</span>
                      <button onClick={() => removeItem(item.id)} className="inv-no-print p-0.5 text-muted-foreground/20 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100" aria-label="Remove"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>

                {/* Mobile rows */}
                <div className="sm:hidden space-y-2 mt-2">
                  {items.map((item, idx) => (
                    <div key={item.id} className="rounded-md border border-border/50 p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <input className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground/40" placeholder={`Item ${idx + 1} description`} value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} aria-label="Description" />
                        <button onClick={() => removeItem(item.id)} className="p-1 -mr-1 -mt-0.5 text-muted-foreground/30 hover:text-destructive" aria-label="Remove"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <input type="number" inputMode="decimal" className="w-20 rounded border border-input bg-background px-2 py-1.5 text-right outline-none tabular-nums text-xs" value={item.rate || ''} onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} placeholder="Rate" aria-label="Rate" />
                        <span className="text-muted-foreground/40">×</span>
                        <input type="number" inputMode="decimal" className="w-14 rounded border border-input bg-background px-2 py-1.5 text-right outline-none tabular-nums text-xs" value={item.quantity || ''} onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} placeholder="Qty" aria-label="Qty" />
                        <span className="ml-auto text-sm font-medium tabular-nums">{sym}{fmt(item.quantity * item.rate)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={addItem} className="inv-no-print mt-2 sm:px-2 inline-flex items-center gap-1 text-xs sm:text-sm text-muted-foreground hover:text-foreground active:scale-[0.97] transition-all py-1.5">
                  <Plus className="h-3.5 w-3.5" /> Add item
                </button>
              </div>

              {/* ── Footer: Notes + Totals — pushed to bottom in print via .inv-footer ── */}
              <div className="inv-footer flex flex-col-reverse sm:flex-row justify-between gap-5 sm:gap-8 pt-4 sm:pt-6 border-t border-border">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1">Notes / Payment Details</p>
                  <textarea className="w-full text-xs sm:text-sm text-muted-foreground bg-transparent outline-none placeholder:text-muted-foreground/40 resize-none leading-relaxed" value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} placeholder="Payment instructions..." aria-label="Notes" />
                </div>
                <div className="sm:w-48 shrink-0 text-sm">
                  <div className="flex justify-between text-muted-foreground py-1">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{sym}{fmt(subtotal)}</span>
                  </div>

                  {showTax ? (
                    <div className="flex items-center justify-between text-muted-foreground py-1 gap-1">
                      <div className="flex items-center gap-0.5 min-w-0">
                        <input className="w-10 bg-transparent outline-none text-sm" value={taxLabel} onChange={(e) => setTaxLabel(e.target.value)} aria-label="Tax label" />
                        <input type="number" inputMode="decimal" className="w-8 bg-transparent outline-none text-right tabular-nums text-sm" value={taxRate || ''} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} aria-label="Tax %" />
                        <span className="text-muted-foreground/40 text-xs">%</span>
                        <button onClick={() => { setShowTax(false); setTaxRate(0); }} className="inv-no-print ml-0.5 p-0.5 text-muted-foreground/30 hover:text-destructive" aria-label="Remove tax"><X className="h-3 w-3" /></button>
                      </div>
                      <span className="tabular-nums shrink-0">{sym}{fmt(taxAmt)}</span>
                    </div>
                  ) : (
                    <button onClick={() => setShowTax(true)} className="inv-no-print text-xs text-muted-foreground/40 hover:text-foreground transition-colors py-0.5">+ Add tax</button>
                  )}

                  <div className="flex justify-between font-bold py-1.5 mt-1 border-t-2 border-foreground text-base sm:text-lg">
                    <span>Total</span>
                    <span className="tabular-nums">{sym}{fmt(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="inv-no-print"><Footer /></div>
    </div>
  );
}

/* ── Helpers ── */
function Sel({ value, onChange, className, children }: { value: string; onChange: (v: string) => void; className?: string; children: React.ReactNode }) {
  return (
    <div className={`relative ${className ?? ''}`}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none w-full rounded-md border border-input bg-background px-2.5 py-2 pr-7 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-ring/30">
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
    </div>
  );
}

function MR({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between sm:justify-end gap-2">
      <span className="text-muted-foreground/50 font-medium uppercase tracking-wider text-[10px] sm:text-[11px] shrink-0">{label}</span>
      {children}
    </div>
  );
}
