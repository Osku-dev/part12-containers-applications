FROM node:20

WORKDIR /usr/src/app

# Install deps
COPY package*.json ./
RUN npm install


# Start the dev server (Vite/Cra/etc.)
CMD ["npm", "run", "dev"]
