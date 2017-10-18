import React from "react";
import {toggleTodo, confirmDelete, updateTodo} from "../../actions/TodoActions";

export default class Todo extends React.Component {
  constructor() {
    super()
    this.state = {
      isMouseOver: false,
      isEditting: false
    }
  }
  componentDidUpdate(){
    if (this.state.isEditting) {
      this.refs.editbox.focus();
    }
  }
  toggleThisTodo(){
    if (!this.state.isEditting) {
      toggleTodo(this.props.id);
    }
  }
  confirmDeleteThis(){
    if (!this.state.isEditting) {
      confirmDelete(this.props.id);
    }
  }
  highlightThis(){
    this.setState({isMouseOver: true});
  }
  dehighlightThis(){
    this.setState({isMouseOver: false});
  }
  activateEditting(){
    this.setState({isEditting: true});
  }
  cancelEditting(){
    this.setState({isMouseOver: false, isEditting: false});
  }
  applyEditting(){
    updateTodo(this.props.id, this.refs.editbox.value);
    this.setState({isMouseOver: false, isEditting: false});
  }
  render() {
    const { text, complete } = this.props;
    const { isMouseOver, isEditting } = this.state;
    const btnClass = "btn btn-sm " + (complete ? "btn-warning" : "btn-success") + " todo-ctrls";
    const icoClass = "fa " + (complete ? "fa-undo" : "fa-minus-circle");
    const addEditBtn = (<button className="btn btn-default btn-xs" 
                                onClick={this.activateEditting.bind(this)}
                                style={{verticalAlign:'middle',position:'absolute'}} >
                                <i className="fa fa-pencil"></i>
                                </button>);
    let addText;
    if (isEditting) {
      addText = (
        <span>
          <div className="form-group">
            <input className="form-control input-sm" type="text" ref="editbox" placeholder="TASK DESCRIPTION" defaultValue={text} />
          </div>
          <button className="btn btn-info btn-sm display-sm-block" onClick={this.applyEditting.bind(this)}>
              <i className="fa fa-check"></i>
          </button>
          <button className="btn btn-warning btn-sm display-sm-block" onClick={this.cancelEditting.bind(this)}>
              <i className="fa fa-times"></i>
          </button>
        </span>
      )
    } else {
      addText = (
        <div className="todo-text-container" style={complete ? {textDecoration: "line-through", color: "#999"} : {}}
          onMouseEnter={this.highlightThis.bind(this)} 
          onMouseLeave={this.dehighlightThis.bind(this)}>
          <span className="todo-text">{text}</span>
          {isMouseOver ? addEditBtn : ""}
        </div>
      )
    }
    return (
      <li className="list-group-item todo-list" style={complete ? {background: '#415161'} : {}}>
        <div className="form-inline">
          <div className="form-group">
            <button className={btnClass} 
              onClick={this.toggleThisTodo.bind(this)} 
              disabled={isEditting}>
                <i className={icoClass}></i>
            </button>
            <button className="btn btn-danger btn-sm todo-ctrls" 
              onClick={this.confirmDeleteThis.bind(this)} 
              disabled={isEditting}>
                <i className="fa fa-trash"></i>
            </button>
          </div>
          {addText}
        </div>
      </li>
    );
  }
}