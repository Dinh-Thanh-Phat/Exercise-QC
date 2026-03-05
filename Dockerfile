FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV CI=true

CMD ["npx", "playwright", "test", "--reporter=list"]
