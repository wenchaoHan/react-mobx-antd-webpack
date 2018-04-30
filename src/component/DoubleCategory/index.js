import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Row,
  Col,
  Icon,
  Modal,
  Tooltip,
} from 'bach-antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import Store from './store';
import AddCategory, { AddCategoryStore } from './AddCategory';
import AddProduct, { AddProductStore } from './AddProduct';
import styles from './index.css';

const confirm = Modal.confirm;

export const storeMap = {};

const ButtonGroup = Button.Group;

@observer
class DoubleCategory extends Component {

  constructor(props, context) {
    super(props, context);

    const {
      nameKey,
      field = {},
    } = this.props;

    this.store = new Store({
      ...field.initialValue,
    });

    storeMap[nameKey] = this.store;
  }

  componentWillMount() {
    const form = this.context.form || {};
    const {
      nameKey,
    } = this.props;
    // 创建表单
    if (form.getFieldDecorator && form.setFieldsValue) {
      form.getFieldDecorator(nameKey);
      const data = toJS(this.store.params);
      form.setFieldsValue({
        [nameKey]: data.leftList,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      field = {},
    } = nextProps;
    if (this.props.version !== nextProps.version) {
      this.store.resetData({
        ...field.initialValue,
      });
      this.updateForm();
    }
  }

  componentWillUnmount() {
    const {
      nameKey,
    } = this.props;
    storeMap[nameKey] = undefined;
  }

  onOpenAddCategory = () => {
    AddCategoryStore.idx = -1;
    AddCategoryStore.params.name = '';
    AddCategoryStore.visible = true;
  }

  onAddCategory = ({ name }) => {
    if (name === undefined) {
      return;
    }
    const params = this.store.params;
    // 编辑
    if (AddCategoryStore.idx !== -1) {
      const selectItem = params.leftList[AddCategoryStore.idx] || {};
      selectItem.customCategoryName = name;
    // 添加
    } else {
      params.leftList.push({
        customCategoryName: name,
        productInfoList: [],
      });
    }
    this.updateForm();
  }

  onOpenAddProduct = () => {
    AddProductStore.visible = true;
    AddProductStore.isEdit = false;
  }

  onAddProduct = ({ productCode, productName }) => {
    const params = this.store.params;
    const {
      leftList,
      selectIdx,
    } = params;
    if (!leftList[selectIdx]) {
      leftList[selectIdx] = {};
    }
    if (!leftList[selectIdx].productInfoList) {
      leftList[selectIdx].productInfoList = [];
    }
    const selectList = leftList[selectIdx].productInfoList;

    const newItem = {
      productName,
      productCode,
    };

    if (AddProductStore.isEdit) {
      selectList[AddProductStore.idx] = newItem;
    } else {
      selectList.push(newItem);
    }

    params.selectList = selectList;

    this.updateForm();
  }

  onSelect = (idx) => {
    const params = this.store.params;
    const leftList = params.leftList;
    const selectList = ((leftList[idx] || {}).productInfoList || []).slice();
    params.selectList = selectList;
    params.selectIdx = idx;
    this.updateForm();
  }

  onCategoryGoUp = (e, idx) => {
    e.stopPropagation();
    if (idx === 0) {
      return;
    }
    const params = this.store.params;
    const {
      selectIdx,
      leftList = [],
    } = params;
    if (leftList[idx]) {
      const moveItem = leftList[idx];
      leftList.splice(idx, 1);
      leftList.splice(idx - 1, 0, moveItem);
      if (idx === selectIdx) {
        params.selectIdx = idx - 1;
      }
      this.updateForm();
    }
  }

  onCategoryGoDown = (e, idx) => {
    e.stopPropagation();
    const params = this.store.params;
    const {
      selectIdx,
      leftList = [],
    } = params;
    if (idx === leftList.length - 1) {
      return;
    }
    if (leftList[idx]) {
      const moveItem = leftList[idx];
      leftList.splice(idx, 1);
      leftList.splice(idx + 1, 0, moveItem);
      if (idx === selectIdx) {
        params.selectIdx = idx + 1;
      }
      this.updateForm();
    }
  }

  onCategoryEdit = (e, idx) => {
    e.stopPropagation();
    AddCategoryStore.idx = idx;
    const params = this.store.params;
    const selectItem = params.leftList[idx] || {};
    AddCategoryStore.params.name = selectItem.customCategoryName;
    AddCategoryStore.visible = true;
  }

  onCategoryDelete = (e, idx) => {
    e.stopPropagation();
    confirm({
      title: '确认是否删除',
      onOk: () => {
        const {
          selectIdx,
          leftList = [],
        } = this.store.params;
        leftList.splice(idx, 1);
        if (selectIdx === idx) {
          this.store.params.selectIdx = 0;
          this.store.params.selectList = (leftList[0] && leftList[0].productInfoList) || [];
        }
        this.updateForm();
      },
    });
  }

  onGoUp = (idx) => {
    if (idx === 0) {
      return;
    }
    const params = this.store.params;
    const {
      leftList,
      selectIdx,
      selectList,
    } = params;
    if (selectList[idx]) {
      const moveItem = selectList[idx];
      selectList.splice(idx, 1);
      selectList.splice(idx - 1, 0, moveItem);
      const selectItem = leftList[selectIdx] || {};
      selectItem.productInfoList = selectList.slice();
      this.updateForm();
    }
  }

  onGoDown = (idx) => {
    const {
      leftList,
      selectIdx,
      selectList,
    } = this.store.params;
    if (idx === selectList.length - 1) {
      return;
    }
    if (selectList[idx]) {
      const moveItem = selectList[idx];
      selectList.splice(idx, 1);
      selectList.splice(idx + 1, 0, moveItem);
      const selectItem = leftList[selectIdx] || {};
      selectItem.productInfoList = selectList.slice();
      this.updateForm();
    }
  }

  onDelete = (idx) => {
    confirm({
      title: '确认是否删除',
      onOk: () => {
        const {
          leftList,
          selectIdx,
          selectList,
        } = this.store.params;
        if (selectList[idx]) {
          selectList.splice(idx, 1);
          const selectItem = leftList[selectIdx] || {};
          selectItem.productInfoList = selectList.slice();
          this.updateForm();
        }
      },
    });
  }

  onEdit = (idx) => {
    const params = this.store.params;
    const selectList = params.selectList;
    const selectItem = selectList[idx];
    AddProductStore.visible = true;
    AddProductStore.isEdit = true;
    AddProductStore.idx = idx;
    AddProductStore.params.productCode = selectItem.productCode;
    AddProductStore.fetchProduct({
      productCode: selectItem.productCode,
      productName: selectItem.productName,
    });
  }

  updateForm = () => {
    const {
      nameKey,
    } = this.props;
    const {
      form,
    } = this.context;
    if (form && form.setFieldsValue) {
      form.setFieldsValue({
        [nameKey]: toJS(this.store.params.leftList),
      });
    }
  }

  render() {
    const data = this.store.params;
    const {
      leftList,
      selectList,
      selectIdx,
    } = data;
    return (
      <div className={styles.container}>
        <Row>
          <Col span={11}>
            <div className={styles.side}>
              <div className={`${styles.header}`}>
                <span>{`${data.leftTitle}`}</span>
                {
                  !this.props.view ? (
                    <span
                      onClick={this.onOpenAddCategory}
                      className={`${styles.addCategory}`}
                    >
                      <Icon type="plus" />
                      {`${data.leftBtnText}`}
                    </span>
                  ) : null
                }
              </div>
              <div className={`ant-collapse ${styles.antCollapse}`}>
                {
                  leftList.map((row, idx) => {
                    let rowClassName = `${styles.antCollapseContent}`;
                    if (idx === selectIdx) {
                      rowClassName += ` ${styles.activeRow}`;
                    }
                    return (
                      <div
                        key={idx}
                        className={`${styles.antCollapseItem}`}
                        onClick={() => this.onSelect(idx)}
                      >
                        <div className={rowClassName}>
                          {
                            !this.props.view ? (
                              <div className={`${styles.rightBtn}`}>
                                <ButtonGroup>
                                  <Button
                                    icon="to-top"
                                    className={styles.icon}
                                    onClick={e => this.onCategoryGoUp(e, idx)}
                                  />
                                  <Button
                                    icon="to-top"
                                    className={`${styles.rotateDown} ${styles.icon}`}
                                    onClick={e => this.onCategoryGoDown(e, idx)}
                                  />
                                  <Button
                                    icon="edit"
                                    className={`${styles.icon} ${styles.editicon}`}
                                    onClick={e => this.onCategoryEdit(e, idx)}
                                  />
                                  <Button
                                    icon="delete"
                                    className={`${styles.icon} ${styles.deleteicon}`}
                                    onClick={e => this.onCategoryDelete(e, idx)}
                                  />
                                </ButtonGroup>
                              </div>
                            ) : null
                          }
                          <Tooltip title={`${row.customCategoryName}`}>
                            <span className={`${styles.goodName}`}>
                              {`${row.customCategoryName}`}
                            </span>
                          </Tooltip>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </Col>
          <Col span={1} />
          <Col span={12}>
            <div className={styles.side}>
              <div className={`${styles.header}`}>
                <span>{`${data.rightTitle}`}</span>
                {
                  !this.props.view && leftList.length > 0 ? (
                    <span
                      className={`${styles.addCategory}`}
                      onClick={this.onOpenAddProduct}
                    >
                      <Icon type="plus" />
                      {`${data.rightBtnText}`}
                    </span>
                  ) : null
                }
              </div>
              <div className={`ant-collapse ${styles.antCollapse}`}>
                {
                  selectList.map((row, idx) => (
                    <div key={idx} className={`${styles.antCollapseItem}`}>
                      <div className={`${styles.antCollapseContent}`}>
                        {
                          !this.props.view ? (
                            <div className={`${styles.rightBtn}`}>
                              <ButtonGroup>
                                <Button
                                  icon="to-top"
                                  className={styles.icon}
                                  onClick={() => this.onGoUp(idx)}
                                />
                                <Button
                                  icon="to-top"
                                  className={`${styles.rotateDown} ${styles.icon}`}
                                  onClick={() => this.onGoDown(idx)}
                                />
                                <Button
                                  icon="edit"
                                  className={`${styles.icon} ${styles.editicon}`}
                                  onClick={() => this.onEdit(idx)}
                                />
                                <Button
                                  icon="delete"
                                  className={`${styles.icon} ${styles.deleteicon}`}
                                  onClick={() => this.onDelete(idx)}
                                />
                              </ButtonGroup>
                            </div>
                          ) : null
                        }
                        <Tooltip title={`${row.productName}`}>
                          <span className={`${styles.goodName}`}>{`${row.productName}`}</span>
                        </Tooltip>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </Col>
        </Row>
        <AddCategory
          onOk={this.onAddCategory}
        />
        <AddProduct
          onOk={this.onAddProduct}
        />
      </div>
    );
  }
}

DoubleCategory.propTypes = {
  nameKey: PropTypes.string.isRequired,
  field: PropTypes.oneOfType([PropTypes.object]),
  view: PropTypes.bool,
  version: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

DoubleCategory.contextTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
};

export default DoubleCategory;
