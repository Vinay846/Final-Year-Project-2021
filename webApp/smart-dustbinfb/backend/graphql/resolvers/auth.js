const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const { getOwnerDetails} = require('./merge');
const dotenv = require('dotenv');
dotenv.config({ path: '../../nodemon.json'});
const {mailOptions, sendMail} = require('../../nodeMailer/nodeMailer');
const {getRedisValue, setRedisValue} = require('../../redis/redis');
const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.OAUTH_CLIENTID);

module.exports = {
	createUser: async (args) => {
		try {
			const isExistWithRfid = await User.findOne({rfid: args.userInput.rfid});
			const isExistWithEmail = await User.findOne({ email: args.userInput.email.toLowerCase()});
			
			if(isExistWithRfid && isExistWithRfid !== "XXXXXXXXXXXX"){
				throw new Error('User exists already with this rfid');
			}	
			if (isExistWithEmail) {
				throw new Error('User exists already.');
			}
			
			const hashedPassword=  await bcrypt.hash(args.userInput.password, 12);
			const user = new User({
				name: args.userInput.name,
				email: args.userInput.email.toLowerCase(),
				mnumber: args.userInput.mnumber,
				rfid: args.userInput.rfid,
				password: hashedPassword
			});
			
			const result = await user.save();
			if(result) {
				return { ...result._doc, password: null, _id: result.id, sumOfPoints:0 };
			}
			
		} catch (error) {
			throw error;
		}

	},
	login: async ({email, password}) => {
		try {
			
			if(email === "GoogleAuth"){
				const ticket = await client.verifyIdToken({idToken: password, audience: process.env.OAUTH_CLIENTID});
				const payload = ticket.getPayload();
				let googleUser = await User.findOne({email: payload.email.toLowerCase()});
				if(!googleUser){
					const Createuser = new User({
						name: payload.name,
						email: payload.email.toLowerCase(),
						mnumber: "0000000000",
						rfid: "XXXXXXXXXXXX",
						password: "null",
						isGoogleAuth: true,
					});
					googleUser = await Createuser.save();
					
				}
				const token = jwt.sign({userId: googleUser._id, email: googleUser.email}, process.env.SECRETKEY, {
					expiresIn: '1h'
				});
				return {userId: googleUser._id, token, tokenExpiration: 1}
			}
		
		
			let user = await User.findOne({email: email.toLowerCase()});
			if(!user){
				throw new Error('User does not exist!');
			}
			if(user.isGoogleAuth){
				throw new Error('already exists login using Goolge');
			}
			
			const isEqual = await bcrypt.compare(password, user.password);
			if(!isEqual){
				throw new Error('Password is incorrect!');
			}
			
			const token = jwt.sign({userId: user._id, email: user.email}, process.env.SECRETKEY, {
				expiresIn: '1h'
			});
			return {userId: user._id, token, tokenExpiration: 1}
		} catch (error) {
			throw error;	
		}
	},
	forgotPassword: async ({email}) => {
		try {
			const user = await User.findOne({email: email.toLowerCase()});
			if(!user){
				throw new Error('User does not exists!');
			}
			const generatedToken = jwt.sign({userId: user.id, email: user.email}, process.env.SECRETKEY, {
				expiresIn: 30*60
			});
	
			let link = process.env.CLIENT_URI+generatedToken;
			let mail = new mailOptions(user.name, user.email, link);
			await Promise.all([sendMail(mail), setRedisValue(user.id, generatedToken, 30*60)])
			// await sendMail(mail);
			// await setRedisValue(user.id, generatedToken, 30*60);
			return{message: 'Reset Link send on your email...'};
		} catch (error) {
			throw error;
		}
		  
	},
	verifyToken: async (args)=> {
		try {
			let decodedToken = jwt.verify(args.resetPassInput.token, process.env.SECRETKEY);
			const user = await User.findById(decodedToken.userId);
			if(!user){
				throw new Error('User does not exists!')
			}
			const value = await getRedisValue(user.id);
			if(!value || value !== args.resetPassInput.token){
				throw new Error('Token Expired !');
			}
			const hashedPassword=  await bcrypt.hash(args.resetPassInput.newPassword, 12);
			user.password = hashedPassword;
			const result = await user.save();
			await setRedisValue(user.id, 'null', 1);
			if(result){
				return {
					message: "Password Changed Successfully"
				}
			}	
		} catch (error) {
			throw error;
		}
		
	},
	profile: async (args, req) => {
		if(!req.isAuth){
			throw new Error('Unauthenticated!');
		}
		try {
			const userData = await getOwnerDetails(req.userId);
			return userData;
        } catch (error) {
            throw error
        }
	},
	updateProfile: async (args, req) => {
		if(!req.isAuth){
			throw new Error('Unauthenticated!');
		}
		const oldProfile = await User.findById(req.userId);
		oldProfile.name= args.updateInput.name;
		oldProfile.email= args.updateInput.email;
		oldProfile.mnumber= args.updateInput.mnumber;
		oldProfile.rfid= args.updateInput.rfid;
		const updatedProfile = await oldProfile.save();
		return {
			...updatedProfile._doc,
		}
		
	}
};
