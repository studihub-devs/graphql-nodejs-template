import cors = require('cors');

const adminCors = cors({
  origin: JSON.parse(process.env.ADMIN_ORIGIN_WISH_LIST),
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
export { adminCors };
