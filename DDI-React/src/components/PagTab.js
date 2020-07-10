import React, { Component } from 'react';
// 引入antd组件
import { Tabs   } from 'antd';
// 引入单个页面（包括嵌套的子页面）
import MyIndexMain from './IndexMain.js';//主界面组件
import MyReleaSpeed from './ReleaSpeed.js';//发布进度
import MyEditRule from './EditRule.js';//编辑规则
const TabPane = Tabs.TabPane;
class PagTab extends Component {
	constructor(props) {
    super(props);
    this.newTabIndex = 0;
    const panes = [
      { title: '主界面', content: <MyIndexMain />, key: '1', closable: false },
      { title: '发布进度', content: <MyReleaSpeed />, key: '5' },
      { title: '编辑规则', content: <MyEditRule />, key: '6' },
    ];
    this.state = {
      activeKey: panes[0].key,
      panes,
    };
  }

  onChange = (activeKey) => {
    this.setState({ activeKey });
  }
  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }
  add = () => {
    const panes = this.state.panes;
    const activeKey = `newTab${this.newTabIndex++}`;
    panes.push({ title: 'New Tab', content: 'Content of new Tab', key: activeKey });
    this.setState({ panes, activeKey });
    alert(1);
  }
  remove = (targetKey) => {
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    }
    this.setState({ panes, activeKey });
  }
	render() {
		return (
			 <Tabs
        onChange={this.onChange}
        activeKey={this.state.activeKey}
        type="editable-card"
        onEdit={this.onEdit}
      >
        {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>{pane.content}</TabPane>)}
      </Tabs>
		)
	}
}
export default PagTab;