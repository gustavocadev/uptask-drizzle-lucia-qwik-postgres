/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the Express HTTP server when building for production.
 *
 * Learn more about Node.js server integrations here:
 * - https://qwik.builder.io/docs/deployments/node/
 *
 */
import {
  createQwikCity,
  type PlatformNode,
} from '@builder.io/qwik-city/middleware/node';
import qwikCityPlan from '@qwik-city-plan';
import { manifest } from '@qwik-client-manifest';
import render from './entry.ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { prisma } from './lib/prisma';
import * as dateFns from 'date-fns';

declare global {
  interface QwikCityPlatform extends PlatformNode {}
}

// Directories where the static assets are located
const distDir = join(fileURLToPath(import.meta.url), '..', '..', 'dist');
const buildDir = join(distDir, 'build');

// Allow for dynamic port
const PORT = process.env.PORT ?? 3000;

// Create the Qwik City Node middleware
const { router, notFound } = createQwikCity({
  render,
  qwikCityPlan,
  manifest,
  // getOrigin(req) {
  //   // If deploying under a proxy, you may need to build the origin from the request headers
  //   // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto
  //   const protocol = req.headers["x-forwarded-proto"] ?? "http";
  //   // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Host
  //   const host = req.headers["x-forwarded-host"] ?? req.headers.host;
  //   return `${protocol}://${host}`;
  // }
});

// Create the express server
// https://expressjs.com/
const app = express();

/* ---- SOCKET IO ----*/

// You need to create the HTTP server from the Express app
const httpServer = createServer(app);

// And then attach the socket.io server to the HTTP server
const io = new Server(httpServer);

const emitCurrentTasks = async (projectId: string) => {
  const all_tasks = await prisma.task.findMany();
  io.to(projectId).emit('current-tasks', all_tasks);
};
// Then you can use `io` to listen the `connection` event and get a socket
// from a client
io.on('connection', async (socket) => {
  socket.on('open-project', (projectId: string) => {
    // with the join method you can join a specific room, then we can use `to` for example to send a message to a specific room
    console.log(projectId);
    socket.join(projectId);
  });

  // CREATE TASK
  socket.on('new-task', async (task) => {
    const parseDateToUTC = dateFns.parse(
      task.dueDate,
      'yyyy-MM-dd',
      new Date()
    );

    await prisma.task.create({
      data: {
        deliveryDate: parseDateToUTC,
        description: task.description,
        name: task.name,
        priority: task.priority,
        projectId: task.projectId,
      },
    });

    await emitCurrentTasks(task.projectId);
  });

  // DELETE TASK
  socket.on('delete-task', async (task) => {
    console.log(task);
    await prisma.task.delete({
      where: {
        id: task.id,
      },
    });

    await emitCurrentTasks(task.projectId);
  });

  // UPDATE TASK
  socket.on('update-task', async (task) => {
    const parseDateToUTC = dateFns.parse(
      task.dueDate,
      'yyyy-MM-dd',
      new Date()
    );

    await prisma.task.update({
      where: {
        id: task.taskId,
      },
      data: {
        deliveryDate: parseDateToUTC,
        description: task.description,
        name: task.name,
        priority: task.priority,
      },
    });

    await emitCurrentTasks(task.projectId);
  });

  socket.on('toggle-task-state', (task) => {
    console.log(task);
  });
});
/* ---- SOCKET IO ----*/

// Enable gzip compression
// app.use(compression());

// Static asset handlers
// https://expressjs.com/en/starter/static-files.html
app.use(`/build`, express.static(buildDir, { immutable: true, maxAge: '1y' }));
app.use(express.static(distDir, { redirect: false }));

// Use Qwik City's page and endpoint request handler
app.use(router);

// Use Qwik City's 404 handler
app.use(notFound);

// Start the express server
httpServer.listen(PORT, () => {
  /* eslint-disable */
  console.log(`Server started: http://localhost:${PORT}/`);
});
