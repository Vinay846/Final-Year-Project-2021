const Point = require('../../models/pointModel');
const User = require('../../models/user');


const getEarn = async (userId) => {
    try {
        const points = await Point.find({owner: userId})
        const Earned = points.reduce((sum, obj) => {
            return sum + Number(obj.earn);
            
        }, 0)
        return Earned;
    } catch (error) {
        throw error;    
    }
}

const getRedeem = async (userId) => {
    try {
        const points = await Point.find({owner: userId})
        const redeemed = points.reduce((sum, obj) => {
            return sum + Number(obj.redeem);
        }, 0)
        return redeemed;
    } catch (error) {
        throw error;    
    }
}

const getSumOfPoints = async (pointsArrayIds) => {
    try {
        const res = await Point.find({_id: {$in: pointsArrayIds}});
        return res.reduce((sum, obj) => {
            return sum+obj.earn;
        }, 0)
    } catch (error) {
        throw error;
    }
}

const getOwnerDetails= async (userId)=> {
    try {
        const UserData = await User.findById(userId);
        if(!UserData){
            throw new Error('User does not exist!');
        }
        const sumOfPoints = await getSumOfPoints(UserData.points);
        const redeemed = await getRedeem(userId);
        return {
            ...UserData._doc,
            sumOfPoints:sumOfPoints-redeemed
        }
    } catch (error) {
        throw error
    }
}

const pointsArrayToObject = async (pointIds)=>{
    try {
        const res = await Point.find({_id: {$in: pointIds}});
        return res.sort((a, b) => (Number(b.createdAt)) -  (Number(a.createdAt)))
    } catch (error) {
        throw error;
    }
}


exports.getEarn = getEarn;
exports.getRedeem = getRedeem;
exports.getSumOfPoints = getSumOfPoints;
exports.getOwnerDetails = getOwnerDetails;
exports.pointsArrayToObject = pointsArrayToObject;
