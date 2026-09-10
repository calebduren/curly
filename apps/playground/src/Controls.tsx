import { useId, useState, type ReactNode } from 'react';
import { Plus } from 'lucide-react';

export function Toggle({
  label,
  checked,
  onChange,
  disabled = false,
  controls,
  className = '',
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  controls?: string;
  className?: string;
}) {
  const [motion, setMotion] = useState(false);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-controls={controls}
      disabled={disabled}
      className={`toggle ${className}`}
      data-motion={motion ? 'on' : 'off'}
      onClick={(event) => {
        setMotion(event.detail > 0);
        onChange(!checked);
      }}
    >
      <span className="toggle-track" aria-hidden="true">
        <span className="toggle-thumb" />
      </span>
      <span>{label}</span>
    </button>
  );
}

export function Disclosure({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);
  const [motion, setMotion] = useState(false);
  return (
    <div className="disclosure" data-open={open} data-motion={motion ? 'on' : 'off'}>
      <h3>
        <button
          type="button"
          id={`${id}-label`}
          aria-expanded={open}
          aria-controls={id}
          onClick={(event) => {
            setMotion(event.detail > 0);
            setOpen(!open);
          }}
        >
          {title}
          <Plus size={17} aria-hidden="true" />
        </button>
      </h3>
      <div
        className="disclosure-reveal"
        id={id}
        aria-labelledby={`${id}-label`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="disclosure-clip">
          <div className="disclosure-content">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function TaskStatus({ checked }: { checked?: boolean }) {
  return (
    <span
      className="task-status"
      role="img"
      aria-label={checked ? 'Complete' : 'Incomplete'}
      data-complete={checked}
    />
  );
}
