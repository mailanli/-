import React, { Component } from 'react';
// 引入antd组件
import { DatePicker,Input,Form  } from 'antd';

//日期
function onChangeDate(date, dateString) {
  console.log(date, dateString);
}
//表单组件
const FormItem = Form.Item;
class FormWrap extends React.Component {
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
  render() {
     const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      };
     return (
      <Form onSubmit={this.handleSubmit}>
           <FormItem {...formItemLayout} label="项目名称">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请输入项目名称关键字',
                }],
              })(
                <Input placeholder="请输入项目名称关键字" />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="版本号">
              {getFieldDecorator('version', {
                rules: [{
                  message: '请输入版本号',
                }],
              })(
                <Input placeholder="请输入版本号" />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属公司">
              {getFieldDecorator('Company', {
                rules: [{
                  message: '请输入所属公司',
                }],
              })(
                <Input placeholder="请输入所属公司" />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属部门">
              {getFieldDecorator('Department', {
                rules: [{
                  message: '请输入所属部门',
                }],
              })(
                <Input placeholder="请输入所属部门" />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属部门">
              {getFieldDecorator('DatePic', )(
                <DatePicker onChange={onChangeDate} />
              )}
          </FormItem>

       </Form>
      )
  }
}

const IndexNewItemForm = Form.create()(FormWrap);
export default IndexNewItemForm;