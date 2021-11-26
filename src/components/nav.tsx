import React, { ReactElement } from 'react';
import Link from 'next/link';

interface NavProps {}

export default function Nav({}: NavProps): ReactElement {
  return (
    <nav>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/about">
        <a>About</a>
      </Link>
    </nav>
  );
}
