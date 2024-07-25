FROM node:19-bullseye

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NEXT_PUBLIC_BACKEND_ENDPOINT=http://localhost:4306/api

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]