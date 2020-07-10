import React, { Component } from 'react';
// 引入antd组件
import {Row,Col,Input,Form ,Radio,Checkbox ,Select ,Button,Card ,Table,Icon,InputNumber } from 'antd';
// 引入单个页面（包括嵌套的子页面）
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
//表格
const columns = [{
  title: '字段域名',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '类型',
  dataIndex: 'type',
  key: 'type',
}, {
  title: '格式',
  dataIndex: 'format',
  key: 'format',
},{
  title: '别名',
  dataIndex: 'otherName',
  key: 'otherName',
},{
  title: 'java类型',
  dataIndex: 'javaType',
  key: 'javaType',
},{
  title: '替换空值',
  dataIndex: 'replaceNull',
  key: 'replaceNull',
},{
  title: '操作',
  key: 'action',
  render: (text, record) => (
    <ul className="liLeft win60">
      <li><a href="#" ><i className=" icon-plus"></i></a></li>
      <li><a href="#"  className="disabled" ><i className=" icon-remove"></i></a></li>
      </ul>
  ),
}];

const data = [{
  key: '1',
  name: <Input placeholder="字段域名" />,
  type:<Select
    showSearch
    style={{ width: 100 }}
    placeholder="类型"
    optionFilterProp="children"
    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
  >
		<option value="类型">类型</option>
		<option selected="" value="String">String</option>
		<option value="DateTime">DateTime</option>
		<option value="Integer">Integer</option>
		<option value="Long">Long</option>
		<option value="Float">Float</option>
		<option value="SystemDate">SystemDate</option>
	</Select> ,
  format:<Select
    showSearch
    style={{ width: 100 }}
    placeholder="格式"
    optionFilterProp="children"
    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
  >	
  <option value="格式">格式</option>
  <option value="yyyy-MM-dd HH:mm:ss">yyyy-MM-dd HH:mm:ss</option>
  <option value="yyyy年MM月dd日">yyyy年MM月dd日</option>
  <option value="…">…</option>
  </Select>,
  otherName: <Input placeholder="别名" />,
  javaType:<Select
    showSearch
    style={{ width: 100 }}
    placeholder="java类型"
    optionFilterProp="children"
    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
  >	
  <option value="type">=类型</option>
  <option value="1">选项</option>
  
  </Select>,
  
	replaceNull:<Input placeholder="替换空值" /> ,
}];
class AddData extends Component {	
	render() {
		const { getFieldDecorator } = this.props.form;
	    const formItemLayout = {
	      labelCol: { span: 6 },
	      wrapperCol: { span: 14 },
	    };
		return (
			<Form onSubmit={this.handleSubmit}>
					<FormItem {...formItemLayout} label="数据名称">
		              {getFieldDecorator('name', {
		                rules: [{
		                  required: true,
		                  message: '输入显示于右侧文件列表的名称',
		                }],
		              })(
		                <Input placeholder="输入显示于右侧文件列表的名称" />
		              )}
		          </FormItem>
	          <FormItem
		          {...formItemLayout}
		          label="读取对象"
		          hasFeedback
		        >
		          {getFieldDecorator('select', {
		            rules: [
		              { required: true, message: '请选择' },
		            ],
		          })(
		            <Select placeholder="请选择">
		              <Option value="in1">in1</Option>
		              <Option value="in2">in2</Option>
		            </Select>
		          )}
		        </FormItem>
		        <FormItem
	            label="数据库类型"
	            {...formItemLayout}
	          >
	            <Radio.Group defaultValue="mysql" onChange={this.handleFormObjectTypeChange}>
	              <Radio.Button value="mysql" >mysql</Radio.Button>
	              <Radio.Button value="oracle">oracle</Radio.Button>
	              <Radio.Button value="sqlserver">sqlserver</Radio.Button>
	              <Radio.Button value="sybase">sybase</Radio.Button>
	            </Radio.Group>
	          </FormItem>
	          <FormItem
		          {...formItemLayout}
		          label=" 数据库连接池"
		          hasFeedback
		        >
		          {getFieldDecorator('select2', {
		            rules: [
		              { required: true, message: '请选择' },
		            ],
		          })(
		            <Select placeholder="请选择" >
		              <Option value="ve1">选项</Option>
		            </Select>
		          )}
		        </FormItem>
		        <FormItem
		          {...formItemLayout}
		          label=" 读取类型"
		          hasFeedback
		        >
		          {getFieldDecorator('select3', {
		            rules: [
		              { required: true, message: '请选择' },
		            ],
		          })(
		            <Select placeholder="请选择" >
		              <Option value="ve1">全表</Option>
		              <Option value="ve1">自定义语句</Option>
		            </Select>
		          )}
		        </FormItem>
		        <FormItem {...formItemLayout} label="数据库表名">
		              {getFieldDecorator('tableName', {
		                rules: [{
		                  required: true,
		                  message: '输入数据库表名',
		                }],
		              })(
		                <Input  />
		              )}
		          </FormItem>
		          <FormItem {...formItemLayout} label="自定义语句">
		              {getFieldDecorator('tableName', {
		                rules: [{
		                  required: true,
		                  message: '输入自定义语句',
		                }],
		              })(
		                <TextArea rows={4} />
		              )}
		          </FormItem>

			    <FormItem
			          {...formItemLayout}
			          label="大数据并发数"
			        >
			          {getFieldDecorator('input-number', { initialValue: 3 ,rules: [{
	                  required: true,
	                }],})(
			            <InputNumber min={1} max={10} />
			          )}
			         
			        </FormItem>
		          <FormItem
			            label="数据域集"
			            {...formItemLayout}
			       >
			       {getFieldDecorator('dataBtn', {
	                rules: [{
	                  required: true,
	                }],
	              })(
	              	<div className="addDataBox addDataBtn">
                    	<a href="#" className="btn">生成数据域集</a>
                        <i className="arrow icon-caret-down"></i>
                    </div>
	              )}
		          </FormItem>
		          <Table columns={columns} dataSource={data} pagination={false}  bordered="true"/>
		          <br />
	          
	        </Form> 
		)
	}
}
const MyAddData = Form.create()(AddData);
export default MyAddData;