import {
	BooleanField,
	BooleanInput,
	Datagrid,
	DatagridBody,
	DatagridBodyProps,
	DatagridRowProps,
	DateInput,
	List,
	NumberField,
	NumberInput,
	TextField,
	TextInput,
	WrapperField,
	FieldProps,
	useRecordContext,
} from 'react-admin';
import { BaseTextFieldProps, Checkbox, TableCell, TableRow, Tooltip } from '@mui/material';

import { useQuery } from '@tanstack/react-query';
import { useHttpClient } from '@/lib/HttpClient/useHttpClient';
import { IGDBGame } from '@/types/IGDBGame';
import { TwitchGame } from '@/types/TwitchGame';
import { Children, isValidElement } from 'react';

const IGDBField = (props: FieldProps & { width: number }) => {
	const record = useRecordContext(props);
	const { client } = useHttpClient();

	console.log(`record?.igdb_id: `, record?.igdb_id);
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

const MyDatagridBody = (props: DatagridBodyProps) => <DatagridBody {...props} row={<MyDatagridRow />} />;

export const GameList = () => {
	const filters = [
		<TextInput source="id" key="id" />,
		<DateInput source="created_at" key="created_at" />,
		<DateInput source="updated_at" key="updated_at" />,
		<NumberInput source="igdb_id" key="igdb_id" />,
		<TextInput source="description" key="description" />,
		<BooleanInput source="active" key="active" />,
		<TextInput source="youtube_url" key="youtube_url" />,
		<NumberInput source="twitch_id" key="twitch_id" />,
		<TextInput source="status" key="status" />,
	];

	return (
		<List filters={filters}>
			<Datagrid body={<MyDatagridBody />}>
				<TextField source="id" width={100} />
				<BooleanField source="active" width={50} />
				<TextField source="status" width={100} />
				<IGDBField source="igdb_id" width={200} />
				<TwitchField source="twitch_id" width={200} />
				<TextField source="description" />
				<TextField source="youtube_url" />
			</Datagrid>
		</List>
	);
};
