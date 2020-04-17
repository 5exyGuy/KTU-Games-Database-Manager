import React, { Component } from 'react';
import { Button, PageHeader, Tooltip, Table } from 'antd';
import { MdDelete } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import CreateForm from './Create';
import EditForm from './Edit';
import { tables } from '../../../tables';
import socket from '../../../socket';

export default class Publishers extends Component {

	state = {
		action: 'none',
		pubs: []
	};

	componentDidMount() {
		this.selectAll();
	}

	selectAll() {
		socket.emit(tables.publishers, 'selectAll', null, (pubs) => {
			if (!pubs) return this.setState({ pubs: [] });

			const pubList = [...pubs];
	
			pubList.map((dev) => {
				return dev.key = dev.id_leidejai;
			});
	
			this.setState({ pubs: [...pubList] });
		});
	}

	deleteId(id) {
		if (!id) return;
		socket.emit(tables.publishers, 'deleteId', id, (result) => {
			if (!result) return;
			this.selectAll();
		});
	}

	edit(id) {
		socket.emit(tables.publishers, 'selectId', id, (result) => {
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
							title='Leidėjai'
							subTitle='Žaidimų leidėjai'
							extra={[
								<Button onClick={() => this.setState({ action: 'create' })} shape='round'>Pridėti naują kurėją</Button>
							]}
							style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
						/>
						<Table 
							columns={[
								{ title: 'ID', dataIndex: 'id_leidejai', defaultSortOrder: 'ascend', sorter: (a, b) => a.id_leidejai - b.id_leidejai },
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
							dataSource={this.state.pubs}
						/>
					</div>
				: actionsPages[this.state.action]}
			</div>
		);
	}	
    
}