import { createClient } from "@supabase/supabase-js";

import tasksData from "./task.json";

// Note: Prices in the JSON files are now stored as integers (in cents/pence)
// e.g., 12500 = $125.00, 17500 = $175.00

const TARGET_USER_ID = "8e36b017-e099-417e-88a1-3f5d2aea5d49";

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing required environment variables:");
  console.error("- NEXT_PUBLIC_SUPABASE_URL");
  console.error("- SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const populateDatabase = async () => {
  console.log("🚀 Starting database population...");

  try {
    // First, ensure the target user exists
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("id", TARGET_USER_ID)
      .single();

    if (userError || !user) {
      console.log("⚠️  Target user not found, creating placeholder user...");

      const { error: createUserError } = await supabase.from("users").insert({
        id: TARGET_USER_ID,
        email: "test-user@last20.com",
        name: "Test User",
        role: "viber",
      });

      if (createUserError) {
        console.error("❌ Failed to create user:", createUserError);
        return;
      }

      console.log("✅ Created placeholder user");

      // Add audit trail for user creation
      await supabase.from("audit_trail").insert({
        user_id: TARGET_USER_ID,
        action_type: "user_registered",
        entity_type: "user",
        entity_id: TARGET_USER_ID,
        metadata: {
          email: "test-user@last20.com",
          role: "viber",
          source: "populate_script",
        },
      });
    } else {
      console.log(`✅ Found existing user: ${user.name} (${user.email})`);
    }

    // Insert tasks
    console.log("\n📝 Inserting tasks...");

    for (const task of tasksData.tasks) {
      const { data: insertedTask, error: taskError } = await supabase
        .from("tasks")
        .insert({
          title: task.title,
          description: task.description,
          tech_stack: task.tech_stack,
          price: task.price,
          category: task.category,
          links: task.links,
          creator_id: TARGET_USER_ID,
          status: "open",
        })
        .select()
        .single();

      if (taskError) {
        console.error(`❌ Failed to insert task "${task.title}":`, taskError);
        continue;
      }

      console.log(`✅ Inserted task: ${task.title} ($${(task.price / 100).toFixed(2)})`);

      // Add audit trail for task creation
      await supabase.from("audit_trail").insert({
        user_id: TARGET_USER_ID,
        action_type: "task_created",
        entity_type: "task",
        entity_id: insertedTask.id,
        metadata: {
          title: task.title,
          price: task.price,
          price_display: (task.price / 100).toFixed(2),
          category: task.category,
          tech_stack: task.tech_stack,
          source: "populate_script",
        },
      });

      // Add some example claims for variety
      // if (Math.random() > 0.5) {
      //   const claimMessage = `I can help with this! I have experience with ${task.tech_stack
      //     .slice(0, 2)
      //     .join(" and ")}.`;

      //   const { data: insertedClaim, error: claimError } = await supabase
      //     .from("claims")
      //     .insert({
      //       task_id: insertedTask.id,
      //       coder_id: TARGET_USER_ID, // Using same user for demo
      //       message: claimMessage,
      //       status: Math.random() > 0.7 ? "approved" : "pending",
      //     })
      //     .select()
      //     .single();

      //   if (!claimError) {
      //     console.log(`   📋 Added claim for: ${task.title}`);

      //     // Add audit trail for claim creation
      //     await supabase.from("audit_trail").insert({
      //       user_id: TARGET_USER_ID,
      //       action_type: "task_claimed",
      //       entity_type: "claim",
      //       entity_id: insertedClaim.id,
      //       metadata: {
      //         task_id: insertedTask.id,
      //         task_title: task.title,
      //         claim_status: insertedClaim.status,
      //         message: claimMessage,
      //         source: "populate_script",
      //       },
      //     });

      //     // If claim is approved, update task status
      //     if (insertedClaim.status === "approved") {
      //       await supabase
      //         .from("tasks")
      //         .update({
      //           status: "claimed",
      //           primary_assignee_id: TARGET_USER_ID,
      //           status_timestamps: { claimed: new Date().toISOString() },
      //         })
      //         .eq("id", insertedTask.id);

      //       // Add audit trail for task assignment
      //       await supabase.from("audit_trail").insert({
      //         user_id: TARGET_USER_ID,
      //         action_type: "task_claimed",
      //         entity_type: "task",
      //         entity_id: insertedTask.id,
      //         metadata: {
      //           assignee_id: TARGET_USER_ID,
      //           claim_id: insertedClaim.id,
      //           source: "populate_script",
      //         },
      //       });
      //     }
      //   }
      // }
    }

    console.log("\n🎉 Database population completed successfully!");
    console.log(`📊 Created ${tasksData.tasks.length} tasks for user ${TARGET_USER_ID}`);
  } catch (error) {
    console.error("❌ Error populating database:", error);
    process.exit(1);
  }
};

// Run the script
populateDatabase();
