import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LabelPage from './views/Label';
import registerServiceWorker from './registerServiceWorker';
import App from 'BizComponent/App';

// ReactDOM.render(<App />, document.getElementById('root'));

App.renderDOM(LabelPage);

registerServiceWorker();
