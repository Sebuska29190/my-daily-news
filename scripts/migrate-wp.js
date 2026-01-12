import 'dotenv/config';
import { createClient } from '@sanity/client';
import fs from 'fs';
import { parseStringPromise } from 'xml2js';
import axios from 'axios';

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET,
  token: process.env.SANITY_TOKEN, // Upewnij się, że masz go w .env.local
  useCdn: false,
  apiVersion: '2023-01-01',
});

async function uploadImage(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    const asset = await client.assets.upload('image', buffer, {
      filename: url.split('/').pop(),
    });
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  } catch (error) {
    console.error(`Błąd pobierania zdjęcia: ${url}`);
    return null;
  }
}

async function migrate() {
  const xmlData = fs.readFileSync('wordpress.xml', 'utf-8');
  const result = await parseStringPromise(xmlData);
  const items = result.rss.channel[0].item;

  // Pobierz wszystkie istniejące kategorie z Sanity
  const categories = await client.fetch('*[_type == "category"]');
  console.log(`Znaleziono ${categories.length} kategorii w Sanity.`);

  for (const item of items) {
    const title = item.title[0];
    const content = item['content:encoded'][0].replace(/<[^>]*>?/gm, ''); // Usuwa HTML dla pola "details"
    // Pobieranie daty z bezpiecznikiem
    let date;
    try {
      date = item.pubDate && item.pubDate[0] 
        ? new Date(item.pubDate[0]).toISOString() 
        : new Date().toISOString();
    } catch (e) {
      date = new Date().toISOString(); // Jeśli format daty w XML jest błędny, użyj dzisiejszej
    }
    const author = item['dc:creator'][0];

    // Losowa kategoria
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    console.log(`Migracja artykułu: ${title}`);

    // Próba wyciągnięcia zdjęcia (WP przechowuje je różnie, to najczęstszy sposób)
    let mainImage = null;
    if (item['wp:postmeta']) {
        // Tu można by dodać logikę szukania _thumbnail_id, 
        // ale na start spróbujmy bez, jeśli nie masz załączników w XML
    }

    const doc = {
      _type: 'article',
      title: title,
      slug: { _type: 'slug', current: title.toLowerCase().replace(/\s+/g, '-').slice(0, 96) },
      category: { _type: 'reference', _ref: randomCategory._id },
      details: content, // Twoje pole tekstowe
      total_view: Math.floor(Math.random() * 5000),
      author: {
        name: author,
        published_date: date,
      },
      rating: {
        number: 5,
        badge: 'excellent'
      },
      others: {
        is_today_pick: Math.random() > 0.8,
        is_trending: Math.random() > 0.8,
      },
      production: true
    };

    try {
      await client.create(doc);
      console.log(`Sukces: ${title}`);
    } catch (err) {
      console.error(`Błąd przy: ${title}`, err.message);
    }
  }
}

migrate();