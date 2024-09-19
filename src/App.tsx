import { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { Material } from './database/types/global.types';
import { Database } from './database/types/database.types';

interface AppProps {
  databaseClient: SupabaseClient<Database>;
}

function App({ databaseClient }: AppProps) {
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
      <h1 className="text-3xl font-bold">Materials</h1>
      {materials.map((material) => (
        <div>
          <span>{material.name}</span> <span>[{material.category}]</span>
        </div>
      ))}
    </>
  );
}

export default App;
