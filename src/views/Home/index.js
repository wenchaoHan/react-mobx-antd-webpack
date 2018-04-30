
import homeInfo from './store';

import React, { Component } from 'react';
import { Layout, Button, Icon, Tooltip } from 'antd';
import { observer } from 'mobx-react';
import Left from './Left';
import Right from './Right';
import './index.css';
const { Header } = Layout;

@observer
class Home extends Component{
    constructor(props)
    {
        super(props);

    }

    render(){
        return(
            <Layout className="layouts">
                <Left />
                <Right />
            </Layout>
        )
    }
}

export default Home;
