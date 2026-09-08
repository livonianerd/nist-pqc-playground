import type { ReactNode } from 'react';
import { hex, size } from '../utils/format';
import { parameters } from '../crypto/algorithms';
export function Heading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <div className="lede">{children}</div>
    </header>
  );
}
export function Callout({ children }: { children: ReactNode }) {
  return <aside className="callout">{children}</aside>;
}
export function Value({
  label,
  value,
  secret = false,
}: {
  label: string;
  value?: Uint8Array;
  secret?: boolean;
}) {
  return (
    <div className="value">
      <div>
        <strong>{label}</strong>
        <span>{value ? size(value.length) : 'Not generated'}</span>
      </div>
      {value && (
        <>
          <code>
            {hex(value.slice(0, 24))}
            {value.length > 24 ? '…' : ''}
          </code>
          <details>
            <summary>
              Show full value{secret ? ' · educational secret exposure' : ''}
            </summary>
            <code className="full-value">{hex(value)}</code>
          </details>
        </>
      )}
    </div>
  );
}
export function Parameter({
  family,
  value,
  onChange,
  disabled = false,
}: {
  family: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="parameter">
      Parameter set
      <select
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {parameters
          .filter((p) => p.name.startsWith(family))
          .map((p) => (
            <option key={p.name}>{p.name}</option>
          ))}
      </select>
    </label>
  );
}
export function Status({
  busy,
  error,
  cancel,
}: {
  busy: boolean;
  error: string;
  cancel: () => void;
}) {
  return (
    <div aria-live="polite">
      {busy && (
        <p className="working">
          Computing locally…{' '}
          <button className="text-button" onClick={cancel}>
            Cancel operation
          </button>
        </p>
      )}
      {error && (
        <p role="alert" className="failure">
          {error}
        </p>
      )}
    </div>
  );
}
