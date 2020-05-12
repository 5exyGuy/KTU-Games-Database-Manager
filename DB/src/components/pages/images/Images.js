import React, { Component } from 'react';
import { Button, PageHeader, Tooltip, Table, Popover } from 'antd';
import { MdDelete } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import CreateForm from './Create';
import EditForm from './Edit';
import { tables } from '../../../tables';
import socket from '../../../socket';

export default class Groups extends Component {

	state = {
		action: 'none',
		images: []
	};

	componentDidMount() {
		this.selectAll();
	}

	selectAll() {
		socket.emit(tables.images, 'selectAll', null, (images) => {
			if (!images) return this.setState({ images: [] });

			const imageList = [...images];
	
			imageList.map((image) => {
				return image.key = image.id_nuotraukos;
			});
	
			this.setState({ images: [...imageList] });
		});
	}

	deleteId(id) {
		if (!id) return;
		socket.emit(tables.images, 'deleteId', id, (result) => {
			if (!result) return;
			this.selectAll();
		});
	}

	edit(id) {
		socket.emit(tables.images, 'selectId', id, (result) => {
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
							title='Nuotraukos'
							subTitle='Žaidimų nuotraukos'
							extra={[
								<Button onClick={() => this.setState({ action: 'create' })}>
									Sukurti naujas nuotraukas
								</Button>
							]}
							style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
						/>
						<Table 

							columns={[
								{ title: 'ID', dataIndex: 'id_nuotraukos', defaultSortOrder: 'ascend', sorter: (a, b) => a.id_nuotraukos - b.id_nuotraukos },
								{ title: 'Žaidimas', dataIndex: 'zaidimas' },
								{ 
									title: 'Nuotrauka', 
									dataIndex: 'nuoroda',
									render: (url) => (
										<Popover content={<img src={url} height='200px' alt='nuoroda' />}>
											{url}
										</Popover>
									)
								},
								{ title: 'Sukūrė', dataIndex: 'ikurejas' },
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
							dataSource={this.state.images}
						/>
					</div>
				: actionsPages[this.state.action]}
			</div>
		);
	}	
    
}