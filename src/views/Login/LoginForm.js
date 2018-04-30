import React, { Component } from 'react';
import { Form, Input, Button, Icon } from 'bach-antd';
// import { inject, observer} from 'mobx-react';
import './LoginForm.css';
const FormItem = Form.Item;

class LoginForm extends Component{

    handleSubmit = (e) => {
        e.preventDefault();
        let {form} = this.props;
        this.props.submit(form);
    };


    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form className="login-form" onSubmit={this.handleSubmit}>
                <FormItem>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入用户名' }],
                    })(
                        <Input prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }}/>} placeholder="用户名" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码' }],
                    })(
                        <Input prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }}/>} type="password" placeholder="密码" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

export default Form.create()(LoginForm);