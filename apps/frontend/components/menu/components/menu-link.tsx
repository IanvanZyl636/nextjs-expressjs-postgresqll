import Link from 'next/link';

export default function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={'pointer text-lg font-bold hover:text-content-foreground hover:bg-content hover:rounded p-2'}>
      {children}
    </Link>
  );
}