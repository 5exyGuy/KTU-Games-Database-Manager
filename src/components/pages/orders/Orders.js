import React, { Component } from 'react';
import { Button, PageHeader, Tooltip, Table } from 'antd';
import { MdDelete } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import CreateForm from './Create';
import EditForm from './Edit';
import { tables } from '../../../tables';
import socket from '../../../socket';
import moment from 'moment';

export default class Orders extends Component {

	state = {
		action: 'none',
		orders: []
	};

	componentDidMount() {
		this.selectAll();
	}

	selectAll() {
		socket.emit(tables.orders, 'selectTable', null, (orders) => {
			if (!orders) return this.setState({ orders: [] });

			const orderList = [...orders];

			orderList.map((order) => {
				order.data = moment(order.data).format('YYYY-MM-DD HH:mm:ss');
				return order.key = order.id_uzsakymai;
			});
	
			this.setState({ orders: [...orderList] });
		});
	}

	deleteId(id) {
		if (!id) return;
		socket.emit(tables.orders, 'deleteId', id, (result) => {
			if (!result) return;
			this.selectAll();
		});
	}

	edit(id) {
		socket.emit(tables.orders, 'selectId', id, (result) => {
			if (!result) return;

			this.data = result;
			this.setState({ action: 'edit' }); 
		});
	}

	create() {
		this.setState({ action: 'create' });
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
							title='Užsakymai'
							subTitle='Vartotojų užsakymai'
							extra={[
								<Button onClick={this.create.bind(this)}>Sudaryti naują užsakymą</Button>
							]}
							style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
						/>
						<Table 
							columns={[
								{ title: 'ID', dataIndex: 'id_uzsakymai', defaultSortOrder: 'ascend', sorter: (a, b) => a.id_uzsakymai - b.id_uzsakymai },
								{ title: 'Užsakovas', dataIndex: 'uzsakovas' },
								{ title: 'Data', dataIndex: 'data' },
								{ title: 'Būsena', dataIndex: 'busena' },
								{ title: 'Kiekis', dataIndex: 'kiekis' },
								{ title: 'Kaina', dataIndex: 'kaina' },
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
							dataSource={this.state.orders}
						/>
					</div>
				: actionsPages[this.state.action]}
			</div>
		);
	}	
    
}