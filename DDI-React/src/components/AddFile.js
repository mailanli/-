import React, { Component } from 'react';
// 引入antd组件
import {Row,Col,Input,Form ,Radio,Checkbox ,Select ,Button,Card   } from 'antd';

// 引入单个页面（包括嵌套的子页面）
const FormItem = Form.Item;
const Option = Select.Option;
class AddFile extends Component {
	handleSubmit = (e) => {
	    e.preventDefault();
	    this.props.form.validateFields((err, values) => {
	      if (!err) {
	        console.log('Received values of form: ', values);
	      }
	    });
	  }
	  normFile = (e) => {
	    console.log('Upload event:', e);
	    if (Array.isArray(e)) {
	      return e;
	    }
	    return e && e.fileList;
	  }
	  //对象类型选择
	  handleFormObjectTypeChange =(e) => {
		
	  }	
	render() {
		const { getFieldDecorator } = this.props.form;
	    const formItemLayout = {
	      labelCol: { span: 6 },
	      wrapperCol: { span: 14 },
	    };
		return (
			<div className="MainContent">
				<Form onSubmit={this.handleSubmit}>
					<FormItem {...formItemLayout} label="数据源名称">
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
		            label="数据源类型"
		            {...formItemLayout}
		          >
		            <Radio.Group defaultValue="val1" onChange={this.handleFormLayoutChange}>
		              <Radio.Button value="val1" >本地文件</Radio.Button>
		              <Radio.Button value="val2">ftp</Radio.Button>
		              <Radio.Button value="val3">http</Radio.Button>
		               <Radio.Button value="val4">数据库</Radio.Button>
		            </Radio.Group>
		          </FormItem>
		          <FormItem
	            label="对象类型："
	            {...formItemLayout}
	          >
	            <Radio.Group defaultValue="val1" onChange={this.handleFormObjectTypeChange}>
	              <Radio.Button value="val1" >文件</Radio.Button>
	              <Radio.Button value="val2">文件夹</Radio.Button>
	            </Radio.Group>
	          </FormItem>
	          <FormItem {...formItemLayout} label="对象地址：">
	              {getFieldDecorator('fileInput', {
	                rules: [{
	                  required: true,
	                  message: '选择本地地址',
	                }],
	              })(
	                <Input placeholder="选择本地地址" type="fileInput" />
	              )}
	          </FormItem>
	     	 {/*文件夹显示*/}
	          <div className="hideLoyerBox">
	          <FormItem
	            label="是否包含子目录"
	            {...formItemLayout}
	          >：
	            <Radio.Group defaultValue="val1" onChange={this.handleFormLayoutChange}>
	              <Radio.Button value="val1" >是</Radio.Button>
	              <Radio.Button value="val2">否</Radio.Button>
	            </Radio.Group>
	          </FormItem>
	          <FormItem
	            label="是否保持目录结构"
	            {...formItemLayout}
	          >：
	            <Radio.Group defaultValue="val1" onChange={this.handleFormLayoutChange}>
	              <Radio.Button value="val1" >是</Radio.Button>
	              <Radio.Button value="val2">否</Radio.Button>
	            </Radio.Group>
	          </FormItem>
	           <FormItem 
	           label="高级选项"
	           {...formItemLayout}>
		          <Checkbox
		            value="true"
		            onChange={this.handleChange}
		          >
		            
		          </Checkbox>
		        </FormItem>
		  		 {/*高级选项*/}
		        <div className="selectBox">
					<FormItem
			          {...formItemLayout}
			          label="包含文件"
			        >
			          {getFieldDecorator('select-multiple', {
			            rules: [
			              {  message: '请选择', type: 'array' },
			            ],
			          })(
			            <Select mode="multiple" placeholder="请选择">
			              <Option value="red">Red</Option>
			              <Option value="green">Green</Option>
			              <Option value="blue">Blue</Option>
			            </Select>
			          )}
			        </FormItem>
			        <FormItem
			          {...formItemLayout}
			          label="排除文件"
			        >
			          {getFieldDecorator('select-multiple1', {
			            rules: [
			              {  message: '请选择', type: 'array' },
			            ],
			          })(
			            <Select mode="multiple" placeholder="请选择">
			              <Option value="red">Red</Option>
			              <Option value="green">Green</Option>
			              <Option value="blue">Blue</Option>
			            </Select>
			          )}
			        </FormItem>
		        </div>
		    	{/*./高级选项*/}
	          </div>
	        {/*./文件夹显示*/}

		         <div className="btnGroup"> <Button type="primary">添加至输入数据源列表</Button></div>
		       	
	            </Form>  
                
			</div>
		)
	}
}
const MyAddFile = Form.create()(AddFile);
export default MyAddFile;