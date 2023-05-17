import express from 'express';

const viewsRouter = express.Router();

viewsRouter.get('/home', (req, res) => {
    res.render('home', {});
});

export default viewsRouter