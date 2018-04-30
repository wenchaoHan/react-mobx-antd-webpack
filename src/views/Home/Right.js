import React, { Component } from 'react';
import { Layout, Icon } from 'antd';
import InfoTable from '../Label/LabelListView';
import RightHeader from './RightHeader';
import { inject, observer } from 'mobx-react';
const { Content, Footer } = Layout;

@observer
class Right extends Component{
    constructor(props)
    {
        super(props);
        console.log('right ',this.props);
    }

    render(){

        return(
                <Layout>
                    <RightHeader/>
                    <Content>
                        <InfoTable/>
                    </Content>
                </Layout>
        )
    }
}

export default Right;
