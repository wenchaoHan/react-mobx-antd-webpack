import React, { Component } from 'react';
import { Menu,Layout,Icon } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import '../index.css';
// import store from '../Crumb/store.js';
import store from '../store';
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;
const Item = Menu.Item;

// store.fetchRbac();

function sort(a, b) {
  return a.sort - b.sort;
}

/**
 * 这里要判断 menu 有没有子元素
 * 1) 如果没有给 menu 一个 a 标签，点了就跳转，还能高亮；
 * 2) 有不给 menu a 标签，点了光展开，子元素高亮，但是进入到对应页面得展开；
 */
@observer
class LeftNav extends Component {
  getMenuTitle(item) {
    const pattern = /^[e-f][0-8][0-9a-f]{2}$/;
    if (pattern.test(item.desc)) {
      return (
        <span className="inline-block">
          <i
            className="menuIcon"
            /* eslint-disable react/no-danger */
            // dangerouslySetInnerHTML={{ __html: `&#x${item.desc};` }}
          />
          <span className="inline-block">{item.name}</span>
        </span>
      );
    }
    return <span className="inline-block">{item.name}</span>;
  }

  generateMenu(menu)
  {
    let menu_ = menu? menu:[];
    return menu_.sort(sort).map((item) => {
      const { children } = item;
      // if (children.length) {
        return (
          <SubMenu key={item.path} title={this.getMenuTitle(item)}>
            {children.sort(sort).map(v => (
              <Item key={v.path}>
                <a href={v.path}>{v.name}</a>
              </Item>
            ))}
          </SubMenu>
        );
      // }

      return (
        <Item key={item.path}>
          <a href={item.path}>{item.name}</a>
        </Item>
      );
    });
  }


  // render() {
  //   const menu = toJS(store.menu);
  //   const selected = toJS(store.select);
  //   const selectedKeys = selected ? selected.selectKeys : [];
  //   const defaultOpenKeys = selected ? selected.openKeys : [];
  //
  //   if (menu && !menu.length) return null;
  //
  //   return (
  //     <Menu
  //       theme="light"
  //       selectedKeys={selectedKeys}
  //       defaultOpenKeys={defaultOpenKeys}
  //       mode="inline"
  //     >
  //       {this.generateMenu(menu)}
  //     </Menu>
  //   );
  // }




    constructor(props)
    {
        super(props);
    }

    onSelect = (e) => {

    };

    render(){
        let def = ['0'];
        return(
            <Sider trigger={null} collapsible collapsed={this.props.collapsed} className="div-menu" >
              <Menu
                    theme='light'
                    defaultSelectedKeys={def}
                    onSelect={this.onSelect}
                    mode="inline"
              >
                <Item key={0}>
                  <Icon type={"home"}/>
                    <span>首页</span>
                </Item>
                <Item key={1}>
                  <Icon type={"ellipsis"}/>
                  <span>业态收集</span>
                </Item>
                <Item key={2}>
                  <Icon type={"ellipsis"}/>
                  <span>活动运营</span>
                </Item>
              </Menu>
            </Sider>
        )
    }
}

export default LeftNav;
