import React, { Component } from 'react';
import { Button, PageHeader, Tooltip } from 'antd';
import { GoPackage } from 'react-icons/go';

export default class Orders extends Component {

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='Užsakymai'
					subTitle='Visi užsakymai'
					extra={[
						<Tooltip title='Pridėti naują užsakymą'>
							<Button shape='circle'><GoPackage /></Button>
						</Tooltip>,
						<Button type='primary'>Atnaujinti</Button>
					]}
				/>
            </div>
        );
    }
    
}