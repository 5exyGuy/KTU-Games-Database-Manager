import React, { Component } from 'react';
import { Button, PageHeader, Tooltip, Table } from 'antd';
import { MdDelete } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import CreateForm from './Create';
import EditForm from './Edit';
import { tables } from '../../../tables';
import socket from '../../../socket';

export default class Developers extends Component {

	state = {
		action: 'none',
		devs: []
	};

	componentDidMount() {
		this.selectAll();
	}

	selectAll() {
		socket.emit(tables.developers, 'selectAll', null, (devs) => {
			if (!devs) return this.setState({ devs: [] });

			const devList = [...devs];
	
			devList.map((dev) => {
				return dev.key = dev.id_kurejai;
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

	edit(id) {
		socket.emit(tables.developers, 'selectId', id, (result) => {
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
							title='Kūrėjai'
							subTitle='Žaidimų kūrėjai'
							extra={[
								<Button onClick={() => this.setState({ action: 'create' })} shape='round'>Pridėti naują kurėją</Button>
							]}
							style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
						/>
						<Table 
							columns={[
								{ title: 'ID', dataIndex: 'id_kurejai', defaultSortOrder: 'ascend', sorter: (a, b) => a.id_kurejai - b.id_kurejai },
								{ title: 'Pavadinimas', dataIndex: 'pavadinimas' },
                                { title: 'Logotipas', dataIndex: 'logotipas' },
                                { title: 'Hipersaitas', dataIndex: 'hipersaitas' },
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
							dataSource={this.state.devs}
						/>
					</div>
				: actionsPages[this.state.action]}
			</div>
		);
	}	
    
}