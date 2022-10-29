const express = require('express')
const app = new express();
const router = require('./router.js')
const routeruser = require('./routeruser.js')
const port = 4300;
const cors = require('cors');
app.use(cors({
    origin: '*'
}));
app.listen(port, () => {
    console.log("Port is listeneing at port :" + port)
})

app.get('/', (req, res) => {
    res.status(200).send(
` <h1>Get the data from user and display it</h1>`
    )
})
app.use('/operation', router)
app.use('/useroperations', routeruser)