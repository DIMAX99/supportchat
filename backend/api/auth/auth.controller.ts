import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import db  from "../../db/index.js";
import { users } from "../../db/schema.js"
import{
    SignupSchema,
    LoginSchema
} from "../../utils/types.js";
const JWT_SECRET = process.env.JWT_SECRET || "e4f88eb2865ffdc89b8d1d45aeb324d1";

const TOKEN_EXPIRES_IN = "7d";

export const signup = async(req:Request, res:Response)=>{
    try {
        const parsed = SignupSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid request body",
                errors: parsed.error.flatten(),
            });
        }

        const { name, email, password, role } = parsed.data;

        const existingUser = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (existingUser.length > 0) {
            return res.status(409).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertedUser = await db
            .insert(users)
            .values({
                name,
                email,
                password: hashedPassword,
                role,
            })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                avatar_url: users.avatar_url,
                registered_at: users.registered_at,
            });

        const user = insertedUser[0];

        if (!user) {
            return res.status(500).json({ message: "Failed to create user" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRES_IN }
        );

        return res.status(201).json({
            message: "Signup successful",
            token,
            user,
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const login=async(req:Request,res:Response)=>{
    try {
        const parsed = LoginSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid request body",
                errors: parsed.error.flatten(),
            });
        }

        const { email, password } = parsed.data;

        const foundUsers = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (foundUsers.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = foundUsers[0];

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRES_IN }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar_url: user.avatar_url,
                registered_at: user.registered_at,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}