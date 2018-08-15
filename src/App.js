import React, { Component } from 'react';
import axios from 'axios';
import Proptypes from 'prop-types';
import './App.css';
import { sortBy } from 'lodash';
import classNames from 'classnames';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '20';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';
const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse()
};

class App extends Component {
  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } }
    });
  }
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
      sortKey: 'NONE',
      isSortReverse: false
    };
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.needToSearchTopStories = this.needToSearchTopStories.bind(this);
    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse =
      this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  needToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } },
      isLoading: false
    });
  }
  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });
    axios(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this.setState({ error }));
  }
  onSearchSubmit(event) {
    event.preventDefault();
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
  }
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const {
      searchTerm,
      results,
      searchKey,
      error,
      isLoading,
      sortKey,
      isSortReverse
    } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {error ? (
          <div className="interactions">
            <p>Something went wrong.</p>
          </div>
        ) : (
          <Table
            list={list}
            sortKey={sortKey}
            isSortReverse={isSortReverse}
            onSort={this.onSort}
            onDismiss={this.onDismiss}
          />
        )}
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    <input type="text" value={value} onChange={onChange} />
    <button type="submit">{children}</button>
  </form>
);

const largeColumn = {
  width: '40%'
};
const midColumn = {
  width: '30%'
};
const smallColumn = {
  width: '10%'
};

const Table = ({ list, onDismiss, sortKey, isSortReverse, onSort }) => {
  const sortedList = SORTS[sortKey](list);
  const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
  return (
    <div className="table">
      <div className="table-header">
        <span style={largeColumn}>
          <Sort sortKey={'TITLE'} onSort={onSort} activeSortKey={sortKey}>
            Title
          </Sort>
        </span>
        <span style={midColumn}>
          <Sort sortKey={'AUTHOR'} onSort={onSort} activeSortKey={sortKey}>
            Author
          </Sort>
        </span>
        <span style={smallColumn}>
          <Sort sortKey={'COMMENTS'} onSort={onSort} activeSortKey={sortKey}>
            Comments
          </Sort>
        </span>
        <span style={smallColumn}>
          <Sort sortKey={'POINTS'} onSort={onSort} activeSortKey={sortKey}>
            Points
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
};
const Button = ({ onClick, className, children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);

const Loading = () => (
  <div>
    <i className="fas fa-spinner fa-7x fa-pulse" />
  </div>
);

const Sort = ({ sortKey, activeSortKey, onSort, children }) => {
  const buttonClass = classNames('button-inline', {
    'button-active': activeSortKey === sortKey
  });
  return (
    <Button onClick={() => onSort(sortKey)} className={buttonClass}>
      {children}
    </Button>
  );
};
const withLoading = Component => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />;

const ButtonWithLoading = withLoading(Button);

Button.propTypes = {
  onClick: Proptypes.func.isRequired,
  className: Proptypes.string,
  children: Proptypes.node.isRequired
};
Button.defaultProps = {
  className: ''
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
Search.propTypes = {
  value: Proptypes.string,
  onChange: Proptypes.func.isRequired,
  onSubmit: Proptypes.func.isRequired,
  children: Proptypes.node.isRequired
};

export default App;

export { Button, Search, Table };
