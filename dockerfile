# Use a lightweight base image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your API runs on (e.g., 3000)
EXPOSE 3000

# Run the API
CMD ["npm", "start"]
