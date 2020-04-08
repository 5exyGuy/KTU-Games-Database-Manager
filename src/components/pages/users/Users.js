import React, { Component } from 'react';
import { Button, PageHeader, Tooltip, Table } from 'antd';
import { IoMdPersonAdd } from 'react-icons/io';
import { MdDelete, MdDateRange } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import CreateUserForm from './CreateUserForm';
import EditUserForm from './EditUserForm';
import SortUsersForm from './SortUsersForm';
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
			if (!users) return;

			const userList = [...users];
	
			userList.map((user) => {
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

	editUser(id) {
		this.setState({ action: 'editUser' }); 	// Pereinam į redagavimo formą
		this.userId = id;						// Prisimenam redaguojamo vartotojo id
	}

	back() {
		this.setState({ action: 'none' });
		this.selectAll();
	}

	render() {
		const actionsPages = {
			addUser: <CreateUserForm back={this.back.bind(this)} />,
			editUser: <EditUserForm id={this.userId} />,
			sortUsers: <SortUsersForm />
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
								<Tooltip key='addUser' title='Pridėti naują vartotoją'>
									<Button onClick={() => this.setState({ action: 'addUser' })} shape='circle'><IoMdPersonAdd /></Button>
								</Tooltip>,
								<Tooltip key='sortByDate' title='Išrinkti pagal datą'>
									<Button onClick={() => this.setState({ action: 'sortUsers' })} shape='circle'><MdDateRange /></Button>
								</Tooltip>
							]}
							style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
						/>
						<Table 
							columns={[
								{ title: 'ID', dataIndex: 'id_vartotojai' },
								{ title: 'Slapyvardis', dataIndex: 'slapyvardis' },
								{ title: 'El. paštas', dataIndex: 'el_pastas' },
								{ title: 'Balansas', dataIndex: 'balansas' },
								{ title: 'Aktyvuotas', dataIndex: 'aktyvuotas' },
								{
									title: 'Veiksmai',
									render: (text, record) => (
										<span>
											<Tooltip key='deleteUser' title='Ištrinti vartotoją'>
												<Button type='link' onClick={() => this.deleteId(record.key)} shape='circle'><MdDelete /></Button>
											</Tooltip>
											<Tooltip key='editUser' title='Redaguoti vartotoją'>
												<Button type='link' onClick={() => this.editUser(record.key)} shape='circle'><FaRegEdit /></Button>
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