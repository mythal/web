import * as React from 'react';
import { useState, useEffect } from 'react';

export interface Props {
  submit: (password: string) => void;
}

export const NeedPassword = ({ submit }: Props) => {
  const [password, setPassword] = useState<string>("");

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setPassword(e.currentTarget.value);
  };

  const onClickSubmit: React.MouseEventHandler<HTMLButtonElement> = () => {
    submit(password);
  };

  return (
    <section className="section">
      <div className="container">
        <p>Need Password</p>
        <div className="field">
          <p className="control has-icons-left">
            <input className="input" type="password" onChange={onChange} />
            <span className="icon is-small is-left">
              <i className="fas fa-lock"/>
            </span>
          </p>
        </div>
        <p className="control">
          <button onClick={onClickSubmit} className="button is-primary" type="submit">Unlock</button>
        </p>
      </div>
    </section>
  )
};
