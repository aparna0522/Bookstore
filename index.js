import express from 'express';
import { PORT, MONGOURI } from "./config.js";
import mongoose from 'mongoose';
import { Book } from './models/bookModel.js';

// Launching the express app
const app = express();
app.use(express.json())

// Connecting the app to the MongoDB database
mongoose.connect(MONGOURI).then(() => {
    console.log("MongoDB Connection Successful");
}).catch((error) => {
    console.log("MongoDB Connection Failed, ", error);
});

app.get('/',(req,res)=> {
    return res.status(200).send("Bookstore API application");
});

// Retrieve a list of all books. Implement pagination to limit the number of books returned per request
app.get('/books', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const books = await Book.find({}).limit(limit).skip(startIndex);

        const results = {};

        if (endIndex < (await Book.countDocuments().exec())) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }

        results.count = books.length;
        results.data = books;

        return res.status(200).json(results);
    } catch(error) {
        return res.status(500).send({message: "All books not retrieved"});
    }
});


// Add a new book to the collection. 
// Implement input validation to ensure all required fields are provided (`title`, `author`, `publicationYear`),
// and `publicationYear` should be a valid year in the past.
app.post('/books', async (req, res) => {
    try {
        // Check if request body has all the required fields
        if(!req.body.title || !req.body.author || !req.body.publicationYear) 
            return res.status(400).send({message: 'Kindly send all required fields title, author, publicationYear'});

        // Check publication date in the past or not
        let currYear = new Date().getFullYear();
        if(req.body.publicationYear > currYear) 
            return res.status(500).send({ message: 'The publication year is not in the past' });

        // Create a new Book using model to be added to our database
        const addNewBook = {
            title: req.body.title, 
            author: req.body.author, 
            publicationYear: req.body.publicationYear
        };
        
        const book = await Book.create(addNewBook)
        return res.status(201).send(book);
    } catch(error) {
        return res.status(500).send({ message: 'Failed to add new book to collection' });
    }
}); 

//Implement search functionality to allow users to search for books by title or author.
app.get('/books/search', async (req, res) => {
    try {
        let query = req.query.q;
        
        if (!query) {
            return res.status(400).send({ message: "Please provide a search query" });
        }
        query = query.replace(/['"]+/g, '');
        
        // Case-insensitive search for title and author
        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, 
                { author: { $regex: query, $options: 'i' } } 
            ]
        });
        if (!books) {
            return res.status(404).send({ message: "No matching books found" });
        }
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).send({ message: error });
    }
});

// Find the book statistics
app.get('/books/stats', async(req, res) => {
    try {
        var books = await Book.find({});
        var oldest = new Date().getFullYear(), newest = 1;
        for(var i = 0; i < books.length; i++) {
            if(books[i].publicationYear > newest) 
                newest = books[i].publicationYear;
            if(books[i].publicationYear < oldest)
                oldest = books[i].publicationYear;
        }
        return res.status(200).json({
            "Total Number of Books": books.length,
            "Oldest Published Book": oldest, 
            "Newest Published Book": newest,
        });
    } catch(error) {
        return res.status(500).send({message: "Statistics Not Found"});
    }
});

// Retrieve details of a specific book by ID
app.get('/books/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const book = await Book.findById(id);
        return res.status(200).json(book);
    } catch(error) {
        return res.status(500).send({message: error});
    }
});

// Update details of a specific book by ID. Allow partial updates, and ensure validation is applied to the input data
app.put('/books/:id', async (req, res) => {
    try {
        // Check if request body has all the required fields
        if(!req.body.title || !req.body.author || !req.body.publicationYear) 
            return res.status(400).send({message: 'Kindly send all required fields, id, title, author, publicationYear'});
        
        const {id} = req.params;
        const result = await Book.findByIdAndUpdate(id, req.body);
        if(!result) 
            return res.status(404).json({message: "Book not found"});
        return res.status(200).send({message:"Book updated successfully"});
    } catch(error) {
        return res.status(500).send({message: "Could not update as asked"});
    }
});

// Delete a specific book by ID.
app.delete('/books/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const result = await Book.findByIdAndDelete(id);
        if(!result)     
            return res.status(404).send({message: "Book not found"});

        return res.status(200).send({message: "Book deleted successfully"});
    } catch(error) {
        return res.status(500).send({message: "The book with the given id does not exist"});
    }
});

app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`)
});