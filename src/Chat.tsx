import * as React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, match } from "react-router-dom";
import { runQuery } from './graphql';


interface Span {
  kind: 'span';
  value: string;
}

interface Bold {
  kind: 'bold';
  value: string;
}

interface Code {
  kind: 'code';
  value: string;
}

type Entity = Bold | Span | Code;

interface Log {
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
}

interface Chat {
  id: number;
  created: string;
  title: string;
  counter: number;
  hasPassword: boolean;
  logs: Log[];
}

const getChat = (id: number, password: string = ''): Promise<Chat> => {
    const query = `
    query getChat($id: Int, $password: String) {
      chat(id: $id) {
        created
        title
        counter
        hasPassword
        logs(password: $password) {
          id
          content
          entities
          messageId
          userFullname
          characterName
          kind
          media
          gm
          reply { id }
          created
        }
      }
    }
    `
    return runQuery<{ chat: Chat }>(query, { id, password })
      .then(({ chat }) => chat);
}



interface Props {
    match: match<{id: string}>;
}


export const ChatPage = ({ match }: Props) => {
    const id = parseInt(match.params.id);
    const [chat, setChat] = useState<Chat | undefined>(undefined);
    useEffect(() => {
      getChat(id, '123').then(setChat)
    }, []);
    if (!chat) {
      return <h1>loading</h1>
    }

    const log_list = chat.logs.map(log => {
      const entities = log.entities.map((entity, index) => {
        if (entity.kind === 'span') {
          return <span key={index}>{entity.value}</span>
        } else if (entity.kind === 'bold') {
          return <strong key={index}>{entity.value}</strong>
        } else if (entity.kind === 'code') {
          return <code key={index}>{entity.value}</code>
        } else {
          return <span key={index}>UNKNOWN</span>
        }
      })
      return (
        <div key={log.id}>
          <p className="is-family-sans-serif">{entities}</p>
        </div>
      )
    })
    return (
      <>
        <section className="hero">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                {chat.title}
              </h1>
              <Link to='/' className="button">Back</Link>

            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            {log_list}
          </div>
        </section>
      </>
    )

  }
