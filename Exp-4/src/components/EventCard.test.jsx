import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EventCard from "./EventCard";

// Exact example from Page 5 of Unit 1 Experiment 4 Manual:
// "Testing with React Testing Library: Test behavior, not implementation"
describe("EventCard Component Testing (Manual Page 5)", () => {
  it("renders event title", () => {
    render(
      <EventCard
        event={{
          id: "m-1",
          title: "Meeting",
          time: "10:00",
          type: "meeting"
        }}
      />
    );
    expect(screen.getByText("Meeting")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();
  });
});
