import React, { Component } from 'react';
import { Button, PageHeader, Descriptions, Table, Tag } from 'antd';

const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: tags => (
        <span>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a style={{ marginRight: 16 }}>Invite {record.name}</a>
          <a>Delete</a>
        </span>
      ),
    },
  ];
  
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];

export default class Users extends Component {

	render() {
        return (
            <div>
                <PageHeader
					ghost={false}
					title="Title"
					subTitle="This is a subtitle"
					extra={[
						<Button key="3">Operation</Button>,
						<Button key="2">Operation</Button>,
						<Button key="1" type="primary">
						Primary
						</Button>,
					]}
					>
					<Descriptions size="small" column={3}>
						<Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
						<Descriptions.Item label="Creation Time">2017-01-10</Descriptions.Item>
						<Descriptions.Item label="Effective Time">2017-10-10</Descriptions.Item>
						<Descriptions.Item label="Remarks">
						Gonghu Road, Xihu District, Hangzhou, Zhejiang, China
						</Descriptions.Item>
					</Descriptions>
                </PageHeader>
                <Table si columns={columns} dataSource={data} />
            </div>
        );
    }
    
}