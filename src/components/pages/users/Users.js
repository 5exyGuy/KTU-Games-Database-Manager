import React, { Component } from 'react';
import { Button, PageHeader, Tooltip, Table } from 'antd';
import { IoMdPersonAdd } from 'react-icons/io';
import { MdDelete, MdDateRange } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import Axios from 'axios';
import CreateUserForm from './CreateUserForm';
import EditUserForm from './EditUserForm';
import SortUsersForm from './SortUsersForm';

export default class Users extends Component {

	state = {
		action: 'none',
		users: []
	};

	componentDidMount() {
		this.updateUsers();
	}

	updateUsers() {
		Axios.get('/', {
			baseURL: 'http://localhost:4000/users'
		}).then((res) => {
			const users = [...res.data];

			users.map((user) => {
				return user.key = user.id_vartotojai;
			});

			this.setState({ users: [...users] });
		});
	}

	handleDelete(id) {
		Axios.delete(`/${id}`, {
			baseURL: 'http://localhost:4000/users'
		}).then(() => {
			this.updateUsers();
		})
		.catch((error) => {
			console.log(error);
		});
	}

	editUser(id) {
		this.setState({ action: 'editUser' }); 	// Pereinam į redagavimo formą
		this.userId = id;						// Prisimenam redaguojamo vartotojo id
	}

	render() {
		const actionsPages = {
			addUser: <CreateUserForm />,
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
												<Button type='link' onClick={() => this.handleDelete(record.key)} shape='circle'><MdDelete /></Button>
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