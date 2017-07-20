import React from 'react';
import Item from '../Item';

class TodoList extends React.Component {

  	render() {
        // 获取从父组件传递过来的 todolist
  		const todoList = this.props.todoList; 
        // 循环生成每一条 todoItem，并将 delete 方法传递给子组件 
  		const todoItems = todoList.map((item,index) => {
  			return (
                <Item
  					key={index} 
  					content={item.content} 
  					date={item.date} 
  					onDeleteItem={this.props.onDeleteItem} 
                />
    		)
        });

    	return (
    		<div>
    			{ todoItems }		
    		</div>
    	)
  	}
}

export default TodoList;