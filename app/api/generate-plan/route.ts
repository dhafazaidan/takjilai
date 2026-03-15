import { NextRequest, NextResponse } from "next/server";
import { generateBusinessPlan } from "@/lib/gemini";
import { BusinessInput, GenerateRequest } from "@/types/business";

// ---- Custom Error ----

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// ---- Input Validator ----

function validateInput(body: unknown): GenerateRequest {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Request body must be a JSON object");
  }

  const { location, capital, category, mayarLink, count, excludeProducts } =
    body as Record<string, unknown>;

  if (!location || typeof location !== "string" || location.trim() === "") {
    throw new ValidationError("'location' is required and must be a non-empty string");
  }

  if (capital === undefined || capital === null) {
    throw new ValidationError("'capital' is required");
  }
  const capitalNum = Number(capital);
  if (isNaN(capitalNum) || capitalNum < 10_000) {
    throw new ValidationError("'capital' must be a number and at least Rp 10.000");
  }

  const validCategories = ["minuman", "gorengan", "kolak", "kue", "es", "lainnya"];
  if (!category || typeof category !== "string" || !validCategories.includes(category)) {
    throw new ValidationError(
      `'category' must be one of: ${validCategories.join(", ")}`
    );
  }

  if (!mayarLink || typeof mayarLink !== "string") {
    throw new ValidationError("'mayarLink' is required");
  }

  // Optional fields
  const countNum = count !== undefined ? Number(count) : 3;
  if (isNaN(countNum) || countNum < 1 || countNum > 3) {
    throw new ValidationError("'count' must be a number between 1 and 3");
  }

  const excludeList: string[] =
    Array.isArray(excludeProducts)
      ? excludeProducts.map(String)
      : [];

  return {
    location: location.trim(),
    capital: capitalNum,
    category: category as BusinessInput["category"],
    mayarLink: mayarLink.trim(),
    count: countNum,
    excludeProducts: excludeList,
  };
}

// ---- Route Handler ----

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  let input: GenerateRequest;
  try {
    input = validateInput(body);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 400 }
      );
    }
    throw err;
  }

  try {
    const data = await generateBusinessPlan(
      input,
      input.count ?? 3,
      input.excludeProducts ?? []
    );
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[/api/generate-plan]", err);
    return NextResponse.json(
      { success: false, error: "⚠️ AI sedang sibuk, coba lagi dalam beberapa detik." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method not allowed" },
    { status: 405 }
  );
}