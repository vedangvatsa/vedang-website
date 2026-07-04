'use client';

import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  FileText,
  Sliders,
  ChevronDown,
  Gauge,
  Activity,
  User,
  Cpu,
  RefreshCw,
  BookOpen
} from 'lucide-react';

interface FeatureMeta {
  label: string;
  max: number;
  format: (v: number) => string;
}

const FEATURE_META: Record<string, FeatureMeta> = {
  'mtld': { label: 'Lexical Diversity (MTLD)', max: 150, format: (v) => v.toFixed(1) },
  'sent_cv': { label: 'Sentence Length Variation (CV)', max: 1.5, format: (v) => v.toFixed(2) },
  'char_entropy': { label: 'Character N-gram Entropy', max: 6.0, format: (v) => v.toFixed(2) },
  'rep_rate': { label: 'Within-Doc Word Repetition Rate', max: 1.0, format: (v) => `${(v * 100).toFixed(0)}%` },
  'punct_entropy': { label: 'Punctuation Entropy', max: 4.0, format: (v) => v.toFixed(2) },
  'self_mention_density': { label: 'First-Person Mentions (per 1k words)', max: 50, format: (v) => v.toFixed(1) },
  'connector_density': { label: 'Connector Words (per 1k words)', max: 40, format: (v) => v.toFixed(1) },
  'hedge_density': { label: 'Hedges / Qualifiers (per 1k words)', max: 30, format: (v) => v.toFixed(1) },
  'boost_density': { label: 'Boosters / Assertions (per 1k words)', max: 20, format: (v) => v.toFixed(1) },
  'mean_sent_len': { label: 'Mean Sentence Length (words)', max: 40, format: (v) => v.toFixed(1) },
  'opener_ratio': { label: 'Sentence-Opener Connector Ratio', max: 0.5, format: (v) => `${(v * 100).toFixed(0)}%` }
};

interface SentenceData {
  text: string;
  start: number;
  end: number;
  ai_probability: number;
}

interface NeuralSignals {
  perplexity: number;
  burstiness: number;
}

interface ModelAttribution {
  source_model: string;
  confidence: number;
}

interface AnalysisResults {
  ai_probability: number;
  register: string;
  register_confidence: number | null;
  is_ai: boolean;
  features: Record<string, number> | null;
  processing_time_ms: number;
  sentences: SentenceData[] | null;
  neural_signals: NeuralSignals | null;
  model_attribution: ModelAttribution | null;
  is_calibrated: boolean;
}

export default function AIDetector() {
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [register, setRegister] = useState('');
  const [apiUrl, setApiUrl] = useState('http://localhost:8000');
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'heatmap'>('edit');
  const [hoveredSentence, setHoveredSentence] = useState<SentenceData | null>(null);
  
  // Results State
  const [results, setResults] = useState<AnalysisResults | null>(null);

  // SVG Gauge Math
  const radius = 66;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (!text.trim()) {
      setWordCount(0);
      return;
    }
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
  }, [text]);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze.');
      return;
    }
    if (wordCount < 5) {
      setError('Text is too short. Please enter at least 5 words.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`${apiUrl.trim()}/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          register: register || null,
          return_features: true
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
      setActiveTab('heatmap'); // Auto-switch to heatmap view on successful analysis
    } catch (err: any) {
      setError(err.message || 'Failed to connect to the AI detector server. Ensure the backend API is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (prob: number) => {
    if (prob >= 0.7) return { text: 'text-destructive', stroke: 'hsl(var(--destructive))', bg: 'bg-destructive/10', border: 'border-destructive/20', badge: 'bg-destructive', label: 'AI Generated' };
    if (prob >= 0.35) return { text: 'text-amber-500', stroke: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/20', badge: 'bg-amber-500', label: 'Mixed / Uncertain' };
    return { text: 'text-emerald-500', stroke: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', badge: 'bg-emerald-500', label: 'Human Written' };
  };

  const getSentenceHighlightClass = (prob: number) => {
    if (prob >= 0.7) return 'bg-destructive/20 hover:bg-destructive/30 text-destructive-foreground dark:text-red-100 border-b-2 border-destructive/60 cursor-help transition-colors duration-150';
    if (prob >= 0.35) return 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-100 border-b-2 border-amber-500/60 cursor-help transition-colors duration-150';
    return 'bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-900 dark:text-emerald-100 cursor-help transition-colors duration-150';
  };

  const status = results ? getStatusColor(results.ai_probability) : null;

  return (
    <PageLayout>
      <PageHero 
        title="AI Text Detector"
        subtitle="Verify text authenticity with real-time sentence highlights, model attribution, and calibrated perplexity/burstiness."
      />

      <div className="space-y-8 pb-12 max-w-4xl mx-auto">
        {/* Settings Panel */}
        <div className="flex flex-col items-end">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors bg-muted/60 px-3 py-1.5 rounded-lg border border-border"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>API Settings</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
          </button>
          
          {showSettings && (
            <div className="w-full mt-2 p-4 bg-card border border-border rounded-xl shadow-sm animate-in fade-in duration-200">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                Detector API Endpoint
              </label>
              <input 
                type="text" 
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="e.g. http://localhost:8000"
                className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-ring transition-colors"
              />
              <span className="block text-[11px] text-muted-foreground mt-1">
                The FastAPI endpoint that executes the stylometric ensembling and neural models.
              </span>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-border pb-px">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'edit' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Edit Text</span>
          </button>
          <button
            onClick={() => results && setActiveTab('heatmap')}
            disabled={!results}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'heatmap' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Highlight Heatmap</span>
          </button>
        </div>

        {/* Editor Box / Heatmap display */}
        <section>
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm relative">
            {activeTab === 'edit' ? (
              <>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Input Document
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {wordCount} words
                  </span>
                </div>
                
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your text here (minimum 20 words for best accuracy, mixed-style documents supported)..."
                  className="w-full h-64 bg-background border border-input rounded-xl p-4 text-foreground text-sm sm:text-base leading-relaxed outline-none focus:border-ring focus:ring-1 focus:ring-ring/25 transition-all resize-none"
                />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
                  <div className="flex items-center gap-2 bg-muted/65 px-3 py-1.5 rounded-lg border border-border">
                    <Sliders className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Register:</span>
                    <select
                      value={register}
                      onChange={(e) => setRegister(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-foreground outline-none cursor-pointer"
                    >
                      <option value="">Auto-Detect</option>
                      <option value="academic">Academic / Scientific</option>
                      <option value="news">News / Journalism</option>
                      <option value="social">Social / Conversational</option>
                      <option value="creative">Creative / Narrative</option>
                    </select>
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Scanning Text...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Run Scan</span>
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              // Heatmap view
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Interactive Sentence Heatmap
                  </span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500/20 border border-red-500/60 rounded-sm"></span> AI</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-500/20 border border-amber-500/60 rounded-sm"></span> Mixed</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500/10 rounded-sm"></span> Human</span>
                  </div>
                </div>

                {/* Render sentences with highlights */}
                <div className="w-full min-h-64 bg-background border border-border rounded-xl p-4 text-foreground text-sm sm:text-base leading-relaxed overflow-y-auto max-h-[450px]">
                  {results?.sentences && results.sentences.length > 0 ? (
                    results.sentences.map((sent, idx) => (
                      <span
                        key={idx}
                        className={getSentenceHighlightClass(sent.ai_probability)}
                        onMouseEnter={() => setHoveredSentence(sent)}
                        onMouseLeave={() => setHoveredSentence(null)}
                      >
                        {sent.text}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground italic">No sentence analysis data available.</span>
                  )}
                </div>

                {/* Floating tooltip for hovered sentence */}
                {hoveredSentence && (
                  <div className="absolute top-4 left-6 bg-popover text-popover-foreground border border-border p-3 rounded-lg shadow-md flex flex-col gap-1 z-20 animate-in fade-in duration-100">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Sentence Probability</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        hoveredSentence.ai_probability >= 0.7 ? 'bg-red-500' :
                        hoveredSentence.ai_probability >= 0.35 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      <span className="text-sm font-bold">{Math.round(hoveredSentence.ai_probability * 100)}% AI probability</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-destructive mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Results Sections */}
        {results && status && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Circular Gauge Card */}
              <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-primary" /> Overall Score
                </h3>
                <div className="relative w-36 h-36">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle 
                      cx="72" cy="72" r={radius} 
                      className="stroke-muted fill-none" 
                      strokeWidth="8"
                    />
                    <circle 
                      cx="72" cy="72" r={radius} 
                      className="fill-none transition-all duration-700 ease-out" 
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - (results.ai_probability) * circumference}
                      strokeLinecap="round"
                      stroke={status.stroke}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold tracking-tight text-foreground">
                      {Math.round(results.ai_probability * 100)}%
                    </span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                      Probability
                    </span>
                  </div>
                </div>
                <div className={`mt-6 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${status.bg} ${status.text} border ${status.border}`}>
                  {status.label}
                </div>
              </div>

              {/* Model Attribution Card */}
              <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-primary" /> Model Attribution
                  </h3>
                  <p className="text-xs text-muted-foreground mb-6">
                    Matches text stylistic patterns to typical generation outputs.
                  </p>
                </div>
                <div className="bg-background border border-border rounded-xl p-4 flex flex-col gap-2">
                  <div className="text-xs text-muted-foreground">Likely Author/Source:</div>
                  <div className="text-sm font-extrabold text-primary tracking-tight">
                    {results.model_attribution?.source_model || 'Unknown'}
                  </div>
                  {results.model_attribution && (
                    <div className="flex justify-between items-center text-xs text-muted-foreground mt-2 pt-2 border-t border-border/60">
                      <span>Attribution Confidence:</span>
                      <span className="font-bold text-foreground">
                        {Math.round(results.model_attribution.confidence * 100)}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground italic mt-4">
                  Powered by RAID multi-class stylometry fingerprints.
                </div>
              </div>

              {/* Neural Signals (Perplexity / Burstiness) Card */}
              <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-primary" /> Neural Signals
                  </h3>
                  <p className="text-xs text-muted-foreground mb-6">
                    Measures text probability and perplexity dynamics using GPT-2.
                  </p>
                </div>
                <div className="space-y-4">
                  {results.neural_signals ? (
                    <>
                      <div className="bg-background border border-border rounded-xl p-3 flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-xs text-foreground font-medium">Perplexity (PPL)</span>
                          <span className="text-[10px] text-muted-foreground">Lower indicates AI predictability</span>
                        </div>
                        <span className="text-sm font-extrabold text-primary">
                          {results.neural_signals.perplexity.toFixed(1)}
                        </span>
                      </div>
                      <div className="bg-background border border-border rounded-xl p-3 flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-xs text-foreground font-medium">Burstiness (token std)</span>
                          <span className="text-[10px] text-muted-foreground">Lower implies uniform AI patterns</span>
                        </div>
                        <span className="text-sm font-extrabold text-primary">
                          {results.neural_signals.burstiness.toFixed(2)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-muted-foreground text-xs italic">No neural signal metrics computed.</div>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground italic mt-4">
                  Real-time perplexity surprisal analysis.
                </div>
              </div>

            </div>

            {/* Router & Performance Metadata */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Sliders className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Detected Register</span>
                  <span className="text-sm font-bold text-foreground uppercase tracking-wide">
                    {results.register}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Processing Speed</span>
                  <span className="text-sm font-bold text-foreground">
                    {results.processing_time_ms.toFixed(1)} ms
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Calibration Status</span>
                  <span className="text-sm font-bold text-emerald-500">
                    Active & Normalised
                  </span>
                </div>
              </div>
            </div>

            {/* Stylometric Features Card */}
            {results.features && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-primary" />
                    Linguistic Diagnostics (Stylometrics)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Features scoring compared to training range benchmarks
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(FEATURE_META).map(([key, meta]) => {
                    const val = results.features?.[key];
                    if (val === undefined || val === null) return null;
                    const percent = Math.min((val / meta.max) * 100, 100);
                    return (
                      <div key={key} className="bg-background border border-border rounded-xl p-3.5">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-foreground">{meta.label}</span>
                          <span className="text-xs font-bold text-primary">{meta.format(val)}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-1000"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </PageLayout>
  );
}
