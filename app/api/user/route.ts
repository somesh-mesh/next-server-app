import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export function GET() {
  return Response.json({
    email: "somesh@gmail.com",
    name: "Somesh",
  });
}

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    if (!body.username || !body.password) {
      return Response.json({
        message: "Username and password are required",
      }, { status: 400 });
    }

    // Attempt to create the user
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password, // Note: In production, always hash passwords
      },
    });

    console.log("User created successfully:", user);

    return Response.json({
      message: "User created successfully",
      userId: user.id,
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating user:", error);

    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed on the fields: (`username`)')) {
        return Response.json({
          message: "Username already exists",
        }, { status: 409 });
      }
    }

    // Generic error response
    return Response.json({
      message: "An error occurred while creating the user",
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}