import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import JSONLD from '@/components/JSONLD';

describe('JSONLD', () => {
  it('renders structured data script tag', () => {
    render(
      <MemoryRouter>
        <JSONLD />
      </MemoryRouter>,
    );
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
  });

  it('contains valid JSON', () => {
    render(
      <MemoryRouter>
        <JSONLD />
      </MemoryRouter>,
    );
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
    const json = JSON.parse(script!.textContent || '');
    expect(json['@context']).toBe('https://schema.org');
    expect(json['@type']).toBe('LocalBusiness');
  });
});
