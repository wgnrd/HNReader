import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App, { Search, Button, Table } from './App';

Enzyme.configure({ adapter: new Adapter() });

describe('App', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(<App />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Search', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Search onChange={() => {}} onSubmit={() => {}}>
        Search
      </Search>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Search onChange={() => {}} onSubmit={() => {}}>
        Search
      </Search>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Button', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button onClick={() => {}}>Button</Button>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Button onClick={() => {}}>Button</Button>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('shows a button', () => {
    const element = shallow(
      <Button className={'inline'} onClick={() => {}}>
        Button
      </Button>
    );
    expect(element.find('.inline').type()).toBe('button');
  });
});

describe('Table', () => {
  const props = {
    list: [
      {
        title: '1',
        author: '1',
        num_comments: 1,
        objectID: 'foo',
        points: 222
      },
      { title: '2', author: '2', num_comments: 1, objectID: 'bar', points: 223 }
    ],
    sortKey: 'TITLE',
    isSortReverse: false
  };
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Table onDismiss={() => {}} {...props} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Table onDismiss={() => {}} {...props} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('shows two items in list', () => {
    const element = shallow(<Table onDismiss={() => {}} {...props} />);
    expect(element.find('.table-row').length).toBe(2);
  });
});
