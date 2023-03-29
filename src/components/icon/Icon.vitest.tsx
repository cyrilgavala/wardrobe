import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';
import { dryerYes } from './images';

describe('<Icon />', () => {
  test('renders content', () => {
    render(<Icon size={50} name="dryerYes" />);

    const icon = screen.getByTestId('icon-dryerYes');
    const image = icon.getElementsByTagName('img')[0];
    expect(image).toHaveAttribute('src', dryerYes);
    expect(image).toHaveAttribute('alt', 'dryerYes');
  });

  test('renders content size as number', () => {
    render(<Icon size={50} name="dryerYes" />);

    const icon = screen.getByTestId('icon-dryerYes');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveStyle('width: 50px;');
  });

  test('renders content size as text', () => {
    render(<Icon size="1rem" name="dryerYes" />);

    const icon = screen.getByTestId('icon-dryerYes');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveStyle('width: 1rem;');
  });
});
