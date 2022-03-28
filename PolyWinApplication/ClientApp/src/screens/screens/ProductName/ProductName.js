﻿import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import actions from '../../redux/actions';
import { bindActionCreators } from "redux";
import { Form, Modal, Spinner, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Confirme from '../Confirme/Confirme';
import ReactTable from '../renderData/renderData';
import toastr from 'toastr';
import { Formik } from "formik";
import * as Yup from "yup";
import UploadFiles from "../../components/FileUpload/UploadFiles";
import '../../Design/CSS/custom.css';


// validation of field
const schema = Yup.object({
    productName: Yup.string().required("برجاء إدخال وصف  المنتج").max(200, "الحد الاقصى للكتابة 200 حرف فقط"),
});



class ProductName extends Component {

    constructor(props) {

        super(props);

        let userType = JSON.parse(localStorage.getItem("UserType"));

        if (userType !== 1) {
            toastr.error("عفوا ليس لديك صلاحية لهذة الصفحة");
            this.props.history.push("/System/DashBoard");
        }

        // this is columns of Department
        this.cells = [
            {
                Header: "",
                id: "checkbox",
                accessor: "",
                Cell: (rowInfo) => {
                    return (
                        <div>
                            <Form.Check
                                checked={this.state.selected.indexOf(rowInfo.original.id) > -1}
                                onChange={() => this.toggleRow(rowInfo.original.id)} />
                            <OverlayTrigger
                                key={`topupdate-${rowInfo.original.id}`}
                                placement={'top'}
                                overlay={
                                    <Tooltip id={`tooltip-top`}>
                                        <strong>الصورة</strong>
                                    </Tooltip>
                                }>
                                <Button variant="danger" onClick={() =>
                                    this.setState({
                                        showImage: true,
                                        ImagePath: rowInfo.original.imgURL
                                    })
                                } className="EditCredit" style={{ cursor: 'pointer' }}>عرض الصورة</Button>
                            </OverlayTrigger>
                        </div>
                    );
                },
                sortable: false,
                width: 150
            },
            {
                Header: <strong> إسم المنتج </strong>,
                accessor: 'productName',
                width: 500,
                filterable: true,
            }
           
        ];

        // initial value of state

        this.state = {
            selected: [],
            isLoading: false,
            showConfirme: false,
            productName: "",
            id: 0,
            ImagePath: "",
            show: false,
            showImage: false
        }
    }

    // life cycle of react calling when any change of props
    componentWillReceiveProps(nextState, prevState) {
        if (nextState.ListDataSheets && nextState.ListDataSheets.length > 0) {

            this.setState({
                isLoading: false,
                show: false
            });
        } else {
            this.setState({
                isLoading: false,
                show: false
            });
        }
    };

    // life cycle of react calling when page is loading
    componentDidMount() {
        this.props.actions.GetAllProductName();
    }

    // this function when add new data and view modal
    showModal() {
        this.setState({
            show: true,
            productName: "",
            ImagePath: "",
            file: "",
            id: 0
        });
    }

    showDeleteModal() {
        this.setState({
            showConfirme: true
        });
    }



    // this function when close modal
    handleClose() {
        this.setState({
            show: false,
            showImage: false,
            showConfirme: false
        });
    }

    // this function when submit Delete item
    handleConfirm = () => {
        this.setState({
            showConfirme: false,
            selected: []
        });

        this.props.actions.deleteProductName(this.state.selected);
    }

    // this function when leave from page
    componentWillUnmont() {
        this.setState({
            show: false,
            isLoading: false,
            showConfirme: false
        });
    }

    toggleRow(id) {
        const isAdd = this.state.selected.indexOf(id);

        let newSelected = this.state.selected;

        if (isAdd > -1) {
            newSelected.splice(isAdd, 1);
        } else {

            newSelected.push(id);
        }

        this.setState({
            selected: newSelected
        });
    }

    editProductName = (state, rowInfo, column, instance) => {

        const { selection } = this.state;
        return {
            onClick: (e, handleOriginal) => {
                if (e.target.type !== "checkbox" && (e.target.className === "Edit" || e.target.className === "rt-td")) {

                    this.setState({
                        productName: rowInfo.original.productName,
                        id: rowInfo.original.id,
                        file: "",
                        show: true
                    });
                }
            }
        };
    };

    getfileInfo = (files) => {
        this.setState({
            file: files
        });
    }

    addEditProductName = (value) => {
        this.setState({
            isLoading: true
        });
        if (value.id > 0) {
            const body = new FormData();

            body.append('fileUpload', this.state.file);
            body.append('productName', value.productName);
            body.append('Id', value.id);

            this.props.actions.addeditProductName(body);
        } else {
            if (this.state.file !== "") {
                const body = new FormData();

                body.append('fileUpload', this.state.file);
                body.append('productName', value.productName);
                body.append('Id', value.id);

                this.props.actions.addeditProductName(body);
            } else {
                toastr.success("برجاء اختيار الصورة");
                this.setState({
                    isLoading: false
                });
            }
        }
    }

    render() {
        return (
            <div className="content-page">
                <div className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="breadcrumb-holder">
                                    <h1 className="main-title float-left">أسماء المنتجات</h1>
                                    <div className="clearfix"></div>
                                </div>
                            </div>
                        </div>
                        <div className="page-title-actions">
                            <Button size="lg" onClick={this.showModal.bind(this)}>إضافة</Button>
                            {this.state.selected.length > 0 ?
                                <Button size="lg" onClick={this.showDeleteModal.bind(this)}>حذف</Button>
                                : null}
                        </div>
                        <br />
                        <br />
                        {/* List Of Data */}
                        <ReactTable
                            getTrProps={this.editProductName}
                            data={this.props.ListProductName}
                            columns={this.cells}
                        />
                    </div>
                </div>
                <Modal show={this.state.show} onHide={this.handleClose.bind(this)}>
                    <Modal.Header closeButton>
                        إضافة أو تعديل المنتج
                    </Modal.Header>
                    <Modal.Body className="modal-header">
                        <Formik validationSchema={schema} onSubmit={(values) => { this.addEditProductName(values) }}
                            initialValues={{
                                id: this.state.id,
                                productName: this.state.productName
                            }}>
                            {({ handleSubmit, handleChange, handleBlur, values, touched, isValid, errors, }) => (
                                <Form noValidate onSubmit={handleSubmit} style={{ fontWeight: 'bold', fontSize: '25px', width: '100%' }}>
                                    <Form.Group controlId="productName">
                                        <Form.Label>الوصف</Form.Label>
                                        <Form.Control type="text"
                                            style={{ height: "50px" }}
                                            placeholder="الوصف"
                                            onChange={handleChange}
                                            aria-describedby="inputGroupPrepend"
                                            name="productName"
                                            autoComplete="off"
                                            value={values.productName}
                                            onBlur={handleBlur}
                                            isInvalid={!!errors.productName}

                                        />
                                        <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                                            {errors.productName}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <UploadFiles acceptFile="image/*" getfileInfo={this.getfileInfo} />

                                    <div style={{ direction: "ltr" }}>
                                        <Button size="lg" onClick={this.handleClose.bind(this)} style={{ marginRight: '10px' }}>
                                            غلق
                                                </Button>
                                        {this.state.isLoading ? <Button size="lg" disabled  >
                                            <Spinner
                                                as="span"
                                                animation="grow"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                                   تحميل
                                                </Button> :
                                            <Button size="lg" variant="success" type="submit">
                                                حفظ
                                                    </Button>}
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showImage} onHide={this.handleClose.bind(this)}>
                    <Modal.Body className="modal-header">
                        {this.state.ImagePath !== "" || this.state.ImagePath !== null ?
                            <img src={this.state.ImagePath} style={{ width: '100%' }} />
                            : <div>
                                <span>
                                    لا توجد صورة
                            </span>
                            </div>
                        }
                    </Modal.Body>
                </Modal>
                {this.state.showConfirme ? <Confirme text="هل تريد الحذف ?" show={this.state.showConfirme} handleClose={this.handleClose.bind(this)} handleDelete={this.handleConfirm} /> : null}
            </div>
        );
    }
}


const mapStateToProps = (state, ownProps) => ({
    ListProductName: state.reduces.ListProductName
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductName);