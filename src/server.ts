import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import { DataSource } from 'typeorm';
import { RegisterResolver } from './modules/user/register';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { redis } from './redis';
import cors from 'cors';
import { LoginResolver } from './modules/user/login';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

const run = async () => {
	const myDataSource = new DataSource(require('../ormconfig.json'));
	await myDataSource.initialize();

	const schema = await buildSchema({
		resolvers: [RegisterResolver, LoginResolver],
	});
	const apolloServer = new ApolloServer({
		schema,
		context: (req) => ({ req }),
		plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
	});

	const app = Express();

	const RedisStore = connectRedis(session);

	app.use(
		cors({
			credentials: true,
			// origin: 'http://localhost:3000',
		})
	);

	app.use(
		session({
			store: new RedisStore({
				client: redis,
			}),
			name: 'qid',
			secret: 'secret',
			resave: false,
			saveUninitialized: false,
			cookie: {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 1000 * 60 * 60 * 24 * 2 * 365, // 2 years
			},
		})
	);

	await apolloServer.start();

	apolloServer.applyMiddleware({ app });

	app.listen(4000, () => {
		console.log(`Server is running on port: 4000`);
		console.log('http://localhost:4000/graphql');
	});
};

run();
