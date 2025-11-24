const express = require('express');
const path = require('path');
const app = express();
const port = 3000;


const webConfig = require('./config/webConfig.json');


app.use((req, res, next) => {
    res.locals.webConfig = webConfig;
    next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const logger = require('./middleware/logger');
app.use(logger);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));




app.use(express.static(path.join(__dirname, 'public')));




const apiRouter = require('./routes/api');
app.use('/api', apiRouter);



const viewRouter = require('./routes/views');
app.use('/', viewRouter);


const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');


app.use(notFoundHandler);


app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
