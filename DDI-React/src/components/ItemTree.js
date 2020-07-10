import React, { Component } from 'react';
// 引入antd组件
import {  Tree    } from 'antd';
const TreeNode = Tree.TreeNode;

// 引入单个页面（包括嵌套的子页面）
class ItemTree extends Component {
    onSelect = (selectedKeys, info) => {
      console.log('selected', selectedKeys, info);
    }
    onCheck = (checkedKeys, info) => {
      console.log('onCheck', checkedKeys, info);
    }
	render() {
		return (
  		<div className="ItemTreeCon">
          <Tree
            
            defaultExpandedKeys={['0-0-0', '0-0-1']}
            defaultSelectedKeys={['0-0-0', '0-0-1']}
            defaultCheckedKeys={['0-0-0', '0-0-1']}
            onSelect={this.onSelect}
            onCheck={this.onCheck}
          >
            <TreeNode title="设置数据源输入" key="0-0">
                <TreeNode title="添加本地文件" key="0-0-1"></TreeNode>
            </TreeNode>
            <TreeNode title="设置数据读取" key="0-1">
                <TreeNode title="添加csv" key="0-1-1"></TreeNode>
                <TreeNode title="添加excel" key="1-0-2"></TreeNode>
                <TreeNode title="添加xml" key="0-1-3"></TreeNode>
                <TreeNode title="添加数据库" key="0-1-3"></TreeNode>
            </TreeNode>
            <TreeNode title="发布进度" key="0-4">
            </TreeNode>
          </Tree>
      </div>
		)
	}
}
export default ItemTree;