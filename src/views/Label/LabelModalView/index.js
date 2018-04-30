
import React, { Component } from 'react';
import { Modal, Input,Form,Button } from 'antd';
import template from './template';
import store from '../LabelListView/store.js';
import { observer } from 'mobx-react';
import './index.css';


const FormItem = Form.Item;


@observer
class LabelModalForm extends Component{

    constructor(props)
    {
        super(props);
        console.log("props ",this.props);
    }

    onUpdateLabelDataHandler = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                store.onUpdateLabelDataHandler(values);
            }
        });
    };

    onBtnClose =() => {
        this.props.form.resetFields();
        store.onLabelModalOk();
    };

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 10 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 10 },
                sm: { span: 16 },
            },
        };
        return (
            <div>
                {/*<a onClick={()=>{ this.setState({visible: true}) }}>Edit</a>*/}
                <Modal  title={"业态-标签-面板"}
                        onOk={ this.onBtnClose }
                        onCancel={ this.onBtnClose }
                        confirmLoading={true}
                        visible={ this.props.labelData.visible }
                        footer={null}
                >
                    {
                        <Form onSubmit={this.onUpdateLabelDataHandler}>
                            {
                                template.map((item,index,ary)=>
                                    <FormItem {...formItemLayout} label={item.name} >
                                        {
                                            getFieldDecorator(item.ref, {
                                                rules: [
                                                    {
                                                        required: true,
                                                    },
                                                ],
                                            })(
                                                <Input key={index}
                                                       id={index}
                                                       placeholder={ this.props.labelData.modalData !== {} ? this.props.labelData.modalData[item.ref] : item.ref}
                                                       defaultValue={ this.props.labelData.modalData !== {} ? this.props.labelData.modalData[item.ref] : null}
                                                       // type="te"
                                                />
                                            )
                                        }

                                    </FormItem>
                                )

                            }
                            <FormItem><Button type="primary" htmlType="submit">更  改</Button></FormItem>
                        </Form>
                    }
                </Modal>
            </div>
        )
    }
}

const LabelModal = Form.create()(LabelModalForm);
export default LabelModal;
