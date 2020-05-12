import React, { Component } from 'react';
import { Button, PageHeader, Tooltip, Table } from 'antd';
import { MdDelete } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import CreateForm from './Create';
import EditForm from './Edit';
import { tables } from '../../../tables';
import socket from '../../../socket';
import moment from 'moment';

export default class Reviews extends Component {

	state = {
		action: 'none',
		reviews: []
	};

	componentDidMount() {
		this.selectAll();
	}

	selectAll() {
		socket.emit(tables.reviews, 'selectAll', null, (reviews) => {
			if (!reviews) return this.setState({ reviews: [] });

			const reviewList = [...reviews];
	
			reviewList.map((review) => {
				review.data = moment(review.data).format('YYYY-MM-DD HH:mm:ss');
				return review.key = review.id_atsiliepimai;
			});
	
			this.setState({ reviews: [...reviewList] });
		});
	}

	deleteId(id) {
		if (!id) return;
		socket.emit(tables.reviews, 'deleteId', id, (result) => {
			if (!result) return;
			this.selectAll();
		});
	}

	edit(id) {
		socket.emit(tables.reviews, 'selectId', id, (result) => {
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
							title='Atsiliepimai'
							subTitle='Vartotojų atsiliepimai apie žaidimus'
							extra={[
								<Button onClick={() => this.setState({ action: 'create' })}>
									Sukurti naują atsiliepimą
								</Button>
							]}
							style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
						/>
						<Table 
							sor
							columns={[
								{ title: 'ID', dataIndex: 'id_atsiliepimai', defaultSortOrder: 'ascend', sorter: (a, b) => a.id_atsiliepimai - b.id_atsiliepimai },
								{ title: 'Žaidimas', dataIndex: 'zaidimas' },
								{ title: 'Vartotojas', dataIndex: 'vartotojas' },
								{ title: 'Įvertinimas', dataIndex: 'ivertinimas' },
								{ title: 'Parašymo data', dataIndex: 'data' },
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
							dataSource={this.state.reviews}
						/>
					</div>
				: actionsPages[this.state.action]}
			</div>
		);
	}	
    
}