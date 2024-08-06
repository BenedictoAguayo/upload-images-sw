import express from 'express';
import cors from 'cors';
import multer from 'multer';
const app = express();
app.use(cors());
const PORT = 3000;

//create a storage for the image
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});

const upload = multer({ storage: storage });

//create a GET request to test the server
app.get('/', (req, res) => {
	console.log('request GET')
	res.json({ message: 'Hello World' });
}
);

//create a POST request to upload an image
app.post('/upload', upload.single('image'), (req, res) => {
	//verify if the image is uploaded

	console.log(req.file)
	console.log('request POST')
	res.json({
		status: 'success',
		filename: req.file.originalname
	});
}
);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
}
);
