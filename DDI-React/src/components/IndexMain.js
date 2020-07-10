import React, { Component } from 'react';
// 引入antd组件
import {   } from 'antd';
// 引入单个页面（包括嵌套的子页面）
import MyIndexTable from './IndexTable.js';//表格组件
import MyIndexTabOpera from './IndexTabOpera.js';//表格头操作组



class IndexMain extends Component {
	
	render() {
		return (
			<div className="MainContent">
			  <h2>项目列表</h2>
                <MyIndexTabOpera />
 				<MyIndexTable />{/*表格*/}
                
		</div>
		)
	}
}
export default IndexMain;