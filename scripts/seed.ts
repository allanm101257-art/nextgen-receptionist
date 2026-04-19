import { db } from '../src/db/client';
import { dealers } from '../src/db/schema';

const run = async () => {
  await db
    .insert(dealers)
    .values({
      id: 'nextgen',
      name: 'nextgen',
      createdAt: new Date(),
    })
    .onConflictDoUpdate({
      target: dealers.id,
      set: { name: 'nextgen' },
    });

  console.log('Seed complete: dealer nextgen');
};

run();
