import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import { DataSource } from 'typeorm';
import { RegisterResolver } from './modules/user/register';

const run = async () => {
	const myDataSource = new DataSource(require('../ormconfig.json'));
	await myDataSource.initialize();

	const schema = await buildSchema({ resolvers: [RegisterResolver] });
	const apolloServer = new ApolloServer({
		schema,
	});

	const app = Express();

	await apolloServer.start();

	apolloServer.applyMiddleware({ app });

	app.listen(4000, () => {
		console.log(`Server is running on port: 4000`);
		console.log('http://localhost:4000/graphql');
	});
};

run();
