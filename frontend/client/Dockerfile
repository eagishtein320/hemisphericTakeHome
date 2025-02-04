FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# Use Nginx to serve the built frontend
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
