const Point = require('../../models/pointModel');
const User = require('../../models/user');
const {getEarn, getRedeem, getSumOfPoints, getOwnerDetails, pointsArrayToObject} = require('./merge');

module.exports= {
    addPoint: async (args, req) => {
        // if(req.myKey !== 'mysupersecretkeyisSecret'){
        //     throw new Error('Unauthorization');
        // }
        try {
            const user = await User.find({rfid: args.addPointInput.rfid});
            if(!user.length < 0){
                throw new Error('User does not exists');
            }
            const earnPoint = new Point({
                earn: args.addPointInput.earnPoint,
                redeem: null,
                owner: user[0]._id,
            })
            const result = await earnPoint.save();
            user[0].points.push(result._id);
            const savedUserPoint = await user[0].save();
            return {
                ...result._doc,
                owner: user[0]._doc
            }
            
        } catch (error) {
            throw error
        }
    },

    removePoint: async (args, req) => {
        try {
            const user = await User.findById(req.userId);
            if(!user){
                throw new Error('Unauthenticated!');
            }
            const earned = await getEarn(req.userId);
            const redeemed = await getRedeem(req.userId);
            if(earned - redeemed+1 <= args.removePointInput.redeemPoint){
                throw new Error(`You have insufficient point to redeem !`)
            }
            const redeemPoint = new Point({
                earn: null,
                redeem: args.removePointInput.redeemPoint,
                owner: req.userId,
            })
            const result = await redeemPoint.save();
            user.points.push(redeemPoint);
            const savedUserPoint = await user.save();
            const userData = await getOwnerDetails(req.userId);
            return {
                ...result._doc,
                owner: {...userData}
            }
        } catch (error) {
            throw error
        }
    },

    points: async () => {
        try {
            const allUsers = await User.find();
            const data = await Promise.all(allUsers.map( async (user) => {
                const sumOfPoints = await getSumOfPoints(user.points);
                return {
                    ...user._doc,
                    sumOfPoints:sumOfPoints
                }
                
            }))
            return {_id, name, sumOfPoints} = data;
        } catch (error) {
            throw error;
        }
    },
    userTransaction: async (args, req)=> {
        try {            
            const user = await User.findById(req.userId);
            if(!user){
                throw new Error('Unauthenticated!');
            }
            const userHistory = await pointsArrayToObject(user.points);
            // console.log(userHistory);
            return userHistory
        } catch (error) {
            throw error;
        }
    }
}