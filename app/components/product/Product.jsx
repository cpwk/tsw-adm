import React from 'react'
import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import Utils from '../../common/Utils.jsx'
import {Button, Card, Dropdown, Icon, Menu, message, Modal, Table, Tag, Col, Input, Row} from 'antd';
import BreadcrumbCustom from '../common/BreadcrumbCustom'
import CTYPE from '../../common/CTYPE'
import '../../assets/css/common/common-list.less'
import ProductUtils from "./ProductUtils";

const InputSearch = Input.Search;

export default class Product extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            q: '',
            key: 'name',
            list: [],
            loading: false,
            selectedRowKeys: [],
            pagination: {pageSize: CTYPE.pagination.pageSize, current: ProductUtils.getCurrentPage(), total: 0},
            sorts: []
        };
    }

    componentDidMount() {
        this.loadData();
    }

    getQuery = () => {
        let {search, q, key} = this.state;
        let query = {};
        if (search === true) {
            if (U.str.isNotEmpty(q)) {
                if (key === 'name') {
                    query = {name: q};
                }
            }
        }
        return query;
    };

    loadData = () => {
        let {pagination = {}} = this.state;

        this.setState({loading: true});
        Utils.nProgress.start();
        App.api('adm/product/products', {
            productQo: JSON.stringify({
                ...this.getQuery(),
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((product) => {
                let {content = []} = product;
                let pagination = Utils.pager.convert2Pagination(product);

                Utils.nProgress.done();
                console.log(product);
                this.setState({
                    list: content,
                    pagination,
                    loading: false
                });
            }
        );
        App.api('adm/sort/sorts', {sortQo: JSON.stringify({})}).then((sorts) => {
                Utils.nProgress.done();
                console.log(sorts);
                this.setState({
                    sorts, loading: false
                });
                ProductUtils.setCurrentPage(pagination.current);
            }
        );
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    remove = (id, index) => {
        let _this = this;
        Modal.confirm({
            title: `确认删除操作?`,
            onOk() {
                App.api('adm/product/remove', {id}).then(() => {
                    message.success('删除成功');
                    let list = _this.state.list;
                    _this.setState({
                        list: U.array.remove(list, index)
                    })
                })
            },
            onCancel() {
            },
        });
    };

    edit = (product) => {
        ProductUtils.edit(product, this.loadData);
    };

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            this.setState({selectedRowKeys})
        },
    };

    putSome = () => {
        let {selectedRowKeys} = this.state;
        App.api(`adm/product/putsome`, {ids: JSON.stringify(selectedRowKeys)}).then((v) => {
            if (v == null) {
                message.success("批量上架成功！");
                this.loadData();
            }
        });
    };

    outSome = () => {
        let {selectedRowKeys} = this.state;
        App.api(`adm/product/outsome`, {ids: JSON.stringify(selectedRowKeys)}).then((v) => {
            if (v == null) {
                message.success("批量下架成功！");
                this.loadData();
            }
        });
    };

    removesome = () => {
        let {selectedRowKeys} = this.state;
        selectedRowKeys.map((id) => {
            App.api(`adm/product/remove`, {id})
        });
        message.success("批量删除成功！");
        this.loadData();
    };

    render() {

        let {status, list = [], pagination = {}, loading, sorts = [], q} = this.state;
        let imgs = [];

        list.map((item) => {
            imgs.push(item.img);
        });

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.info_product.txt}/>

            <Card bordered={false}>

                <Row>
                    <Col span={12}>

                        <Button type="primary" icon="file-add" onClick={() => {
                            this.edit({id: 0, status})
                        }}>添加商品</Button>

                        <Button type="primary" icon="edit" onClick={() => {
                            this.putSome();
                        }}>批量上架</Button>

                        <Button type="primary" icon="edit" onClick={() => {
                            this.outSome();
                        }}>批量下架</Button>

                        <Button type="primary" icon="delete" onClick={() => {
                            this.removesome();
                        }}>批量删除</Button>

                    </Col>
                    <Col span={12} style={{textAlign: 'right'}}>

                        <InputSearch
                            placeholder="输入商品名称查询"
                            style={{width: 200}}
                            value={q}
                            onChange={(e) => {
                                this.setState({q: e.target.value});
                            }}
                            onSearch={(v) => {
                                this.setState({
                                    q: v, search: true, pagination: {
                                        ...pagination,
                                        current: 1
                                    }
                                }, () => {
                                    this.loadData()
                                });
                            }}/>
                        &nbsp;
                        &nbsp;
                        &nbsp;
                    </Col>

                </Row>
                <Table

                    rowSelection={this.rowSelection}

                    columns={[
                        {
                            title: '序号',
                            dataIndex: 'id',
                            className: 'txt-center',
                            width: '80px',
                            render: (col, row, i) => {
                                return <span>{(pagination.current - 1) * pagination.pageSize + (i + 1)}</span>
                            },
                        },
                        {
                            title: '图片',
                            dataIndex: 'img',
                            className: 'txt-center',
                            width: '80px',
                            render: (img, item, index) => {
                                return <img key={img} className='product-img' src={img + '@!120-120'} onClick={() => {
                                    Utils.common.showImgLightbox(imgs, index);
                                }}/>
                            }
                        },

                        {
                            title: '名称',
                            dataIndex: 'name',
                            className: 'txt-center',
                            width: '80px'
                        },

                        {
                            title: '价格',
                            dataIndex: 'price',
                            className: 'txt-center',
                            width: '80px'
                        },

                        {
                            title: '商品类型',
                            dataIndex: 'sortId',
                            className: 'txt-center',
                            width: '80px',
                            render: (sortId) => {
                                let _sort = {name: '未知商品类型'};
                                let _s = sorts.find(sort => sort.id === sortId);
                                if (_s) {

                                    return <Tag color="cyan">
                                        {_s.name}
                                    </Tag>
                                } else {
                                    return <Tag color="red">
                                        {_sort.name}
                                    </Tag>
                                }
                            }
                        },

                        {
                            title: '状态',
                            dataIndex: 'c-status',
                            className: 'txt-center',
                            width: '80px',
                            render: (obj, c) => {
                                return <div className="state">
                                    {c.status === 1 ? <span className="important">上架</span> :
                                        <span className="disabled">下架</span>}
                                </div>
                            }
                        }, {
                            title: '操作',
                            dataIndex: 'opt',
                            className: 'txt-center',
                            width: '80px',
                            render: (obj, product, index) => {

                                return <Dropdown overlay={<Menu>
                                    <Menu.Item key="1">
                                        <a onClick={() => this.edit(product)}>编辑</a>
                                    </Menu.Item>
                                    <Menu.Divider/>
                                    <Menu.Item key="2">
                                        <a onClick={() => this.remove(product.id, index)}>删除</a>
                                    </Menu.Item>
                                </Menu>} trigger={['click']}>
                                    <a className="ant-dropdown-link">操作 <Icon type="down"/>
                                    </a>
                                </Dropdown>
                            }
                        }]} rowKey={(record) => record.id} dataSource={list} loading={loading}
                    pagination={{...pagination, ...CTYPE.commonPagination}} onChange={this.handleTableChange}/>
            </Card>

        </div>
    }
}