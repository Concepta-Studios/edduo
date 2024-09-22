import { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { Material } from '../database/types/global.types';
import { Database } from '../database/types/database.types';
import Header from '../components/Header';
import Button from '../components/Button';

const PAGE_OFFSET = 100;

interface HomeProps {
  databaseClient: SupabaseClient<Database>;
}

function Home({ databaseClient }: HomeProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [page, setPage] = useState<number>(0);

  // With the React strict mode in development there'll be two requests fired
  // because the useEffect will be called twice, so we need to utilize AbortController.
  // More info: https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development
  // TODO: implement React query for better request's cache handling.
  useEffect(() => {
    const abortController = new AbortController();

    async function getMaterials() {
      const { data } = await databaseClient
        .from('materials')
        .select()
        .order('created_at', { ascending: false })
        .range(page * PAGE_OFFSET, (page + 1) * PAGE_OFFSET - 1)
        .abortSignal(abortController.signal);

      setMaterials(data ?? []);
    }

    getMaterials();

    return () => abortController.abort();
  }, [databaseClient, page]);

  function handlePrev() {
    setPage(page - 1 < 0 ? 0 : page - 1);
  }

  function handleNext() {
    // TODO: add control for the max page
    setPage(page + 1);
  }

  return (
    <>
      <Header />
      <main className="xl-container mt-4 text-center">
        <h1 className="text-3xl font-bold">Materials</h1>
        {materials.map((material) => (
          <div key={material.id}>
            <span>{material.name}</span> <span>[{material.category}]</span>
          </div>
        ))}
        <div className="p-4">
          <Button className="mr-2" onClick={handlePrev}>
            Prev
          </Button>
          <Button onClick={handleNext}>Next</Button>
        </div>
      </main>
    </>
  );
}

export default Home;
