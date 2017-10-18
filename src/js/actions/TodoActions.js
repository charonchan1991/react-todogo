import dispatcher from "../dispatcher";

export function createTodo(text) {
  dispatcher.dispatch({
    type: "CREATE_TODO",
    text
  });
}

export function confirmDelete(id) {
  dispatcher.dispatch({
    type: "CONFIRM_DELETE",
    id
  });
}

export function deleteTodo(id) {
  dispatcher.dispatch({
    type: "DELETE_TODO",
    id
  });
}

export function toggleTodo(id) {
  dispatcher.dispatch({
    type: "TOGGLE_TODO",
    id
  });
}

export function updateTodo(id, text) {
  dispatcher.dispatch({
    type: "UPDATE_TODO",
    id,
    text
  });
}

export function requestData() {
  dispatcher.dispatch({
    type: "DB_REQUEST_DATA"
  });
}