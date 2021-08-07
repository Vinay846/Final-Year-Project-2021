const express = require('express');
const PORT = process.env.PORT || 8000;
const {graphqlHTTP} = require('express-graphql');
const mongoose = require('mongoose');
const User = require('./models/user');
const Point = require('./models/pointModel');

const dotenv = require('dotenv');
dotenv.config({ path: './nodemon.json' });


const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	if(req.method == 'OPTIONS'){
		return res.sendStatus(200);
	}
	next();
})

app.use(isAuth);


app.use(
    '/graphql',
    graphqlHTTP({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true
    })
)

app.get('/', (req, res) => {
    res.send("working");
})

app.get('/points/:data', async (req, res) => {
    try {
        const data = req.params.data.split('-');
        const user = await User.findOne({rfid: data[0]});
        console.log(data);
        if(!user){
            res.send('not found');
            return;
        }
        const earnPoint = new Point({
            earn: data[1],
            redeem: null,
            owner: user._id,
        })
        const result = await earnPoint.save();
        user.points.push(result._id);
        const savedUserPoint = await user.save();
        res.send('done');
        return;
        
    } catch (error) {
        throw error
    }
})

// const localUri = `mongodb://localhost:27017/smart-dustbin-db`;
const onlineUri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.elesn.mongodb.net/${process.env
.MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(onlineUri, {useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true})
.then(() => {
    app.listen(PORT, () => {
        console.log("Connected to Database");
    });
}).catch((err) => {
    console.log(err);
})

