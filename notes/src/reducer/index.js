// Action types
import {
  NOTES_FETCHED,
  ERROR_FETCHING,
  ERROR_ADDING_NOTE,
  UPDATE_ERROR,
  TOGGLE_MODAL,
  TOGGLE_COLLAB_MODAL,
  DELETE_NOTE,
  DELETE_ERROR,
  SELECT_NOTE,
  SELECT_ERROR,
  SORT_NOTES,
  REGISTER_ERROR,
  USER_LOGGED_IN,
  LOGIN_ERROR,
  CHECK_AUTH_ERROR,
} from '../actions';

const initialState = {
  notes: [],
  modalVisible: false,
  collabModalVisible: false,
  selectedNote: {},
  sortType: 'date',
  error: null,
  email: null
};

const sortNotes = (notes, sortType, prop) => {
  let notesCopy = notes.slice(0);
  if (sortType === prop) return notesCopy.reverse();
  return notesCopy.sort((a, b) => {
    if (a[prop] < b[prop]) return -1;
    if (a[prop] > b[prop]) return 1;
    return 0;
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ERROR_ADDING_NOTE:
      return {
        ...state,
        error: action.payload,
      };
    case NOTES_FETCHED:
      return {
        ...state,
        notes: action.payload,
      };
    case ERROR_FETCHING:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case TOGGLE_MODAL:
      return {
        ...state,
        modalVisible: !state.modalVisible,
      };
    case TOGGLE_COLLAB_MODAL:
      return {
        ...state,
        collabModalVisible: !state.collabModalVisible,
      };
    case DELETE_NOTE:
      return {
        ...state,
        modalVisible: !state.modalVisible,
        selectedNote: {},
      };
    case DELETE_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case SELECT_NOTE:
      return {
        ...state,
        selectedNote: action.payload,
      };
    case SELECT_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case SORT_NOTES:
      return {
        ...state,
        notes: sortNotes(state.notes, state.sortType, action.payload),
        sortType: action.payload,
      };
    case REGISTER_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case USER_LOGGED_IN:
      return {
        ...state,
        email: action.payload,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        loggingIn: false,
        error: action.payload,
      };
    case CHECK_AUTH_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
