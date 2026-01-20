import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/TexasMap', () => () => <div data-testid="texas-map" />);

test('renders site headline', () => {
  render(<App />);
  const headline = screen.getByRole('heading', { name: /zero voucher schools/i });
  expect(headline).toBeInTheDocument();
});
