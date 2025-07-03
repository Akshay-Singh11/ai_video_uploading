"use client";
import { useRouter } from "next/router";
import React, { useState } from "react";

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter();



    const handleSumit = async (e: React.FormEvent<HTMLFormElement>)=> {
        e.preventDefault();
        if (password != confirmPassword) {
            alert("password do not match");
            return;
        }

        try {
            // send registration request
            // react query ---> loading ,error ,data,debouncing and duplicate value

            const respond = await fetch("/api/auth/register")
            method: "POST",
                headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            const data = await.respond.json();
            if (!respond.ok) {
                throw new Error(data.error || "Registration failed");
            }
            console.log(data);
            router.push("/login")
        }
        catch (error) {
            console.error(error);
        }
    }
    return <div>
        <h1>Register Page</h1>
        <form onSubmit={handleSumit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit">Register</button>
        </form>
        <div>
            <p>
                Already have an account? <a href="/login">Log in</a>
            </p>
        </div>
    </div>;
}

export default RegisterPage;