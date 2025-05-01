# Etapa de build
FROM node:18 AS build

# Cria diretório da aplicação
WORKDIR /app

# Copia os arquivos de dependência e instala
COPY package*.json ./
COPY tsconfig.json ./
COPY knexfile.ts ./
RUN npm install

# Copia o restante do projeto
COPY . .

# Compila o TypeScript
RUN npm run build

# Etapa de produção
FROM node:18-slim

# Cria diretório da aplicação
WORKDIR /app

# Copia apenas os arquivos necessários da etapa anterior
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/knexfile.ts ./knexfile.ts

# Define variável de ambiente para produção
ENV NODE_ENV=production

# Porta que o app vai expor (ajuste se necessário)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
