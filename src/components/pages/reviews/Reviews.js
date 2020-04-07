import React, { Component } from 'react';
import { Button, PageHeader } from 'antd';

export default class Reviews extends Component {

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='Atsiliepimai'
					subTitle='Atsiliepimai apie žaidimus'
					extra={[
						<Button type='primary'>Atnaujinti</Button>
					]}
				/>
            </div>
        );
    }
    
}