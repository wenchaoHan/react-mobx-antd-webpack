/**
 * 固定个数的类微博上传，业务组件，支持下载
 * demo: /bach-erp/web/Product/SKU/Detail
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImgUploadCard from 'BizComponent/ImgUploadCard';
import style from './index.css';

const NOOP = () => {};

class ImgUpload extends Component {

  constructor(props) {
    super(props);
    this.state = {
      imageArr: props.value || [],
    };
    this.imageTypes = props.value ? props.value.map((item) => {
      const newItem = { ...item };
      if (newItem.url) {
        delete newItem.url;
      }
      if (newItem.status) {
        delete newItem.status;
      }
      return newItem;
    }) : [];
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    if (this.props.value) {
      this.setState({
        imageArr: this.props.value.concat([]),
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({
        imageArr: nextProps.value.concat([]),
      });
    }
  }

  handleChange(file, index) {
    const imageArr = this.state.imageArr.concat([]);
    if (file && file.length) {
      const fileNew = file[0];
      if (fileNew.response) {
        fileNew.response.type = { ...this.imageTypes[index] };
      }
      imageArr.splice(index, 1, fileNew);
    } else {
      imageArr.splice(index, 1, { ...this.imageTypes[index] });
    }
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(imageArr.concat([]));
    }
  }

  render() {
    const { uploadOptions, type, handlePreview } = this.props;
    const { imageArr } = this.state;
    return (
      <div>
        {
          imageArr && imageArr.length && imageArr.map((item, index) => {
            const fileList = item.status === '' || item.status === undefined ? [] : [{ ...item }];
            const imageItem = this.imageTypes[index];
            return (
              <div className={`inline-block align-center ${style.verticalTop}`} key={`img${index}`}>
                <ImgUploadCard
                  {...uploadOptions}
                  showUploadList={{
                    showPreviewIcon: true,
                    showDownIcon: type === 'view',
                    showRemoveIcon: type !== 'view',
                  }}
                  maxLength={type === 'view' ? 0 : 1}
                  value={fileList}
                  handlePreview={handlePreview}
                  onChange={(files) => { this.handleChange(files, index); }}
                />
                {
                   !(type === 'view' && fileList.length === 0) && (imageItem && (imageItem.title !== undefined || imageItem.title !== '')) &&
                     <div
                       className={`align-center ${index !== 0 ? 'margin-left-small' : null}`}
                     >
                       <div>{imageItem.title}</div>
                       {
                         imageItem.commit !== undefined &&
                         <div>{imageItem.commit}</div>
                       }
                     </div>
                }
              </div>
            );
          })
        }
      </div>
    );
  }
}


ImgUpload.propTypes = {
  // 上传参数，和ant一致
  uploadOptions: PropTypes.oneOfType([PropTypes.object]),
  // 预览回调
  handlePreview: PropTypes.func,
  // 类型：‘view’则不显示删除操作
  type: PropTypes.string,
  // 上传成功的回调
  onChange: PropTypes.func,
  // 值
  value: PropTypes.arrayOf(PropTypes.object),
};

ImgUpload.defaultProps = {
  uploadOptions: {},
  handlePreview: NOOP,
  onChange: NOOP,
  type: 'view',
};

export default ImgUpload;
