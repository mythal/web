import * as React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, match } from "react-router-dom";
import axios from 'axios';
import './App.scss';
import { GraphQL, runQuery } from './graphql';
import { ChatPage } from './Chat';

interface ChatData {
  id: number;
  created: Date;
  title: string;
  counter: number;
  hasPassword: boolean;
}

const Chat = ({ chat }: { chat: ChatData }) => {

  if (chat.counter === 0) {
    return null;
  }
  const tag = (
    <span className="tag is-info">
      {chat.hasPassword ? <span className="icon"><i className="fas fa-lock"/> </span> : null}
      {chat.counter}
    </span>
  );
  return (
    <article>
      <h1 className="title">
        <Link to={`/chat/${chat.id}`}>{chat.title}</Link> {tag}
      </h1>
    </article>
  );
};

function Index() {
  const [chats, setChats] = useState<ChatData[]>([]);
  useEffect(() => {
    getChats()
      .then(setChats)
  }, []);

  const chatList = chats.map(chat => <Chat key={chat.id} chat={chat}/>);

  return (
    <>
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              Adventures
            </h1>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {chatList}
        </div>
      </section>
    </>
  );
}

const getChats = (): Promise<ChatData[]> => {
  const query = `
  {
    chats {
      id
      created
      title
      counter
      hasPassword
    }
  }  
  `;
  return runQuery<{ chats: ChatData[] }>(query).then(result => result.chats);
};

export const App = () => {

  return (
    <Router>
      <Route path="/" exact={true} component={Index} />
      <Route path="/chat/:id/tag/:tagId/page/:page" exact={true} component={ChatPage} />
      <Route path="/chat/:id/tag/:tagId" exact={true} component={ChatPage} />
      <Route path="/chat/:id/page/:page" exact={true} component={ChatPage} />
      <Route path="/chat/:id" exact={true} component={ChatPage} />
    </Router>
  )
};
