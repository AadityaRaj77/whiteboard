# Collaborative Whiteboard app

MaRS web development open project

## Overview

An app that allow multiple users to draw and plan in a single room and canvas and in real-time, connected through a unique sharable link, which is unique for a set of username and password.

It provides a canvas to draw with tools - Pencil, shapes(circle and rectangle), eraser, color picker, stroke width(pencil and eraser), undo and redo actions and clear canvas.

Import and Export - Allows exports in form of JSON and image format, and imports only JSON files.

## Detailed Video Demo (all functionalities and flow)

Link - [https://drive.google.com/file/d/1JOSIu5YsC2WClFWGh5qq5tOAmaDC0MzL/view](https://drive.google.com/file/d/1JOSIu5YsC2WClFWGh5qq5tOAmaDC0MzL/view)

## Deployment

Link - [https://whiteboard-neon.vercel.app](https://whiteboard-neon.vercel.app/)

## Technologies used

Link - ReactJS, KonvaJS, NodeJS, ExpressJS, MongoDB, Socket.io, Vercel, Render.

## Running the Project Locally

- Clone the github repository

  ```bash
  git clone https://github.com/AadityaRaj77/whiteboard.git
  ```

- Enter the project folder:

  ```bash
  cd whiteboard
  ```

- Head over to `backend\` and `frontend\`, and run `npm install` to install the required packages.

- Create `.env` file in `backend\` and add your local mongodb uri, with whiteboard as database, to it:

  ```env
  DB_URI=mongodb://localhost:27017/whiteboard
  ```

- Head over to `frontend\src\api.js` and replace `BACKEND_URL` with `http://localhost:3001`

- Now, Run the frontend and backend with `npm run dev` & `node app.js` respectively.
