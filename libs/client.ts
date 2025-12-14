import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  // 環境変数がない場合（ビルド時）は、一時的に 'EMPTY' を入れる設定にする
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || 'EMPTY', 
  apiKey: process.env.MICROCMS_API_KEY || 'EMPTY',
});
