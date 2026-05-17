import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Table } from '@/components/ui/Table';

interface TestRow {
  id: string;
  name: string;
  age: number;
}

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'age', header: 'Age' },
];

const data: TestRow[] = [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
];

describe('Table', () => {
  it('renders headers', () => {
    render(<Table columns={columns} data={data} rowKey={(r: TestRow) => r.id} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('renders data rows', () => {
    render(<Table columns={columns} data={data} rowKey={(r: TestRow) => r.id} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(<Table columns={columns} data={[]} rowKey={(r: TestRow) => r.id} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('shows custom empty state', () => {
    render(
      <Table
        columns={columns}
        data={[]}
        empty={<div>Custom empty</div>}
        rowKey={(r: TestRow) => r.id}
      />,
    );
    expect(screen.getByText('Custom empty')).toBeInTheDocument();
  });

  it('renders loading skeleton', () => {
    render(<Table columns={columns} data={[]} loading rowKey={(r: TestRow) => r.id} />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders custom cell renderer', () => {
    render(
      <Table
        columns={[
          ...columns,
          {
            key: 'actions',
            header: 'Actions',
            render: (row: TestRow) => <button>{row.name} action</button>,
          },
        ]}
        data={data}
        rowKey={(r: TestRow) => r.id}
      />,
    );
    expect(screen.getByText('Alice action')).toBeInTheDocument();
  });

  it('shows sort indicator on sorted column', () => {
    render(
      <Table
        columns={columns}
        data={data}
        sortKey="name"
        sortDir="asc"
        rowKey={(r: TestRow) => r.id}
      />,
    );
    expect(screen.getByText('\u25B2')).toBeInTheDocument();
  });

  it('shows desc sort indicator', () => {
    render(
      <Table
        columns={columns}
        data={data}
        sortKey="name"
        sortDir="desc"
        rowKey={(r: TestRow) => r.id}
      />,
    );
    expect(screen.getByText('\u25BC')).toBeInTheDocument();
  });
});
