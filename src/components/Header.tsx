import {
  GlobeAltIcon,
  HeartIcon,
  UserCircleIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import Input from './Input';
import { Basket, Category } from '../database/types/global.types';
import Badge from './Badge';

interface HeaderProps {
  basket: Basket[];
  categories: Category[];
}

export default function Header({ basket, categories }: HeaderProps) {
  return (
    <header className="bg-brand">
      <div className="flex justify-between xl-container p-2">
        <div className="text-4xl font-bold">
          <span className="text-white">Ed</span>
          <span className="text-black">Duo</span>
        </div>
        <div>
          <Input />
        </div>
        <div className="flex w-40 justify-between items-center">
          <div>
            <UserCircleIcon className="size-8" />
          </div>
          <div>
            <HeartIcon className="size-8" />
          </div>
          <div>
            <GlobeAltIcon className="size-8" />
          </div>
          <div className="relative">
            <ShoppingCartIcon className="size-8" />
            <Badge
              label={basket.length.toString()}
              className="absolute -top-2 -right-2"
            />
          </div>
        </div>
      </div>
      <nav className="text-center flex justify-between xl-container w-1/2">
        {categories.map((category) => (
          <div className="mr-2 p-2 cursor-pointer">{category.name}</div>
        ))}
      </nav>
    </header>
  );
}
