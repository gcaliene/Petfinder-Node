# Petfinder

This app is to provide pet owners, dog walkers, or those who spend alot of time outside an option to report and find lost animals. 

The site, which can be found on https://lit-beach-73059.herokuapp.com/, uses Node, Mongo/Mongoose, HTML/CSS and features a registration and login pathway that uses passport.js and JWT. Registration is not required to view the posts but will be if the user wants to post a lost animal themselves. 

For future updates:
  * I will insert a google map api where it can receive the lat and long of users and place it on a map.
    * There will be limitations to this as the app will not be national and perhaps focus in a small area. 
  * Users will be able to communicate with each other via social media outside the realm of the site itself.
    * Examples would be the option to tweet each other instantly via a button.
  * Add a function to resolve found pets, as to add closure to a post.
  * Users will also be able to upload their pictures of the lost animals sighted.
  * ~~Right now all users have access to each others post and can delete and edit at will. I'm going to make sure that users can edit and delete their own posts in a future update.~~


### Installing
Be sure to set up a local mongo server prior to starting the app.
```
npm install
npm start
```
