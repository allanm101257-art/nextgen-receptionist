import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { env } from '../config/env';
import * as schema from './schema';

const resolvedPath = path.resolve(process.cwd(), env.dbPath);
fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

const sqlite = new Database(resolvedPath);

export const db = drizzle(sqlite, { schema });
