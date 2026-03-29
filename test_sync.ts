import Database from 'better-sqlite3';

const db = new Database('masterlearn.db');

const id = "test-id-123";
const username = "testuser";
const email = "test@example.com";
const bio = "test bio";
const avatarSeed = "seed123";
const onboardingCompleted = false;
const isAdmin = false;
const joinedDate = "2023-01-01";
const qualifications = null;
const interests = [];
const newStreak = 1;
const lastLogin = "2023-01-01";
const age = 25;
const isAdult = true;
const canCreateCourses = true;

const stmt = db.prepare(`
  INSERT INTO users (id, username, email, bio, avatar_seed, onboarding_completed, is_admin, joined_date, qualifications, interests, daily_streak, last_login, age, is_adult, can_create_courses)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    username = excluded.username,
    email = excluded.email,
    bio = excluded.bio,
    avatar_seed = excluded.avatar_seed,
    onboarding_completed = excluded.onboarding_completed,
    is_admin = excluded.is_admin,
    qualifications = excluded.qualifications,
    interests = excluded.interests,
    daily_streak = excluded.daily_streak,
    last_login = excluded.last_login,
    age = excluded.age,
    is_adult = excluded.is_adult,
    can_create_courses = excluded.can_create_courses
`);

try {
  stmt.run(
    id, 
    username || null, 
    email || null, 
    bio || null, 
    avatarSeed || null, 
    onboardingCompleted ? 1 : 0, 
    isAdmin ? 1 : 0, 
    joinedDate || null, 
    qualifications || null, 
    interests ? JSON.stringify(interests) : null, 
    newStreak, 
    lastLogin || null,
    age || null,
    isAdult ? 1 : 0,
    canCreateCourses ? 1 : 0
  );
  console.log("Success");
} catch (e) {
  console.error(e);
}
