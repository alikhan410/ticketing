# Base image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install application dependencies
RUN npm install --omit=dev

# Copy the application code to the container
COPY ./ ./

# Define the command to run your Node.js application
CMD ["npm","start"]