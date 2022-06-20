1. 
// What database changes would be required to the starter code to allow for different roles for authors of a blog post?
in database,
Create a roles table ('Admin', 'User', 'Guest');
Create a permissions table ('Create', 'Read','Write','Delete','Deny');
Create a junction table with all three tables as sources.

user ->roles table->permissions table -> user post -> post
these tables have the same primary key which is userId, therefore, the user talbe should have userId column and it would be the same value as the one in user_Post.

2. How would you have to change the PATCH route given your answer above to handle roles?

it can import the middlewares.js file and have 'next' in the patch method

exports.update = (req,res,next) => {
