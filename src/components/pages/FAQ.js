import React, { Component } from 'react';
import { Button, PageHeader } from 'antd';

export default class FAQ extends Component {

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='DUK'
					subTitle='Dažniausiai užduodami klausimai'
					extra={[
						<Button type='primary'>Atnaujinti</Button>
					]}
				/>
            </div>
        );
    }
    
}