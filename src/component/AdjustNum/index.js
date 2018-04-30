import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popover, Input } from 'bach-antd';
import Button from 'BizComponent/Button';

class AdjustNum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      visible: false,
      errMsg: '',
    };
  }

  getTitle=() => (<div style={{ textAlign: 'center' }}>
    <Input
      ref={input => input && input.focus()}
      value={this.state.value}
      onChange={(e) => {
        let value = e.target.value;
        const { keyText, text, max, min } = this.props;
        this.setState({ value });
        if (value === '' || value === null || value === undefined) {
          this.setState({ errMsg: `${keyText || text}不能为空` });
        } else {
          value /= 1;
          if (isNaN(value)) {
            this.setState({ errMsg: '请输入数字' });
          } else if (max !== undefined && value > max) {
            this.setState({ errMsg: `${keyText || text}不能大于${max}` });
          } else if (min !== undefined && value < min) {
            this.setState({ errMsg: `${keyText || text}不能小于${min}` });
          } else if (Number(value) + this.props.fixedValue < 0) {
            this.setState({ errMsg: '调整数量不能超过当前库存量' });
          } else {
            this.setState({ errMsg: '' });
          }
        }
      }}
      className="w80"
      style={{ borderColor: this.state.errMsg ? '#f04134' : 'initial' }}
    />
    <div className="red" style={{ paddingTop: 8 }}>{this.state.errMsg}</div>
    <div style={{ textAlign: 'right', marginTop: 8 }}>
      <Button
        size="small"
        type="primary"
        onClick={() => {
          let value = this.state.value;
          const { keyText, text, max, min } = this.props;
          if (value === '' || value === null || value === undefined) {
            this.setState({ errMsg: `${keyText || text}不能为空` });
          } else {
            value /= 1;
            if (isNaN(value)) {
              this.setState({ errMsg: '请输入数字' });
            } else if (max !== undefined && value > max) {
              this.setState({ errMsg: `${keyText || text}不能大于${max}` });
            } else if (min !== undefined && value < min) {
              this.setState({ errMsg: `${keyText || text}不能小于${min}` });
            } else if (Number(value) + this.props.fixedValue < 0) {
              this.setState({ errMsg: '调整数量不能超过当前库存量' });
            } else {
              this.props.onOk(value);
              this.setState({ visible: false }, () => {
                this.setState({ value: '' });
              });
            }
          }
        }}
      >确认</Button>
      <Button
        size="small"
        type="default"
        className="margin-left-small"
        onClick={() => {
          this.setState({
            visible: false,
            value: '',
            errMsg: '',
          });
        }}
      >取消</Button>
    </div>
  </div>)


  handleVisibleChange = (visible) => {
    this.setState({ visible });
  }

  render() {
    const { keyText, text } = this.props;
    return (
      <Popover
        content={this.getTitle()}
        title={`请输入${keyText || text}`}
        overlayStyle={{ zIndex: 1000 }}
        trigger="click"
        placement="top"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        /* getPopupContainer={node => node.parentNode}*/
      >
        <a href="" >{text}</a>
      </Popover>
    );
  }
}

AdjustNum.propTypes = {
  // 确认回调
  onOk: PropTypes.func,
  // 输入数量
  keyText: PropTypes.string,
  // 按钮文本
  text: PropTypes.string,
  // 最大值
  max: PropTypes.number,
  // 最小值
  min: PropTypes.number,
  // 固定值  门店库存调整使用
  fixedValue: PropTypes.number,
};

AdjustNum.defaultProps = {
  text: '调整数量',
  max: Infinity,
  min: -Infinity,
};

export default AdjustNum;
