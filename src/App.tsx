import { Session, SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { Database } from './database/types/database.types';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeMinimal } from '@supabase/auth-ui-shared';
import Home from './pages/Home';
import { colors } from './theme/colors';

interface AppProps {
  databaseClient: SupabaseClient<Database>;
}

function App({ databaseClient }: AppProps) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    databaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = databaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [databaseClient.auth]);

  if (!session) {
    return (
      <div className="w-96 m-auto mt-20">
        <Auth
          supabaseClient={databaseClient}
          providers={[]}
          appearance={{
            theme: ThemeMinimal,
            variables: {
              default: {
                colors,
              },
            },
          }}
        />
      </div>
    );
  } else {
    return <Home databaseClient={databaseClient} />;
  }
}

export default App;
