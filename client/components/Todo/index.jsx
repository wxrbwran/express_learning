import React, { Component } from 'react'
import axios from 'axios';
import List from './List'

class Todo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			todoList: [],
			showTooltip: false,
      content: '',
		}
	}
	
	componentDidMount () {
		// 获取所有的 todolist
    this.fetchAllTodos();
  }
	
	// 获取
  fetchAllTodos = () => {

  }
  handleInput = (e) => {
    this.setState({
      content: e.target.value,
    });
  }
	// 添加
  addTodoItem = (e) => {
    e.preventDefault();
    axios.post('/add', {
      content: this.state.content,
    }).then(res => {
      console.log(res);
    })
  }

	// 删除

	
	// 对 todolist 进行逆向排序（使新录入的项目显示在列表上面） 


	// 提交表单操作

  	render() {
	  	return (
	  		<div className="container">
				<h2 className="header">待办事项</h2>
				<form
          onSubmit={(e) => this.addTodoItem(e)}
          className="todoForm"
          ref="todoForm">
					<input
            onChange={this.handleInput}
            type="text"
            placeholder="请输入..."
            className="todoContent" />
					{ this.state.showTooltip &&
						<span className="tooltip">请输入待办事项!</span>
					}
				</form>
				<List todoList={this.state.todoList} />
	  		</div>
  		)
  	}
}

export default Todo;
