import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'bach-antd';
import Notification from 'BizComponent/Notification';

import RadioTabPane from './pane';

class RadioTab extends Component {

  constructor(props) {
    super(props);

    let hash = `${window.location.hash}`;
    let activeKey = '';
    const level = props.level - 0;

    if (hash.length) {
      hash = hash.substr(1);
      if (hash.substr(0, 1) === '/') {
        hash = hash.substr(1);
      }
      const hashArray = hash.split('/');
      if (hashArray.length > level && hashArray[level]) {
        activeKey = hashArray[level];
      }
    }

    this.state = {
      level,
      activeKey,
      tabList: [],
    };

    this.radioChangeHandler = this.radioChangeHandler.bind(this);
  }

  getChildContext() {
    return {
      contextActiveKey: this.state.activeKey,
    };
  }


  componentDidMount() {
    const { children } = this.props;
    // console.log(children);
    if (children && children instanceof Array) {
      const tabList = [];
      children.forEach((item) => {
        tabList.push({
          tab: item.props.tab,
          key: item.props.skey,
        });
      });
      let activeKey = this.state.activeKey;
      if (activeKey === '') {
        activeKey = tabList[0].key;
      }
      /* eslint-disable react/no-did-mount-set-state */
      this.setState({ tabList, activeKey });
    } else {
      const error = new Error('既然tab，怎么都得传俩东西吧!');
      Notification.error(error);
    }
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
    hashArray[this.state.level] = key;
    window.location.hash = `/${hashArray.join('/')}`;
    const activeKey = key;
    this.setState({ activeKey });
  }

  render() {
    const { children } = this.props;
    const displayTxt = this.props.hideTab ? 'none' : 'block';
    return (
      <div>
        <div style={{ display: displayTxt }}>
          <Radio.Group
            value={this.state.activeKey}
            size="large"
            onChange={this.radioChangeHandler}
          >
            {this.state.tabList.map(item =>
              <Radio.Button
                key={item.key}
                value={item.key}
              >
                {item.tab}
              </Radio.Button>)}
          </Radio.Group>
        </div>
        <div>
          {children}
        </div>
      </div>
    );
  }
}

RadioTab.propTypes = {
  /* eslint-disable react/no-unused-prop-types */
  activeKey: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element),
  level: PropTypes.number,
  hideTab: PropTypes.bool,
};

RadioTab.defaultProps = {
  level: 0,
  hideTab: false,
};

RadioTab.childContextTypes = {
  contextActiveKey: React.PropTypes.string,
};

RadioTab.Pane = RadioTabPane;

export default RadioTab;
