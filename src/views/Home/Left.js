import React, { Component } from 'react';
import { Layout, Menu, Button, Icon } from 'antd';
import './Left.css';
import { inject, observer } from 'mobx-react';
import homeInfo from './store';
const { Sider } = Layout;
const Item = Menu.Item;

let def = ['0'];

// @inject('homeInfo')
@observer
class Left extends Component{
    constructor(props)
    {
        super(props);
        console.log('left ',this.props);
    }

    onSelect = (e) => {

    };

    render(){
        return(
            <Sider trigger={null} collapsible collapsed={ homeInfo.collapsed} className="div-menu" >
                <div className="logo" />
                <Menu mode="inline"
                      theme='dark'
                      defaultSelectedKeys={def}
                      onSelect={this.onSelect}
                >
                    <Item key={0}>
                        <Icon type={"home"}/>
                        <span>首页</span>
                    </Item>
                    <Item key={1}>
                        <Icon type={"ellipsis"}/>
                        <span>其它</span>
                    </Item>
                    <Item key={2}>
                        <Icon type={"ellipsis"}/>
                        <span>其它</span>
                    </Item>
                    <Item key={3}>
                        <Icon type={"ellipsis"}/>
                        <span>其它</span>
                    </Item>
                    <Item key={4}>
                        <Icon type={"ellipsis"}/>
                        <span>其它</span>
                    </Item>
                </Menu>
            </Sider>
        )
    }


}
export default Left;

