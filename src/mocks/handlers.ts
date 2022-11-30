import { rest } from "msw";

const messages = [
  {
    id: "1",
    description: "Message 1",
  },
  {
    id: "2",
    description: "Message 2",
  },
  {
    id: "3",
    description: "Message 3",
  },
];

export const handlers = [
  rest.get("/api/messages", (req, res, ctx) => {
    return res(ctx.json(messages));
  }),
];
