import React, { Component } from 'react';
import { Button, PageHeader, Tooltip, Table } from 'antd';
import { MdDelete } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import CreateForm from './Create';
import EditForm from './Edit';
import { tables } from '../../../tables';
import socket from '../../../socket';

export default class Games extends Component {

	state = {
		action: 'none',
		games: []
	};

	componentDidMount() {
		this.selectAll();
	}

	selectAll() {
		socket.emit(tables.games, 'selectAll', null, (games) => {
			if (!games) return this.setState({ games: [] });

			const gameList = [...games];
	
			gameList.map((game) => {
				return game.key = game.id_zaidimai;
			});
	
			this.setState({ games: [...gameList] });
		});
	}

	deleteId(id) {
		if (!id) return;
		socket.emit(tables.games, 'deleteId', id, (result) => {
			if (!result) return;
			this.selectAll();
		});
	}

	edit(id) {
		socket.emit(tables.games, 'selectId', id, (result) => {
			if (!result) return;
			result.zanras = [...JSON.parse(result.zanras)];
			result.rezimas = [...JSON.parse(result.rezimas)];
			this.data = result;
			this.setState({ action: 'edit' });
		});
	}

	back() {
		this.setState({ action: 'none' }, () => this.selectAll());
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
							title='Žaidimai'
							subTitle='Parduodami žaidimai'
							extra={[
								<Button onClick={() => this.setState({ action: 'create' })} shape='round'>Pridėti naują žaidimą</Button>
							]}
							style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
						/>
						<Table 
							columns={[
								{ title: 'ID', dataIndex: 'id_zaidimai', defaultSortOrder: 'ascend', sorter: (a, b) => a.id_zaidimai - b.id_zaidimai },
								{ title: 'Pavadinimas', dataIndex: 'pavadinimas' },
								{ title: 'Platforma', dataIndex: 'platforma' },
								{ title: 'Kūrėjas', dataIndex: 'kurejas' },
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
							dataSource={this.state.games}
						/>
					</div>
				: actionsPages[this.state.action]}
			</div>
		);
	}	
    
}