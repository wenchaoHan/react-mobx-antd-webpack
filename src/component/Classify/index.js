import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'BizComponent/Button';
import Rbac from 'BizComponent/Rbac';
import { Tree, Icon, Row, Col, Input } from 'bach-antd';
import store from './store';
import styles from './index.css';

const TreeNode = Tree.TreeNode;
/**
 * @ author       KyrieVing
 * @ date         2017-06-01
 * @ description  分类基本组件，支持列表拖拽，搜索过滤
 */
class Classify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suffix: ['', '', ''],
      LData: [],
      MData: [],
      SData: [],
      witch: 0,
    };
  }
  componentWillReceiveProps(NewProps) {
    if (this.props !== NewProps) {
      const { firstLevelList, secondLevelList, thirdLevelList } = NewProps;
      this.setState({
        LData: firstLevelList,
        MData: secondLevelList,
        SData: thirdLevelList,
      });
    }
  }
  onSearch = (e) => {
    const value = e.target.value;
    const index = parseInt(e.currentTarget.getAttribute('data-value'), 10);
    switch (index) {
      case 1 :
        this.setState({ suffix: [value, '', ''] });
        this.props.onSearch(value, index);
        break;
      case 2 :
        this.setState({ suffix: ['', value, ''] });
        this.props.onSearch(value, index);
        break;
      case 3 :
        this.setState({ suffix: ['', '', value] });
        this.props.onSearch(value, index);
        break;
      default :
        this.setState({ suffix: [value, '', ''] });
        this.props.onSearch(value, index);
        break;
    }
  }
  onDragStart = (index) => {
    this.setState({
      witch: parseInt(index, 10),
    });
  }
  onClick = (e) => {
    const data = JSON.parse(e.currentTarget.getAttribute('data-value'));
    this.props.onClick(data);
  }
  onDrop = (info) => {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    let dragIndex = null;
    let dropIndex = null;
    // const dropPos = info.node.props.pos.split('-');
    // const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.categoryCode === key || item.skuSaleCode === key) {
          return callback(item, index, arr);
        }
        return null;
      });
    };
    // 处理排列顺序
    const changeOrder = (data) => {
      data.forEach((item, index) => {
        if (item.categoryCode === dragKey) {
          dragIndex = index;
        }
        if (item.categoryCode === dropKey) {
          dropIndex = index;
        }
      });
      let mArr = [];
      // 向上拖拽
      if (dragIndex > dropIndex) {
        mArr = data.slice(dropIndex, dragIndex + 1);
        mArr.forEach((item, idx) => {
          if (idx === mArr.length - 1) {
            item.displaySeq = dropIndex + 1;
            // 更改显示的排列位置
            item.displayIndex = dropIndex + 1;
          } else {
            item.displaySeq += 1;
            // 更改显示的排列位置
            item.displayIndex += 1;
          }
        });
        const num = dragIndex - dropIndex;
        data.splice(dropIndex, num + 1, ...mArr);
      }
      // 向下拖拽
      if (dragIndex < dropIndex) {
        mArr = data.slice(dragIndex, dropIndex + 1);
        mArr.forEach((item, idx) => {
          if (idx === 0) {
            item.displaySeq = dropIndex + 1;
            // 更改显示的排列位置
            item.displayIndex = dropIndex + 1;
          } else {
            item.displaySeq -= 1;
            // 更改显示的排列位置
            item.displayIndex -= 1;
            if (item.displaySeq < 0) {
              item.displaySeq = 0;
            }
          }
        });
        const num = dropIndex - dragIndex;
        data.splice(dragIndex, num + 1, ...mArr);
      }
      // 发请求
      store.sendData(mArr);
    };
    let data = [];
    switch (this.state.witch) {
      case 0 : data = this.state.LData;
        break;
      case 1 : data = this.state.MData;
        break;
      case 2 : data = this.state.SData;
        break;
      default: data = this.state.LData;
    }
    if (this.props.isUser) {
      changeOrder(data);
    }
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    let ar;
    let i;
    loop(data, dropKey, (item, index, arr) => {
      // 每次移动成员后的新数组
      ar = arr;
      // 移动了i个位置，是一个变化量   如：从数组的第1个成员移动后成为第3个成员，i=2
      i = index;
    });
    // 不区分节点拖动
    if (dragIndex > dropIndex) {
      ar.splice(i, 0, dragObj);
    }
    if (dragIndex < dropIndex) {
      ar.splice(i + 1, 0, dragObj);
    }

    switch (this.state.witch) {
      case 0 : this.setState({
        LData: data,
      });
        break;
      case 1 : this.setState({
        MData: data,
      });
        break;
      case 2 : this.setState({
        SData: data,
      });
        break;
      default: this.setState({
        LData: data,
      });
    }
  }

  getButModify = (isUser, item, handleEdit) => {
    if (isUser) {
      return (<Rbac uri="fe/bach-erp/web/Product/UserClassify/EditOrBuild/modify">
        <Button type="link" className="green" data={item} onClick={handleEdit}>编辑</Button></Rbac>);
    }
    return (<Rbac uri="fe/bach-erp/web/Product/SKUClassify/modify">
      <Button type="link" className="green" data={item} onClick={handleEdit}>编辑</Button></Rbac>);
  }

  addClassify = (e) => {
    const level = parseInt(e.currentTarget.getAttribute('data-value'), 10);
    this.props.addClassify(level);
  }

  emitEmpty = (e) => {
    const index = parseInt(e.currentTarget.getAttribute('data-value'), 10);
    this.setState({ suffix: ['', '', ''] });
    this.props.onSearch('', index);
  }

  filterTreeNode = (node) => {
    const categoryCode = this.props.highLightData;
    return (categoryCode[0] ? node.props.eventKey === categoryCode[0].categoryCode : false) ||
          (categoryCode[1] ? node.props.eventKey === categoryCode[1].categoryCode : false) ||
          (categoryCode[2] ? node.props.eventKey === categoryCode[2].categoryCode : false);
  }

  renderList = (item) => {
    const key = !item.level ? item.skuSaleCode : item.categoryCode;
    const { handleDelete, handleEdit, isUser } = this.props;
    let text = '';
    if (item.state === 0 && item.categoryName) {
      text = `${item.categoryName}(已停用)`;
    } else if (item.categoryName) {
      text = item.categoryName;
    }

    return (
      <div
        key={key} className={`ant-transfer-list-content-item ${styles.li}`} data-value={JSON.stringify(item)} onClick={this.onClick}
      >
        <div className={'left'}>
          {
          !isUser ? <span className={styles.userSpanWidth}>{item.categoryCode}</span> :
          <span className={styles.userSpanWidth}>
            {!item.level ? item.skuSaleCode : item.displayIndex}
          </span>
        }
          <span className={!isUser || item.level ? `${styles.userPadding}` : `${styles.userProductName}`}>
            {!item.level && isUser ? item.skuSaleName : text}
          </span>
        </div>
        {
        ((this.props.operate === true) && !isUser) || isUser ?
        (<div className={'right '}>
          {
            (!item.level) && isUser ? null : this.getButModify(isUser, item, handleEdit)
          }
          {
            isUser === true ?
              <Rbac uri="fe/bach-erp/web/Product/UserClassify/EditOrBuild/del"><Button type="link" className={(!item.level) && isUser ? 'red' : 'red margin-left-middle'} data={item} onClick={handleDelete}>删除 </Button></Rbac>
            : <Rbac uri="fe/bach-erp/web/Product/SKUClassify/del"><Button type="link" className={(!item.level) && isUser ? 'red' : 'red margin-left-middle'} data={item} onClick={handleDelete}>删除 </Button></Rbac>
          }
        </div>) : null
      }
      </div>
    );
  }
  renderListTitle = (item, index) => (
    <div
      className={styles.title}
    >
      <div className={'left'}>
        <span>{item.position}</span>
        <span className={styles.titlePadding}>{item.categoryName}</span>
      </div>
      <div className={'right'}>
        <span className={index !== 2 ? styles.operate : ''}>{item.operation}</span>
      </div>
    </div>
    )
  renderCol = () => {
    const loop = data => data.map((item, index) =>
      <TreeNode
        key={!item.level ? item.skuCode : item.categoryCode}
        disableCheckbox title={this.renderList(item, index)}
      />);
    const { suffix } = this.state;
    const arr = [];
    arr[0] = suffix[0] ? <Icon type="close-circle" data-value={1} onClick={this.emitEmpty} /> : <i className="anticon anticon-search" />;
    arr[1] = suffix[1] ? <Icon type="close-circle" data-value={2} onClick={this.emitEmpty} /> : <i className="anticon anticon-search" />;
    arr[2] = suffix[2] ? <Icon type="close-circle" data-value={3} onClick={this.emitEmpty} /> : <i className="anticon anticon-search" />;
    const { operate, height, titleAndOperateText, isUser, tableTitle } = this.props;
    const { LData, MData, SData } = this.state;
    const list = [];
    list[0] = LData;
    list[1] = MData;
    list[2] = SData;

    return titleAndOperateText.map((item, index) => {
      const { render } = item;
      const Oper = ({ children }) => <span className={`ant-transfer-list-header-title ${styles.cursorPointer}`} data-value={index + 1} onClick={this.addClassify}><Icon type="plus" />{children}</span>;

      const operator = typeof render === 'function' ?
        render(Oper) : <Oper>{item.operateText}</Oper>;

      return (
        <Col span={8} key={`col-${index}`}>
          <div className={` ${styles.marginRight}`} style={{ height }}>
            <div className={`ant-transfer-list ${styles.widthFull}`}>
              <header className={`ant-transfer-list-header ${styles.padding}`} >
                <span className="ant-transfer-list-header-selected">{item.title}</span>
                {operate === true ? operator : null}
              </header>
              <div className={`ant-transfer-list-body ant-transfer-list-body-with-search ${styles.marginTop}`}>
                <div className="ant-transfer-list-body-search-wrapper">
                  <div>
                    <Input
                      placeholder="搜索分类"
                      suffix={arr[index]}
                      value={suffix[index]}
                      data-value={index + 1}
                      onChange={this.onSearch}
                      className={styles.widthFull}
                    />
                  </div>
                </div>
                <div className={`ant-transfer-list-content ${styles.ulMg}`}>
                  {!isUser ? null : <div>{this.renderListTitle(tableTitle[index], index)}</div>}
                  <div className={'ant-transfer-list-content'}>
                    <Tree
                      className={`draggable-tree ${styles.drag} ${styles.dragSpan} ${styles.clickOver} ${styles.listPadding}`}
                      draggable={isUser}
                      onDragStart={() => this.onDragStart(index)}
                      onDrop={this.onDrop}
                      onSelect={this.handleSelect}
                      filterTreeNode={this.filterTreeNode}
                    >
                      {loop(list[index])}
                    </Tree>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      );
    });
  }

  render() {
    return (
      <div className={styles.widthFull}>
        <Row>
          {this.renderCol()}
        </Row>

      </div>
    );
  }
}
Classify.propTypes = {
  // 是否有列表编辑、删除操作以及添加分类操作  true false
  operate: PropTypes.bool,
  // 列表表头
  tableTitle: PropTypes.arrayOf(PropTypes.object),
  // 每列的标题和操作名称
  titleAndOperateText: PropTypes.arrayOf(PropTypes.object),
  // 点击每一条列表的点击事件  数据绑定在e.currentTarget.getAttribute
  onClick: PropTypes.func,
  // 搜索时触发的事件
  onSearch: PropTypes.func,
  // 点击编辑时的事件
  handleEdit: PropTypes.func,
  // 点击删除时的事件
  handleDelete: PropTypes.func,
  // 点击添加分类的事件
  addClassify: PropTypes.func,
  // 设置分类框高度 eg: height=‘600px’
  height: PropTypes.string,
  // 是否是用户分类 true false
  isUser: PropTypes.bool,
  // 高亮数据
  highLightData: PropTypes.arrayOf(PropTypes.object),
};
Classify.defaultProps = {
  operate: true,
  tableTitle: [],
  highLightData: [],
  titleAndOperateText: [
    {
      title: '',
      operateText: '',
    },
  ],
  height: '100vh',
  isUser: false,
  onClick: () => null,
  onSearch: () => null,
  handleEdit: () => null,
  handleDelete: () => null,
  addClassify: () => null,
};
export default Classify;
