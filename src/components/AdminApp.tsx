import { Admin, CustomRoutes, Resource, withLifecycleCallbacks } from 'react-admin';
import { Route } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { createContext, useContext } from 'react';
import {
	CreateGuesser,
	defaultI18nProvider,
	EditGuesser,
	ForgotPasswordPage,
	ListGuesser,
	LoginPage,
	SetPasswordPage,
	supabaseAuthProvider,
	supabaseDataProvider,
} from 'ra-supabase';
import { CommandEdit } from '@/components/CommandEdit';
import { GameEdit } from '@/components/GameEdit';
import { GameList } from '@/components/GameList';

const instanceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const apiKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY!;
const supabaseClient = createClient(instanceUrl, apiKey);
const dataProvider = withLifecycleCallbacks(supabaseDataProvider({ instanceUrl, apiKey, supabaseClient }), [
	{
		resource: '*', // Note * support is unreleased so we'll want to wait on that
		beforeSave: async (data) => {
			const newFiles = (
				await Promise.all(
					Object.keys(data)
						.filter((key) => data[key]?.rawFile instanceof File)
						.map((key) => [key, data[key]])
						.map(async ([key, file]) => {
							const { data, error } = await supabaseClient.storage
								.from('botdenevers')
								.upload(`sounds/commands/${file.rawFile.name}`, file.rawFile);
							if (error) throw error;
							const path = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/botdenevers/${data?.path}`;
							return { [key]: path };
						}),
				)
			).reduce((acc, val) => ({ ...acc, ...val }), {});
			return { ...data, ...newFiles };
		},
	},
]);

const authProvider = supabaseAuthProvider(supabaseClient, {
	async getIdentity(user) {
		return user;
	},
});

const AdminApp = () => {
	return (
		<Admin
			dataProvider={dataProvider}
			authProvider={authProvider}
			i18nProvider={defaultI18nProvider}
			loginPage={<LoginPage providers={['twitch']} />}
		>
			<Resource name="command" list={ListGuesser} hasShow={false} edit={CommandEdit} create={CreateGuesser} />
			<Resource name="configuration" list={ListGuesser} hasShow={false} edit={EditGuesser} create={CreateGuesser} />
			<Resource name="game" list={GameList} hasShow={false} edit={GameEdit} create={CreateGuesser} />

			<CustomRoutes noLayout>
				<Route path={SetPasswordPage.path} element={<SetPasswordPage />} />
				<Route path={ForgotPasswordPage.path} element={<ForgotPasswordPage />} />
			</CustomRoutes>
		</Admin>
	);
};
export default AdminApp;
