# Base image for Node.js
FROM node:18 AS vite-app

ARG VITE_API_URL="http://localhost:8000"

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/

RUN rm -rf html
RUN mkdir html

WORKDIR /

COPY ./nginx.conf /etc/nginx
COPY --from=vite-app ./app/dist /usr/share/nginx/html
