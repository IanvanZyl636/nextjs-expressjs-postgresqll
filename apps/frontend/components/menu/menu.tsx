
import Link from 'next/link';
import Image from 'next/image';
import MenuLink from './components/menu-link';
import { MenuUser } from './components/menu-user';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Admin', href: '/admin' },
  { name: 'Client', href: '/client' },
];

export default async function Menu() {  
  return (
    <header className="bg-primary text-primary-foreground shadow-md menu-height sticky top-0 z-50">
      <Link href="#main" className="sr-only focus:not-sr-only">
        Skip to main content
      </Link>
      <div className="container mx-auto h-full flex flex-row justify-between">
        <div className={'flex flex-col h-full justify-center py-1'}>
          <Link className={'h-full'} href="/" aria-label="Homepage">
            <Image
              priority={true}
              src="/logo.webp"
              alt="Logo"
              width={297}
              height={74.279999}
              className={'w-auto h-full inline-block'}
            />
          </Link>
        </div>
        <nav
          className={'flex flex-col h-full justify-center'}
          aria-label="Primary Navigation"
        >
          <ul className="flex space-x-8">
            <li>
              <MenuUser/>
            </li>
            {navItems.map((item,index) => (
              <li key={`menu-item-${index}`}>
                <MenuLink href={item.href}>{item.name}</MenuLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
