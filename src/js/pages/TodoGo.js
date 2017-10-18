import React from "react";
import Todo from "../components/todo/Todo";

import TodoStore from "../stores/TodoStore";
import * as TodoActions from "../actions/TodoActions";

export default class FluxDemo extends React.Component {
  
  constructor(){
    super();
    this.reRender = this.reRender.bind(this);
    this.showModal = this.showModal.bind(this);
    this.state = TodoStore.getStoreState();
  }
  
  componentWillMount(){
    TodoStore.on("change", this.reRender);
    TodoStore.on("confirm_delete", this.showModal);
    TodoStore.on("added", () => {
      $('#todo-list-group').stop().animate({
        scrollTop: $('#todo-list-group')[0].scrollHeight
      }, 500);
    });
  }

  componentDidMount(){
    TodoActions.requestData();
  }

  // IMPORTANT: This prevents memory leak!
  componentWillUnmount(){
    TodoStore.removeListener("change", this.reRender);
    TodoStore.removeListener("confirm_delete", this.showModal);
  }

  // Callbacks for event listeners
  reRender(){this.setState(TodoStore.getStoreState());}
  showModal(){$('#modal-confirm-delete').modal('show');}
  
  deleteTodo(){
    TodoActions.deleteTodo(this.state.idxToDelete);
  }

  addNewTodo(e){
    const textInput = this.refs.new_todo
    const todo_text = textInput.value.trim();
    if (todo_text.length > 0){
      TodoActions.createTodo(todo_text);
      textInput.value = "";
      textInput.focus();
      this.enableButton();
    }
    e.preventDefault();
  }

  enableButton(){
    const todo_text = this.refs.new_todo.value.trim();
    this.refs.add_todo.className = "btn btn-primary display-sm-block " + (todo_text.length == 0 ? " disabled" : "")
  }

  render() {
    let MainComponent;
    if (this.state.requesting){
      MainComponent = (
        <div className="row">
          <div className="col-md-6">
            <div id="loader"></div>
            <ul className="list-group" id="todo-list-group"></ul>
          </div>
        </div>
      );
    } else {
      const TodoComponent = this.state.todos.map((todo) => {
        return <Todo key={todo.id} {...todo} />
      });
      MainComponent = (
        <div className="row animate-bottom">
          <div className="col-md-6">
            <ul className="list-group" id="todo-list-group">{TodoComponent}</ul>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <h1>TodoGo</h1>
            <form className="form-inline" onSubmit={this.addNewTodo.bind(this)}>
              <div className="form-group">
                <input className="form-control" type="text" ref="new_todo" placeholder="TASK DESCRIPTION" onChange={this.enableButton.bind(this)} style={{minWidth:'250px'}} />
              </div>
              <button className="btn btn-primary display-sm-block disabled" type="submit" ref="add_todo"><i
              className="fa fa-plus-circle"></i>&nbsp; ADD TASK</button>
            </form>
          </div>
        </div>

        {MainComponent}
        
        <div className="modal fade" id="modal-confirm-delete" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h4 className="modal-title">Confirm Delete</h4>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete task #{this.state.idxToDelete}?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.deleteTodo.bind(this)}>Confirm Delete</button>
                  <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                </div>
              </div>
              
            </div>
          </div>
      </div>
    );
  }
}