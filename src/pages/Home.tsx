import { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { Basket, Material } from '../database/types/global.types';
import { Database } from '../database/types/database.types';
import Header from '../components/Header';
import Button from '../components/Button';

const PAGE_OFFSET = 100;

const getBorderByCategory = (category: string) => {
  switch (category) {
    case 'Flashcard':
      return 'border-orange-500';
    case 'Worksheet':
      return 'border-red-500';
    case 'Spreadsheet':
      return 'border-green-500';
    case 'Lesson plan':
      return 'border-blue-500';
    case 'Activity':
      return 'border-yellow-500';
    default:
      return 'border-black';
  }
};

const getTextByCategory = (category: string) => {
  switch (category) {
    case 'Flashcard':
      return 'text-orange-500 hover:text-orange-500';
    case 'Worksheet':
      return 'text-red-500 hover:text-red-500';
    case 'Spreadsheet':
      return 'text-green-500 hover:text-green-500';
    case 'Lesson plan':
      return 'text-blue-500 hover:text-blue-500';
    case 'Activity':
      return 'text-yellow-500 hover:text-yellow-500';
    default:
      return 'text-black hover:text-black';
  }
};

interface HomeProps {
  databaseClient: SupabaseClient<Database>;
  userId: string;
}

function Home({ databaseClient, userId }: HomeProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [basket, setBasket] = useState<Basket[]>([]);
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

    async function getBasket() {
      const { data: basket } = await databaseClient
        .from('basket')
        .select()
        .eq('user_id', userId)
        .abortSignal(abortController.signal);

      setBasket(basket ?? []);
    }

    getMaterials();
    getBasket();

    return () => abortController.abort();
  }, [databaseClient, page, userId]);

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

    const basketItem = basket.find((item) => item.product_id === materialId);

    if (basketItem !== undefined) {
      const { error, data: updatedBasket } = await databaseClient
        .from('basket')
        .update({
          quantity: basketItem.quantity + 1,
        })
        .eq('id', basketItem.id)
        .select();

      if (updatedBasket !== null) {
        setBasket(
          basket.map((baksetItem) => {
            // TODO: can select return not array, but one element??
            const updatedItem = updatedBasket[0];
            if (baksetItem.id === updatedItem.id) {
              return updatedItem;
            } else {
              return baksetItem;
            }
          })
        );
      }

      if (error) {
        throw new Error(error.message);
      }
    } else {
      const { error, data: newBasket } = await databaseClient
        .from('basket')
        .insert({
          product_id: materialId,
          user_id: userId,
        })
        .select();

      if (newBasket !== null) {
        // TODO: can select return not array, but one element??
        const newItem = newBasket[0];
        setBasket([...basket, newItem]);
      }

      if (error) {
        throw new Error(error.message);
      }
    }
  }

  async function removeOneFromBasket(materialId: number) {
    const basketItem = basket.find((item) => item.product_id === materialId);

    if (basketItem !== undefined) {
      const newQuantity = basketItem.quantity - 1;

      if (newQuantity < 0) return;

      if (newQuantity === 0) {
        const { error, data: updatedBasket } = await databaseClient
          .from('basket')
          .delete()
          .eq('id', basketItem.id)
          .select();

        if (updatedBasket !== null) {
          const updatedItem = updatedBasket[0];
          setBasket(basket.filter((item) => item.id !== updatedItem.id));
        }

        if (error) {
          throw new Error(error.message);
        }
      } else {
        const { error, data: updatedBasket } = await databaseClient
          .from('basket')
          .update({
            quantity: basketItem.quantity - 1,
          })
          .eq('id', basketItem.id)
          .select();

        if (updatedBasket !== null) {
          setBasket(
            basket.map((baksetItem) => {
              const updatedItem = updatedBasket[0];
              if (baksetItem.id === updatedItem.id) {
                return updatedItem;
              } else {
                return baksetItem;
              }
            })
          );
        }

        if (error) {
          throw new Error(error.message);
        }
      }
    }
  }

  return (
    <>
      <Header basket={basket} />
      <main className="xl-container mt-4 text-center px-4">
        {/* <h1 className="text-3xl font-bold mb-4">Materials</h1> */}
        <div className="grid grid-cols-4 gap-4">
          {materials.map((material) => {
            const borderColor = getBorderByCategory(material.category);
            const textColor = getTextByCategory(material.category);
            const basketItem = basket.find(
              (item) => item.product_id === material.id
            );
            return (
              <div
                key={material.id}
                className={`${borderColor} border-2 rounded-xl p-4 h-56 flex flex-col justify-between items-center`}
              >
                <div>
                  <div className={`text-sm ${textColor} mb-2`}>
                    {material.category}
                  </div>
                  <div className="text-gray-700">{material.name}</div>
                </div>
                <div className="flex w-1/2 justify-between items-center">
                  <Button
                    round
                    className={`bg-white`}
                    onClick={() => addToBasket(material.id)}
                  >
                    +
                  </Button>
                  <div>{basketItem?.quantity ?? 0}</div>
                  <Button
                    round
                    className={`bg-white`}
                    onClick={() => removeOneFromBasket(material.id)}
                  >
                    -
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-4">
          <Button className={`mr-2 text-white`} onClick={handlePrev}>
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
