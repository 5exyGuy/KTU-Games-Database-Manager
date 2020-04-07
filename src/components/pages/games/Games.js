import React, { Component } from 'react';
import { Button, PageHeader } from 'antd';

export default class Games extends Component {

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='Žaidimai'
					subTitle='Užsakyti žaidimai'
					extra={[
						<Button type='primary'>Atnaujinti</Button>
					]}
				/>
            </div>
        );
    }
    
}