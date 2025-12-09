// app/api/farmers/[id]/route.js
import Farmer from "@/models/Farmer";
import dbConnect from "@/utils/mongoDb";


// GET /api/farmers/:id → get one farmer
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const farmer = await Farmer.findById(params.id);
    if (!farmer) {
      return new Response(JSON.stringify({ error: "Farmer not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(farmer), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Invalid ID or error fetching farmer" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// PUT /api/farmers/:id → update farmer
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const body = await req.json();
    const updated = await Farmer.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return new Response(JSON.stringify({ error: "Farmer not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to update farmer" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// DELETE /api/farmers/:id → delete farmer
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const deleted = await Farmer.findByIdAndDelete(params.id);
    if (!deleted) {
      return new Response(JSON.stringify({ error: "Farmer not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({ message: "Farmer deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete farmer" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
      }
    );
  }
}