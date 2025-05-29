# Use official Node.js LTS version as base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# Expose port your app listens to
EXPOSE 3000

# Start your app
CMD ["npm", "run","dev"]
