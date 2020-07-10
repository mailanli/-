import React, { Component } from 'react';
// 引入antd组件
import {Table } from 'antd';
import MyEditRule from './EditRule.js';//编辑规则
//定义表格
const columns = [{
  title: '序号',
  dataIndex: 'col0',
  sorter: true,
},{
  title: '项目名称',
  dataIndex: 'col1',
}, {
  title: '版本号',
  dataIndex: 'col2',
}, {
  title: '所属公司',
  dataIndex: 'col3',
}, {
  title: '所属部门',
  dataIndex: 'col4',
}, {
  title: '创建时间',
  dataIndex: 'col5',
}, {
  title: '修改人',
  dataIndex: 'col6',
}, {
  title: '操作',
  dataIndex: 'col7',
  key: '', 
  render: () => <div> <a href="#"  >编辑项目</a>  | <a href="#">编辑规则</a> | <a href="#">编辑项目</a>  | <a href="#">删除项目</a> | <a href="#">发布项目</a> | <a href="#">打开本地目录</a>  |  <a href="#">发布进度</a></div>
}];

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    col0: i,
    col1:'项目名称',
    col2: `v 1.0`,
    col3: 'xx公司',
    col4: `xx部门`,
    col5:'2017-11-1',
    col6:'a',
  });
}
class IndexTable extends Component {
	
	  //表单
	  state = {
	    selectedRowKeys: [], // Check here to configure the default column
	    loading: false,
	  };
	  start = () => {
	    this.setState({ loading: true });
	    // ajax request after empty completing
	    setTimeout(() => {
	      this.setState({
	        selectedRowKeys: [],
	        loading: false,
	      });
	    }, 1000);
	  }
	  onSelectChange = (selectedRowKeys) => {
	    console.log('selectedRowKeys changed: ', selectedRowKeys);
	    this.setState({ selectedRowKeys });
	  }

	render() {
	    const { loading, selectedRowKeys } = this.state;
	    const rowSelection = {
	      selectedRowKeys,
	      onChange: this.onSelectChange,
	    };
	    const hasSelected = selectedRowKeys.length > 0;
		return (
               
 				<Table rowSelection={rowSelection} columns={columns} dataSource={data} nChange={this.handleTableChange}  rowKey="col0" />
		)
	}
}
export default IndexTable;