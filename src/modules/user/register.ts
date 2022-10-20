import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/user';
import { RegisterInput } from './register/registerinput';

@Resolver()
export class RegisterResolver {
	@Query(() => String)
	async hello() {
		return 'Hello World!';
	}

	@Query(() => [User])
	async users() {
		return User.find();
	}

	@Mutation(() => User)
	async register(
		@Arg('data') { email, firstName, lastName, password }: RegisterInput
	): Promise<User> {
		const hashedPwd = await bcrypt.hash(password, 12);
		const user = await User.create({
			firstName,
			lastName,
			email,
			password: hashedPwd,
		}).save();

		return user;
	}
}
