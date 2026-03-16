'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const TYPE_COLORS = [
  '#e5484d', '#3b82f6', '#30a46c', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#14b8a6',
];

interface Profile {
  entity_name?: string;
  username?: string;
  entity_type?: string;
  stance?: string;
  entity_summary?: string;
  bio?: string;
}

interface Post {
  agent_name?: string;
  round_num?: number;
  is_reply_to?: string;
  content?: string;
}

interface Props {
  profiles: Profile[];
  posts: Post[];
  width?: number;
  height?: number;
}

interface SelectedNode {
  name: string;
  type: string;
  stance: string;
  summary: string;
  posts: number;
  recentPosts: string[];
}

export function SwarmGraph({ profiles, posts, width = 800, height = 700 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<SelectedNode | null>(null);

  useEffect(() => {
    if (!svgRef.current || profiles.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const entityTypes = [...new Set(profiles.map((p) => p.entity_type || 'Person'))];
    const typeColor = (type: string) => TYPE_COLORS[entityTypes.indexOf(type) % TYPE_COLORS.length] || '#888';

    const nodes = profiles.map((p, i) => ({
      id: i,
      name: p.entity_name || p.username || `Agent ${i}`,
      type: p.entity_type || 'Person',
      stance: p.stance || 'neutral',
      summary: p.entity_summary || p.bio || '',
      posts: 0,
      radius: 6,
      x: width / 2,
      y: height / 2,
      recentPosts: [] as string[],
    }));

    const nameMap: Record<string, (typeof nodes)[0]> = {};
    nodes.forEach((n) => { nameMap[n.name.toLowerCase()] = n; });
    for (const post of posts) {
      const n = nameMap[(post.agent_name || '').toLowerCase()];
      if (n) {
        n.posts++;
        if (post.content && n.recentPosts.length < 3) {
          n.recentPosts.push(post.content.slice(0, 150) + (post.content.length > 150 ? '...' : ''));
        }
      }
    }
    const maxPosts = Math.max(...nodes.map((n) => n.posts), 1);
    nodes.forEach((n) => { n.radius = 5 + (n.posts / maxPosts) * 15; });

    const links: { source: number; target: number; type: string }[] = [];
    const roundGroups: Record<number, string[]> = {};
    for (const post of posts) {
      const rnd = post.round_num || 1;
      if (!roundGroups[rnd]) roundGroups[rnd] = [];
      roundGroups[rnd].push(post.agent_name || '');
      if (post.is_reply_to) {
        const src = nameMap[(post.agent_name || '').toLowerCase()];
        const tgt = nameMap[(post.is_reply_to || '').toLowerCase()];
        if (src && tgt && src.id !== tgt.id) links.push({ source: src.id, target: tgt.id, type: 'reply' });
      }
    }
    for (const agents of Object.values(roundGroups)) {
      const unique = [...new Set(agents)];
      for (let i = 0; i < unique.length; i++) {
        for (let j = i + 1; j < unique.length; j++) {
          const a = nameMap[unique[i].toLowerCase()];
          const b = nameMap[unique[j].toLowerCase()];
          if (a && b && !links.find((l) => (l.source === a.id && l.target === b.id) || (l.source === b.id && l.target === a.id))) {
            links.push({ source: a.id, target: b.id, type: 'interaction' });
          }
        }
      }
    }

    const pad = 40;
    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => d.radius + 6))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    const g = svg.append('g');
    svg.call(
      d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.3, 4]).on('zoom', (e) => {
        g.attr('transform', e.transform.toString());
      }) as any
    );

    const link = g.append('g').selectAll('line').data(links).join('line')
      .attr('stroke', (d) => d.type === 'reply' ? '#555' : '#222')
      .attr('stroke-width', (d) => d.type === 'reply' ? 1.5 : 0.5)
      .attr('stroke-opacity', (d) => d.type === 'reply' ? 0.8 : 0.3);

    const node = g.append('g').selectAll('circle').data(nodes).join('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => typeColor(d.type))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .attr('cursor', 'pointer')
      .on('click', (_event, d: any) => {
        setSelected({
          name: d.name,
          type: d.type,
          stance: d.stance,
          summary: d.summary,
          posts: d.posts,
          recentPosts: d.recentPosts || [],
        });
      });

    const labels = g.append('g').selectAll('text').data(nodes).join('text')
      .text((d) => d.name.length > 14 ? d.name.slice(0, 12) + '...' : d.name)
      .attr('font-size', '9px')
      .attr('fill', '#888')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => d.radius + 12)
      .style('pointer-events', 'none');

    simulation.on('tick', () => {
      nodes.forEach((d: any) => {
        d.x = Math.max(pad, Math.min(width - pad, d.x));
        d.y = Math.max(pad, Math.min(height - pad, d.y));
      });
      link
        .attr('x1', (d: any) => d.source.x).attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x).attr('y2', (d: any) => d.target.y);
      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
      labels.attr('x', (d: any) => d.x).attr('y', (d: any) => d.y);
    });

    return () => { simulation.stop(); };
  }, [profiles, posts, width, height]);

  return (
    <div className="relative w-full h-full bg-muted/20 overflow-hidden">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      />
      {selected && (
        <div className="absolute bottom-4 left-4 right-4 max-w-sm rounded-lg border border-border bg-background p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-sm">{selected.name}</h4>
              <p className="text-xs text-muted-foreground">{selected.type} · {selected.posts} posts · Stance: {selected.stance}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground text-xs ml-2">✕</button>
          </div>
          {selected.summary && (
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{selected.summary}</p>
          )}
          {selected.recentPosts.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-xs font-medium">Recent posts:</p>
              {selected.recentPosts.map((p, i) => (
                <p key={i} className="text-xs text-muted-foreground leading-relaxed border-l-2 border-border pl-2">{p}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
