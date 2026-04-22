// test-api.js
const path = require("path");
// This ensures we point to the same .env.local that vercel dev is using
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

const geminiModel = require("../models/geminiModel");
const { logToSheet } = require("./googleSheetsLogger");
const sessionId = "node-js-test";

async function runTest() {
  console.log("🚀 Starting Test Run inside Vercel Dev Environment...");

  // Safety check: Verify variables are loaded
  if (!process.env.GOOGLE_SHEET_ID) {
    console.error(
      "❌ Error: Google Sheets variables are missing from .env.local",
    );
    return;
  }

  const testMessage = "test local 23 april 26";

  try {
    console.log("📡 Step 1: Requesting response from Gemma...");
    const response = await geminiModel.generateResponse(testMessage);
    console.log("✅ Response received.");

    console.log("📊 Step 2: Logging to Google Sheets...");

    await logToSheet(sessionId, testMessage, response, "Success");

    console.log("\n✨ SUCCESS! Check your Google Sheet now.");
    console.log(
      `Location: https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}`,
    );
  } catch (error) {
    console.error("\n❌ Test Failed!");
    console.error("Reason:", error.message);
  }
}

runTest();
