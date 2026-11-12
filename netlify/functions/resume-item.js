import mongoose from "mongoose";
import { connectDatabase } from "../../server/database.js";
import { ResumeItem } from "../../server/models.js";

export default async (request) => {
  if (!["POST", "PUT", "DELETE"].includes(request.method)) {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "POST, PUT, DELETE" },
    });
  }

  try {
    await connectDatabase();

    // Endpoint for creating a new item
    if (request.method === "POST") {
      const body = await request.json();
      const item = new ResumeItem(body); 
      await item.save();
      return Response.json(item, { status: 201 });
    }

    // We will need an 'id' for PUT and DELETE 
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return Response.json({ error: "Missing 'id' parameter." }, { status: 400 });

    // Endpoint for deleting an existing item
    if (request.method === "DELETE") {
      const item = await ResumeItem.findByIdAndDelete(id);
      if (!item) return Response.json({ error: "Item not found." }, { status: 404 });
      return Response.json({ message: "Item deleted successfully.", id: item._id });
    }

    // Endpoint for updating an existing item
    if (request.method === "PUT") {
      const body = await request.json(); 
      const item = await ResumeItem.findOneAndReplace(
        { _id: id }, { ...body },
        { returnDocument: "after", runValidators: true },
      );
      if (!item) return Response.json({ error: "Item not found." }, { status: 404 });
      return Response.json(item);
    }
  } catch (error) { 
    console.error("API error:", error.name, error.message);
    if (error instanceof mongoose.Error.ValidationError) {
      return Response.json({ error: "Validation failed, check item fields." }, { status: 400 });
    }
    if (error instanceof mongoose.Error.CastError) {
      return Response.json({ error: "Cast Error, check ID format." }, { status: 400 });
    } 
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Syntax Error, check JSON format." }, { status: 400 });
    }
    return Response.json( { error: "Server Error." },{ status: 500 });
  }
};

export const config = { path: "/api/resume-item" };
