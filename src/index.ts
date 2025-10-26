#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { execSync } from "child_process";

/**
 * Execute an AppleScript command and return the result
 */
function runAppleScript(script: string): string {
  try {
    const result = execSync(`osascript -e '${script.replace(/'/g, "'\\''")}'`, {
      encoding: "utf-8",
    });
    return result.trim();
  } catch (error: any) {
    throw new Error(`AppleScript error: ${error.message}`);
  }
}

/**
 * Parse iCalendar date string to ISO format
 */
function parseCalendarDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toISOString();
  } catch {
    return dateStr;
  }
}

/**
 * List all calendars
 */
function listCalendars(): any[] {
  const script = `
    tell application "Calendar"
      set calList to {}
      repeat with cal in calendars
        set calInfo to {name:(name of cal), description:(description of cal)}
        set end of calList to calInfo
      end repeat
      return calList
    end tell
  `;

  const result = runAppleScript(script);
  // Parse the AppleScript result
  const calendars: any[] = [];
  const matches = result.matchAll(/name:([^,]+)(?:, description:([^}]+))?/g);

  for (const match of matches) {
    calendars.push({
      name: match[1].trim(),
      description: match[2] ? match[2].trim() : "",
    });
  }

  return calendars;
}

/**
 * Get events from a calendar
 */
function getEvents(calendarName: string, daysAhead: number = 30): any[] {
  const script = `
    tell application "Calendar"
      set targetCal to first calendar whose name is "${calendarName}"
      set startDate to current date
      set endDate to startDate + (${daysAhead} * days)

      set eventList to {}
      repeat with evt in (every event of targetCal whose start date is greater than or equal to startDate and start date is less than or equal to endDate)
        set eventInfo to {summary:(summary of evt), startDate:(start date of evt as text), endDate:(end date of evt as text), location:(location of evt), description:(description of evt)}
        set end of eventList to eventInfo
      end repeat
      return eventList
    end tell
  `;

  try {
    const result = runAppleScript(script);
    const events: any[] = [];

    // Simple parser for AppleScript result
    const eventMatches = result.matchAll(/summary:([^,]+), startDate:([^,]+), endDate:([^,]+)(?:, location:([^,]+))?(?:, description:([^}]+))?/g);

    for (const match of eventMatches) {
      events.push({
        summary: match[1].trim(),
        startDate: match[2].trim(),
        endDate: match[3].trim(),
        location: match[4] ? match[4].trim() : "",
        description: match[5] ? match[5].trim() : "",
      });
    }

    return events;
  } catch (error: any) {
    throw new Error(`Failed to get events: ${error.message}`);
  }
}

/**
 * Create a new event
 */
function createEvent(
  calendarName: string,
  summary: string,
  startDate: string,
  endDate: string,
  location?: string,
  description?: string
): string {
  const locationStr = location ? `, location:"${location}"` : "";
  const descriptionStr = description ? `\n        set description of newEvent to "${description}"` : "";

  const script = `
    tell application "Calendar"
      set targetCal to first calendar whose name is "${calendarName}"
      tell targetCal
        set newEvent to make new event with properties {summary:"${summary}", start date:date "${startDate}", end date:date "${endDate}"${locationStr}}${descriptionStr}
      end tell
      return "Event created: " & summary of newEvent
    end tell
  `;

  return runAppleScript(script);
}

/**
 * Delete an event
 */
function deleteEvent(calendarName: string, eventSummary: string): string {
  const script = `
    tell application "Calendar"
      set targetCal to first calendar whose name is "${calendarName}"
      set targetEvent to first event of targetCal whose summary is "${eventSummary}"
      delete targetEvent
      return "Event deleted: ${eventSummary}"
    end tell
  `;

  return runAppleScript(script);
}

/**
 * Update an event
 */
function updateEvent(
  calendarName: string,
  eventSummary: string,
  newSummary?: string,
  newStartDate?: string,
  newEndDate?: string,
  newLocation?: string,
  newDescription?: string
): string {
  let updates = [];

  if (newSummary) updates.push(`summary:"${newSummary}"`);
  if (newStartDate) updates.push(`start date:date "${newStartDate}"`);
  if (newEndDate) updates.push(`end date:date "${newEndDate}"`);
  if (newLocation) updates.push(`location:"${newLocation}"`);

  const updatesStr = updates.length > 0 ? `set properties of targetEvent to {${updates.join(", ")}}` : "";
  const descriptionStr = newDescription ? `\n      set description of targetEvent to "${newDescription}"` : "";

  const script = `
    tell application "Calendar"
      set targetCal to first calendar whose name is "${calendarName}"
      set targetEvent to first event of targetCal whose summary is "${eventSummary}"
      ${updatesStr}${descriptionStr}
      return "Event updated: " & summary of targetEvent
    end tell
  `;

  return runAppleScript(script);
}

/**
 * Search events by query
 */
function searchEvents(query: string, daysAhead: number = 30): any[] {
  const script = `
    tell application "Calendar"
      set startDate to current date
      set endDate to startDate + (${daysAhead} * days)

      set eventList to {}
      repeat with cal in calendars
        repeat with evt in (every event of cal whose start date is greater than or equal to startDate and start date is less than or equal to endDate)
          if summary of evt contains "${query}" or description of evt contains "${query}" then
            set eventInfo to {calendar:(name of cal), summary:(summary of evt), startDate:(start date of evt as text), endDate:(end date of evt as text), location:(location of evt)}
            set end of eventList to eventInfo
          end if
        end repeat
      end repeat
      return eventList
    end tell
  `;

  try {
    const result = runAppleScript(script);
    const events: any[] = [];

    const eventMatches = result.matchAll(/calendar:([^,]+), summary:([^,]+), startDate:([^,]+), endDate:([^,]+)(?:, location:([^}]+))?/g);

    for (const match of eventMatches) {
      events.push({
        calendar: match[1].trim(),
        summary: match[2].trim(),
        startDate: match[3].trim(),
        endDate: match[4].trim(),
        location: match[5] ? match[5].trim() : "",
      });
    }

    return events;
  } catch (error: any) {
    throw new Error(`Failed to search events: ${error.message}`);
  }
}

// Define the tools
const TOOLS: Tool[] = [
  {
    name: "list_calendars",
    description: "List all available calendars in Apple Calendar",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_events",
    description: "Get events from a specific calendar",
    inputSchema: {
      type: "object",
      properties: {
        calendar_name: {
          type: "string",
          description: "The name of the calendar to get events from",
        },
        days_ahead: {
          type: "number",
          description: "Number of days ahead to fetch events (default: 30)",
          default: 30,
        },
      },
      required: ["calendar_name"],
    },
  },
  {
    name: "create_event",
    description: "Create a new event in a calendar",
    inputSchema: {
      type: "object",
      properties: {
        calendar_name: {
          type: "string",
          description: "The name of the calendar to create the event in",
        },
        summary: {
          type: "string",
          description: "The title/summary of the event",
        },
        start_date: {
          type: "string",
          description: "Start date and time (e.g., '1/15/2025 2:00:00 PM')",
        },
        end_date: {
          type: "string",
          description: "End date and time (e.g., '1/15/2025 3:00:00 PM')",
        },
        location: {
          type: "string",
          description: "Location of the event (optional)",
        },
        description: {
          type: "string",
          description: "Description of the event (optional)",
        },
      },
      required: ["calendar_name", "summary", "start_date", "end_date"],
    },
  },
  {
    name: "delete_event",
    description: "Delete an event from a calendar",
    inputSchema: {
      type: "object",
      properties: {
        calendar_name: {
          type: "string",
          description: "The name of the calendar containing the event",
        },
        event_summary: {
          type: "string",
          description: "The summary/title of the event to delete",
        },
      },
      required: ["calendar_name", "event_summary"],
    },
  },
  {
    name: "update_event",
    description: "Update an existing event in a calendar",
    inputSchema: {
      type: "object",
      properties: {
        calendar_name: {
          type: "string",
          description: "The name of the calendar containing the event",
        },
        event_summary: {
          type: "string",
          description: "The current summary/title of the event to update",
        },
        new_summary: {
          type: "string",
          description: "New summary/title for the event (optional)",
        },
        new_start_date: {
          type: "string",
          description: "New start date and time (optional)",
        },
        new_end_date: {
          type: "string",
          description: "New end date and time (optional)",
        },
        new_location: {
          type: "string",
          description: "New location (optional)",
        },
        new_description: {
          type: "string",
          description: "New description (optional)",
        },
      },
      required: ["calendar_name", "event_summary"],
    },
  },
  {
    name: "search_events",
    description: "Search for events across all calendars by keyword",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query to match against event summaries and descriptions",
        },
        days_ahead: {
          type: "number",
          description: "Number of days ahead to search (default: 30)",
          default: 30,
        },
      },
      required: ["query"],
    },
  },
];

// Create server instance
const server = new Server(
  {
    name: "🍎 Apple Calendar",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_calendars": {
        const calendars = listCalendars();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(calendars, null, 2),
            },
          ],
        };
      }

      case "get_events": {
        const { calendar_name, days_ahead = 30 } = args as any;
        const events = getEvents(calendar_name, days_ahead);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(events, null, 2),
            },
          ],
        };
      }

      case "create_event": {
        const { calendar_name, summary, start_date, end_date, location, description } = args as any;
        const result = createEvent(calendar_name, summary, start_date, end_date, location, description);
        return {
          content: [
            {
              type: "text",
              text: result,
            },
          ],
        };
      }

      case "delete_event": {
        const { calendar_name, event_summary } = args as any;
        const result = deleteEvent(calendar_name, event_summary);
        return {
          content: [
            {
              type: "text",
              text: result,
            },
          ],
        };
      }

      case "update_event": {
        const {
          calendar_name,
          event_summary,
          new_summary,
          new_start_date,
          new_end_date,
          new_location,
          new_description,
        } = args as any;
        const result = updateEvent(
          calendar_name,
          event_summary,
          new_summary,
          new_start_date,
          new_end_date,
          new_location,
          new_description
        );
        return {
          content: [
            {
              type: "text",
              text: result,
            },
          ],
        };
      }

      case "search_events": {
        const { query, days_ahead = 30 } = args as any;
        const events = searchEvents(query, days_ahead);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(events, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Apple iCalendar MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
