import connection from "../db";

export const updateUserImage = async (email: string, image: string) => {
  try {
    const conn = await connection();
    const [rows] = await conn.execute(
      `UPDATE users SET image = ? WHERE email = ?`,
      [image, email]
    );
    conn.end();
    return rows.affectedRows > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
};
