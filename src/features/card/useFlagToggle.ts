import { useCallback } from 'react';
import { useAppState } from '../../app/AppState.tsx';
import { withDb } from '../../storage/db.ts';
import { setFlags } from '../../storage/progressRepo.ts';

/** Save / unsave a card ("Guardar"). Favourites are learning data: never evicted with content. */
export function useFlagToggle() {
  const { refresh } = useAppState();
  return useCallback(
    async (itemId: string, favorite: boolean) => {
      await withDb((db) => setFlags(db, itemId, { favorite }, new Date()));
      await refresh();
    },
    [refresh],
  );
}
