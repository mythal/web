import * as React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, match } from "react-router-dom";
import { runQuery } from './graphql';
import { Entity } from './Entities';
import { NeedPassword } from './NeedPassword';
import { LogData, Log } from './Log';

export interface Tag {
  id: string;
  name: string;
}

interface LogList {
  totalPage: number;
  logList: LogData[];
  tagName: string | null;
}

interface Chat {
  id: number;
  created: string;
  title: string;
  counter: number;
  hasPassword: boolean;
  tagSet: Tag[];
  logList: LogList | null;
  pageCounter: number;
}

const getChat = (id: number, password: string = '', tagId: string = '', page: number = 1): Promise<Chat> => {
    const query = `
    query getChat($id: Int, $password: String, $tagId: String, $page: Int) {
      chat(id: $id) {
        id
        created
        title
        counter
        hasPassword
        pageCounter
        tagSet { id name }
        logList(password: $password, tagId: $tagId, page: $page) {
          totalPage
          tagName
          logList {
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
            tag { id name }
          }
        }
      }
    }
    `;
    return runQuery<{ chat: Chat }>(query, { id, password, tagId, page })
      .then(({ chat }) => chat);
};

const Loading = () => {
  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Loading...</h1>
        <progress className="progress is-large is-info" max="100">50%</progress>
      </div>
    </section>
  )
};

interface Props {
    match: match<{id: string, tagId?: string, page?: string}>;
}

export const ChatPage = ({ match }: Props) => {
  const id = Number(match.params.id);
  const tagId = match.params.tagId || "";
  const page = match.params.page ? Number(match.params.page) : 1;
  const passwordKey = `chat:${id}:password`;
  const [chat, setChat] = useState<Chat | undefined>(undefined);
  const [password, setPassword] = useState<string>(localStorage.getItem(passwordKey) || "");

  console.log(page);
  useEffect(() => {
    getChat(id, password, tagId || '', page).then(setChat)
  }, [password, tagId, page]);
  if (!chat) {
    return <Loading/>;
  }

  const onSubmitPassword = (newPassword: string) => {
    localStorage.setItem(passwordKey, newPassword);
    setPassword(newPassword);
  };

  if (chat.logList == null) {
    return <NeedPassword submit={onSubmitPassword} />;
  }

  const chatTag = (tag: Tag, index: number) => {
    if (tag.id === tagId) {
      return (
        <Link to={`/chat/${chat.id}/`} className="tag is-primary" key={index}>
          {tag.name}
        </Link>
      )
    }
    return (
      <Link to={`/chat/${chat.id}/tag/${tag.id}`} className="tag" key={index}>
        {tag.name}
      </Link>
    )
  };

  const linkToPage = (pageN: number) => {
    if (tagId) {
      return `/chat/${chat.id}/tag/${tagId}/page/${pageN}`;
    }
    return `/chat/${chat.id}/page/${pageN}`
  };

  const logList = chat.logList.logList.map(log => <Log key={log.id} log={log} chatId={id} />);

  const previous = (<Link to={linkToPage(page - 1)} className="pagination-previous">Previous</Link>);
  const nextPage = (<Link to={linkToPage(page + 1)} className="pagination-next">Next page</Link>);
  const pageLink = (pageN: number) => {
    let className = "pagination-link";
    if (pageN === page) {
      className = className + " is-current";
    }
    return (<li><Link to={ linkToPage(pageN) } className={ className }>{ pageN }</Link></li>);
  };
  const pageLinkList = [...Array(chat.logList.totalPage).keys()].map(i => pageLink(i + 1));
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
        <div className="container tags">
          {chat.tagSet.map(chatTag)}
        </div>
      </section>
      <section className="section">
        <div className="container">{logList}</div>

      </section>
      <section className="section">
        <div className="container">
          <nav className="pagination" role="pagination">
            {page > 1 ? previous : null}
            {page < chat.logList.totalPage ? nextPage : null}
            <ul className="pagination-list">
              {pageLinkList}
            </ul>
          </nav>
        </div>
      </section>

    </>
  )

};
