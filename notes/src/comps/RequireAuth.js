import React from 'react';
import { connect } from 'react-redux';

import Login from './Login';

import { checkAuth } from '../actions';


export default ComposedComponent => {
  class RequireAuth extends React.Component {
    componentDidMount = () => {
      const token = localStorage.getItem('token');

      if (token && !this.props.username) {
        this.props.checkAuth(token);
      }
    }


    render() {
      return (
        <div>
          {this.props.username ? (
            <ComposedComponent {...this.props} />
          ): <Login />}
        </div>
      );
    }
  }

  const mapStateToProps = state => {
    return {
      username: state.username
    };
  };

  return connect(mapStateToProps, { checkAuth })(RequireAuth);
};
