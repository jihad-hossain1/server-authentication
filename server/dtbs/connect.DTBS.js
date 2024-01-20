const mongoose = require('mongoose');


const connetDTBS = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('-----> Mongo connect successfull <------')
    } catch (error) {
        console.log(error)
    }
}

module.exports = connetDTBS