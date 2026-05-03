import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST() {
  try {
    // 1. Authenticate the request - verify the user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = user.id

    // 2. Delete Supabase auth user (triggers CASCADE DELETE on all related tables)
    const adminClient = createAdminClient()

    try {
      const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId)

      if (deleteError) {
        return NextResponse.json(
          { error: "Failed to delete user account" },
          { status: 500 }
        )
      }
    } catch (deleteError) {
      console.error("[Delete Account] Exception during user deletion:", deleteError)
      return NextResponse.json(
        { error: "Failed to delete user account" },
        { status: 500 }
      )
    }

    // 3. Sign out the user (clear cookies)
    await supabase.auth.signOut()

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully"
    })

  } catch (error) {
    console.error("[Delete Account] Unexpected error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
