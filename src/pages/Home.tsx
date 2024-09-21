import { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { Material } from '../database/types/global.types';
import { Database } from '../database/types/database.types';
import Input from '../components/Input';

interface HomeProps {
  databaseClient: SupabaseClient<Database>;
}

function Home({ databaseClient }: HomeProps) {
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    async function getMaterials() {
      const { data } = await databaseClient.from('materials').select();

      setMaterials(data ?? []);
    }

    getMaterials();
  }, [databaseClient]);

  return (
    <>
      <header className="flex justify-between xl-container p-2 bg-red-600">
        <div className="text-4xl font-bold">
          <span className="text-white">Ed</span>
          <span className="text-black">Duo</span>
        </div>
        <div>
          <Input />
        </div>
        <div>
          <div>Profile</div>
          <div>Collections</div>
          <div>Language</div>
        </div>
      </header>
      <main className="xl-container">
        <h1 className="text-3xl font-bold">Materials</h1>
        {materials.map((material) => (
          <div key={material.id}>
            <span>{material.name}</span> <span>[{material.category}]</span>
          </div>
        ))}
      </main>
    </>
  );
}

export default Home;
