import jwtDecode from 'jwt-decode';
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.authorization = localStorage.getItem('token');

export const UPDATE_ERROR = 'UPDATE_ERROR';
export const TOGGLE_MODAL = 'TOGGLE_MODAL';
export const DELETE_NOTE = 'DELETE_NOTE';
export const SELECT_NOTE = 'SELECT_NOTE';
export const SELECT_ERROR = 'SELECT_ERROR';
export const SORT_NOTES = 'SORT_NOTES';
export const LOGOUT_USER = 'LOGOUT_USER';
export const REGISTER_ERROR = 'REGISTER_ERROR';
export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const CHECK_AUTH_ERROR = 'CHECK_AUTH_ERROR';
export const ERROR_ADDING_NOTE = 'ERROR_ADDING_NOTE';
export const NOTES_FETCHED = 'NOTES_FETCHED';
export const ERROR_FETCHING = 'ERROR_FETCHING';
export const DELETE_ERROR = 'DELETE_ERROR';
export const TOGGLE_COLLAB_MODAL = 'TOGGLE_COLLAB_MODAL';


const URI = process.env.DB_URI || 'http://localhost:3030';

export const fetchNotes = () => {
  return dispatch => {
    axios
      .get(`${URI}/notes`)
      .then(({ data }) => {
        dispatch({ type: NOTES_FETCHED, payload: data.notes });
      })
      .catch(err => {
        dispatch({ type: ERROR_FETCHING, payload: err });
      });
  };
};

export const addNote = note => {
  return dispatch => {
    axios
      .post(`${URI}/notes`, note)
      .then(({ data }) => {
        dispatch(fetchNotes());
      })
      .catch(err => {
        dispatch({ type: ERROR_ADDING_NOTE, payload: err });
      });
    };
  };

  export const updateNote = note => {
    return dispatch => {
      axios
      .put(`${URI}/notes`, note)
      .then(() => {
        dispatch(fetchNotes());
        dispatch(selectNote(note._id));
      })
      .catch(err => {
        dispatch({ type: UPDATE_ERROR, payload: err });
      });
  };
};

export const toggleCollabModal = () => {
  return {
    type: TOGGLE_COLLAB_MODAL,
  }
}

export const toggleModal = () => {
  return {
    type: TOGGLE_MODAL,
  };
};

export const deleteNote = id => {
  return dispatch => {
    axios
      .delete(`${URI}/notes/${id}`)
      .then(res => {
        dispatch({ type: DELETE_NOTE });
      })
      .then(() => {
        dispatch(fetchNotes());
      })
      .catch(err => {
        dispatch({ type: DELETE_ERROR, payload: err });
      });
  };
};

export const selectNote = id => {
  return dispatch => {
    axios
    .get(`${URI}/notes/${id}`)
    .then(({ data }) => {
      dispatch({ type: SELECT_NOTE, payload: data });
    })
    .catch(err => {
      dispatch({ type: SELECT_ERROR, payload: err});
    })
  }
};

export const sortNotes = sort => {
  return {
    type: SORT_NOTES,
    payload: sort,
  };
};

export const registerUser = userData => {
  return dispatch => {
    axios
      .post(`${URI}/register`, userData)
      .then()
      .catch(err => {
        dispatch({ type: REGISTER_ERROR, payload: err });
      });
  };
};

export const login = (userData, history) => {
  return dispatch => {
    axios
      .post(`${URI}/login`, userData)
      .then(({ data }) => {
        localStorage.setItem('token', data.token);
        dispatch({ type: USER_LOGGED_IN, payload: data.username });
        // history.push('/');
      })
      .catch(err => {
        dispatch({ type: LOGIN_ERROR, payload: err });
      });
  };
};

export const checkAuth = (token) => {

  try {
    const { username } = jwtDecode(token);
    return {
      type: USER_LOGGED_IN,
      payload: username
    }
  } catch (err) {
    return {
      type: CHECK_AUTH_ERROR,
      payload: err
    }
  }
}

export const logout = () => {
  return dispatch => {
    axios
      .post(`${URI}/logout`)
      .then(() => {
        localStorage.clear('token');
        dispatch({ type: LOGOUT_USER });
      })
      .catch(err => {
        console.log(err);
      });
  };
};
