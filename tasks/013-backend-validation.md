# Task 013: Backend State Validation

## Goal
Implement server-side validation to prevent client-side cheating and ensure game state integrity. Players should not be able to manipulate localStorage or API calls to gain unfair advantages.

## Current Vulnerability
- All game state stored in client localStorage
- No server validation of actions
- Players can edit localStorage to give themselves items/XP
- No authentication or user accounts

## Deliverables

### 1. Database Setup
- Choose database (PostgreSQL, SQLite, or Prisma with any provider)
- Schema for:
  - `users` - id, email, password_hash, created_at
  - `player_state` - user_id, skills, inventory, equipment, last_save
  - `action_log` - user_id, action_type, timestamp, details (for audit)

### 2. Authentication
- User registration with email/password
- Login/logout functionality
- Session management (JWT or session cookies)
- Password hashing (bcrypt)

### 3. API Routes
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/game/state      - Load player state
POST /api/game/save       - Save player state (validated)
POST /api/game/action     - Perform action (validated)
```

### 4. Server-Side Validation

#### Action Validation
- Verify player has required level for action
- Verify player has required input items
- Calculate rewards server-side (XP, items)
- Validate time elapsed is reasonable

#### State Validation
- XP cannot decrease
- Items cannot appear from nowhere
- Equipment must exist in inventory to equip
- Combat stats derived from equipment, not arbitrary

#### Anti-Cheat Measures
- Rate limiting on actions
- Maximum offline time cap enforced server-side
- Sanity checks on time deltas (can't claim 1 year offline)
- Log suspicious activity

### 5. Client Updates
- Replace localStorage with API calls
- Handle loading states
- Handle offline mode gracefully
- Sync on reconnection

### 6. Offline Progress
- Client tracks time since last sync
- On reconnection, send time delta to server
- Server calculates and validates offline gains
- Apply capped, validated rewards

## Security Considerations
- Never trust client-submitted XP/item quantities
- Server calculates all rewards
- Time validation to prevent speed hacks
- Input sanitization on all endpoints
- CORS configuration

## Migration Path
1. Add auth system first
2. Create API routes for state load/save
3. Migrate existing localStorage users (optional)
4. Add action validation incrementally
5. Remove client-side reward calculation

## Acceptance Criteria
- [ ] Users can register and login
- [ ] Game state persists server-side
- [ ] Actions validated before rewards granted
- [ ] Cannot manipulate XP/items via client
- [ ] Offline progress calculated server-side
- [ ] Rate limiting prevents abuse
- [ ] Existing functionality preserved
