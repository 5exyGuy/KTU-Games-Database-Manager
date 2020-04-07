import React, { Component } from 'react';
import { Button, PageHeader } from 'antd';

export default class Publishers extends Component {

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='Leidėjai'
					subTitle='Visi leidėjai'
					extra={[
						<Button type='primary'>Atnaujinti</Button>
					]}
				/>
            </div>
        );
    }
    
}