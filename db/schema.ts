import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, primaryKey, pgEnum } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    role: text("role").default("user"),
});

export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),

    followers: many(follow, { relationName: "followedBy" }),
    following: many(follow, { relationName: "following" }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));


export const post = pgTable("post", {
    id: text("id").primaryKey(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
})

export const likes = pgTable("likes",
    {
        userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
        postId: text("post_id").notNull().references(() => post.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.userId, table.postId] })
    })
)

export const comments = pgTable("comments",
    {
        id: text("id").primaryKey(),
        content: text("content").notNull(),
        isEdited: boolean("is_edited").default(false).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
        postId: text("post_id").notNull().references(() => post.id, { onDelete: "cascade" }),
    }
)
export const bookmarks = pgTable("bookmarks",
    {
        userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
        postId: text("post_id").notNull().references(() => post.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.userId, table.postId] })
    })
)


export const MediaTypeEnum = pgEnum("media_type",
    [
        "IMAGE",
        "VIDEO",
    ]
)

export const media = pgTable("post_media",
    {
        id: text("id").primaryKey(),
        postId: text("post_id").references(() => post.id, { onDelete: "cascade" }),
        type: MediaTypeEnum("type").notNull(),
        url: text("url").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    }
)

export const follow = pgTable("follow",
    {
        followerId: text("follower_id").notNull().references(() => user.id, { onDelete: "cascade" }),
        followingId: text("following_id").notNull().references(() => user.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.followerId, table.followingId] }),
        followingIdx: index("follow_following_id_idx").on(table.followingId),
    })
)

export const postRelations = relations(post, ({ one, many }) => ({
    author: one(user, { fields: [post.userId], references: [user.id] }),
    likes: many(likes),
    comments: many(comments),
    bookmarks: many(bookmarks),
}));

export const likeRelations = relations(likes, ({ one }) => ({
    post: one(post, { fields: [likes.postId], references: [post.id] }),
}));

export const commentRelations = relations(comments, ({ one }) => ({
    post: one(post, { fields: [comments.postId], references: [post.id] }),
    author: one(user, {
        fields: [comments.userId],
        references: [user.id],
    }),
}));

export const bookmarkRelations = relations(bookmarks, ({ one }) => ({
    post: one(post, { fields: [bookmarks.postId], references: [post.id] }),
}));


export const followRelations = relations(follow, ({ one }) => ({
    follower: one(user, {
        fields: [follow.followerId],
        references: [user.id],
        relationName: "followedBy",
    }),
    following: one(user, {
        fields: [follow.followingId],
        references: [user.id],
        relationName: "following",
    }),
}));


export const schema = {
    user,
    session,
    account,
    verification,
    post,
    likes,
    comments,
    bookmarks,
    media
} as const;