FROM node:20.9-slim AS builder
ENV NODE_ENV=production

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile --production=false
COPY . .
RUN yarn build

FROM node:20.9-slim AS runner
ENV NODE_ENV=production

WORKDIR /app

# 不要なファイルがCOPYされないよう、ホワイトリスト運用しています
# production 実行で必要なファイルはここでCOPYしてください
# standalone モードを利用すると、publicと.next/staticはデフォルトでは含まれないので明示的にコピーする必要があります
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/.next/standalone ./
CMD ["node", "server.js"]
