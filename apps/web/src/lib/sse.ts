import { ReadableStream } from "stream/web";

const clients = new Map<string, Set<ReadableStreamDefaultController>>();

export function addClient(
  userId: string,
  controller: ReadableStreamDefaultController,
) {
  if (!clients.has(userId)) {
    clients.set(userId, new Set());
  }
  clients.get(userId)!.add(controller);
}

export function removeClient(
  userId: string,
  controller: ReadableStreamDefaultController,
) {
  const userClients = clients.get(userId);
  if (userClients) {
    userClients.delete(controller);
    if (userClients.size === 0) {
      clients.delete(userId);
    }
  }
}

export function sendNotification(userId: string, data: unknown) {
  const userClients = clients.get(userId);
  if (userClients) {
    const message = `data: ${JSON.stringify(data)}\n\n`;
    for (const controller of Array.from(userClients)) {
      try {
        controller.enqueue(new TextEncoder().encode(message));
      } catch {
        removeClient(userId, controller);
      }
    }
  }
}
