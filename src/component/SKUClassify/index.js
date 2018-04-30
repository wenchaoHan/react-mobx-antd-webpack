import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Modal, Input } from 'bach-antd';
import Form from 'BizComponent/Form';
import Classify from 'BizComponent/Classify';
import FormItem from 'BizComponent/FormItem';
import Rbac from 'BizComponent/Rbac';
import { validateNum } from 'BizConfig/rules';
import store from './store';

const confirm = Modal.confirm;

/**
 * @ author       KyrieVing
 * @ date         2017-06-01
 * @ description  SKU分类业务组件
 */


@Form.create()
@observer
class SKUClassify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstLevelList: [],
      secondLevelList: [],
      thirdLevelList: [],
      code: '',
      name: '',
      level: '',
    };
  }

  componentDidMount() {
    const param = {
      level: 0,
    };
    store.fetchClassifyList(param, () => {
      this.setState({
        firstLevelList: store.firstLevel,
        secondLevelList: store.secondLevel,
        thirdLevelList: store.thirdLevel,
      });
    });
    if (this.props.initialValue.length !== 0) {
      this.props.initialValue.forEach((item, index) => {
        if (index !== 2) {
          this.fetchData(item);
        }
      });
    }
  }

  fetchData = (item) => {
    store.fetchClassifyList(item, () => {
      switch (item.level + 1) {
        case 1 :
          this.setState({
            firstLevelList: store.firstLevel,
            secondLevelList: [],
            thirdLevelList: [],
          });
          break;
        case 2 :
          this.setState({
            secondLevelList: store.secondLevel,
            thirdLevelList: [],
          });
          break;
        case 3 : this.setState({
          thirdLevelList: store.thirdLevel,
        });
          break;
        default : this.setState({
          firstLevelList: store.firstLevel,
        });
          break;
      }
    });
  }
  extendsClassify = (data) => {
    this.props.getFinalData(data);
    if (parseInt(data.level, 10) === 1) {
      store.secondCode = data.categoryCode;
    } else if (parseInt(data.level, 10) === 2) {
      store.thirdCode = data.categoryCode;
    }
    if (data.level !== 3) {
      this.fetchData(data);
    }
  }
  handleDelete = (item) => {
    const self = this;
    confirm({
      title: '确认删除？',
      content: '删除后此分类编号将不能再使用！',
      onOk() {
        if (item.level === 1) {
          item.parentCode = '';
        } else if (item.level === 2) {
          item.parentCode = store.secondCode;
        } else if (item.level === 3) {
          item.parentCode = store.thirdCode;
        }
      // 删除请求
        store.deleteListItem(item, () => {
          let param = {};
          item.level -= 1;
          if (item.level === 0) {
            param.level = item.level;
          } else {
            param = item;
          }
          self.fetchData(param);
        });
      },
    });
  }

  handleEdit = (item) => {
    store.showModal = true;
    store.addClassify = false;
    store.level = item.level;
    this.setState({
      code: item.categoryCode,
      name: item.categoryName,
    });
    store.fetchDetailData(item.categoryCode);
    store.editValue.id = item.id;
  }
  showConfirm = (data) => {
    confirm(data);
  }
  addClassify = (level) => {
    store.level = level;
    store.addClassify = true;
    if (parseInt(level, 10) === 2) {
      if (!store.secondCode) {
        this.showConfirm({
          title: '添加失败',
          content: '请选择父级分类',
        });
        return;
      }
      this.setState({
        code: store.secondCode,
      });
    } else if (parseInt(level, 10) === 3) {
      if (!store.thirdCode) {
        this.showConfirm({
          title: '添加失败',
          content: '请选择父级分类',
        });
        return;
      }
      this.setState({
        code: store.thirdCode,
      });
    } else {
      this.setState({
        code: '',
      });
    }
    this.setState({
      name: '',
    });
    store.showModal = true;
  }
  handleSearch = (value, index) => {
    let list = [];
    const filterData = [];

    switch (index) {
      case 1 : list = store.firstLevel;
        break;
      case 2 : list = store.secondLevel;
        break;
      case 3 : list = store.thirdLevel;
        break;
      default : list = store.firstLevel;
    }
    list.forEach((item) => {
      if (item.categoryCode.indexOf(value) >= 0 || item.categoryName.indexOf(value) >= 0) {
        filterData.push(item);
      }
    });
    switch (index) {
      case 1 :
        if (value) {
          this.setState({
            firstLevelList: filterData,
          });
        } else {
          this.setState({
            firstLevelList: store.firstLevel,
          });
        }
        break;
      case 2 :
        if (value) {
          this.setState({
            secondLevelList: filterData,
          });
        } else {
          this.setState({
            secondLevelList: store.secondLevel,
          });
        }
        break;
      case 3 :
        if (value) {
          this.setState({
            thirdLevelList: filterData,
          });
        } else {
          this.setState({
            thirdLevelList: store.thirdLevel,
          });
        }
        break;
      default :
        if (value) {
          this.setState({
            firstLevelList: filterData,
          });
        } else {
          this.setState({
            firstLevelList: store.firstLevel,
          });
        }
        break;
    }
  }
  handleSubmit = () => {
    const { resetFields, validateFields } = this.props.form;
    validateFields((err, editValue) => {
      store.editValue.categoryCode = editValue.categoryCode;
      store.editValue.categoryName = editValue.categoryName;
      switch (parseInt(store.level, 10)) {
        case 1 :
          store.editValue.level = 1;
          store.editValue.parentCode = '';
          break;
        case 2 :
          if (store.addClassify) {
            store.editValue.categoryCode = store.secondCode + editValue.categoryCode;
          }
          store.editValue.level = 2;
          store.editValue.parentCode = store.secondCode;
          break;
        case 3 :
          if (store.addClassify) {
            store.editValue.categoryCode = store.thirdCode + editValue.categoryCode;
          }
          store.editValue.parentCode = store.thirdCode;
          store.editValue.level = 3;
          break;
        default : if (store.addClassify) {
          store.editValue.categoryCode = store.secondCode + editValue.categoryCode;
        }
          break;
      }
      store.editValue.state = 1;

       //  发送数据
      store.sendSaveData(store.edit, () => {
        let param = {};
        store.editValue.level -= 1;
        if (store.edit.level === 0) {
          param.level = store.edit.level;
        } else {
          param = store.edit;
        }
        this.fetchData(param);
      });
      store.showModal = false;
      store.addClassify = false;
      resetFields();
    });
  }
  handleCancle = () => {
    store.showModal = false;
    const { resetFields } = this.props.form;
    resetFields();
    Object.keys(store.editValue).forEach((key) => {
      store.editValue[key] = '';
    });
  }

  render() {
    const { height, initialValue, operate } = this.props;
    const { firstLevelList, secondLevelList, thirdLevelList, code, name } = this.state;

    return (
      <div>
        <Classify
          height={height}
          operate={operate}
          titleAndOperateText={[{
            title: '大分类',
            render(Oper) {
              return <Rbac uri="fe/bach-erp/web/Product/SKUClassify/add"><Oper>添加分类</Oper></Rbac>;
            },
          },
          {
            title: '中分类',
            render(Oper) {
              return <Rbac uri="fe/bach-erp/web/Product/SKUClassify/add"><Oper>添加分类</Oper></Rbac>;
            },
          },
          {
            title: '小分类',
            render(Oper) {
              return <Rbac uri="fe/bach-erp/web/Product/SKUClassify/add"><Oper>添加分类</Oper></Rbac>;
            },
          }]}
          firstLevelList={firstLevelList}
          secondLevelList={secondLevelList}
          thirdLevelList={thirdLevelList}
          onClick={this.extendsClassify}
          handleDelete={this.handleDelete}
          handleCancle={this.handleCancle}
          handleEdit={this.handleEdit}
          addClassify={this.addClassify}
          onSearch={this.handleSearch}
          highLightData={initialValue}
        />
        <Modal
          title={!store.addClassify ? '编辑分类' : '添加分类'}
          width="700px"
          wrapClassName="vertical-center-modal"
          maskClosable={false}
          visible={store.showModal}
          onCancel={this.handleCancle}
          onOk={this.handleSubmit}
          okText="确认并保存"
        >
          <Form
            type="modal"
            onSubmit={this.handleSubmit}
          >
            <FormItem
              colon
              label="分类编号"
              nameKey="categoryCode"
              field={{
                rules: [{
                  required: store.addClassify,
                  message: '分类编号不得为空',

                }, {
                  len: store.addClassify ? 2 : null,
                  validator: store.addClassify ? validateNum : null,
                }],
                initialValue: !store.addClassify ? code : '' }}
            >
              <Input
                placeholder="请输入" className="w400"
                disabled={!store.addClassify}
                addonBefore={store.addClassify ? code : false} onChange={this.onChange}
              />
            </FormItem>
            <FormItem
              colon
              label="分类名称"
              nameKey="categoryName"
              field={{
                rules: [{
                  required: true,
                  message: '分类名称不得为空',
                }, {
                  message: '分类名称不得超过10个汉字',
                  max: 10,
                }],
                initialValue: name }}
            >
              <Input
                placeholder="请输入"
                className="w400"
              />
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
SKUClassify.propTypes = {
  form: PropTypes.arrayOf(PropTypes.object),
  // 设置分类框高度
  height: PropTypes.string,
  // 是否有操作
  operate: PropTypes.bool,
  // 获取点击的数据
  getFinalData: PropTypes.func,
  // 初始值
  initialValue: PropTypes.arrayOf(PropTypes.object),
};
SKUClassify.defaultProps = {
  height: '100vh',
  operate: true,
  getFinalData: () => null,
  initialValue: [],
};
export default SKUClassify;
