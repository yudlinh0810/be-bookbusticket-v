const connection = require('../database/connect');

const getDetail = async (id) => {
  try {
    const allow = ['CTM', 'DRV', 'STF'];
    const role = id.slice(0, 3);
    if (role === allow[0]) {
      const sql = 'select * from person where id = ?';
      const [rows] = await (await connection).execute(sql, [id]);
      return rows[0];
    }
    console.log('else');
  } catch (error) {
    console.log('GetDetail', error);
  }
};
module.exports = { getDetail };
