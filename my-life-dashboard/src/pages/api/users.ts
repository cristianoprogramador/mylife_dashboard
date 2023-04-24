import connection from "../db";

export const getUsers = async () => {
  const conn = await connection();

  try {
    const [rows] = await conn.query("SELECT * FROM users");
    return rows;
  } catch (error) {
    throw new Error(`Unable to fetch users: ${error}`);
  } finally {
    conn.end();
  }
};
