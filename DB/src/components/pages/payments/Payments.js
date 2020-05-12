import React, { Component } from 'react';
import { Button, PageHeader, Tooltip, Table } from 'antd';
import { MdDelete } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import CreateForm from './Create';
import EditForm from './Edit';
import { tables } from '../../../tables';
import socket from '../../../socket';
import moment from 'moment';

export default class Payments extends Component {

	state = {
		action: 'none',
		payments: []
	};

	componentDidMount() {
		this.selectAll();
	}

	selectAll() {
		socket.emit(tables.payments, 'selectAll', null, (payments) => {
			if (!payments) return this.setState({ payments: [] });

			const paymentList = [...payments];
	
			paymentList.map((payment) => {
				payment.data = moment(payment.data).format('YYYY-MM-DD HH:mm:ss');
				return payment.key = payment.id_mokejimai;
			});
	
			this.setState({ payments: [...paymentList] });
		});
	}

	deleteId(id) {
		if (!id) return;
		socket.emit(tables.payments, 'deleteId', id, (result) => {
			if (!result) return;
			this.selectAll();
		});
	}

	edit(id) {
		socket.emit(tables.payments, 'selectId', id, (result) => {
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
							title='Mokėjimai'
							subTitle='Vartotojų atlikti užsakymo mokėjimai'
							extra={[
								<Button onClick={() => this.setState({ action: 'create' })}>
									Sukurti naują mokėjimą
								</Button>
							]}
							style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
						/>
						<Table 
							sor
							columns={[
								{ title: 'ID', dataIndex: 'id_mokejimai', defaultSortOrder: 'ascend', sorter: (a, b) => a.id_mokejimai - b.id_mokejimai },
								{ title: 'Mokėtojas', dataIndex: 'moketojas' },
								{ title: 'Užsakymo numeris', dataIndex: 'uzsakymas' },
								{ title: 'Apmokėjimo data', dataIndex: 'data' },
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
							dataSource={this.state.payments}
						/>
					</div>
				: actionsPages[this.state.action]}
			</div>
		);
	}	
    
}