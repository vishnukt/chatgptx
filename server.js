const express = require('express');
const app = express();


require('./startup/logging')();
require('./startup/routes')(app);


app.get('/', (req, res) => {
	return res.send(`SERVER RUNNING...`);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`SERVER LISTENING ON PORT ${port}`));
