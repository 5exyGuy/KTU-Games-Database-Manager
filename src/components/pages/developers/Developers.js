import React, { Component } from 'react';
import { Button, PageHeader, Tooltip, Table } from 'antd';
import { IoMdPersonAdd } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import CreateUserForm from './CreateUserForm';
import EditUserForm from './EditUserForm';
import { tables } from '../../../tables';
import socket from '../../../socket';

export default class Users extends Component {

	state = {
		action: 'none',
		devs: []
	};

	componentDidMount() {
		this.selectAll();
	}

	selectAll() {
		socket.emit(tables.developers, 'selectAll', null, (devs) => {
			if (!devs) return;

			const devList = [...devs];
	
			devList.map((user) => {
				return user.key = user.id_kurejai;
			});
	
			this.setState({ devs: [...devList] });
		});
	}

	deleteId(id) {
		if (!id) return;
		socket.emit(tables.developers, 'deleteId', id, (result) => {
			if (!result) return;
			this.selectAll();
		});
	}

	editUser(id) {
		this.setState({ action: 'editUser' }); 	// Pereinam į redagavimo formą
		this.devId = id;									// Prisimenam redaguojamo vartotojo id
	}

	back() {
		this.setState({ action: 'none' });
		this.selectAll();
	}

	render() {
		const actionsPages = {
			addDev: <CreateUserForm back={this.back.bind(this)} />,
			editDev: <EditUserForm back={this.back.bind(this)} id={this.userId} />
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
									<Button onClick={() => this.setState({ action: 'addDev' })} shape='circle'><IoMdPersonAdd /></Button>
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