import { NextResponse } from "next/server";
import { fetchClient } from "@/lib/fetchClient";

export async function GET() {
  const targetUrl =
    "https://archive.org/advancedsearch.php?q=collection:(feature_films)&rows=1&output=json";

  try {
    console.log("📡 Testing connection to Archive.org...");

    // Use our custom proxy client
    const response = await fetchClient(targetUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Archive.org returned ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json({
      status: "✅ Success!",
      message: "Connected to Archive.org via Proxy",
      dataPreview: data.response.docs[0].title,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "❌ Failed",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
