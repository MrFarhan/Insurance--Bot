const functions = require('firebase-functions');
var admin = require("firebase-admin");
admin.initializeApp();
var firestore = admin.firestore();

const { WebhookClient } = require('dialogflow-fulfillment');
process.env.DEBUG = "dialogflow:debug"

exports.insurbot = functions.https.onRequest((request, response) => {
    const _agent = new WebhookClient({ request, response });


    function _yes(agent) {

        let context = agent.context.get('datasaved');

        let params = {
            Name: context.parameters.Name,
            last_name: context.parameters.last_name,
            number: context.parameters.number,
            email: context.parameters.email,
            engine_number: context.parameters.engine_number,
            Chasis_Number: context.parameters.Chasis_Number,
            Type: context.parameters.Type,
            registration_number: context.parameters.registration_number,
            Vehicle_Maker: context.parameters.Vehicle_Maker,
            Vehicle_Model: context.parameters.Vehicle_Model,
            color: context.parameters.color,
            date: context.parameters.date,
            address: context.parameters.address
        }
        return firestore.collection('users').add(params)
            .then((data) => {
                console.log(`data in parameter is ${params}`)
                return agent.add(`your policy have been insured successfully. Type start to incept another policy`)
            })
            .catch((e => {
                console.log("error is", e)
            }))
    }

    function DetailsYes(agent) {
        var Name = agent.parameters.Name;
        var last_name = agent.parameters.last_name;
        var number = agent.parameters.number;
        var email = agent.parameters.email;
        var engine_number = agent.parameters.engine_number;
        var Chasis_Number = agent.parameters.Chasis_Number;
        var Type = agent.parameters.Type;
        var registration_number = agent.parameters.registration_number;
        var Vehicle_Maker = agent.parameters.Vehicle_Maker;
        var Vehicle_Model = agent.parameters.Vehicle_Model;
        var color = agent.parameters.color;
        var date = agent.parameters.date;
        var address = agent.parameters.address;

        agent.context.set({
            'name': 'datasaved',
            'lifespan': 5,
            'parameters': {
                Name: Name,
                last_name: last_name,
                number: number,
                email: email,
                engine_number: engine_number,
                Chasis_Number: Chasis_Number,
                Type: Type,
                registration_number: registration_number,
                Vehicle_Maker: Vehicle_Maker,
                Vehicle_Model: Vehicle_Model,
                color: color,
                date: date,
                address: address,

            }
        });

        return agent.add(`Find below your details:
    Insured First Name: ${agent.parameters.Name}
    Insured Last Name: ${agent.parameters.last_name}
    Insured Phone Number: ${agent.parameters.number}
    Insured Email: ${agent.parameters.email}
    Engine Number: ${agent.parameters.engine_number}
    Chasis Number: ${agent.parameters.Chasis_Number}
    Policy Type: ${agent.parameters.Type}
    Vehicle Reg No.: ${agent.parameters.registration_number}
    Vehicle Make: ${agent.parameters.Vehicle_Maker}
    Vehicle Model: ${agent.parameters.Vehicle_Model}
    Vehicle Color: ${agent.parameters.color}
    Vehicle Year: ${agent.parameters.date}
    Contact Address: ${agent.parameters.address}

    Do you confirm and agree that you are a Law Abiding Citizen not involved in any fraudulent or malicious activities and that all the details above is correct.`)
    }


    let intents = new Map();

    intents.set("Details - yes - yes", DetailsYes);
    intents.set("Details - yes - yes - yes", _yes);
    // 

    _agent.handleRequest(intents);
})