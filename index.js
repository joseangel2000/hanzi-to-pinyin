#!/usr/bin/env node
import { pinyin } from "pinyin-pro";
import translate from "google-translate-api-x";

const inputArgs = process.argv.slice(2);
const text = inputArgs.join(" ");

if (!text) {
  console.log("\n❌ Please enter Chinese characters.");
  console.log("Usage: pinyin 你好\n");
  process.exit(1);
}

// --- NEW: A helper function that creates a countdown timer ---
// This creates a Promise that waits 'ms' milliseconds, then throws an error.
const timeout = (ms) =>
  new Promise((_, reject) => {
    setTimeout(() => reject(new Error("TIMEOUT")), ms);
  });

async function convertAndTranslate() {
  try {
    const pinyinResult = pinyin(text);

    // We bundle our three translation requests into one single Promise
    const translationRequests = Promise.all([
      translate(text, { to: "en" }),
      translate(text, { to: "fr" }),
      translate(text, { to: "es" }),
    ]);

    // --- NEW: The Race ---
    // Promise.race runs the translations and our 5000ms (5-second) timer at the same time.
    // If the translations take longer than 5 seconds, the timer wins and throws a "TIMEOUT" error,
    // which immediately jumps down to our 'catch' block.
    const [englishResult, frenchResult, spanishResult] = await Promise.race([
      translationRequests,
      timeout(5000),
    ]);

    console.log(`\n🔤 Pinyin:  ${pinyinResult}`);
    console.log(`🇨🇳 Hanzi:   ${text}`);
    console.log(`🇪🇸 Spanish: ${spanishResult.text}`);
    console.log(`🇬🇧 English: ${englishResult.text}`);
    console.log(`🇫🇷 French:  ${frenchResult.text}/n`);
  } catch (error) {
    console.log("\n❌ Translation failed or timed out.");

    // We can even check if the error was our specific timeout error
    if (error.message === "TIMEOUT") {
      console.log(
        "Error details: The internet is too slow. We stopped waiting after 5 seconds.\n",
      );
    } else {
      console.log(`Error details: ${error.message}\n`);
    }
  }
}

convertAndTranslate();
