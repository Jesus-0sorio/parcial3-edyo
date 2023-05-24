import mongoose from 'mongoose';

export const dbConnection = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			autoIndex: true,
		});
		console.log('DB Connected');
	} catch (error) {
		console.log('DB Connection Error: ', error);
		throw new Error('DB Connection Error');
	}
};
