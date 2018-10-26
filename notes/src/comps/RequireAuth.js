import React from 'react';
import { connect } from 'react-redux';

import Login from './Login';

import { checkAuth } from '../actions';


export default ComposedComponent => {
  class RequireAuth extends React.Component {
    componentDidMount = () => {
      const token = localStorage.getItem('token');

      if (token && !this.props.email) {
        this.props.checkAuth(token);
      }
    }


    render() {
      return (
        <div>
          {this.props.email ? (
            <ComposedComponent {...this.props} />
          ): <Login />}
        </div>
      );
    }
  }

  const mapStateToProps = state => {
    return {
      email: state.email
    };
  };

  return connect(mapStateToProps, { checkAuth })(RequireAuth);
};
