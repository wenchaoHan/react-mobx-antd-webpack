import React, { Component } from 'react';
import { Modal, Input,Form,Button,Row,Col,Text } from 'antd';
import {base,en,cn} from './template';
import store from '../LabelListView/store.js';
import { observer } from 'mobx-react';
import './index.css';

const TextArea = Input.TextArea;
const FormItem = Form.Item;

@observer
class AnnoModalForm extends Component{
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
                store.updateAnnotationData(values);
            }
        });
    };

    getFields(){
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
        const children = [];
        for (let j = 0; j < base.length;++j){
            let base_ce = base[j];
            children.push(
                <FormItem label={base_ce.name} {...formItemLayout}>
                    {getFieldDecorator(base_ce.ref, {
                        rules: [{
                            required: true,
                            message: 'Input something!',
                        }],
                    })(
                        <Input
                            placeholder= { this.props.annotation.annotation !== {} ?
                                this.props.annotation.annotation[base_ce.ref] : base_ce.default}
                            defaultValue= { this.props.annotation.annotation !== {} ?
                                this.props.annotation.annotation[base_ce.ref] : base_ce.default}
                        />
                    )}
                </FormItem>
            )
        }

        for (let i = 0; i < 22; i++) {
            let an_cn = cn[i];
            let an_en = en[i];
            children.push(
                <Col span={12} key={i} style='block'>
                    <FormItem label={an_cn.name} {...formItemLayout}>
                        {getFieldDecorator(an_cn.ref, {
                            rules: [{
                                required: true,
                                message: 'Input something!',
                            }],
                        })

                        (
                            an_cn.style === "input" ? <Input
                                placeholder= { this.props.annotation.annotation !== {} ?
                                    this.props.annotation.annotation[an_cn.ref] : an_cn.default}
                                defaultValue= { this.props.annotation.annotation !== {} ?
                                    this.props.annotation.annotation[an_cn.ref] : an_cn.default}
                            /> :
                                <TextArea
                                rows = {4}
                                placeholder= { this.props.annotation.annotation !== {} ?
                                    this.props.annotation.annotation[an_cn.ref] : an_cn.default}
                                defaultValue= { this.props.annotation.annotation !== {} ?
                                    this.props.annotation.annotation[an_cn.ref] : an_cn.default}
                            />

                        )}
                    </FormItem>
                </Col>
            );
            children.push(
                <Col span={12} key={i+12} style='block'>
                    <FormItem label={an_en.name} {...formItemLayout}>
                        {getFieldDecorator(an_en.ref, {
                            rules: [{
                                required: true,
                                message: 'Input something!',
                            }],
                        })(
                            an_cn.style === "input" ? <Input
                                placeholder= { this.props.annotation.annotation !== {} ?
                                    this.props.annotation.annotation[an_cn.ref] : an_cn.default}
                                defaultValue= { this.props.annotation.annotation !== {} ?
                                    this.props.annotation.annotation[an_cn.ref] : an_cn.default}
                            /> :
                                <TextArea
                                    rows = {4}
                                    placeholder= { this.props.annotation.annotation !== {} ?
                                        this.props.annotation.annotation[an_cn.ref] : an_cn.default}
                                    defaultValue= { this.props.annotation.annotation !== {} ?
                                        this.props.annotation.annotation[an_cn.ref] : an_cn.default}
                                />
                        )}
                    </FormItem>
                </Col>
            );
        }
        return children;
    }

    render(){
        // const { getFieldDecorator } = this.props.form;
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
                <Modal  title={"标签-弹框-面板"}
                        onOk={ store.onAnnotationModalOk }
                        onCancel={store.onAnnotationModalOk}
                        confirmLoading={true}
                        visible={ this.props.annotation.visible }
                        footer={null}
                        width="80%"
                >
                    {
                        <Form onSubmit={this.onUpdateLabelDataHandler}>
                            <Row gutter={24}>
                                {this.getFields()}
                            </Row>
                            <FormItem><Button type="primary" htmlType="submit">提交</Button></FormItem>
                        </Form>
                    }
                </Modal>
            </div>
        )
    }
}

const AnnoModal = Form.create()(AnnoModalForm);
export default AnnoModal;
