# Semantic Web Linked Project

**By Jun Smith**

## Project Rundown
This repository is for the purpose of developing an API by combining the two datasets of [poverty rates - SIA15](http://www.cso.ie/px/pxeirestat/Statire/SelectVarVal/Define.asp?MainTable=SIA15&PLanguage=0&PXSId=0) and [recorded crime offences - CJA01](http://www.cso.ie/px/pxeirestat/Statire/SelectVarVal/Define.asp?maintable=CJA01&PLanguage=0) in Ireland, ranging from 2004 to 2013 on a year-to-year basis as both datasets share said years in common. Both datasets have been sourced from the Irish Central Statistics Office web site.

## Technologies used
This API will use SQLite3 which is a transactional database engine as it is best suited for relatively small datasets and is ideal for low traffic websites (Less than 100,000 hits per day).

For web templating, two popular choices exist; namely ejs and JADE. ejs has been chosen over JADE as its usability is better as it matches more closely to html and its syntax also uses tags. It has also been chosen as it allows seamless usage with Javascript.

## How to query the API
The API is aimed to be simple to use by displaying a form for most pages to input information to change or display some element from the database.

### Relative URLs
URL | Page purpose
--- | ------------
/   | Index/ home page
/allc | Returns all records from the "crime" table
/allp | Returns all records from the "poverty" table
/search/:table/:id | Enter either "crime" or "poverty" (excluding the quotation marks) in place of :table and an integer in place of :id to return a record from their respective table with matching ID
/all | Returns all records from both tables
/post | Displays a form to create a record in a specified table
/delete | Displays a form to delete a record in a specified table
/update | Displays a form to update a record in a specified table

### Example usage



## References used
[Accessing the HTTP message body (e.g. POST data) in node.js](blog.frankgrimm.net/2010/11/howto-access-http-message-body-post-data-in-node-js/)
