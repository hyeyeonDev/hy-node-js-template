export const DataQuery = (schema: string) => ({
  GET_ALL: `SELECT * FROM ${schema}.sensor`,
  GET_BY_ID: `SELECT * FROM ${schema}.sensor WHERE id = ?`,
  INSERT: `INSERT INTO ${schema}.sensor (id, value, timestamp) VALUES (?, ?, ?)`,
  BULK_INSERT: `INSERT INTO ${schema}.sensor (id, value, timestamp) VALUES ?`,
  UPDATE: `UPDATE ${schema}.sensor SET name = ? WHERE id = ?`,
  DELETE: `DELETE FROM ${schema}.sensor WHERE id = ?`,
});
