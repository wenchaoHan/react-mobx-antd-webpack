// polyfill
import 'es6-shim';
// import 'BizUtils/matchMedia';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
// import 'BizUtils/collection';
import "antd/dist/antd.css";
import './index.css';

// import rbacStore from '../Rbac/store';
// import enumStore from '../Enum/store';
import Menu from './Menu/index.js';
import BizHeader from './Header/index.js';
import Crumb from './Crumb/index.js';

const { Header, Sider, Content } = Layout;

class App extends Component {
  componentDidMount() {
    // rbacStore.fetch();
    // enumStore.fetch();
  }

  render() {
    const { children, hideNav, expand } = this.props;
    return (
      <Layout className="container">
        <Header
          height="64"
          className={hideNav ? "hideHeader" : "header"}
        >
          <BizHeader />
        </Header>
        <Layout className="bodyWrapper">
          { expand ? null :
          <Sider className={(hideNav || expand) ? "hideSide" : "side"}>
            <Menu />
          </Sider>
          }
          { expand ?
            <div classNam="contentExpand">
              <Crumb />
              <div className="content">{children}</div>
            </div> :
            <Content className="contentWrap" id="layout-content">
              <Crumb />
              <div className="content">{children}</div>
            </Content>
          }
        </Layout>
      </Layout>
    );
  }
}

App.renderDOM = (Page, props) => {
  ReactDOM.render(<Page {...props} />, document.getElementById('app'));
};

App.propTypes = {
  hideNav: PropTypes.bool,
  expand: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
  ]),
};

App.defaultProps = {
  hideNav: false,
  children: [],
};


export default App;
