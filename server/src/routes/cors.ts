import request from 'request';
import express from 'express';

const corsApi = (req: express.Request, res: express.Response, next) => {
    const targetUrl = req.url.slice(1);

    request(targetUrl, (error, response, body) => {
        if (response && response.statusCode === 200) {
            res.send(body);
        } else {
            res.sendStatus(404);
        }
    });
};

export default corsApi;
