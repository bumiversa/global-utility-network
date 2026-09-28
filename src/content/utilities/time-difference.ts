export const timeDifferenceKnowledge = {
  introduction:
    "A Time Difference Calculator computes the elapsed time between two instants. All calculations are performed locally in your browser using native JavaScript Date APIs.",
  
  sections: [
    {
      title: "Absolute Elapsed Time",
      content:
        "This tool calculates the absolute elapsed time between two instants, measured in milliseconds since the Unix epoch (January 1, 1970, 00:00:00 UTC). The result is always a non-negative duration, regardless of which instant came first.",
    },
    {
      title: "ISO 8601 Format",
      content:
        "Both inputs must be in strict ISO 8601 format with an explicit timezone. Valid examples include `2026-09-28T10:00:00Z` (UTC) or `2026-09-28T10:00:00+07:00` (with offset). Date-only inputs or formats without timezone information are not accepted to avoid ambiguity.",
    },
    {
      title: "Timezone Handling",
      content:
        "The calculator correctly handles different timezones by converting both instants to their absolute UTC timestamps before computing the difference. For example, `2026-09-28T10:00:00+07:00` and `2026-09-28T10:00:00-05:00` represent a 12-hour difference.",
    },
    {
      title: "Calendar Duration vs Elapsed Time",
      content:
        "This tool computes elapsed time (absolute duration), not calendar duration. Calendar months and years have variable lengths, so the output is expressed in days, hours, minutes, and seconds. For example, the difference between two dates might be shown as '2 days, 3 hours' rather than '2 days' if there are additional hours.",
    },
    {
      title: "Precision and Leap Seconds",
      content:
        "Calculations follow the precision available through JavaScript's native Date object, which supports millisecond precision. Leap seconds are not explicitly modeled; the calculation uses the standard Unix time representation.",
    },
    {
      title: "Privacy & Processing",
      content:
        "ðŸ”’ **All calculations happen entirely in your browser.** Your inputs are never sent to any server, persisted to storage, or logged. The result exists only in your current session and is cleared when you refresh the page or click 'Clear'.",
    },
  ],
};