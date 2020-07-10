import React, { Component } from 'react';
// 引入React-Router模块
import {HashRouter as Router, Link,Route} from 'react-router-dom';
// 引入antd组件
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
// 引入主体样式文件
import './App.css';
import './css/font-awesome.min.css';
// 引入单个页面（包括嵌套的子页面）
import MyPagTab from './components/PagTab.js';//PagTab组件 
//定义
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

//App组件
class App extends Component {
  state = {
    collapsed: false,
  };
  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }
  render() {
    return (
      <Router >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
              <Icon type="pie-chart" />
              <span>当前栏目名称</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="desktop" />
              <span>栏目名称</span>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={<span><Icon type="user" /><span>栏目名称</span></span>}
            >
              <Menu.Item key="3">子菜单</Menu.Item>
              <Menu.Item key="4">子菜单</Menu.Item>
              <Menu.Item key="5">子菜单</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={<span><Icon type="team" /><span>栏目名称</span></span>}
            >
              <Menu.Item key="6">子菜单</Menu.Item>
              <Menu.Item key="8">子菜单</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} >
              <div className="headerCon"> <div className="left ">当前时间：2017-03-30 周四 11:05:00</div> <div className="right"><span>欢迎您！用户名</span><a href="#">修改密码</a><a href="#">退出系统</a></div></div>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <MyPagTab />
           
          </Content>
        
        </Layout>
      </Layout>
      </Router>
    );
  }
}
export default App;
