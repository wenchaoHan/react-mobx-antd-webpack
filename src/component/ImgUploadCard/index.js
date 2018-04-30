/**
 * 固定个数的类微博上传，业务组件，支持下载
 * demo: /bach-erp/web/Product/SKU/Detail
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Upload, Icon, Modal } from 'bach-antd';

const NOOP = () => {};

class ImgUploadCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: props.value || [],
      downImg: {},
    };
    this.downLoad = null;
    this.handleDown = this.handleDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.getDownRef = this.getDownRef.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({
        fileList: nextProps.value.concat([]),
      });
    }
  }

  getDownRef(ref) {
    this.downLoad = ref;
  }

  handleCancel() {
    this.setState({ previewVisible: false });
  }

  handlePreview(file) {
    const { handlePreview } = this.props;
    if (handlePreview) {
      handlePreview(file);
      return;
    }
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange({ fileList }) {
    fileList = fileList.map((item) => {
      if (item.status === 'done' && item.response && item.response.status === 0) {
        const data = item.response.data[0];
        if (data && data.img) {
          item.thumbUrl = data.img;
        }
      }
      return item;
    });
    this.props.onChange(fileList.concat([]));
  }

  handleDown(file) {
    if (typeof file === 'object') {
      const name = file.url.split('/');
      this.setState({
        downImg: {
          url: file.url,
          name: name.pop(),
        },
      }, () => {
        if (this.downLoad) {
          this.downLoad.click();
        }
      });
    } else if (file.response) {
      const { data } = file.response;
      if (data && data.length) {
        const img = data[0].img;
        this.setState({
          downImg: {
            url: img,
            name: file.name,
          },
        }, () => {
          if (this.downLoad) {
            this.downLoad.click();
          }
        });
      }
    }
  }

  render() {
    const { handlePreview, showUploadList, maxLength } = this.props;
    const { previewVisible, previewImage, fileList, downImg } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          name="files"
          action="/bach/baseinfo/product/upload/image/v1"
          listType="picture-card"
          fileList={fileList}
          showUploadList={showUploadList}
          onPreview={this.handlePreview}
          onDown={this.handleDown}
          onChange={this.handleChange}
        >
          {fileList.length >= maxLength ? null : uploadButton}
        </Upload>
        {
          handlePreview === undefined &&
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        }
        <a ref={this.getDownRef} href={downImg.url} download={downImg.name}>{''}</a>
      </div>
    );
  }
}


ImgUploadCard.propTypes = {
  // 预览回调-传此参数则不用默认预览，需手动生成
  handlePreview: PropTypes.func,
  // 上传成功的回调
  onChange: PropTypes.func,
  // 图片张数上线
  maxLength: PropTypes.number,
  // 图片张数上线
  value: PropTypes.arrayOf(PropTypes.object),
  // 配置展示操作
  showUploadList: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

ImgUploadCard.defaultProps = {
  onChange: NOOP,
  maxLength: 1,
  showUploadList: {
    showPreviewIcon: true,
    showDownIcon: true,
    showRemoveIcon: true,
  },
};

export default ImgUploadCard;
