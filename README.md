# [SERVER] GamersX - A Social Network for Gamers

This is the server repo of my social network project. It's currently hosted on Heroku and it's integrated with GitHub for automatic deploys on pushes to the master branch.

## Installation

In order to run this project locally, you're gonna need a **MongoDB Atlas** user, cluster and database created. The user _must_ have **read and write to any database** privilege and the network access set to your current IP or the **0.0.0.0/0** IP address. By setting the latter you're allowing access to your database from anywhere, so make sure you have strong credentials.

**1.** Create a `.env` file inside the config folder and then add the following:
  - DB_USER=_dbusername_
  - DB_PASSWORD=_dbuserpassword_
  - DB_CLUSTER=_cluster_
    - At the Clusters section, you can click on **Connect** at the desired cluster, and then **Connect your application**. There you will get the cluster right between the **@** and the **/**
  - DB_DBNAME=_databasename_
    - The name of the database you created in your Cluster
  - JWT_SECRET_KEY=_tokensecret_
    - Used to create the tokens and verify their authenticity
  
**2.** Then you can simply run the following code to start the server:
  - `npm run server`
  - If everything was configured properly you should see a _`Connected to MongoDB Atlas. Server started on port 5000.`_ message, meaning it's all good and running.

**3.** Run the [client](https://github.com/lucasfrsi/gsn_client) and have fun.

## License
[MIT](https://github.com/lucasfrsi/gsn_server/blob/master/LICENSE)