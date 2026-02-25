#!/usr/bin/env node

const path = require("path");
const { pathToFileURL } = require("url");

(async () => {
  const moduleUrl = `${pathToFileURL(path.resolve("js/special-math.js")).href}?test=${Date.now()}`;
  const {
    applyProgressAfterEvent,
    FUN_EVENTS_PER_RANK,
    FUN_RANK_NAMES,
    getFunProgressSummary,
    getSpecialContextWithProgress,
    resetFunProgress,
  } = await import(moduleUrl);

  let hasFailure = false;

  const progress = resetFunProgress();
  for (let i = 0; i < FUN_EVENTS_PER_RANK; i += 1) {
    const context = getSpecialContextWithProgress({
      tokenList: ["1", "/", "0"],
      resultString: "Infinity",
      progressState: progress,
    });
    applyProgressAfterEvent({ context, progressState: progress });
  }

  const rank1Pass = progress.rankIndex === 1 && progress.eventsSinceRankUp === 0;
  console.log(`[progress] rank-up after ${FUN_EVENTS_PER_RANK} events: ${rank1Pass ? "PASS" : "FAIL"}`);
  if (!rank1Pass) {
    console.log(`  rankIndex=${progress.rankIndex}, eventsSinceRankUp=${progress.eventsSinceRankUp}`);
    hasFailure = true;
  }

  const pendingPass = typeof progress.pendingRankUpBanner === "string" && progress.pendingRankUpBanner.includes(FUN_RANK_NAMES[1]);
  console.log(`[progress] rank-up banner queued: ${pendingPass ? "PASS" : "FAIL"}`);
  if (!pendingPass) {
    console.log(`  pendingRankUpBanner=${progress.pendingRankUpBanner}`);
    hasFailure = true;
  }

  const queuedContext = getSpecialContextWithProgress({
    tokenList: ["1", "/", "0"],
    resultString: "Infinity",
    progressState: progress,
  });
  const queuedBannerPass = queuedContext?.banner === progress.pendingRankUpBanner;
  console.log(`[progress] queued rank-up banner shown before normal lesson: ${queuedBannerPass ? "PASS" : "FAIL"}`);
  if (!queuedBannerPass) {
    console.log(`  context.banner=${queuedContext?.banner}, pending=${progress.pendingRankUpBanner}`);
    hasFailure = true;
  }

  applyProgressAfterEvent({ context: queuedContext, progressState: progress });
  const consumedPendingPass = progress.pendingRankUpBanner === null;
  console.log(`[progress] rank-up banner consumed after display: ${consumedPendingPass ? "PASS" : "FAIL"}`);
  if (!consumedPendingPass) {
    console.log(`  pendingRankUpBanner=${progress.pendingRankUpBanner}`);
    hasFailure = true;
  }

  while (progress.rankIndex < 2) {
    const context = getSpecialContextWithProgress({
      tokenList: ["1", "/", "0"],
      resultString: "Infinity",
      progressState: progress,
    });
    applyProgressAfterEvent({ context, progressState: progress });
  }

  const unlockPass = Array.isArray(progress.unlockedPackIds) && progress.unlockedPackIds.includes("B");
  console.log(`[progress] pack B unlocks at rank 2: ${unlockPass ? "PASS" : "FAIL"}`);
  if (!unlockPass) {
    console.log(`  unlockedPackIds=${JSON.stringify(progress.unlockedPackIds)}`);
    hasFailure = true;
  }

  const summary = getFunProgressSummary(progress);
  const summaryPass = summary.rankName === FUN_RANK_NAMES[progress.rankIndex] && typeof summary.nextRankIn === "number";
  console.log(`[progress] summary exposes rank and next-rank countdown: ${summaryPass ? "PASS" : "FAIL"}`);
  if (!summaryPass) {
    console.log(`  summary=${JSON.stringify(summary)}`);
    hasFailure = true;
  }

  const reset = resetFunProgress();
  const resetPass = (
    reset.totalSpecialEvents === 0 &&
    reset.rankIndex === 0 &&
    reset.eventsSinceRankUp === 0 &&
    Array.isArray(reset.unlockedPackIds) &&
    reset.unlockedPackIds.length === 1 &&
    reset.unlockedPackIds[0] === "A" &&
    reset.pendingRankUpBanner === null
  );
  console.log(`[progress] reset restores default fun progress: ${resetPass ? "PASS" : "FAIL"}`);
  if (!resetPass) {
    console.log(`  reset=${JSON.stringify(reset)}`);
    hasFailure = true;
  }

  if (hasFailure) {
    process.exitCode = 1;
  }
})();
