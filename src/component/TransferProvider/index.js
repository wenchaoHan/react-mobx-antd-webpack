import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Transfer } from 'bach-antd';
import Icon from 'BizComponent/Icon';

import styles from './transform.css';

class TransferProvider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      keyWord: '',
      targetKeys: props.targetKeys,
      computedTargetKeys: props.targetKeys.slice(0),
      dataSource: props.dataSource,

    };

    this.diffArray = this.diffArray.bind(this);
    this.getItemsWithKeys = this.getItemsWithKeys.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.upClickHandler = this.upClickHandler.bind(this);
    this.indexOfArray = this.indexOfArray.bind(this);
    this.renderTransferItem = this.renderTransferItem.bind(this);
    this.transferSearchChangeHandler = this.transferSearchChangeHandler.bind(this);
    this.filterComputedKeys = this.filterComputedKeys.bind(this);
    // below is calld for outer..
    this.getSelectedItem = this.getSelectedItem.bind(this);
    this.getSelectedKeys = this.getSelectedKeys.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.targetKeys) {
      const targetKeys = nextProps.targetKeys;
      const computedTargetKeys = nextProps.targetKeys.slice(0);
      const dataSource = nextProps.dataSource;
      this.setState({ targetKeys, computedTargetKeys, dataSource });
    }
  }

  getSelectedKeys() {
    return this.state.targetKeys;
  }

  getSelectedItem() {
    return this.getItemsWithKeys(this.state.targetKeys);
  }

  getItemsWithKeys(keys) {
    const ret = [];
    const ds = this.state.dataSource;
    keys.forEach((key) => {
      for (let i = 0, len = ds.length; i < len; i += 1) {
        const item = ds[i];
        if (item.key === key) {
          ret.push(item);
          break;
        }
      }
    });
    return ret;
  }

  handleChange(targetKeys) {
    this.setState({ targetKeys }, () => {
      this.filterComputedKeys();
    });
  }

  indexOfArray(obj, array) {
    const index = array.findIndex(item => (obj === item || obj === item.key));
    return index;
  }

  diffArray(source, target) {
    if (!source || !target) {
      return true;
    }
    if (!(source instanceof Array) && !(target instanceof Array)) {
      return true;
    }
    if (source.length !== target.length) {
      return true;
    }
    for (let i = 0; i < source.length; i += 1) {
      if (source[i] !== target[i]) {
        return true;
      }
    }
    return false;
  }

  upClickHandler(key) {
    const targetKeys = Array.of(...this.state.targetKeys);
    const index = this.indexOfArray(key, targetKeys);
    if (index === 0) return;
    const tmp = targetKeys[index];
    targetKeys[index] = targetKeys[index - 1];
    targetKeys[index - 1] = tmp;
    const computedTargetKeys = targetKeys.slice(0);
    this.setState({ targetKeys, computedTargetKeys });
  }

  downClickHandler(key) {
    const targetKeys = Array.of(...this.state.targetKeys);
    const index = this.indexOfArray(key, targetKeys);
    if (index === this.state.targetKeys.length - 1) return;
    const tmp = targetKeys[index];
    targetKeys[index] = targetKeys[index + 1];
    targetKeys[index + 1] = tmp;
    const computedTargetKeys = targetKeys.slice(0);
    this.setState({ targetKeys, computedTargetKeys });
  }

  transferSearchChangeHandler(direction, event) {
    const keyWord = event.target.value;

    if (direction === 'right') {
      this.setState({ keyWord });
    }
    if (direction === 'left') {
      this.props.searchChange(keyWord);
    }
  }

  filterComputedKeys() {
    const keyWord = this.state.keyWord;
    if (!keyWord) {
      if (!this.diffArray(this.state.targetKeys, this.state.computedTargetKeys)) {
        return;
      }
      this.setState({ computedTargetKeys: this.state.targetKeys.slice(0) });
      return;
    }
    const computedTargetKeys = [];
    this.state.dataSource.forEach((item) => {
      const key = item.key;
      if (this.indexOfArray(key, this.state.targetKeys) >= 0) {
        if (item.title.indexOf(keyWord) >= 0) {
          computedTargetKeys.push(key);
        }
      }
    });
    this.setState({ computedTargetKeys });
  }

  renderTransferItem(item) {
    const index = this.indexOfArray(item.key, this.state.targetKeys);
    const { keyWord } = this.state;
    if (index < 0 || keyWord) {
      return item.title;
    }
    return (
      <span>
        {
        this.props.isAffair ?
          <span>
            <span>{item.title}</span>
            <span className={styles.transformFrame} />
          </span> :
          <span>
            <span className={styles.txt}>{item.title}</span>
            <span className={styles.transformFrame}>
              <span
                className={styles.transLeft}
                onClick={(e) => { e.stopPropagation(); this.downClickHandler(item.key); }}
              >
                <Icon type="down" className={styles.icon} />
              </span>
              <span
                className={styles.transRight}
                onClick={(e) => { e.stopPropagation(); this.upClickHandler(item.key); }}
              >
                <Icon type="up" className={styles.icon} />
              </span>
            </span>
          </span>
      }
      </span>);
  }

  render() {
    const { titles, operations, showSearch, listStyle } = this.props;
    return (
      <Transfer
        className="l-form-transfer margin-bottom-middle"
        titles={titles}
        listStyle={listStyle}
        operations={operations}
        showSearch={showSearch}
        targetKeys={this.state.computedTargetKeys}
        dataSource={this.state.dataSource}
        onChange={this.handleChange}
        render={item => this.renderTransferItem(item)}
        onSearchChange={this.transferSearchChangeHandler}
        fetchSearch={this.props.fetchSearch}
      />
    );
  }
}

TransferProvider.propTypes = {
  titles: PropTypes.arrayOf(PropTypes.string),
  operations: PropTypes.arrayOf(PropTypes.string),
  dataSource: PropTypes.arrayOf(PropTypes.object),
  showSearch: PropTypes.bool,
  // 店务盘点
  isAffair: PropTypes.bool,
  targetKeys: PropTypes.arrayOf(PropTypes.string),
  listStyle: PropTypes.oneOfType([PropTypes.object]),
  fetchSearch: PropTypes.func,
  searchChange: PropTypes.func,
};

TransferProvider.defaultProps = {
  listStyle: {},
  isAffair: false,
  fetchSearch: null,
  searchChange: () => {},
};


export default TransferProvider;
