import App from "BizComponent/App";
import React, { Component } from 'react';
import { Layout } from 'antd';
import {observer} from 'mobx-react';
import './index.css';
import 'antd/dist/antd.css';
import store from "./store";
import SiteModal from 'BizComponent/SiteModal';
import LabelList from "./LabelListView";


@observer
class Label extends Component{
    constructor(props)
    {
        super(props);
    };

    onSelectSiteEvent(site){
        store.site = site;
    };

    getContent()
    {
        if(store.site === undefined){
            return(
                <div>
                    <SiteModal onSelectSiteEvent={this.onSelectSiteEvent.bind(this)} />
                </div>
            )
        }
        else {
            return(
                <div>
                    {this.getLabelView()}
                </div>
            )
        }
    }

    getLabelView = () =>{
        return(
            <div>
                {/*<SelectSite site={store.site} />*/}
                {/*<LabelListView labels = {store.labelDataList} />*/}
                <div className="labelview">
                <LabelList site={store.site}/>
                </div>

            </div>
        )
    };

    render(){
        return(
            <Layout className="layouts">
                {this.getContent()}
            </Layout>
        )
    }
}

class LabelPage extends Component{
    constructor(props)
    {
        super(props);
    }


    render(){
        return(
            <App>
                <Label />
            </App>
        )
    }
}

export default LabelPage;

// App.renderDOM(LabelPage);