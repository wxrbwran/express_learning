import React from 'react';

class TodoItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showDel: false  // 控制删除 icon 的显示隐藏
		}
	}
	
	render() {
		return (
			<div className="todoItem">
				<p>
					<span className="itemCont">{ this.props.content }</span>
					<span className="itemTime">{ this.props.date }</span>
					<button className="delBtn">
						<img
							className="delIcon"
							src="/images/delete.png"
							alt="img"
						/>
					</button>
				</p>					
			</div>
		)
	}
}

export default TodoItem;