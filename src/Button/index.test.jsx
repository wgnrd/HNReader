import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Button from './index';

Enzyme.configure({ adapter: new Adapter() });

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
