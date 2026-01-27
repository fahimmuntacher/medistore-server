import app from "./app";
import { prisma } from "./lib/prisma";


const PORT = process.env.PORT || 5000;
async function main() {
    try {
        await prisma.$connect();
        console.log("✅ Connected to the database");

        app.listen(PORT, () => {
            console.log(`🔥 Server is running on port http://localhost:${PORT}`);
        })

    } catch (error : any) {
        console.log("An error occured",error);
        await prisma.$disconnect();
        process.exit(1);

    }
}

main();