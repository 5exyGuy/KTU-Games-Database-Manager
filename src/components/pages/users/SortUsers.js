import React, { Component } from 'react';
import { PageHeader } from 'antd';

export default class SortUsers extends Component {

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='Varotojai'
					subTitle='Užregistruoti parduotuvės vartotojai'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
				/>

            </div>
        );
    }
    
}