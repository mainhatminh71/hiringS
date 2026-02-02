import {MongoClient, Db} from 'mongodb';
import { readFileSync, existsSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import {environment} from '../../environments/environment';

const placeholderTokens = new Set([
    'MONGODB_CONNECTION_STRING',
    'MONGODB_URI',
    'DATABASE_URL',
    'your_mongo_uri'
]);

function hasValidMongoEnv(): boolean {
    const candidates = [
        process.env['MONGODB_CONNECTION_STRING'],
        process.env['MONGODB_URI'],
        process.env['DATABASE_URL']
    ];
    return candidates.some(value => !!value && !placeholderTokens.has(value));
}

function resolveMongoUri(): string | undefined {
    const candidates = [
        process.env['MONGODB_CONNECTION_STRING'],
        process.env['MONGODB_URI'],
        process.env['DATABASE_URL'],
        environment.mongodb.connectionString
    ];
    return candidates.find(value => !!value && !placeholderTokens.has(value));
}

function loadEnvFileIfNeeded(): void {
    if (hasValidMongoEnv()) {
        return;
    }
    const envPath = resolvePath(process.cwd(), '.env');
    if (!existsSync(envPath)) {
        return;
    }
    const content = readFileSync(envPath, 'utf8');
    for (const rawLine of content.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#') || !line.includes('=')) continue;
        const index = line.indexOf('=');
        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim();
        if (!key || process.env[key]) continue;
        const unquoted = value.replace(/^['"]|['"]$/g, '');
        process.env[key] = unquoted;
    }
}
const dbName = 'hiringS-application-form';

let client: MongoClient;
let db: Db;

export async function connectToDatabase(): Promise<Db> {
    if (db) return db;
    loadEnvFileIfNeeded();
    const uri = resolveMongoUri();
    if (!uri) {
        throw new Error('Missing MongoDB connection string. Set MONGODB_CONNECTION_STRING or add it to .env.');
    }
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    return db;
}

export function getDb() : Db {
    return db;
}

const shutdown = async (signal: string) => {
    console.log(`${signal} received. Shutting down...`);
    await client.close().catch(console.error);
    process.exit(0);
};

process.once('SIGTERM', () => shutdown('SIGTERM'));
process.once('SIGINT',  () => shutdown('SIGINT'));
