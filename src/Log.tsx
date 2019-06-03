import * as React from 'react';
import { Entities, Entity } from './Entities';
import './Log.scss';
import { Tag } from './Chat';
import { Link } from 'react-router-dom';
import { mediaUrl, nameToHSL, url } from './utils';

export interface LogData {
  id: string;
  content: string;
  entities: Entity[];
  messageId: number;
  characterName: string;
  userFullname: string;
  kind: string;
  media: string;
  gm: boolean;
  reply: { id: string } | null;
  created: string;
  tag: Tag[];
}

interface Props {
  log: LogData;
  chatId: number;
}

export const Log = ({ log, chatId }: Props) => {
  const entities = <Entities entities={log.entities} />;
  const { kind } = log;
  let content = <><span className="character">{log.characterName}: </span> {entities}</>;

  if (kind === "ROLL") {
    content = (
      <><span className="character">{log.characterName}</span> <i className="fas fa-dice"/> {entities}</>
    )
  } else if (kind === "HIDE_ROLL") {
    content = (
      <><span className="character">{log.characterName}</span> HIDED</>
    )
  } else if (kind === "ME") {
    content = entities;
  }
  const tagList = log.tag.map((tag, index) => (
    <Link to={`/chat/${chatId}/tag/${tag.id}`} className="tag" key={index}>#{tag.name}</Link>
  ));
  const classNames = ["Log", kind, "message", "is-primary"];
  if (log.gm) {
    classNames.push("is-gm", "is-info")
  }
  let logMedia = null;
  if (log.media) {
    logMedia = (
      <a href={mediaUrl(log.media)}>
        <img className="log-image" alt={log.content} src={mediaUrl(log.media)}/>
      </a>
    )
  }
  return (
    <div className={classNames.join(' ')} key={log.id} title={log.created}>
      <div className="message-body" style={{color: nameToHSL(log.characterName)}}>
        {content} {tagList}
        {logMedia}
      </div>
    </div>
  );
};
