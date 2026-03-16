import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How Swarm Prediction Works',
  description: 'Architecture and technical details of the swarm intelligence prediction engine.',
};

const pipelineSteps = [
  { num: 1, title: 'Document ingestion', desc: 'Your source files are parsed into a clean text corpus with structure preserved.' },
  { num: 2, title: 'Knowledge graph extraction', desc: 'Entities, relationships, and causal structures are identified and linked into a typed graph.' },
  { num: 3, title: 'Agent generation', desc: 'Diverse cognitive personas are created, each with unique expertise, reasoning style, and risk posture.' },
  { num: 4, title: 'Multi-round simulation', desc: 'Agents debate across multiple rounds, posting analyses, challenging each other, and shifting positions.' },
  { num: 5, title: 'Consensus report', desc: 'The full debate transcript is analysed to produce a structured prediction with confidence bounds.' },
];

const providers = ['Anthropic', 'OpenAI', 'Google Gemini', 'Groq', 'Mistral AI', 'Together AI', 'OpenRouter', 'DeepSeek'];

const techStack = [
  { label: 'Frontend', detail: 'Next.js / React' },
  { label: 'Backend', detail: 'Python / Flask' },
  { label: 'LLM integration', detail: '8 providers via BYOK' },
  { label: 'Graph engine', detail: 'Custom ontology extraction' },
  { label: 'Visualisation', detail: 'Force-directed D3 graphs' },
  { label: 'Logging', detail: 'Structured with file rotation' },
];

export default function WikiPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto max-w-3xl px-4 md:px-6 py-12">
          <Link href="/swarm-prediction" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            &larr; Back
          </Link>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">How It Works</h1>
          <p className="mt-2 text-lg text-muted-foreground">The architecture behind swarm intelligence prediction</p>

          <Image
            src="/images/swarm/graph.png"
            alt="Knowledge graph network"
            width={520}
            height={520}
            className="mx-auto mt-8 rounded-lg"
          />

          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Why swarm prediction?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Most AI prediction tools work the same way: you ask a single language model a question and it gives you one answer. The problem is that a single model carries a single set of biases, blind spots, and reasoning habits. It has no way to challenge itself. If it starts down the wrong path, there is nothing to pull it back.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This engine takes a different approach. Instead of asking one model once, it creates a population of AI agents, each with a different perspective, and makes them debate. Agents argue, challenge each other, shift their positions when they encounter better evidence, and eventually settle into a consensus. The final prediction comes from that consensus, not from any single agent.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The idea is borrowed from ensemble methods in machine learning (where many weak learners outperform one strong learner) and from prediction markets (where aggregated independent judgments beat individual expert forecasts). The difference is that this system makes the reasoning process visible. You can read the debate, see who changed their mind and why, and judge for yourself whether the conclusion is sound.
            </p>
          </section>

          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">The problem with single-model predictions</h2>
            <p className="text-muted-foreground leading-relaxed">
              Language models are trained on massive datasets, but that training creates systematic tendencies. A model might consistently overweight recent events, avoid contrarian positions, or default to hedging language that sounds authoritative but says very little. When you ask a model &quot;Will X happen?&quot;, the answer depends heavily on how the question is framed, what context is provided, and the model&apos;s implicit priors.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              There is no self-correction mechanism. If you ask the same model the same question ten times, you get ten variations of the same answer. The responses look diverse on the surface but share the same underlying reasoning structure. This is not diversity of thought. It is diversity of phrasing.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This engine solves that by forcing genuine disagreement. Each agent is constructed with a different cognitive profile: different areas of expertise, different risk tolerances, different reasoning styles. Some agents are analytically rigorous. Some are intuition-driven. Some are deliberately contrarian. When these agents engage with each other, blind spots get exposed and weak arguments get challenged.
            </p>
          </section>

          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">The prediction pipeline</h2>
            <p className="text-muted-foreground leading-relaxed">
              Every prediction runs through five stages, each building on the output of the previous one. The pipeline is designed so that the quality of each stage compounds. A better knowledge graph leads to more relevant agents, which leads to a richer debate, which leads to a better report.
            </p>
            <div className="space-y-3 mt-4">
              {pipelineSteps.map((step) => (
                <div key={step.num} className="flex items-start gap-4 rounded-lg border border-border p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Image
              src="/images/swarm/pipeline.png"
              alt="Pipeline flow diagram"
              width={520}
              height={520}
              className="mx-auto mt-4 rounded-lg"
            />
          </section>

          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Stage 1: Document ingestion</h2>
            <p className="text-muted-foreground leading-relaxed">
              The engine accepts input in several formats: uploaded files (PDF, Markdown, plain text), pasted text, or a URL. The input is normalised into a clean text corpus with metadata preserved where possible (headings, structure, source attribution).
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This stage is intentionally simple. The goal is to get your data into a form that the next stage can work with. There is no summarisation or lossy compression here. The full text is preserved because the agents need access to specifics, not summaries.
            </p>
          </section>

          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Stage 2: Knowledge graph extraction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Before any agents are created, the engine builds a knowledge graph from your input data. This is the factual substrate that all agents share. The process has two parts: ontology detection and entity extraction.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Ontology detection</strong> identifies the types of things that matter in your data. If you upload a financial report, the ontology might include companies, metrics, market events, and regulatory actions. If you upload a geopolitical analysis, it might include nations, leaders, treaties, and conflicts. The ontology is not pre-defined. It is inferred from the data itself.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Entity extraction</strong> then populates that ontology with specific instances. Each entity gets a type, a description, and a set of relationships to other entities. The relationships are directional and typed: &quot;Company A acquired Company B&quot;, &quot;Policy X was enacted in response to Event Y&quot;. These relationships form the edges of the knowledge graph.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The knowledge graph serves two purposes. First, it gives agents a shared factual foundation so they argue about interpretation rather than facts. Second, it determines what kinds of agents get created in the next stage.
            </p>
          </section>

          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Stage 3: Agent generation</h2>
            <p className="text-muted-foreground leading-relaxed">
              Each agent in the swarm is not a generic chatbot. It is a purpose-built cognitive persona with several properties that shape how it thinks:
            </p>
            <ul className="space-y-2 text-muted-foreground text-sm list-disc pl-5">
              <li><strong className="text-foreground">Expertise domain.</strong> Drawn from the knowledge graph&apos;s entity types. An agent specialising in financial metrics will focus on different aspects of the data than one specialising in regulatory risk.</li>
              <li><strong className="text-foreground">Reasoning style.</strong> Some agents reason analytically, working through evidence step by step. Others reason by analogy, drawing on historical parallels. Others are synthesis-oriented, looking for patterns across domains.</li>
              <li><strong className="text-foreground">Risk posture.</strong> Conservative agents give more weight to downside scenarios. Aggressive agents focus on upside potential. This ensures that the debate explores the full probability space rather than clustering around the median.</li>
              <li><strong className="text-foreground">Initial stance.</strong> Every agent enters the simulation with a starting position on the prediction question. This position is informed by their profile but is explicitly subject to change during the debate.</li>
              <li><strong className="text-foreground">Persuadability.</strong> How much evidence it takes for an agent to change its mind. Low-persuadability agents act as anchors, forcing the debate to produce strong evidence before consensus can shift. High-persuadability agents respond quickly to new arguments, acting as early signals for emerging consensus.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              The number of agents scales with the chosen simulation depth. A quick run uses 10 agents. A maximum-depth run uses 100. The profiles are generated to maximise diversity across all five dimensions listed above.
            </p>
          </section>

          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Stage 4: Multi-round simulation</h2>
            <p className="text-muted-foreground leading-relaxed">
              This is where the prediction actually happens. The simulation runs in discrete rounds. In each round, a subset of agents are selected to participate. Each participating agent can do one of three things:
            </p>
            <ul className="space-y-2 text-muted-foreground text-sm list-disc pl-5">
              <li><strong className="text-foreground">Post an original analysis.</strong> The agent reads the knowledge graph, considers the prediction question through its cognitive lens, and writes a position statement with supporting reasoning.</li>
              <li><strong className="text-foreground">Reply to another agent.</strong> The agent reads a previous post and either supports it with additional evidence, challenges it with counter-arguments, or offers a synthesis that reconciles competing views.</li>
              <li><strong className="text-foreground">Shift its stance.</strong> If an agent encounters an argument compelling enough to overcome its persuadability threshold, it changes its position. The shift is logged with the old stance, the new stance, the triggering argument, and the agent&apos;s stated reason for changing. This creates an auditable trail of how opinion evolved.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              The simulation does not have a pre-determined outcome. Agents make independent decisions based on their profiles and the arguments they encounter. Consensus can emerge quickly if the evidence strongly favours one outcome, or the debate can remain contested through the final round if the question is genuinely uncertain.
            </p>
            <div className="rounded-lg border border-border bg-muted/30 p-4 mt-2">
              <p className="font-medium text-sm">Depth presets:</p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li><strong className="text-foreground">Quick</strong> - 10 agents, 4 rounds, about 1 minute</li>
                <li><strong className="text-foreground">Balanced</strong> - 30 agents, 8 rounds, about 3 minutes</li>
                <li><strong className="text-foreground">Deep</strong> - 50 agents, 12 rounds, about 8 minutes</li>
                <li><strong className="text-foreground">Maximum</strong> - 100 agents, 16 rounds, about 15 minutes</li>
              </ul>
            </div>
          </section>

          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Stage 5: Consensus report</h2>
            <p className="text-muted-foreground leading-relaxed">
              After the simulation finishes, a dedicated report agent reads the complete debate transcript and generates a structured prediction report. This agent does not participate in the debate itself. It acts as an impartial analyst of the debate&apos;s outcome.
            </p>
            <p className="text-muted-foreground leading-relaxed">The report includes:</p>
            <ul className="space-y-1 text-muted-foreground text-sm list-disc pl-5">
              <li>The majority position with the key arguments that support it</li>
              <li>Minority positions and why they persisted despite counter-arguments</li>
              <li>A list of stance shifts showing which agents changed their minds and why</li>
              <li>Points of agreement that held across all agents regardless of profile</li>
              <li>Unresolved disagreements where agents could not reach consensus</li>
              <li>Risk factors and edge cases identified by contrarian agents</li>
              <li>A final probabilistic assessment with confidence bounds</li>
            </ul>
          </section>

          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Follow-up questions</h2>
            <p className="text-muted-foreground leading-relaxed">
              After the report is generated, you can ask follow-up questions about the simulation. The system has access to the full debate transcript, all agent profiles, the knowledge graph, and the final report. You can ask things like &quot;Which agents disagreed the most?&quot;, &quot;What would change the prediction?&quot;, or &quot;What assumptions is the majority position relying on?&quot;.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This turns the prediction from a one-shot output into an interactive analysis session. You can drill into the reasoning, challenge the assumptions, and use the system as a thinking partner rather than an oracle.
            </p>
          </section>

          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Security and privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              The engine operates on a Bring Your Own Key model. You provide your own API key from any supported provider. The key is stored only in your browser&apos;s local storage. When you start a prediction, the key is sent over HTTPS to the backend, used for a single request, and then deleted from server memory. It is never written to disk, never logged, and never shared with any third party.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Your input data is processed in memory during the prediction run. Nothing is persisted after the process completes. There is no database of past predictions, no user accounts, and no tracking. Each prediction is a self-contained, stateless operation.
            </p>
          </section>

          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Supported LLM providers</h2>
            <p className="text-muted-foreground leading-relaxed">
              The engine supports 8 LLM providers through the BYOK system. You can use whichever provider you already have an API key for:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              {providers.map((p) => (
                <div key={p} className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">
                  {p}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Technology stack</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {techStack.map((t) => (
                <div key={t.label} className="rounded-md border border-border px-3 py-3 text-sm">
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground">{t.label}</span>
                  <span className="text-foreground">{t.detail}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Limitations and honest caveats</h2>
            <p className="text-muted-foreground leading-relaxed">
              This system is a tool for structured thinking, not an oracle. There are real limitations worth understanding:
            </p>
            <ul className="space-y-2 text-muted-foreground text-sm list-disc pl-5">
              <li><strong className="text-foreground">Garbage in, garbage out.</strong> The quality of the prediction depends heavily on the quality and relevance of the input data. Vague or insufficient data produces vague predictions.</li>
              <li><strong className="text-foreground">LLM constraints apply.</strong> The agents are powered by language models, which means they inherit the training data cutoffs, knowledge gaps, and reasoning limitations of those models.</li>
              <li><strong className="text-foreground">Not calibrated on real outcomes.</strong> Unlike prediction markets, which are calibrated by real money and real outcomes, this system has no feedback mechanism. The confidence percentages should be treated as relative indicators, not absolute probabilities.</li>
              <li><strong className="text-foreground">Cost scales with depth.</strong> Each agent makes LLM calls. A maximum-depth run with 100 agents across 16 rounds can consume significant API credits. The depth presets exist to give you control over this tradeoff.</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
