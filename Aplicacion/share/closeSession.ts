"use server"
import { cookies } from "next/headers";

export async function CloseLoginAction() {
    // Al cerrar sesión
    await (await cookies()).set("token", "", {
        httpOnly: true,
        secure: true,
        maxAge: 0, 
        path: "/"   
    });
}

