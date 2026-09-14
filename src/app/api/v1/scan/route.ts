import { NextRequest, NextResponse } from "next/server";
import { analyzeSecurityPayload } from "@/lib/securityEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { payload, useWebhook, webhookUrl } = body;

    if (!payload || typeof payload !== "string") {
      return NextResponse.json(
        { error: "Payload string is required" },
        { status: 400 }
      );
    }

    // Heuristic threat analysis
    const result = analyzeSecurityPayload(payload);

    // Optional n8n Webhook dispatch simulation
    if (useWebhook && webhookUrl) {
      try {
        // Forwarding to external webhook without exposing frontend credentials
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "qrshield.threat_scanned",
            payload,
            result,
            source: "qrshield_api_v1",
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => {
          // ignore webhook failure in mock demo
        });
        result.webhookTriggered = true;
      } catch {
        // graceful fallback
      }
    }

    return NextResponse.json({
      status: "success",
      data: result,
      meta: {
        engine: "QRShield Heuristic Threat Matrix v2.4",
        n8n_ready: true,
        fastapi_compatible: true,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to analyze QR payload", details: message },
      { status: 500 }
    );
  }
}
