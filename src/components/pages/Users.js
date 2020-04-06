import React, { Component } from 'react';
import { Button, PageHeader, Tooltip, Table } from 'antd';
import { IoMdPersonAdd } from 'react-icons/io';
import { MdDelete, MdDateRange } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import Axios from 'axios';

export default class Users extends Component {

	state = {
		users: []
	};

	componentDidMount() {
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
		}).then((res) => {
			let users = [...this.state.users];
			users = users.filter((user) => user.id_vartotojai !== id);
			this.setState({ users: [...users] });
		});
	}

	editUser(id) {
		
	}

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='Varotojai'
					subTitle='Užregistruoti parduotuvės vartotojai'
					extra={[
						<Tooltip key='addNewUser' title='Pridėti naują vartotoją'>
							<Button shape='circle'><IoMdPersonAdd /></Button>
						</Tooltip>,
						<Tooltip key='sortByDate' title='Išrinkti pagal datą'>
							<Button shape='circle'><MdDateRange /></Button>
						</Tooltip>
					]}
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
				/>
				<Table 
					columns={[
						{
							title: 'ID',
							dataIndex: 'id_vartotojai'
						},
						{
							title: 'Slapyvardis',
							dataIndex: 'slapyvardis'
						},
						{
							title: 'El. paštas',
							dataIndex: 'el_pastas'
						},
						{
							title: 'Balansas',
							dataIndex: 'balansas'
						},
						{
							title: 'Aktyvuotas',
							dataIndex: 'aktyvuotas'
						},
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
        );
    }
    
}