import React, { Component } from 'react';
// 引入antd组件
import {Row,Col,Button,DatePicker,Input, Modal } from 'antd';
// 引入单个页面（包括嵌套的子页面）
import MyIndexNewItemForm from './IndexNewItemForm.js';//添加项目弹出框组件
//日期
function onChangeDate(date, dateString) {
  console.log(date, dateString);
}
class IndexTabOpera extends Component {
	//对话框
	  state = { visible: false }
	  showModal = () => {
	    this.setState({
	      visible: true,
	    });
	  }
	  handleOk = (e) => {
	    console.log(e);
	    this.setState({
	      visible: false,
	    });
	  }
	  handleCancel = (e) => {
	    console.log(e);
	    this.setState({
	      visible: false,
	    });
	  }
	render(){
		return(
				<div>
					<div className="TabOpera">
	                  <Row>
	                    <Col span={4}> <Button>批量删除</Button></Col>
	                    <Col span={12} ><span className="spanR"><DatePicker onChange={onChangeDate} /></span><span className="spanR"><Input placeholder="请输入项目名称关键字" /></span><span className="spanR"> <Button type="primary" icon="search">搜索</Button></span></Col>
	                    <Col span={8}><div className="TextRight"><Button>刷新列表</Button><Button type="primary" onClick={this.showModal}>添加项目 </Button></div></Col>
	                  </Row>
	                </div>
	                 {/*添加项目*/}
	                 <Modal
	                  title="添加项目"
	                  visible={this.state.visible}
	                  onOk={this.handleOk}
	                  onCancel={this.handleCancel}
	                >
	                 <MyIndexNewItemForm />
	                </Modal>
	                {/*.添加项目*/}
				</div>
			)
		}
}
export default IndexTabOpera;