/**
 * Swarm Engine - runs the full prediction pipeline in the browser.
 *
 * Pipeline: ontology -> graph -> agents -> simulation -> report
 *
 * All LLM calls go through /api/llm/proxy to avoid CORS issues.
 * Everything else runs client-side.
 */

import { LLMConfig, llmComplete, llmCompleteJSON } from './llm-client';
import { KnowledgeGraph } from './knowledge-graph';

// -- Types --

export interface SwarmStatus {
  phase: string;
  progress: number;
  message: string;
  done: boolean;
  failed: boolean;
  reportMarkdown?: string;
  posts?: Post[];
  profiles?: AgentProfile[];
  stanceShifts?: StanceShift[];
  clusters?: Record<string, string[]>;
  simId?: string;
}

export interface AgentProfile {
  agent_id: number;
  entity_name: string;
  entity_type: string;
  entity_summary: string;
  username: string;
  bio: string;
  personality: string;
  stance: string;
  activity_level: number;
  influence: number;
}

export interface Post {
  post_id: string;
  round_num: number;
  agent_id: number;
  agent_name: string;
  agent_type: string;
  content: string;
  reply_to?: string;
  is_reply_to?: string;
  stance: string;
}

interface StanceShift {
  agent: string;
  round: number;
  from: string;
  to: string;
  reason: string;
}

type StatusCallback = (status: SwarmStatus) => void;

// -- Prompts --

const ONTOLOGY_SYSTEM = `You are an ontology designer for social simulations.
Given text and a prediction goal, identify the types of actors and their connections.

Return JSON:
{
  "entity_types": [{"name": "TypeName", "description": "short description"}],
  "edge_types": [{"name": "RELATION_NAME", "description": "short description"}],
  "analysis_summary": "1 sentence about the source material"
}

Rules:
- 4-6 entity types (real actors who can speak: people, orgs, officials, etc.)
- 3-5 relationship types
- Keep descriptions under 50 characters
- Return JSON only, no markdown`;

const EXTRACTION_SYSTEM = `You are an entity and relationship extractor.
Given text and a schema, extract ALL entities and relationships.

For each entity: name, type (from schema), summary (1 sentence).
For each relationship: source, target, type (from schema), description.

Return JSON:
{
  "entities": [{"name": "...", "type": "...", "summary": "..."}],
  "relationships": [{"source": "...", "target": "...", "type": "...", "description": "..."}]
}`;

const BATCH_AGENT_SYSTEM = `You create social-media persona profiles for a multi-agent simulation.
Given entities and a prediction goal, create a profile for EACH entity.
Also generate ADDITIONAL agents (analysts, critics, insiders, public voices)
to fill the simulation up to the target count.

Return a JSON array:
[
  {
    "entity_name": "...",
    "entity_type": "Person or Organization or Analyst etc",
    "username": "a plausible handle",
    "bio": "1-2 sentences of background",
    "personality": "dominant trait (analytical, emotional, contrarian, pragmatic, idealistic, skeptical, etc.)",
    "stance": "supportive / opposing / neutral / cautious",
    "activity_level": 0.0-1.0,
    "influence": 0.0-1.0
  }
]

Rules:
- Create diverse personalities. Mix of supportive, opposing, neutral, cautious.
- Include contrarians and skeptics. Not everyone agrees.
- Give each agent a distinct voice.
- Bios should be specific.
- Never use em-dashes in bios.`;

const AGENT_SYSTEM_TEMPLATE = `You are {name}, a {entity_type}.
Background: {bio}
Personality: {personality}
Your initial stance on the topic: {stance}

You are participating in a social media discussion about:
"{topic}"

Rules:
- Stay in character. Your posts should reflect your background and personality.
- Write 1-2 sentences per post, like real social media.
- You may reply to specific people by starting with "@TheirName:"
- You can agree, disagree, add new information, or ask questions.
- If someone makes a compelling point, you can shift your position.
- Be specific and substantive. No vague platitudes.
- Never use em-dashes. Write plainly.

After reading the feed, write your next post. Return ONLY JSON:
{
  "post": "your message",
  "reply_to": null or "name of person you're replying to",
  "current_stance": "supportive/opposing/neutral/shifted",
  "stance_reason": "1 sentence why you hold this stance now"
}`;

const REPORT_SYSTEM = `You are writing a prediction report based on a simulated discussion.
You have simulation data showing how different agents reacted to a scenario.

Write a structured report in Markdown with:
1. An executive summary (2-3 sentences)
2. Key findings (what the agents predicted/debated)
3. Points of agreement and disagreement
4. Risk factors identified
5. Overall prediction

Rules:
- Use > blockquotes to cite agent statements
- Use **bold** for key terms
- Write 400-800 words total
- Be specific, reference actual agent positions
- No heading for the title (it's added separately)

Writing style rules (MANDATORY):
- NEVER use em-dashes. Use commas, periods, or semicolons instead.
- NEVER use these words: delve, tapestry, landscape, utilize, leverage, complex, nuanced, paradigm, collaboration, holistic, robust, ecosystem, stakeholder, streamline, pivotal, moreover, furthermore, comprehensive, intricate, foster, underscore, realm
- Write plainly and directly like a journalist, not like a corporate report
- Short sentences. No filler. Every sentence must add information.`;

const CHAT_SYSTEM_TEMPLATE = `You are the Report Agent. Answer questions about this simulation.
Be specific, cite agent posts when relevant.
NEVER use em-dashes. Write plainly and directly. No corporate jargon.

Simulation data:
{context}`;

// -- Depth configs --

interface DepthConfig {
  agentCount: number;
  totalRounds: number;
  agentsPerRound: number;
}

const DEPTH_CONFIGS: Record<string, DepthConfig> = {
  quick: { agentCount: 10, totalRounds: 4, agentsPerRound: 4 },
  balanced: { agentCount: 30, totalRounds: 8, agentsPerRound: 6 },
  deep: { agentCount: 50, totalRounds: 12, agentsPerRound: 8 },
  maximum: { agentCount: 100, totalRounds: 16, agentsPerRound: 10 },
};

// -- Engine --

export class SwarmEngine {
  private config: LLMConfig;
  private onStatus: StatusCallback;
  private aborted = false;
  private graph = new KnowledgeGraph();
  private profiles: AgentProfile[] = [];
  private posts: Post[] = [];
  private stanceShifts: StanceShift[] = [];
  private clusters: Record<string, string[]> = {};
  private reportMarkdown = '';

  // For chat after completion
  private predictionGoal = '';
  private simFacts = '';

  constructor(config: LLMConfig, onStatus: StatusCallback) {
    this.config = config;
    this.onStatus = onStatus;
  }

  abort() {
    this.aborted = true;
  }

  private update(partial: Partial<SwarmStatus>) {
    this.onStatus({
      phase: 'starting',
      progress: 0,
      message: '',
      done: false,
      failed: false,
      ...partial,
    });
  }

  async run(sourceText: string, predictionGoal: string, depth = 'balanced') {
    this.predictionGoal = predictionGoal;
    const depthCfg = DEPTH_CONFIGS[depth] || DEPTH_CONFIGS.balanced;

    try {
      // 1. Ontology
      this.update({ phase: 'ontology', progress: 5, message: 'Analysing document structure...' });
      const ontology = await this.generateOntology(sourceText, predictionGoal);
      if (this.aborted) return;

      // 2. Graph
      this.update({ phase: 'graph', progress: 15, message: 'Extracting entities and relationships...' });
      await this.buildGraph(sourceText, ontology);
      if (this.aborted) return;

      // 3. Agents
      this.update({ phase: 'agents', progress: 25, message: `Generating ${depthCfg.agentCount} agent profiles...` });
      await this.generateAgents(predictionGoal, depthCfg.agentCount);
      if (this.aborted) return;

      // 4. Simulation
      this.update({ phase: 'simulation', progress: 40, message: `Starting simulation: ${this.profiles.length} agents, ${depthCfg.totalRounds} rounds...` });
      await this.runSimulation(predictionGoal, depthCfg.totalRounds, depthCfg.agentsPerRound);
      if (this.aborted) return;

      // 5. Report
      this.update({ phase: 'report', progress: 85, message: 'Writing prediction report...' });
      await this.generateReport(predictionGoal);

      this.update({
        phase: 'done',
        progress: 100,
        message: 'Complete',
        done: true,
        reportMarkdown: this.reportMarkdown,
        posts: this.posts,
        profiles: this.profiles,
        stanceShifts: this.stanceShifts,
        clusters: this.clusters,
        simId: `sim_${Date.now().toString(36)}`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      this.update({ phase: 'failed', progress: 0, message: msg, failed: true });
    }
  }

  // -- Stage 1: Ontology --

  private async generateOntology(text: string, goal: string) {
    const truncated = text.length > 6000 ? text.slice(0, 6000) + '\n...(truncated)' : text;
    const result = await llmCompleteJSON(this.config, [
      { role: 'system', content: ONTOLOGY_SYSTEM },
      { role: 'user', content: `Goal: ${goal}\n\nText:\n${truncated}\n\nDesign the ontology. JSON only.` },
    ], { temperature: 0.3, maxTokens: 1500 });

    const data = result as Record<string, unknown>;
    data.entity_types = data.entity_types || [];
    data.edge_types = data.edge_types || [];

    // Ensure Person and Organization exist
    const types = data.entity_types as { name: string }[];
    const names = new Set(types.map(t => t.name));
    if (!names.has('Person')) types.push({ name: 'Person', description: 'Individual person' } as { name: string });
    if (!names.has('Organization')) types.push({ name: 'Organization', description: 'Organisation or group' } as { name: string });

    return data;
  }

  // -- Stage 2: Graph --

  private async buildGraph(text: string, ontology: Record<string, unknown>) {
    const truncated = text.length > 12000 ? text.slice(0, 12000) + '\n...(truncated)' : text;
    const entityTypes = (ontology.entity_types as { name: string }[]).map(t => t.name);
    const edgeTypes = (ontology.edge_types as { name: string }[]).map(t => t.name);
    const schemaDesc = `Entity types: ${entityTypes.join(', ')}\nRelationship types: ${edgeTypes.join(', ')}`;

    const extracted = await llmCompleteJSON(this.config, [
      { role: 'system', content: EXTRACTION_SYSTEM },
      { role: 'user', content: `## Schema\n${schemaDesc}\n\n## Text\n${truncated}\n\nExtract all entities and relationships. Return JSON only.` },
    ], { temperature: 0.2, maxTokens: 4000 }) as Record<string, unknown>;

    const nameToUid: Record<string, string> = {};
    for (const ent of (extracted.entities || []) as { name?: string; type?: string; summary?: string }[]) {
      const name = (ent.name || '').trim();
      if (!name) continue;
      const key = name.toLowerCase();
      if (!nameToUid[key]) {
        const e = this.graph.addEntity(name, ent.type || 'Person', ent.summary || '');
        nameToUid[key] = e.uid;
      }
    }

    for (const rel of (extracted.relationships || []) as { source?: string; target?: string; type?: string; description?: string }[]) {
      const s = (rel.source || '').trim().toLowerCase();
      const t = (rel.target || '').trim().toLowerCase();
      if (nameToUid[s] && nameToUid[t]) {
        this.graph.addRelationship(nameToUid[s], nameToUid[t], rel.type || 'RELATED_TO', rel.description || '');
      }
    }

    // Fallback if no entities found
    if (this.graph.entities.size === 0) {
      this.update({ message: 'Retrying entity extraction...' });
      const fallback = await llmCompleteJSON(this.config, [
        { role: 'system', content: 'List the people, organizations, and groups mentioned in this text. Return JSON: {"entities": [{"name": "...", "type": "Person or Organization", "summary": "one sentence"}]}' },
        { role: 'user', content: truncated.slice(0, 4000) },
      ], { temperature: 0.3, maxTokens: 1500 }) as Record<string, unknown>;

      for (const ent of (fallback.entities || []) as { name?: string; type?: string; summary?: string }[]) {
        const name = (ent.name || '').trim();
        if (name && !nameToUid[name.toLowerCase()]) {
          const e = this.graph.addEntity(name, ent.type || 'Person', ent.summary || '');
          nameToUid[name.toLowerCase()] = e.uid;
        }
      }
    }

    // Last resort
    if (this.graph.entities.size === 0) {
      const defaults = [
        ['Government Official', 'Person', 'A government representative involved in this scenario'],
        ['Industry Leader', 'Organization', 'A key business or industry figure'],
        ['Public Advocate', 'Person', 'A voice representing public interest'],
        ['Independent Analyst', 'Person', 'An independent expert analyzing the situation'],
      ];
      for (const [name, type, summary] of defaults) {
        this.graph.addEntity(name, type, summary);
      }
    }
  }

  // -- Stage 3: Agents --

  private async generateAgents(goal: string, targetCount: number) {
    const entities = Array.from(this.graph.entities.values());
    const entityLines = entities.map(e => `- ${e.name} (${e.entityType}): ${e.summary.slice(0, 120)}`).join('\n');

    const result = await llmCompleteJSON(this.config, [
      { role: 'system', content: BATCH_AGENT_SYSTEM },
      { role: 'user', content: `Prediction goal: ${goal}\n\nEntities (${entities.length}):\n${entityLines}\n\nCreate a profile for each entity. If there are fewer than ${targetCount}, add more stakeholder archetypes to reach ${targetCount} total agents. Return a JSON array.` },
    ], { temperature: 0.7, maxTokens: 6000 });

    let profiles: Record<string, unknown>[] = [];
    if (Array.isArray(result)) {
      profiles = result as Record<string, unknown>[];
    } else {
      const obj = result as Record<string, unknown>;
      profiles = (obj.profiles || obj.agents || []) as Record<string, unknown>[];
    }

    // If we need more agents
    if (profiles.length < targetCount) {
      const remaining = targetCount - profiles.length;
      const existingNames = profiles.map(p => String(p.entity_name || ''));

      this.update({ progress: 30, message: `Generated ${profiles.length} profiles, creating ${remaining} more...` });

      const extra = await llmCompleteJSON(this.config, [
        { role: 'system', content: BATCH_AGENT_SYSTEM },
        { role: 'user', content: `Topic: ${goal}\n\nExisting agents: ${existingNames.join(', ')}\n\nGenerate ${remaining} MORE unique agents who would participate in this discussion. They should have different backgrounds and perspectives from the existing agents. Return a JSON array.` },
      ], { temperature: 0.8, maxTokens: 5000 });

      let extraProfiles: Record<string, unknown>[] = [];
      if (Array.isArray(extra)) {
        extraProfiles = extra as Record<string, unknown>[];
      } else {
        const obj = extra as Record<string, unknown>;
        extraProfiles = (obj.profiles || obj.agents || []) as Record<string, unknown>[];
      }
      profiles.push(...extraProfiles);
    }

    // Deduplicate and build final profiles
    const seen = new Set<string>();
    this.profiles = [];
    for (let idx = 0; idx < profiles.length; idx++) {
      const p = profiles[idx];
      const name = String(p.entity_name || `Agent_${idx}`);
      if (seen.has(name.toLowerCase())) continue;
      seen.add(name.toLowerCase());

      this.profiles.push({
        agent_id: idx,
        entity_name: name,
        entity_type: String(p.entity_type || 'Person'),
        entity_summary: String(p.bio || p.entity_summary || ''),
        username: String(p.username || name.toLowerCase().replace(/ /g, '_')),
        bio: String(p.bio || ''),
        personality: String(p.personality || 'neutral'),
        stance: String(p.stance || 'neutral'),
        activity_level: Number(p.activity_level) || 0.5,
        influence: Number(p.influence) || 0.5,
      });
    }
  }

  // -- Stage 4: Simulation --

  private async runSimulation(goal: string, totalRounds: number, agentsPerRound: number) {
    interface AgentState {
      profile: AgentProfile;
      memory: string[];
      connections: string[];
      postCount: number;
      currentStance: string;
    }

    const agents: AgentState[] = this.profiles.map(p => ({
      profile: p,
      memory: [],
      connections: [],
      currentStance: p.stance,
      postCount: 0,
    }));

    // Build connections from graph
    const nameToIdx: Record<string, number> = {};
    agents.forEach((a, i) => { nameToIdx[a.profile.entity_name.toLowerCase()] = i; });

    for (const rel of this.graph.relationships.values()) {
      const srcEntity = this.graph.entities.get(rel.sourceUid);
      const tgtEntity = this.graph.entities.get(rel.targetUid);
      if (srcEntity && tgtEntity) {
        const si = nameToIdx[srcEntity.name.toLowerCase()];
        const ti = nameToIdx[tgtEntity.name.toLowerCase()];
        if (si !== undefined && ti !== undefined) {
          agents[si].connections.push(agents[ti].profile.entity_name);
          agents[ti].connections.push(agents[si].profile.entity_name);
        }
      }
    }

    let feedText = `[SCENARIO] ${goal}`;

    for (let round = 1; round <= totalRounds; round++) {
      if (this.aborted) return;

      // Select agents for this round
      const recentNames = new Set(this.posts.slice(-10).map(p => p.agent_name));

      const scored = agents.map(a => {
        let score = Math.random() * 0.3;
        if (a.connections.some(c => recentNames.has(c))) score += 0.5;
        if (a.postCount === 0) score += 0.3;
        return { score, agent: a };
      });
      scored.sort((a, b) => b.score - a.score);
      const roundAgents = scored.slice(0, agentsPerRound).map(s => s.agent);

      const roundPosts: Post[] = [];

      for (const agent of roundAgents) {
        if (this.aborted) return;

        try {
          const system = AGENT_SYSTEM_TEMPLATE
            .replace('{name}', agent.profile.entity_name)
            .replace('{entity_type}', agent.profile.entity_type)
            .replace('{bio}', agent.profile.bio)
            .replace('{personality}', agent.profile.personality)
            .replace('{stance}', agent.currentStance)
            .replace('{topic}', goal);

          const memoryText = agent.memory.length
            ? '\n\nYour previous posts:\n' + agent.memory.slice(-5).join('\n')
            : '';
          const connectionsText = agent.connections.length
            ? `\n\nYou know these people: ${agent.connections.slice(0, 10).join(', ')}`
            : '';

          const userMsg = `Round ${round}. Here is the discussion so far:\n\n${feedText.slice(-3000)}${memoryText}${connectionsText}\n\nWrite your next post. Return JSON only.`;

          const postData = await llmCompleteJSON(this.config, [
            { role: 'system', content: system },
            { role: 'user', content: userMsg },
          ], { temperature: 0.8, maxTokens: 300 }) as Record<string, unknown>;

          if (postData && postData.post) {
            const post: Post = {
              post_id: `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
              round_num: round,
              agent_id: agent.profile.agent_id,
              agent_name: agent.profile.entity_name,
              agent_type: agent.profile.entity_type,
              content: String(postData.post),
              reply_to: postData.reply_to ? String(postData.reply_to) : undefined,
              is_reply_to: postData.reply_to ? String(postData.reply_to) : undefined,
              stance: String(postData.current_stance || agent.currentStance),
            };

            roundPosts.push(post);
            agent.postCount++;

            // Track stance shift
            const newStance = String(postData.current_stance || agent.currentStance);
            if (newStance !== agent.currentStance) {
              this.stanceShifts.push({
                agent: agent.profile.entity_name,
                round,
                from: agent.currentStance,
                to: newStance,
                reason: String(postData.stance_reason || ''),
              });
              agent.currentStance = newStance;
            }

            agent.memory.push(`R${round}: I said: ${postData.post}`);
          }
        } catch (err) {
          console.error(`Agent ${agent.profile.entity_name} error in round ${round}:`, err);
        }
      }

      // Update feed
      for (const p of roundPosts) {
        const replyPrefix = p.reply_to ? ` (replying to @${p.reply_to})` : '';
        feedText += `\n[R${round}] ${p.agent_name}${replyPrefix}: ${p.content}`;
      }

      this.posts.push(...roundPosts);

      this.update({
        phase: 'simulation',
        progress: 40 + Math.round((round / totalRounds) * 40),
        message: `Round ${round}/${totalRounds}, ${this.posts.length} posts so far...`,
        posts: [...this.posts],
        profiles: this.profiles,
      });
    }

    // Compute clusters
    const stanceGroups: Record<string, string[]> = {};
    for (const a of agents) {
      const s = a.currentStance.toLowerCase();
      if (!stanceGroups[s]) stanceGroups[s] = [];
      stanceGroups[s].push(a.profile.entity_name);
    }
    this.clusters = stanceGroups;
  }

  // -- Stage 5: Report --

  private async generateReport(goal: string) {
    const facts = this.gatherFacts();
    this.simFacts = facts;

    const markdown = await llmComplete(this.config, [
      { role: 'system', content: REPORT_SYSTEM },
      { role: 'user', content: `Prediction goal: ${goal}\n\nSimulation data:\n${facts.slice(0, 8000)}\n\nWrite the full prediction report in Markdown.` },
    ], { temperature: 0.5, maxTokens: 3000 });

    this.reportMarkdown = cleanText(`# Prediction Report\n\n${markdown}`);
  }

  // -- Chat --

  async chat(question: string, history: { role: string; content: string }[] = []): Promise<string> {
    if (!this.simFacts) this.simFacts = this.gatherFacts();

    const system = CHAT_SYSTEM_TEMPLATE.replace('{context}', this.simFacts.slice(0, 8000));
    const messages: { role: string; content: string }[] = [
      { role: 'system', content: system },
      ...history.slice(-10),
      { role: 'user', content: question },
    ];

    const answer = await llmComplete(this.config, messages, { temperature: 0.6, maxTokens: 1500 });
    return cleanText(answer);
  }

  private gatherFacts(): string {
    const lines: string[] = [];

    for (const [type, count] of Object.entries(this.graph.entityTypeCounts())) {
      lines.push(`- ${type}: ${count}`);
    }

    if (this.posts.length) {
      lines.push('\n## Discussion Posts');
      for (const p of this.posts.slice(-40)) {
        const stanceTag = p.stance ? ` [${p.stance}]` : '';
        const replyTag = p.reply_to ? ` (replying to ${p.reply_to})` : '';
        lines.push(`[R${p.round_num}] ${p.agent_name}${stanceTag}${replyTag}: ${p.content}`);
      }
    }

    if (this.stanceShifts.length) {
      lines.push('\n## Stance Shifts');
      for (const s of this.stanceShifts) {
        lines.push(`- ${s.agent} shifted from ${s.from} to ${s.to} in round ${s.round}: ${s.reason}`);
      }
    }

    if (Object.keys(this.clusters).length) {
      lines.push('\n## Final Stance Clusters');
      for (const [stance, members] of Object.entries(this.clusters)) {
        lines.push(`- ${stance}: ${members.join(', ')}`);
      }
    }

    return lines.join('\n');
  }
}

function cleanText(text: string): string {
  return text
    .replace(/\u2014/g, ', ')
    .replace(/\u2013/g, '-')
    .replace(/ , ,/g, ',')
    .replace(/,,/g, ',');
}
