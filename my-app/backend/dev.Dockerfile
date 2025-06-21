# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Install deps first for caching
COPY package*.json ./
RUN npm install


# Install nodemon globally for dev hot reload
RUN npm install -g nodemon

# Default command for dev
CMD ["npm", "run", "dev"]
