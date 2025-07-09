# Database Scaffold Data

This directory contains example data and scripts to populate your Supabase database with test data for development and testing.

## Files

- `tasks.json` - Contains 5 realistic example tasks for the Last20 platform
- `populate-db.ts` - TypeScript script to insert the data into Supabase
- `run-populate.sh` - Shell script wrapper for easy execution
- `README.md` - This documentation

## Quick Start

1. **Install dependencies** (if not already installed):

   ```bash
   pnpm install
   ```

2. **Set up environment variables** in `.env.local`:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Run the population script**:
   ```bash
   pnpm db:scaffold
   ```

## What Gets Created

The script will create:

- **1 Test User** (if not exists): `64702a46-9951-43e7-b4ab-076c66877b55`
- **5 Example Tasks** with realistic scenarios:

  - Stripe webhook integration fix
  - React Native authentication debugging
  - Database query optimization
  - Image upload/resize functionality
  - Real-time notifications implementation

- **Random Claims** on some tasks for variety

## Example Tasks

1. **Fix Stripe webhook integration** - $150
2. **Debug authentication flow** - $200
3. **Optimize database queries** - $175
4. **Fix image upload functionality** - $125
5. **Implement real-time notifications** - $225

## Manual Execution

If you prefer to run the script manually:

```bash
# Make sure you're in the project root
cd /path/to/frontend-v2

# Run the shell script
bash data/scaffold/run-populate.sh

# Or run the TypeScript directly
tsx data/scaffold/populate-db.ts
```

## Troubleshooting

- **Missing environment variables**: Make sure `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- **Permission denied**: Run `chmod +x data/scaffold/run-populate.sh`
- **tsx not found**: Install with `pnpm add -D tsx`

## Customization

To modify the example data:

1. Edit `tasks.json` to add/remove/modify tasks
2. Update the `TARGET_USER_ID` in `populate-db.ts` if needed
3. Re-run the script

The script is idempotent - you can run it multiple times safely.
