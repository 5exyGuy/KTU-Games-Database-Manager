import React, { Component } from 'react';
import { Button, PageHeader } from 'antd';

export default class Developers extends Component {

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='Kūrėjai'
					subTitle='Visi kūrėjai'
					extra={[
						<Button type='primary'>Atnaujinti</Button>
					]}
				/>
            </div>
        );
    }
    
}