const SHEET_ID = "1l96M7RTvSl3cU80VBf9QnyitM6AqK1tjh6NMu4NS2jw";
const SHEET_NAME = "Leads Website";

function doPost(event) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const payload = JSON.parse(event.postData.contents || "{}");
    const expectedSecret = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");
    if (!expectedSecret || payload.secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }

    const lead = payload.lead || {};
    if (!lead.phone) return jsonResponse({ ok: false, error: "Phone is required" });

    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Thời gian", "Họ tên", "Số điện thoại", "Dịch vụ/Tình trạng", "Nguồn form",
        "Trang gửi", "Trang giới thiệu", "UTM Source", "UTM Medium", "UTM Campaign",
        "UTM Content", "UTM Term"
      ]);
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      safeCell(lead.submittedAt || new Date().toISOString()), safeCell(lead.name), safeCell(lead.phone),
      safeCell(lead.service), safeCell(lead.source || "website"), safeCell(lead.pageUrl), safeCell(lead.referrer),
      safeCell(lead.utmSource), safeCell(lead.utmMedium), safeCell(lead.utmCampaign),
      safeCell(lead.utmContent), safeCell(lead.utmTerm)
    ]);

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: "Internal error" });
  } finally {
    lock.releaseLock();
  }
}

function safeCell(value) {
  const text = String(value || "");
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
