import * as React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, match } from "react-router-dom";
import axios from 'axios';
import './App.scss';
import { GraphQL } from './graphql';
import { ChatPage } from './Chat';

interface Chat {
  id: number;
  created: Date;
  title: string;
  counter: number;
  hasPassword: boolean;
}

function Index() {
  const [chats, setChats] = useState<Chat[]>([])
  useEffect(() => {
    getChats()
      .then(setChats)
  }, [])

  const chat_list = chats.map(chat => {
    if (chat.counter == 0) {
      return null;
    }
    return (
      <article key={chat.id}>
        <h1 className="title">
          <Link to={`/chat/${chat.id}`}>{chat.title}</Link> <span className="tag is-info">{chat.counter}</span>
        </h1>
      </article>
    )
  });


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
          {chat_list}
        </div>
      </section>
    </>
  );
}

const getChats = (): Promise<Chat[]> => {
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
  `
  return axios.get(GraphQL, { params: { query } })
    .then(({ data }) => data.data.chats as Chat[]);
}


export const App = () => {

  return (
    <Router>
      <Route path="/" exact component={Index} />
      <Route path="/chat/:id" exact component={ChatPage} />
    </Router>
  )
}
