import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

class Sidebar extends React.Component {
  logout = () => {
    localStorage.clear('token');
    window.location.reload();
  };

  render() {
    return (
      <div className="sidebar">
        <span className="sidebar__title">Lambda Notes</span>
        <div className="sidebar__buttons">
          <Link to="/" className="sidebar__button" >
            <div>View Your Notes</div>
          </Link>
          <Link to="/new" className="sidebar__button">
            <div>+ Create New Note</div>
          </Link>
          {this.props.email && (
            <Link to="/" onClick={this.logout}>
              <div className="sidebar__button">Logout</div>
            </Link>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    email: state.email,
  }
}

export default connect(mapStateToProps)(Sidebar);
