import { Database } from './database.types';

export type Material = Database['public']['Tables']['materials']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Basket = Database['public']['Tables']['basket']['Row'];
