export type SheetLeadPayload = {
  name?: string;
  showroomName?: string;
  showroom?: string;
  phone?: string;
  city?: string;
  executives?: string;
  teamSize?: string;
  vehicle_type?: string;
  role?: string;
  selectedChallenges?: string[];
  message?: string;
  source?: "Questionnaire Wizard" | "Demo Contact Form";
};

export const GOOGLE_SHEET_URL =
  (import.meta as any).env?.VITE_GOOGLE_SHEET_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbyuuEVgnmDnOEgPjc9OmL7A7_e7o5zDyNzD3kLLocNIqk9fog9PvLtJTREL-9arfT6h/exec";

/**
 * Sends lead & questionnaire details to Google Sheets via fetch().
 *
 * Key points:
 *   - Uses default mode "cors" (NOT "no-cors"). Google Apps Script Web Apps
 *     deployed with "Anyone" access respond with Access-Control-Allow-Origin: *.
 *   - Content-Type is "text/plain" which is a CORS-safe request header,
 *     so no preflight OPTIONS request is needed.
 *   - redirect: "follow" ensures the browser follows Google's 302 redirect.
 *   - The body is a JSON string which the Apps Script parses via
 *     JSON.parse(e.postData.contents).
 */
export async function sendLeadToGoogleSheet(payload: SheetLeadPayload): Promise<boolean> {
  const endpoint = GOOGLE_SHEET_URL;

  if (!endpoint) {
    console.warn("[GoogleSheet] Web App URL is not set.");
    return false;
  }

  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const name = payload.name || "N/A";
  const showroom = payload.showroomName || payload.showroom || "N/A";
  const phone = payload.phone || "N/A";
  const city = payload.city || "N/A";
  const teamSize = payload.teamSize || payload.executives || "N/A";
  const role = payload.role || "N/A";
  const vehicleType = payload.vehicle_type || "N/A";
  const challenges = Array.isArray(payload.selectedChallenges)
    ? payload.selectedChallenges.join(", ")
    : "N/A";
  const message = payload.message || "N/A";
  const source = payload.source || "Website Form";

  const dataToSend = {
    timestamp,
    name,
    showroom,
    phone,
    city,
    teamSize,
    role,
    vehicleType,
    challenges,
    message,
    source,
  };

  const jsonString = JSON.stringify(dataToSend);

  try {
    // We MUST use mode: "no-cors" to prevent the browser from blocking the request
    // due to Google's cross-origin redirects. The response will be opaque (status 0),
    // so we cannot read the response body, but the POST will successfully reach Google.
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: jsonString,
    });

    console.log("[GoogleSheet] Data sent to Google Sheet! (Opaque response received)");
    return true;
  } catch (err) {
    console.error("[GoogleSheet] Error submitting to Google Sheet:", err);
    return false;
  }
}
