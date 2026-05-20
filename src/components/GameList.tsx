import {
	BooleanField,
	BooleanInput,
	Datagrid,
	DatagridBody,
	DatagridBodyProps,
	DatagridRowProps,
	DateInput,
	EditButton,
	FieldProps,
	List,
	NumberInput,
	SelectInput,
	TextField,
	TextInput,
	useRecordContext,
} from 'react-admin';
import { useAPISchema } from 'ra-supabase';
import { Checkbox, TableCell, TableRow, Tooltip } from '@mui/material';

import { useQuery } from '@tanstack/react-query';
import { useHttpClient } from '@/lib/HttpClient/useHttpClient';
import { IGDBGame } from '@/types/IGDBGame';
import { TwitchGame } from '@/types/TwitchGame';
import { Children, isValidElement } from 'react';

const IGDBField = (props: FieldProps & { width: number }) => {
	const record = useRecordContext(props);
	const { client } = useHttpClient();

	const { data, error, isLoading } = useQuery({
		queryKey: ['/api/twitch', record?.igdb_id],
		queryFn: () => client.get<IGDBGame>(`/api/igdb/${record?.igdb_id}`),
		enabled: !!record?.igdb_id,
		staleTime: Infinity,
	});

	if (error) {
		console.error(`error: `, error);
	}
	return isLoading ? (
		`${record?.igdb_id} loading...`
	) : data ? (
		data?.cover.url ? (
			<Tooltip title={<img src={data?.cover.url} width={data.cover.width} alt="Game cover" />} placement="left">
				<span>{`${data.name} (#${data.id})`}</span>
			</Tooltip>
		) : (
			`${data.name} (#${data.id})`
		)
	) : null;
};

const TwitchField = (props: FieldProps & { width: number }) => {
	const record = useRecordContext(props);
	const { client } = useHttpClient();

	const { data, error, isLoading } = useQuery({
		queryKey: ['/api/twitch/game', record?.twitch_id],
		queryFn: () => client.get<TwitchGame>(`/api/twitch/game/${record?.twitch_id}`),
		enabled: !!record?.twitch_id,
		staleTime: Infinity,
	});

	if (error) {
		console.error(`error: `, error);
	}

	return isLoading ? (
		`${record?.twitch_id} loading...`
	) : data ? (
		data?.box_art_url ? (
			<Tooltip title={<img src={data?.box_art_url} />} placement="top">
				<span>{`${data.name} (#${data.id})`}</span>
			</Tooltip>
		) : (
			`${data.name} (#${data.id})`
		)
	) : null;
};

const MyDatagridRow = ({ onToggleItem, children, selected, selectable }: DatagridRowProps) => {
	const record = useRecordContext();
	return record ? (
		<TableRow>
			{/* first column: selection checkbox */}
			<TableCell padding="none">
				{selectable && (
					<Checkbox
						checked={selected}
						onClick={(event) => {
							if (onToggleItem) {
								onToggleItem(record.id, event);
							}
						}}
					/>
				)}
			</TableCell>
			{/* data columns based on children */}
			{Children.map(children, (field) =>
				isValidElement<FieldProps>(field) ? (
					<TableCell
						key={`${record.id}-${field.props.source}`}
						sx={{
							// @ts-ignore
							width: field.props.width || 'auto',
						}}
					>
						{field}
					</TableCell>
				) : null,
			)}
		</TableRow>
	) : null;
};

const MyDataGripBody = (props: DatagridBodyProps) => <DatagridBody {...props} row={<MyDatagridRow />} />;

export const GameList = () => {
	const { data: schema } = useAPISchema();
	const statusChoices = (schema?.definitions?.game?.properties?.status?.enum ?? []).map((v: string) => ({
		id: v,
		name: v,
	}));

	const filters = [
		<TextInput source="id" key="id" />,
		<NumberInput source="igdb_id" key="igdb_id" />,
		<NumberInput source="twitch_id" key="twitch_id" />,
		<TextInput source="description@ilike" key="description" label="Description" />,
		<BooleanInput source="active" key="active" />,
		<BooleanInput source="off" key="off" />,
		<SelectInput source="status" key="status" choices={statusChoices} />,
	];

	return (
		<List filters={filters} perPage={50}>
			<Datagrid body={<MyDataGripBody />}>
				<TextField source="id" width={100} />
				<BooleanField source="active" width={50} />
				<TextField source="status" width={100} />
				<IGDBField source="igdb_id" width={200} />
				<TwitchField source="twitch_id" width={200} />
				<TextField source="description" />
				<TextField source="youtube_url" />
				<EditButton />
			</Datagrid>
		</List>
	);
};
