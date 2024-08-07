const AWS = require('aws-sdk');
const uuidv1 = require('uuid').v1;
var path = require('path');


let awsConfig = {
	region: "",
	bucket: "",
    accessKeyId: '',
    secretAccessKey: ''
};


// const s3Client = new AWS.S3({
// 	accessKeyId: awsConfig.accessKeyId,
// 	secretAccessKey: awsConfig.secretAccessKey,
// 	region: awsConfig.region
// });

const cartifig = {
	accessKeyId: awsConfig.accessKeyId,
	secretAccessKey: awsConfig.secretAccessKey,
	region: awsConfig.region
};

const uploadParams = {
	Bucket: awsConfig.bucket,
	Key: '', // pass key
	Body: null, // pass file body,
	//ACL: "public-read"
};

async function doUpload(req, filder = null) {
	// console.log('mimetype', req.body);
	try {
		let uni = uuidv1();
		const params = uploadParams;

		let originalName = req.file.originalname;
		if (filder !== null) {
			params.Key = filder + "/" + uni + path.extname(originalName);
		} else {
			params.Key = uni + path.extname(originalName);
		}
		
		params.Body = req.file.buffer;

		let s3Get = await new AWS.S3(cartifig).putObject(params).promise();
		let data = {
			status: true,
			"originalname": originalName,
			url: "https://" + params.Bucket + ".s3." + awsConfig.region + ".amazonaws.com/" + params.Key,
			// data: {
			// 	url: "https://" + params.Bucket + ".s3." + awsConfig.region + ".amazonaws.com/" + params.Key,
			// 	s3Get
			// }
		};
		// console.log("Successfully uploaded data to bucket", data);
		return data;
	} catch (e) {
		// console.log("Error uploading data: ", e);
		return {
			status: false,
			data:e.message
		};
	}
}

module.exports = { doUpload }
