FROM node:20-slim AS build

# Instalar Python, g++ e make para node-gyp
RUN apt-get update && \
  apt-get install -y python3 g++ make && \
  ln -s /usr/bin/python3 /usr/bin/python && \
  npm config set python /usr/bin/python && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar arquivos essenciais
COPY package*.json ./
COPY tsconfig.json ./
COPY knexfile.ts ./

# Instalar dependências
RUN npm install

# Copiar código restante
COPY . .

# Compilar TypeScript
RUN npm run build

# Imagem final
FROM node:20-slim

WORKDIR /app
COPY --from=build /app .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
