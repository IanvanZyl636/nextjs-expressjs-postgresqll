import { prisma } from "../../integrations/prisma";
import bcrypt from 'bcrypt';


export async function registerUser() {  
    const email = 'vanzyli101@gmail.com';
    const password = 'password';

    const existingUser = await prisma.user.findFirst({
        where: { email }
    })

    if (existingUser) {
        console.log('Already exists');
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
        },
    });

    return user;
}

export function loginUser() {

}