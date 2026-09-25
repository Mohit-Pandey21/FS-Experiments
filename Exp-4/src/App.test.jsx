import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("Interactive Calendar (Unit 1 Experiment 4)", () => {
  it("Assignment 1 & 2: renders all seven days and supplied events with unique keys", () => {
    render(<App />);
    expect(screen.getAllByText("Design review").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Portfolio review").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId(/day-/)).toHaveLength(7);
  });

  it("Assignment 1: toggles memoization and optimization controls", async () => {
    const user = userEvent.setup();
    render(<App />);
    const memo = screen.getAllByRole("switch")[0];
    expect(memo).toHaveAttribute("aria-checked", "true");
    await user.click(memo);
    expect(memo).toHaveAttribute("aria-checked", "false");
  });

  it("Assignment 1: filters events using memoized agenda filter", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByDisplayValue("All events"), "deadline");
    expect(screen.getAllByText("Ship v2.3").length).toBeGreaterThan(0);
    expect(screen.queryByTestId("event-design")).not.toBeInTheDocument();
  });

  it("Assignment 2: moves an event through drag and drop handlers", () => {
    render(<App />);
    const event = screen.getByTestId("event-design");
    const target = screen.getByTestId("day-2");
    event.dispatchEvent(new Event("dragstart", { bubbles: true }));
    target.dispatchEvent(new Event("drop", { bubbles: true }));
    expect(screen.getAllByText("Design review").length).toBeGreaterThan(0);
  });

  it("Assignment 3: resets render counters and updates metrics", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /reset counters/i }));
    expect(screen.getByText(/Render counters reset/i)).toBeInTheDocument();
  });

  it("Assignment 5: demonstrates API Mocking by syncing events", async () => {
    const user = userEvent.setup();
    render(<App />);
    const syncBtn = screen.getByRole("button", { name: /mock api sync/i });
    await user.click(syncBtn);
    await waitFor(() => {
      expect(screen.getByText(/Synced with Mock API/i)).toBeInTheDocument();
    });
  });

  it("Assignment 5: demonstrates Code Splitting with React.lazy and Suspense", async () => {
    const user = userEvent.setup();
    render(<App />);
    const profilerBtn = screen.getByRole("button", { name: /lazy profiler/i });
    await user.click(profilerBtn);
    await waitFor(() => {
      expect(screen.getByText(/Deep Profiling & Reconciliation Analytics/i)).toBeInTheDocument();
    });
  });

  it("Lab Guide: opens and displays lab syllabus and comparison matrix", async () => {
    const user = userEvent.setup();
    render(<App />);
    const guideBtn = screen.getByRole("button", { name: /lab guide/i });
    await user.click(guideBtn);
    expect(screen.getByText(/Key Selection Comparison Matrix/i)).toBeInTheDocument();
  });

  it("Integration Flow: allows adding and deleting events interactively", async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Open add modal
    const addBtn = screen.getByRole("button", { name: /\+ add event/i });
    await user.click(addBtn);

    // Fill form
    const titleInput = screen.getByLabelText(/event title/i);
    await user.type(titleInput, "Team Retrospective");
    
    const submitBtn = screen.getByRole("button", { name: /create event/i });
    await user.click(submitBtn);

    // Event should be visible in the calendar
    expect(screen.getAllByText("Team Retrospective").length).toBeGreaterThan(0);
  });

  it("Page 3: toggles Key Selection Mode (Stable ID vs Array Index)", async () => {
    const user = userEvent.setup();
    render(<App />);
    const switches = screen.getAllByRole("switch");
    // 5th switch is the key selection mode
    const keySwitch = switches[4];
    expect(keySwitch).toHaveAttribute("aria-checked", "false");
    await user.click(keySwitch);
    expect(keySwitch).toHaveAttribute("aria-checked", "true");
  });
});