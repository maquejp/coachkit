import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItem {
  label: string;
  to?: string;
  icon?: string;
  children?: { label: string; to: string }[];
}

const adminItems: (SidebarItem & { defaultOpen?: boolean })[] = [
  { label: 'Dashboard', to: '/admin', icon: '\u2302' },
  {
    label: 'Management',
    icon: '\u2630',
    defaultOpen: true,
    children: [
      { label: 'Classes', to: '/admin/classes' },
      { label: 'Schedule', to: '/admin/schedule' },
      { label: 'Customers', to: '/admin/customers' },
    ],
  },
  { label: 'Analytics', to: '/admin/analytics', icon: '\u2261' },
  { label: 'Settings', to: '/admin/settings', icon: '\u2699' },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(
    adminItems.filter((i) => i.defaultOpen).map((i) => i.label),
  );

  function toggleGroup(label: string) {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label],
    );
  }

  function isActive(to?: string) {
    if (!to) return false;
    return location.pathname === to || location.pathname.startsWith(to + '/');
  }

  return (
    <aside
      className={`flex flex-col border-r border-gray-200 bg-white transition-all ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        {!collapsed && <span className="text-sm font-bold text-primary-700">Admin</span>}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={collapsed ? 'M13 5l7 7-7 7M5 5l7 7-7 7' : 'M11 19l-7-7 7-7m8 14l-7-7 7-7'}
            />
          </svg>
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {adminItems.map((item) => {
          if (item.children) {
            const open = openGroups.includes(item.label);
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive(item.to)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.icon && <span className="w-5 text-center text-base">{item.icon}</span>}
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left font-medium">{item.label}</span>
                      <svg
                        className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </>
                  )}
                </button>
                {open && !collapsed && (
                  <div className="ml-7 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                          isActive(child.to)
                            ? 'bg-primary-50 font-medium text-primary-700'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to!}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive(item.to)
                  ? 'bg-primary-50 font-medium text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon && <span className="w-5 text-center text-base">{item.icon}</span>}
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
