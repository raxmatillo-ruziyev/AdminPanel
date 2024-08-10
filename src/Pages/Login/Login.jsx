import React, { useState } from 'react'
import './Login.scss'
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Loader from '../../Componenets/Loader/Loader';
const onFinish = (values) => {
    console.log('Success:', values);
};

const Login = () => {
    const [loading, setLoading] = useState()
    const Url = 'https://autoapi.dezinfeksiyatashkent.uz/api/auth/signin'
    const [phone, setPhone] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate();
    const loginData = () => {
        setLoading(true)
        const formData = new FormData()
        formData.append('phone_number', phone)
        formData.append('password', password)
        fetch(Url, {
            method: 'POST',
            headers: {},
            body: formData,


        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    localStorage.setItem('access_token', data.data.tokens.accessToken.token)
                    message.success(data.message)
                    navigate('/home')

                }
                else {
                    message.error(data.message)
                }
            })
            .finally(() => setLoading(false))


    }


    return (
        <>
            <div className="login">
                    {
                        loading ? <Loader /> : null
                    }
                <div className="container">
                    
                    <Form


                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            maxWidth: 600,
                            margin: ' 150px auto',
                            boxShadow: '1px 1px 6px 1px  #00BFFF',
                            borderRadius: '10px',
                            padding: '50px 0'

                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        autoComplete="off"
                        layout='vertical'
                    >
                        <Form.Item
                        style={{
                           marginLeft:'120px'
                        }}
                            label="Phone nuber"
                            name="phone_number"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input onChange={(e) => setPhone(e.target.value)} />
                        </Form.Item>

                        <Form.Item
                         style={{
                            marginLeft:'120px'
                         }}
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password onChange={(e) => setPassword(e.target.value)} />
                        </Form.Item>



                        <Form.Item
                         style={{
                            marginLeft:'55px'
                         }}
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit" onClick={loginData}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>



                </div>
            </div>
        </>
    )
}

export default Login
