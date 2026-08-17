import ngrok from "@ngrok/ngrok";

async function startTunnel() {
  try {
    const listener = await ngrok.forward({
      addr: 5001,
      authtoken: "3I2ZqTXU8SVjsGQHBpybH7nBbYc_5BQPnLqpRPcvzcUmTkCeZ",
      domain: "skincare-resend-emcee.ngrok-free.dev"
    });
    console.log("\n======================================================");
    console.log(`🚀 PERMANENT AI TUNNEL IS LIVE: ${listener.url()}`);
    console.log("   (Press Ctrl+C anytime to stop)");
    console.log("======================================================\n");
    // Keep process alive
    process.stdin.resume();
  } catch (error) {
    console.error("Failed to start ngrok tunnel:", error);
  }
}

startTunnel();
