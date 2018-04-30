import React, { Component } from 'react';
import { Provider, observer } from 'mobx-react';
import Request from 'BizUtils/Request'
import LoginForm from './LoginForm';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import store from './store';
import styles from './index.css';
// import axios from 'axios';
import { toJS } from 'mobx';
import App from "BizComponent/App"


class Login extends Component{
    constructor(props)
    {
        super(props);
        this.store = store;
        // axios.defaults.baseURL = 'http://127.0.0.1:8081';
        // axios.defaults.headers.post['Content-Type'] = 'application/json';
    }

    submit = (form) =>{
        form.validateFields((err, values)=>{
            if (!err)
            {
                console.log('Recevied values of form',values);
                // Request.post('/line/login/', {data: values } )
                return Request.post('/line/login/',{data:values})
                    .then((json) => {
                        const pass = json && json.status === 0 && json.data;
                        // changeNullIntoUndefined(json);
                        if (pass) {
                            const {
                                data = {},
                            } = json.data;
                            console.log("sucess");
                            // this.data.optData.ticketMap = data;
                        }
                        return pass;
                    })
                    .catch(err => console.log('queryTicketMap', err));

            }
        })
    };

    componentWillUnmount() {
        this.store.setLoading(false);
    }

    render() {
        return(
                <div className="Login_wrap">
                    <div className="form">
                        <LoginForm submit={(e)=>this.submit(e)}/>
                    </div>
                </div>
        )
    }
}

export default Login;
