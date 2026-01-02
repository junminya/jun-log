import { createClient } from 'microcms-js-sdk';

// 環境変数がない場合（ビルド時）は、一時的に 'EMPTY' を入れる設定にする
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN || 'EMPTY';
const apiKey = process.env.MICROCMS_API_KEY || 'EMPTY';

if (!serviceDomain || !apiKey) {
  console.warn("microCMS API Key is missing!");
}

export const client = createClient({
  serviceDomain: serviceDomain, 
  apiKey: apiKey,
});