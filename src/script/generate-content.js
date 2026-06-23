import fs from 'fs';
import path from 'path';

const FILE_PATH = path.join(process.cwd(), 'src/data/platforms.json');
const BACKUP_PATH = path.join(process.cwd(), 'src/data/platforms.bak.json');

// 1. Create safety backup
try {
    fs.copyFileSync(FILE_PATH, BACKUP_PATH);
    console.log('✅ Safety backup created at platforms.bak.json');
} catch (err) {
    console.error('❌ Failed to create backup:', err.message);
    process.exit(1);
}

// 2. Load and parse target file
const platforms = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
const CHUNK_SIZE = 5;

console.log(`Loaded ${platforms.length} tools. Preparing batch processing structures...`);

// Helper to chunk your array for your agent workspace loops
for (let i = 0; i < platforms.length; i += CHUNK_SIZE) {
    const chunk = platforms.slice(i, i + CHUNK_SIZE);
    const chunkSlugs = chunk.map(p => p.slug).join(', ');

    // Creates a small text file for your agent framework to pick up per execution loop
    fs.writeFileSync(
        path.join(process.cwd(), `src/data/batch_${Math.floor(i / CHUNK_SIZE) + 1}.json`),
        JSON.stringify(chunk, null, 2)
    );
    console.log(`📦 Created Batch ${Math.floor(i / CHUNK_SIZE) + 1}: [${chunkSlugs}]`);
}

console.log('\n🚀 Next step: Feed these batches sequentially to your workspace model using the Master Prompt below.');