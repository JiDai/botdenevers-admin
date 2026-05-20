import {
	BooleanField,
	BooleanInput,
	Datagrid,
	DatagridBody,
	DatagridBodyProps,
	DatagridRowProps,
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
import { Checkbox, TableCell, TableRow } from '@mui/material';

import { Children, isValidElement } from 'react';
import { AudioPlayer } from '@/components/AudioPlayer';

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

export const CommandList = () => {
	const { data: schema } = useAPISchema();
	const statusChoices = (schema?.definitions?.game?.properties?.status?.enum ?? []).map((v: string) => ({
		id: v,
		name: v,
	}));

	const filters = [
		<TextInput source="id" key="id" />,
		<NumberInput source="igdb_id" key="igdb_id" />,
		<NumberInput source="twitch_id" key="twitch_id" />,
		<TextInput source="name@ilike" key="name" label="Name" />,
		<TextInput source="message@ilike" key="message" label="Message" />,
		<BooleanInput source="active" key="active" />,
		<BooleanInput source="off" key="off" />,
		<SelectInput source="status" key="status" choices={statusChoices} />,
	];

	return (
		<List filters={filters} perPage={50}>
			<Datagrid body={<MyDataGripBody />}>
				<TextField source="id" width={100} />
				<BooleanField source="active" width={50} />
				<TextField source="name" width={100} />
				<TextField source="message" sx={{ display: 'block', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} />
				<TextField source="module" />
				<TextField source="permission" />
				<TextField source="type" />
				<AudioPlayer source="file_url" title="title" />

				<EditButton />
			</Datagrid>
		</List>
	);
};
