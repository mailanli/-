import React, { Component } from 'react';
// 引入antd组件
import {Table } from 'antd';
//定义表格
const columns = [{
  title: '序号',
  dataIndex: 'col0',
  sorter: true,
},{
  title: '对象ID',
  dataIndex: 'col1',
}, {
  title: '对象名称',
  dataIndex: 'col2',
}, {
  title: '启动时间',
  dataIndex: 'col3',
}, {
  title: '结束时间',
  dataIndex: 'col4',
}, {
  title: '发布结果',
  dataIndex: 'col7',
  key: '', 
  render: () => <div> <span className="green">成功</span>  <span className="red">失败</span></div>
}];

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    col0: i,
    col1:'XXXXXXXXXXXXXXXX',
    col2: `测试对象名称`,
    col3: '2017-06-01 23:59:59',
    col4: `2017-06-02 05:00:00`,
  });
}
class ReleaSpeed extends Component {
	
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
               <div className="MainContent">
 				<Table rowSelection={rowSelection} columns={columns} dataSource={data} nChange={this.handleTableChange}  rowKey="col0" />
 				</div>
		)
	}
}
export default ReleaSpeed;