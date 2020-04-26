import React, { Component } from 'react';
import { Button, PageHeader, Tooltip, Table } from 'antd';
import { MdDelete } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import CreateForm from './Create';
import EditForm from './Edit';
import { tables } from '../../../tables';
import socket from '../../../socket';
import moment from 'moment';

export default class Groups extends Component {

	state = {
		action: 'none',
		groups: []
	};

	componentDidMount() {
		this.selectAll();
	}

	selectAll() {
		socket.emit(tables.groups, 'selectAll', null, (groups) => {
			if (!groups) return this.setState({ groups: [] });

			const groupList = [...groups];
	
			groupList.map((group) => {
				group.ikurimo_data = moment(group.ikurimo_data).format('YYYY-MM-DD HH:mm:ss');
				return group.key = group.id_grupes;
			});
	
			this.setState({ groups: [...groupList] });
		});
	}

	deleteId(id) {
		if (!id) return;
		socket.emit(tables.groups, 'deleteId', id, (result) => {
			if (!result) return;
			this.selectAll();
		});
	}

	edit(id) {
		socket.emit(tables.groups, 'selectId', id, (result) => {
			if (!result) return;
			this.data = result;
			this.setState({ action: 'edit' });
		});
	}

	back() {
		this.setState({ action: 'none' });
		this.selectAll();
	}

	render() {
		const actionsPages = {
			create: <CreateForm back={this.back.bind(this)} />,
			edit: <EditForm back={this.back.bind(this)} data={this.data} />
		};

		return (
			<div>
				{this.state.action === 'none' ? 
					<div>
						<PageHeader
							ghost={false}
							title='Grupės'
							subTitle='Vartotojų sukurtos grupės'
							extra={[
								<Button onClick={() => this.setState({ action: 'create' })} shape='round'>Sukurti grupę</Button>
							]}
							style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
						/>
						<Table 
							sor
							columns={[
								{ title: 'ID', dataIndex: 'id_grupes', defaultSortOrder: 'ascend', sorter: (a, b) => a.id_grupes - b.id_grupes },
								{ title: 'Pavadinimas', dataIndex: 'pavadinimas' },
								{
									title: 'Veiksmai',
									render: (text, record) => (
										<span>
											<Tooltip key='deleteId' title='Ištrinti'>
												<Button type='link' onClick={() => this.deleteId(record.key)} shape='circle'><MdDelete /></Button>
											</Tooltip>
											<Tooltip key='edit' title='Redaguoti'>
												<Button type='link' onClick={() => this.edit(record.key)} shape='circle'><FaRegEdit /></Button>
											</Tooltip>
										</span>
									)
								}
							]}
							dataSource={this.state.groups}
						/>
					</div>
				: actionsPages[this.state.action]}
			</div>
		);
	}	
    
}