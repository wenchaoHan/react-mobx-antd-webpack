import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import SmartGrid from 'BizComponent/Grid';

@observer
class Grid extends Component {
  constructor(props) {
    super(props);
    const { bizType, entityCode, opModule } = props;
    this.search = { bizType, opModule: opModule[0].value, entityCode };
  }

  getColumns = () => {
    const { opModule } = this.props;
    const dictionary = {};
    opModule.forEach((item) => {
      dictionary[item.value] = item.name;
    });
    const columns = [{
      title: '序号',
      dataIndex: 'order',
      width: 60,
      render: (text, record, index) => index + 1,
    }, {
      title: '操作时间',
      dataIndex: 'createTime',
      width: 160,
    }, {
      title: '操作人',
      dataIndex: 'operator',
      width: 120,
    }, {
      title: '操作内容',
      dataIndex: 'logContent',
      render: (text) => {
        const newText = (text || '').replace(/\n/g, '<br />');
        /* eslint-disable react/no-danger */
        return <span dangerouslySetInnerHTML={{ __html: newText }} />;
      },
    }];
    if (opModule.length) {
      columns.splice(1, 0, {
        title: '操作模块',
        dataIndex: 'opModule',
        width: 120,
        render: text => dictionary[text],
      });
    }
    return columns;
  };

  requestFilter = (value) => {
    value.bizType = this.props.bizType;
    if (value.opDate) {
      value.fromDate = value.opDate[0];
      value.toDate = value.opDate[1];
      delete value.opDate;
    }
    if (this.props.entityCode) {
      value.entityCode = this.props.entityCode;
    }
    return value;
  }

  render() {
    return (
      <div className="table-wrapper">
        <SmartGrid
          rowKey={(record, index) => index}
          name="logList"
          columns={this.getColumns()}
          search={this.search}
          url="/bach/baseinfo/goblin/log/operate/v1"
          requestFilter={this.requestFilter}
        />
      </div>
    );
  }
}
Grid.propTypes = {
  bizType: PropTypes.number,
  entityCode: PropTypes.string,
  // defaultOpModule: PropTypes.oneOfType([PropTypes.object]),
  opModule: PropTypes.oneOfType([PropTypes.array]),
};

export default Grid;
