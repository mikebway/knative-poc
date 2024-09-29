# syntax=docker/dockerfile:1

# Declare the Docker image that we want to base our container on
FROM node:22-bookworm

# Don't put all the code in the root directory, put it here instead
WORKDIR /app

# Pull down the Go modules we will need before bringing our Go source over
COPY package*.json ./
RUN npm install

# Bring the Node app source into the container
COPY . .

# Make port 4000 visible outside the container
EXPOSE 4000

# The command to run when the container starts
CMD ["node", "index.js"]