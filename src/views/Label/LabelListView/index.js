import React, { Component } from 'react';
import { Table, Divider, Input, Icon, Popconfirm, Button,Select,Spin } from 'antd';
import LabelModal from '../LabelModalView/index';
import AnnotationModal from "../AnnoModalView";
import store from './store';
import './index.css';
import { observer } from 'mobx-react';
import notice from 'BizComponent/Notification';
const Option = Select.Option;

@observer
class SelectSite extends Component {

    handleChange = (site) =>{
        store.changeSiteAndGetLabels(site);
    };

    getContent()
    {
        return(
            <div>
                <span>当前所在景区：</span>
                <Select defaultValue={this.props.site} style={{ width: 200 }} onChange={this.handleChange}>
                    <Option value="gubei">古北水镇</Option>
                    <Option value="wuzhen">乌镇</Option>
                    <Option value="wujiangcun">乌江村</Option>
                    <Option value="">其他</Option>
                </Select>
            </div>
        );
    };

    render(){
        return (
            <div>
                {this.getContent()}
            </div>
        );
    }
}


@observer
class LabelListView extends Component{
    constructor(props)
    {
        super(props);
        this.columns = [];
        this.data = [];  //接受到的原始数据
        this.state = {
            filterDropdownVisible: false,
            searchText: '',
            filtered: false,
            visible: false,
            modalData: {}
        };
    }

    onInputChange = (e) => {
        this.setState({ searchText: e.target.value });
    };

    onSearch = () => {
        const { searchText } = this.state;
        const reg = new RegExp(searchText, 'gi');
        this.setState({
            filterDropdownVisible: false,
            filtered: !!searchText,
            dataSource_: this.data.map((record) => {
                const match = record.name.match(reg);
                if (!match) {
                    return null;
                }
                return {
                    ...record,
                    name: (
                        <span>
              {record.name.split(reg).map((text, i) => (
                  i > 0 ? [<span key={i} className="highlight">{match[0]}</span>, text] : text
              ))}
            </span>
                    ),
                };
            }).filter(record => !!record),
        });
    };

    showModal = (record)=>{
        if(record){
            const dataSource_ = [...store.labelDataList];
            store.setLabelModalData(dataSource_.filter(item => item.id === record.id)[0]);
        }
        else {
            store.setLabelModalData();
        }
    };

    showAnnoModal = (record) =>{
        if(record){
            const dataSource = [...store.labelDataList];
            let annot = dataSource.filter(item => item.id === record.id)
            if(annot){
                store.selectAnnotationData(record.id);
                return;
            }
        }
        notice.info("信息输入有错误，检查～",2,{});
    };

    componentDidMount() {
        store.changeSiteAndGetLabels(this.props.site);
    };

    onDelete = (id)=>{
        console.log(id);
        // this.store.deleteItem(id);
        const dataSource_ = [...store.labelDataList];
        this.setState({ dataSource_: dataSource_.filter(item => item.id !== id) });
    };

    handleAddLabel = () =>{
        console.log("add label ...");
        this.showModal(null);
    };

    render(){
        // console.log(this.state.dataSource_);
        this.columns = [
            {
                title: "序号",
                dataIndex: "id",
                key:"id",
                width: "15%",
                defaultSortOrder: "ascend",
                sorter: (a, b)=>a.id - b.id
            },
            {
                title: "名称",
                dataIndex: "name",
                key: "name",
                width: "40%",
                filterDropdown:
                    <div className="custom-filter-dropdown">
                        <Input
                            ref={ele => this.searchInput = ele}
                            placeholder="Search Name"
                            value={this.state.searchText}
                            onChange={this.onInputChange}
                            onPressEnter={this.onSearch}
                        />
                        <Button type="primary" onClick={this.onSearch}>Search</Button>
                    </div>,
                filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
                filterDropdownVisible: this.state.filterDropdownVisible,
                onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                        filterDropdownVisible: visible,
                    }, () => this.searchInput && this.searchInput.focus());
                }
            },
            {
                title: "分类",
                dataIndex: "type",
                key: "type",
                width: "20%",
                sorter: (a, b)=>a.type - b.type
            },
            {
                title: "操作",
                dataIndex: "action",
                key: "action",
                render: (text, record)=>{
                    return(
                        <span>
                            <a onClick={
                                ()=>{
                                    this.showModal.call(this,record);
                                }}>标签</a>
                            <Divider type="vertical" />
                            <a onClick={
                                ()=>{
                                    this.showAnnoModal.call(this, record);
                                }}>弹框</a>
                            <Divider type="vertical" />
                            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.id)}>
                                <a href="#">删除</a>
                            </Popconfirm>
                        </span>
                    )}
            }
        ];
        return(
            <div>
                <SelectSite site = {this.props.site} />
                <Spin spinning={store.spinVisible}>
                    <Button className="editable-add-btn" onClick={this.handleAddLabel}>增加一个标签</Button>
                    <Table bordered dataSource={store.labelDataList} size="middle" columns={this.columns} pagination={{ pageSize:50 }} scroll={{y:600}}/>
                </Spin>
                <LabelModal labelData = {store.labelMData}/>
                <AnnotationModal annotation = {store.annotationData}/>
            </div>
        )
    }
}

export default LabelListView;
