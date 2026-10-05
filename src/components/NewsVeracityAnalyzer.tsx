import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Sparkles, 
  Layers, 
  ExternalLink,
  RefreshCw,
  Info
} from 'lucide-react';

export interface VeracityReport {
  headline: string;
  veracityScore: number;
  veracityRating: string;
  executiveSummary: string;
  claims: {
    claim: string;
    verdict: string;
    explanation: string;
  }[];
  technicalPlausibility: {
    rating: string;
    analysis: string;
  };
  disinformationIndicators: string[];
  corroboratingContext: string;
  socRecommendation: string;
}

const SAMPLE_NEWS = [
  {
    title: 'CISA & FBI Advisory (Verified)',
    badge: 'Official Advisory',
    text: `CISA, the FBI, and international partners released a joint Cybersecurity Advisory warning of state-sponsored cyber actors actively exploiting known vulnerabilities in unpatched network edge devices. Threat actors leverage default administrative credentials and unpatched CVE-2024-21887 and CVE-2023-46805 to bypass authentication, harvest credentials, and establish persistent reverse shells in enterprise perimeters. Organizations are urged to audit external-facing appliances and apply vendor patches immediately.`,
  },
  {
    title: 'Satellite Apocalypse Rumor (Sensationalized)',
    badge: 'Exaggerated Rumor',
    text: `BREAKING: A mysterious zero-day cyber attack has just taken down all global communication satellites simultaneously, completely blacking out air traffic control and plunging 40 countries into total electrical blackout. Insiders report that military command centers worldwide have lost all connectivity permanently and internet infrastructure cannot be restored.`,
  },
  {
    title: 'Quantum RSA Crack (Technically False)',
    badge: 'Technical Inaccuracy',
    text: `Leaked military document reveals that researchers have built a pocket quantum computer running Shor's algorithm that broke 2048-bit RSA and AES-256 encryption in under 3 seconds. The memo claims all encrypted banking systems, Bitcoin wallets, and HTTPS certificates are now completely obsolete and compromised across the internet.`,
  },
];

interface NewsVeracityAnalyzerProps {
  compact?: boolean;
}

export const NewsVeracityAnalyzer: React.FC<NewsVeracityAnalyzerProps> = ({
  compact = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<VeracityReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setErrorMsg('Please paste or type news text to analyze.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/analyze-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newsText: inputText.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data: VeracityReport = await response.json();
      setReport(data);
    } catch (err: any) {
      console.error('Analysis request error:', err);
      setErrorMsg('Failed to process news report. Please verify server connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!report) return;
    const textToCopy = `=== CYBERSHIELD NEWS CORRECTNESS & VERACITY REPORT ===
Headline: ${report.headline}
Veracity Score: ${report.veracityScore}/100 (${report.veracityRating})

EXECUTIVE SUMMARY:
${report.executiveSummary}

TECHNICAL PLAUSIBILITY: ${report.technicalPlausibility.rating}
${report.technicalPlausibility.analysis}

CLAIMS BREAKDOWN:
${report.claims.map((c, i) => `${i + 1}. [${c.verdict.toUpperCase()}] ${c.claim}\n   -> ${c.explanation}`).join('\n')}

DISINFORMATION INDICATORS:
${report.disinformationIndicators.map((d) => `- ${d}`).join('\n')}

RECOMMENDATION:
${report.socRecommendation}

CORROBORATION CONTEXT:
${report.corroboratingContext}
===================================================`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500 bg-emerald-950/60';
    if (score >= 50) return 'text-amber-400 border-amber-500 bg-amber-950/60';
    return 'text-rose-400 border-rose-500 bg-rose-950/60';
  };

  const getVerdictBadge = (verdict: string) => {
    const v = verdict.toLowerCase();
    if (v.includes('accurate') || v.includes('true') || v.includes('verified')) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 font-semibold">
          <CheckCircle2 className="w-3 h-3" /> {verdict}
        </span>
      );
    }
    if (v.includes('partially') || v.includes('unverified') || v.includes('plausible')) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/60 font-semibold">
          <AlertTriangle className="w-3 h-3" /> {verdict}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-700/60 font-semibold">
        <XCircle className="w-3 h-3" /> {verdict}
      </span>
    );
  };

  return (
    <div className={`flex flex-col bg-[#070d18] border border-cyan-900/30 rounded-xl overflow-hidden ${compact ? 'h-[440px]' : 'h-full min-h-[580px]'}`}>
      {/* Screen Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0a1222] border-b border-cyan-900/40">
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-cyan-400" />
          <h2 className="font-display font-bold text-sm tracking-wide text-white uppercase">
            News Veracity & Correctness Analyzer
          </h2>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            FACT-CHECKING · TECHNICAL FEASIBILITY · OSINT INTEL
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI CORROBORATION ENGINE</span>
          </span>
        </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-y-auto">
        {/* Left Column: Input Box & Sample Presets */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-4 bg-[#091122] border border-cyan-900/30 rounded-xl flex flex-col flex-1">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-white uppercase font-display flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                Input News Article / Intelligence Bulletin
              </label>
              <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                {inputText.length} chars
              </span>
            </div>

            {/* News Input Text Box */}
            <div className="relative flex-1 min-h-[160px] flex flex-col">
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Paste news dispatch, breaking article, cybersecurity rumor, press release, or viral social post here to examine its correctness..."
                className="w-full flex-1 p-3 bg-[#050912] border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-sans leading-relaxed resize-none"
              />
              {inputText.length > 0 && (
                <button
                  onClick={() => setInputText('')}
                  className="absolute bottom-2.5 right-2.5 px-2 py-0.5 text-[10px] font-mono text-slate-400 hover:text-white bg-slate-800/80 rounded cursor-pointer transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mt-2 p-2 bg-rose-950/70 border border-rose-800 text-rose-300 text-xs rounded font-mono">
                {errorMsg}
              </div>
            )}

            {/* Action Button */}
            <button
              disabled={isLoading || !inputText.trim()}
              onClick={handleAnalyze}
              className={`mt-3 py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isLoading
                  ? 'bg-cyan-950 text-cyan-300 cursor-wait border border-cyan-700'
                  : !inputText.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Cross-Referencing & Fact-Checking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Analyze News Correctness</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="p-3.5 bg-[#091122] border border-cyan-900/30 rounded-xl">
            <span className="text-[11px] font-mono text-slate-400 uppercase block mb-2 font-semibold">
              Or Load Sample News Scenarios:
            </span>
            <div className="space-y-2">
              {SAMPLE_NEWS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(sample.text);
                    setErrorMsg(null);
                  }}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-cyan-800/60 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {sample.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {sample.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 font-sans">
                    {sample.text}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Correctness & Veracity Report Output */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {report ? (
            <div className="p-4 bg-[#091122] border border-cyan-900/30 rounded-xl flex flex-col gap-4 shadow-xl">
              {/* Report Header Bar */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-cyan-900/40">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      VERACITY EVALUATION REPORT
                    </span>
                    <span className="text-slate-500 font-mono text-xs">·</span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      COMPLETED JUST NOW
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white font-display leading-snug">
                    {report.headline}
                  </h3>
                </div>

                {/* Score & Rating Badge */}
                <div className="flex items-center gap-3">
                  <div
                    className={`px-3 py-1.5 rounded-lg border font-mono text-center ${getScoreColor(
                      report.veracityScore
                    )}`}
                  >
                    <span className="text-[9px] block uppercase text-slate-400">CORRECTNESS</span>
                    <span className="text-lg font-bold tabular-nums">
                      {report.veracityScore}
                      <span className="text-xs font-normal">/100</span>
                    </span>
                  </div>

                  <button
                    onClick={handleCopyReport}
                    className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                    title="Copy Full Report"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Veracity Rating Tag */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">VERDICT:</span>
                <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-[#060e1d] border border-cyan-800/80 text-cyan-300">
                  {report.veracityRating}
                </span>
              </div>

              {/* Executive Summary */}
              <div className="p-3 bg-[#060c18] rounded-lg border border-slate-800 font-sans text-xs text-slate-200 leading-relaxed">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1 font-bold">
                  Executive Summary of Findings
                </span>
                {report.executiveSummary}
              </div>

              {/* Claim-by-Claim Verification Breakdown */}
              <div>
                <span className="text-xs font-semibold text-white uppercase font-display block mb-2">
                  Claim-by-Claim Correctness Breakdown
                </span>
                <div className="space-y-2">
                  {report.claims.map((claimItem, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#060a14] border border-slate-800 flex flex-col gap-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-medium text-slate-200 font-sans">
                          "{claimItem.claim}"
                        </span>
                        {getVerdictBadge(claimItem.verdict)}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans pl-2 border-l border-slate-800">
                        {claimItem.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Plausibility & Disinformation Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                {/* Plausibility */}
                <div className="p-3 bg-[#060a14] rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">
                      Technical Plausibility
                    </span>
                    <span className="text-cyan-400 font-semibold">
                      {report.technicalPlausibility.rating}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    {report.technicalPlausibility.analysis}
                  </p>
                </div>

                {/* Disinformation Flags */}
                <div className="p-3 bg-[#060a14] rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">
                    Disinformation & Sensationalism Flags
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-300 font-sans">
                    {report.disinformationIndicators.length > 0 ? (
                      report.disinformationIndicators.map((flag, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                          <span>{flag}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> No deliberate deception flagged
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Corroborating Context */}
              <div className="p-3 bg-[#060a14] rounded-lg border border-slate-800 text-xs">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1 font-bold">
                  Authoritative Corroboration & Known References
                </span>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  {report.corroboratingContext}
                </p>
              </div>

              {/* SOC Operational Recommendation */}
              <div className="p-3 bg-gradient-to-r from-[#0c1830] to-[#071120] rounded-lg border border-cyan-500/40 text-xs">
                <div className="flex items-center gap-1.5 text-cyan-300 font-mono text-[11px] uppercase font-bold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SOC Command Operational Directive</span>
                </div>
                <p className="text-[11px] text-slate-200 font-sans leading-relaxed">
                  {report.socRecommendation}
                </p>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="p-8 bg-[#091122] border border-cyan-900/30 rounded-xl flex flex-col items-center justify-center text-center flex-1 min-h-[380px]">
              <div className="w-14 h-14 rounded-full bg-[#070e1c] border border-cyan-800/40 flex items-center justify-center mb-4 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-sm text-white uppercase mb-1">
                Awaiting News Dispatch to Inspect
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mb-4 font-sans leading-relaxed">
                Paste any news article, viral claim, or security advisory on the left, or select one of the pre-loaded intelligence scenarios to generate an authoritative correctness report.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Evaluates factual accuracy, technical feasibility, and source attribution</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
