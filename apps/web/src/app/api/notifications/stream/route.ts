import { NextRequest } from "next/server";
import { addClient, removeClient } from "@/lib/sse";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return new Response("Missing userId", { status: 400 });
  }

  const stream = new ReadableStream({
    start(controller) {
      addClient(userId, controller);

      controller.enqueue(
        new TextEncoder().encode('data: {"type":"connected"}\n\n'),
      );

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(": heartbeat\n\n"));
        } catch {
          clearInterval(heartbeat);
        }
      }, 30000);

      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        removeClient(userId, controller);
      });
    },
    cancel() {},
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
