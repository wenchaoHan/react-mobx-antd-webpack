import React, { Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import router from 'BizUtils/router';
import SmartGrid from 'BizComponent/Grid';
import styles from './index.css';
import store from './store';


const table = (<div
  className={styles.tablePosition}
>
  <table className={styles.table}>
    <thead>
      <tr>
        <td >送货人</td>
        <td>负责人</td>
        <td>店 章</td>
      </tr>
    </thead>
    <tbody >
      <tr >
        <td />
        <td />
        <td />
      </tr>
    </tbody>
  </table>
</div>
);

const reqObj = router.callback();
const { reqUrl, reqData, showTable, method, columns, tableSize } = reqObj;

@observer
class PrintPage extends Component {
  responseFilter=(res) => {
    if (res && res.status >= 0) {
      store.printDataInfo = res.data;
      setTimeout(() => {
        window.print();
      }, 1000);
    }
    return res.data;
  }
  render() {
    return (
      <div className={styles.pageLayout} >
        <div>
          {/* 标题*/}
          <div className={styles.title}>
            <div className={styles.hugeTitle}>
              {store.printData.title}
            </div>
            <div className={styles.smallTitle}>
              {store.printData.subTitle}
            </div>
            {/* 表格*/}
          </div>
          {
          showTable ? table : null
          }
        </div>

        {/* 单号 状态*/}
        <div className={styles.statusStyle}>
          <div className="left">
            <span className={styles.spanFirst}>单号:</span>
            <span className={styles.spanSecond}>
              {store.printData.orderNo}
            </span>
          </div>
          <div className="right">
            <span className={styles.spanFirst}>单据状态:</span>
            <span className={styles.spanSecond}>
              {store.printData.orderStatus}
            </span>
          </div>
        </div>
        {/* 分割线*/}
        <div className={styles.line} />
        <div
          className={styles.baseInfoStyle}
        >
          {
          store.printData.baseInfo && store.printData.baseInfo.map((item, index) => (
            <div
              className={styles.singleBaseInfo}
              key={index}
            >
              <span className={styles.infoSpanFirst}>
                {item.key}:
              </span>
              <span>{item.value}</span>
            </div>
          ))
        }
          <div
            className={styles.singleBaseInfo}
          >
            <span className={styles.infoSpanFirst}>
              制单日期:
            </span>
            <span>{moment().format('YYYY-MM-DD HH:mm:ss')}</span>
          </div>
        </div>
        <div />
        <SmartGrid
          name="printGrid"
          rowKey={(record, index) => index}
          size={tableSize || 'default'}
          method={method}
          url={reqUrl}
          search={reqData}
          columns={columns}
          responseFilter={this.responseFilter}
          noPage
        />
      </div>
    );
  }
}
export default PrintPage;
