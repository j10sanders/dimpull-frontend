import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import Home from './index';
import renderer from 'react-test-renderer';


it('renders correctly', () => {
  const tree = renderer
    .create(<Home />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

