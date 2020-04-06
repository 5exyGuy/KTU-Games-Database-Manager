import React, { Component } from 'react';
import { Button, PageHeader, Tooltip } from 'antd';
import { IoMdPersonAdd } from 'react-icons/io';

export default class Users extends Component {

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='Varotojai'
					subTitle='Užregistruoti parduotuvės vartotojai'
					extra={[
						<Tooltip title='Pridėti naują vartotoją'>
							<Button shape='circle'><IoMdPersonAdd /></Button>
						</Tooltip>,
						<Button type='primary'>Atnaujinti</Button>
					]}
				/>
            </div>
        );
    }
    
}