import React, { useState } from 'react';
import {
    CarOutlined,
    EnvironmentOutlined,
    FileDoneOutlined,
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    OpenAIOutlined,
    TableOutlined,
    UnorderedListOutlined,

    UserOutlined,

} from '@ant-design/icons';
import { Button, Dropdown, Layout, Menu, theme } from 'antd';
const { Header, Sider, Content } = Layout;
import { Link, Outlet, useNavigate } from 'react-router-dom'
import logo from '../../assets/autozoom.svg'
import './Home.scss'








const Home = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate()
    const items = [
        {
            key: '1',
            label: (
                <Link to={'/'}>Log out</Link>
            ),
        },];
    const logOut = () => {
        localStorage.removeItem('access_token')
        navigate('/')
    }

    return (
        <>
            <Layout>
                <Sider
                    width={220}
                    className='sider'
                    trigger={null}
                    collapsible
                    collapsed={collapsed}>
                    <div className="demo-logo-vertical" />
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        items={[
                            {
                                key: '0',
                                icon: collapsed && <img src={logo} />,
                                label: <Link  to={''} ><h3>AutoZoomAdmin</h3></Link>,
                            },
                            {
                                key: '1',
                                icon: <HomeOutlined />,
                                label: <Link to={''} >Dashboard</Link>,
                            },

                            {
                                key: '2',
                                icon: <UnorderedListOutlined />,
                                label: <Link to={'category'} >Category</Link>,
                            },
                            {
                                key: '3',
                                icon: <FileDoneOutlined />,
                                label: <Link to={'brand'} >Brand</Link>,
                            },
                            {
                                key: '4',
                                icon: <TableOutlined />,
                                label: <Link to={'model'} >Model</Link>,
                            },
                            {
                                key: '5',
                                icon: <EnvironmentOutlined />,
                                label: <Link to={'loc'} >Location</Link>,
                            },
                            {
                                key: '6',
                                icon: <OpenAIOutlined />,
                                label: <Link to={'city'} >City</Link>,
                            },
                            {
                                key: '7',
                                icon: <CarOutlined />,
                                label: <Link to={'cars'} >Cars</Link>,
                            },


                        ]}
                    />
                </Sider>
                <Layout>
                    <Header
                        className='header'
                        style={
                            collapsed
                                ? {
                                    padding: 0,
                                    background: colorBgContainer,
                                    position: "fixed",
                                    right: 0,
                                    width: "calc(100% - 80px)",

                                }
                                : {
                                    padding: 0,
                                    background: colorBgContainer,
                                    position: "fixed",
                                    right: 0,
                                    width: "calc(100% - 220px)",
                                }
                        }

                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}

                            />

                            <Dropdown
                                onClick={logOut}
                                menu={{
                                    items,
                                }}
                                placement="bottom"
                            >
                                <Button type='primary'


                                    icon={<UserOutlined />}

                                    style={{
                                        marginRight: '20px'
                                    }}>Admin</Button>

                            </Dropdown>
                        </div>


                    </Header>
                    <Content
                        style={{
                            // margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>



        </>
    )
}

export default Home
