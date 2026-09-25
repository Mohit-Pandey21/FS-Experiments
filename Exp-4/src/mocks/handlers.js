import { http, HttpResponse } from "msw";

// MSW Handler definition as taught in Unit 1 Experiment 4 Manual (Page 5-6)
export const handlers = [
  http.get("/api/events", () => {
    return HttpResponse.json([
      { id: "design", title: "Design review", day: 0, time: "10:00", type: "meeting" },
      { id: "ship", title: "Ship v2.3", day: 0, time: "16:00", type: "deadline" },
      { id: "sam", title: "1:1 with Sam", day: 1, time: "09:30", type: "meeting" },
      { id: "proposal", title: "Write proposal", day: 2, time: "13:00", type: "focus" },
      { id: "sprint", title: "Sprint planning", day: 3, time: "11:00", type: "meeting" },
      { id: "demo", title: "Client demo", day: 4, time: "15:00", type: "meeting" },
      { id: "grocery", title: "Grocery run", day: 5, time: "10:00", type: "personal" },
      { id: "portfolio", title: "Portfolio review", day: 6, time: "18:00", type: "focus" }
    ]);
  })
];
