import React, { Component } from 'react';
import { Button, PageHeader, Tooltip, Table } from 'antd';
import { MdDelete } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import CreateForm from './Create';
import EditForm from './Edit';
import { tables } from '../../../tables';
import socket from '../../../socket';

export default class Users extends Component {

	state = {
		action: 'none',
		users: []
	};

	componentDidMount() {
		this.selectAll();
	}

	selectAll() {
		socket.emit(tables.users, 'selectAll', null, (users) => {
			if (!users) return this.setState({ users: [] });

			const userList = [...users];
	
			userList.map((user) => {
				user.aktyvuotas ? user.aktyvuotas = 'Taip' : user.aktyvuotas = 'Ne';
				return user.key = user.id_vartotojai;
			});
	
			this.setState({ users: [...userList] });
		});
	}

	deleteId(id) {
		if (!id) return;
		socket.emit(tables.users, 'deleteId', id, (result) => {
			if (!result) return;
			this.selectAll();
		});
	}

	edit(id) {
		socket.emit(tables.users, 'selectId', id, (result) => {
			if (!result) return;

			this.data = result;
			this.setState({ action: 'edit' }); 	// Pereinam į redagavimo formą
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
							title='Varotojai'
							subTitle='Užregistruoti internetinės parduotuvės vartotojai'
							extra={[
								<Button onClick={() => this.setState({ action: 'create' })} shape='round'>Pridėti naują vartotoją</Button>
							]}
							style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
						/>
						<Table 
							sor
							columns={[
								{ title: 'ID', dataIndex: 'id_vartotojai', defaultSortOrder: 'ascend', sorter: (a, b) => a.id_vartotojai - b.id_vartotojai },
								{ title: 'Slapyvardis', dataIndex: 'slapyvardis' },
								{ title: 'El. paštas', dataIndex: 'el_pastas' },
								{ title: 'Balansas', dataIndex: 'balansas' },
								{ title: 'Aktyvuotas', dataIndex: 'aktyvuotas' },
								{
									title: 'Veiksmai',
									render: (text, record) => (
										<span>
											<Tooltip key='deleteUser' title='Ištrinti'>
												<Button type='link' onClick={() => this.deleteId(record.key)} shape='circle'><MdDelete /></Button>
											</Tooltip>
											<Tooltip key='editUser' title='Redaguoti'>
												<Button type='link' onClick={() => this.edit(record.key)} shape='circle'><FaRegEdit /></Button>
											</Tooltip>
										</span>
									)
								}
							]}
							dataSource={this.state.users}
						/>
					</div>
				: actionsPages[this.state.action]}
			</div>
		);
	}	
    
}