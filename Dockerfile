FROM node:25.4.0

WORKDIR /app/

# install yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
RUN chmod a+rx /usr/local/bin/yt-dlp

COPY ./package.json ./package-lock.json /app/
RUN npm i
RUN npm i ffmpeg-static

COPY . /app/
RUN npx prisma migrate deploy
RUN npx prisma generate
RUN npm run build

VOLUME ["/app/data"]
CMD ["npm", "start"]
