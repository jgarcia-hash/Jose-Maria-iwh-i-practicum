require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const custom_obj = 'https://api.hubapi.com/crm/v3/objects/2-66508491?properties=name,age,specie';

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(custom_obj, { headers });
        const data = resp.data.results;
        
        res.render('homepage', {title: 'Custom Objects', data});

    } catch (error) {
        console.error(error);
    }
})

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
    const title = 'Update Custom Object Form | Integrating With HubSpot I Practicum'

    try {
        res.render('updates', {title: title});
    } catch (error) {
        console.error(error);
    }
})

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {

    const uniqueVal = req.body.name;
    const nAge = req.body.age;
    const nSpecie = req.body.specie;

    const update = {
        properties : {
            "name": uniqueVal,
            "age" : nAge,
            "specie" : nSpecie
        }
    };

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    try {
        // Actualizar si existe
        const updateUrl = `https://api.hubapi.com/crm/objects/2026-03/2-66508491/${uniqueVal}?idProperty=name`;

        await axios.patch(updateUrl, update, { headers });
        console.log("Registro actualizado");
    } catch (error) {
        if (error.response && error.response.status == 404){
            console.log("Registro inexistente, creando...");
            try {
                const createUrl = `https://api.hubapi.com/crm/objects/2026-03/2-66508491`;
                await axios.post(createUrl, update, { headers });
                console.log("Exito!");
                
            } catch (error) {
                console.error(error);
                
            }
            
        } else {
            console.error(error);
        }
    }
    res.redirect('/');
})


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));