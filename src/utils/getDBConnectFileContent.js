export function getDBConnectFileContent() {
  return `import mongoose from "mongoose";

async function connectMongoDB() {
  try {
    const { connection } = await mongoose.connect(process.env.DB_URL, {
      dbName: process.env.DB_NAME,
    });
    console.log(\`Successfully connected to \${connection.name} database at \${connection.host}\`);
  } catch (err) {
    console.log("MongoDB initial connection failed", err);
    process.exit(1);
  }

  // for any error after the initial connection was successful
  mongoose.connection.on("error", (err) => {
    console.log("MongoDB connection error:", err);
  });

  // This event may be due to your code explicitly closing the connection, the database server crashing, or network connectivity issues.
  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });
}

export default connectMongoDB;`;
}
