import React, { Component } from 'react';
// 引入antd组件
import {  Layout,Button,Modal   } from 'antd';
// 引入单个页面（包括嵌套的子页面）
import MyItemTree from './ItemTree.js';//编辑规则
import MyAddFile from './AddFile.js';//添加本地文件
import MyAddCsv from './AddCsv.js';//添加Csv
import MyAddXml from './AddXml.js';//添加Xml
import MyAddExcel from './AddExcel.js';//添加Xml
import MyAddData from './AddData.js';//添加数据库
const { Sider, Content } = Layout;
class EditRule extends Component {
  state = {
    loading: false,
    visible: false,
    mod:<MyAddXml />,
    title:"添加本地文件",
  }
  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  }
  handleCancel = () => {
    this.setState({ visible: false });
  }
  //数据源输入
  showModalInputData= (mod,title) =>{
    this.setState({
      visible: true,
      mod:mod,
      title:title,
    });
  }
	render() {
    const { visible, loading } = this.state;
		return (
  		<div className="MainContent">
          <Layout>
            <Sider className="ItemTreeSider"><MyItemTree /></Sider>
            <Layout>
              <Content className="EditRuleCon">
                  {/*编辑规则内容*/}
                      <div className="content">
                            <Button className="EditRuleBtn btn1"   onClick={() => this.showModalInputData(<MyAddFile />,"添加本地文件")}><i className="icon addfile01"></i>添加本地文件</Button>  
                            <Button  className="EditRuleBtn btn2"   onClick={() => this.showModalInputData(<MyAddCsv />,"添加csv")}><i className="icon addcsv"></i>添加csv</Button>
                            <Button  className="EditRuleBtn btn3"   onClick={() => this.showModalInputData(<MyAddXml />,"添加xml")}><i className="icon addxml"></i>添加xml</Button>
                            <Button  className="EditRuleBtn btn4"    onClick={() => this.showModalInputData(<MyAddExcel />,"添加excel")}><i className="icon addexcel"></i>添加excel</Button>
                            <Button  className="EditRuleBtn btn5"    onClick={() => this.showModalInputData(<MyAddData />,"添加数据库")}><i className="icon adddata"></i>添加数据库</Button>
                          {/*设置数据源输入Model*/}
                          <Modal
                            visible={visible}
                            title={this.state.title} 
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            footer={false}
                            width="90%"
                            style={{ top: 20 }}
                          >
                            {this.state.mod} 
                          </Modal>
                          {/* ./设置数据源输入Model*/}
                      </div>
                {/*./编辑规则内容*/}
              </Content>
            </Layout>
          </Layout>
      </div>
		)
	}
}
export default EditRule;