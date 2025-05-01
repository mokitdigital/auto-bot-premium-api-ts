FROM node:20-slim AS build

# Instalar ferramentas necessárias para build de dependências nativas
RUN apt-get update && \
  apt-get install -y python3 g++ make && \
  ln -s /usr/bin/python3 /usr/bin/python && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar apenas os arquivos necessários para instalação
COPY package*.json ./
COPY tsconfig.json ./
COPY knexfile.ts ./

# Instalar dependências
RUN npm install

# Copiar restante do código-fonte
COPY . .

# Build do projeto TypeScript
RUN npm run build

# Imagem final para produção
FROM node:20-slim AS production

WORKDIR /app
COPY --from=build /app ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
