"use server"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function CloseLoginAction() {
    // Al cerrar sesión
    await (await cookies()).set("token", "", {
        httpOnly: true,
        secure: true,
        maxAge: 0, 
        path: "/"   
    });
      redirect("/tienda")
}

