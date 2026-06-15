import * as React from 'react';

type WpTextProps = {
  text?: string;
  as?: React.ElementType;
  className?: string;
} & React.HTMLAttributes<HTMLElement>;

export function WpText({
  text = '',
  as,
  className,
  ...props
}: WpTextProps) {
  const Tag = as || 'span';

  if (!text) return null;

  const normalized = text
    .replace(/&trade;/gi, '™')
    .replace(/\(TM\)/g, '™')
    .replace(/\sTM\b/g, ' ™');

  const parts = normalized.split('™');

  return React.createElement(
    Tag,
    { className, ...props },
    parts.map((part, i) =>
      React.createElement(
        React.Fragment,
        { key: i },
        part,
        i < parts.length - 1 &&
          React.createElement('sup', { className: 'tm' }, 'TM')
      )
    )
  );
}