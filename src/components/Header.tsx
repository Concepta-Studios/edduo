import {
  GlobeAltIcon,
  HeartIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Input from './Input';

export default function Header() {
  return (
    <header className="bg-red-600">
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
        </div>
      </div>
    </header>
  );
}
