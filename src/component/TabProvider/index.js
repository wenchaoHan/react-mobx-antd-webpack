import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Radio, Tabs } from 'bach-antd';
import { observer } from 'mobx-react';
import Rbac from 'BizComponent/Rbac';

import TabPane from './pane';

@observer
class TabProvider extends Component {

  constructor(props) {
    super(props);
    this.radioChangeHandler = this.radioChangeHandler.bind(this);
    this.getRadio = this.getRadio.bind(this);
    this.renderAnt = this.renderAnt.bind(this);
    this.renderRadio = this.renderRadio.bind(this);
    this.antChangeHandler = this.antChangeHandler.bind(this);
    this.getLevelAndKey = this.getLevelAndKey.bind(this);
    this.hashChangeHandler = this.hashChangeHandler.bind(this);
    this.getLevelAndKey();
  }

  getChildContext() {
    return {
      contextActiveKey: this.state.activeKey,
      destory: this.props.destory,
    };
  }

  componentDidMount() {
    this.load = true;
    window.addEventListener('hashchange', this.hashChangeHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.hashChangeHandler);
  }

  getLevelAndKey() {
    let hash = `${window.location.hash}`;
    const level = this.props.level - 0;

    let hashArray = [];
    let activeKey = '';
    let tabList = [];

    if (hash.length) {
      hash = hash.substr(1);
      if (hash.substr(0, 1) === '/') {
        hash = hash.substr(1);
      }
      hashArray = hash.split('/');
      if (hashArray.length > level && hashArray[level]) {
        activeKey = hashArray[level];
        if (this.load) {
          this.setState({ hashArray, activeKey });
        } else {
          this.state = Object.assign({}, this.state, { hashArray, activeKey });
        }
      }
    }

    let { children } = this.props;
    if (children) {
      if (!(children instanceof Array)) {
        children = [children];
      }
      tabList = [];
      children.forEach((item) => {
        tabList.push({
          tab: item.props.tab,
          key: item.props.route.trim(),
        });
      });
      if (!activeKey) { // TODO 有 bug 啊，如果第一个没有显示呢
        activeKey = tabList[0].key;
      }
    }
    if (this.load) {
      this.setState({ tabList, hashArray, activeKey });
    } else {
      this.state = Object.assign({}, this.state, { tabList, hashArray, activeKey });
    }
  }

  getRadio() {
    const { radio, hideTab, children } = this.props;
    if (radio) {
      const displayTxt = hideTab ? 'none' : 'block';
      return (
        <div style={{ display: displayTxt, marginBottom: '16px' }}>
          <Radio.Group
            value={this.state.activeKey}
            size="large"
            onChange={this.radioChangeHandler}
          >
            {this.state.tabList.map((item, index) => {
              const child = children[index];
              const { show } = child.props;
              if (!show) {
                return null;
              }
              return (<Radio.Button
                key={item.key}
                value={item.key}
              >
                {item.tab}
              </Radio.Button>);
            })}
          </Radio.Group>
        </div>);
    }
    return null;
  }

  radioChangeHandler(e) {
    const key = e.target.value;
    let hash = `${window.location.hash}`;
    if (hash.length) {
      hash = hash.substr(1);
      if (hash.substr(0, 1) === '/') {
        hash = hash.substr(1);
      }
    }
    const hashArray = hash.split('/');
    hashArray[this.props.level] = key;
    window.location.hash = `/${hashArray.join('/')}`;
    const activeKey = key;
    this.setState({ activeKey });
    if (this.props.onChange) {
      this.props.onChange(key);
    }
  }

  antChangeHandler(key) {
    let hash = `${window.location.hash}`;
    if (hash.length) {
      hash = hash.substr(1);
      if (hash.substr(0, 1) === '/') {
        hash = hash.substr(1);
      }
    }
    const hashArray = hash.split('/');
    hashArray[this.props.level] = key;
    hash = '';
    for (let i = 0; i <= this.props.level; i += 1) {
      hash += `/${hashArray[i]}`;
    }
    window.location.hash = hash;
    const activeKey = key;
    this.setState({ activeKey });
    if (this.props.onChange) {
      this.props.onChange(key);
    }
  }

  hashChangeHandler() {
    let hash = `${window.location.hash}`;
    if (hash.length) {
      hash = hash.substr(1);
      if (hash.substr(0, 1) === '/') {
        hash = hash.substr(1);
      }
    }
    const hashArray = hash.split('/');
    const currentHash = hashArray[this.props.level];
    if (currentHash === this.state.activeKey) {
      return;
    }
    this.getLevelAndKey();
  }

  renderAntChildren = (item) => {
    const destory = this.state.activeKey !== (item.key.trim()) && this.props.destory;
    if (destory) {
      return <div>Loading ...</div>;
    }
    return (typeof item.props.children === 'string' ? <span>{item.props.children}</span> :
      React.cloneElement(item.props.children));
  };

  renderAnt = () => {
    let { children } = this.props;
    const { rbac } = this.props;
    if (children) {
      if (!(children instanceof Array)) {
        children = [children];
      }
    } else {
      children = [];
    }
    const uriMap = {}; // 提取配置rbac 的 tab uri
    if (rbac) {
      Object.keys(rbac).forEach(key => (uriMap[key] = rbac[key].props.uri));
    }

    return (
      <Tabs
        onChange={this.antChangeHandler}
        activeKey={this.state.activeKey}
        type={this.props.type}
        size={this.props.size}
        className={this.props.className}
      >

        {
        // React.Children.map 会自动产生 $ 开头的 key，导致原 key 失效
        children.map((item) => {
          const { show, route, tab } = item.props;
          const uri = uriMap[route];
          const noRbac = uri && !Rbac.store.authed.get(uri);
          if (noRbac || !show) {
            return null;
          }
          return (
            <Tabs.TabPane
              key={route.trim()}
              tab={tab}
            >
              {this.renderAntChildren(item)}
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    );
  }

  renderRadio() {
    const { children } = this.props;
    return (
      <div>
        {this.getRadio()}
        {children}
      </div>
    );
  }

  render() {
    const { radio } = this.props;
    return radio ? this.renderRadio() : this.renderAnt();
  }
}

TabProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  level: PropTypes.number,
  hideTab: PropTypes.bool,
  radio: PropTypes.bool,
  type: PropTypes.string,
  size: PropTypes.string,
  destory: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
  rbac: PropTypes.object,
};

TabProvider.defaultProps = {
  level: 0,
  hideTab: false,
  radio: false,
  type: 'line',
  size: 'default',
  destory: false,
};

TabProvider.childContextTypes = {
  contextActiveKey: PropTypes.string,
  destory: PropTypes.bool,
};

TabProvider.Pane = TabPane;

export default TabProvider;
