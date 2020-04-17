import React, { Component } from 'react';
import { Button, PageHeader, Tooltip, Table } from 'antd';
import { MdDelete } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import CreateForm from './Create';
import EditForm from './Edit';
import { tables } from '../../../tables';
import socket from '../../../socket';

export default class FAQ extends Component {

	state = {
		action: 'none',
		faqs: []
	};

	componentDidMount() {
		this.selectAll();
	}

	selectAll() {
		socket.emit(tables.faq, 'selectAll', null, (faqs) => {
			if (!faqs) return this.setState({ faqs: [] });

			const faqList = [...faqs];
	
			faqList.map((faq) => {
				return faq.key = faq.id_duk;
			});
	
			this.setState({ faqs: [...faqList] });
		});
	}

	deleteId(id) {
		if (!id) return;
		socket.emit(tables.faq, 'deleteId', id, (result) => {
			if (!result) return;
			this.selectAll();
		});
	}

	edit(id) {
		socket.emit(tables.faq, 'selectId', id, (result) => {
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
							title='DUK'
							subTitle='Dažniausiai užduodami klausimai'
							extra={[
								<Button onClick={() => this.setState({ action: 'create' })} shape='round'>Sukurti naują klausimą</Button>
							]}
							style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
						/>
						<Table 
							sor
							columns={[
								{ title: 'ID', dataIndex: 'id_duk', defaultSortOrder: 'ascend', sorter: (a, b) => a.id_duk - b.id_duk },
								{ title: 'Klausimas', dataIndex: 'klausimas' },
								{ title: 'Atsakymas', dataIndex: 'atsakymas' },
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
							dataSource={this.state.faqs}
						/>
					</div>
				: actionsPages[this.state.action]}
			</div>
		);
	}	
    
}