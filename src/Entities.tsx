import * as React from 'react';
import "./Entities.scss"
import { nameToHSL } from './utils';

export interface Span {
  kind: 'span';
  value: string;
}

export interface Bold {
  kind: 'bold';
  value: string;
}

export interface Code {
  kind: 'code';
  value: string;
}

export interface Character {
  kind: 'character'
  player_id: number;
  value: string;
  full_name: string;
}

export interface Me {
  kind: 'me';
  player_id: number;
  value: string;
  full_name: string;
}

export interface RollResult {
  kind: 'roll';
  value: string;
  result: number;
}

export interface LoopResult {
  kind: 'loop-roll';
  rolled: number[];
}

export interface CocResult {
  kind: 'coc-roll';
  rolled: number;
  level: string;
  modifier_name: string;
  rolled_list: number[];
}

export type Entity = Bold | Span | Code | Character | Me | LoopResult | RollResult | CocResult;

export const Entities = ({ entities }: { entities: Entity[] }) => {
  const entityList = entities.map((entity, index) => {
    if (entity.kind === 'span') {
      return <span key={index}>{entity.value}</span>
    } else if (entity.kind === 'bold') {
      return <strong key={index}>{entity.value}</strong>
    } else if (entity.kind === 'code') {
      return <code key={index}>{entity.value}</code>
    } else if (entity.kind === 'roll') {
      return <code className="roll" key={index}>{entity.value}</code>
    } else if (entity.kind === 'coc-roll') {
      const cocClassName = ['coc-roll'];
      let modifier = null;
      if (entity.modifier_name) {
        cocClassName.push('coc-modifier');
        const rolledList = entity.rolled_list.map(String).join(', ');
        modifier = <span className="modifier-box">{entity.modifier_name}: <code>[{rolledList}]</code></span>
      }
      return (
        <div className={cocClassName.join(' ')} key={index}>
          {entity.rolled} <strong>{entity.level}</strong> {modifier}
        </div>
      )
    } else if (entity.kind === "me" || entity.kind === "character") {
      const color = nameToHSL(entity.value);
      return (
        <span className="character" style={{color}} title={entity.full_name} key={index}>{entity.value}</span>
      )
    } else {
      return <span className="entity-unknown" key={index}>UNKNOWN</span>
    }
  });
  return <div className="entities">{entityList}</div>
};
