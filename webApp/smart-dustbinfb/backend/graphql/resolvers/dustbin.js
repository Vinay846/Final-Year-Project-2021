const Dustbin = require('../../models/dustbinModal');

const isLocationVaild=(location)=>{
    const {lat, lng} = location;
    if(lat === null || lat === undefined){
        return false;
    }
    else if(lng === null || lng === undefined){
        return false;
    }
    return true;
}

module.exports = {
    addNewDustbin: async (args)=> {
        try {
            const isIdAlreadyExists = await Dustbin.findOne({Id: args.newDustbinInput.Id})
            if(isIdAlreadyExists){
                throw new Error('already exists with this Id !');
            }

            const transformLocation = {
                lat: args.newDustbinInput.lat,
                lng: args.newDustbinInput.lng
            }
            const newBin = new Dustbin({
                Id: args.newDustbinInput.Id, 
                location: transformLocation, 
                address: args.newDustbinInput.address,
                status: args.newDustbinInput.status,
            });

            const result = await newBin.save();
            if(result){
                return {...result._doc, 
                    _id: result.id,
                    location: JSON.stringify(result.location),
                    createdAt: result.createdAt.toString(),
                    updatedAt: result.updatedAt.toString()       
                };
            }
        } catch (error) {
            throw error;
        }
    },
    
    updateDustbinInput: async (args)=> {
        try {
            const isIdAlreadyExists = await Dustbin.findOne({Id: args.updateDustbinInput.Id})
            if(!isIdAlreadyExists){
                throw new Error('Not exists with this Id !');
            }
            const transformLocation = {
                lat: args.updateDustbinInput.lat,
                lng: args.updateDustbinInput.lng
            }

            if(isLocationVaild(transformLocation)){
                isIdAlreadyExists.status = args.updateDustbinInput.status;
                isIdAlreadyExists.location.lat = args.updateDustbinInput.lat;
                isIdAlreadyExists.location.lng = args.updateDustbinInput.lng;
                isIdAlreadyExists.address = args.updateDustbinInput.address;
                isIdAlreadyExists.updatedAt = Date.now();
                
            }
            else{
                isIdAlreadyExists.status = args.updateDustbinInput.status;
                isIdAlreadyExists.updatedAt = Date.now();
            }

            const result = await isIdAlreadyExists.save();
            if(result){
                return {...result._doc, 
                    _id: result.id,
                    location: JSON.stringify(result.location),
                    createdAt: result.createdAt.toString(),
                    updatedAt: result.updatedAt.toString(),
                }
            }
        } catch (error) {
            throw error;
        }
    },
    getDustbinDetails: async ()=> {
        try {
            const isIdAlreadyExists = await Dustbin.find();
            if(!isIdAlreadyExists){
                throw new Error('No data found !');
            }
            return isIdAlreadyExists.map((data) => (
                {...data._doc,
                    _id : data.id,
                    location : JSON.stringify(data.location),
                    updatedAt : data.updatedAt.toString(),
                    createdAt : data.createdAt.toString()
                }
            ))
        }
        catch (error) {
            throw error;
        }
    },

}
