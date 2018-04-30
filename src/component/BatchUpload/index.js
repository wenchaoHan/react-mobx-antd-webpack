import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Upload, Icon, Button, message } from 'bach-antd';
import TabProvider from 'BizComponent/TabProvider';
import OpLog from 'BizComponent/OpLog';
import styles from './index.css';

const Dragger = Upload.Dragger;
const Pane = TabProvider.Pane;

class BatchUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      fileName: '',
      disabled: false,
    };
    this.resolve = null;
  }

  onSubmit = () => {
    if (this.resolve) {
      this.setState({
        fileName: '',
      });
      this.resolve();
    }
  }

  onChange = (info) => {
    this.setState({
      fileList: info.fileList,
    });
    const status = info.file.status;
    switch (status) {
      case 'done':
        // message.success('上传成功');
        this.props.uploadInfo.success(info);
        break;
      case 'error':
        message.error('上传失败');
        this.props.uploadInfo.error(info);
        break;
      case 'removed':
        this.setState({
          disabled: false,
        });
        break;
      default:
        this.props.uploadInfo.progress(info);
        break;
    }
  }

  beforeUpload = (file) => {
    this.setState({
      fileList: [],
      fileName: file.name,
      disabled: true,
    });
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  removeFile = () => {
    this.setState({
      fileName: '',
      disabled: false,
    });
    if (this.reject) {
      this.reject();
    }
  }

  render() {
    const props = {
      disabled: this.state.disabled,
      name: this.props.uploadInfo.name,
      data: this.props.uploadInfo.data,
      action: this.props.uploadInfo.action,
      showUploadList: true,
      multiple: false,
      beforeUpload: this.beforeUpload,
      onChange: this.onChange,
      accept: this.props.accept,
    };
    const radio = this.props.tabType === 'radio' || false;
    return (
      <TabProvider level={this.props.tabLevel} radio={radio}>
        <Pane tab="批量上传" key="uplad" route="uplad">
          <div>
            <div>上传文件：<span className={styles.subtitle}>注：历史上传记录请去日志查看</span></div>
            <div className={styles.fileWrap}>
              <div className={styles.draggerWrap}>
                <Dragger {...props} fileList={this.state.fileList}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="upload" />
                  </p>
                  <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                  <p className="ant-upload-hint">支持扩展名： {props.accept}</p>
                </Dragger>
                {
                  this.state.fileName !== '' &&
                  <div className="ant-upload-list">
                    <div className="ant-upload-list-item ant-upload-list-item-done margin-bottom-middle">
                      <div className="ant-upload-list-item-info">
                        <span>
                          <i className="anticon anticon-paper-clip" />
                          <span className="ant-upload-list-item-name" title="ceshi.png">{this.state.fileName}</span>
                        </span>
                      </div>
                      <i title="删除文件" className="anticon anticon-cross" onClick={this.removeFile} />
                    </div>
                    <Button type="primary" htmlType="submit" onClick={this.onSubmit}>
                        确认提交
                    </Button>
                  </div>
                }
              </div>
            </div>
          </div>
        </Pane>
        <Pane tab="下载模版" key="down" route="down">
          <div>
            {
              this.props.templateList.map((item, index) => (
                <a
                  key={index}
                  className={styles.downwrap}
                  href={this.props.templateList[index].downloadUrl}
                >
                  <div className={styles.iconWrap}>
                    <Icon type="download" className={styles.icon} />
                  </div>
                  <span className={styles.title}>{this.props.templateList[index].fileName}</span>
                </a>
              ))
            }
          </div>
        </Pane>
        <Pane tab="日志查看" key="log" route="log">
          <OpLog
            showOperator={this.props.logInfo.showOperator !== undefined}
            showOpDate={this.props.logInfo.showOpDate !== undefined}
            bizType={this.props.logInfo.bizType}
            entityCode={this.props.logInfo.entityCode}
          />
        </Pane>
      </TabProvider>
    );
  }
}

BatchUpload.propTypes = {
  uploadInfo: PropTypes.shape({
    name: PropTypes.string,
    data: PropTypes.object,
    action: PropTypes.string, // 必填
    success: PropTypes.func,
    error: PropTypes.func,
    progress: PropTypes.func,
  }),
  templateList: PropTypes.arrayOf(
    PropTypes.shape({
      fileName: PropTypes.string, // 必填
      downloadUrl: PropTypes.string, // 必填
    })
  ),
  logInfo: PropTypes.shape({
    showOperator: PropTypes.bool,
    showOpDate: PropTypes.bool,
    bizType: PropTypes.string,
    entityCode: PropTypes.string,
  }),
  tabLevel: PropTypes.number,
  tabType: PropTypes.string,
  accept: PropTypes.string,
};

BatchUpload.defaultProps = {
  uploadInfo: {
    name: 'file',
    action: '',
    success: () => {},
    error: () => {},
    progress: () => {},
  },
  templateList: [],
  logInfo: {
    bizType: '',
    entityCode: '',
  },
  tabLevel: 0,
  tabType: 'radio', // or 'line'
  accept: '.xls',
};

export default BatchUpload;
