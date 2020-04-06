import React, { Component } from 'react';
import { Button, PageHeader } from 'antd';

export default class Transfers extends Component {

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='Pervedimai'
					subTitle='Atlikti vartotojų pervedimai'
					extra={[
						<Button type='primary'>Atnaujinti</Button>
					]}
				/>
            </div>
        );
    }
    
}