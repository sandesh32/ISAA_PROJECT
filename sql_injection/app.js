const express = require("express");
const app = express();
const oracledb = require("oracledb");
const { LocalStorage } = require("node-localstorage");

app.set("view engine", "ejs");
app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var localstorage = new LocalStorage('./scratch');
var connection;

async function run() {


    try {

        connection = await oracledb.getConnection({ user: "sandesh", password: "Sandesh123" });

        console.log("Successfully connected to Oracle Database");

        app.get("/", (req, res) => {
            if (localstorage.getItem('cookie')) {
                res.render("profile");
            } else {
                res.render("home");
            }
        });

        app.get('/logout', (req, res) => {
            localstorage.removeItem('cookie');
            res.redirect('/');
        })

        app.post('/', (req, res) => {
            console.log(req.body.id); //select id,pw from users where id='' or 1=1-- and pw="asdsa"
            connection.execute(`select id,password from users where id='${req.body.id}' and password='${req.body.password}'`)
                .then(result => {
                    let code = result.rows[0][0] + result.rows[0][1];
                    console.log(code);
                    localstorage.setItem('cookie', 'code');
                    res.render('profile');
                })
                .catch(err => {
                    console.log(err);
                    res.send('Invalid Login');
                })
        });

    } catch (err) {
        console.error(err);
    }
}

run();



app.listen(3000);