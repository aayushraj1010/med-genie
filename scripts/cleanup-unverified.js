const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const daysArg = args.find((a) => a.startsWith("--days="));
  const days = daysArg ? parseInt(daysArg.split("=")[1], 10) : 7; // default 7 days

  if (!Number.isFinite(days) || days <= 0) {
    console.error("Invalid --days value");
    process.exit(1);
  }

  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  console.log(
    `Cleaning users created before ${cutoff.toISOString()} with no sessions`,
  );

  // Find users older than cutoff with no sessions
  const users = await prisma.user.findMany({
    where: {
      createdAt: { lt: cutoff },
    },
    select: { id: true },
  });

  let deletedCount = 0;

  for (const u of users) {
    const session = await prisma.session.findFirst({ where: { userId: u.id } });
    if (!session) {
      await prisma.user.delete({ where: { id: u.id } });
      deletedCount++;
      console.log(`Deleted user id=${u.id}`);
    }
  }

  console.log(`Done. Deleted ${deletedCount} user(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
