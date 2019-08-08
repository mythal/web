import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './App';

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
console.log(process.env.API_URL || 'None');
