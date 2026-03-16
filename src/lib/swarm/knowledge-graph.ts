/**
 * Knowledge Graph - in-memory graph of entities and relationships.
 * Direct port from the Python KnowledgeGraph model.
 */

let counter = 0;
function uid(prefix: string): string {
  return `${prefix}_${(++counter).toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export interface Entity {
  uid: string;
  name: string;
  entityType: string;
  summary: string;
}

export interface Relationship {
  uid: string;
  sourceUid: string;
  targetUid: string;
  relationType: string;
  description: string;
}

export class KnowledgeGraph {
  entities: Map<string, Entity> = new Map();
  relationships: Map<string, Relationship> = new Map();
  private outgoing: Map<string, Set<string>> = new Map();
  private incoming: Map<string, Set<string>> = new Map();

  addEntity(name: string, entityType: string, summary = ''): Entity {
    const id = uid('e');
    const ent: Entity = { uid: id, name, entityType, summary };
    this.entities.set(id, ent);
    this.outgoing.set(id, new Set());
    this.incoming.set(id, new Set());
    return ent;
  }

  addRelationship(sourceUid: string, targetUid: string, relationType: string, description = ''): Relationship {
    const id = uid('r');
    const rel: Relationship = { uid: id, sourceUid, targetUid, relationType, description };
    this.relationships.set(id, rel);
    if (!this.outgoing.has(sourceUid)) this.outgoing.set(sourceUid, new Set());
    if (!this.incoming.has(targetUid)) this.incoming.set(targetUid, new Set());
    this.outgoing.get(sourceUid)!.add(id);
    this.incoming.get(targetUid)!.add(id);
    return rel;
  }

  entityTypeCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const e of this.entities.values()) {
      counts[e.entityType] = (counts[e.entityType] || 0) + 1;
    }
    return counts;
  }
}
