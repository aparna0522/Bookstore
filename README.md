<h2>Project Description</h2>
This project aims at developing apis for a bookstore, creating a robust backend for the bookstore. This utilizes NodeJs and ExpressJs for developing this backend and HTML, CSS, JavaScript for Frontend.</h2>

<h2>How to run this project?</h2>
Please ensure port 8080 is open and can serve the backend. 
1. Run ```sh startBackendServer.sh``` 
2. Run ```sh startFrontendServer.sh```
3. Use the http-server link to launch the website.

<h3>Backend Endpoints</h3>
1. GET ```/books```: Retrieve a list of all books. Implement pagination to limit the number of books returned per request. 
'''
http://localhost:8080/books
'''
2. GET ```/books/{id}```: Retrieve details of a specific book by ID.
'''
http://localhost:8080/books/<ANY_ID>
'''
3. POST ```/books```: Add a new book to the collection. Implement input validation to ensure all required fields are provided (`title`, `author`, `publicationYear`), and `publicationYear` should be a valid year in the past.
'''
http://localhost:8080/books
'''
4. PUT ```/books/{id}```: Update details of a specific book by ID. Allow partial updates, and ensure validation is applied to the input data.
'''
http://localhost:8080/books/<ANY_ID>
'''
5. DELETE ```/books/{id}```: Delete a specific book by ID.
'''
http://localhost:8080/books/<ANY_ID>
'''
6. GET ```/books/search?q={query}```: Implement search functionality to allow users to search for books by title or author.
'''
http://localhost:8080/books/search?q="<Any_author_or_bookname>"
'''
7. GET ```/books/stats```: Provide statistics about the collection of books, including the total number of books, the earliest and latest publication years, and any other relevant metrics you think are appropriate.
'''
http://localhost:8080/books/stats
'''

<h2> Assumptions: </h2>
I have used MongoDB Database. So, the ID has been generated automatically, and it is unique everytime.