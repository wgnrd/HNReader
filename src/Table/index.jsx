import React, { Component } from 'react';
import { SORTS } from '../constants.js';
import Button from '../Button';
import classNames from 'classnames';
import Proptypes from 'prop-types';
import './index.css';

const largeColumn = {
  width: '35%'
};
const midColumn = {
  width: '20%'
};
const smallColumn = {
  width: '10%'
};

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: 'NONE',
      isSortReverse: false
    };
    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse =
      this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }
  render() {
    const { list, onDismiss } = this.props;
    const { sortKey, isSortReverse } = this.state;
    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    return (
      <div className="table">
        <div className="table-header">
          <span style={largeColumn}>
            <Sort
              sortKey={'TITLE'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              Title
            </Sort>
          </span>
          <span style={midColumn}>
            <Sort
              sortKey={'AUTHOR'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              Author
            </Sort>
          </span>
          <span style={smallColumn}>
            <Sort
              sortKey={'COMMENTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              Comments
            </Sort>
          </span>
          <span style={smallColumn}>
            <Sort
              sortKey={'POINTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              Points
            </Sort>
          </span>
          <span style={smallColumn}>
            <Sort
              sortKey={'DATE'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              Date
            </Sort>
          </span>
          <span style={smallColumn}>Archive</span>
        </div>
        {reverseSortedList.map(item => (
          <div key={item.objectID} className="table-row">
            <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={midColumn}>{item.author}</span>
            <span style={smallColumn}>{item.num_comments}</span>
            <span style={smallColumn}>{item.points}</span>
            <span style={smallColumn}>{item.created_at}</span>
            <span style={smallColumn}>
              <Button
                onClick={() => onDismiss(item.objectID)}
                type="button"
                className="button-inline"
              >
                Dismiss
              </Button>
            </span>
          </div>
        ))}
      </div>
    );
  }
}

const Sort = ({ sortKey, activeSortKey, onSort, isSortReverse, children }) => {
  const buttonClass = classNames('button-inline', {
    'button-active': activeSortKey === sortKey
  });
  const IconClass = classNames('fas', {
    'fa-sort-down': isSortReverse,
    'fa-sort-up': !isSortReverse
  });
  children = buttonClass.includes('button-active') ? (
    <span>
      {children} <i className={IconClass} />
    </span>
  ) : (
    children
  );
  return (
    <Button onClick={() => onSort(sortKey)} className={buttonClass}>
      {children}
    </Button>
  );
};

Table.propTypes = {
  list: Proptypes.arrayOf(
    Proptypes.shape({
      objectID: Proptypes.string.isRequired,
      author: Proptypes.string,
      url: Proptypes.string,
      num_comments: Proptypes.number,
      points: Proptypes.number
    })
  ).isRequired,
  onDismiss: Proptypes.func.isRequired
};

export default Table;
