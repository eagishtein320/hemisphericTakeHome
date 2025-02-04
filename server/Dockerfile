FROM node:18

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./
RUN npm install
COPY ./ ./
EXPOSE 3001

CMD ["npm", "run", "start"]
