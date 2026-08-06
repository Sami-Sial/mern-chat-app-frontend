FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all local files into the image
COPY . .

# Ensure the app runs on the correct port (Fly.io will route HTTP traffic to this port)
EXPOSE 8000

# Start the Node.js application
CMD [ "npm", "start" ]
