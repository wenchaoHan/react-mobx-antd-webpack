
import homeInfo from './store';
import tableInfo from  '../Label/LabelListView/store';

import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { inject, observer } from 'mobx-react';
import './RightHeader.css';
const { Header } = Layout;
const { SubMenu } = Menu;


// @inject('HomeInfo')
@observer
class RightHeader extends Component{

    constructor(props)
    {
        super(props);
        console.log("coll ",homeInfo.collapsed);
    }

    render(){
        return (
            <Header style={{ background: '#fff', padding: 0 }} >
                <Icon
                    className="trigger"
                    type={ homeInfo.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={ homeInfo.changeCollapsed }
                />
                <Icon className="addBtn"
                      type={'plus'}
                      onClick={tableInfo.addBtnClick}
                />
            </Header>
        )
    }
}

export default RightHeader;
