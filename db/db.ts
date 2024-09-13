import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { profilesTable, todosTable, articlesTable, audiosTable, artworksTable, collectionsTable, artworksAudiosTable } from "./schema";

config({ path: ".env.local" });

const schema = {
  profiles: profilesTable,
  todos: todosTable,
  articles: articlesTable,
  audios: audiosTable,
  artworks: artworksTable,
  collections: collectionsTable,
  artworksAudios: artworksAudiosTable
};

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });
