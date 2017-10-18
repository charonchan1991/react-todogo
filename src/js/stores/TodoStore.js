import {EventEmitter} from "events";
import dispatcher from "../dispatcher";

import * as firebase from "firebase";

class TodoStore extends EventEmitter{
  constructor(){
    super();
    this.todos = [];
    this.idxToDelete = -1;
    this.requesting = false;
  }
  requestData(){
    this.requesting = true;
    this.emit("change");
    firebase.database().ref('todos/').once('value', (snapshot) => {
      const vals = snapshot.val();
      if (vals != null){
        const arr = Object.keys(vals).map(id => vals[id]);
        this.todos = arr.sort(dynamicSort("complete"));
        this.requesting = false;
        this.emit("change");
      }
      function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
        }
        return function (a,b) {
          var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
          return result * sortOrder;
        }
      }
    })
  }
  getStoreState(){
    return {
      todos: this.todos,
      idxToDelete: this.idxToDelete,
      requesting:this.requesting
    };
  }
  createTodo(text){
    const timestamp = new Date().getTime();
    const newTodo = {
      id: timestamp,
      text: text,
      complete: false
    };
    this.todos.unshift(newTodo);
    this.emit("change");
    this.emit("added");
    this.writeRemoteData(newTodo);
  }
  confirmDelete(idx){
    this.idxToDelete = idx;
    this.emit("change");
    this.emit("confirm_delete");
  }
  deleteTodo(idx){
    const todos = this.todos;
    let index = this.findTodo(idx);
    if(index !== -1){
      const id = todos[index].id;
      todos.splice(index, 1);
      this.todos = todos;
      this.emit("change");
      firebase.database().ref('todos/' + id).remove();
    }
  }
  toggleTodo(idx){
    let index = this.findTodo(idx);
    if(index !== -1){
      this.todos[index].complete = !this.todos[index].complete
      this.emit("change");
      this.writeRemoteData(this.todos[index]);
    }
  }
  updateTodo(idx,text){
    let index = this.findTodo(idx);
    if(index !== -1){
      this.todos[index].text = text;
      this.emit("change");
      this.writeRemoteData(this.todos[index]);
    }
  }
  writeRemoteData(data) {
    firebase.database().ref('todos/' + data.id).set(data);
  }
  findTodo(idx){
    const todos = this.todos;
    for(let i = 0; i < todos.length; i++){
        if(todos[i].id == idx){
            return i;
        }
    }
    return -1;
  }
  handleActions(action){
    console.log('Todo Action received: ', action);
    switch(action.type){
      case "CREATE_TODO":
        this.createTodo(action.text);
        break;
      case "CONFIRM_DELETE":
        this.confirmDelete(action.id);
        break;
      case "DELETE_TODO":
        this.deleteTodo(action.id);
        break;
      case "TOGGLE_TODO":
        this.toggleTodo(action.id);
        break;
      case "UPDATE_TODO":
        this.updateTodo(action.id, action.text);
        break;
      case "DB_REQUEST_DATA":
        this.requestData();
        break;
    }
  }
}

const todoStore = new TodoStore;
dispatcher.register(todoStore.handleActions.bind(todoStore));

export default todoStore;