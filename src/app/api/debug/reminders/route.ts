// // 6. Debug endpoint - app/api/debug/reminders/route.ts
// import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";

// export async function GET() {
//   try {
//     const client = await clientPromise;
//     const db = client.db("mamasphere");

//     // Get all pending reminders
//     const pendingReminders = await db
//       .collection("reminders")
//       .find({ sent: false })
//       .toArray();

//     // Get all users with email setup
//     const usersWithEmail = await db
//       .collection("users")
//       .find({ email: { $exists: true } })
//       .toArray();

//     // Get recent tasks with reminders
//     const tasksWithReminders = await db
//       .collection("tasks")
//       .find({
//         reminder: { $exists: true, $ne: null },
//         createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
//       })
//       .toArray();

//     return NextResponse.json({
//       pendingReminders: pendingReminders.length,
//       usersWithEmail: usersWithEmail.length,
//       tasksWithReminders: tasksWithReminders.length,
//       details: {
//         pendingReminders: pendingReminders.map((r) => ({
//           type: r.type,
//           userId: r.userId,
//           reminderTime: r.reminderTime,
//           taskId: r.taskId,
//         })),
//         users: usersWithEmail.map((u) => ({
//           userId: u.userId,
//           email: u.email,
//           notifications: u.notifications,
//         })),
//         tasks: tasksWithReminders.map((t) => ({
//           _id: t._id.toString(),
//           title: t.title,
//           userId: t.userId,
//           reminder: t.reminder,
//         })),
//       },
//     });
//   } catch (error) {
//     console.error("Debug error:", error);
//     return NextResponse.json({ error: "Debug failed" }, { status: 500 });
//   }
// }
