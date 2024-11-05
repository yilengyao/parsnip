import * as api from '../api';

export function fetchTasksSucceeded(tasks) {
  return {
    type: 'FETCH_TASKS_SUCCEEDED',
    payload: {
      tasks
    }
  };
}

function fetchTasksStarted() {
  return {
    type: 'FETCH_TASKS_STARTED'
  };
}

function fetchTasksFailed(error) {
  return {
    type: 'FETCH_TASKS_FAILED',
    payload: {
      error
    }
  };
}

export function fetchTasks() {
  return dispatch => {
    dispatch(fetchTasksStarted());
    api.fetchTasks()
      .then(response => {
        setTimeout(() => {
          dispatch(fetchTasksSucceeded(response.data));
        }, 2000);
        // throw new Error('Oh noes! Unable to fetch tasks!');
      })
      .catch(err => {
        dispatch(fetchTasksFailed(err.message));
      });
  }
}

function createTaskSucceeded(task) {
  return {
    type: 'CREATE_TASK_SUCCEEDED',
    payload: {
      task
    }
  };
}

export function createTask({ title, description, status = 'Unstarted' }) {
  return dispatch => {
    api.createTask({ title, description, status })
      .then(resp => {
        dispatch(createTaskSucceeded(resp.data));
      })
      .catch(err => {
        dispatch(fetchTasksFailed(err.message + " create task"));
      });
  };
}

function editTaskSucceeded(task) {
  return {
    type: 'EDIT_TASK_SUCCEEDED',
    payload: {
      task
    }
  };
}

export function editTask(id, params = {}) {
  return (dispatch, getState) => {
    const task = getTaskById(getState().tasks.tasks, id);
    const updatedTask = Object.assign({}, task, params);

    api.editTask(id, updatedTask).then(resp => {
      dispatch(editTaskSucceeded(resp.data));
    })
      .catch(err => {
        dispatch(fetchTasksFailed(err.message + " edit task"));
      });
  };
}

function getTaskById(tasks, id) {
  return tasks.find(task => task.id === id);
} 
