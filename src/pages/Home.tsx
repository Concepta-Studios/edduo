import { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { Material } from '../database/types/global.types';
import { Database } from '../database/types/database.types';
import Header from '../components/Header';

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
      <Header />
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
