# Private community app (name TBD)
This web app provides a place to share with friends, family, and private communities. 

## Motivation
Providing a **more than chronological** way of sharing with private communities.

## Communities
Users can create **communities**.  Once created, a user can share a unique code to join that community.  Anyone with the code will be able to join.

The creator of a community will become the community admin.  Only admins can delete communities.

## Rooms
Anyone in a community can create **rooms**.  Think of rooms like a category of ideas.  For example, a user might create rooms to share **recipes**, **favorite wines**, **music**, and **videogames** with their friends.

## Posts
Anyone in a community can create **posts**.  Posts will be un-categorized by default, but the user can choose to post to a specific room, recipes for example.

Let's say I want to share a recipe with my family community.  I'll click the new post button, select the recipes room (created earlier), give my post a title, link, description, rating, and tags, then post the recipe.

## Tags
When creating a post, a user can add tags to the post.  For example, if sharing a recipe, you might want to tag it [`dairy-free`, `easy`, `healthy`]

These tags make searching and filtering posts easier for other members of the community.

## Filtering
Once a community contains posts, and possibly rooms, users can easily search and filter all posts by different parameters.  This makes it easy to find anything shared in the community.


# Development
This repo extends my [fullstack-auth-docker-boilerplate](https://github.com/ccrowley96/fullstack-auth-docker-boilerplate) - a monolithic, containerized, boilerplate repo for kickstarting fullstack applications.  The boilerplate code sets up an authentication API using google login OAuth2 with users saved to a Mongo database.  It exposes an Apollo graphQL server for querying and mutating data. This repo also sets up a simple front-end which includes persistent login with google, protected routes, and login / logout auth token management.

The client, server, and database are then containerized using the `docker-compose.yml` file.  Once you've installed [docker](https://www.docker.com/products/docker-desktop), you can spin up the the development environment with two simple commands.

1. `docker-compose build`
2. `docker-compose up`
3. (when you've finished) `docker-compose down`

# Set up development environment
## Create .env file in both the `/server` folder and root folder of the repository with the following fields.

|Key | Value|
|-------- | -----|
|PORT | `5000`|
|DB_USER | `username`|
|DB_PASSWORD | `password`|
|GOOGLE_CLIENT_ID | client ID from console.cloud.google.com|
|JWT_SECRET | any string that is complex and not easy to guess / brute force |

## Install Docker desktop
1. Navigate to [here](https://www.docker.com/products/docker-desktop), download and install docker desktop

## Set up Google OAuth Credentials
1. Navigate to console.cloud.google.com
2. Create new project
3. In navigation menu, go to APIs & Services -> Credentials
4. Create credentials -> OAuth client ID
5. Follow steps and copy google client ID into both the .env & <GoogleLogin /> component

## Build docker images
1. Navigate to the root project directory (where docker-compose.yml is located)
2. Once docker-desktop is installed, run `docker-compose build`.  This will build the the following images for your app
    - lightweight mongo database server (port 27017 by default)
    - lightweight node server for API and graphql (port 5000 by default)
    - lightweight node server for serving create-react-app client build (port 3000 by default)

## Start / stop docker containers
1. To start, run `docker-compose up`
2. To stop, run `docker-compose down`

## Test Graph QL Queries
Once containers are running, navigate to `http://localhost:5000/graphql` to play around with your API and make test queries.  

*Note `5000` should be replaced with the port you set in the .env file.  Also, because the API is protected by authentication middleware, you won't be able to access the graphql playground unless your requests contain a valid valid `Authorization: Bearer [token]`.  To get a valid token, you can log the token returned from the `/auth/googleLogin` API call on the frontend.  You can also view the client `localStorage` session key and copy the token from there. Once you have the token, paste it into the HTTP header section of the graphql playground.