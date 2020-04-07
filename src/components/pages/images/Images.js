import React, { Component } from 'react';
import { Button, PageHeader } from 'antd';

export default class Images extends Component {

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='Nuotraukos'
					subTitle='Žaidimų nuotraukos'
					extra={[
						<Button type='primary'>Atnaujinti</Button>
					]}
				/>
            </div>
        );
    }
    
}