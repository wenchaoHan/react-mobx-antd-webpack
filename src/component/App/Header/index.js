import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import Cookie from 'js-cookie';
import { appSource } from 'BizConfig/constant';
// import { getBizType } from 'BizUtils';
import Request from 'BizUtils/Request';
// import router from 'BizUtils/router';
import styles from './index.css';

const SHOP_NAME = 'erp_bach_shop_name';
const localStorage = window.localStorage;
// const bizType = getBizType();
const shopName = localStorage.getItem(SHOP_NAME) || 'ZJY 综合运维平台';

const store = observable({ shopName });


// if (localStorage.getItem(SHOP_NAME) === null) {
//   Request.get(`/${appSource}/version`).then((res) => {
//     if (res.status === 0) {
//       store.shopName = res.data.data.name;
//       localStorage.setItem(SHOP_NAME, res.data.data.name);
//     } else {
//       localStorage.setItem(SHOP_NAME, 'OPS 综合运维平台');
//     }
//   });
// }

const ShopName = observer(() => <div className="comp_name">{store.shopName}</div>);

class Header extends React.Component {
  // logout = () => {
  //   window.localStorage.removeItem(SHOP_NAME);
  //   router.goto(`/${appSource}/sso/usercenter/logout`, {
  //     redirectUrl: window.location.href,
  //   });
  // }


  logout = () => {
    const str = window.location.host;
    const Url = `http://${str}`;

    Request.get('/ticket/web/logout')
      .then(() => {
        window.location.href = Url;
      });
  };

  openUrl = () => {
    window.location.href = '/web/Home';
  }

  render() {
    const userName = Cookie.get('user_name');
    return (
      <div className="header">
        <div className="logoContainer" onClick={this.openUrl}>
          <div className="logo" />
          <ShopName />
        </div>
        <div className="orderContainer">
          <div className="order_comp">{userName}</div>
          <div className="exit" onClick={this.logout}>退出</div>
        </div>
      </div>
    );
  }
}

export default Header;
