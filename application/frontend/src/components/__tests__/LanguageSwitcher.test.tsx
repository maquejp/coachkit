import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import i18n from 'i18next';
import Header from '@/components/Header';
import { useAuthStore } from '@/stores/auth';

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );
}

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, isLoading: false });
  });

  it('renders language toggle buttons', () => {
    renderHeader();
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('FR')).toBeInTheDocument();
  });

  it('highlights active language', () => {
    renderHeader();
    const enBtn = screen.getByText('EN');
    expect(enBtn.className).toContain('bg-primary-100');
  });

  it('switches language on button click', async () => {
    renderHeader();
    const frBtn = screen.getByText('FR');
    await userEvent.click(frBtn);
    expect(i18n.language).toBe('fr');
    expect(frBtn.className).toContain('bg-primary-100');
  });
});
