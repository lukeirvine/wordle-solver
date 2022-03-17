import { render, screen, waitForElementToBeRemoved } from './test-utils';
import React from 'react';
import App from './App';

it('renders without crashing', async () => {
  render(<App />);
  await screen.findByRole('heading', {name: /wordle solver/i})
});
