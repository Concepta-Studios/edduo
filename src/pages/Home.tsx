import { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { Material } from '../database/types/global.types';
import { Database } from '../database/types/database.types';
import Header from '../components/Header';
import Button from '../components/Button';

const PAGE_OFFSET = 100;

const getColorByCategory = (category: string) => {
  switch (category) {
    case 'Flashcard':
      return 'orange-500';
    case 'Worksheet':
      return 'red-500';
    case 'Spreadsheet':
      return 'green-500';
    case 'Lesson plan':
      return 'blue-500';
    case 'Activity':
      return 'yellow-500';
    default:
      return 'black';
  }
};

interface HomeProps {
  databaseClient: SupabaseClient<Database>;
  userId: string;
}

function Home({ databaseClient, userId }: HomeProps) {
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

  async function addToBasket(materialId?: number) {
    if (materialId === undefined || userId === undefined) {
      console.log('userId and materialId required');
      return;
    }

    const { data: basket } = await databaseClient
      .from('basket')
      .select()
      .eq('user_id', userId)
      .eq('product_id', materialId);

    if (basket == null || basket.length === 0) {
      const { error } = await databaseClient.from('basket').insert({
        product_id: materialId,
        user_id: userId,
      });

      console.log('successfully added to basket');

      if (error) {
        throw new Error(error.message);
      }
    } else {
      const { error } = await databaseClient
        .from('basket')
        .update({
          // TODO: Should be a way to make the data retured unique if user_id and product_id is passed
          // so we can remove this basket[0] step
          quantity: basket[0].quantity + 1,
        })
        .eq('id', basket[0].id);

      console.log('successfully added to basket');

      if (error) {
        throw new Error(error.message);
      }
    }
  }

  return (
    <>
      <Header />
      <main className="xl-container mt-4 text-center px-4">
        <h1 className="text-3xl font-bold mb-4">Materials</h1>
        <div className="grid grid-cols-4 gap-4">
          {materials.map((material) => {
            return (
              <div
                key={material.id}
                className={`border-${getColorByCategory(
                  material.category
                )} border-2 rounded-xl p-4 h-56 flex flex-col justify-between`}
              >
                <div>
                  <div
                    className={`text-sm text-${getColorByCategory(
                      material.category
                    )} mb-2`}
                  >
                    {material.category}
                  </div>
                  <div className="text-gray-700">{material.name}</div>
                </div>
                <Button
                  className={`bg-white border-black text-black hover:text-black`}
                  onClick={() => addToBasket(material.id)}
                >
                  Add to basket
                </Button>
              </div>
            );
          })}
        </div>
        <div className="p-4">
          <Button className="mr-2 text-white" onClick={handlePrev}>
            Prev
          </Button>
          <Button className="text-white" onClick={handleNext}>
            Next
          </Button>
        </div>
      </main>
    </>
  );
}

export default Home;
