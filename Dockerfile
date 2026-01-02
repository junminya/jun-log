# Dockerfile

# 1. ベースイメージの指定
FROM node:20-alpine

# 2. 作業ディレクトリの作成
WORKDIR /app

# 3. 依存関係のインストール
COPY package.json package-lock.json ./
RUN npm ci

# 4. ソースコードのコピー
COPY . .

# ★重要：ビルド時に外からキーを受け取る設定
ARG MICROCMS_SERVICE_DOMAIN
ARG MICROCMS_API_KEY

# 受け取ったキーを環境変数としてセットする
ENV MICROCMS_SERVICE_DOMAIN=$MICROCMS_SERVICE_DOMAIN
ENV MICROCMS_API_KEY=$MICROCMS_API_KEY

# 5. ビルド実行（ここで環境変数が使われる）
RUN npm run build

# 6. 起動コマンド
CMD ["npm", "start"]