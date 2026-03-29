import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("masterlearn.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT,
    email TEXT UNIQUE,
    bio TEXT,
    avatar_seed TEXT,
    onboarding_completed INTEGER DEFAULT 0,
    is_admin INTEGER DEFAULT 0,
    joined_date TEXT,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    daily_streak INTEGER DEFAULT 0,
    last_login TEXT,
    referral_code TEXT UNIQUE,
    qualifications TEXT,
    interests TEXT,
    age INTEGER,
    is_adult INTEGER DEFAULT 0,
    can_create_courses INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    category TEXT,
    instructor_id TEXT,
    price REAL,
    students INTEGER DEFAULT 0,
    rating REAL DEFAULT 0,
    level TEXT,
    image TEXT,
    tags TEXT,
    status TEXT DEFAULT 'draft',
    ui_style TEXT DEFAULT 'standard',
    FOREIGN KEY(instructor_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    course_id TEXT,
    title TEXT,
    duration TEXT,
    content TEXT,
    video_url TEXT,
    questions TEXT,
    mindmap TEXT,
    tutor_notes TEXT,
    FOREIGN KEY(course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS enrollments (
    user_id TEXT,
    course_id TEXT,
    progress REAL DEFAULT 0,
    enrolled_at TEXT,
    last_accessed TEXT,
    PRIMARY KEY(user_id, course_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    course_id TEXT,
    user_id TEXT,
    text TEXT,
    timestamp TEXT,
    likes INTEGER DEFAULT 0,
    FOREIGN KEY(course_id) REFERENCES courses(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS groups (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    invite_code TEXT UNIQUE,
    created_at TEXT,
    is_private INTEGER DEFAULT 1,
    emoji TEXT,
    theme_color TEXT,
    rules TEXT,
    max_members INTEGER
  );

  CREATE TABLE IF NOT EXISTS group_members (
    group_id TEXT,
    user_id TEXT,
    role TEXT,
    joined_at TEXT,
    xp_contributed INTEGER DEFAULT 0,
    PRIMARY KEY(group_id, user_id),
    FOREIGN KEY(group_id) REFERENCES groups(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

try {
  db.exec(`ALTER TABLE lessons ADD COLUMN questions TEXT;`);
} catch (e) {
  // Column might already exist
}

try {
  db.exec(`ALTER TABLE lessons ADD COLUMN mindmap TEXT;`);
} catch (e) {
}

try {
  db.exec(`ALTER TABLE lessons ADD COLUMN tutor_notes TEXT;`);
} catch (e) {
}

try {
  db.exec(`ALTER TABLE lessons ADD COLUMN resources TEXT;`);
} catch (e) {
}

try {
  db.exec(`ALTER TABLE courses ADD COLUMN ui_style TEXT DEFAULT 'standard';`);
} catch (e) {
  // Column might already exist
}

try {
  db.exec(`ALTER TABLE users ADD COLUMN qualifications TEXT;`);
} catch (e) {
  // Column might already exist
}

try {
  db.exec(`ALTER TABLE users ADD COLUMN onboarding_completed INTEGER DEFAULT 0;`);
} catch (e) {
  // Column might already exist
}

try {
  db.exec(`ALTER TABLE users ADD COLUMN interests TEXT;`);
} catch (e) {
  // Column might already exist
}

try {
  db.exec(`ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0;`);
} catch (e) {
  // Column might already exist
}

try { db.exec(`ALTER TABLE users ADD COLUMN joined_date TEXT;`); } catch (e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN xp INTEGER DEFAULT 0;`); } catch (e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN level INTEGER DEFAULT 1;`); } catch (e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN daily_streak INTEGER DEFAULT 0;`); } catch (e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN last_login TEXT;`); } catch (e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN referral_code TEXT UNIQUE;`); } catch (e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN age INTEGER;`); } catch (e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN is_adult INTEGER DEFAULT 0;`); } catch (e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN can_create_courses INTEGER DEFAULT 0;`); } catch (e) {}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // --- Users ---
  app.get("/api/user/:id", (req, res) => {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id) as any;
    if (!user) return res.status(404).json({ error: "User not found" });

    const today = new Date().toISOString().split('T')[0];
    let newStreak = user.daily_streak || 0;
    let lastLogin = user.last_login;
    let needsUpdate = false;

    if (!lastLogin) {
      newStreak = 1;
      lastLogin = today;
      needsUpdate = true;
    } else {
      const lastLoginDate = new Date(lastLogin);
      const todayDate = new Date(today);
      const diffTime = Math.abs(todayDate.getTime() - lastLoginDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays === 1) {
        newStreak += 1;
        lastLogin = today;
        needsUpdate = true;
      } else if (diffDays > 1) {
        newStreak = 1;
        lastLogin = today;
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      db.prepare("UPDATE users SET daily_streak = ?, last_login = ? WHERE id = ?").run(newStreak, lastLogin, req.params.id);
      user.daily_streak = newStreak;
      user.last_login = lastLogin;
    }

    const enrollments = db.prepare("SELECT * FROM enrollments WHERE user_id = ?").all(req.params.id);

    res.json({ user, enrollments });
  });

  app.post("/api/user/sync", (req, res) => {
    const { id, username, email, bio, avatarSeed, onboardingCompleted, isAdmin, joinedDate, qualifications, interests, age, isAdult, canCreateCourses } = req.body;
    
    // Streak logic
    const existingUser = db.prepare("SELECT last_login, daily_streak FROM users WHERE id = ?").get(id) as any;
    
    const today = new Date().toISOString().split('T')[0];
    let newStreak = existingUser?.daily_streak || 0;
    let lastLogin = existingUser?.last_login;

    if (!lastLogin) {
      newStreak = 1;
      lastLogin = today;
    } else {
      const lastLoginDate = new Date(lastLogin);
      const todayDate = new Date(today);
      const diffTime = Math.abs(todayDate.getTime() - lastLoginDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays === 1) {
        newStreak += 1;
        lastLogin = today;
      } else if (diffDays > 1) {
        newStreak = 1;
        lastLogin = today;
      }
    }

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
    
    const updatedUser = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    res.json({ success: true, user: updatedUser });
  });

  app.post("/api/user/:id/xp", (req, res) => {
    const { amount } = req.body;
    db.prepare("UPDATE users SET xp = xp + ? WHERE id = ?").run(amount, req.params.id);
    res.json({ success: true });
  });

  app.get("/api/leaderboard", (req, res) => {
    const users = db.prepare("SELECT id, username, xp, avatar_seed FROM users ORDER BY xp DESC LIMIT 10").all();
    res.json(users);
  });

  // --- Courses ---
  app.get("/api/courses", (req, res) => {
    const courses = db.prepare("SELECT * FROM courses").all();
    const result = courses.map((c: any) => {
      const instructor = db.prepare("SELECT id, username as name, avatar_seed as avatarSeed, bio, qualifications FROM users WHERE id = ?").get(c.instructor_id);
      const rawLessons = db.prepare("SELECT * FROM lessons WHERE course_id = ?").all(c.id);
      const lessons = rawLessons.map((l: any) => ({
        ...l,
        videoUrl: l.video_url,
        tutorNotes: l.tutor_notes,
        questions: l.questions ? JSON.parse(l.questions) : [],
        resources: l.resources ? JSON.parse(l.resources) : []
      }));
      const comments = db.prepare(`
        SELECT c.*, u.username, u.avatar_seed as avatarSeed 
        FROM comments c 
        JOIN users u ON c.user_id = u.id 
        WHERE c.course_id = ?
      `).all(c.id);

      return {
        ...c,
        uiStyle: c.ui_style,
        instructor,
        lessons,
        comments,
        tags: c.tags ? JSON.parse(c.tags) : []
      };
    });
    res.json(result);
  });

  app.post("/api/courses", (req, res) => {
    const { id, title, description, category, instructor, price, level, image, tags, status, uiStyle, lessons } = req.body;
    
    try {
      db.prepare(`
        INSERT INTO courses (id, title, description, category, instructor_id, price, level, image, tags, status, ui_style)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          description = excluded.description,
          category = excluded.category,
          price = excluded.price,
          level = excluded.level,
          image = excluded.image,
          tags = excluded.tags,
          status = excluded.status,
          ui_style = excluded.ui_style
      `).run(
        id, 
        title || null, 
        description || null, 
        category || null, 
        instructor?.id || null, 
        price || 0, 
        level || null, 
        image || null, 
        JSON.stringify(tags || []), 
        status || 'published', 
        uiStyle || 'standard'
      );

      if (lessons && lessons.length > 0) {
        const lessonIds = lessons.map((l: any) => l.id);
        db.prepare(`DELETE FROM lessons WHERE course_id = ? AND id NOT IN (${lessonIds.map(() => '?').join(',')})`).run(id, ...lessonIds);

        const insertLesson = db.prepare(`
          INSERT OR REPLACE INTO lessons (id, course_id, title, duration, content, video_url, questions, mindmap, tutor_notes, resources)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const insertMany = db.transaction((lessons) => {
          for (const l of lessons) {
            insertLesson.run(
              l.id, 
              id, 
              l.title || null, 
              l.duration || null, 
              l.content || null, 
              l.videoUrl || null, 
              JSON.stringify(l.questions || []), 
              l.mindmap || null, 
              l.tutorNotes || null, 
              JSON.stringify(l.resources || [])
            );
          }
        });
        insertMany(lessons);
      } else {
        db.prepare("DELETE FROM lessons WHERE course_id = ?").run(id);
      }

      res.json({ success: true });
    } catch (e: any) {
      console.error("Failed to save course:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/courses/:id", (req, res) => {
    try {
      db.transaction(() => {
        db.prepare("DELETE FROM lessons WHERE course_id = ?").run(req.params.id);
        db.prepare("DELETE FROM enrollments WHERE course_id = ?").run(req.params.id);
        db.prepare("DELETE FROM comments WHERE course_id = ?").run(req.params.id);
        db.prepare("DELETE FROM courses WHERE id = ?").run(req.params.id);
      })();
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // --- Enrollments ---
  app.post("/api/enroll", (req, res) => {
    const { userId, courseId } = req.body;
    
    try {
      db.transaction(() => {
        db.prepare(`
          INSERT INTO enrollments (user_id, course_id, enrolled_at, last_accessed)
          VALUES (?, ?, ?, ?)
        `).run(userId, courseId, new Date().toISOString(), new Date().toISOString());

        db.prepare("UPDATE courses SET students = students + 1 WHERE id = ?").run(courseId);
      })();
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/unenroll", (req, res) => {
    const { userId, courseId } = req.body;
    try {
      db.transaction(() => {
        db.prepare("DELETE FROM enrollments WHERE user_id = ? AND course_id = ?").run(userId, courseId);
        db.prepare("UPDATE courses SET students = MAX(0, students - 1) WHERE id = ?").run(courseId);
      })();
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/enrollments/:courseId/progress", (req, res) => {
    const { userId, progress } = req.body;
    try {
      db.prepare(`
        UPDATE enrollments 
        SET progress = ?, last_accessed = ? 
        WHERE user_id = ? AND course_id = ?
      `).run(progress, new Date().toISOString(), userId, req.params.courseId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // --- Groups ---
  app.get("/api/groups", (req, res) => {
    const groups = db.prepare("SELECT * FROM groups").all();
    const result = groups.map((g: any) => {
      const members = db.prepare(`
        SELECT gm.user_id as userId, gm.role, gm.joined_at as joinedAt, gm.xp_contributed as xpContributed, u.username, u.avatar_seed as avatarSeed 
        FROM group_members gm 
        JOIN users u ON gm.user_id = u.id 
        WHERE gm.group_id = ?
      `).all(g.id);
      return { 
        id: g.id,
        name: g.name,
        description: g.description,
        inviteCode: g.invite_code,
        createdAt: g.created_at,
        isPrivate: g.is_private === 1,
        emoji: g.emoji,
        themeColor: g.theme_color,
        rules: g.rules,
        maxMembers: g.max_members,
        members 
      };
    });
    res.json(result);
  });

  app.post("/api/groups", (req, res) => {
    const { name, description, creatorId } = req.body;
    const id = "g_" + Math.random().toString(36).substr(2, 9);
    const inviteCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    
    try {
      db.prepare(`
        INSERT INTO groups (id, name, description, invite_code, created_at, is_private)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, name, description, inviteCode, new Date().toISOString(), 1);

      db.prepare(`
        INSERT INTO group_members (group_id, user_id, role, joined_at)
        VALUES (?, ?, ?, ?)
      `).run(id, creatorId, 'admin', new Date().toISOString());

      res.json({ success: true, id, inviteCode });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/groups/join", (req, res) => {
    const { inviteCode, userId } = req.body;
    try {
      const group: any = db.prepare("SELECT id FROM groups WHERE invite_code = ?").get(inviteCode);
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }

      db.prepare(`
        INSERT INTO group_members (group_id, user_id, role, joined_at)
        VALUES (?, ?, ?, ?)
      `).run(group.id, userId, 'member', new Date().toISOString());

      res.json({ success: true, groupId: group.id });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
