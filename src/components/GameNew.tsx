import { AutocompleteInput, BooleanInput, Create, required, SelectInput, SimpleForm, TextInput } from 'react-admin';
import { useQuery } from '@tanstack/react-query';
import { useHttpClient } from '@/lib/HttpClient/useHttpClient';
import { useState } from 'react';
import { IGDBGame } from '@/types/IGDBGame';
import { TwitchGame } from '@/types/TwitchGame';
import { keepPreviousData } from '@tanstack/react-query';

const TwitchCategoryInput = () => {
	const { client } = useHttpClient();
	const [searchQuery, setSearchQuery] = useState('');

	const { data, isLoading } = useQuery<TwitchGame[]>({
		queryKey: ['/api/twitch/search-categories', searchQuery],
		queryFn: () => client.get(`/api/twitch/search-categories?query=${searchQuery}`),
		placeholderData: keepPreviousData,
		enabled: !!searchQuery,
	});

	return (
		<AutocompleteInput
			debounce={200}
			source="twitch_id"
			isPending={isLoading}
			choices={data || []}
			onInputChange={(e) => {
				const target = e?.target as HTMLInputElement | null;
				if (target?.value) {
					setSearchQuery(target.value);
				}
			}}
			optionText="name"
			optionValue="id"
		/>
	);
};

const IGDBInput = () => {
	const { client } = useHttpClient();
	const [searchQuery, setSearchQuery] = useState('');

	const { data, isLoading } = useQuery<IGDBGame[]>({
		queryKey: ['/api/igdb/search', searchQuery],
		queryFn: () => client.get(`/api/igdb/search?query=${searchQuery}`),
		placeholderData: keepPreviousData,
		enabled: !!searchQuery,
	});

	return (
		<AutocompleteInput
			debounce={200}
			source="igdb_id"
			isPending={isLoading}
			choices={data || []}
			onInputChange={(e) => {
				const target = e?.target as HTMLInputElement | null;
				if (target?.value) {
					setSearchQuery(target.value);
				}
			}}
			optionText="name"
			optionValue="id"
		/>
	);
};

export const GameNew = () => {
	return (
		<Create>
			<SimpleForm>
				<TextInput source="description" label="Description" multiline rows={4} />
				<BooleanInput source="active" label="Active" defaultValue={true} />
				<TextInput source="youtube_url" label="YouTube URL" />
				<TwitchCategoryInput />
				<IGDBInput />
				<SelectInput
					source="status"
					label="Status"
					choices={[
						{ id: 'todo', name: 'Todo' },
						{ id: 'playing', name: 'Playing' },
						{ id: 'finished', name: 'Done' },
						{ id: 'paused', name: 'Paused' },
						{ id: 'abandoned', name: 'Abandoned' },
					]}
					validate={required()}
					defaultValue="todo"
				/>
			</SimpleForm>
		</Create>
	);
};
