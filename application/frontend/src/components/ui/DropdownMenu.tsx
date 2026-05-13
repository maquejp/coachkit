import { useRef, useState, type ReactNode } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  separator?: boolean;
}

interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export function DropdownMenu({ trigger, items, align = 'left' }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative inline-block">
      <button onClick={() => setOpen((prev) => !prev)}>{trigger}</button>

      {open && (
        <div
          className={`absolute z-40 mt-1 min-w-[180px] rounded-lg border border-gray-200 bg-white py-1 shadow-dropdown ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {items.map((item, i) => (
            <div key={i}>
              {item.separator && <div className="my-1 border-t border-gray-100" />}
              <button
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                  item.disabled
                    ? 'cursor-not-allowed text-gray-400'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick();
                    setOpen(false);
                  }
                }}
              >
                {item.icon}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
