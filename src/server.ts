import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import * as Express from 'express';
import { buildSchema, Query, Resolver } from 'type-graphql';

@Resolver()
class HelloResolver {
	@Query(() => String, {
		nullable: true,
		description: 'A simple string value return',
	})
	async hello() {
		return 'Hello World!';
	}
}

const run = async () => {
	const schema = await buildSchema({ resolvers: [HelloResolver] });
	const apolloServer = new ApolloServer({ schema });

	const app = Express();

	await apolloServer.start();

	apolloServer.applyMiddleware({ app });

	app.listen(4000, () => {
		console.log(`Server is running on port: 4000`);
		console.log('http://localhost:4000/graphql');
	});
};

run();
