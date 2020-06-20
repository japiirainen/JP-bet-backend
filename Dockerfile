###############################################################################
# Step 1 : Builder image
#
FROM node:lts

# Define working directory and copy source
WORKDIR /Users/joonapiirainen/Documents/GitHub/JP-bet-backend
COPY . .
# Install dependencies and build whatever you have to build 
# (babel, grunt, webpack, etc.)
RUN npm install && npm run build

###############################################################################
# Step 2 : Run image
#
FROM node:lts
ENV NODE_ENV=dev
WORKDIR /Users/joonapiirainen/Documents/GitHub/JP-bet-backend

# Install deps for production only
COPY ./package* ./
RUN npm install && \
    npm cache clean --force
# Copy builded source from the upper builder stage
COPY --from=builder /Users/joonapiirainen/Documents/GitHub/JP-bet-backend ./build

# Expose ports (for orchestrators and dynamic reverse proxies)
EXPOSE 1337

# Start the app
CMD npm run dev