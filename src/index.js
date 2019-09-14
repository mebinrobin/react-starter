import React from 'react';
import { render } from 'react-dom';
import './index.scss';

import App from './components/app';

const rootElement = document.getElementById('app');

render(<App />, rootElement);
